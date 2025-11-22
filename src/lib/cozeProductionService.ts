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

// 基于coze_oauth_python_jwt目录配置的OAuth JWT配置
// 配置来源：
// - coze_oauth_python_jwt-shou -> newspaper (手抄报社)
// - coze_oauth_python_jwt-tong -> speak (童言生画)
// - coze_oauth_python_jwt-chaung -> camera (创想空间)
// - coze_oauth_python_jwt-AI -> voice (语音互动)
const OAUTH_JWT_CONFIG = {
  newspaper: {
    appId: '1102688282029', // coze_oauth_python_jwt-shou
    keyId: 'wL0sIk83YFu5kAfSoCwhurNYFl3m1BJG_hjZREvgDV4',
    privateKey: `-----BEGIN PRIVATE KEY-----
MIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQCxJOsPhDAaZcRM
oaKcwFAxnYzwtUhztMkMdajQcqwmixN5s9FTsvvwbYVFulX7A9ZRoLbtvEaLBQzu
SEY9hGt0plPuW5GXgea4rpUw/+/Dhnks+nRvjDbjpeFwr9bxP0mtJICad+cKOAZ9
5vTqslr7EBBUzuMFdwXJ32t2JtedGMqxTJstyJ3i1PWFlKiJBy8qWqpN/qX1gZX9
w1ukB6pelIcG/hQk63uFUQnstzcKc5uSZnnkJcGWI1pwsoFzW29sDnt0aClxHp0a
uCmExCrBGYOTLhaOOY+a27dfp68Pk83nglC54bwnzhCsw25ra1/pn54PeqlEl32V
ZGnHDQpLAgMBAAECggEAFSWKmAoYMfaHFfzPrDW6/QlJS2zgrstcmsuq8ONXkKxW
kVc5fGvn7n4shDPn0rTVD16Hp96rbyoVrpZbKDnYGA9JArHUsgj0UYSp07Uh2q4B
ZjCp2K0c2lUxkeGz343GDlDGt2nr30jr4XjCMQhEmycCRBWEfWEFhGFS80JUx/B8
S++xO6qkRBMvkBPLeM+7EXjv4fLiM6la3LC1pCDLkbLSywbJu3m8HM+AXQAcyJ6J
VYsPw8hhdRL/MPrvAUqUwvOvVLzKwK160E5uiihUQCY6Zt5Is77jpfUzK9WzPPEC
BY/bM3zQ1X8HjwQ5JgGz0oaLQa/mhCzJ4EgPDH5wBQKBgQDgeKMJJ8QKQMrmK9qI
evPIDXlOAqzzsRiusmRTn6Xd5vXnM3YEShVxcdl+TUOVTzhxBZ9bR4e+wEg7hQz5
JxFrIzfGJZaUcHVRspXRcIq5YCKN2y770UTIoMgBDVFkv5Dg0LktJy+EQGoBlq3F
+ieCBKhdIg2eX7xUX4lkYoWt7wKBgQDKBohihBEchJ+1jYwAhiA71NfC6fZyQvwJ
cDKI9pNRH0Ygzf+zgULJrYSg5F1nfsAiHxS51VX/pX6TEVaTK7H9Kpr7QOhn6aqi
7bag5hML9TZKnNTK7ajmCPQ+7z4wLfCaYc4Bg73fi2GaXZsCw4hswDk2OEWwEmDx
YmzJVHJFZQKBgQCfwBs/m8ZgCaac0p7vPJmcSUKIa00NDX9kbN8LyHWyC/n7ddtK
yDKkjwLbaT9s1nlzri2wN6L69Tsy6MjH1K8H0YOTCBM3RyWnY/JNoMuJjEprLI8u
dct/ATX10bWYfuErrj/rS5T8iR8oTEUVvac6V/g+d8q7aKTOY0OTZq5+jwKBgCcu
GSkx/7eOKQMmzm4TlRDFeIq+oSMLxqF19vcFCxEChbE7Akon2XIPitdBMrQtqslz
Sau4qhMIX4HaLPYh1UUKDECKGAh/Eq7Cd1bBCBSbm8ngnIw2hzkFp4jFEUR6xFzM
dw1oJVzDRUyQts1UapLcvLu9Mhaxmcd2lS5+iCLZAoGBAKVB5EDSUWMt5B/ynR1m
n7bu580G33uqYCIkRVi3DHPmVvIxm40eynEvZOIholaTeTn267HiKs95BMZGaeKH
ByMq04pLBtJmFnbjZCFHkJy909SMcJ3v0JpSyqFUovWyf0jqNVAMXOh6f9xAGLbw
XY+XtEW1BlRYncAXkIfrBTeh
-----END PRIVATE KEY-----`
  },
  speak: {
    appId: '1167176654593', // coze_oauth_python_jwt-tong
    keyId: 'QOQFT-rym5tdlQZNpWZfFjqjgSh4pM6i71pMqTOfAUE',
    privateKey: `-----BEGIN PRIVATE KEY-----
MIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQDsiaNrK/GIlr98
fI16qCfNqcr5XhIi9MjXx3XiJmhuYCM1/AEnfRyKaSxLVVf0R7cIQ7pcd41ucQXB
QWU63Iy13KXgEHfuN9hJlkixaWVJ/CMVbp6Kg9woZEe0snKMISwDP8QpB+nvPOGV
oPBMPztUaM3R/ZWPaSrm/5DHl4QLQdUrvNDUwm4JTkNERPt3BkpFmtmAkj10+vnn
o2s9eOc8pcdNhLkqMOKytoZYVC34OkGeyfEhXsq/MwrQvWyjY8Ku2bJ/6AkDP5pL
+C+2RTCratKTZ81pzwaPkS7l4OeM5n6KGtVGbumJzmZ1p2Ox6O8eDFbL5uaFsvtE
2YzLQcFNAgMBAAECgf9nuuNnC1XPw8OtOmlZgw9o/5WdPYGljoBjU534W/CjZcnp
Fe/0Lhzelg2jhFJBNKl2KZLDxv9QGkCN9w6x9LEVupydP/Dx3Fh0/ftrjbvMlBtX
KKMrCmQsp811CmZChRZhq7dJelEcu3QQCB2dlqXDb6oGSshc6LDWvrQ2sSpqKvIJ
/V7TQlsLonZnddLw2NF+47RBGh0i4A+uQxN1phUCGKrqeGWeFDGPyTFg6zcslFzm
vMryz66hzQxWD/1wqEk6N7MdGMT0FuMnU0vP1vUlXLEd5uKKTvk1GGMRK8j/ZdRG
Z0juTBdMFoemaYCfkkJDFciodwvRK1yDLWqiA1ECgYEA/jovw1wgi6XGpWK19+Y0
qhhncng58lOVeNTvoAGxhQDsK6gzo/mwNvdh7PEkqamfhCc0AWelxIA66VVVgoCM
uaEaz0/ld2p48lHVzPzVD53aU6VAd6Es7zPZqieHHiyeFuEFh2L9zh9LeItgDayX
YlcpqY7uD6t30Y6gse5qaLsCgYEA7i/f4afXvh8ktc/L6M7VNxw7nKvnQ5gl90rR
/gjfO1aufV20jMe9murOn0LAGa6KKV5GEF2XDeZ06FBvrxIpcjWkc05sCFxxR82Q
VX1ihFqrUSUL971mFqNQKI3M5eAEixEkSyZe941fJKGYA7Kaor5ZJZ1kiPvKt9Cp
NPyLwZcCgYAElcwSu/CiVCUXCoa5p98/Sh1jhSOWaUeC3GROAHnRKkkYKHp19KTm
+OM9QMQmgzarTYG0nMfymVV2q+FU7ziaiHtRTeGXm8X+qNcwUUcOdwxfAdX90lxb
HBZK6VeYhbl8NCbDYFevhgT4cZsT5A7+6Q+JTVih07ffgbEIRIKKzQKBgQCzxmyr
jBx5QlZZ58oXIK2rV+LigJkf2qGlQdK3c4jR573xn51buJKyb9GeQSpu998OFDq7
tXgCpNPOWI/DSuj/a9+ArEs8EFHsCQqMjAOktC6kI1siFNEN+xvQUB67zlZ/hGOp
WP/Kxuht5I2xFMhEV3k/u8ka3zkFfjeIZ6kwZwKBgQDLrstcNQWLGfSv/OA2MCvE
Q40opdqtDWG3TezHbpPbvnhHHelfAFcLBO0M99MAh11TNIVE4AKiO9awLWH6N3Lg
zjgg59BL3YETBKrpEDKkDvSGuuD/7N6rb4IrduO3MJlyGSKD42Nt6GysR9+YfXma
HfqK1PgBOGQRYE3YVDMJFQ==
-----END PRIVATE KEY-----`
  },
  camera: {
    appId: '1132068289043', // coze_oauth_python_jwt-chaung
    keyId: 'Bf27NqUCvTc3yVVOrH5mPWqiq99hgUsvxDRZpz4SioA',
    privateKey: `-----BEGIN PRIVATE KEY-----
MIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQDRfEpsfYtUvslL
/cRbpmkrZRIk2J/e0Iu2Wso9kXwOqztn516sMZreqtvUbgE9N4XFEA8/1cUbiT93
vZnjMjBoK40Oni86ub58dOECsbfX8S8nLYWaR63JYfgPZozVA+U0zc/rj4D/l7AU
szDrnyuNBDZPfvWBI4G+Tzqk6eyQ2jBkTYxNAXlZGBvcneU/yX/hpunUu8wMtSgD
WNh+dR5lEF6cQkL5PPvvzc8E7fkk9FfIJFXna1mcIbzLL0fzUIhCrL1+uqySw25X
ZswO63R8S2jYCKGBCS/EtVdnBOl+0msvfnUK10vCCFEI/sQ/iSFZhtEcHfbbYtyj
RRzTmhnDAgMBAAECggEADQFZtXvjJzMOWDNm+gb4xy2Sf3XGEb/XYfjSTsQ2HssD
+HgQE+yjIBPHa1wbo5X2LhJzKpQLlUwOA/xiDg19nS9Rpd4C3J3PdPaPSZWIQ6sW
MakifujYTIT9MNI9srPNNQavU9Z9kbX0bonkDZy8yBfCL2lDC0NjDfzpN80grKq3
obQyEg4Kz7XO4PZ2aNOJWo5/G7or58VoT4cWmeadFG6PAiPIS0cb2RghPunp1ipl
GY1G8ECHoXoZz1SpTRx9N+GDDdfjK5RichKIVnnNyiexo2Cl8y+FFD49uW4d6XiO
17QBeRzvOwHG+kSE37d3L0nMUL5qw+stIUJ5iIJ8cQKBgQDtc2Ie2OuuPHk8neWj
jEGJ97cj/VCP7xPYiWp+JlrA91XHI21jwBMSB7VFq0X1xDMrTlEGDarvQ97ZJ/wk
f+ozIyA6g/eCHJlJC7E3pwfxFdDuvmmoNLcPadPT3n3fom9LljqkgGRBCf8OMhcH
iUGcXa8I0mIe9fLBx3leRBeihQKBgQDh2aZwiq/vPk6B3YdtqgM687g29RQXyyoX
1pZByP0bwiXtH/sZlpMLfjlb+3SKGvucDqDRvzDhrrApuVwfWrTV9blgqnWVtejV
URnOZX0lnD6XGgW+SixGHzEWqSFGiqVLoEztSaiAjO+BwauDkOI0Ja+J4R1maNw4
HB/3FadRpwKBgG8x00ciyetEAnoybvFRovda+3ZtD6b3jFGguC/vAhzPNmoU2wsV
TVjqJydC93YJtPSYrjSpfdyh6d/Da74j8KaV0mfUmLljbxzXztuC6qMpVjgXDx9n
4Dnlkv7qeAOb64Z4CWozfb8/USNyrXon+oOhE3CMJMre3hmEsf9E39SJAoGATl5s
775gID9ZlJyfQsFsz4cElCVkrID2AUGX8AnjMj+jU232fsGOEr3g/3b40HdeeZ9l
1IJoXtd0D3Zfbg3WlCvpAI8FsEZoHaU/tCvpSiS2X05LUeWBCXAHY5qajlTL2Lsu
FmSp0LmW3kqqzkN3CqtNByYTQpb+W4X+3Yko/x8CgYBquoTj9r39gGwAjqB8LHgT
gRcNN+aWOe5phiPzqumyfmO3eaBXwEqUGhxOKJ4cYsUGXs0/JydfKzkqphsec09n
MHuP5oEI0bxxlEqTe3w7UZ5Vz8RwzUun+pF/nbHCCa742yblNCpX9wNIaDD0EV3M
fQSgV702A49xUFCG6uVOog==
-----END PRIVATE KEY-----`
  },
  voice: {
    appId: '1155710162102', // coze_oauth_python_jwt-AI
    keyId: 'kZvHCZ0i3HKgzIw4-LDsSBsOcHZfixntMXrNYvFQ2Ng',
    privateKey: `-----BEGIN PRIVATE KEY-----
MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCtW5qFPRFsJ8ou
cL5/q2IRZPa0FoUZ6tjDPxPWHxXpwrszd3M5z9Q5JU7j6oiV/kpWaaQLmFtMzjWK
JDmxNQkakpMIoq5PzD7Aes85xLgSUMF6BPnLqJcUhKiTZH80btAwb7hntZQ34HBn
Q+IfTaKc+TD4A+0d7ptJa+7awOKaO4uYIruKmK+9HU7qE1mcC4FovxI27ld1UCp0
rknj66UnOlVcKaIz+79c9crTqAUow/46L/6nlIKX5Tc8KR4KMEt5lZJ00kLBOiOR
CN69m3aAi7Ou1J0xSwNK35uwzp+sDX1D+JCqGg2PZdfozrfVBxJgy+DvrUsw0QX0
UZhCTGunAgMBAAECggEABqQILstwk+qQSagi/AQGLTFna+2i6qO+6vfLHDwznDFL
94Q/YzsNX6UIuR1eXxSPJ3FDifgroy0RCvopRZsI/r4XqNCGieMCkmAB+S4KeRUj
3Dc9lGogY3ZTeNX0M399NSXKdBqWE2/jDmmgy18veADpuc54sllWFIFwdGvIIm1O
Vu4W+kvSbinjZ/YhYJcQtFQM9/JEB8dYKR/5R7EvYYMQ1o3fd4JomJIOHlvyrK9l
haedm5BVXkufgrQU872haW1yjnrnWUOHTTHUICv/mwJ7D5YFmM/iwKk3paP1DQ0h
X/CUkk50WT7Wbb+wic/Se+oY/ojXMVpcMDZNypUAPQKBgQDghhtxI3l8JFcvUoJz
MHkfDKcX2ndMQp4oh+lruLcJqFHCxmRYaCLd6MzCoZWQBSnv06PW+TNbkAZ4ze64
ZV+9BkbY0CnK88Mw54y0gQ5SWsERqlD4s0JGBP3nAh08Zb/e+01bveOeLwRwRwwr
FNSdmGx/UQ2QSWzplLVXWDT9IwKBgQDFqTVxNvXuTvcDARpf2JXfSTPwXkbQQPvx
dab/9JprMSkVwmmqHt1oXU2e3hdzZFi45F3VRQx4zIX/TWJAi1A1oIvb3LISHqWK
1QN/8Zbm9rkJGq9EjcpghmHAOD38vb6cScuH1lZJENLUoX4zEQYeip7RKcf8WZgP
q66brk5prQKBgDM1At876wIwO540YEIrRQSa2yUqk1jWPMIbtVX3K+/M7tDQdKRh
I8qexMyDE9xkARuMlmp6LYdtgrxco1x06m/vFYtvdoiuLc9ikAm/AWgxAKWpxYvj
PnM/wjTEm6xhvG/7urn4xggWyxlcat8Mgi1rTRuAfepxhKCFZRKFsJgnAoGBAKZg
+SA0UCzpgRihTA8To4wQ9UxGPzs7CBfGnezjezvxZJDxVboiQuJ/bz/j2D+EXv47
FBTaC1Z/aedtvt9vpPOPEUrfaXDBJT1Icqq2s/vz/+r+8Ds3UvuPAicn8F2XZiPu
JglQTM8x/xWGXlEj6k+5BVgw4Cq1S78dF1vqDAz9AoGAXQkChYnST2zfi0xaEzFV
Me7UuchBR7B2dKw9BXnpD/xVbwSlEd2w4tjP/PtA9sz5QIEKlG/6s90i8q3IHN/Y
QhraFBLHuZWb1psApgBOtzZfOP4HGMHzRrtgklEJ+QYw1sO5dNHmxqsVk4RQqQ7u
+8FAyUL2BB+y7oWcOvmW4u4=
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
    console.log(`正在调用Coze OAuth API (${moduleType}):`, {
      url: `${PRODUCTION_CONFIG.baseURL}/api/permission/oauth2/token`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${jwt.substring(0, 50)}...`
      },
      body: {
        grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
        duration_seconds: durationSeconds
      }
    });

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
      const errorMessage = errorData.error_message || response.statusText;
      
      // 提供详细的错误诊断信息
      if (response.status === 401) {
        console.error(`JWT认证失败 (${moduleType}):`, {
          status: response.status,
          error: errorMessage,
          errorData: errorData,
          config: {
            appId: config.appId,
            keyId: config.keyId,
            baseURL: PRODUCTION_CONFIG.baseURL,
            aud: PRODUCTION_CONFIG.aud
          },
          jwtInfo: {
            header: JSON.parse(atob(jwt.split('.')[0].replace(/-/g, '+').replace(/_/g, '/'))),
            payload: JSON.parse(atob(jwt.split('.')[1].replace(/-/g, '+').replace(/_/g, '/'))),
            jwtLength: jwt.length
          }
        });
        
        if (errorMessage.includes('kid') || errorMessage.includes('key')) {
          throw new Error(`JWT配置错误: keyId "${config.keyId}" 在Coze平台未注册。请检查：1) keyId是否正确 2) 是否在Coze平台注册了对应的公钥 3) appId和keyId是否匹配`);
        }
        
        if (errorMessage.includes('verify jwt token')) {
          throw new Error(`JWT令牌验证失败: ${errorMessage}。可能原因：1) 私钥与公钥不匹配 2) JWT签名错误 3) JWT格式不正确 4) 时间戳问题`);
        }
      }
      
      throw new Error(`API请求失败: ${response.status} - ${errorMessage}`);
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
    // 使用UTF-8编码确保中文字符正确处理
    const headerJson = JSON.stringify(header);
    const payloadJson = JSON.stringify(payload);
    
    const encodedHeader = btoa(unescape(encodeURIComponent(headerJson)))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '');
    
    const encodedPayload = btoa(unescape(encodeURIComponent(payloadJson)))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '');

    // 创建待签名的数据
    const data = `${encodedHeader}.${encodedPayload}`;
    const dataBuffer = new TextEncoder().encode(data);

    // 导入私钥
    console.log(`导入私钥 (${moduleType}):`, {
      keyId: config.keyId,
      privateKeyLength: config.privateKey.length,
      privateKeyStart: config.privateKey.substring(0, 50) + '...',
      privateKeyEnd: '...' + config.privateKey.substring(config.privateKey.length - 50)
    });
    
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
    
    // 检查私钥格式
    if (!pemPrivateKey.includes(pemHeader) || !pemPrivateKey.includes(pemFooter)) {
      throw new Error('私钥格式错误：缺少PEM头部或尾部');
    }
    
    const pemContents = pemPrivateKey
      .replace(pemHeader, '')
      .replace(pemFooter, '')
      .replace(/\s/g, '');

    if (!pemContents || pemContents.length === 0) {
      throw new Error('私钥内容为空');
    }

    console.log('私钥处理:', {
      hasHeader: pemPrivateKey.includes(pemHeader),
      hasFooter: pemPrivateKey.includes(pemFooter),
      pemContentsLength: pemContents.length
    });

    // 将Base64字符串转换为ArrayBuffer
    const binaryDerString = atob(pemContents);
    const binaryDer = new Uint8Array(binaryDerString.length);
    for (let i = 0; i < binaryDerString.length; i++) {
      binaryDer[i] = binaryDerString.charCodeAt(i);
    }

    console.log('私钥转换:', {
      binaryDerLength: binaryDer.length,
      firstBytes: Array.from(binaryDer.slice(0, 10))
    });

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

    console.log('私钥导入成功');
    return cryptoKey;
  } catch (error) {
    console.error('导入私钥失败:', error);
    const errorMessage = error instanceof Error ? error.message : '未知错误';
    throw new Error(`私钥格式不正确或导入失败: ${errorMessage}`);
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
