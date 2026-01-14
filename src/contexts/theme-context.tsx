/**
 * 主题上下文
 * 严格按照 Ant Design 官方主题定制规范实现
 * 参考：https://ant.design/docs/react/customize-theme-cn
 */
import React, { createContext, useState, useContext, useEffect, useMemo } from 'react';
import type { ReactNode } from 'react';
import { theme } from 'antd';
import type { ThemeConfig } from 'antd';

// Storage keys
const STORAGE_KEYS = {
    PRESET_THEME: 'app_preset_theme',
    PRIMARY_COLOR: 'app_primary_color',
    BORDER_RADIUS: 'app_border_radius',
    IS_DARK: 'app_is_dark',
    IS_COMPACT: 'app_is_compact',
    ADMIN_BG_IMAGE: 'app_admin_bg_image',
    FRONTEND_BG_IMAGE: 'app_frontend_bg_image',
    CONTENT_OPACITY: 'app_content_opacity',
};

// 预设主题定义 - 参考 Ant Design 官网示例
export interface PresetTheme {
    id: string;
    name: string;
    colorPrimary: string;
    isDark: boolean;
    borderRadius: number;
    isCompact?: boolean;
}

export const PRESET_THEMES: PresetTheme[] = [
    {
        id: 'default',
        name: '默认',
        colorPrimary: '#1677ff',
        isDark: false,
        borderRadius: 6,
    },
    {
        id: 'dark',
        name: '暗黑',
        colorPrimary: '#1677ff',
        isDark: true,
        borderRadius: 6,
    },
    {
        id: 'green',
        name: '知识协作',
        colorPrimary: '#00b96b',
        isDark: false,
        borderRadius: 4,
    },
    {
        id: 'pink',
        name: '桃花缘',
        colorPrimary: '#ed4192',
        isDark: false,
        borderRadius: 8,
    },
    {
        id: 'v4',
        name: 'V4 主题',
        colorPrimary: '#1890ff',
        isDark: false,
        borderRadius: 2,
    },
    {
        id: 'purple',
        name: '极客紫',
        colorPrimary: '#722ed1',
        isDark: false,
        borderRadius: 6,
    },
    {
        id: 'orange',
        name: '活力橙',
        colorPrimary: '#fa8c16',
        isDark: false,
        borderRadius: 6,
    },
];

// 常用主色调 - 参考 Ant Design 色板
export const PRIMARY_COLORS = [
    '#1677ff', // 拂晓蓝
    '#1890ff', // 天空蓝
    '#52c41a', // 极光绿
    '#13c2c2', // 明青
    '#eb2f96', // 法式洋红
    '#722ed1', // 酱紫
    '#fa8c16', // 日暮
    '#faad14', // 金盏花
    '#f5222d', // 薄暮
    '#a0d911', // 青柠
];

interface ThemeContextType {
    // 预设主题 ID
    presetThemeId: string;
    // Seed Token
    colorPrimary: string;
    setColorPrimary: (color: string) => void;
    borderRadius: number;
    setBorderRadius: (radius: number) => void;
    // 算法
    isDarkMode: boolean;
    setIsDarkMode: (isDark: boolean) => void;
    isCompact: boolean;
    setIsCompact: (compact: boolean) => void;
    // 背景图
    adminBackgroundImage: string;
    setAdminBackgroundImage: (url: string) => void;
    frontendBackgroundImage: string;
    setFrontendBackgroundImage: (url: string) => void;
    contentOpacity: number;
    setContentOpacity: (opacity: number) => void;
    // 方法
    applyPresetTheme: (themeId: string) => void;
    // 生成 Ant Design ThemeConfig
    getAntdTheme: (backgroundImage?: string) => ThemeConfig;
    // 完整的 antd 主题配置（用于 App 根级别）
    antdTheme: ThemeConfig;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useAppTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useAppTheme must be used within a ThemeProvider');
    }
    return context;
};

interface ThemeProviderProps {
    children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
    const [presetThemeId, setPresetThemeId] = useState(() =>
        localStorage.getItem(STORAGE_KEYS.PRESET_THEME) || 'default'
    );
    const [colorPrimary, setColorPrimary] = useState(() =>
        localStorage.getItem(STORAGE_KEYS.PRIMARY_COLOR) || '#1677ff'
    );
    const [borderRadius, setBorderRadius] = useState(() =>
        Number(localStorage.getItem(STORAGE_KEYS.BORDER_RADIUS)) || 6
    );
    const [isDarkMode, setIsDarkMode] = useState(() =>
        localStorage.getItem(STORAGE_KEYS.IS_DARK) === 'true'
    );
    const [isCompact, setIsCompact] = useState(() =>
        localStorage.getItem(STORAGE_KEYS.IS_COMPACT) === 'true'
    );
    const [adminBackgroundImage, setAdminBackgroundImage] = useState(() =>
        localStorage.getItem(STORAGE_KEYS.ADMIN_BG_IMAGE) || ''
    );
    const [frontendBackgroundImage, setFrontendBackgroundImage] = useState(() =>
        localStorage.getItem(STORAGE_KEYS.FRONTEND_BG_IMAGE) || ''
    );
    const [contentOpacity, setContentOpacity] = useState(() =>
        Number(localStorage.getItem(STORAGE_KEYS.CONTENT_OPACITY)) || 0.92
    );

    // 应用预设主题
    const applyPresetTheme = (themeId: string) => {
        const preset = PRESET_THEMES.find(t => t.id === themeId);
        if (preset) {
            setPresetThemeId(themeId);
            setColorPrimary(preset.colorPrimary);
            setBorderRadius(preset.borderRadius);
            setIsDarkMode(preset.isDark);
            if (preset.isCompact !== undefined) {
                setIsCompact(preset.isCompact);
            }
        }
    };

    // Persist to localStorage
    useEffect(() => { localStorage.setItem(STORAGE_KEYS.PRESET_THEME, presetThemeId); }, [presetThemeId]);
    useEffect(() => { localStorage.setItem(STORAGE_KEYS.PRIMARY_COLOR, colorPrimary); }, [colorPrimary]);
    useEffect(() => { localStorage.setItem(STORAGE_KEYS.BORDER_RADIUS, borderRadius.toString()); }, [borderRadius]);
    useEffect(() => { localStorage.setItem(STORAGE_KEYS.IS_DARK, isDarkMode.toString()); }, [isDarkMode]);
    useEffect(() => { localStorage.setItem(STORAGE_KEYS.IS_COMPACT, isCompact.toString()); }, [isCompact]);
    useEffect(() => { localStorage.setItem(STORAGE_KEYS.ADMIN_BG_IMAGE, adminBackgroundImage); }, [adminBackgroundImage]);
    useEffect(() => { localStorage.setItem(STORAGE_KEYS.FRONTEND_BG_IMAGE, frontendBackgroundImage); }, [frontendBackgroundImage]);
    useEffect(() => { localStorage.setItem(STORAGE_KEYS.CONTENT_OPACITY, contentOpacity.toString()); }, [contentOpacity]);

    /**
     * 生成 Ant Design ThemeConfig
     * 严格按照官方文档规范：
     * - token: Seed Token 配置
     * - algorithm: 预设算法组合
     * - components: 组件级 Token 覆盖
     */
    const getAntdTheme = (backgroundImage?: string): ThemeConfig => {
        // 算法组合 - 参考官方文档
        const algorithms: typeof theme.defaultAlgorithm[] = [];
        if (isDarkMode) {
            algorithms.push(theme.darkAlgorithm);
        } else {
            algorithms.push(theme.defaultAlgorithm);
        }
        if (isCompact) {
            algorithms.push(theme.compactAlgorithm);
        }

        const hasBgImage = !!backgroundImage;

        // 定义颜色变量，避免重复
        const colors = {
            // 浅色模式
            light: {
                bgContainer: '#ffffff',
                bgElevated: '#ffffff',
                bgLayout: '#f5f5f5',
                border: '#d9d9d9',
                borderSecondary: '#f0f0f0',
                text: 'rgba(0, 0, 0, 0.88)',
                textSecondary: 'rgba(0, 0, 0, 0.45)',
                // Table 专用
                tableHeaderBg: '#fafafa',
                tableRowHoverBg: '#fafafa',
                tableBorderColor: '#f0f0f0',
            },
            // 深色模式
            dark: {
                bgContainer: '#141414',
                bgElevated: '#1f1f1f',
                bgLayout: '#000000',
                border: '#424242',
                borderSecondary: '#303030',
                text: 'rgba(255, 255, 255, 0.85)',
                textSecondary: 'rgba(255, 255, 255, 0.45)',
                // Table 专用
                tableHeaderBg: '#1d1d1d',
                tableRowHoverBg: '#262626',
                tableBorderColor: '#303030',
            },
        };

        const c = isDarkMode ? colors.dark : colors.light;

        return {
            // Seed Token - 基础变量
            token: {
                colorPrimary,
                borderRadius,
                // 只有在有背景图时才覆盖背景色
                ...(hasBgImage && {
                    colorBgContainer: `rgba(${isDarkMode ? '30, 30, 30' : '255, 255, 255'}, ${contentOpacity})`,
                    colorBgElevated: `rgba(${isDarkMode ? '45, 45, 45' : '255, 255, 255'}, ${Math.min(contentOpacity + 0.05, 1)})`,
                }),
            },
            // 预设算法
            algorithm: algorithms,
            // 组件级 Token - 全面配置
            components: {
                // 布局组件
                Layout: {
                    headerBg: hasBgImage
                        ? `rgba(${isDarkMode ? '20, 20, 20' : '255, 255, 255'}, ${contentOpacity})`
                        : c.bgContainer,
                    bodyBg: hasBgImage ? 'transparent' : c.bgLayout,
                    siderBg: hasBgImage
                        ? `rgba(${isDarkMode ? '20, 20, 20' : '255, 255, 255'}, ${contentOpacity})`
                        : c.bgContainer,
                },
                // 菜单
                Menu: {
                    colorBgContainer: hasBgImage ? 'transparent' : undefined,
                },
                // 表格 - 全面配置
                Table: {
                    headerBg: c.tableHeaderBg,
                    headerColor: c.text,
                    rowHoverBg: c.tableRowHoverBg,
                    borderColor: c.tableBorderColor,
                    headerSortActiveBg: isDarkMode ? '#262626' : '#f0f0f0',
                    headerSortHoverBg: isDarkMode ? '#303030' : '#f5f5f5',
                    bodySortBg: isDarkMode ? '#1f1f1f' : '#fafafa',
                    headerFilterHoverBg: isDarkMode ? '#303030' : '#e6e6e6',
                    filterDropdownBg: c.bgElevated,
                    filterDropdownMenuBg: c.bgElevated,
                    fixedHeaderSortActiveBg: isDarkMode ? '#262626' : '#f0f0f0',
                    rowSelectedBg: isDarkMode ? '#111a2c' : '#e6f4ff',
                    rowSelectedHoverBg: isDarkMode ? '#1a2744' : '#bae0ff',
                    rowExpandedBg: isDarkMode ? '#1a1a1a' : '#fafafa',
                },
                // 卡片
                Card: {
                    colorBgContainer: hasBgImage
                        ? `rgba(${isDarkMode ? '30, 30, 30' : '255, 255, 255'}, ${contentOpacity})`
                        : c.bgContainer,
                },
                // 模态框
                Modal: {
                    contentBg: c.bgElevated,
                    headerBg: c.bgElevated,
                    footerBg: 'transparent',
                },
                // 抽屉
                Drawer: {
                    colorBgElevated: c.bgElevated,
                },
                // 下拉菜单
                Dropdown: {
                    colorBgElevated: c.bgElevated,
                },
                // 选择器
                Select: {
                    colorBgElevated: c.bgElevated,
                    optionSelectedBg: isDarkMode ? '#111a2c' : '#e6f4ff',
                },
                // 日期选择器
                DatePicker: {
                    colorBgElevated: c.bgElevated,
                },
                // 弹出确认框
                Popconfirm: {
                    colorBgElevated: c.bgElevated,
                },
                // 气泡卡片
                Popover: {
                    colorBgElevated: c.bgElevated,
                },
                // 提示
                Tooltip: {
                    colorBgSpotlight: isDarkMode ? '#434343' : 'rgba(0, 0, 0, 0.85)',
                },
                // 消息
                Message: {
                    contentBg: c.bgElevated,
                },
                // 通知
                Notification: {
                    colorBgElevated: c.bgElevated,
                },
            },
        };
    };

    // 根级别主题配置（不带背景图）
    const antdTheme = useMemo(() => getAntdTheme(), [colorPrimary, borderRadius, isDarkMode, isCompact, contentOpacity]);

    return (
        <ThemeContext.Provider
            value={{
                presetThemeId,
                colorPrimary,
                setColorPrimary,
                borderRadius,
                setBorderRadius,
                isDarkMode,
                setIsDarkMode,
                isCompact,
                setIsCompact,
                adminBackgroundImage,
                setAdminBackgroundImage,
                frontendBackgroundImage,
                setFrontendBackgroundImage,
                contentOpacity,
                setContentOpacity,
                applyPresetTheme,
                getAntdTheme,
                antdTheme,
            }}
        >
            {children}
        </ThemeContext.Provider>
    );
};
