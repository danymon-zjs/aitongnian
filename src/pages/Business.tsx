import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '@/components/Navbar';
import { toast } from 'sonner';

// Mock data for case studies
const caseStudies = [
  {
    id: 1,
    name: '阳光幼儿园',
    beforeImage: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=children%20drawing%20on%20paper%2C%20simple%20sketch&sign=30822c71b89d5a01286219891c6ebd80',
    afterImage: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=AI%20generated%20art%20from%20children%20drawing%2C%20colorful%20and%20detailed&sign=2661e61e5a3b00507676ea3531a9ec1e',
    detail: '通过魔法童画AI绘画系统，阳光幼儿园的艺术课程参与率提升了65%，学生作品在区级比赛中获得多个奖项。'
  },
  {
    id: 2,
    name: '彩虹艺术中心',
    beforeImage: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=child%20holding%20a%20simple%20drawing&sign=f764d76ec11ab18a52e7e7193a2ba345',
    afterImage: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=AI%20enhanced%20version%20of%20child%27s%20drawing%2C%20professional%20art%20style&sign=373f721941abccdacc19e4f93c37c0eb',
    detail: '彩虹艺术中心采用我们的技术后，家长满意度达到97%，续课率提高了40%。'
  },
  {
    id: 3,
    name: '未来小学',
    beforeImage: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=classroom%20with%20children%20drawing%20traditionally&sign=df761a09a8b3050952cec116255d7a5f',
    afterImage: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=same%20classroom%20with%20children%20using%20AI%20drawing%20tablets&sign=8b2ec743a6f5adf38f8b664388aa0155',
    detail: '未来小学将我们的技术融入STEAM课程，显著提升了学生的创造力和技术素养。'
  }
];

// Mock data for API parameters
const styleOptions = ['卡通', '水彩', '油画', '像素艺术'];
const colorOptions = ['明亮', '柔和', '单色', '对比'];


export default function BusinessPage() {
  const [selectedCase, setSelectedCase] = useState<number | null>(null);
  const [apiParams, setApiParams] = useState({
    style: styleOptions[0],
    complexity: 50,
    color: colorOptions[0]
  });
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    organization: '',
    message: ''
  });

  const handleCaseClick = (id: number) => {
    setSelectedCase(selectedCase === id ? null : id);
  };

  const handleParamChange = (param: string, value: string | number) => {
    setApiParams(prev => ({
      ...prev,
      [param]: value
    }));
    toast.success(`参数已更新: ${param} = ${value}`);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('预约请求已提交，我们将尽快与您联系！');
    setFormData({
      name: '',
      email: '',
      organization: '',
      message: ''
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };


  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <Navbar />
      
      <div className="container mx-auto px-4 py-24 max-w-7xl">
        <h1 className="text-4xl font-bold text-center mb-12 text-blue-400">
          商业合作方案
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Case Studies Section */}
          <div>
            <h2 className="text-2xl font-semibold mb-6 text-blue-300">合作案例</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {caseStudies.map((caseStudy) => (
                <motion.div
                  key={caseStudy.id}
                  className="bg-gray-800 rounded-lg overflow-hidden shadow-lg cursor-pointer"
                  whileHover={{ y: -5 }}
                  onClick={() => handleCaseClick(caseStudy.id)}
                >
                  <div className="p-4">
                    <h3 className="text-xl font-medium mb-2">{caseStudy.name}</h3>
                    <div className="flex space-x-2 mb-2">
                      <div className="w-1/2">
                        <img 
                          src={caseStudy.beforeImage} 
                          alt="实施前" 
                          className="w-full h-24 object-cover rounded"
                        />
                        <p className="text-xs text-center mt-1">实施前</p>
                      </div>
                      <div className="w-1/2">
                        <img 
                          src={caseStudy.afterImage} 
                          alt="实施后" 
                          className="w-full h-24 object-cover rounded"
                        />
                        <p className="text-xs text-center mt-1">实施后</p>
                      </div>
                    </div>
                  </div>

                  <AnimatePresence>
                    {selectedCase === caseStudy.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="px-4 pb-4 text-sm">
                          <p>{caseStudy.detail}</p>
                          <button 
                            className="mt-2 px-3 py-1 bg-blue-600 rounded text-sm hover:bg-blue-700 transition"
                            onClick={(e) => {
                              e.stopPropagation();
                              toast.success(`已预约${caseStudy.name}案例演示`);
                            }}
                          >
                            预约演示
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>
          </div>

          {/* API Demo Section */}
          <div className="bg-gray-800 rounded-xl p-6 shadow-xl">
            

            {/* Booking Form */}
            <h3 className="text-xl font-semibold mb-4 text-blue-300">预约演示</h3>
            <form onSubmit={handleFormSubmit}>
              <div className="mb-4">
                <label className="block text-gray-300 mb-1">姓名</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-300 mb-1">邮箱</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-300 mb-1">机构名称</label>
                <input
                  type="text"
                  name="organization"
                  value={formData.organization}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-300 mb-1">留言</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-3 py-2 bg-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <button
                type="submit"
                className="w-full py-2 bg-blue-600 rounded-lg font-medium hover:bg-blue-700 transition"
              >
                提交预约
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
