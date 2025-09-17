import { useState, useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import Navbar from '@/components/Navbar';
import ParticleAnimation from '@/components/ParticleAnimation';
import DataCard from '@/components/DataCard';
import { toast } from 'sonner';

// 吉祥物图片URL
const mascotImage = `https://space.coze.cn/api/coze_space/gen_image?image_size=square_hd&prompt=%24%7BencodeURIComponent%28%27%E5%8D%A1%E9%80%9A%E5%84%BF%E7%AB%A5AI%E5%8A%A9%E6%89%8B%E5%BD%A2%E8%B1%A1%EF%BC%8C%E5%9C%86%E6%B6%A6%E5%8F%AF%E7%88%B1%EF%BC%8C%E5%A4%A7%E7%9C%BC%E7%9D%9B%EF%BC%8C%E7%A7%91%E6%8A%80%E6%84%9F%EF%BC%8C%E8%93%9D%E8%89%B2%E5%92%8C%E9%BB%84%E8%89%B2%E4%B8%BB%E8%89%B2%E8%B0%83%27%29%7D&sign=e168b98fe46d87b251740e03a70bffb1`;

const heroImage = `https://s.coze.cn/t/0pUfI8bD9HM/?width_heigth=1096x1096`;

const particleParams = {
  particleCount: 150,
  color: '#4A90E2'
};

const educationData = [
  {
    title: '创造力提升',
    value: '87%',
    icon: 'lightbulb',
    color: '#4A90E2'
  },
  {
    title: '认知发展加速',
    value: '2.3倍',
    icon: 'brain',
    color: '#7ED321'
  },
  {
    title: '用户满意度',
    value: '98%',
    icon: 'smile',
    color: '#F5A623'
  }
];

const visionItems = [
  {
    title: '热爱驱动',
    description: '从"要我学"到"我要创造"的内在动机激发',
    icon: 'heart'
  },
  {
    title: '双轨赋能',
    description: '传统技能×AI思维的融合培养',
    icon: 'robot'
  },
  {
    title: '无痛学习',
    description: '游戏化机制让兴趣培养像玩一样自然',
    icon: 'gamepad'
  }
];

export default function Home() {
  const [isHeroLoaded, setIsHeroLoaded] = useState(false);
  const controls = useAnimation();

  useEffect(() => {
    controls.start({
      opacity: 1,
      y: 0,
      transition: { duration: 0.8 }
    });
  }, []);

  const handleDataCardClick = (title: string) => {
    toast.success(`查看${title}详情`);
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-blue-50 to-white overflow-hidden">
      {/* Particle Animation */}
      <ParticleAnimation {...particleParams} />

      {/* Navbar */}
      <Navbar />

      {/* Hero Section */}
      <div className="relative pt-24 pb-16 md:pt-32 md:pb-24">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-10 md:mb-0">
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={controls}
                className="text-4xl md:text-5xl lg:text-6xl font-bold text-blue-800 mb-6"
                style={{ fontFamily: '"Comic Sans MS", cursive' }}
              >
                让AI成为童年的翅膀 <span className="text-yellow-500">✨</span>
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ ...controls, transition: { delay: 0.2 } }}
                className="text-xl md:text-2xl text-blue-600 mb-8"
              >
                激活热爱，童启未来
              </motion.p>
              
              {/* 吉祥物展示 */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1, transition: { delay: 0.4 } }}
                className="relative w-40 h-40 mx-auto md:mx-0"
              >
                <img 
                  src={mascotImage}
                  alt="哎童童吉祥物"
                  className="w-full h-full object-contain"
                  onLoad={() => setIsHeroLoaded(true)}
                />
                {!isHeroLoaded && (
                  <div className="absolute inset-0 bg-blue-100 rounded-full flex items-center justify-center">
                    <div className="animate-pulse text-blue-600">加载中...</div>
                  </div>
                )}
              </motion.div>
            </div>

            <div className="md:w-1/2">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1, transition: { delay: 0.3 } }}
                className="rounded-2xl overflow-hidden shadow-xl relative"
              >
                <img 
                  src={heroImage}
                  alt="小哎老师"
                  className="w-full h-auto object-cover"
                  loading="lazy"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                   <h2 className="text-3xl font-bold text-center text-white" style={{ fontFamily: '"Comic Sans MS", cursive' }}>
                     魔法童画
                   </h2>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* Vision Section */}
      <div className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-blue-800">我们的使命</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {visionItems.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0, transition: { delay: index * 0.1 + 0.5 } }}
                whileHover={{ y: -5 }}
                className="bg-white rounded-xl shadow-lg p-6 text-center"
              >
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-blue-100 flex items-center justify-center">
                  <i className={`fas fa-${item.icon} text-2xl text-blue-600`}></i>
                </div>
                <h3 className="text-xl font-bold mb-2 text-blue-800">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Data Section */}
      <div className="py-16 bg-gradient-to-r from-blue-50 to-green-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-blue-800">我们的成果</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {educationData.map((data, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0, transition: { delay: index * 0.1 + 0.5 } }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <DataCard
                  title={data.title}
                  value={data.value}
                  icon={data.icon}
                  onClick={() => handleDataCardClick(data.title)}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}