#!/bin/bash
# centos7-setup.sh - CentOS7环境准备脚本

set -e

echo "🚀 开始准备CentOS7部署环境..."

# 更新系统
echo "📦 更新系统包..."
yum update -y

# 安装基础工具
echo "🔧 安装基础工具..."
yum install -y wget curl git vim unzip

# 安装Node.js 18
echo "📦 安装Node.js 18..."
curl -fsSL https://rpm.nodesource.com/setup_18.x | bash -
yum install -y nodejs

# 验证Node.js安装
echo "✅ Node.js版本: $(node --version)"
echo "✅ npm版本: $(npm --version)"

# 安装PM2
echo "📦 安装PM2..."
npm install -g pm2

# 安装Nginx
echo "📦 安装Nginx..."
yum install -y nginx

# 启动服务
echo "🚀 启动服务..."
systemctl enable nginx
systemctl start nginx
systemctl enable firewalld
systemctl start firewalld

# 配置防火墙
echo "🔥 配置防火墙..."
firewall-cmd --permanent --add-service=http
firewall-cmd --permanent --add-service=https
firewall-cmd --reload

# 安装Let's Encrypt
echo "🔒 安装SSL证书工具..."
yum install -y certbot python3-certbot-nginx

# 创建项目目录
echo "📁 创建项目目录..."
mkdir -p /var/www
chown -R nginx:nginx /var/www

# 创建日志目录
echo "📝 创建日志目录..."
mkdir -p /var/log/pm2
chown -R nginx:nginx /var/log/pm2

echo "✅ CentOS7环境准备完成！"
echo "📋 下一步: 运行 ./deploy.sh 部署项目"

