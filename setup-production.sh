#!/bin/bash
set -e

echo "=========================================="
echo "  KaiAnime Production Setup & Auto-Heal   "
echo "=========================================="

APP_DIR="/home/kaianime.me/public_html"
cd "$APP_DIR"

# 1. Detect Node and NPM paths
NODE_BIN=$(which node || echo "/usr/bin/node")
NPM_BIN=$(which npm || echo "/usr/bin/npm")

echo "[1/6] Node path: $NODE_BIN"
echo "      NPM path:  $NPM_BIN"

# 2. Install dependencies & build production Next.js
echo "[2/6] Building Next.js application..."
$NPM_BIN install
$NPM_BIN run build

# 3. Clean up PM2 to prevent conflict with systemd
echo "[3/6] Cleaning up old PM2 processes..."
if which pm2 >/dev/null 2>&1; then
  pm2 delete all >/dev/null 2>&1 || true
  pm2 save >/dev/null 2>&1 || true
  pm2 unstartup systemd >/dev/null 2>&1 || true
fi

# 4. Create Native Linux systemd service
echo "[4/6] Installing Linux systemd service (/etc/systemd/system/kaianime.service)..."
cat << EOF > /etc/systemd/system/kaianime.service
[Unit]
Description=KaiAnime Production Next.js Server
After=network.target

[Service]
Type=simple
User=root
WorkingDirectory=$APP_DIR
ExecStart=$NPM_BIN start
Restart=always
RestartSec=3
StandardOutput=journal
StandardError=journal
Environment=NODE_ENV=production
Environment=PORT=3050

[Install]
WantedBy=multi-user.target
EOF

systemctl daemon-reload
systemctl enable kaianime
systemctl restart kaianime

# 5. Setup 5-minute Auto-Heal Watchdog Cron
echo "[5/6] Setting up Auto-Heal Watchdog Cron..."
CRON_CMD="curl -s -f -m 5 http://127.0.0.1:3050 >/dev/null || systemctl restart kaianime"
(crontab -l 2>/dev/null | grep -v "127.0.0.1:3050" ; echo "*/5 * * * * $CRON_CMD") | crontab -

# 6. Restart OpenLiteSpeed web server
echo "[6/6] Restarting OpenLiteSpeed..."
if [ -f /usr/local/lsws/bin/lswsctrl ]; then
  /usr/local/lsws/bin/lswsctrl restart
else
  systemctl restart lsws || true
fi

echo "=========================================="
echo "  Checking Status: "
echo "=========================================="
sleep 3
systemctl status kaianime --no-pager || true

echo ""
echo "Testing local port 3050:"
curl -I http://127.0.0.1:3050 || true

echo ""
echo "SUCCESS! KaiAnime is now permanently protected by systemd & auto-heal watchdog."
