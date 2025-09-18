import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ContactAdminModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ContactAdminModal: React.FC<ContactAdminModalProps> = ({ isOpen, onClose }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
            className="bg-white rounded-3xl p-8 max-w-sm w-full mx-4 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* 标题 */}
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-gray-800 mb-2">
                联系管理员获取授权
              </h3>
              <p className="text-gray-600 text-sm">
                扫码添加微信，获取智能体使用权限
              </p>
            </div>

            {/* 微信二维码 */}
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="w-48 h-48 bg-gray-100 rounded-2xl flex items-center justify-center border-2 border-gray-200">
                  <img
                    src="/images/admin-wechat-qr.png"
                    alt="管理员微信二维码"
                    className="w-44 h-44 rounded-xl object-cover"
                    onError={(e) => {
                      // 如果图片加载失败，显示占位符
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      const placeholder = target.nextElementSibling as HTMLElement;
                      if (placeholder) placeholder.style.display = 'flex';
                    }}
                  />
                  <div 
                    className="w-44 h-44 rounded-xl bg-gradient-to-br from-green-400 to-green-600 flex flex-col items-center justify-center text-white"
                    style={{ display: 'none' }}
                  >
                    <div className="text-4xl mb-2">📱</div>
                    <div className="text-sm text-center px-2">
                      请将微信二维码图片<br />
                      保存为 admin-wechat-qr.png
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 操作说明 */}
            <div className="text-center mb-6">
              <div className="flex items-center justify-center mb-3">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center mr-3">
                  <span className="text-white text-lg">💬</span>
                </div>
                <span className="text-gray-700 font-medium">扫码添加微信</span>
              </div>
              <p className="text-gray-500 text-sm leading-relaxed">
                使用微信扫描上方二维码<br />
                添加管理员为好友，获取授权后即可使用智能体功能
              </p>
            </div>

            {/* 关闭按钮 */}
            <div className="flex justify-center">
              <button
                onClick={onClose}
                className="px-8 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition-all duration-200 hover:scale-105"
              >
                关闭
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ContactAdminModal;
