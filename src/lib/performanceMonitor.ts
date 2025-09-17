/**
 * 性能监控工具
 * 用于监控应用性能指标，提供性能分析和优化建议
 */

// 性能指标接口
interface PerformanceMetrics {
  // 核心Web指标
  lcp?: number; // 最大内容绘制
  fid?: number; // 首次输入延迟
  cls?: number; // 累积布局偏移
  fcp?: number; // 首次内容绘制
  ttfb?: number; // 首字节时间
  
  // 自定义指标
  pageLoadTime?: number; // 页面加载时间
  domContentLoaded?: number; // DOM内容加载时间
  resourceLoadTime?: number; // 资源加载时间
  memoryUsage?: number; // 内存使用量
  
  // 用户交互指标
  clickResponseTime?: number; // 点击响应时间
  scrollPerformance?: number; // 滚动性能
  animationFrameRate?: number; // 动画帧率
  
  // 网络指标
  networkLatency?: number; // 网络延迟
  downloadSpeed?: number; // 下载速度
  connectionType?: string; // 连接类型
}

// 性能监控配置
interface PerformanceConfig {
  enableWebVitals: boolean;
  enableCustomMetrics: boolean;
  enableUserInteractionTracking: boolean;
  enableNetworkMonitoring: boolean;
  sampleRate: number; // 采样率 (0-1)
  reportInterval: number; // 报告间隔 (ms)
  maxMetricsHistory: number; // 最大历史记录数
}

// 默认配置
const defaultConfig: PerformanceConfig = {
  enableWebVitals: true,
  enableCustomMetrics: true,
  enableUserInteractionTracking: true,
  enableNetworkMonitoring: true,
  sampleRate: 1.0,
  reportInterval: 30000, // 30秒
  maxMetricsHistory: 100
};

class PerformanceMonitor {
  private config: PerformanceConfig;
  private metrics: PerformanceMetrics[] = [];
  private observers: PerformanceObserver[] = [];
  private isInitialized = false;

  constructor(config: Partial<PerformanceConfig> = {}) {
    this.config = { ...defaultConfig, ...config };
  }

  /**
   * 初始化性能监控
   */
  public init(): void {
    if (this.isInitialized) return;

    try {
      // 监控Web Vitals
      if (this.config.enableWebVitals) {
        this.initWebVitals();
      }

      // 监控自定义指标
      if (this.config.enableCustomMetrics) {
        this.initCustomMetrics();
      }

      // 监控用户交互
      if (this.config.enableUserInteractionTracking) {
        this.initUserInteractionTracking();
      }

      // 监控网络性能
      if (this.config.enableNetworkMonitoring) {
        this.initNetworkMonitoring();
      }

      // 定期报告性能数据
      this.startReporting();

      this.isInitialized = true;
      console.log('性能监控已初始化');
    } catch (error) {
      console.error('性能监控初始化失败:', error);
    }
  }

  /**
   * 初始化Web Vitals监控
   */
  private initWebVitals(): void {
    // 监控LCP (Largest Contentful Paint)
    this.observeMetric('largest-contentful-paint', (entry) => {
      this.recordMetric('lcp', entry.startTime);
    });

    // 监控FID (First Input Delay)
    this.observeMetric('first-input', (entry) => {
      this.recordMetric('fid', entry.processingStart - entry.startTime);
    });

    // 监控CLS (Cumulative Layout Shift)
    this.observeMetric('layout-shift', (entry) => {
      if (!entry.hadRecentInput) {
        this.recordMetric('cls', entry.value);
      }
    });

    // 监控FCP (First Contentful Paint)
    this.observeMetric('paint', (entry) => {
      if (entry.name === 'first-contentful-paint') {
        this.recordMetric('fcp', entry.startTime);
      }
    });

    // 监控TTFB (Time to First Byte)
    this.observeMetric('navigation', (entry) => {
      this.recordMetric('ttfb', entry.responseStart - entry.requestStart);
    });
  }

  /**
   * 初始化自定义指标监控
   */
  private initCustomMetrics(): void {
    // 页面加载时间
    window.addEventListener('load', () => {
      const loadTime = performance.now();
      this.recordMetric('pageLoadTime', loadTime);
    });

    // DOM内容加载时间
    document.addEventListener('DOMContentLoaded', () => {
      const domLoadTime = performance.now();
      this.recordMetric('domContentLoaded', domLoadTime);
    });

    // 内存使用量
    if ('memory' in performance) {
      setInterval(() => {
        const memory = (performance as any).memory;
        this.recordMetric('memoryUsage', memory.usedJSHeapSize);
      }, 10000); // 每10秒检查一次
    }

    // 资源加载时间
    this.observeMetric('resource', (entry) => {
      this.recordMetric('resourceLoadTime', entry.duration);
    });
  }

  /**
   * 初始化用户交互监控
   */
  private initUserInteractionTracking(): void {
    // 点击响应时间
    document.addEventListener('click', (event) => {
      const startTime = performance.now();
      requestAnimationFrame(() => {
        const responseTime = performance.now() - startTime;
        this.recordMetric('clickResponseTime', responseTime);
      });
    });

    // 滚动性能
    let scrollStartTime = 0;
    document.addEventListener('scroll', () => {
      if (scrollStartTime === 0) {
        scrollStartTime = performance.now();
      }
      
      requestAnimationFrame(() => {
        const scrollTime = performance.now() - scrollStartTime;
        this.recordMetric('scrollPerformance', scrollTime);
        scrollStartTime = 0;
      });
    });

    // 动画帧率
    let frameCount = 0;
    let lastTime = performance.now();
    
    const measureFrameRate = () => {
      frameCount++;
      const currentTime = performance.now();
      
      if (currentTime - lastTime >= 1000) {
        const fps = frameCount;
        this.recordMetric('animationFrameRate', fps);
        frameCount = 0;
        lastTime = currentTime;
      }
      
      requestAnimationFrame(measureFrameRate);
    };
    
    requestAnimationFrame(measureFrameRate);
  }

  /**
   * 初始化网络监控
   */
  private initNetworkMonitoring(): void {
    if ('connection' in navigator) {
      const connection = (navigator as any).connection;
      this.recordMetric('connectionType', connection.effectiveType);
      this.recordMetric('networkLatency', connection.rtt);
      this.recordMetric('downloadSpeed', connection.downlink);
    }

    // 监控网络请求
    this.observeMetric('resource', (entry) => {
      if (entry.transferSize > 0) {
        const downloadSpeed = entry.transferSize / entry.duration;
        this.recordMetric('downloadSpeed', downloadSpeed);
      }
    });
  }

  /**
   * 观察性能指标
   */
  private observeMetric(type: string, callback: (entry: any) => void): void {
    try {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          callback(entry);
        }
      });
      
      observer.observe({ type, buffered: true });
      this.observers.push(observer);
    } catch (error) {
      console.warn(`无法观察性能指标 ${type}:`, error);
    }
  }

  /**
   * 记录性能指标
   */
  private recordMetric(name: keyof PerformanceMetrics, value: number | string): void {
    // 采样率控制
    if (Math.random() > this.config.sampleRate) return;

    const metric: PerformanceMetrics = {
      [name]: value,
      timestamp: Date.now()
    } as PerformanceMetrics & { timestamp: number };

    this.metrics.push(metric);

    // 限制历史记录数量
    if (this.metrics.length > this.config.maxMetricsHistory) {
      this.metrics.shift();
    }

    // 实时报告重要指标
    if (this.isImportantMetric(name)) {
      this.reportMetric(name, value);
    }
  }

  /**
   * 判断是否为重要指标
   */
  private isImportantMetric(name: keyof PerformanceMetrics): boolean {
    const importantMetrics = ['lcp', 'fid', 'cls', 'fcp', 'ttfb'];
    return importantMetrics.includes(name as string);
  }

  /**
   * 报告性能指标
   */
  private reportMetric(name: keyof PerformanceMetrics, value: number | string): void {
    console.log(`性能指标 ${name}:`, value);
    
    // 这里可以发送到分析服务
    // this.sendToAnalytics(name, value);
  }

  /**
   * 开始定期报告
   */
  private startReporting(): void {
    setInterval(() => {
      this.generateReport();
    }, this.config.reportInterval);
  }

  /**
   * 生成性能报告
   */
  public generateReport(): PerformanceMetrics {
    const report = this.calculateAverages();
    console.log('性能报告:', report);
    return report;
  }

  /**
   * 计算平均性能指标
   */
  private calculateAverages(): PerformanceMetrics {
    const averages: PerformanceMetrics = {};
    const metricTypes = new Set<string>();

    // 收集所有指标类型
    this.metrics.forEach(metric => {
      Object.keys(metric).forEach(key => {
        if (key !== 'timestamp') {
          metricTypes.add(key);
        }
      });
    });

    // 计算平均值
    metricTypes.forEach(type => {
      const values = this.metrics
        .map(metric => metric[type as keyof PerformanceMetrics])
        .filter(value => typeof value === 'number') as number[];

      if (values.length > 0) {
        const average = values.reduce((sum, value) => sum + value, 0) / values.length;
        averages[type as keyof PerformanceMetrics] = average;
      }
    });

    return averages;
  }

  /**
   * 获取性能建议
   */
  public getPerformanceRecommendations(): string[] {
    const recommendations: string[] = [];
    const report = this.calculateAverages();

    // LCP建议
    if (report.lcp && report.lcp > 2500) {
      recommendations.push('LCP时间过长，建议优化图片加载和关键资源');
    }

    // FID建议
    if (report.fid && report.fid > 100) {
      recommendations.push('FID时间过长，建议减少JavaScript执行时间');
    }

    // CLS建议
    if (report.cls && report.cls > 0.1) {
      recommendations.push('CLS值过高，建议为图片和广告设置尺寸');
    }

    // 内存使用建议
    if (report.memoryUsage && report.memoryUsage > 50 * 1024 * 1024) {
      recommendations.push('内存使用量过高，建议检查内存泄漏');
    }

    return recommendations;
  }

  /**
   * 清理资源
   */
  public cleanup(): void {
    this.observers.forEach(observer => observer.disconnect());
    this.observers = [];
    this.metrics = [];
    this.isInitialized = false;
  }
}

// 创建全局实例
export const performanceMonitor = new PerformanceMonitor();

// 导出类型和工具函数
export type { PerformanceMetrics, PerformanceConfig };
export { PerformanceMonitor };

// 自动初始化（在开发环境）
if (process.env.NODE_ENV === 'development') {
  performanceMonitor.init();
}
