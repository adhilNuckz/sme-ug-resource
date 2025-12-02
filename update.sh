#!/bin/bash

# Quick Update Script - Run on server to update application
# Usage: ./update.sh

set -e

APP_DIR="/var/www/campus-resource"
GREEN='\033[0;32m'
NC='\033[0m'

echo -e "${GREEN}🔄 Updating Campus Resource Platform...${NC}"

cd $APP_DIR

# Update backend
echo -e "${GREEN}📦 Updating backend...${NC}"
cd $APP_DIR/backend
npm install --production

# Update frontend
echo -e "${GREEN}🎨 Building frontend...${NC}"
cd $APP_DIR/frontend
npm install
npm run build

# Restart backend
echo -e "${GREEN}🔄 Restarting backend...${NC}"
pm2 restart campus-resource-backend

# Reload Nginx
echo -e "${GREEN}🔄 Reloading Nginx...${NC}"
systemctl reload nginx

echo -e "${GREEN}✨ Update completed!${NC}"
pm2 status
