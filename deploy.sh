#!/bin/bash
# deploy.sh - 项目一键部署脚本

set -e

# 配置变量 - 请根据实际情况修改
PROJECT_NAME="aitongnian"
PROJECT_DIR="/var/www/$PROJECT_NAME"
DOMAIN="your-domain.com"  # 替换为实际域名
EMAIL="your-email@example.com"  # 替换为实际邮箱
GIT_REPO="https://github.com/your-repo/aitongnian.git"  # 替换为实际仓库地址

echo "🚀 开始部署哎童年科技官网..."

# 检查是否已设置域名和邮箱
if [ "$DOMAIN" = "your-domain.com" ] || [ "$EMAIL" = "your-email@example.com" ]; then
    echo "❌ 请先修改脚本中的域名和邮箱配置！"
    echo "编辑 deploy.sh 文件，修改以下变量："
    echo "  DOMAIN=\"your-domain.com\""
    echo "  EMAIL=\"your-email@example.com\""
    echo "  GIT_REPO=\"https://github.com/your-repo/aitongnian.git\""
    exit 1
fi

# 创建项目目录
echo "📁 创建项目目录..."
mkdir -p $PROJECT_DIR
cd $PROJECT_DIR

# 克隆或更新项目代码
echo "📥 获取项目代码..."
if [ -d ".git" ]; then
    echo "🔄 更新现有代码..."
    git pull origin main
else
    echo "📥 克隆项目代码..."
    git clone $GIT_REPO .
fi

# 安装依赖
echo "📦 安装项目依赖..."
npm install

# 构建项目（使用生产环境，自动启用JWT鉴权）
echo "🔨 构建项目（生产环境 - 使用JWT鉴权）..."
export NODE_ENV=production
export VITE_APP_ENV=production
npm run build

# 检查构建结果
if [ ! -d "dist/static" ]; then
    echo "❌ 构建失败，dist/static 目录不存在"
    exit 1
fi

echo "✅ 项目构建成功！"

# 配置Nginx
echo "⚙️ 配置Nginx..."
cat > /etc/nginx/conf.d/$PROJECT_NAME.conf << EOF
server {
    listen 80;
    server_name $DOMAIN www.$DOMAIN;
    
    root $PROJECT_DIR/dist/static;
    index index.html;
    
    # 静态文件缓存
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
        access_log off;
    }
    
    # SPA路由支持
    location / {
        try_files \$uri \$uri/ /index.html;
    }
    
    # 安全头
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    
    # Gzip压缩
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;
}
EOF

# 测试Nginx配置
echo "🧪 测试Nginx配置..."
nginx -t

# 重载Nginx
echo "🔄 重载Nginx..."
systemctl reload nginx

# 安装SSL证书 (Let's Encrypt)
echo "🔒 安装SSL证书..."
if ! certbot --nginx -d $DOMAIN -d www.$DOMAIN --non-interactive --agree-tos --email $EMAIL; then
    echo "⚠️ SSL证书安装失败，请检查域名解析和防火墙设置"
    echo "💡 可以稍后手动运行: certbot --nginx -d $DOMAIN -d www.$DOMAIN"
fi

# 设置SSL自动续期
echo "⏰ 设置SSL自动续期..."
(crontab -l 2>/dev/null; echo "0 12 * * * /usr/bin/certbot renew --quiet") | crontab -

# 创建PM2配置文件
echo "⚙️ 创建PM2配置..."
cat > $PROJECT_DIR/ecosystem.config.js << EOF
module.exports = {
  apps: [{
    name: '$PROJECT_NAME',
    script: 'npm',
    args: 'start',
    cwd: '$PROJECT_DIR',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    error_file: '/var/log/pm2/$PROJECT_NAME-error.log',
    out_file: '/var/log/pm2/$PROJECT_NAME-out.log',
    log_file: '/var/log/pm2/$PROJECT_NAME.log',
    time: true,
    max_memory_restart: '1G',
    node_args: '--max-old-space-size=1024'
  }]
}
EOF

# 启动PM2
echo "🚀 启动PM2..."
pm2 start ecosystem.config.js
pm2 save
pm2 startup

# 设置文件权限
echo "🔐 设置文件权限..."
chown -R nginx:nginx $PROJECT_DIR
chmod -R 755 $PROJECT_DIR

# 创建环境变量文件
echo "⚙️ 创建环境变量文件..."
cat > $PROJECT_DIR/.env.production << EOF
NODE_ENV=production
VITE_API_BASE_URL=https://api.coze.cn
VITE_APP_ENV=production

# Coze应用配置
VITE_NEWSPAPER_APP_ID=7547302685909827623
VITE_SPEAK_APP_ID=7548027309891518491
VITE_CAMERA_APP_ID=7548051394683715622
VITE_VOICE_APP_ID=7550649811847020585

# JWT配置
VITE_JWT_APP_ID_NEWSPAPER=1128088461414
VITE_JWT_APP_ID_SPEAK=1176390124241
VITE_JWT_APP_ID_CAMERA=1151850049216
VITE_JWT_APP_ID_VOICE=1169359718851
EOF

# 创建更新脚本
echo "📝 创建更新脚本..."
cat > $PROJECT_DIR/update.sh << 'EOF'
#!/bin/bash
set -e
echo "🔄 更新项目..."
cd /var/www/aitongnian
git pull origin main
npm install
# 使用生产环境构建（自动启用JWT鉴权）
export NODE_ENV=production
export VITE_APP_ENV=production
npm run build
pm2 restart aitongnian
nginx -s reload
echo "✅ 更新完成！"
EOF

chmod +x $PROJECT_DIR/update.sh

echo ""
echo "🎉 部署完成！"
echo "🌐 网站地址: https://$DOMAIN"
echo "📊 PM2状态: pm2 status"
echo "📝 查看日志: pm2 logs $PROJECT_NAME"
echo "🔄 更新项目: $PROJECT_DIR/update.sh"
echo ""
echo "📋 常用命令:"
echo "  pm2 status                    # 查看PM2状态"
echo "  pm2 logs $PROJECT_NAME        # 查看应用日志"
echo "  pm2 restart $PROJECT_NAME     # 重启应用"
echo "  nginx -s reload               # 重载Nginx配置"
echo "  certbot certificates          # 查看SSL证书"
echo ""

