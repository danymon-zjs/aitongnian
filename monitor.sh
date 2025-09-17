#!/bin/bash
# monitor.sh - 系统监控脚本

echo "📊 哎童年科技官网 - 系统状态监控"
echo "=================================="

# 检查服务状态
echo ""
echo "🔍 服务状态检查:"
echo "----------------"
echo "Nginx状态:"
systemctl status nginx --no-pager | head -3

echo ""
echo "PM2状态:"
pm2 status

echo ""
echo "防火墙状态:"
systemctl status firewalld --no-pager | head -3

# 检查系统资源
echo ""
echo "💾 系统资源使用情况:"
echo "-------------------"
echo "磁盘空间:"
df -h | grep -E "(Filesystem|/dev/)"

echo ""
echo "内存使用:"
free -h

echo ""
echo "CPU负载:"
uptime

# 检查网络连接
echo ""
echo "🌐 网络连接状态:"
echo "---------------"
echo "HTTP端口 (80):"
netstat -tlnp | grep :80 || echo "❌ HTTP端口未监听"

echo ""
echo "HTTPS端口 (443):"
netstat -tlnp | grep :443 || echo "❌ HTTPS端口未监听"

# 检查SSL证书
echo ""
echo "🔒 SSL证书状态:"
echo "--------------"
if command -v certbot &> /dev/null; then
    certbot certificates 2>/dev/null || echo "❌ 无法获取SSL证书信息"
else
    echo "❌ certbot未安装"
fi

# 检查项目状态
echo ""
echo "📁 项目状态:"
echo "-----------"
PROJECT_DIR="/var/www/aitongnian"
if [ -d "$PROJECT_DIR" ]; then
    echo "✅ 项目目录存在: $PROJECT_DIR"
    echo "📦 项目大小: $(du -sh $PROJECT_DIR | cut -f1)"
    
    if [ -d "$PROJECT_DIR/dist" ]; then
        echo "✅ 构建文件存在"
        echo "📦 构建文件大小: $(du -sh $PROJECT_DIR/dist | cut -f1)"
    else
        echo "❌ 构建文件不存在"
    fi
    
    if [ -f "$PROJECT_DIR/package.json" ]; then
        echo "✅ package.json存在"
    else
        echo "❌ package.json不存在"
    fi
else
    echo "❌ 项目目录不存在: $PROJECT_DIR"
fi

# 检查日志
echo ""
echo "📝 日志信息:"
echo "-----------"
echo "Nginx错误日志 (最近5行):"
if [ -f "/var/log/nginx/error.log" ]; then
    tail -5 /var/log/nginx/error.log
else
    echo "❌ Nginx错误日志不存在"
fi

echo ""
echo "PM2应用日志 (最近5行):"
pm2 logs aitongnian --lines 5 --nostream 2>/dev/null || echo "❌ 无法获取PM2日志"

# 检查域名解析
echo ""
echo "🌍 域名解析检查:"
echo "---------------"
DOMAIN=$(grep -o 'server_name [^;]*' /etc/nginx/conf.d/aitongnian.conf 2>/dev/null | awk '{print $2}' | head -1)
if [ -n "$DOMAIN" ]; then
    echo "域名: $DOMAIN"
    echo "解析结果:"
    nslookup $DOMAIN 2>/dev/null | grep -A1 "Name:" || echo "❌ 域名解析失败"
else
    echo "❌ 无法获取域名配置"
fi

# 性能测试
echo ""
echo "⚡ 性能测试:"
echo "-----------"
if command -v curl &> /dev/null; then
    echo "HTTP响应时间:"
    curl -o /dev/null -s -w "连接时间: %{time_connect}s, 总时间: %{time_total}s\n" http://localhost/ 2>/dev/null || echo "❌ HTTP测试失败"
    
    if [ -n "$DOMAIN" ]; then
        echo "HTTPS响应时间:"
        curl -o /dev/null -s -w "连接时间: %{time_connect}s, 总时间: %{time_total}s\n" https://$DOMAIN/ 2>/dev/null || echo "❌ HTTPS测试失败"
    fi
else
    echo "❌ curl未安装"
fi

# 安全检查
echo ""
echo "🔐 安全检查:"
echo "-----------"
echo "开放端口:"
netstat -tlnp | grep LISTEN | awk '{print $4}' | sort -u

echo ""
echo "进程检查:"
ps aux | grep -E "(nginx|node|pm2)" | grep -v grep

echo ""
echo "✅ 监控完成！"
echo "=================================="
echo "💡 提示:"
echo "  - 如果发现问题，请检查相关日志文件"
echo "  - 使用 'pm2 logs aitongnian' 查看应用日志"
echo "  - 使用 'systemctl status nginx' 查看Nginx状态"
echo "  - 使用 'certbot certificates' 查看SSL证书"

