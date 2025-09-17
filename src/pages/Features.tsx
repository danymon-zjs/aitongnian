import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';


export default function FeaturesPage() {


  return (
    <div className="relative min-h-screen bg-gradient-to-br from-blue-50 to-orange-50 overflow-hidden">
      {/* 装饰性背景元素 */}
      <div className="absolute top-20 left-10 w-8 h-8 bg-yellow-300 rounded-full opacity-60 animate-pulse"></div>
      <div className="absolute top-40 right-20 w-6 h-6 bg-pink-300 rounded-full opacity-60 animate-bounce"></div>
      <div className="absolute top-60 left-1/4 w-4 h-4 bg-green-300 rounded-full opacity-60 animate-pulse"></div>
      <div className="absolute top-80 right-1/3 w-5 h-5 bg-purple-300 rounded-full opacity-60 animate-bounce"></div>
      
      <Navbar />
      
      <div className="container mx-auto px-4 py-24">

          {/* 主标题区域 */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center mr-4 shadow-lg">
                <i className="fas fa-palette text-xl text-white"></i>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-orange-800" style={{ fontFamily: '"Comic Sans MS", cursive' }}>
                开启儿童AI创意之旅
              </h1>
            </div>
            <p className="text-lg text-orange-700 max-w-3xl mx-auto leading-relaxed" style={{ fontFamily: '"Comic Sans MS", cursive' }}>
              将AI定位为激发想象力的"魔法助手"，让每个孩子都能在玩乐中创作，在体验中成长，轻松培养面向未来的核心素养。
            </p>
            <div className="flex justify-center mt-4">
              <div className="flex space-x-1">
                <i className="fas fa-star text-yellow-400"></i>
                <i className="fas fa-star text-yellow-400"></i>
                <i className="fas fa-star text-yellow-400"></i>
              </div>
            </div>
          </div>
          
          {/* 核心特色板块 - 儿童友好设计 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {/* 说出想法 - 童言生画 */}
            <Link to="/speak" className="block">
              <motion.div 
                className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl shadow-lg p-6 cursor-pointer border-2 border-transparent hover:border-yellow-300 transition-all duration-300"
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.95 }}
                style={{ fontFamily: '"Comic Sans MS", cursive' }}
              >
                {/* 图标区域 */}
                <div className="flex items-center justify-center mb-4">
                  <div className="relative">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center shadow-lg">
                      <i className="fas fa-palette text-2xl text-white"></i>
                    </div>
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-300 rounded-full flex items-center justify-center text-xs font-bold text-orange-800">
                      1
                    </div>
                  </div>
                </div>
                
                {/* 标题 */}
                <h3 className="text-xl font-bold text-center mb-3 text-orange-800">
                  童言生画
                </h3>
                
                {/* 新增描述文字 */}
                <div className="text-center mb-4">
                  <p className="text-gray-700 text-center mb-4 leading-relaxed">
                    <span className="text-yellow-500 mr-2">✨</span>语音绘画黑科技
                  </p>
                  <p className="text-gray-700 text-center mb-4 leading-relaxed">
                    <span className="text-yellow-500 mr-2">⭐</span>激发语言表达能力
                  </p>
                  <p className="text-gray-700 text-center mb-4 leading-relaxed">
                    <span className="text-yellow-500 mr-2">🌟</span>培养逻辑思维
                  </p>
                </div>
     
                
                {/* 示例标签 */}
                <div className="bg-gradient-to-r from-pink-400 to-red-400 text-white px-3 py-1 rounded-full text-sm font-medium text-center mb-4">
                  "怪兽吃西瓜" → 立即画出来
                </div>
                
                {/* 行动按钮 */}
                <div className="text-center">
                  <div className="inline-flex items-center bg-white text-orange-600 px-4 py-2 rounded-full text-sm font-medium shadow-md hover:shadow-lg transition-shadow">
                    <span>立即体验</span>
                    <i className="fas fa-arrow-right ml-2"></i>
                  </div>
                </div>
              </motion.div>
            </Link>

            {/* 创想空间 */}
            <Link to="/camera" className="block">
              <motion.div 
                className="bg-gradient-to-br from-green-50 to-teal-50 rounded-2xl shadow-lg p-6 cursor-pointer border-2 border-transparent hover:border-green-300 transition-all duration-300"
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.95 }}
                style={{ fontFamily: '"Comic Sans MS", cursive' }}
              >
                {/* 图标区域 */}
                <div className="flex items-center justify-center mb-4">
                  <div className="relative">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-400 to-teal-500 flex items-center justify-center shadow-lg">
                      <i className="fas fa-rocket text-2xl text-white"></i>
                    </div>
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-300 rounded-full flex items-center justify-center text-xs font-bold text-green-800">
                      2
                    </div>
                  </div>
                </div>
                
                {/* 标题 */}
                <h3 className="text-xl font-bold text-center mb-3 text-green-800">
                  创想空间
                </h3>
                
                {/* 新增描述文字 */}
                <div className="text-center mb-4">
                  <p className="text-gray-700 text-center mb-4 leading-relaxed">
                    <span className="text-yellow-500 mr-2">✨</span>零门槛创作工具
                  </p>
                  <p className="text-gray-700 text-center mb-4 leading-relaxed">
                    <span className="text-yellow-500 mr-2">⭐</span>培养艺术审美
                  </p>
                  <p className="text-gray-700 text-center mb-4 leading-relaxed">
                    <span className="text-yellow-500 mr-2">🌟</span>提升专注力
                  </p>
                </div>
                
                {/* 示例标签 */}
                <div className="bg-gradient-to-r from-green-400 to-teal-400 text-white px-3 py-1 rounded-full text-sm font-medium text-center mb-4">
                  超萌超可爱
                </div>
                
                {/* 行动按钮 */}
                <div className="text-center">
                  <div className="inline-flex items-center bg-white text-green-600 px-4 py-2 rounded-full text-sm font-medium shadow-md hover:shadow-lg transition-shadow">
                    <span>立即体验</span>
                    <i className="fas fa-arrow-right ml-2"></i>
                  </div>
                </div>
              </motion.div>
            </Link>

            {/* 语音玩装扮 */}
            <Link to="/voice" className="block">
              <motion.div 
                className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl shadow-lg p-6 cursor-pointer border-2 border-transparent hover:border-purple-300 transition-all duration-300"
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.95 }}
                style={{ fontFamily: '"Comic Sans MS", cursive' }}
              >
                {/* 图标区域 */}
                <div className="flex items-center justify-center mb-4">
                  <div className="relative">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center shadow-lg">
                      <i className="fas fa-star text-2xl text-white"></i>
                    </div>
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-purple-300 rounded-full flex items-center justify-center text-xs font-bold text-purple-800">
                      3
                    </div>
                  </div>
                </div>
                
                {/* 标题 */}
                <h3 className="text-xl font-bold text-center mb-3 text-purple-800">
                  语音互动
                </h3>
                {/* 新增描述文字 */}
                <div className="text-center mb-4">
                  <p className="text-gray-700 text-center mb-4 leading-relaxed">
                    <span className="text-yellow-500 mr-2">✨</span>培养社交沟通技能
                  </p>
                  <p className="text-gray-700 text-center mb-4 leading-relaxed">
                    <span className="text-yellow-500 mr-2">⭐</span>增强情商与心理素质
                  </p>
                  <p className="text-gray-700 text-center mb-4 leading-relaxed">
                    <span className="text-yellow-500 mr-2">🌟</span>提升持续学习兴趣
                  </p>
                </div>
         
                {/* 示例标签 */}
                <div className="bg-gradient-to-r from-purple-400 to-pink-400 text-white px-3 py-1 rounded-full text-sm font-medium text-center mb-4">
                  聊天陪伴知识问答 随意切换
                </div>
                
                {/* 行动按钮 */}
                <div className="text-center">
                  <div className="inline-flex items-center bg-white text-purple-600 px-4 py-2 rounded-full text-sm font-medium shadow-md hover:shadow-lg transition-shadow">
                    <span>立即体验</span>
                    <i className="fas fa-arrow-right ml-2"></i>
                  </div>
                </div>
              </motion.div>
            </Link>

            {/* 手抄报社 */}
            <Link to="/newspaper" className="block">
              <motion.div 
                className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl shadow-lg p-6 cursor-pointer border-2 border-transparent hover:border-blue-300 transition-all duration-300"
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.95 }}
                style={{ fontFamily: '"Comic Sans MS", cursive' }}
              >
                {/* 图标区域 */}
                <div className="flex items-center justify-center mb-4">
                  <div className="relative">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center shadow-lg">
                      <i className="fas fa-newspaper text-2xl text-white"></i>
                    </div>
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-blue-300 rounded-full flex items-center justify-center text-xs font-bold text-blue-800">
                      4
                    </div>
                  </div>
                </div>
                
                {/* 标题 */}
                <h3 className="text-xl font-bold text-center mb-3 text-blue-800">
                  手抄报社
                </h3>
                
                {/* 新增描述文字 */}
                <div className="text-center mb-4">
                  <p className="text-gray-700 text-center mb-4 leading-relaxed">
                    <span className="text-yellow-500 mr-2">✨</span>培养创作思维
                  </p>
                  <p className="text-gray-700 text-center mb-4 leading-relaxed">
                    <span className="text-yellow-500 mr-2">⭐</span>锻炼动手能力
                  </p>
                  <p className="text-gray-700 text-center mb-4 leading-relaxed">
                    <span className="text-yellow-500 mr-2">🌟</span>提升组织能力
                  </p>
                </div>
                
                {/* 示例标签 */}
                <div className="bg-gradient-to-r from-blue-400 to-indigo-400 text-white px-3 py-1 rounded-full text-sm font-medium text-center mb-4">
                  "春节手抄报" → 立即设计
                </div>
                
                {/* 行动按钮 */}
                <div className="text-center">
                  <div className="inline-flex items-center bg-white text-blue-600 px-4 py-2 rounded-full text-sm font-medium shadow-md hover:shadow-lg transition-shadow">
                    <span>立即体验</span>
                    <i className="fas fa-arrow-right ml-2"></i>
                  </div>
                </div>
              </motion.div>
            </Link>
          </div>
          {/* AI小哎老师板块 - 优化设计 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0, transition: { delay: 0.4 } }}
            className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl shadow-lg overflow-hidden mb-16 border-2 border-blue-100"
          >
            <div className="md:flex">
              {/* 左侧图标区域 */}
              <div className="md:w-1/3 bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center p-8 relative">
                <div className="relative">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center shadow-lg">
                    <i className="fas fa-robot text-4xl text-white"></i>
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center shadow-md">
                    <i className="fas fa-sparkles text-sm text-white"></i>
                  </div>
                </div>
                <div className="absolute bottom-4 right-4">
                  <div className="flex space-x-1">
                    <i className="fas fa-star text-yellow-400 text-sm"></i>
                    <i className="fas fa-star text-yellow-400 text-sm"></i>
                    <i className="fas fa-star text-yellow-400 text-sm"></i>
                  </div>
                </div>
              </div>
              
              {/* 右侧内容区域 */}
              <div className="md:w-2/3 p-8">
                <div className="flex items-center mb-4">
                  <h2 className="text-2xl font-bold text-blue-800 mr-3" style={{ fontFamily: '"Comic Sans MS", cursive' }}>
                    AI小哎老师
                  </h2>
                  <div className="bg-gradient-to-r from-pink-400 to-purple-400 text-white px-3 py-1 rounded-full text-sm font-medium">
                    你的专属创意伙伴
                  </div>
                </div>
                
                <p className="text-gray-700 leading-relaxed mb-4" style={{ fontFamily: '"Comic Sans MS", cursive' }}>
                  由AI驱动的虚拟指导老师，通过语音交互引导儿童创作，提供实时反馈与创意启发，让孩子在互动中提升表达能力
                </p>
                
                {/* 特色标签 */}
                <div className="flex flex-wrap gap-2">
                  <div className="bg-white text-blue-600 px-3 py-1 rounded-full text-sm font-medium shadow-sm">
                    <i className="fas fa-microphone mr-1"></i>
                    语音交互
                  </div>
                  <div className="bg-white text-green-600 px-3 py-1 rounded-full text-sm font-medium shadow-sm">
                    <i className="fas fa-lightbulb mr-1"></i>
                    创意启发
                  </div>
                  <div className="bg-white text-purple-600 px-3 py-1 rounded-full text-sm font-medium shadow-sm">
                    <i className="fas fa-heart mr-1"></i>
                    贴心陪伴
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

  

      </div>
    </div>
  );
}
