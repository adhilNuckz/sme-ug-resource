# Campus Resource Platform - Deployment Guide
# DigitalOcean Droplet Deployment

## Server Details
- **IP Address**: 142.93.220.168
- **Domain**: sme.nighttime.online
- **Application Path**: /var/www/campus-resource

## Prerequisites Checklist
Before deployment, ensure:
- [ ] Domain DNS points to 142.93.220.168
- [ ] MongoDB connection string ready
- [ ] SSH access to droplet configured

---

## Quick Deployment Steps

### 1. Prepare Your Local Files

Create production environment files:

**Backend** (`backend/.env`):
```env
NODE_ENV=production
PORT=5000
FRONTEND_URL=https://sme.nighttime.online
CORS_ORIGIN=https://sme.nighttime.online
MONGODB_URI=your_mongodb_atlas_connection_string
JWT_ACCESS_SECRET=your_secure_random_string_min_32_chars
JWT_REFRESH_SECRET=another_secure_random_string_min_32_chars
JWT_ACCESS_EXPIRY=15m
JWT_REFRESH_EXPIRY=7d
```

**Frontend** (`frontend/.env.production`):
```env
VITE_API_URL=https://sme.nighttime.online/api
```

### 2. Connect to Your Droplet

```bash
ssh root@142.93.220.168
```

### 3. Upload Deployment Script

From your local machine:
```bash
scp deploy.sh root@142.93.220.168:/root/
```

### 4. Upload Application Files

```bash
# Create directory on server first
ssh root@142.93.220.168 "mkdir -p /var/www/campus-resource"

# Upload entire project
scp -r ./backend root@142.93.220.168:/var/www/campus-resource/
scp -r ./frontend root@142.93.220.168:/var/www/campus-resource/
```

### 5. Run Deployment Script

On the droplet:
```bash
chmod +x /root/deploy.sh
./root/deploy.sh
```

The script will:
- ✅ Install Node.js 20.x
- ✅ Install MongoDB
- ✅ Install Nginx
- ✅ Install PM2
- ✅ Install Certbot for SSL
- ✅ Configure Nginx reverse proxy
- ✅ Build frontend
- ✅ Start backend with PM2
- ✅ Setup SSL certificate
- ✅ Configure firewall

---

## Manual Deployment (Alternative)

If you prefer manual steps:

### Step 1: Connect to Droplet
```bash
ssh root@142.93.220.168
```

### Step 2: Install Dependencies
```bash
# Update system
apt update && apt upgrade -y

# Install Node.js 20.x
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs

# Install MongoDB
curl -fsSL https://www.mongodb.org/static/pgp/server-7.0.asc | gpg --dearmor -o /usr/share/keyrings/mongodb-server-7.0.gpg
echo "deb [ arch=amd64,arm64 signed-by=/usr/share/keyrings/mongodb-server-7.0.gpg ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | tee /etc/apt/sources.list.d/mongodb-org-7.0.list
apt update
apt install -y mongodb-org
systemctl start mongod
systemctl enable mongod

# Install Nginx
apt install -y nginx
systemctl start nginx
systemctl enable nginx

# Install PM2
npm install -g pm2

# Install Certbot
apt install -y certbot python3-certbot-nginx
```

### Step 3: Upload Application
```bash
# On local machine
scp -r ./backend root@142.93.220.168:/var/www/campus-resource/
scp -r ./frontend root@142.93.220.168:/var/www/campus-resource/
```

### Step 4: Configure Backend
```bash
# On droplet
cd /var/www/campus-resource/backend

# Create .env file (IMPORTANT!)
nano .env
```

Paste your production environment variables:
```env
NODE_ENV=production
PORT=5000
FRONTEND_URL=https://sme.nighttime.online
CORS_ORIGIN=https://sme.nighttime.online
MONGODB_URI=your_mongodb_connection_string
JWT_ACCESS_SECRET=your_secret_here
JWT_REFRESH_SECRET=your_secret_here
JWT_ACCESS_EXPIRY=15m
JWT_REFRESH_EXPIRY=7d
```

```bash
# Install dependencies
npm install --production

# Test backend
node src/server.js
# Press Ctrl+C if it starts successfully
```

### Step 5: Build Frontend
```bash
cd /var/www/campus-resource/frontend

# Create production env
echo "VITE_API_URL=https://sme.nighttime.online/api" > .env.production

# Install and build
npm install
npm run build
```

### Step 6: Configure Nginx
```bash
nano /etc/nginx/sites-available/campus-resource
```

Paste this configuration:
```nginx
server {
    listen 80;
    server_name sme.nighttime.online;

    # Frontend
    root /var/www/campus-resource/frontend/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/json;
}
```

```bash
# Enable site
ln -s /etc/nginx/sites-available/campus-resource /etc/nginx/sites-enabled/
rm /etc/nginx/sites-enabled/default

# Test and reload
nginx -t
systemctl reload nginx
```

### Step 7: Start Backend with PM2
```bash
cd /var/www/campus-resource/backend

# Create PM2 config
nano ecosystem.config.js
```

Paste:
```javascript
module.exports = {
  apps: [{
    name: 'campus-resource-backend',
    script: './src/server.js',
    instances: 2,
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production'
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    max_memory_restart: '500M'
  }]
};
```

```bash
# Create logs directory
mkdir -p logs

# Start with PM2
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

### Step 8: Configure Firewall
```bash
ufw allow 22/tcp
ufw allow 80/tcp
ufw allow 443/tcp
ufw enable
```

### Step 9: Setup SSL
```bash
certbot --nginx -d sme.nighttime.online
```

---

## Verification

### Check if everything is running:

```bash
# Backend status
pm2 status
pm2 logs campus-resource-backend

# Nginx status
systemctl status nginx

# MongoDB status
systemctl status mongod

# Check ports
netstat -tlnp | grep :5000  # Backend
netstat -tlnp | grep :80    # Nginx HTTP
netstat -tlnp | grep :443   # Nginx HTTPS
```

### Test in browser:
- Frontend: https://sme.nighttime.online
- API: https://sme.nighttime.online/api/health (if you have a health endpoint)

---

## Post-Deployment

### Create Admin User

```bash
# SSH to server
ssh root@142.93.220.168

# Connect to MongoDB
mongosh

# Switch to your database
use campus_resource

# Create admin user
db.users.insertOne({
  name: "Admin User",
  email: "admin@nighttime.online",
  password: "$2a$10$encrypted_password_hash_here",
  role: "admin",
  department: "Administration",
  yearOfStudy: 1,
  isActive: true,
  createdAt: new Date(),
  updatedAt: new Date()
})
```

Or register through the UI and manually update the role in MongoDB.

---

## Updating Application

### Quick Update Script:

```bash
# On droplet
cd /var/www/campus-resource

# Pull latest changes (if using git)
git pull origin main

# Update backend
cd backend
npm install --production
pm2 restart campus-resource-backend

# Update frontend
cd ../frontend
npm install
npm run build

# Clear Nginx cache
systemctl reload nginx
```

---

## Monitoring & Logs

```bash
# Backend logs
pm2 logs campus-resource-backend

# Nginx access logs
tail -f /var/log/nginx/access.log

# Nginx error logs
tail -f /var/log/nginx/error.log

# MongoDB logs
tail -f /var/log/mongodb/mongod.log

# PM2 monitoring
pm2 monit
```

---

## Troubleshooting

### Backend not starting:
```bash
# Check logs
pm2 logs campus-resource-backend --lines 100

# Check .env file exists
ls -la /var/www/campus-resource/backend/.env

# Test manually
cd /var/www/campus-resource/backend
node src/server.js
```

### Frontend not loading:
```bash
# Check build files exist
ls -la /var/www/campus-resource/frontend/dist

# Check Nginx config
nginx -t

# Check Nginx logs
tail -f /var/log/nginx/error.log
```

### SSL issues:
```bash
# Renew certificate
certbot renew --dry-run

# Check certificate status
certbot certificates
```

### Database connection issues:
```bash
# Check MongoDB is running
systemctl status mongod

# Test connection
mongosh your_connection_string
```

---

## Security Recommendations

1. **Change default passwords**
2. **Setup fail2ban**:
   ```bash
   apt install fail2ban
   systemctl enable fail2ban
   ```

3. **Setup automatic updates**:
   ```bash
   apt install unattended-upgrades
   dpkg-reconfigure -plow unattended-upgrades
   ```

4. **Regular backups**:
   ```bash
   # MongoDB backup
   mongodump --uri="your_connection_string" --out=/backups/$(date +%Y%m%d)
   ```

5. **Monitor disk space**:
   ```bash
   df -h
   ```

---

## Support

For issues during deployment:
- Check logs: `pm2 logs`
- Check status: `pm2 status`
- Restart: `pm2 restart campus-resource-backend`
- Full restart: `pm2 restart all`

Application URL: **https://sme.nighttime.online**
