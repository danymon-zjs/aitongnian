import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

function NavLink({ to, children, icon }: { to: string; children: React.ReactNode; icon: string }) {
  return (
    <Link to={to} className="group">
      <motion.div
        className="px-4 py-2 rounded-full flex items-center space-x-2"
        whileHover={{ backgroundColor: 'rgba(74, 144, 226, 0.1)' }}
        whileTap={{ scale: 0.95 }}
      >
        <i className={`fas fa-${icon} text-blue-600 group-hover:text-blue-700 transition-colors`}></i>
        <span className="text-sm font-medium text-blue-600 group-hover:text-blue-700 transition-colors">
          {children}
        </span>
      </motion.div>
    </Link>
  );
}

function MobileNavLink({ to, children, icon }: { to: string; children: React.ReactNode; icon: string }) {
  return (
    <Link to={to} className="block">
      <motion.div
        className="px-3 py-2 rounded-md flex items-center space-x-3"
        whileTap={{ scale: 0.95 }}
      >
        <i className={`fas fa-${icon} text-blue-600 text-lg`}></i>
        <span className="text-base font-medium text-blue-600">
          {children}
        </span>
      </motion.div>
    </Link>
  );
}

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.nav 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'py-2 bg-white/80 shadow-sm' : 'py-4 bg-transparent'}`}
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-12">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center">
              <motion.div
                className={`${isScrolled ? 'h-8 w-8' : 'h-10 w-10'} transition-all duration-300`}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <img 
                  src="/logo.svg" 
                  alt="哎童年科技 Logo" 
                  className="w-full h-full object-contain"
                />
              </motion.div>
              <motion.span 
                className={`ml-3 font-bold text-blue-600 transition-all duration-300 ${isScrolled ? 'text-lg' : 'text-xl'}`}
              >
                哎童年科技
              </motion.span>
            </Link>
          </div>


          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-2">
              <NavLink to="/" icon="home">
                首页
              </NavLink>
              <NavLink to="/features" icon="paint-brush">
                  魔法童画
              </NavLink>
              <NavLink to="/education" icon="graduation-cap">
                教育价值
              </NavLink>
              <NavLink to="/business" icon="handshake">
                商业合作
              </NavLink>
              <NavLink to="/about" icon="info-circle">
                关于我们
              </NavLink>
            </div>
          </div>
  

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-full text-blue-600 hover:bg-blue-100 focus:outline-none"
            >
              <i className={`fas fa-${isMenuOpen ? 'times' : 'bars'} text-xl`}></i>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <motion.div 
          className="md:hidden bg-white/95 backdrop-blur-sm"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="px-2 pt-2 pb-3 space-y-1">
            <MobileNavLink to="/" icon="home">
              首页
            </MobileNavLink>
            <MobileNavLink to="/features" icon="paint-brush">
              产品功能
            </MobileNavLink>
            <MobileNavLink to="/education" icon="graduation-cap">
              教育价值
            </MobileNavLink>
            <MobileNavLink to="/business" icon="handshake">
              商业合作
            </MobileNavLink>
            <MobileNavLink to="/about" icon="info-circle">
              关于我们
            </MobileNavLink>
          </div>
        </motion.div>
      )}
    </motion.nav>
  );
}
