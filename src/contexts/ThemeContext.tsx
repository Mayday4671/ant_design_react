import React, { createContext, useState, useContext, useEffect } from 'react';
import type { ReactNode } from 'react';
import { theme } from 'antd';
import type { ThemeConfig } from 'antd';

// Storage keys
const STORAGE_KEYS = {
    PRIMARY_COLOR: 'app_primary_color',
    BG_IMAGE: 'app_bg_image',
    CONTENT_OPACITY: 'app_content_opacity',
    DARK_MODE: 'app_dark_mode',
};

interface ThemeContextType {
    primaryColor: string;
    setPrimaryColor: (color: string) => void;
    backgroundImage: string;
    setBackgroundImage: (url: string) => void;
    contentOpacity: number;
    setContentOpacity: (opacity: number) => void;
    isDarkMode: boolean;
    setIsDarkMode: (isDark: boolean) => void;
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
    // Initialize from localStorage or defaults
    const [primaryColor, setPrimaryColor] = useState(() =>
        localStorage.getItem(STORAGE_KEYS.PRIMARY_COLOR) || '#1677ff'
    );
    const [backgroundImage, setBackgroundImage] = useState(() =>
        localStorage.getItem(STORAGE_KEYS.BG_IMAGE) || ''
    );
    const [contentOpacity, setContentOpacity] = useState(() =>
        Number(localStorage.getItem(STORAGE_KEYS.CONTENT_OPACITY)) || 0.9
    );
    const [isDarkMode, setIsDarkMode] = useState(() =>
        localStorage.getItem(STORAGE_KEYS.DARK_MODE) === 'true'
    );

    // Persist changes to localStorage
    useEffect(() => {
        localStorage.setItem(STORAGE_KEYS.PRIMARY_COLOR, primaryColor);
    }, [primaryColor]);

    useEffect(() => {
        localStorage.setItem(STORAGE_KEYS.BG_IMAGE, backgroundImage);
    }, [backgroundImage]);

    useEffect(() => {
        localStorage.setItem(STORAGE_KEYS.CONTENT_OPACITY, contentOpacity.toString());
    }, [contentOpacity]);

    useEffect(() => {
        localStorage.setItem(STORAGE_KEYS.DARK_MODE, isDarkMode.toString());
    }, [isDarkMode]);

    const antdTheme: ThemeConfig = {
        token: {
            colorPrimary: primaryColor,
            colorBgContainer: backgroundImage
                ? `rgba(${isDarkMode ? '30, 30, 30' : '255, 255, 255'}, ${contentOpacity})`
                : (isDarkMode ? '#141414' : '#ffffff'),
            colorBgElevated: backgroundImage
                ? `rgba(${isDarkMode ? '45, 45, 45' : '255, 255, 255'}, ${Math.min(contentOpacity + 0.1, 1)})`
                : (isDarkMode ? '#1f1f1f' : '#ffffff'),
        },
        algorithm: isDarkMode ? theme.darkAlgorithm : theme.defaultAlgorithm,
        components: {
            Layout: {
                colorBgHeader: backgroundImage
                    ? `rgba(${isDarkMode ? '20, 20, 20' : '255, 255, 255'}, ${contentOpacity})`
                    : (isDarkMode ? '#001529' : '#ffffff'),
                colorBgBody: 'transparent',
            },
            Menu: {
                colorBgContainer: backgroundImage ? 'transparent' : undefined,
            },
            Table: {
                headerBg: backgroundImage
                    ? `rgba(${isDarkMode ? '40, 40, 40' : '250, 250, 250'}, ${contentOpacity})`
                    : (isDarkMode ? '#1d1d1d' : '#fafafa'),
            }
        }
    };

    return (
        <ThemeContext.Provider
            value={{
                primaryColor,
                setPrimaryColor,
                backgroundImage,
                setBackgroundImage,
                contentOpacity,
                setContentOpacity,
                isDarkMode,
                setIsDarkMode,
                antdTheme,
            }}
        >
            {children}
        </ThemeContext.Provider>
    );
};
