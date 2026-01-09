import React, { createContext, useState, useContext, ReactNode } from 'react';
import { theme } from 'antd';
import type { ThemeConfig } from 'antd';

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
    const [primaryColor, setPrimaryColor] = useState('#1677ff');
    const [backgroundImage, setBackgroundImage] = useState('');
    const [contentOpacity, setContentOpacity] = useState(0.9);
    const [isDarkMode, setIsDarkMode] = useState(false);

    const antdTheme: ThemeConfig = {
        token: {
            colorPrimary: primaryColor,
        },
        algorithm: isDarkMode ? theme.darkAlgorithm : theme.defaultAlgorithm,
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
