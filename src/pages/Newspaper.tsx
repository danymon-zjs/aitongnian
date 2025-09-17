import React, { useEffect, useRef, useState } from 'react';
import { initCozeSDKCorrect } from '../lib/cozeSDKCorrect';
import { getAppId } from '../config/cozeApps';
import LoginModal from '../components/LoginModal';
import { authService } from '../lib/authService';

/**
 * 手抄报社页面组件
 */
const Newspaper: React.FC = () => {
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

  // 初始化Coze SDK
  useEffect(() => {
    const initializeSDK = async () => {
      // 只有认证用户才能初始化应用
      if (!authService.hasAgentAccess()) {
        setShowLoginPrompt(true);
        setIsLoading(false);
        return;
      }

      try {
        // 等待DOM渲染完成
        await new Promise(resolve => setTimeout(resolve, 100));
        
        if (!sdkContainerRef.current) {
          throw new Error('SDK容器未找到');
        }

        setIsLoading(true);
        setError(null);

        // 获取手抄报社应用ID
        const appId = getAppId('newspaper');
        const instance = await initCozeSDKCorrect(appId, sdkContainerRef.current, 'newspaper');
        setSdkInstance(instance);
        setShowLoginPrompt(false);
      } catch (err) {
        console.error('初始化Coze SDK失败:', err);
        setError(err instanceof Error ? err.message : '初始化失败，请稍后重试');
      } finally {
        setIsLoading(false);
      }
    };

    initializeSDK();

    // 清理函数
    return () => {
      if (sdkInstance) {
        try {
          sdkInstance.destroy();
        } catch (err) {
          console.error('销毁SDK实例失败:', err);
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
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-yellow-50 to-orange-100 py-8 px-4 sm:px-6 lg:px-8">
      {/* 装饰性背景元素 */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 w-20 h-20 bg-yellow-300 rounded-full opacity-20 animate-bounce"></div>
        <div className="absolute top-32 right-20 w-16 h-16 bg-pink-300 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-orange-300 rounded-full opacity-20 animate-bounce"></div>
        <div className="absolute bottom-32 right-1/3 w-14 h-14 bg-red-300 rounded-full opacity-20 animate-pulse"></div>
      </div>

      <div className="max-w-5xl mx-auto relative z-10">
        {/* 页面标题区域 - 更儿童化的设计 */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-r from-pink-400 via-yellow-400 to-orange-400 rounded-full mb-6 shadow-2xl transform hover:scale-105 transition-transform duration-300">
            <span className="text-4xl">📰</span>
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-pink-600 via-yellow-500 to-orange-500 bg-clip-text text-transparent mb-4" style={{fontFamily: 'Comic Sans MS, cursive'}}>
            🎨 手抄报社 🎨
          </h1>
          <p className="text-2xl text-gray-700 font-medium mb-4" style={{fontFamily: 'Comic Sans MS, cursive'}}>
            🌟 小智哥哥帮你做超棒的手抄报！🌟
          </p>
          
          {/* 用户状态显示 */}
          <div className="flex items-center justify-center gap-4 mb-4">
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
          
          <div className="flex justify-center mt-4">
            <span className="text-2xl animate-bounce">✨</span>
            <span className="text-2xl animate-bounce mx-2" style={{animationDelay: '0.1s'}}>🎨</span>
            <span className="text-2xl animate-bounce" style={{animationDelay: '0.2s'}}>✨</span>
          </div>
        </div>

        {/* 主要创作区域 - 更活泼的设计 */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 mb-8 border-4 border-yellow-300 relative overflow-hidden">
          {/* 装饰边框 */}
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-pink-400 via-yellow-400 to-orange-400"></div>
          
          <div className="text-center mb-6">
            <h2 className="text-3xl font-bold text-gray-800 mb-3" style={{fontFamily: 'Comic Sans MS, cursive'}}>
              🤖 智能创作小助手 🤖
            </h2>
            <p className="text-lg text-gray-600" style={{fontFamily: 'Comic Sans MS, cursive'}}>
              告诉小智哥哥你想要什么主题，他就能帮你设计超棒的手抄报！
            </p>
          </div>

          <div className="relative h-[650px] w-full rounded-2xl overflow-hidden border-4 border-pink-200">
            {/* SDK容器 */}
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

            {/* 加载状态 - 更儿童化 */}
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-pink-100 to-yellow-100">
                <div className="text-center">
                  <div className="relative mb-6">
                    <div className="w-20 h-20 border-6 border-pink-300 border-t-pink-500 rounded-full animate-spin mx-auto"></div>
                    <div className="absolute inset-0 w-20 h-20 border-6 border-transparent border-t-yellow-400 rounded-full animate-spin mx-auto" style={{animationDirection: 'reverse', animationDuration: '1.5s'}}></div>
                  </div>
                  <p className="text-2xl font-bold text-pink-600 mb-2" style={{fontFamily: 'Comic Sans MS, cursive'}}>
                    🎨 小智哥哥正在准备中...
                  </p>
                  <p className="text-lg text-gray-600" style={{fontFamily: 'Comic Sans MS, cursive'}}>
                    马上就好，请稍等片刻！
                  </p>
                </div>
              </div>
            )}

            {/* 错误状态 - 更友好的设计 */}
            {error && (
              <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-red-50 to-pink-50 p-6">
                <div className="text-center max-w-md">
                  <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-4xl">😔</span>
                  </div>
                  <p className="text-xl font-bold text-red-600 mb-4" style={{fontFamily: 'Comic Sans MS, cursive'}}>
                    哎呀，出小问题了！
                  </p>
                  <p className="text-red-500 mb-6">{error}</p>
                  <button 
                    onClick={() => window.location.reload()}
                    className="px-8 py-4 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-full hover:from-pink-600 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 font-bold text-lg"
                    style={{fontFamily: 'Comic Sans MS, cursive'}}
                  >
                    🔄 重新试试
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 使用指南 - 更生动的设计 */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 border-4 border-blue-300 relative overflow-hidden">
          {/* 装饰边框 */}
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-400 via-green-400 to-purple-400"></div>
          
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-8" style={{fontFamily: 'Comic Sans MS, cursive'}}>
            📚 使用指南 📚
          </h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-gradient-to-br from-pink-50 to-yellow-50 rounded-2xl border-2 border-pink-200 transform hover:scale-105 transition-transform duration-300">
              <div className="w-16 h-16 bg-gradient-to-r from-pink-400 to-yellow-400 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-white">
                1
              </div>
              <p className="text-lg font-medium text-gray-700" style={{fontFamily: 'Comic Sans MS, cursive'}}>
                🗣️ 告诉小智哥哥你想要什么主题
              </p>
              <p className="text-sm text-gray-600 mt-2" style={{fontFamily: 'Comic Sans MS, cursive'}}>
                比如：教师节、科学探索、春天来了...
              </p>
            </div>
            
            <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-green-50 rounded-2xl border-2 border-blue-200 transform hover:scale-105 transition-transform duration-300">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-400 to-green-400 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-white">
                2
              </div>
              <p className="text-lg font-medium text-gray-700" style={{fontFamily: 'Comic Sans MS, cursive'}}>
                🎨 选择小智哥哥的建议
              </p>
              <p className="text-sm text-gray-600 mt-2" style={{fontFamily: 'Comic Sans MS, cursive'}}>
                他会给你很多漂亮的创意和设计
              </p>
            </div>
            
            <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl border-2 border-purple-200 transform hover:scale-105 transition-transform duration-300">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-white">
                3
              </div>
              <p className="text-lg font-medium text-gray-700" style={{fontFamily: 'Comic Sans MS, cursive'}}>
                📥 下载素材完成创作
              </p>
              <p className="text-sm text-gray-600 mt-2" style={{fontFamily: 'Comic Sans MS, cursive'}}>
                把素材打印出来，开始你的创作吧！
              </p>
            </div>
          </div>
        </div>

        {/* 底部装饰 */}
        <div className="text-center mt-8">
          <div className="flex justify-center space-x-4">
            <span className="text-3xl animate-bounce">🌟</span>
            <span className="text-3xl animate-bounce" style={{animationDelay: '0.2s'}}>🎨</span>
            <span className="text-3xl animate-bounce" style={{animationDelay: '0.4s'}}>✨</span>
            <span className="text-3xl animate-bounce" style={{animationDelay: '0.6s'}}>🎉</span>
            <span className="text-3xl animate-bounce" style={{animationDelay: '0.8s'}}>🌟</span>
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

export default Newspaper;