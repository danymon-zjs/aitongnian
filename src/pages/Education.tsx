import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';

export default function EducationPage() {
  const navigate = useNavigate();

  const handleExperienceClick = () => {
    // 跳转到功能特色页面
    navigate('/features');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-pink-50">
      <Navbar />
      
      <div className="container mx-auto px-4 py-24">
        {/* 装饰性背景元素 */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-16 w-16 h-16 bg-yellow-300 rounded-full opacity-20 animate-bounce"></div>
          <div className="absolute top-40 right-24 w-12 h-12 bg-pink-300 rounded-full opacity-20 animate-pulse"></div>
          <div className="absolute bottom-32 left-1/3 w-14 h-14 bg-orange-300 rounded-full opacity-20 animate-bounce"></div>
          <div className="absolute bottom-20 right-1/4 w-10 h-10 bg-red-300 rounded-full opacity-20 animate-pulse"></div>
        </div>

        <div className="max-w-6xl mx-auto relative z-10">
        {/* 页面标题 */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4" style={{fontFamily: 'Comic Sans MS, cursive'}}>
            <span className="text-orange-500">⭐</span> 专为3-15岁儿童设计 ·寓教于乐 ·激发创造潜能 <span className="text-orange-500">⭐</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed" style={{fontFamily: 'Comic Sans MS, cursive'}}>
            为贴合低龄儿童的学习天性，我们采用互动体验、游戏化学习和项目式创作相结合，让AI的世界充满乐趣与挑战。
          </p>
        </div>

        {/* 主要教学方法 */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {/* 互动体验 */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border-4 border-pink-200 transform hover:scale-105 transition-transform duration-300">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-pink-400 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl">🤝</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4" style={{fontFamily: 'Comic Sans MS, cursive'}}>
                互动体验
              </h3>
              <p className="text-gray-600 leading-relaxed" style={{fontFamily: 'Comic Sans MS, cursive'}}>
                通过语音、点击等方式与AI实时交互，在动手实践中直观感受AI的魅力。
              </p>
            </div>
          </div>

          {/* 游戏化学习 */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border-4 border-blue-200 transform hover:scale-105 transition-transform duration-300">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-blue-400 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl">🚀</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4" style={{fontFamily: 'Comic Sans MS, cursive'}}>
                游戏化学习
              </h3>
              <p className="text-gray-600 leading-relaxed" style={{fontFamily: 'Comic Sans MS, cursive'}}>
                将创作任务融入趣味游戏和角色扮演，辅以激励机制，充分调动低龄儿童对AI的热情和参与度。
              </p>
            </div>
          </div>

          {/* 项目式创作 */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border-4 border-green-200 transform hover:scale-105 transition-transform duration-300">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-green-400 to-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl">🏆</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4" style={{fontFamily: 'Comic Sans MS, cursive'}}>
                项目式创作
              </h3>
              <p className="text-gray-600 leading-relaxed" style={{fontFamily: 'Comic Sans MS, cursive'}}>
                以完成一幅画、一首歌、一个故事等具体作品为目标，引导儿童体验完整的创作流程，培养创造力。
              </p>
            </div>
          </div>
        </div>

        {/* 典型课堂流程 */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 mb-12 border-4 border-purple-200 relative overflow-hidden">
          {/* 装饰边框 */}
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400"></div>
          
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-8" style={{fontFamily: 'Comic Sans MS, cursive'}}>
            <span className="text-pink-500">🌸</span> 核心理念 <span className="text-pink-500">🌸</span>
          </h2>
          
          <div className="grid md:grid-cols-4 gap-6">
            {/* 步骤1：趣味导入 */}
            <div className="text-center p-6 bg-gradient-to-br from-pink-50 to-yellow-50 rounded-2xl border-2 border-pink-200 transform hover:scale-105 transition-transform duration-300">
              <div className="w-16 h-16 bg-gradient-to-r from-pink-400 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🎪</span>
              </div>
              <h4 className="text-lg font-bold text-gray-800 mb-2" style={{fontFamily: 'Comic Sans MS, cursive'}}>
                趣味导入
              </h4>
              <p className="text-sm text-gray-600" style={{fontFamily: 'Comic Sans MS, cursive'}}>
                游戏化情境激发兴趣
              </p>
            </div>

            {/* 步骤2：AI互动 */}
            <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl border-2 border-blue-200 transform hover:scale-105 transition-transform duration-300">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-400 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">⚙️</span>
              </div>
              <h4 className="text-lg font-bold text-gray-800 mb-2" style={{fontFamily: 'Comic Sans MS, cursive'}}>
                AI互动
              </h4>
              <p className="text-sm text-gray-600" style={{fontFamily: 'Comic Sans MS, cursive'}}>
                语音指令与AI创作
              </p>
            </div>

            {/* 步骤3：创意实践 */}
            <div className="text-center p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl border-2 border-green-200 transform hover:scale-105 transition-transform duration-300">
              <div className="w-16 h-16 bg-gradient-to-r from-green-400 to-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🎨</span>
              </div>
              <h4 className="text-lg font-bold text-gray-800 mb-2" style={{fontFamily: 'Comic Sans MS, cursive'}}>
                创意实践
              </h4>
              <p className="text-sm text-gray-600" style={{fontFamily: 'Comic Sans MS, cursive'}}>
                完成个人创作作品
              </p>
            </div>

            {/* 步骤4：分享展示 */}
            <div className="text-center p-6 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl border-2 border-yellow-200 transform hover:scale-105 transition-transform duration-300">
              <div className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">⭐</span>
              </div>
              <h4 className="text-lg font-bold text-gray-800 mb-2" style={{fontFamily: 'Comic Sans MS, cursive'}}>
                分享展示
              </h4>
              <p className="text-sm text-gray-600" style={{fontFamily: 'Comic Sans MS, cursive'}}>
                作品分享与反思
              </p>
            </div>
          </div>
        </div>

        {/* 体验按钮 */}
        <div className="text-center">
          <button 
            onClick={handleExperienceClick}
            className="px-12 py-6 bg-gradient-to-r from-pink-500 via-orange-500 to-yellow-500 text-white rounded-full hover:from-pink-600 hover:via-orange-600 hover:to-yellow-600 transition-all duration-300 shadow-2xl hover:shadow-3xl transform hover:scale-105 font-bold text-2xl"
            style={{fontFamily: 'Comic Sans MS, cursive'}}
          >
            <span className="text-3xl mr-3">✨</span>
            体验创新魔法
            <span className="text-3xl ml-3">✨</span>
          </button>
        </div>

        {/* 底部装饰 */}
        <div className="text-center mt-12">
          <div className="flex justify-center space-x-4">
            <span className="text-3xl animate-bounce">🌟</span>
            <span className="text-3xl animate-bounce" style={{animationDelay: '0.2s'}}>🎨</span>
            <span className="text-3xl animate-bounce" style={{animationDelay: '0.4s'}}>✨</span>
            <span className="text-3xl animate-bounce" style={{animationDelay: '0.6s'}}>🎉</span>
            <span className="text-3xl animate-bounce" style={{animationDelay: '0.8s'}}>🌟</span>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
}
