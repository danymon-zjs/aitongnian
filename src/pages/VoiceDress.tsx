import React, { useEffect, useRef, useState } from 'react';
import { initCozeSDKCorrect } from '../lib/cozeSDKCorrect';
import { getAppId } from '../config/cozeApps';
import LoginModal from '../components/LoginModal';
import { authService } from '../lib/authService';

/**
 * 语音互动页面组件
 */
const VoicePage: React.FC = () => {
  // SDK容器引用
  const sdkContainerRef = useRef<HTMLDivElement>(null);
  // SDK实例状态
  const [sdkInstance, setSdkInstance] = useState<any>(null);
  // 加载状态
  const [isLoading, setIsLoading] = useState<boolean>(true);
  // 错误状态
  const [error, setError] = useState<string | null>(null);
  // 登录状态
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  // 检查认证状态
  useEffect(() => {
    const checkAuthStatus = () => {
      const authenticated = authService.isLoggedIn();
      setIsAuthenticated(authenticated);
      
      if (!authenticated) {
        setShowLoginPrompt(true);
      }
    };

    checkAuthStatus();
  }, []);

  // 初始化Coze Chat SDK
  useEffect(() => {
    const initializeSDK = async () => {
      // 只有认证用户才能初始化应用
      if (!authService.hasAgentAccess()) {
        setShowLoginPrompt(true);
        setIsLoading(false);
        return;
      }

      try {
        console.log('开始初始化Voice页面Chat SDK...');
        
        // 等待DOM渲染完成
        await new Promise(resolve => setTimeout(resolve, 100));
        
        if (!sdkContainerRef.current) {
          throw new Error('SDK容器未找到');
        }

        console.log('SDK容器已找到:', sdkContainerRef.current);

        setIsLoading(true);
        setError(null);

        // 获取语音互动应用ID
        const appId = getAppId('voice');
        console.log('获取到应用ID:', appId);
        
        // 使用Chat SDK方式初始化
        console.log('使用Chat SDK方式初始化...');
        const instance = await initCozeSDKCorrect(appId, sdkContainerRef.current, 'voice');
        console.log('Chat SDK实例创建成功:', instance);
        setSdkInstance(instance);
        setShowLoginPrompt(false);
        
        // 添加成功提示
        console.log('Voice页面初始化完成，SDK已成功加载');
        
      } catch (err) {
        console.error('初始化Voice页面Chat SDK失败:', err);
        setError(err instanceof Error ? err.message : '初始化失败，请稍后重试');
      } finally {
        setIsLoading(false);
      }
    };

    initializeSDK();

    // 清理函数
    return () => {
      if (sdkInstance && typeof sdkInstance.destroy === 'function') {
        try {
          sdkInstance.destroy();
        } catch (err) {
          console.error('清理SDK实例失败:', err);
        }
      }
    };
  }, [isAuthenticated]);

  // 处理登录
  const handleLogin = async (username: string, password: string): Promise<boolean> => {
    const success = await authService.login({ username, password });
    if (success) {
      setIsAuthenticated(true);
      setIsLoginModalOpen(false);
      setShowLoginPrompt(false);
    }
    return success;
  };

  // 处理登出
  const handleLogout = () => {
    authService.logout();
    setIsAuthenticated(false);
    setShowLoginPrompt(true);
    if (sdkInstance && typeof sdkInstance.destroy === 'function') {
      try {
        sdkInstance.destroy();
        setSdkInstance(null);
      } catch (err) {
        console.error('清理SDK实例失败:', err);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-50 to-blue-100 dark:from-gray-900 dark:to-gray-800 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* 页面标题区域 */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full mb-4 shadow-lg">
            <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-500 to-pink-600 bg-clip-text text-transparent mb-4" style={{fontFamily: 'Comic Sans MS, cursive'}}>
            🎤 语音互动 ✨
          </h1>
          <p className="text-xl text-gray-700 dark:text-gray-300 max-w-2xl mx-auto mb-4" style={{fontFamily: 'Comic Sans MS, cursive'}}>
            和AI小助手语音对话，体验智能语音交互！
          </p>
          
          {/* 用户状态显示 */}
          <div className="flex items-center justify-center gap-4">
            {isAuthenticated ? (
              <div className="flex items-center gap-3 bg-green-100 dark:bg-green-900/30 px-4 py-2 rounded-full">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-green-700 dark:text-green-300 font-medium" style={{fontFamily: 'Comic Sans MS, cursive'}}>
                  已登录: {authService.getCurrentUser()?.username}
                </span>
                <button
                  onClick={handleLogout}
                  className="text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-200 transition-colors"
                  style={{fontFamily: 'Comic Sans MS, cursive'}}
                >
                  退出
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsLoginModalOpen(true)}
                className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-2 rounded-full font-medium hover:shadow-lg transition-all"
                style={{fontFamily: 'Comic Sans MS, cursive'}}
              >
                🔐 登录使用智能体
              </button>
            )}
          </div>
        </div>

        {/* 主要功能区域 */}
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl shadow-2xl p-8 mb-8 border border-white/20">
          <div className="text-center mb-6">
            <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-3" style={{fontFamily: 'Comic Sans MS, cursive'}}>
              🎤 AI语音助手
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300" style={{fontFamily: 'Comic Sans MS, cursive'}}>
              点击开始对话，和AI小助手进行语音交流！
            </p>
          </div>

          <div className="relative h-[700px] w-full bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-700 dark:to-gray-600 rounded-2xl overflow-hidden border-4 border-dashed border-purple-300 dark:border-gray-500">
            {/* Coze应用容器 */}
            <div 
              ref={sdkContainerRef} 
              className="coze-sdk-container absolute inset-0"
            />
            
            {/* 登录提示覆盖层 */}
            {showLoginPrompt && (
              <div className="absolute inset-0 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm flex items-center justify-center">
                <div className="text-center p-8">
                  <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/>
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-4" style={{fontFamily: 'Comic Sans MS, cursive'}}>
                    🔐 需要登录才能使用
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-6" style={{fontFamily: 'Comic Sans MS, cursive'}}>
                    请先登录以使用AI智能体服务
                  </p>
                  <button
                    onClick={() => setIsLoginModalOpen(true)}
                    className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-3 rounded-xl font-medium hover:shadow-lg transition-all"
                    style={{fontFamily: 'Comic Sans MS, cursive'}}
                  >
                    立即登录
                  </button>
                </div>
              </div>
            )}

            {/* 加载状态 */}
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-purple-100 to-pink-100">
                <div className="text-center">
                  <div className="w-16 h-16 border-4 border-purple-300 border-t-purple-500 rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-xl font-bold text-purple-600" style={{fontFamily: 'Comic Sans MS, cursive'}}>
                    🎤 正在启动语音助手...
                  </p>
                </div>
              </div>
            )}

            {/* 错误状态 */}
            {error && (
              <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-red-100 to-pink-100">
                <div className="text-center p-8">
                  <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-red-600 mb-2" style={{fontFamily: 'Comic Sans MS, cursive'}}>
                    😔 启动失败
                  </h3>
                  <p className="text-gray-600 mb-4" style={{fontFamily: 'Comic Sans MS, cursive'}}>
                    {error}
                  </p>
                  <button
                    onClick={() => window.location.reload()}
                    className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition-colors"
                    style={{fontFamily: 'Comic Sans MS, cursive'}}
                  >
                    重新加载
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 使用指南 */}
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border border-white/20">
          <div className="flex items-center mb-6">
            <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center mr-4 shadow-lg">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-gray-800 dark:text-white" style={{fontFamily: 'Comic Sans MS, cursive'}}>
              📚 使用指南
            </h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-2xl p-6 border border-purple-200 dark:border-purple-700">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full flex items-center justify-center mr-3">
                  <span className="text-white font-bold text-lg">1</span>
                </div>
                <h3 className="text-lg font-bold text-gray-800 dark:text-white" style={{fontFamily: 'Comic Sans MS, cursive'}}>
                  🎤 开始对话
                </h3>
              </div>
              <p className="text-gray-600 dark:text-gray-300" style={{fontFamily: 'Comic Sans MS, cursive'}}>
                点击麦克风按钮开始语音对话
              </p>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-2xl p-6 border border-blue-200 dark:border-blue-700">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-cyan-500 rounded-full flex items-center justify-center mr-3">
                  <span className="text-white font-bold text-lg">2</span>
                </div>
                <h3 className="text-lg font-bold text-gray-800 dark:text-white" style={{fontFamily: 'Comic Sans MS, cursive'}}>
                  💬 智能交流
                </h3>
              </div>
              <p className="text-gray-600 dark:text-gray-300" style={{fontFamily: 'Comic Sans MS, cursive'}}>
                AI助手会理解你的语音并给出智能回复
              </p>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-teal-50 dark:from-green-900/20 dark:to-teal-900/20 rounded-2xl p-6 border border-green-200 dark:border-green-700">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-teal-500 rounded-full flex items-center justify-center mr-3">
                  <span className="text-white font-bold text-lg">3</span>
                </div>
                <h3 className="text-lg font-bold text-gray-800 dark:text-white" style={{fontFamily: 'Comic Sans MS, cursive'}}>
                  🎉 享受互动
                </h3>
              </div>
              <p className="text-gray-600 dark:text-gray-300" style={{fontFamily: 'Comic Sans MS, cursive'}}>
                体验流畅的语音交互，让AI成为你的智能伙伴
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 登录模态框 */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLogin={handleLogin}
      />
    </div>
  );
};

export default VoicePage;