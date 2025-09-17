import { motion } from 'framer-motion';

interface DataCardProps {
  title: string;
  value: string;
  icon: string;
  color?: string;
  onClick?: () => void;
}

export default function DataCard({ title, value, icon, color = '#4A90E2', onClick }: DataCardProps) {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className="bg-white rounded-2xl p-6 shadow-lg cursor-pointer transition-all duration-300 hover:shadow-xl relative overflow-hidden"
    >
      {/* 背景装饰元素 */}
      <div 
        className="absolute -top-8 -right-8 w-24 h-24 rounded-full opacity-10"
        style={{ backgroundColor: color }}
      ></div>
      
      <div className="flex items-center relative z-10">
        <motion.div 
          className="p-4 rounded-2xl mr-4"
          style={{ backgroundColor: `${color}20` }}
          whileHover={{ rotate: 10 }}
        >
          <i className={`fas fa-${icon} text-2xl`} style={{ color }}></i>
        </motion.div>
        <div>
          <h3 className="text-gray-500 text-sm font-medium">{title}</h3>
          <p className="text-3xl font-bold" style={{ color }}>{value}</p>
        </div>
      </div>
    </motion.div>
  );
}
