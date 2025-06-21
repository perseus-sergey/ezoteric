#!/bin/bash
set -e

export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
[ -f ".nvmrc" ] && nvm use

echo "Deployment for ezoteric.net started..."

git reset --hard
git fetch origin
git reset --hard origin/main
echo "New changes copied to server!"

echo "Installing Dependencies..."
pnpm install

echo "Running Database Migrations..."
pnpm d:migrate

echo "Creating Production Build..."
pnpm build

echo "Building cron scripts..."
pnpm build:scripts # А це збірка для наших cron-скриптів

echo "Restarting PM2 process for ezoteric.net..."
# Перезапускаємо тільки конкретний процес за його іменем
pm2 reload ezoteric.net 

# pm2 save не обов'язковий при кожному деплої, але не зашкодить
pm2 save

echo "Deployment Finished!"