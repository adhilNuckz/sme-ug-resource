# Quick Deployment Commands

## From Your Local Machine

```powershell
# 1. Create production environment files
# Create backend/.env with your MongoDB URI and secrets

# 2. Upload files to server
scp deploy.sh root@142.93.220.168:/root/
scp -r backend root@142.93.220.168:/var/www/campus-resource/
scp -r frontend root@142.93.220.168:/var/www/campus-resource/

# 3. Connect to server
ssh root@142.93.220.168
```

## On the Server

```bash
# Make deploy script executable
chmod +x /root/deploy.sh

# Run deployment
./root/deploy.sh

# Or manual quick setup:
cd /var/www/campus-resource/backend
npm install --production
pm2 start ecosystem.config.js
pm2 save

cd /var/www/campus-resource/frontend  
npm install
npm run build
```

## Important Files to Create

### backend/.env
```env
NODE_ENV=production
PORT=5000
FRONTEND_URL=https://sme.nighttime.online
CORS_ORIGIN=https://sme.nighttime.online
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority
JWT_ACCESS_SECRET=your_32_char_random_string_here
JWT_REFRESH_SECRET=another_32_char_random_string
JWT_ACCESS_EXPIRY=15m
JWT_REFRESH_EXPIRY=7d
```

### frontend/.env.production
```env
VITE_API_URL=https://sme.nighttime.online/api
```

## Test Your Deployment

1. Visit: https://sme.nighttime.online
2. Try logging in
3. Check PM2 status: `pm2 status`
4. Check logs: `pm2 logs campus-resource-backend`

## Common Issues

### Port 5000 already in use:
```bash
lsof -ti:5000 | xargs kill -9
pm2 restart campus-resource-backend
```

### MongoDB connection failed:
- Check MONGODB_URI in backend/.env
- Test connection: `mongosh "your_connection_string"`

### Frontend shows blank page:
```bash
cd /var/www/campus-resource/frontend
npm run build
systemctl reload nginx
```

### SSL certificate issues:
```bash
certbot certificates
certbot renew --force-renewal
```

## Monitoring

```bash
# Real-time logs
pm2 logs campus-resource-backend --lines 100

# Status
pm2 status

# Restart
pm2 restart campus-resource-backend

# System resources
htop
```
