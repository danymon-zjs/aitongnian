/**
 * 环境配置管理
 * 用于管理开发环境和生产环境的不同配置
 */

export const ENVIRONMENT = {
  // 开发环境使用PAT
  DEVELOPMENT: 'pat',
  // 生产环境使用OAuth JWT
  PRODUCTION: 'oauth_jwt'
} as const;

export type EnvironmentType = typeof ENVIRONMENT[keyof typeof ENVIRONMENT];

/**
 * 获取当前环境类型
 */
export const getCurrentEnvironment = (): EnvironmentType => {
  // 根据NODE_ENV判断环境
  if (process.env.NODE_ENV === 'production') {
    return ENVIRONMENT.PRODUCTION;
  }
  return ENVIRONMENT.DEVELOPMENT;
};

/**
 * 当前环境配置
 */
export const CURRENT_ENV = getCurrentEnvironment();

/**
 * 环境配置信息
 */
export const ENV_CONFIG = {
  [ENVIRONMENT.DEVELOPMENT]: {
    name: '开发环境',
    description: '使用PAT令牌进行认证',
    authMethod: 'PAT',
    color: 'blue',
    icon: '🔧'
  },
  [ENVIRONMENT.PRODUCTION]: {
    name: '生产环境',
    description: '使用OAuth JWT进行认证',
    authMethod: 'OAuth JWT',
    color: 'green',
    icon: '🚀'
  }
} as const;

/**
 * 获取当前环境配置信息
 */
export const getCurrentEnvConfig = () => {
  return ENV_CONFIG[CURRENT_ENV];
};

/**
 * 检查是否为开发环境
 */
export const isDevelopment = (): boolean => {
  return CURRENT_ENV === ENVIRONMENT.DEVELOPMENT;
};

/**
 * 检查是否为生产环境
 */
export const isProduction = (): boolean => {
  return CURRENT_ENV === ENVIRONMENT.PRODUCTION;
};

/**
 * 获取认证方法
 */
export const getAuthMethod = (): string => {
  return getCurrentEnvConfig().authMethod;
};







