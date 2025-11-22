# CentOS 部署指南 - 使用JWT鉴权（不修改代码）

## 📋 概述

本项目已经内置了两种鉴权方式：
- **PAT（Personal Access Token）**：用于开发环境
- **JWT（OAuth JWT）**：用于生产环境

**重要说明**：项目会根据 `NODE_ENV` 环境变量自动选择鉴权方式：
- `NODE_ENV=development` → 使用 PAT 鉴权
- `NODE_ENV=production` → 使用 JWT 鉴权

**JWT配置已经内置在代码中**，无需修改代码，只需要确保在构建和运行时设置正确的环境变量。

---

## 🔍 项目鉴权机制分析

### 1. 环境判断逻辑

项目通过 `src/config/environment.ts` 判断当前环境：

```typescript
// 如果 NODE_ENV === 'production'，使用 JWT
// 否则使用 PAT
export const getCurrentEnvironment = (): EnvironmentType => {
  if (process.env.NODE_ENV === 'production') {
    return ENVIRONMENT.PRODUCTION; // 使用 JWT
  }
  return ENVIRONMENT.DEVELOPMENT; // 使用 PAT
};
```

### 2. 鉴权选择逻辑

在 `src/lib/cozeAuthManager.ts` 中，`getCozeToken` 函数会根据环境自动选择：

```typescript
export const getCozeToken = async (moduleType: ModuleType): Promise<string> => {
  if (CURRENT_ENV === ENVIRONMENT.DEVELOPMENT) {
    // 开发环境使用PAT
    return getPATToken(moduleType);
  } else {
    // 生产环境使用OAuth JWT
    const tokenResponse = await getProductionOAuthToken(moduleType);
    return tokenResponse.access_token;
  }
};
```

### 3. JWT配置位置

JWT配置已经内置在 `src/lib/cozeProductionService.ts` 中，包含：
- **App ID**：每个模块的OAuth应用ID
- **Key ID**：公钥ID
- **Private Key**：RSA私钥（用于签名JWT）

所有4个模块的JWT配置都已完整配置：
- 手抄报社（newspaper）
- 童言生画（speak）
- 创想空间（camera）
- 语音互动（voice）

---

## 🚀 CentOS 部署步骤（使用JWT鉴权）

### 步骤1：环境准备

```bash
# 1. 运行环境准备脚本
chmod +x centos7-setup.sh
sudo ./centos7-setup.sh
```

### 步骤2：上传项目代码

```bash
# 2. 将项目代码上传到服务器
# 假设上传到 /opt/ai-childhood-platform
scp -r ./* root@your-server:/opt/ai-childhood-platform/
```

### 步骤3：配置生产环境变量

**关键步骤**：创建 `.env.production` 文件，确保构建时使用生产环境：

```bash
cd /opt/ai-childhood-platform

# 创建生产环境变量文件
cat > .env.production << 'EOF'
NODE_ENV=production
VITE_API_BASE_URL=https://api.coze.cn
VITE_APP_ENV=production

# Coze应用配置（用于前端显示）
VITE_NEWSPAPER_APP_ID=7547302685909827623
VITE_SPEAK_APP_ID=7548027309891518491
VITE_CAMERA_APP_ID=7548051394683715622
VITE_VOICE_APP_ID=7550649811847020585

# JWT配置（已在代码中硬编码，这里仅作参考）
# 实际JWT配置在 src/lib/cozeProductionService.ts 中
VITE_JWT_APP_ID_NEWSPAPER=1128088461414
VITE_JWT_APP_ID_SPEAK=1176390124241
VITE_JWT_APP_ID_CAMERA=1151850049216
VITE_JWT_APP_ID_VOICE=1169359718851

VITE_JWT_KEY_ID_NEWSPAPER=y-XendbREzonHcoxrxZSzsOtZbhebQZdJ99VL8SXzd0
VITE_JWT_KEY_ID_SPEAK=8NBR1mNrdT6vdFa5PWkUy04tpbCfn7dSwUK7ngZE_s4
VITE_JWT_KEY_ID_CAMERA=ALzMm0viiUc3dWRXYud_1jYfkqGmJgoJHpigiiks6wk
VITE_JWT_KEY_ID_VOICE=ZYd26nd8M9yrNuVEG257ZVUrnRvoaqWQ-oswkVdyq9o
EOF
```

### 步骤4：修改构建脚本（确保使用生产环境）

**重要**：修改 `package.json` 中的构建脚本，确保设置 `NODE_ENV=production`：

```bash
# 检查 package.json 中的构建脚本
# 应该包含 NODE_ENV=production

# 如果构建脚本没有设置 NODE_ENV，可以手动设置：
export NODE_ENV=production
```

或者修改 `deploy.sh` 脚本，在构建前设置环境变量：

```bash
# 在 deploy.sh 的 deploy_app 函数中，构建前添加：
export NODE_ENV=production
pnpm run build
```

### 步骤5：构建项目（使用生产环境）

```bash
cd /opt/ai-childhood-platform

# 确保使用生产环境构建
export NODE_ENV=production

# 安装依赖
pnpm install --production=false

# 构建项目（会自动使用JWT鉴权）
pnpm run build
```

### 步骤6：部署应用

```bash
# 运行部署脚本
chmod +x deploy.sh
./deploy.sh
```

---

## 🔧 验证JWT鉴权是否生效

### 方法1：检查构建后的代码

```bash
# 检查构建后的代码是否包含JWT相关逻辑
grep -r "OAuth JWT" dist/static/assets/*.js
grep -r "getProductionOAuthToken" dist/static/assets/*.js
```

### 方法2：查看浏览器控制台

1. 访问部署后的网站
2. 打开浏览器开发者工具（F12）
3. 查看 Console 标签
4. 应该看到类似以下日志：
   ```
   [生产环境] 使用OAuth JWT令牌认证 (newspaper)
   正在获取生产环境OAuth令牌 (newspaper)...
   生产环境OAuth令牌获取成功
   ```

### 方法3：检查网络请求

1. 打开浏览器开发者工具
2. 切换到 Network 标签
3. 使用任意AI智能体功能
4. 查看API请求的 Authorization 头：
   - 如果使用JWT：`Authorization: Bearer <JWT生成的access_token>`
   - 如果使用PAT：`Authorization: Bearer <PAT令牌>`

---

## 📝 修改部署脚本以强制使用JWT

如果默认的部署脚本没有正确设置环境变量，可以修改 `deploy.sh`：

```bash
# 编辑 deploy.sh
vim /opt/ai-childhood-platform/deploy.sh
```

在 `deploy_app` 函数中，修改构建部分：

```bash
deploy_app() {
    log_info "开始部署应用..."
    
    cd $APP_DIR
    
    # 停止PM2进程
    pm2 stop ai-childhood-platform 2>/dev/null || true
    
    # 安装依赖
    log_info "安装依赖..."
    pnpm install --production=false
    
    # 设置生产环境变量（关键步骤）
    export NODE_ENV=production
    export VITE_APP_ENV=production
    
    # 构建应用（会自动使用JWT鉴权）
    log_info "构建应用..."
    pnpm run build
    
    # ... 其余代码保持不变
}
```

---

## ⚠️ 常见问题排查

### 问题1：仍然使用PAT鉴权

**原因**：`NODE_ENV` 没有设置为 `production`

**解决方案**：
```bash
# 检查当前环境变量
echo $NODE_ENV

# 如果为空或不是 production，设置它
export NODE_ENV=production

# 重新构建
pnpm run build
```

### 问题2：JWT令牌获取失败

**可能原因**：
1. 网络问题，无法访问 `https://api.coze.cn`
2. JWT配置错误（但代码中已硬编码，通常不会出错）
3. 私钥格式问题

**排查步骤**：
```bash
# 1. 检查网络连接
curl -I https://api.coze.cn

# 2. 查看浏览器控制台错误信息
# 3. 检查服务器日志
pm2 logs ai-childhood-platform
```

### 问题3：构建后仍然使用PAT

**原因**：构建时环境变量没有正确传递

**解决方案**：
```bash
# 方法1：在构建命令中直接设置
NODE_ENV=production pnpm run build

# 方法2：修改 package.json 构建脚本
# 将 "build": "vite build" 
# 改为 "build": "cross-env NODE_ENV=production vite build"
```

---

## 🔐 JWT配置说明

### JWT配置位置

JWT配置已经内置在代码中，位于 `src/lib/cozeProductionService.ts`：

```typescript
const OAUTH_JWT_CONFIG = {
  newspaper: {
    appId: '1128088461414',
    keyId: 'y-XendbREzonHcoxrxZSzsOtZbhebQZdJ99VL8SXzd0',
    privateKey: `-----BEGIN PRIVATE KEY-----...`
  },
  // ... 其他模块配置
};
```

### JWT工作流程

1. **生成JWT**：使用RSA私钥签名生成JWT令牌
2. **获取Access Token**：将JWT发送到Coze API获取短期访问令牌
3. **使用Access Token**：使用获取的访问令牌调用Coze API
4. **自动刷新**：令牌过期前自动刷新（缓存机制）

### JWT优势

- ✅ **无需手动更新**：JWT自动生成，无需担心PAT过期
- ✅ **更安全**：使用RSA签名，比PAT更安全
- ✅ **自动刷新**：内置缓存和自动刷新机制
- ✅ **生产就绪**：专为生产环境设计

---

## 📊 部署检查清单

在部署完成后，请检查以下项目：

- [ ] `NODE_ENV=production` 已设置
- [ ] `.env.production` 文件已创建
- [ ] 构建命令使用了生产环境
- [ ] 浏览器控制台显示 "使用OAuth JWT令牌认证"
- [ ] API请求使用JWT生成的access_token
- [ ] 所有4个AI智能体模块都能正常工作
- [ ] 没有PAT相关的错误信息

---

## 🎯 总结

**关键点**：
1. ✅ **无需修改代码**：JWT配置已内置
2. ✅ **只需设置环境变量**：确保 `NODE_ENV=production`
3. ✅ **自动切换**：项目会自动使用JWT鉴权
4. ✅ **无需担心过期**：JWT自动生成和刷新

**部署命令总结**：
```bash
# 1. 环境准备
sudo ./centos7-setup.sh

# 2. 上传代码到 /opt/ai-childhood-platform

# 3. 设置生产环境
cd /opt/ai-childhood-platform
export NODE_ENV=production

# 4. 构建和部署
pnpm install
pnpm run build
./deploy.sh
```

---

**文档版本**：v1.0  
**最后更新**：2025年1月  
**适用项目**：哎童年科技 - 魔法童画AI绘画平台


