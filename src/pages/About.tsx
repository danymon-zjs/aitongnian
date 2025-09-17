import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';

// 公司简介
const companyInfo = {
  name: "陕西哎童年科技有限公司",
  meaning: "哎童年是AI童年的谐音，寓意用人工智能技术赋能儿童成长",
  mission: "用AI技术点燃3-12岁儿童对传统兴趣的热爱，培养第一代AI原住民",
  vision: "AI驱动的儿童兴趣启蒙与科技素养教育平台"
};

// 团队成员
const teamMembers = [
  {
    name: "张航东",
    position: "CEO & 创始人",
    avatar: "👨‍💼",
    description: "10年教育科技经验，专注于AI+教育创新",
    expertise: "战略规划、产品设计"
  },
  {
    name: "小白",
    position: "CTO & 技术总监",
    avatar: "👨‍💻",
    description: "人工智能专家，前某大厂AI研究院核心成员",
    expertise: "AI算法、技术架构"
  },
  {
    name: "赵老师",
    position: "产品经理&联合创始人",
    avatar: "👨‍🎨",
    description: "用户体验专家，专注儿童产品设计",
    expertise: "产品设计、用户研究"
  },
  {
    name: "卜老师",
    position: "研发工程师",
    avatar: "👨‍🔬",
    description: "全栈开发工程师，AI应用开发专家",
    expertise: "前端开发、AI集成"
  },
  {
    name: "Demo",
    position: "运营总监",
    avatar: "👩‍💼",
    description: "互联网运营专家，擅长用户增长",
    expertise: "用户运营、市场推广"
  }
];

// 返回顶部按钮
const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <motion.button
      className={`fixed bottom-8 right-8 w-12 h-12 bg-blue-600 text-white rounded-full shadow-lg flex items-center justify-center z-50`}
      onClick={scrollToTop}
      initial={{ opacity: 0 }}
      animate={{ opacity: isVisible ? 1 : 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
    >
      <i className="fas fa-arrow-up"></i>
    </motion.button>
  );
};

export default function AboutPage() {
  const sections = useRef<(HTMLDivElement | null)[]>([]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <Navbar />
      <ScrollToTop />

      <div className="container mx-auto px-4 py-24 max-w-7xl">
        <h1 className="text-4xl font-bold text-center mb-12 text-blue-600" style={{ fontFamily: 'Comic Sans MS' }}>
          关于我们
        </h1>

        {/* 公司简介 */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-12" ref={el => sections.current[0] = el}>
          <h2 className="text-2xl font-bold mb-4 text-blue-800">公司简介</h2>
          <p className="text-gray-600 mb-4">
            <span className="font-semibold">{companyInfo.name}</span> - {companyInfo.meaning}
          </p>
          <p className="text-gray-600 mb-4">
            使命：{companyInfo.mission}
          </p>
          <p className="text-gray-600">
            定位：{companyInfo.vision}
          </p>
        </div>

        {/* Our Team */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-12" ref={el => sections.current[1] = el}>
          <h2 className="text-3xl font-bold mb-8 text-center text-blue-800" style={{ fontFamily: 'Comic Sans MS' }}>
            Our Team
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <motion.div 
                key={index}
                className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-300"
                whileHover={{ y: -8, scale: 1.02 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                {/* 头像区域 */}
                <div className="text-center mb-4">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg">
                    <span className="text-3xl">{member.avatar}</span>
                  </div>
                  <h3 className="text-xl font-bold text-blue-800 mb-1">{member.name}</h3>
                  <p className="text-blue-600 font-medium text-sm">{member.position}</p>
                </div>
                
                {/* 描述区域 */}
                <div className="text-center mb-4">
                  <p className="text-gray-600 text-sm leading-relaxed mb-3">
                    {member.description}
                  </p>
                  <div className="bg-white rounded-full px-4 py-2 shadow-sm">
                    <p className="text-blue-700 text-xs font-medium">
                      {member.expertise}
                    </p>
                  </div>
                </div>
                
                {/* 装饰性元素 */}
                <div className="flex justify-center space-x-1">
                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                  <div className="w-2 h-2 bg-indigo-400 rounded-full"></div>
                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                </div>
              </motion.div>
            ))}
          </div>
          
          {/* 团队介绍 */}
          <div className="mt-12 text-center">
            <div className="bg-gradient-to-r from-blue-100 to-indigo-100 rounded-2xl p-8">
              <h3 className="text-2xl font-bold text-blue-800 mb-4" style={{ fontFamily: 'Comic Sans MS' }}>
                🌟 我们的团队理念
              </h3>
              <p className="text-gray-700 text-lg leading-relaxed max-w-4xl mx-auto">
                我们是一群热爱教育、专注AI技术的创新者。团队成员来自知名互联网公司和教育机构，
                拥有丰富的技术研发和教育实践经验。我们相信，通过AI技术的力量，
                可以让每个孩子都能享受到个性化、有趣的学习体验。
              </p>
            </div>
          </div>
        </div>

        {/* 联系方式 */}
        <div className="bg-white rounded-xl shadow-lg p-8" ref={el => sections.current[2] = el}>
          <h2 className="text-2xl font-bold mb-6 text-blue-800">联系我们</h2>
          <div className="space-y-4">
            <p className="text-gray-600">
              <i className="fas fa-envelope mr-2 text-blue-600"></i>
              官方邮箱：danymon@163.com
            </p>
            <p className="text-gray-600">
              <i className="fas fa-handshake mr-2 text-blue-600"></i>
              商务合作：18625292512
            </p>
            <p className="text-gray-600">
              <i className="fas fa-mobile-alt mr-2 text-blue-600"></i>
              微信小程序：搜索"魔法童画"
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}