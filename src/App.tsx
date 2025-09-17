import { createContext, useState, Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import { ToastProvider } from '@/components/Toast';
import LoadingSpinner from './components/LoadingSpinner';
import ErrorBoundary from './components/ErrorBoundary';

// 懒加载页面组件 - 路由级别的代码分割
const Home = lazy(() => import('@/pages/Home'));
const FeaturesPage = lazy(() => import('@/pages/Features'));
const EducationPage = lazy(() => import('@/pages/Education'));
const BusinessPage = lazy(() => import('@/pages/Business'));
const AboutPage = lazy(() => import('@/pages/About'));
const NewspaperPage = lazy(() => import('@/pages/Newspaper'));
const SpeakPage = lazy(() => import('@/pages/Speak'));
const CameraPage = lazy(() => import('@/pages/Camera'));
const VoiceDressPage = lazy(() => import('@/pages/VoiceDress'));

export const AuthContext = createContext({
  isAuthenticated: false,
  setIsAuthenticated: (_value: boolean) => {},
  logout: () => {},
});

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const logout = () => {
    setIsAuthenticated(false);
  };

  return (
    <ErrorBoundary>
      <AuthContext.Provider
        value={{ isAuthenticated, setIsAuthenticated, logout }}
      >
        <ToastProvider>
          <Suspense fallback={<LoadingSpinner />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/features" element={<FeaturesPage />} />
              <Route path="/products" element={<FeaturesPage />} />
              <Route path="/education" element={<EducationPage />} />
              <Route path="/business" element={<BusinessPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/newspaper" element={<NewspaperPage />} />
              <Route path="/speak" element={<SpeakPage />} />
              <Route path="/camera" element={<CameraPage />} />
              <Route path="/voice" element={<VoiceDressPage />} />
            </Routes>
          </Suspense>
        </ToastProvider>
      </AuthContext.Provider>
    </ErrorBoundary>
  );
}
