import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import { resolve } from "path";

export default defineConfig({
  plugins: [
    react({
      // 启用React 18的新特性
      jsxRuntime: 'automatic',
      // 优化开发体验
      fastRefresh: true,
      // 启用babel插件优化
      babel: {
        plugins: [
          // 生产环境移除console
          process.env.NODE_ENV === 'production' && [
            'transform-remove-console',
            { exclude: ['error', 'warn'] }
          ]
        ].filter(Boolean)
      }
    }),
    tsconfigPaths()
  ],
  
  // 构建优化
  build: {
    // 启用代码分割
    rollupOptions: {
      output: {
        // 手动代码分割
        manualChunks: {
          // 第三方库分离
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          animation: ['framer-motion'],
          ui: ['@coze/api', 'sonner'],
          utils: ['clsx', 'tailwind-merge', 'uuid', 'zod']
        },
        // 文件命名
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: 'assets/[ext]/[name]-[hash].[ext]'
      }
    },
    
    // 压缩配置
    minify: 'terser',
    terserOptions: {
      compress: {
        // 移除console
        drop_console: true,
        drop_debugger: true,
        // 移除未使用的代码
        pure_funcs: ['console.log', 'console.info']
      }
    },
    
    // 资源内联阈值
    assetsInlineLimit: 4096,
    
    // 启用CSS代码分割
    cssCodeSplit: true,
    
    // 生成source map（生产环境关闭）
    sourcemap: process.env.NODE_ENV !== 'production',
    
    // 目标浏览器
    target: 'es2015'
  },
  
  // 开发服务器配置
  server: {
    port: 3000,
    host: true,
    // 启用HMR
    hmr: {
      overlay: true
    },
    // 代理配置（如果需要）
    proxy: {
      '/api': {
        target: 'https://api.coze.cn',
        changeOrigin: true,
        secure: true
      }
    }
  },
  
  // 预览服务器配置
  preview: {
    port: 4173,
    host: true
  },
  
  // 路径别名
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@components': resolve(__dirname, 'src/components'),
      '@pages': resolve(__dirname, 'src/pages'),
      '@lib': resolve(__dirname, 'src/lib'),
      '@config': resolve(__dirname, 'src/config'),
      '@hooks': resolve(__dirname, 'src/hooks'),
      '@assets': resolve(__dirname, 'src/assets')
    }
  },
  
  // CSS配置
  css: {
    // 启用CSS模块
    modules: {
      localsConvention: 'camelCase'
    },
    // PostCSS配置
    postcss: './postcss.config.cjs'
  },
  
  // 环境变量配置
  define: {
    __APP_VERSION__: JSON.stringify(process.env.npm_package_version),
    __BUILD_TIME__: JSON.stringify(new Date().toISOString())
  },
  
  // 依赖优化
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      'framer-motion',
      '@coze/api',
      'sonner',
      'clsx',
      'tailwind-merge',
      'uuid',
      'zod'
    ],
    exclude: ['@vite/client', '@vite/env'],
    // 禁用esbuild的沙盒模式
    esbuildOptions: {
      target: 'es2015'
    }
  },
  
  // 实验性功能 - 已注释，使用相对路径
  // experimental: {
  //   renderBuiltUrl(filename: string) {
  //     // 自定义资源URL（用于CDN）
  //     return `https://cdn.example.com/${filename}`;
  //   }
  // },
  
  // 禁用有问题的命令行标志
  esbuild: {
    target: 'es2015',
    // 禁用沙盒模式
    platform: 'node'
  }
});
