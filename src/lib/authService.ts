/**
 * 认证服务
 * 处理用户登录、登出和权限验证
 */

export interface User {
  id: string;
  username: string;
  phone?: string;
  isAuthorized: boolean;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

class AuthService {
  private currentUser: User | null = null;
  private readonly STORAGE_KEY = 'ai_creation_user';

  constructor() {
    // 从本地存储恢复用户状态
    this.loadUserFromStorage();
  }

  /**
   * 用户登录
   */
  async login(credentials: LoginCredentials): Promise<boolean> {
    try {
      // 模拟API调用延迟
      await new Promise(resolve => setTimeout(resolve, 1000));

      // 这里应该调用真实的API进行验证
      // 目前使用模拟数据进行演示
      const isValid = this.validateCredentials(credentials);

      if (isValid) {
        const user: User = {
          id: '1',
          username: credentials.username,
          phone: credentials.username,
          isAuthorized: true
        };

        this.currentUser = user;
        this.saveUserToStorage(user);
        return true;
      }

      return false;
    } catch (error) {
      console.error('登录失败:', error);
      return false;
    }
  }

  /**
   * 用户登出
   */
  logout(): void {
    this.currentUser = null;
    localStorage.removeItem(this.STORAGE_KEY);
  }

  /**
   * 获取当前用户
   */
  getCurrentUser(): User | null {
    return this.currentUser;
  }

  /**
   * 检查用户是否已登录
   */
  isLoggedIn(): boolean {
    return this.currentUser !== null && this.currentUser.isAuthorized;
  }

  /**
   * 检查用户是否有权限使用智能体服务
   */
  hasAgentAccess(): boolean {
    return this.isLoggedIn() && this.currentUser?.isAuthorized === true;
  }

  /**
   * 验证用户凭据（模拟实现）
   * 在实际应用中，这里应该调用后端API
   */
  private validateCredentials(credentials: LoginCredentials): boolean {
    // 模拟的授权用户列表
    const authorizedUsers = [
      { username: '*', password: '*' },
      { username: '*', password: '*' },
      { username: '*', password: '*' },
      { username: '*', password: '*' },
      { username: '*', password: '*' }
    ];

    return authorizedUsers.some(
      user => user.username === credentials.username && user.password === credentials.password
    );
  }

  /**
   * 从本地存储加载用户信息
   */
  private loadUserFromStorage(): void {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        this.currentUser = JSON.parse(stored);
      }
    } catch (error) {
      console.error('加载用户信息失败:', error);
      this.currentUser = null;
    }
  }

  /**
   * 保存用户信息到本地存储
   */
  private saveUserToStorage(user: User): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(user));
    } catch (error) {
      console.error('保存用户信息失败:', error);
    }
  }
}

// 创建单例实例
export const authService = new AuthService();
