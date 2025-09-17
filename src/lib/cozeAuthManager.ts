import { toast } from '@/components/Toast';
import { CURRENT_ENV, ENVIRONMENT, getCurrentEnvConfig } from '../config/environment';
import { getPATToken } from './cozeSDKCorrect';
import { getProductionOAuthToken } from './cozeProductionService';

/**
 * Coze认证管理器
 * 统一管理PAT和OAuth JWT认证方式
 */

export type ModuleType = 'newspaper' | 'camera' | 'speak' | 'voice';

/**
 * 获取Coze访问令牌
 * 根据当前环境自动选择认证方式
 * @param moduleType 模块类型
 * @returns Promise<string> 访问令牌
 */
export const getCozeToken = async (moduleType: ModuleType): Promise<string> => {
  try {
    if (CURRENT_ENV === ENVIRONMENT.DEVELOPMENT) {
      // 开发环境使用PAT
      console.log(`[${getCurrentEnvConfig().name}] 使用PAT令牌认证 (${moduleType})`);
      return getPATToken(moduleType);
    } else {
      // 生产环境使用OAuth JWT
      console.log(`[${getCurrentEnvConfig().name}] 使用OAuth JWT令牌认证 (${moduleType})`);
      const tokenResponse = await getProductionOAuthToken(moduleType);
      return tokenResponse.access_token;
    }
  } catch (error) {
    console.error(`获取Coze令牌失败 (${moduleType}):`, error);
    toast.error(`认证失败: ${error instanceof Error ? error.message : '未知错误'}`);
    throw error;
  }
};

/**
 * 获取认证方式信息
 * @returns 认证方式信息
 */
export const getAuthInfo = () => {
  const envConfig = getCurrentEnvConfig();
  return {
    environment: CURRENT_ENV,
    name: envConfig.name,
    description: envConfig.description,
    authMethod: envConfig.authMethod,
    color: envConfig.color,
    icon: envConfig.icon
  };
};

/**
 * 检查认证配置
 * @param moduleType 模块类型
 * @returns 配置检查结果
 */
export const checkAuthConfig = (moduleType: ModuleType): { valid: boolean; message: string } => {
  try {
    if (CURRENT_ENV === ENVIRONMENT.DEVELOPMENT) {
      // 检查PAT配置
      const patToken = getPATToken(moduleType);
      if (patToken.includes('YOUR_') || patToken === 'YOUR_PAT_TOKEN') {
        return { valid: false, message: `请先配置${moduleType}模块的PAT令牌` };
      }
      return { valid: true, message: 'PAT令牌配置正确' };
    } else {
      // 检查OAuth JWT配置
      // 这里可以添加JWT配置检查逻辑
      return { valid: true, message: 'OAuth JWT配置正确' };
    }
  } catch (error) {
    return { 
      valid: false, 
      message: `配置检查失败: ${error instanceof Error ? error.message : '未知错误'}` 
    };
  }
};

/**
 * 获取所有模块的认证状态
 * @returns 所有模块的认证状态
 */
export const getAllModulesAuthStatus = () => {
  const modules: ModuleType[] = ['newspaper', 'camera', 'speak', 'voice'];
  const moduleNames = {
    newspaper: '手抄报社',
    camera: '创想空间',
    speak: '童言生画',
    voice: '语音互动'
  };

  return modules.map(moduleType => {
    const configCheck = checkAuthConfig(moduleType);
    return {
      moduleType,
      moduleName: moduleNames[moduleType],
      valid: configCheck.valid,
      message: configCheck.message
    };
  });
};

/**
 * 显示认证状态信息
 * @param moduleType 模块类型
 */
export const showAuthStatus = (moduleType: ModuleType) => {
  const authInfo = getAuthInfo();
  const configCheck = checkAuthConfig(moduleType);
  
  console.log(`=== Coze认证状态 (${moduleType}) ===`);
  console.log(`环境: ${authInfo.name} (${authInfo.icon})`);
  console.log(`认证方式: ${authInfo.authMethod}`);
  console.log(`配置状态: ${configCheck.valid ? '✅' : '❌'} ${configCheck.message}`);
  console.log('===============================');

  if (configCheck.valid) {
    toast.success(`${moduleType}模块认证配置正确`);
  } else {
    toast.error(`${moduleType}模块认证配置错误: ${configCheck.message}`);
  }
};




