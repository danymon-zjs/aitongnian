/**
 * Coze应用配置
 * 请根据实际的应用ID更新以下配置
 */

export const COZE_APP_IDS = {
  // 手抄报社应用ID
  NEWSPAPER: '7547302685909827623', // 手抄报社应用ID
  
  // 童言生画应用ID  
  SPEAK: '7548027309891518491', // 童言生画应用ID
  
  // 创想空间应用ID
  CAMERA: '7548051394683715622', // 创想空间应用ID
  
  // 语音互动应用ID
  VOICE: '7550649811847020585', // 语音互动应用ID
} as const;

// PAT令牌配置（所有应用使用相同的PAT令牌）
export const COZE_PAT_TOKENS = {
  // 手抄报社PAT令牌
  NEWSPAPER: 'pat_6JWO1CR0FIf5ep4RbPB4oE0ECyAvGS5T0g', // 手抄报社PAT令牌
  
  // 童言生画PAT令牌
  SPEAK: 'pat_6JWO1CR0FIf5ep4RbPB4oE0ECyAvGS5T0gPF3XK', // 童言生画PAT令牌
  
  // 创想空间PAT令牌
  CAMERA: 'pat_6JWO1CR0FIf5ep4RbPB4oE0ECyAvGS5T0gPF3XKNc1F', // 创想空间PAT令牌
  
  // 语音互动PAT令牌
  VOICE: 'pat_6JWO1CR0FIf5ep4RbPB4oE0ECyAvGS5T0gPF3XKN', // 语音互动PAT令牌
} as const;

/**
 * 获取应用ID
 * @param moduleType 模块类型
 * @returns 应用ID
 */
export const getAppId = (moduleType: 'newspaper' | 'camera' | 'speak' | 'voice'): string => {
  switch (moduleType) {
    case 'newspaper':
      return COZE_APP_IDS.NEWSPAPER;
    case 'speak':
      return COZE_APP_IDS.SPEAK;
    case 'camera':
      return COZE_APP_IDS.CAMERA;
    case 'voice':
      return COZE_APP_IDS.VOICE;
    default:
      throw new Error(`未知的模块类型: ${moduleType}`);
  }
};

