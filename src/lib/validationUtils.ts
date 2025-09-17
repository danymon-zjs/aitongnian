import { z } from 'zod';
import { useState } from 'react';
import { sanitizeInput } from './cryptoUtils';

/**
 * 输入验证工具
 * 使用Zod进行类型安全的数据验证
 */

// 基础验证规则
export const baseValidation = {
  // 文本输入验证
  text: z.string()
    .min(1, '输入不能为空')
    .max(1000, '输入长度不能超过1000个字符')
    .transform(sanitizeInput),
  
  // 邮箱验证
  email: z.string()
    .email('请输入有效的邮箱地址')
    .max(255, '邮箱地址过长'),
  
  // 手机号验证
  phone: z.string()
    .regex(/^1[3-9]\d{9}$/, '请输入有效的手机号码'),
  
  // URL验证
  url: z.string()
    .url('请输入有效的URL地址')
    .max(500, 'URL地址过长'),
  
  // 数字验证
  number: z.number()
    .min(0, '数字不能为负数')
    .max(999999, '数字过大'),
  
  // 正整数验证
  positiveInteger: z.number()
    .int('必须是整数')
    .positive('必须是正数'),
  
  // 布尔值验证
  boolean: z.boolean(),
  
  // 日期验证
  date: z.string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, '日期格式不正确 (YYYY-MM-DD)'),
  
  // 时间戳验证
  timestamp: z.number()
    .int('时间戳必须是整数')
    .min(0, '时间戳不能为负数'),
  
  // 文件类型验证
  fileType: z.enum(['image/jpeg', 'image/png', 'image/gif', 'image/webp'], {
    errorMap: () => ({ message: '只支持 JPEG、PNG、GIF、WebP 格式的图片' })
  }),
  
  // 文件大小验证（5MB）
  fileSize: z.number()
    .max(5 * 1024 * 1024, '文件大小不能超过5MB'),
  
  // 颜色值验证
  color: z.string()
    .regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, '颜色值格式不正确'),
  
  // 密码验证
  password: z.string()
    .min(8, '密码至少8个字符')
    .max(128, '密码不能超过128个字符')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, '密码必须包含大小写字母和数字'),
  
  // 用户名验证
  username: z.string()
    .min(3, '用户名至少3个字符')
    .max(20, '用户名不能超过20个字符')
    .regex(/^[a-zA-Z0-9_]+$/, '用户名只能包含字母、数字和下划线')
};

// 应用特定验证规则
export const appValidation = {
  // 模块类型验证
  moduleType: z.enum(['newspaper', 'camera', 'speak', 'voice'], {
    errorMap: () => ({ message: '无效的模块类型' })
  }),
  
  // 应用ID验证
  appId: z.string()
    .min(10, '应用ID格式不正确')
    .max(50, '应用ID格式不正确')
    .regex(/^\d+$/, '应用ID必须是数字'),
  
  // 令牌验证
  token: z.string()
    .min(20, '令牌格式不正确')
    .max(500, '令牌格式不正确'),
  
  // 会话名称验证
  sessionName: z.string()
    .min(1, '会话名称不能为空')
    .max(100, '会话名称不能超过100个字符')
    .regex(/^[a-zA-Z0-9_\-\u4e00-\u9fa5]+$/, '会话名称只能包含字母、数字、下划线、连字符和中文字符'),
  
  // 用户输入内容验证（用于AI交互）
  userContent: z.string()
    .min(1, '输入内容不能为空')
    .max(2000, '输入内容不能超过2000个字符')
    .refine(
      (val) => !/<script|javascript:|on\w+=/i.test(val),
      '输入内容包含不安全字符'
    ),
  
  // 图片描述验证
  imageDescription: z.string()
    .min(1, '图片描述不能为空')
    .max(500, '图片描述不能超过500个字符')
    .refine(
      (val) => !/<script|javascript:|on\w+=/i.test(val),
      '图片描述包含不安全字符'
    ),
  
  // 手抄报主题验证
  newspaperTheme: z.string()
    .min(1, '手抄报主题不能为空')
    .max(100, '手抄报主题不能超过100个字符')
    .regex(/^[a-zA-Z0-9_\-\u4e00-\u9fa5\s]+$/, '主题只能包含字母、数字、下划线、连字符、空格和中文字符')
};

// 复合验证规则
export const compositeValidation = {
  // 用户注册数据
  userRegistration: z.object({
    username: baseValidation.username,
    email: baseValidation.email,
    password: baseValidation.password,
    phone: baseValidation.phone.optional()
  }),
  
  // 用户登录数据
  userLogin: z.object({
    email: baseValidation.email,
    password: z.string().min(1, '密码不能为空')
  }),
  
  // AI交互数据
  aiInteraction: z.object({
    moduleType: appValidation.moduleType,
    content: appValidation.userContent,
    sessionName: appValidation.sessionName.optional()
  }),
  
  // 图片上传数据
  imageUpload: z.object({
    file: z.object({
      type: baseValidation.fileType,
      size: baseValidation.fileSize
    }),
    description: appValidation.imageDescription.optional()
  }),
  
  // 手抄报创建数据
  newspaperCreate: z.object({
    theme: appValidation.newspaperTheme,
    content: appValidation.userContent.optional(),
    style: z.enum(['classic', 'modern', 'cute', 'creative']).optional()
  }),
  
  // 配置更新数据
  configUpdate: z.object({
    appId: appValidation.appId,
    token: appValidation.token,
    moduleType: appValidation.moduleType
  })
};

// 验证函数
export const validateInput = <T>(
  schema: z.ZodSchema<T>,
  data: unknown,
  errorMessage?: string
): { success: true; data: T } | { success: false; error: string } => {
  try {
    const result = schema.parse(data);
    return { success: true, data: result };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorMsg = error.errors.map(e => e.message).join(', ');
      return { 
        success: false, 
        error: errorMessage || errorMsg 
      };
    }
    return { 
      success: false, 
      error: errorMessage || '验证失败' 
    };
  }
};

// 异步验证函数
export const validateInputAsync = async <T>(
  schema: z.ZodSchema<T>,
  data: unknown,
  errorMessage?: string
): Promise<{ success: true; data: T } | { success: false; error: string }> => {
  try {
    const result = await schema.parseAsync(data);
    return { success: true, data: result };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorMsg = error.errors.map(e => e.message).join(', ');
      return { 
        success: false, 
        error: errorMessage || errorMsg 
      };
    }
    return { 
      success: false, 
      error: errorMessage || '验证失败' 
    };
  }
};

// 表单验证Hook
export const useFormValidation = <T>(
  schema: z.ZodSchema<T>,
  initialData?: Partial<T>
) => {
  const [data, setData] = useState<Partial<T>>(initialData || {});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isValid, setIsValid] = useState(false);

  const validate = (field?: keyof T) => {
    try {
      if (field) {
        // 验证单个字段
        const fieldSchema = schema.shape[field];
        if (fieldSchema) {
          fieldSchema.parse(data[field]);
          setErrors(prev => {
            const newErrors = { ...prev };
            delete newErrors[field as string];
            return newErrors;
          });
        }
      } else {
        // 验证整个表单
        schema.parse(data);
        setErrors({});
        setIsValid(true);
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        error.errors.forEach(err => {
          if (err.path.length > 0) {
            newErrors[err.path[0] as string] = err.message;
          }
        });
        setErrors(newErrors);
        setIsValid(false);
      }
    }
  };

  const updateField = (field: keyof T, value: any) => {
    setData(prev => ({ ...prev, [field]: value }));
    // 实时验证
    setTimeout(() => validate(field), 100);
  };

  const reset = () => {
    setData(initialData || {});
    setErrors({});
    setIsValid(false);
  };

  return {
    data,
    errors,
    isValid,
    validate,
    updateField,
    reset
  };
};

// 导出常用的验证函数
export const validateModuleType = (value: unknown) => 
  validateInput(appValidation.moduleType, value);

export const validateAppId = (value: unknown) => 
  validateInput(appValidation.appId, value);

export const validateUserContent = (value: unknown) => 
  validateInput(appValidation.userContent, value);

export const validateSessionName = (value: unknown) => 
  validateInput(appValidation.sessionName, value);
