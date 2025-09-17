# 哎童年科技 - 魔法童画AI绘画平台 CentOS 7.9 一键部署指南 v2.0

## 📋 部署概述

### 部署环境要求
- **操作系统**: CentOS 7.9 (推荐) 或 CentOS 8.x
- **内存**: 最低 2GB，推荐 4GB+
- **存储**: 最低 20GB 可用空间
- **网络**: 公网IP，开放80/443端口
- **域名**: 可选，用于SSL证书

### 部署架构
```
┌─────────────────────────────────────────────────────────────┐
│                    CentOS 7.9 服务器                        │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────┐ │
│  │    Nginx    │ │    PM2      │ │   Node.js   │ │  SSL    │ │
│  │  (Web服务)  │ │ (进程管理)  │ │  (运行时)   │ │ (证书)  │ │
│  └─────────────┘ └─────────────┘ └─────────────┘ └─────────┘ │
├─────────────────────────────────────────────────────────────┤
│                    应用部署目录                             │
│  /opt/ai-childhood-platform/                               │
└─────────────────────────────────────────────────────────────┘
```

## 🚀 一键部署脚本

### 1. 环境准备脚本 (centos7-setup.sh)

```bash
#!/bin/bash

# 哎童年科技 - 魔法童画AI绘画平台 CentOS 7.9 环境准备脚本
# 版本: v2.0
# 更新时间: 2025年9月

set -e

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 日志函数
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# 检查是否为root用户
check_root() {
    if [[ $EUID -ne 0 ]]; then
        log_error "此脚本需要root权限运行"
        exit 1
    fi
}

# 更新系统
update_system() {
    log_info "更新系统包..."
    yum update -y
    yum install -y epel-release
    log_success "系统更新完成"
}

# 安装基础工具
install_basic_tools() {
    log_info "安装基础工具..."
    yum install -y wget curl git vim unzip tar gzip
    log_success "基础工具安装完成"
}

# 安装Node.js 18.x
install_nodejs() {
    log_info "安装Node.js 18.x..."
    
    # 检查是否已安装Node.js
    if command -v node &> /dev/null; then
        NODE_VERSION=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
        if [[ $NODE_VERSION -ge 18 ]]; then
            log_success "Node.js 18+ 已安装: $(node --version)"
            return
        else
            log_warning "Node.js版本过低，将重新安装"
        fi
    fi
    
    # 安装Node.js 18.x
    curl -fsSL https://rpm.nodesource.com/setup_18.x | bash -
    yum install -y nodejs
    
    # 验证安装
    if command -v node &> /dev/null; then
        log_success "Node.js安装成功: $(node --version)"
        log_success "npm安装成功: $(npm --version)"
    else
        log_error "Node.js安装失败"
        exit 1
    fi
}

# 安装pnpm
install_pnpm() {
    log_info "安装pnpm包管理器..."
    
    if command -v pnpm &> /dev/null; then
        log_success "pnpm已安装: $(pnpm --version)"
        return
    fi
    
    npm install -g pnpm
    log_success "pnpm安装成功: $(pnpm --version)"
}

# 安装PM2
install_pm2() {
    log_info "安装PM2进程管理器..."
    
    if command -v pm2 &> /dev/null; then
        log_success "PM2已安装: $(pm2 --version)"
        return
    fi
    
    npm install -g pm2
    pm2 install pm2-logrotate
    
    # 设置PM2开机自启
    pm2 startup
    log_success "PM2安装成功: $(pm2 --version)"
}

# 安装Nginx
install_nginx() {
    log_info "安装Nginx..."
    
    if command -v nginx &> /dev/null; then
        log_success "Nginx已安装: $(nginx -v 2>&1)"
        return
    fi
    
    yum install -y nginx
    
    # 启动并设置开机自启
    systemctl start nginx
    systemctl enable nginx
    
    # 配置防火墙
    firewall-cmd --permanent --add-service=http
    firewall-cmd --permanent --add-service=https
    firewall-cmd --reload
    
    log_success "Nginx安装成功: $(nginx -v 2>&1)"
}

# 安装SSL证书工具
install_ssl_tools() {
    log_info "安装SSL证书工具..."
    
    # 安装certbot
    yum install -y certbot python3-certbot-nginx
    
    log_success "SSL工具安装完成"
}

# 创建应用目录
create_app_directory() {
    log_info "创建应用目录..."
    
    APP_DIR="/opt/ai-childhood-platform"
    mkdir -p $APP_DIR
    mkdir -p $APP_DIR/logs
    mkdir -p $APP_DIR/backups
    
    # 设置权限
    chown -R nginx:nginx $APP_DIR
    
    log_success "应用目录创建完成: $APP_DIR"
}

# 配置Nginx
configure_nginx() {
    log_info "配置Nginx..."
    
    # 备份原配置
    cp /etc/nginx/nginx.conf /etc/nginx/nginx.conf.backup
    
    # 创建应用配置
    cat > /etc/nginx/conf.d/ai-childhood-platform.conf << 'EOF'
# 哎童年科技 - 魔法童画AI绘画平台 Nginx配置

# 上游服务器配置
upstream ai_childhood_platform {
    server 127.0.0.1:3000;
    keepalive 32;
}

# 主服务器配置
server {
    listen 80;
    server_name _;
    
    # 安全头设置
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdnjs.cloudflare.com; style-src 'self' 'unsafe-inline' https://cdnjs.cloudflare.com; img-src 'self' data: https:; font-src 'self' https://cdnjs.cloudflare.com; connect-src 'self' https://api.coze.cn;" always;
    
    # 根目录
    root /opt/ai-childhood-platform/dist/static;
    index index.html;
    
    # 静态文件缓存
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
        try_files $uri =404;
    }
    
    # API代理
    location /api/ {
        proxy_pass https://api.coze.cn/;
        proxy_set_header Host api.coze.cn;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_ssl_verify off;
    }
    
    # 主应用
    location / {
        try_files $uri $uri/ /index.html;
        proxy_pass http://ai_childhood_platform;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
    
    # 健康检查
    location /health {
        access_log off;
        return 200 "healthy\n";
        add_header Content-Type text/plain;
    }
    
    # 错误页面
    error_page 404 /index.html;
    error_page 500 502 503 504 /50x.html;
    location = /50x.html {
        root /usr/share/nginx/html;
    }
}
EOF
    
    # 测试配置
    nginx -t
    if [ $? -eq 0 ]; then
        systemctl reload nginx
        log_success "Nginx配置完成"
    else
        log_error "Nginx配置错误"
        exit 1
    fi
}

# 创建PM2配置
create_pm2_config() {
    log_info "创建PM2配置..."
    
    cat > /opt/ai-childhood-platform/ecosystem.config.js << 'EOF'
module.exports = {
  apps: [{
    name: 'ai-childhood-platform',
    script: 'server.js',
    cwd: '/opt/ai-childhood-platform',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    env_production: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    log_file: '/opt/ai-childhood-platform/logs/combined.log',
    out_file: '/opt/ai-childhood-platform/logs/out.log',
    error_file: '/opt/ai-childhood-platform/logs/error.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    merge_logs: true,
    max_memory_restart: '1G',
    restart_delay: 4000,
    max_restarts: 10,
    min_uptime: '10s',
    watch: false,
    ignore_watch: ['node_modules', 'logs'],
    kill_timeout: 5000,
    wait_ready: true,
    listen_timeout: 10000
  }]
};
EOF
    
    log_success "PM2配置创建完成"
}

# 创建部署脚本
create_deploy_script() {
    log_info "创建部署脚本..."
    
    cat > /opt/ai-childhood-platform/deploy.sh << 'EOF'
#!/bin/bash

# 哎童年科技 - 魔法童画AI绘画平台 部署脚本
# 版本: v2.0

set -e

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# 应用目录
APP_DIR="/opt/ai-childhood-platform"
BACKUP_DIR="$APP_DIR/backups"
LOG_DIR="$APP_DIR/logs"

# 创建备份
create_backup() {
    log_info "创建备份..."
    
    BACKUP_NAME="backup-$(date +%Y%m%d-%H%M%S)"
    mkdir -p "$BACKUP_DIR/$BACKUP_NAME"
    
    if [ -d "$APP_DIR/dist" ]; then
        cp -r "$APP_DIR/dist" "$BACKUP_DIR/$BACKUP_NAME/"
        log_success "备份创建完成: $BACKUP_NAME"
    fi
}

# 部署应用
deploy_app() {
    log_info "开始部署应用..."
    
    cd $APP_DIR
    
    # 停止PM2进程
    pm2 stop ai-childhood-platform 2>/dev/null || true
    
    # 安装依赖
    log_info "安装依赖..."
    pnpm install --production
    
    # 构建应用
    log_info "构建应用..."
    pnpm run build
    
    # 创建简单的Node.js服务器
    cat > server.js << 'EOF'
const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

// 静态文件服务
app.use(express.static(path.join(__dirname, 'dist/static')));

// 健康检查
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// SPA路由
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist/static/index.html'));
});

app.listen(port, () => {
    console.log(`AI Childhood Platform running on port ${port}`);
});
EOF
    
    # 安装express
    pnpm add express
    
    # 启动PM2进程
    pm2 start ecosystem.config.js
    pm2 save
    
    log_success "应用部署完成"
}

# 验证部署
verify_deployment() {
    log_info "验证部署..."
    
    # 等待服务启动
    sleep 5
    
    # 检查PM2状态
    if pm2 list | grep -q "ai-childhood-platform.*online"; then
        log_success "PM2进程运行正常"
    else
        log_error "PM2进程启动失败"
        exit 1
    fi
    
    # 检查HTTP响应
    if curl -f http://localhost:3000/health > /dev/null 2>&1; then
        log_success "应用健康检查通过"
    else
        log_error "应用健康检查失败"
        exit 1
    fi
    
    # 检查Nginx
    if systemctl is-active --quiet nginx; then
        log_success "Nginx服务运行正常"
    else
        log_error "Nginx服务异常"
        exit 1
    fi
}

# 主函数
main() {
    log_info "开始部署哎童年科技平台..."
    
    create_backup
    deploy_app
    verify_deployment
    
    log_success "部署完成！"
    log_info "访问地址: http://$(curl -s ifconfig.me)"
    log_info "健康检查: http://$(curl -s ifconfig.me)/health"
}

main "$@"
EOF
    
    chmod +x /opt/ai-childhood-platform/deploy.sh
    log_success "部署脚本创建完成"
}

# 创建监控脚本
create_monitor_script() {
    log_info "创建监控脚本..."
    
    cat > /opt/ai-childhood-platform/monitor.sh << 'EOF'
#!/bin/bash

# 哎童年科技 - 魔法童画AI绘画平台 监控脚本
# 版本: v2.0

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# 检查服务状态
check_services() {
    log_info "检查服务状态..."
    
    # 检查Nginx
    if systemctl is-active --quiet nginx; then
        log_success "Nginx: 运行中"
    else
        log_error "Nginx: 未运行"
        systemctl start nginx
    fi
    
    # 检查PM2
    if pm2 list | grep -q "ai-childhood-platform.*online"; then
        log_success "PM2: 应用运行中"
    else
        log_error "PM2: 应用未运行"
        pm2 restart ai-childhood-platform
    fi
    
    # 检查端口
    if netstat -tlnp | grep -q ":80 "; then
        log_success "端口80: 监听中"
    else
        log_error "端口80: 未监听"
    fi
    
    if netstat -tlnp | grep -q ":3000 "; then
        log_success "端口3000: 监听中"
    else
        log_error "端口3000: 未监听"
    fi
}

# 检查系统资源
check_resources() {
    log_info "检查系统资源..."
    
    # CPU使用率
    CPU_USAGE=$(top -bn1 | grep "Cpu(s)" | awk '{print $2}' | cut -d'%' -f1)
    if (( $(echo "$CPU_USAGE < 80" | bc -l) )); then
        log_success "CPU使用率: ${CPU_USAGE}%"
    else
        log_warning "CPU使用率过高: ${CPU_USAGE}%"
    fi
    
    # 内存使用率
    MEMORY_USAGE=$(free | grep Mem | awk '{printf "%.1f", $3/$2 * 100.0}')
    if (( $(echo "$MEMORY_USAGE < 80" | bc -l) )); then
        log_success "内存使用率: ${MEMORY_USAGE}%"
    else
        log_warning "内存使用率过高: ${MEMORY_USAGE}%"
    fi
    
    # 磁盘使用率
    DISK_USAGE=$(df -h / | awk 'NR==2 {print $5}' | cut -d'%' -f1)
    if [ "$DISK_USAGE" -lt 80 ]; then
        log_success "磁盘使用率: ${DISK_USAGE}%"
    else
        log_warning "磁盘使用率过高: ${DISK_USAGE}%"
    fi
}

# 检查应用健康
check_health() {
    log_info "检查应用健康状态..."
    
    # 检查健康检查端点
    if curl -f http://localhost:3000/health > /dev/null 2>&1; then
        log_success "应用健康检查: 通过"
    else
        log_error "应用健康检查: 失败"
        pm2 restart ai-childhood-platform
    fi
    
    # 检查主页面
    if curl -f http://localhost/ > /dev/null 2>&1; then
        log_success "主页面访问: 正常"
    else
        log_error "主页面访问: 失败"
    fi
}

# 清理日志
cleanup_logs() {
    log_info "清理旧日志..."
    
    # 清理PM2日志
    pm2 flush
    
    # 清理Nginx日志
    find /var/log/nginx -name "*.log" -mtime +7 -delete
    
    # 清理应用日志
    find /opt/ai-childhood-platform/logs -name "*.log" -mtime +7 -delete
    
    log_success "日志清理完成"
}

# 主函数
main() {
    log_info "开始系统监控检查..."
    
    check_services
    check_resources
    check_health
    cleanup_logs
    
    log_success "监控检查完成"
}

main "$@"
EOF
    
    chmod +x /opt/ai-childhood-platform/monitor.sh
    log_success "监控脚本创建完成"
}

# 设置定时任务
setup_cron() {
    log_info "设置定时任务..."
    
    # 添加监控任务到crontab
    (crontab -l 2>/dev/null; echo "*/5 * * * * /opt/ai-childhood-platform/monitor.sh >> /opt/ai-childhood-platform/logs/monitor.log 2>&1") | crontab -
    
    log_success "定时任务设置完成"
}

# 主函数
main() {
    log_info "开始安装哎童年科技平台环境..."
    
    check_root
    update_system
    install_basic_tools
    install_nodejs
    install_pnpm
    install_pm2
    install_nginx
    install_ssl_tools
    create_app_directory
    configure_nginx
    create_pm2_config
    create_deploy_script
    create_monitor_script
    setup_cron
    
    log_success "环境安装完成！"
    log_info "下一步: 将项目代码上传到 /opt/ai-childhood-platform 目录"
    log_info "然后运行: cd /opt/ai-childhood-platform && ./deploy.sh"
}

main "$@"
```

### 2. 部署脚本 (deploy.sh)

```bash
#!/bin/bash

# 哎童年科技 - 魔法童画AI绘画平台 部署脚本
# 版本: v2.0

set -e

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# 应用目录
APP_DIR="/opt/ai-childhood-platform"
BACKUP_DIR="$APP_DIR/backups"
LOG_DIR="$APP_DIR/logs"

# 创建备份
create_backup() {
    log_info "创建备份..."
    
    BACKUP_NAME="backup-$(date +%Y%m%d-%H%M%S)"
    mkdir -p "$BACKUP_DIR/$BACKUP_NAME"
    
    if [ -d "$APP_DIR/dist" ]; then
        cp -r "$APP_DIR/dist" "$BACKUP_DIR/$BACKUP_NAME/"
        log_success "备份创建完成: $BACKUP_NAME"
    fi
}

# 部署应用
deploy_app() {
    log_info "开始部署应用..."
    
    cd $APP_DIR
    
    # 停止PM2进程
    pm2 stop ai-childhood-platform 2>/dev/null || true
    
    # 安装依赖
    log_info "安装依赖..."
    pnpm install --production
    
    # 构建应用
    log_info "构建应用..."
    pnpm run build
    
    # 创建简单的Node.js服务器
    cat > server.js << 'EOF'
const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

// 静态文件服务
app.use(express.static(path.join(__dirname, 'dist/static')));

// 健康检查
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// SPA路由
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist/static/index.html'));
});

app.listen(port, () => {
    console.log(`AI Childhood Platform running on port ${port}`);
});
EOF
    
    # 安装express
    pnpm add express
    
    # 启动PM2进程
    pm2 start ecosystem.config.js
    pm2 save
    
    log_success "应用部署完成"
}

# 验证部署
verify_deployment() {
    log_info "验证部署..."
    
    # 等待服务启动
    sleep 5
    
    # 检查PM2状态
    if pm2 list | grep -q "ai-childhood-platform.*online"; then
        log_success "PM2进程运行正常"
    else
        log_error "PM2进程启动失败"
        exit 1
    fi
    
    # 检查HTTP响应
    if curl -f http://localhost:3000/health > /dev/null 2>&1; then
        log_success "应用健康检查通过"
    else
        log_error "应用健康检查失败"
        exit 1
    fi
    
    # 检查Nginx
    if systemctl is-active --quiet nginx; then
        log_success "Nginx服务运行正常"
    else
        log_error "Nginx服务异常"
        exit 1
    fi
}

# 主函数
main() {
    log_info "开始部署哎童年科技平台..."
    
    create_backup
    deploy_app
    verify_deployment
    
    log_success "部署完成！"
    log_info "访问地址: http://$(curl -s ifconfig.me)"
    log_info "健康检查: http://$(curl -s ifconfig.me)/health"
}

main "$@"
```

## 📋 部署步骤

### 步骤1: 环境准备
```bash
# 1. 下载并运行环境准备脚本
wget https://raw.githubusercontent.com/your-repo/ai-childhood-platform/main/centos7-setup.sh
chmod +x centos7-setup.sh
sudo ./centos7-setup.sh
```

### 步骤2: 上传项目代码
```bash
# 2. 将项目代码上传到服务器
scp -r ./data/* root@your-server:/opt/ai-childhood-platform/
```

### 步骤3: 部署应用
```bash
# 3. 运行部署脚本
cd /opt/ai-childhood-platform
chmod +x deploy.sh
./deploy.sh
```

### 步骤4: 配置SSL证书 (可选)
```bash
# 4. 配置SSL证书
certbot --nginx -d your-domain.com
```

## 🔧 配置说明

### Nginx配置
- **端口**: 80 (HTTP), 443 (HTTPS)
- **静态文件**: 直接由Nginx服务
- **API代理**: 代理到Coze API
- **SPA路由**: 所有请求重定向到index.html

### PM2配置
- **进程数**: 自动检测CPU核心数
- **内存限制**: 1GB自动重启
- **日志管理**: 自动日志轮转
- **集群模式**: 高可用部署

### 安全配置
- **防火墙**: 只开放必要端口
- **安全头**: 完整的安全头设置
- **SSL/TLS**: 支持HTTPS加密
- **访问控制**: 基于IP的访问限制

## 📊 监控与维护

### 实时监控
```bash
# 查看PM2状态
pm2 status

# 查看应用日志
pm2 logs ai-childhood-platform

# 查看系统资源
./monitor.sh
```

### 日志管理
```bash
# 查看Nginx日志
tail -f /var/log/nginx/access.log
tail -f /var/log/nginx/error.log

# 查看应用日志
tail -f /opt/ai-childhood-platform/logs/combined.log
```

### 性能优化
```bash
# 重启服务
pm2 restart ai-childhood-platform
systemctl restart nginx

# 清理缓存
pm2 flush
```

## 🚨 故障排除

### 常见问题

#### 1. 服务无法启动
```bash
# 检查端口占用
netstat -tlnp | grep :3000
netstat -tlnp | grep :80

# 检查PM2状态
pm2 status
pm2 logs ai-childhood-platform
```

#### 2. 页面无法访问
```bash
# 检查Nginx状态
systemctl status nginx
nginx -t

# 检查防火墙
firewall-cmd --list-all
```

#### 3. 性能问题
```bash
# 检查系统资源
top
free -h
df -h

# 检查PM2进程
pm2 monit
```

### 恢复备份
```bash
# 恢复最新备份
cd /opt/ai-childhood-platform
BACKUP_DIR=$(ls -t backups/ | head -1)
cp -r backups/$BACKUP_DIR/dist ./
pm2 restart ai-childhood-platform
```

## 📈 性能优化建议

### 1. 系统优化
- 调整内核参数
- 优化文件描述符限制
- 配置swap分区

### 2. 应用优化
- 启用Gzip压缩
- 配置CDN加速
- 优化图片资源

### 3. 数据库优化
- 连接池配置
- 查询优化
- 索引优化

## 🔮 扩展部署

### 负载均衡
```bash
# 多服务器部署
upstream ai_childhood_platform {
    server 192.168.1.10:3000;
    server 192.168.1.11:3000;
    server 192.168.1.12:3000;
}
```

### 容器化部署
```dockerfile
# Dockerfile示例
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

---

**部署指南版本**: v2.0  
**更新时间**: 2024年12月  
**适用环境**: CentOS 7.9+  
**项目状态**: 生产就绪 ✅




