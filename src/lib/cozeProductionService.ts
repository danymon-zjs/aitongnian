/**
 * Coze生产环境集成服务
 * 基于Node.js测试验证的配置，提供生产环境可用的Coze API调用功能
 */

import { toast } from '@/components/Toast';

// 生产环境配置
const PRODUCTION_CONFIG = {
  baseURL: 'https://api.coze.cn',
  aud: 'api.coze.cn'
};

// 经过Node.js测试验证的OAuth JWT配置
const OAUTH_JWT_CONFIG = {
  newspaper: {
    appId: '1128088461414',
    keyId: 'y-XendbREzonHcoxrxZSzsOtZbhebQZdJ99VL8SXzd0',
    privateKey: `-----BEGIN PRIVATE KEY-----
MIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQCHmC8pF0WKVwBo
ZWjkMcQmyX2iC9v0WvE55vC5/6GZ0zN5t6+QRzm9TcSOr5FGE7PA/fTVE+e8qeHG
7OTsgoM0cfDqg795wGeL4g6vdTIna4xn/sRLeDNwFfADcjlFHkSyOAr/iGSlmqH3
LV2sBWsJSmjREno3+dcFPps2hP2bmw+LYl5r9lmcT2ZO1GBfByNR9Cusn+GduCjD
3UR87oXbKHNLzby0fNqbkohJXLjaeZgmdgDhgTV+awPO/D+2l1H0Qez5iNiHNXzZ
IwgOY5rcyfmN73/X1SSB+j8qQ3ZSdId4Pjx9dJzCazCGYdbX04hzyDChA47PvF1b
emjYuQI7AgMBAAECggEAEiM+x7nXsQIjSVOrXL71dJTGS+tXMFAL7YlhURgLR1bT
j2gNQXjtlc91x/pfLecLx/iQjAIeIQP+cgwVMTfiEh1dsxkNf11H3JPQEBNWsqQ1
w2F2Y3wAMXGVyfg5BfBfExHhEr5tbCOLn9M/MPgGkdcUv0a/94Xhh8+QlpHilLJO
4TlrYOIR6rlbLvYCS5V3va+ntuUPiIyWh8LGXm+BpLgKY5MlaTrOGYslHiZAtgN5
svYLwVJtOuRxvE4WNkJrHVNG1dyd4EQCKqsENxwoTMG5XxzaBlh8xDvCWmn4DXO1
nXntQVZUAsV2ilPr9/wZsMorYyxjrA/zJ2AEnSl9EQKBgQC6+uae62uC0e5W6U3d
Gqv0XVvFKGzLQoua+C5sW8xukYvh2AH9En53hkBcXv+ecUMkOE6RYgVul+NJd6MY
rkSo2ZrF+eiz5kg8i8pff4pST8rgNqWhNpkt7KVj+YCqG03xzN5iYyml/BwxxvVX
Mn3TqCImE5vkghCtyS0ypt3KEQKBgQC5pXxMxd6ca+6Ayyhbl+GMGwc9Zf8f1DpK
iHcqrXPpsk9tgE7WTBboPAzmRkfvjJXogb+wWFUzEf4NDH5xaikf0WrUrIDU3dh9
kByMoxqnpluXwvM5G1Aq82e7mnaJl9w/sW7Au6V+rZ51nvPEwVoniJ6LtACDb9Vh
TOmW0bSbiwKBgQCsZHgNPfE6BGRDLYfku5qfCxR5ivQD067ziq8CqQCrUPYvnAD5
W/vOJ7FfeRck9jh5RJDr6fwoI1IjgnKVZtdW9oqEzg2HEGK5sAk+U1Es4vSiFMBR
Cw3gEbfLnVbLf7E1pzXCcLsNloxIOLArXRo182bIxHuPC3xlPn61nLQQgQKBgQCt
8RT25gq/Kw2sFS36K+ODn6t35sJVM0duoFBvZ1eM5qovIiI7/c0UyXcYp08tbt7i
m/dcJlel4zzTQxqR73Mawd/D5uFLEZWPiGCHkScfX+q/1kSIBERoCenuyDo6j1Qp
RXlNEkRs3gXzlPw4JSXwlrxej0hP3o/ie+r9if0cIwKBgFVKNyt90Or8WscUEoZj
kcL2Z4+CjqlofOfb5P+TVQttAr7VQy4JRnDUGCV+4yj0xoGDgzrxJVmN79lI8run
++6fD8LwMVSOYmSIYHgK0ZXFtMYHicsrmem4BtPLr8qVQa+w3EEwpFGK5E96YLzH
mXbDlKkgoQKcWqjJE8hn7cpO
-----END PRIVATE KEY-----`
  },
  speak: {
    appId: '1176390124241',
    keyId: '8NBR1mNrdT6vdFa5PWkUy04tpbCfn7dSwUK7ngZE_s4',
    privateKey: `-----BEGIN PRIVATE KEY-----
MIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQC1WX4CDpaYflO6
C6phxGRz+nIm2g/SWwJgfsKq1HurtpDqwST/VBl3tX9TPWDh2YiYOkDururZ+aQi
8B+HO7Lxt6QE09szScXHbp0tLPlQeGUXtz1l6eZfG6OVNr9EWzeYhCfOjSTbPU+8
dnb5T0xcnpWP6yyOPi5geNasu2ZNdAMbWbj+C1nORY5E8E6r8OrFAQZrs+RKPm3J
cyYtY+vmrYqjlfpqoXdQPahSpe79XZh5mfE6zVLZ/smFcMadcPEscGaTTlDv7X8F
lYJ+FWN2Q1nKjVRKpXkjIs0AKrNLEnPlExzWbuqNw9i3/EQ86xqqqCdULzr1P0VS
p9H/D62nAgMBAAECggEAL2tBpCcNYL1zhivDtwHD5IGhtKADUBVFB1dN7p5V4h4A
QaoUUwE6EY+vReRAP34Clg9xaBfrx+hbb1lLXTCSh1rl8+8zm3MYWKAHUEc4v75j
bLKYxtvExayz9vHUTHrvjB1OTVehwgQDo/tz+5etF3DOGc48HcuLk+U0+QCdbPXO
DDwEBrVxd+buLT2Fn2SBEf1JcImoHCPT3k4fhrdeul6BRa1xZmRFR0wYbp5vyXsK
3psug1YR0DTIyLtcpjqs2ZdJv1Qx3l3+PL4Q8I9P32AGuiS1xvTvqmoPuCuBixPm
b+Gu1OUwwoTKRw7LNSgumC44ZbPXL7r92SeS61QBCQKBgQDu4PxETEX+Vml1nBb0
+RS8dm5VNRnVBJrwCS6BRRlXXMbFOASkV2Fn/HLmzlUY1/dij2kM+mY46GPEY8XA
KpkPEebo3JjsxWBKmBmv+9Pnzy6ypapQlJB+6aVbh530c0ClIh7kJlBqOS1YnmoT
na88nB609oWnIsxMOGGoJsT1eQKBgQDCWPGpFtNM0qy3bWd+7XiKBjQq5ocq0JvC
ngVZxlRQURXfD16HKMofVVM76lICt6sWqRRCbQvcJR7sR8wfwPJDmw/FhAHDaHfC
K/E7TZmX78ZVlxpVlrbvdp3SPdBx/R9uCRzUX0yszstqu2rxCRHoZ20L+dos3L8u
uyMUEqyUHwKBgQCW6Hc1xmGpbXmuHO+7zuc0sDS/i45ILmKbJZHFhJufvzKrQNpd
3/3fLXKBMPQ9f6H/F84rrryJUvZECSvSXJbZGFwh28qYOZC9Tx1bOeIC3bYIkfPo
eBJYus4F5sT4ux6ps8aEJ1hB4uEszNcCkWk1BwO3Gs4QakFaHXxEOEnRMQKBgBqU
VYCdmYphKbPwZ34pdhnSXWIcoxHM8/B68hpkEHXnkQkvreroPjRo0/hWxJ6QhfqU
Zyvqg/u4q/D+pMEW/0sVsuN9eUxDRlWs8tH8e+wWo9Zi0vwvn5dCbrUpNQ/R4XGI
F4RIAFGF+rX/KdILPoK9WmGP6zHFgvQeLd756tZbAoGBANtwcUr0CfQmdsjzHsYo
Mj1las4RMhvxhZVoMXxw79H50L+glnqtKRlcp6qVpWYXxrLEiT7tjNcBVNA+s+fZ
w1F87lzQ77u5hffSA5wTZsFt0aEBTJAivVxuSGk9LWYzo0+CZzI5PPkFAlF2/MvP
xf4mdh+dGT7b2sMlm1f8i4vU
-----END PRIVATE KEY-----`
  },
  camera: {
    appId: '1151850049216',
    keyId: 'ALzMm0viiUc3dWRXYud_1jYfkqGmJgoJHpigiiks6wk',
    privateKey: `-----BEGIN PRIVATE KEY-----
MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDbL+sL8vXxCW2A
KhRlr9j08yf6cilaOkToZUJk1h9QkIrodehSKn0fxHrAMXGZwPQIq/LcGnLthh5p
sNWeHhkw5KytnSysltED4Xbpr3CcdAk4x2hUO+aJLpPMj+SZEp14cMLHfw3axDAd
d/OYHE96V9kF5s1/ZYh1e63xfHbD3oRXZBIRU2eCpDKaRizv668bsMV3eKLJyDiP
ANQXT4+T6vBPJB9VGfgedizLxxzK0e86ulzpqx9RZFswywIC4HH1iCBPNAzYKNTt
Fwtf7B7n94MGEGqq6Bc/YvGe2exMhC4sPF33cN3pFlleDRom569HzNp7U5nDyru3
amrJVYJxAgMBAAECggEAMfwkBJYUKzNEsvklrKjk97tp7w3Qy2BFbaAF+5vvCT7l
Rqz43aAN58w1WBYOe4tKu52G5VXsxqkSz3SByqy/fuxvSqpw0S0VnmZw6UrWif9W
SQoEi00bvkYOc5SPA6+AlMJWUQty++RIurerqBEwuMxG1Dc1vutHKs+ZM9x38yOk
C9efBjaOJk3leZxjmUGfQM7rmAeeVF4GfZBEVi6u5Lsa1tntDADmG+R8JZcQIv8h
N/U6zZRiaMa4WBHYZJi/J5O38/Dzn0KDwh7ToIMq9a5F3JdUXA2K6cZc/dXytb22
oAUkdSLlylib5C286V/M+SyROGSNQzwuy5KWBmcq9wKBgQDvJh/fdi5hht9XHKoG
W+ue7I4d9LbEmhs0ez0y5GWw0NcYKi71u6E1QXlXvF3SING2gAvV9aFPFete4988
aQpfIMWN1Inn7N1OqxAKys/4kYAOozEQxP4AdvXe1JqW/zCuCAZp0Ft/E4nwd2hF
137JGmthxdWgsaUG7yMCiOCHFwKBgQDqobb7EYM1gF8fwf2pdSOFFw7HJhG1SFxv
eVEosHoEYxq0B2FMiy23sLDQQ0hXH9N1yKAkmjYOu6D6vs7MigPqLb0BOSyFD127
bqnvzIRUBewrlQf7VNn2dIqFoJl5KH3lmbpB+0vBhtfIDA0ZmDz7tW9W1CO8Ny5Q
HIVaLAk3twKBgFEciSrtloWVjSKqojBN9PiOGxWl7md4LUn7kqI0PRlfe9TCWfMW
lHLPpixPwzKF1xsjCuCi0vdT4+TnPMvshIwHPXoBYFS9TcJk2qgOacNQ9jIAv5+E
cPIPZw0Q5u3X19bu+d3hwWa0ZdCdb0xg7quevlUHGJHMLsDPUvyFGEI5AoGBAL7R
ZBIOLQpu623Vg+m0BX4wwWj/Mfmf7uUN4g5Yb/NvcgEl22C39CdnAHVvsr6AeKZa
0rrR29Lhj0s9sMuyFvr11bfP+sAAPje4CWanipsW8fqDyqkBWf5Qy3NfqFFbt//p
pQwSRosOkiD0hBbjs/z1kqYoAyQIMJcgiudJ1vlDAoGAZ1/FY4SIZIm+v6+10B/r
VSl6GR0umSe5qzbrdV+Lc2zjc1NGcTuwgUl4NoL/KFeRx6V+OC2D1OgqrRHM0Lbq
XuF6JCQv8qPezqzX6ZmJ/dD5ZCC/fagz7GYDg8+zXNO2jOU75sgAIK3X0wY/5Oio
gPfHy9E5rUhM6ibdzwUHfck=
-----END PRIVATE KEY-----`
  },
  voice: {
    appId: '1169359718851',
    keyId: 'ZYd26nd8M9yrNuVEG257ZVUrnRvoaqWQ-oswkVdyq9o',
    privateKey: `-----BEGIN PRIVATE KEY-----
MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDIohs+/0RFiHth
TesJH3HquuvJ3AtvNltiltduanN2BElHrIkbmg1azfUm6MPQwHK6yjyV6rKG7cPR
ZgZiE3rp31jQfQKTcSACQ5LQ44wGgdItTuYLBow4iuYSA5xjkA3/ILryijkFb2yW
ZY4xkg161IgmQLY3wKtTqxHecCNwfu6Yi29JxSyEQM3BVq94Uz/huC1HkIt6RDZe
6hY/ySQo7Uhb/uLmAutL6SvLR8Dn9EiIT796Mhct7oxchfL9p5eYKPcGfA1ArPbz
DMSunABAZQtcrpxTI5zbt+EHVT+r34N9XdIVv/aw+5/KDYKQ64dGL3CaG0SXpqLe
FKV0cd35AgMBAAECggEABQz+VkPTLP7xFYjXybcsGnvR02yXMG8JYOjUNo2L0jpB
uqyvbO2gDXD8OBpe/O0uAOF2If4HuC7ZzEvfDZlY8Z9I8JgHuGd+JfXGhzywjzoL
F6SR/6VkDUkDNAvkOXtsZsek/SsZTAzl3763FCy4QHyDiuxRH1kvLErfsckCk2KL
KsohqsID4h2g8ZU42D0Mw42pzkpzdTCGm1G81druifaZ9OogqYFtpfswSTkjFL7s
OWkGLIpb63EDtr9i2x7jkyC0c96mKlnQGBsrkvtLGw0JhV9NSRkFa2C7T/mVT+k9
yGav2NcvVuAjMtZigJfHZnLPRJxlWzxql2w/0QH9KwKBgQD9YkBDSLY3Pk0J0m0U
Lw42Bi9ckxP6ksHVVCR9Zho2J9aSbehCccidAnwOoUBJjgudUlnIIDy6ShthQM1s
rB9zfEm4hNiYP8q3AxHvsP7l5jrXPRMQIo23bzNCbr8H0SRPazQPnOcTAWzD7Lwk
WokCUqyrdqyQVBS3vS2lVm1YpwKBgQDKtGyQwCuXJN+2thHbm/A9QOvv7TZJ14D2
Y3/7B+hVBpNL5YqGVuMalBZBpGPzS9b8AE/fXjhtV762xRH9BTQJNewwKu+c4aWW
geY+jvLEfceIL7iDdtrDC07m8xDBdnWHc4JmMe5M59Xp9nfFWbGGwIgdmJWG4gfs
jMtKtnlIXwKBgQCd+NJt4HhSKtJm7D07Vzb58ZM3mS7ciwCz2rjBQZXX67B4LHOg
cUYMtY7YpCnrcdbF56C4B3k0/5zgXkF0nj8hhfyEQLa0/RiKTyywjl3swUQwCxDG
f3RxR6/inB8XZYnIxeJ4VW8vRzUjVYXa+GLxAtBKOjvN483i29wId8DGgwKBgGG0
R6QZzKkEsARcjA0Dg++ybEbwWruK8XFRkm2IaTcafUMW+Ac6uCqmeHfZagfqZUyA
Rf+PZblmktl78ei4alWKNTceavJ+XRdHs5gxxNhrHBMLlW9giZ97wuNVA52MoKfS
SGdD5+4PzS8BiseILSabhMBnPKOQLWuajZ6Mh7cXAoGAPGHPkD03ISUMTqPRmY/H
qJf3iI7nvlpeH4Ge1UszsmDz9MDSUMJCPs5bq24pT5kl+rCZasT4BuH9dODuBeD7
cZgzaGbDeYXn8WwsD5b7PbCGS7dljhU0N4LlTcoGtSROP3O539RzixKeAN57sUF5
ndccSY2yLtBzT7qQGPIxJC8=
-----END PRIVATE KEY-----`
  }
};

export type ModuleType = 'newspaper' | 'camera' | 'speak' | 'voice';

// 令牌缓存
let tokenCache: { [key: string]: { access_token: string; expires_in: number; timestamp: number } } = {};

/**
 * 获取生产环境OAuth Access Token
 * @param moduleType 模块类型
 * @param sessionName 会话名称（可选）
 * @param durationSeconds 令牌有效期（秒，默认900秒=15分钟）
 * @returns Promise<{access_token: string, expires_in: number}>
 */
export const getProductionOAuthToken = async (
  moduleType: ModuleType,
  sessionName?: string,
  durationSeconds: number = 900
): Promise<{ access_token: string; expires_in: number }> => {
  try {
    const config = OAUTH_JWT_CONFIG[moduleType];
    if (!config) {
      throw new Error(`未找到模块 ${moduleType} 的OAuth配置`);
    }

    // 检查缓存
    const cacheKey = `${moduleType}-${sessionName || ''}`;
    const cachedToken = tokenCache[cacheKey];
    const now = Date.now();
    
    if (cachedToken && (cachedToken.timestamp + cachedToken.expires_in * 1000) > now + 60000) { // 提前1分钟刷新
      console.log(`使用缓存的OAuth令牌 (${moduleType})`);
      return {
        access_token: cachedToken.access_token,
        expires_in: Math.floor((cachedToken.timestamp + cachedToken.expires_in * 1000 - now) / 1000)
      };
    }

    console.log(`正在获取生产环境OAuth令牌 (${moduleType})...`);

    // 生成JWT令牌
    const jwt = await generateProductionJWT(moduleType, sessionName, durationSeconds);
    
    // 调用Coze API获取访问令牌
    const response = await fetch(`${PRODUCTION_CONFIG.baseURL}/api/permission/oauth2/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${jwt}`
      },
      body: JSON.stringify({
        grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
        duration_seconds: durationSeconds
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`API请求失败: ${response.status} - ${errorData.error_message || response.statusText}`);
    }

    const data = await response.json();
    
    // 更新缓存
    tokenCache[cacheKey] = {
      access_token: data.access_token,
      expires_in: data.expires_in,
      timestamp: now
    };

    toast.success(`${moduleType}模块生产环境OAuth令牌获取成功！`);
    console.log(`生产环境OAuth令牌获取成功 (${moduleType}):`, {
      access_token: data.access_token?.substring(0, 20) + '...',
      expires_in: data.expires_in
    });

    return data;
  } catch (error) {
    console.error(`获取生产环境OAuth令牌失败 (${moduleType}):`, error);
    toast.error(`生产环境OAuth令牌获取失败: ${error instanceof Error ? error.message : '未知错误'}`);
    throw error;
  }
};

/**
 * 生成生产环境JWT令牌
 * @param moduleType 模块类型
 * @param sessionName 会话名称（可选）
 * @param durationSeconds 有效期（秒，默认600秒=10分钟）
 * @returns Promise<string> JWT令牌
 */
export const generateProductionJWT = async (
  moduleType: ModuleType,
  sessionName?: string,
  durationSeconds: number = 600
): Promise<string> => {
  try {
    const config = OAUTH_JWT_CONFIG[moduleType];
    if (!config) {
      throw new Error(`未找到模块 ${moduleType} 的OAuth配置`);
    }

    // 生成JTI（随机字符串，防止重放攻击）
    const jti = generateRandomString(32);
    
    // 当前时间戳
    const now = Math.floor(Date.now() / 1000);
    
    // JWT Header
    const header = {
      alg: 'RS256',
      typ: 'JWT',
      kid: config.keyId
    };

    // JWT Payload
    const payload = {
      iss: config.appId,           // OAuth应用的ID
      aud: PRODUCTION_CONFIG.aud,  // 扣子API的Endpoint
      iat: now,                    // JWT开始生效的时间
      exp: now + durationSeconds,  // JWT过期的时间
      jti: jti,                    // 随机字符串，防止重放攻击
      ...(sessionName && { session_name: sessionName }) // 可选的会话标识
    };

    console.log(`生成生产环境JWT令牌 (${moduleType}):`, {
      header,
      payload,
      appId: config.appId,
      keyId: config.keyId
    });

    // 将Header和Payload编码为Base64URL
    const encodedHeader = btoa(JSON.stringify(header))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '');
    
    const encodedPayload = btoa(JSON.stringify(payload))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '');

    // 创建待签名的数据
    const data = `${encodedHeader}.${encodedPayload}`;
    const dataBuffer = new TextEncoder().encode(data);

    // 导入私钥
    const privateKey = await importPrivateKey(config.privateKey);

    // 使用私钥签名
    const signature = await crypto.subtle.sign(
      'RSASSA-PKCS1-v1_5',
      privateKey,
      dataBuffer
    );

    // 将签名转换为Base64URL
    const signatureArray = new Uint8Array(signature);
    const encodedSignature = btoa(String.fromCharCode(...signatureArray))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '');

    // 组合完整的JWT
    const jwt = `${data}.${encodedSignature}`;

    console.log(`生产环境JWT令牌生成成功 (${moduleType}):`, {
      jwt: jwt.substring(0, 50) + '...',
      header: encodedHeader,
      payload: encodedPayload,
      signature: encodedSignature.substring(0, 20) + '...'
    });

    return jwt;
  } catch (error) {
    console.error(`生成生产环境JWT令牌失败 (${moduleType}):`, error);
    throw error;
  }
};

/**
 * 将PEM格式的私钥转换为CryptoKey
 * @param pemPrivateKey PEM格式的私钥
 * @returns Promise<CryptoKey>
 */
async function importPrivateKey(pemPrivateKey: string): Promise<CryptoKey> {
  try {
    // 移除PEM格式的头部和尾部
    const pemHeader = '-----BEGIN PRIVATE KEY-----';
    const pemFooter = '-----END PRIVATE KEY-----';
    const pemContents = pemPrivateKey
      .replace(pemHeader, '')
      .replace(pemFooter, '')
      .replace(/\s/g, '');

    // 将Base64字符串转换为ArrayBuffer
    const binaryDerString = atob(pemContents);
    const binaryDer = new Uint8Array(binaryDerString.length);
    for (let i = 0; i < binaryDerString.length; i++) {
      binaryDer[i] = binaryDerString.charCodeAt(i);
    }

    // 导入私钥
    const cryptoKey = await crypto.subtle.importKey(
      'pkcs8',
      binaryDer,
      {
        name: 'RSASSA-PKCS1-v1_5',
        hash: 'SHA-256',
      },
      false,
      ['sign']
    );

    return cryptoKey;
  } catch (error) {
    console.error('导入私钥失败:', error);
    throw new Error('私钥格式不正确或导入失败');
  }
}

/**
 * 生成随机字符串
 * @param length 长度
 * @returns 随机字符串
 */
function generateRandomString(length: number): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

/**
 * 测试生产环境Coze API调用
 * @param moduleType 模块类型
 * @param botId 机器人ID（可选）
 * @returns Promise<any>
 */
export const testProductionCozeAPI = async (
  moduleType: ModuleType,
  botId?: string
): Promise<any> => {
  try {
    // 获取访问令牌
    const tokenResponse = await getProductionOAuthToken(moduleType);
    
    // 使用获取已发布智能体配置API进行测试
    const testBotId = botId || '7548027309891518491'; // 默认测试bot_id
    const response = await fetch(`${PRODUCTION_CONFIG.baseURL}/v1/bot/get_online_info?bot_id=${testBotId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${tokenResponse.access_token}`
      }
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`API调用失败: ${response.status} - ${errorData.error_message || response.statusText}`);
    }

    const data = await response.json();
    
    console.log(`生产环境Coze API调用成功 (${moduleType}):`, data);
    toast.success(`${moduleType}模块生产环境API调用成功！`);
    return data;
  } catch (error) {
    console.error(`生产环境Coze API调用失败 (${moduleType}):`, error);
    toast.error(`生产环境API调用失败: ${error instanceof Error ? error.message : '未知错误'}`);
    throw error;
  }
};

/**
 * 完整的生产环境Coze集成测试
 * @param moduleType 模块类型
 * @param sessionName 会话名称（可选）
 * @returns Promise<{jwt: string, access_token: string, api_response: any}>
 */
export const testProductionCozeIntegration = async (
  moduleType: ModuleType,
  sessionName?: string
): Promise<{ jwt: string; access_token: string; api_response: any }> => {
  try {
    console.log(`开始生产环境Coze集成测试 (${moduleType})`);
    
    // 1. 生成JWT令牌
    const jwt = await generateProductionJWT(moduleType, sessionName);
    console.log('✅ 生产环境JWT令牌生成成功');
    
    // 2. 获取OAuth Access Token
    const tokenResponse = await getProductionOAuthToken(moduleType, sessionName);
    console.log('✅ 生产环境OAuth Access Token获取成功');
    
    // 3. 测试API调用
    const apiResponse = await testProductionCozeAPI(moduleType);
    console.log('✅ 生产环境API调用成功');
    
    toast.success(`${moduleType}模块生产环境集成测试成功！`);

    return {
      jwt,
      access_token: tokenResponse.access_token,
      api_response: apiResponse
    };
  } catch (error) {
    console.error(`生产环境Coze集成测试失败 (${moduleType}):`, error);
    toast.error(`生产环境集成测试失败: ${error instanceof Error ? error.message : '未知错误'}`);
    throw error;
  }
};

/**
 * 获取生产环境OAuth配置信息
 * @param moduleType 模块类型
 * @returns OAuth配置信息
 */
export const getProductionOAuthConfig = (moduleType: ModuleType) => {
  const config = OAUTH_JWT_CONFIG[moduleType];
  if (!config) {
    throw new Error(`未找到模块 ${moduleType} 的OAuth配置`);
  }
  
  return {
    appId: config.appId,
    keyId: config.keyId,
    baseURL: PRODUCTION_CONFIG.baseURL,
    aud: PRODUCTION_CONFIG.aud,
    hasPrivateKey: !!config.privateKey
  };
};
