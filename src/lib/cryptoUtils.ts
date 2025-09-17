/**
 * 加密工具类
 * 用于保护敏感信息，如私钥、令牌等
 */

// 简单的Base64编码/解码（用于非敏感数据）
export const base64Encode = (str: string): string => {
  return btoa(unescape(encodeURIComponent(str)));
};

export const base64Decode = (str: string): string => {
  return decodeURIComponent(escape(atob(str)));
};

// 简单的XOR加密（用于轻度敏感数据）
export const xorEncrypt = (text: string, key: string): string => {
  let result = '';
  for (let i = 0; i < text.length; i++) {
    result += String.fromCharCode(
      text.charCodeAt(i) ^ key.charCodeAt(i % key.length)
    );
  }
  return base64Encode(result);
};

export const xorDecrypt = (encryptedText: string, key: string): string => {
  try {
    const decoded = base64Decode(encryptedText);
    let result = '';
    for (let i = 0; i < decoded.length; i++) {
      result += String.fromCharCode(
        decoded.charCodeAt(i) ^ key.charCodeAt(i % key.length)
      );
    }
    return result;
  } catch (error) {
    console.error('解密失败:', error);
    throw new Error('解密失败');
  }
};

// 环境变量加密/解密
export const encryptEnvVar = (value: string, secretKey: string): string => {
  return xorEncrypt(value, secretKey);
};

export const decryptEnvVar = (encryptedValue: string, secretKey: string): string => {
  return xorDecrypt(encryptedValue, secretKey);
};

// 安全的随机字符串生成
export const generateSecureRandomString = (length: number = 32): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);
  
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars[array[i] % chars.length];
  }
  return result;
};

// 安全的哈希函数（用于数据完整性检查）
export const generateHash = async (data: string): Promise<string> => {
  const encoder = new TextEncoder();
  const dataBuffer = encoder.encode(data);
  const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
};

// 令牌掩码（用于日志输出）
export const maskToken = (token: string, visibleChars: number = 4): string => {
  if (token.length <= visibleChars * 2) {
    return '*'.repeat(token.length);
  }
  
  const start = token.substring(0, visibleChars);
  const end = token.substring(token.length - visibleChars);
  const middle = '*'.repeat(token.length - visibleChars * 2);
  
  return `${start}${middle}${end}`;
};

// 敏感数据清理（用于防止内存泄漏）
export const clearSensitiveData = (obj: any): void => {
  if (typeof obj === 'string') {
    // 对于字符串，用随机数据覆盖
    const randomData = generateSecureRandomString(obj.length);
    for (let i = 0; i < obj.length; i++) {
      obj = obj.substring(0, i) + randomData[i] + obj.substring(i + 1);
    }
  } else if (typeof obj === 'object' && obj !== null) {
    Object.keys(obj).forEach(key => {
      if (typeof obj[key] === 'string') {
        obj[key] = '*'.repeat(obj[key].length);
      } else if (typeof obj[key] === 'object') {
        clearSensitiveData(obj[key]);
      }
    });
  }
};

// 安全存储（使用sessionStorage，页面关闭后自动清除）
export const secureStore = {
  set: (key: string, value: string, encrypt: boolean = true): void => {
    try {
      const data = encrypt ? xorEncrypt(value, getStorageKey()) : value;
      sessionStorage.setItem(`secure_${key}`, data);
    } catch (error) {
      console.error('安全存储失败:', error);
    }
  },
  
  get: (key: string, decrypt: boolean = true): string | null => {
    try {
      const data = sessionStorage.getItem(`secure_${key}`);
      if (!data) return null;
      
      return decrypt ? xorDecrypt(data, getStorageKey()) : data;
    } catch (error) {
      console.error('安全读取失败:', error);
      return null;
    }
  },
  
  remove: (key: string): void => {
    sessionStorage.removeItem(`secure_${key}`);
  },
  
  clear: (): void => {
    const keys = Object.keys(sessionStorage);
    keys.forEach(key => {
      if (key.startsWith('secure_')) {
        sessionStorage.removeItem(key);
      }
    });
  }
};

// 获取存储密钥（基于浏览器指纹）
const getStorageKey = (): string => {
  const fingerprint = [
    navigator.userAgent,
    navigator.language,
    screen.width,
    screen.height,
    new Date().getTimezoneOffset()
  ].join('|');
  
  return generateHash(fingerprint).substring(0, 16);
};

// 输入验证和清理
export const sanitizeInput = (input: string): string => {
  return input
    .replace(/[<>]/g, '') // 移除HTML标签
    .replace(/javascript:/gi, '') // 移除JavaScript协议
    .replace(/on\w+=/gi, '') // 移除事件处理器
    .trim();
};

// 安全的URL验证
export const isValidUrl = (url: string): boolean => {
  try {
    const urlObj = new URL(url);
    return ['http:', 'https:'].includes(urlObj.protocol);
  } catch {
    return false;
  }
};

// 安全的JSON解析
export const safeJsonParse = <T>(jsonString: string, defaultValue: T): T => {
  try {
    return JSON.parse(jsonString);
  } catch (error) {
    console.warn('JSON解析失败，使用默认值:', error);
    return defaultValue;
  }
};
