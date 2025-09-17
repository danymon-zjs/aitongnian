/**
 * 安全头配置
 * 用于配置HTTP安全头，提供全面的安全防护
 */

import { getSecureSecurityConfig } from './secureConfig';

// 安全头配置接口
interface SecurityHeaders {
  'X-Frame-Options': string;
  'X-Content-Type-Options': string;
  'X-XSS-Protection': string;
  'Referrer-Policy': string;
  'Strict-Transport-Security'?: string;
  'Content-Security-Policy'?: string;
  'Permissions-Policy'?: string;
  'Cross-Origin-Embedder-Policy'?: string;
  'Cross-Origin-Opener-Policy'?: string;
  'Cross-Origin-Resource-Policy'?: string;
}

/**
 * 获取安全头配置
 */
export const getSecurityHeaders = (): SecurityHeaders => {
  const securityConfig = getSecureSecurityConfig();
  
  const headers: SecurityHeaders = {
    // 防止点击劫持攻击
    'X-Frame-Options': 'DENY',
    
    // 防止MIME类型嗅探攻击
    'X-Content-Type-Options': 'nosniff',
    
    // XSS保护
    'X-XSS-Protection': '1; mode=block',
    
    // 引用策略
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    
    // 权限策略
    'Permissions-Policy': [
      'camera=()',
      'microphone=()',
      'geolocation=()',
      'payment=()',
      'usb=()',
      'magnetometer=()',
      'gyroscope=()',
      'accelerometer=()'
    ].join(', '),
    
    // 跨域嵌入策略
    'Cross-Origin-Embedder-Policy': 'require-corp',
    
    // 跨域打开策略
    'Cross-Origin-Opener-Policy': 'same-origin',
    
    // 跨域资源策略
    'Cross-Origin-Resource-Policy': 'same-origin'
  };

  // 根据配置添加可选的安全头
  if (securityConfig.enableHSTS) {
    headers['Strict-Transport-Security'] = 'max-age=31536000; includeSubDomains; preload';
  }

  if (securityConfig.enableCSP) {
    headers['Content-Security-Policy'] = getCSPHeader();
  }

  return headers;
};

/**
 * 获取内容安全策略头
 */
const getCSPHeader = (): string => {
  const directives = [
    // 默认策略
    "default-src 'self'",
    
    // 脚本策略
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://lf-cdn.coze.cn https://cdn.jsdelivr.net",
    
    // 样式策略
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    
    // 字体策略
    "font-src 'self' https://fonts.gstatic.com",
    
    // 图片策略
    "img-src 'self' data: https: blob:",
    
    // 媒体策略
    "media-src 'self' https: blob:",
    
    // 连接策略
    "connect-src 'self' https://api.coze.cn https://lf-cdn.coze.cn wss:",
    
    // 框架策略
    "frame-src 'self' https://lf-cdn.coze.cn",
    
    // 对象策略
    "object-src 'none'",
    
    // 基础URI策略
    "base-uri 'self'",
    
    // 表单操作策略
    "form-action 'self'",
    
    // 框架祖先策略
    "frame-ancestors 'none'",
    
    // 升级不安全请求
    "upgrade-insecure-requests",
    
    // 阻止混合内容
    "block-all-mixed-content"
  ];

  return directives.join('; ');
};

/**
 * 获取开发环境的安全头（更宽松的CSP）
 */
export const getDevelopmentSecurityHeaders = (): SecurityHeaders => {
  const headers = getSecurityHeaders();
  
  // 开发环境使用更宽松的CSP
  headers['Content-Security-Policy'] = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://lf-cdn.coze.cn https://cdn.jsdelivr.net",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
    "img-src 'self' data: https: blob:",
    "media-src 'self' https: blob:",
    "connect-src 'self' https://api.coze.cn https://lf-cdn.coze.cn wss: ws:",
    "frame-src 'self' https://lf-cdn.coze.cn",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'"
  ].join('; ');

  return headers;
};

/**
 * 应用安全头到响应
 */
export const applySecurityHeaders = (response: Response): Response => {
  const headers = process.env.NODE_ENV === 'development' 
    ? getDevelopmentSecurityHeaders() 
    : getSecurityHeaders();

  // 添加安全头到响应
  Object.entries(headers).forEach(([key, value]) => {
    if (value) {
      response.headers.set(key, value);
    }
  });

  return response;
};

/**
 * 验证安全头配置
 */
export const validateSecurityHeaders = (): boolean => {
  try {
    const headers = getSecurityHeaders();
    
    // 检查必需的安全头
    const requiredHeaders = [
      'X-Frame-Options',
      'X-Content-Type-Options',
      'X-XSS-Protection',
      'Referrer-Policy'
    ];

    for (const header of requiredHeaders) {
      if (!headers[header as keyof SecurityHeaders]) {
        console.error(`缺少必需的安全头: ${header}`);
        return false;
      }
    }

    return true;
  } catch (error) {
    console.error('安全头验证失败:', error);
    return false;
  }
};

/**
 * 获取安全头摘要（用于日志记录）
 */
export const getSecurityHeadersSummary = () => {
  try {
    const headers = getSecurityHeaders();
    return {
      enabled: Object.keys(headers).length,
      headers: Object.keys(headers).reduce((acc, key) => {
        acc[key] = headers[key as keyof SecurityHeaders] ? 'enabled' : 'disabled';
        return acc;
      }, {} as Record<string, string>)
    };
  } catch (error) {
    return { error: '无法获取安全头摘要' };
  }
};

/**
 * 安全头中间件（用于Express等服务器）
 */
export const securityHeadersMiddleware = (req: any, res: any, next: any) => {
  const headers = process.env.NODE_ENV === 'development' 
    ? getDevelopmentSecurityHeaders() 
    : getSecurityHeaders();

  // 设置安全头
  Object.entries(headers).forEach(([key, value]) => {
    if (value) {
      res.setHeader(key, value);
    }
  });

  next();
};

/**
 * 检查请求是否安全
 */
export const isSecureRequest = (req: any): boolean => {
  // 检查HTTPS
  if (req.protocol !== 'https' && process.env.NODE_ENV === 'production') {
    return false;
  }

  // 检查Host头
  const host = req.get('host');
  if (!host || host.includes('localhost') || host.includes('127.0.0.1')) {
    return process.env.NODE_ENV === 'development';
  }

  return true;
};

/**
 * 安全重定向（HTTP到HTTPS）
 */
export const secureRedirect = (req: any, res: any) => {
  if (req.protocol !== 'https' && process.env.NODE_ENV === 'production') {
    const secureUrl = `https://${req.get('host')}${req.url}`;
    res.redirect(301, secureUrl);
    return true;
  }
  return false;
};
