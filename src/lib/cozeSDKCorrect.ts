import { toast } from '@/components/Toast';
import { COZE_PAT_TOKENS } from '@/config/cozeApps';

// 声明全局Coze Web SDK类型 - 统一使用AppWebSDK
declare global {
  interface Window {
    CozeWebSDK: {
      // AppWebSDK类型（统一使用）
      AppWebSDK?: new (config: {
        token: string;
        appId: string;
        container: HTMLElement;
        userInfo: {
          userId: string;
          userName: string;
          avatar: string;
        };
      }) => {
        destroy?: () => void;
      };
    };
  }
}

/**
 * Coze SDK 正确实现
 * 提供统一的SDK初始化和状态管理功能
 */

/**
 * 获取PAT令牌（个人访问令牌）
 * @param moduleType 模块类型
 * @returns string PAT令牌
 */
export const getPATToken = (moduleType: 'newspaper' | 'camera' | 'speak' | 'voice'): string => {
  const tokenMap = {
    newspaper: COZE_PAT_TOKENS.NEWSPAPER,
    camera: COZE_PAT_TOKENS.CAMERA,
    speak: COZE_PAT_TOKENS.SPEAK,
    voice: COZE_PAT_TOKENS.VOICE
  };
  
  const token = tokenMap[moduleType];
  
  // 检查是否已配置真实的PAT令牌
  if (!token || token.length < 10 || token.includes('YOUR_')) {
    throw new Error(`请先配置${moduleType}模块的PAT令牌`);
  }
  
  return token;
};

/**
 * 动态加载Coze Web SDK脚本
 * @param moduleType 模块类型，用于选择不同的SDK版本
 */
const loadCozeSDKScript = (moduleType: 'newspaper' | 'camera' | 'speak' | 'voice'): Promise<void> => {
  return new Promise((resolve, reject) => {
    // 检查是否已经加载
    if (window.CozeWebSDK) {
      console.log('Coze Web SDK 已经加载');
      resolve();
      return;
    }

    console.log('开始加载Coze Web SDK脚本...');
    
    // 所有模块统一使用旧版本SDK（支持AppWebSDK）
    console.log(`${moduleType}页面：使用旧版本SDK（支持AppWebSDK）`);
    const sdkUrls = [
      'https://lf-cdn.coze.cn/obj/unpkg/flow-platform/builder-web-sdk/0.1.0/dist/umd/index.js', // 支持AppWebSDK
      'https://lf-cdn.coze.cn/obj/unpkg/flow-platform/web-chat-sdk/0.1.0/dist/index.js', // 备用版本
      'https://lf-cdn.coze.cn/obj/unpkg/flow-platform/web-chat-sdk/1.0.0/dist/index.js', // 备用版本
    ];

    let currentUrlIndex = 0;

    const tryLoadScript = () => {
      if (currentUrlIndex >= sdkUrls.length) {
        console.error('所有SDK URL都加载失败');
        reject(new Error('无法加载Coze Web SDK - 所有URL都失败'));
        return;
      }

      const script = document.createElement('script');
      script.src = sdkUrls[currentUrlIndex];
      
      console.log(`尝试加载SDK URL ${currentUrlIndex + 1}: ${script.src}`);
      
      script.onload = () => {
        console.log(`Coze Web SDK 脚本加载成功 (URL ${currentUrlIndex + 1})`);
        
        // 等待一小段时间确保SDK完全初始化
        setTimeout(() => {
          console.log('CozeWebSDK对象:', window.CozeWebSDK);
          console.log('CozeWebSDK类型:', typeof window.CozeWebSDK);
          
          // 检查是否有其他可能的构造函数
          if (window.CozeWebSDK) {
            console.log('CozeWebSDK的所有属性:', Object.keys(window.CozeWebSDK));
            
            // 检查是否有其他可能的构造函数名称
            const possibleConstructors = ['AppWebSDK', 'ChatClient', 'Client', 'CozeClient'];
            for (const constructorName of possibleConstructors) {
              if ((window.CozeWebSDK as any)[constructorName]) {
                console.log(`找到可能的构造函数: ${constructorName}`, typeof (window.CozeWebSDK as any)[constructorName]);
              }
            }
            
            // 所有模块统一检查AppWebSDK是否存在
            if (window.CozeWebSDK.AppWebSDK) {
              console.log('✅ AppWebSDK已找到');
              resolve();
            } else {
              console.warn(`❌ AppWebSDK未找到，尝试下一个SDK版本...`);
              currentUrlIndex++;
              tryLoadScript();
              return;
            }
          } else {
            console.warn('❌ CozeWebSDK未定义，尝试下一个SDK版本...');
            currentUrlIndex++;
            tryLoadScript();
            return;
          }
        }, 100);
      };
      
      script.onerror = (error) => {
        console.error(`SDK URL ${currentUrlIndex + 1} 加载失败:`, error);
        currentUrlIndex++;
        // 移除失败的脚本
        if (script.parentNode) {
          script.parentNode.removeChild(script);
        }
        // 尝试下一个URL
        setTimeout(tryLoadScript, 100);
      };
      
      document.head.appendChild(script);
    };

    tryLoadScript();
  });
};

/**
 * 使用Coze Web SDK正确方式初始化应用
 * @param appId 应用ID
 * @param container 容器元素
 * @param moduleType 模块类型
 * @returns Promise<any> 返回SDK实例
 */
export const initCozeSDKCorrect = async (appId: string, container: HTMLElement, moduleType: 'newspaper' | 'camera' | 'speak' | 'voice'): Promise<any> => {
  try {
    // 为容器添加唯一ID和样式
    const containerId = `coze-sdk-${moduleType}-${Date.now()}`;
    container.id = containerId;
    container.className = 'coze-sdk-container';
    
    // 清空容器内容
    container.innerHTML = '';
    
    // 检查应用ID是否已配置
    if (appId.includes('YOUR_') || appId === 'YOUR_APP_ID') {
      throw new Error(`请先配置${moduleType}模块的应用ID`);
    }

    // 获取PAT令牌
    const patToken = getPATToken(moduleType);
    
    console.log(`正在初始化${moduleType}应用:`, {
      appId,
      containerId,
      moduleType,
      patToken: patToken.substring(0, 20) + '...' // 只显示token的前20个字符
    });
    
    // 动态加载Coze Web SDK
    console.log('开始加载Coze Web SDK脚本...');
    await loadCozeSDKScript(moduleType);
    console.log('Coze Web SDK脚本加载完成');
    
    // 添加服务器状态检查
    console.log('检查Coze服务器状态...');
    try {
      await fetch('https://api.coze.cn/v1/apps/' + appId + '/ui_builder_dsl?channel=web', {
        method: 'GET',
        mode: 'no-cors'
      });
      console.log('服务器状态检查完成');
    } catch (error) {
      console.warn('服务器状态检查失败，但继续尝试初始化SDK:', error);
    }
    
    // 使用正确的SDK初始化方式
    console.log('开始创建AppWebSDK实例...');
    console.log('容器元素:', container);
    console.log('CozeWebSDK对象:', window.CozeWebSDK);
    console.log('CozeWebSDK类型:', typeof window.CozeWebSDK);
    
    // 检查SDK是否正确加载
    if (!window.CozeWebSDK) {
      throw new Error('CozeWebSDK未定义，SDK可能未正确加载');
    }
    
    // 所有模块统一使用AppWebSDK
    const SDKConstructor = window.CozeWebSDK.AppWebSDK;
    if (!SDKConstructor) {
      throw new Error('AppWebSDK未定义，可能是SDK版本不兼容');
    }
    
    // AppWebSDK的配置格式（统一配置）
    const sdkConfig = {
      token: patToken,
      appId: appId,
      container: container,
      userInfo: {
        userId: `user_${Date.now()}`,
        userName: "小用户",
        avatar: "👶"
      }
    };
    
    if (!SDKConstructor) {
      console.error('CozeWebSDK对象:', window.CozeWebSDK);
      console.error('CozeWebSDK的所有属性:', Object.keys(window.CozeWebSDK));
      throw new Error('未找到合适的SDK构造函数');
    }
    
    if (typeof SDKConstructor !== 'function') {
      throw new Error(`SDK构造函数不是函数，实际类型: ${typeof SDKConstructor}`);
    }
    
    console.log('使用SDK构造函数: AppWebSDK');
    
    console.log('SDK配置:', sdkConfig);
    const sdkInstance = new (SDKConstructor as any)(sdkConfig);
    
    console.log('SDK实例创建完成:', sdkInstance);
    
    // SDK初始化完成
    console.log(`Coze SDK (${moduleType}) 初始化完成`);
    toast.success('智能助手已加载成功');
    
    return sdkInstance;
  } catch (error) {
    console.error(`初始化Coze应用 (${moduleType}) 失败:`, error);
    toast.error(`智能助手初始化失败: ${error instanceof Error ? error.message : '未知错误'}`);
    throw error;
  }
};

/**
 * 创建加载状态显示
 * @param container 容器元素
 * @param moduleType 模块类型
 */
export const showLoadingState = (container: HTMLElement, moduleType: 'newspaper' | 'camera' | 'speak' | 'voice') => {
  const moduleNames = {
    newspaper: '手抄报社',
    camera: '创想空间',
    speak: '童言生画',
    voice: '语音互动'
  };
  
  container.innerHTML = `
    <div class="flex items-center justify-center h-full bg-gradient-to-br from-blue-100 to-purple-100 dark:from-gray-800 dark:to-gray-700 rounded-2xl">
      <div class="text-center">
        <div class="relative mb-6">
          <div class="w-16 h-16 border-4 border-blue-300 border-t-blue-500 rounded-full animate-spin mx-auto"></div>
          <div class="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-purple-400 rounded-full animate-spin mx-auto" style="animation-direction: reverse; animation-duration: 1.5s;"></div>
        </div>
        <p class="text-gray-700 dark:text-gray-300 font-medium text-lg" style="font-family: 'Comic Sans MS', cursive;">
          🎨 ${moduleNames[moduleType]}正在准备中...
        </p>
        <p class="text-gray-500 dark:text-gray-400 text-sm mt-2" style="font-family: 'Comic Sans MS', cursive;">
          请稍等片刻，马上就好！
        </p>
      </div>
    </div>
  `;
};

/**
 * 创建错误状态显示
 * @param container 容器元素
 * @param error 错误信息
 * @param moduleType 模块类型
 */
export const showErrorState = (container: HTMLElement, error: string, moduleType: 'newspaper' | 'camera' | 'speak' | 'voice') => {
  const moduleNames = {
    newspaper: '手抄报社',
    camera: '创想空间',
    speak: '童言生画',
    voice: '语音互动'
  };
  
  container.innerHTML = `
    <div class="flex items-center justify-center h-full bg-gradient-to-br from-red-50 to-pink-50 dark:from-red-900 dark:to-pink-900 rounded-2xl p-6">
      <div class="text-center max-w-md">
        <div class="w-16 h-16 bg-red-100 dark:bg-red-800 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg class="w-8 h-8 text-red-500 dark:text-red-400" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
          </svg>
        </div>
        <p class="text-red-600 dark:text-red-400 font-medium mb-4 text-lg" style="font-family: 'Comic Sans MS', cursive;">
          😔 哎呀，${moduleNames[moduleType]}出小问题了！
        </p>
        <p class="text-red-500 dark:text-red-300 text-sm mb-6">${error}</p>
        <button 
          onclick="window.location.reload()"
          class="px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-full hover:from-pink-600 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 font-medium"
          style="font-family: 'Comic Sans MS', cursive;"
        >
          🔄 重新试试
        </button>
      </div>
    </div>
  `;
};
