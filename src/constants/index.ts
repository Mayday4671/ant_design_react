// API 基础配置常量
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

// 应用配置常量
export const APP_NAME = 'Ant Design React App';
export const APP_VERSION = '1.0.0';

// 分页配置
export const DEFAULT_PAGE_SIZE = 10;
export const PAGE_SIZE_OPTIONS = [10, 20, 50, 100];

// 本地存储键名
export const STORAGE_KEYS = {
    TOKEN: 'auth_token',
    USER_INFO: 'user_info',
    THEME: 'app_theme',
} as const;
