module.exports = {
  apps: [{
    name: 'aitongnian',
    script: 'npm',
    args: 'start',
    cwd: '/var/www/aitongnian',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    error_file: '/var/log/pm2/aitongnian-error.log',
    out_file: '/var/log/pm2/aitongnian-out.log',
    log_file: '/var/log/pm2/aitongnian.log',
    time: true,
    max_memory_restart: '1G',
    node_args: '--max-old-space-size=1024',
    // 自动重启配置
    autorestart: true,
    watch: false,
    max_restarts: 10,
    min_uptime: '10s',
    // 健康检查
    health_check_grace_period: 3000,
    // 日志配置
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    merge_logs: true,
    // 环境变量
    env_production: {
      NODE_ENV: 'production',
      PORT: 3000
    }
  }]
}
