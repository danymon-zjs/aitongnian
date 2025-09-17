/**
 * 安全配置管理
 * 用于管理敏感配置信息，提供加密存储和访问控制
 */

import { encryptEnvVar, decryptEnvVar, maskToken } from './cryptoUtils';
import { validateInput, appValidation } from './validationUtils';

// 配置密钥（应该从环境变量获取）
const CONFIG_KEY = process.env.VITE_CONFIG_KEY || 'default-config-key-change-in-production';

// 配置接口
interface SecureConfig {
  appIds: {
    newspaper: string;
    speak: string;
    camera: string;
    voice: string;
  };
  jwtConfigs: {
    newspaper: {
      appId: string;
      keyId: string;
      privateKey: string;
    };
    speak: {
      appId: string;
      keyId: string;
      privateKey: string;
    };
    camera: {
      appId: string;
      keyId: string;
      privateKey: string;
    };
    voice: {
      appId: string;
      keyId: string;
      privateKey: string;
    };
  };
  apiConfig: {
    baseURL: string;
    timeout: number;
    retryAttempts: number;
  };
  securityConfig: {
    enableCSP: boolean;
    enableHSTS: boolean;
    enableXSSProtection: boolean;
    sessionTimeout: number;
  };
}

// 加密的配置数据（生产环境）
const ENCRYPTED_CONFIG = {
  // 这里应该是加密后的配置数据
  // 实际部署时，应该从安全的环境变量或密钥管理服务获取
  appIds: {
    newspaper: encryptEnvVar('7547302685909827623', CONFIG_KEY),
    speak: encryptEnvVar('7548027309891518491', CONFIG_KEY),
    camera: encryptEnvVar('7548051394683715622', CONFIG_KEY),
    voice: encryptEnvVar('7550649811847020585', CONFIG_KEY)
  },
  jwtConfigs: {
    newspaper: {
      appId: encryptEnvVar('1128088461414', CONFIG_KEY),
      keyId: encryptEnvVar('y-XendbREzonHcoxrxZSzsOtZbhebQZdJ99VL8SXzd0', CONFIG_KEY),
      privateKey: encryptEnvVar(`-----BEGIN PRIVATE KEY-----
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
-----END PRIVATE KEY-----`, CONFIG_KEY)
    },
    speak: {
      appId: encryptEnvVar('1176390124241', CONFIG_KEY),
      keyId: encryptEnvVar('8NBR1mNrdT6vdFa5PWkUy04tpbCfn7dSwUK7ngZE_s4', CONFIG_KEY),
      privateKey: encryptEnvVar(`-----BEGIN PRIVATE KEY-----
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
-----END PRIVATE KEY-----`, CONFIG_KEY)
    },
    camera: {
      appId: encryptEnvVar('1151850049216', CONFIG_KEY),
      keyId: encryptEnvVar('ALzMm0viiUc3dWRXYud_1jYfkqGmJgoJHpigiiks6wk', CONFIG_KEY),
      privateKey: encryptEnvVar(`-----BEGIN PRIVATE KEY-----
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
-----END PRIVATE KEY-----`, CONFIG_KEY)
    },
    voice: {
      appId: encryptEnvVar('1169359718851', CONFIG_KEY),
      keyId: encryptEnvVar('ZYd26nd8M9yrNuVEG257ZVUrnRvoaqWQ-oswkVdyq9o', CONFIG_KEY),
      privateKey: encryptEnvVar(`-----BEGIN PRIVATE KEY-----
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
-----END PRIVATE KEY-----`, CONFIG_KEY)
    }
  },
  apiConfig: {
    baseURL: encryptEnvVar('https://api.coze.cn', CONFIG_KEY),
    timeout: 30000,
    retryAttempts: 3
  },
  securityConfig: {
    enableCSP: true,
    enableHSTS: true,
    enableXSSProtection: true,
    sessionTimeout: 900000 // 15分钟
  }
};

// 配置缓存
let configCache: SecureConfig | null = null;

/**
 * 获取安全配置
 */
export const getSecureConfig = (): SecureConfig => {
  if (configCache) {
    return configCache;
  }

  try {
    // 解密配置数据
    const decryptedConfig: SecureConfig = {
      appIds: {
        newspaper: decryptEnvVar(ENCRYPTED_CONFIG.appIds.newspaper, CONFIG_KEY),
        speak: decryptEnvVar(ENCRYPTED_CONFIG.appIds.speak, CONFIG_KEY),
        camera: decryptEnvVar(ENCRYPTED_CONFIG.appIds.camera, CONFIG_KEY),
        voice: decryptEnvVar(ENCRYPTED_CONFIG.appIds.voice, CONFIG_KEY)
      },
      jwtConfigs: {
        newspaper: {
          appId: decryptEnvVar(ENCRYPTED_CONFIG.jwtConfigs.newspaper.appId, CONFIG_KEY),
          keyId: decryptEnvVar(ENCRYPTED_CONFIG.jwtConfigs.newspaper.keyId, CONFIG_KEY),
          privateKey: decryptEnvVar(ENCRYPTED_CONFIG.jwtConfigs.newspaper.privateKey, CONFIG_KEY)
        },
        speak: {
          appId: decryptEnvVar(ENCRYPTED_CONFIG.jwtConfigs.speak.appId, CONFIG_KEY),
          keyId: decryptEnvVar(ENCRYPTED_CONFIG.jwtConfigs.speak.keyId, CONFIG_KEY),
          privateKey: decryptEnvVar(ENCRYPTED_CONFIG.jwtConfigs.speak.privateKey, CONFIG_KEY)
        },
        camera: {
          appId: decryptEnvVar(ENCRYPTED_CONFIG.jwtConfigs.camera.appId, CONFIG_KEY),
          keyId: decryptEnvVar(ENCRYPTED_CONFIG.jwtConfigs.camera.keyId, CONFIG_KEY),
          privateKey: decryptEnvVar(ENCRYPTED_CONFIG.jwtConfigs.camera.privateKey, CONFIG_KEY)
        },
        voice: {
          appId: decryptEnvVar(ENCRYPTED_CONFIG.jwtConfigs.voice.appId, CONFIG_KEY),
          keyId: decryptEnvVar(ENCRYPTED_CONFIG.jwtConfigs.voice.keyId, CONFIG_KEY),
          privateKey: decryptEnvVar(ENCRYPTED_CONFIG.jwtConfigs.voice.privateKey, CONFIG_KEY)
        }
      },
      apiConfig: {
        baseURL: decryptEnvVar(ENCRYPTED_CONFIG.apiConfig.baseURL, CONFIG_KEY),
        timeout: ENCRYPTED_CONFIG.apiConfig.timeout,
        retryAttempts: ENCRYPTED_CONFIG.apiConfig.retryAttempts
      },
      securityConfig: ENCRYPTED_CONFIG.securityConfig
    };

    // 验证配置数据
    const validation = validateInput(appValidation.appId, decryptedConfig.appIds.newspaper);
    if (!validation.success) {
      throw new Error('配置验证失败');
    }

    configCache = decryptedConfig;
    return decryptedConfig;
  } catch (error) {
    console.error('配置解密失败:', error);
    throw new Error('无法加载安全配置');
  }
};

/**
 * 获取应用ID（带验证）
 */
export const getSecureAppId = (moduleType: 'newspaper' | 'camera' | 'speak' | 'voice'): string => {
  const config = getSecureConfig();
  const appId = config.appIds[moduleType];
  
  const validation = validateInput(appValidation.appId, appId);
  if (!validation.success) {
    throw new Error(`无效的应用ID: ${moduleType}`);
  }
  
  return appId;
};

/**
 * 获取JWT配置（带验证）
 */
export const getSecureJWTConfig = (moduleType: 'newspaper' | 'camera' | 'speak' | 'voice') => {
  const config = getSecureConfig();
  const jwtConfig = config.jwtConfigs[moduleType];
  
  // 验证配置完整性
  if (!jwtConfig.appId || !jwtConfig.keyId || !jwtConfig.privateKey) {
    throw new Error(`JWT配置不完整: ${moduleType}`);
  }
  
  return jwtConfig;
};

/**
 * 获取API配置
 */
export const getSecureAPIConfig = () => {
  const config = getSecureConfig();
  return config.apiConfig;
};

/**
 * 获取安全配置
 */
export const getSecureSecurityConfig = () => {
  const config = getSecureConfig();
  return config.securityConfig;
};

/**
 * 清除配置缓存（用于测试或重新加载配置）
 */
export const clearConfigCache = () => {
  configCache = null;
};

/**
 * 验证配置完整性
 */
export const validateSecureConfig = (): boolean => {
  try {
    const config = getSecureConfig();
    
    // 检查所有必需的应用ID
    const requiredModules: Array<'newspaper' | 'camera' | 'speak' | 'voice'> = 
      ['newspaper', 'camera', 'speak', 'voice'];
    
    for (const module of requiredModules) {
      const appId = config.appIds[module];
      const jwtConfig = config.jwtConfigs[module];
      
      if (!appId || !jwtConfig.appId || !jwtConfig.keyId || !jwtConfig.privateKey) {
        console.error(`配置不完整: ${module}`);
        return false;
      }
    }
    
    return true;
  } catch (error) {
    console.error('配置验证失败:', error);
    return false;
  }
};

/**
 * 获取配置摘要（用于日志记录，不包含敏感信息）
 */
export const getConfigSummary = () => {
  try {
    const config = getSecureConfig();
    return {
      appIds: {
        newspaper: maskToken(config.appIds.newspaper),
        speak: maskToken(config.appIds.speak),
        camera: maskToken(config.appIds.camera),
        voice: maskToken(config.appIds.voice)
      },
      jwtConfigs: {
        newspaper: {
          appId: maskToken(config.jwtConfigs.newspaper.appId),
          keyId: maskToken(config.jwtConfigs.newspaper.keyId),
          hasPrivateKey: !!config.jwtConfigs.newspaper.privateKey
        },
        speak: {
          appId: maskToken(config.jwtConfigs.speak.appId),
          keyId: maskToken(config.jwtConfigs.speak.keyId),
          hasPrivateKey: !!config.jwtConfigs.speak.privateKey
        },
        camera: {
          appId: maskToken(config.jwtConfigs.camera.appId),
          keyId: maskToken(config.jwtConfigs.camera.keyId),
          hasPrivateKey: !!config.jwtConfigs.camera.privateKey
        },
        voice: {
          appId: maskToken(config.jwtConfigs.voice.appId),
          keyId: maskToken(config.jwtConfigs.voice.keyId),
          hasPrivateKey: !!config.jwtConfigs.voice.privateKey
        }
      },
      apiConfig: {
        baseURL: config.apiConfig.baseURL,
        timeout: config.apiConfig.timeout,
        retryAttempts: config.apiConfig.retryAttempts
      },
      securityConfig: config.securityConfig
    };
  } catch (error) {
    return { error: '无法获取配置摘要' };
  }
};
