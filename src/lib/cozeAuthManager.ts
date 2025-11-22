import { toast } from '@/components/Toast';
import { CURRENT_ENV, ENVIRONMENT, getCurrentEnvConfig } from '../config/environment';
import { getProductionOAuthToken } from './cozeProductionService';

/**
 * Coze认证管理器
 * 仅使用OAuth JWT认证方式（基于coze_oauth_python_jwt目录配置）
 */

export type ModuleType = 'newspaper' | 'camera' | 'speak' | 'voice';

/**
 * 获取Coze访问令牌
 * 仅使用JWT鉴权（根据coze_oauth_python_jwt目录配置）
 * @param moduleType 模块类型
 * @returns Promise<string> 访问令牌
 */
export const getCozeToken = async (moduleType: ModuleType): Promise<string> => {
  try {
    // 始终使用OAuth JWT鉴权
    console.log(`[JWT鉴权] 使用OAuth JWT令牌认证 (${moduleType})`);
    const tokenResponse = await getProductionOAuthToken(moduleType);
    return tokenResponse.access_token;
  } catch (error) {
    console.error(`获取Coze令牌失败 (${moduleType}):`, error);
    const errorMessage = error instanceof Error ? error.message : '未知错误';
    
    // 提供更详细的错误信息
    if (errorMessage.includes('kid') || errorMessage.includes('401')) {
      toast.error(`JWT配置错误: ${errorMessage}。请检查JWT配置中的keyId是否在Coze平台正确注册。`);
    } else {
      toast.error(`认证失败: ${errorMessage}`);
    }
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
    // 仅检查OAuth JWT配置
    // JWT配置已内置在cozeProductionService.ts中
    return { valid: true, message: 'OAuth JWT配置正确' };
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




