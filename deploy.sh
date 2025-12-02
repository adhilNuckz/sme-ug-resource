#!/bin/bash

# Deployment Script for Campus Resource Platform
# Run this script on your DigitalOcean droplet

set -e

echo "🚀 Starting deployment for Campus Resource Platform..."

# Configuration
APP_NAME="campus-resource"
APP_DIR="/var/www/$APP_NAME"
DOMAIN="sme.nighttime.online"
SERVER_IP="142.93.220.168"

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Function to print colored messages
print_message() {
    echo -e "${GREEN}[✓]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[!]${NC} $1"
}

print_error() {
    echo -e "${RED}[✗]${NC} $1"
}

# Check if running as root
if [ "$EUID" -ne 0 ]; then 
    print_error "Please run as root or with sudo"
    exit 1
fi

# Step 1: Update system packages
print_message "Updating system packages..."
apt-get update
apt-get upgrade -y

# Step 2: Install Node.js (if not installed)
if ! command -v node &> /dev/null; then
    print_message "Installing Node.js 20.x..."
    curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
    apt-get install -y nodejs
else
    print_message "Node.js already installed: $(node -v)"
fi

# Step 3: Install MongoDB (if not installed)
if ! command -v mongod &> /dev/null; then
    print_message "Installing MongoDB..."
    curl -fsSL https://www.mongodb.org/static/pgp/server-7.0.asc | gpg --dearmor -o /usr/share/keyrings/mongodb-server-7.0.gpg
    echo "deb [ arch=amd64,arm64 signed-by=/usr/share/keyrings/mongodb-server-7.0.gpg ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | tee /etc/apt/sources.list.d/mongodb-org-7.0.list
    apt-get update
    apt-get install -y mongodb-org
    systemctl start mongod
    systemctl enable mongod
else
    print_message "MongoDB already installed"
fi

# Step 4: Install Nginx (if not installed)
if ! command -v nginx &> /dev/null; then
    print_message "Installing Nginx..."
    apt-get install -y nginx
    systemctl start nginx
    systemctl enable nginx
else
    print_message "Nginx already installed"
fi

# Step 5: Install PM2 globally (if not installed)
if ! command -v pm2 &> /dev/null; then
    print_message "Installing PM2..."
    npm install -g pm2
else
    print_message "PM2 already installed"
fi

# Step 6: Install Certbot for SSL (if not installed)
if ! command -v certbot &> /dev/null; then
    print_message "Installing Certbot for SSL..."
    apt-get install -y certbot python3-certbot-nginx
else
    print_message "Certbot already installed"
fi

# Step 7: Create application directory
print_message "Creating application directory..."
mkdir -p $APP_DIR
cd $APP_DIR

# Step 8: Clone or update repository
print_warning "Please upload your application files to $APP_DIR"
print_warning "You can use: scp -r /path/to/project root@$SERVER_IP:$APP_DIR"
read -p "Press Enter once files are uploaded..."

# Step 9: Install backend dependencies
print_message "Installing backend dependencies..."
cd $APP_DIR/backend
npm install --production

# Step 10: Build frontend
print_message "Building frontend..."
cd $APP_DIR/frontend
npm install
npm run build

# Step 11: Configure Nginx
print_message "Configuring Nginx..."
cat > /etc/nginx/sites-available/$APP_NAME << 'EOF'
server {
    listen 80;
    server_name sme.nighttime.online;

    # Frontend - serve built files
    root /var/www/campus-resource/frontend/dist;
    index index.html;

    # Frontend routes
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Backend API proxy
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

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/json application/xml+rss;
}
EOF

# Enable site
ln -sf /etc/nginx/sites-available/$APP_NAME /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default

# Test Nginx configuration
nginx -t

# Reload Nginx
systemctl reload nginx

print_message "Nginx configured successfully!"

# Step 12: Configure PM2
print_message "Configuring PM2 for backend..."
cd $APP_DIR/backend

# Create PM2 ecosystem file
cat > ecosystem.config.js << 'EOF'
module.exports = {
  apps: [{
    name: 'campus-resource-backend',
    script: './src/server.js',
    instances: 2,
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 5000
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_file: './logs/combined.log',
    time: true,
    max_memory_restart: '500M',
    restart_delay: 4000
  }]
};
EOF

# Create logs directory
mkdir -p logs

# Start application with PM2
pm2 start ecosystem.config.js
pm2 save
pm2 startup

print_message "Backend started with PM2!"

# Step 13: Configure firewall
print_message "Configuring firewall..."
ufw allow 22/tcp
ufw allow 80/tcp
ufw allow 443/tcp
ufw --force enable

print_message "Firewall configured!"

# Step 14: Setup SSL with Let's Encrypt
print_warning "Setting up SSL certificate..."
print_warning "Make sure your domain $DOMAIN points to $SERVER_IP"
read -p "Press Enter to continue with SSL setup..."

certbot --nginx -d $DOMAIN --non-interactive --agree-tos --email admin@$DOMAIN --redirect

print_message "SSL certificate installed!"

# Final steps
print_message "========================================="
print_message "✨ Deployment completed successfully! ✨"
print_message "========================================="
print_message ""
print_message "Your application is now running at:"
print_message "🌐 https://$DOMAIN"
print_message ""
print_message "Useful commands:"
print_message "  - View backend logs: pm2 logs campus-resource-backend"
print_message "  - Restart backend: pm2 restart campus-resource-backend"
print_message "  - Check status: pm2 status"
print_message "  - Check Nginx status: systemctl status nginx"
print_message ""
print_warning "Don't forget to:"
print_warning "1. Update backend/.env with production values"
print_warning "2. Restart backend: pm2 restart campus-resource-backend"
print_message ""
