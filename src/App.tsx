import React from 'react';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import { BrowserRouter } from 'react-router-dom';
import AppRouter from './router';
import { ThemeProvider, useAppTheme } from './contexts/theme-context';

const InnerApp: React.FC = () => {
  // 使用空字符串作为默认背景，这样基础主题不会有透明效果
  // 各个 Layout 组件会使用各自的背景图来覆盖这个主题
  const { getAntdTheme } = useAppTheme();
  const baseTheme = getAntdTheme('');

  return (
    <ConfigProvider theme={baseTheme} locale={zhCN}>
      <BrowserRouter>
        <AppRouter />
      </BrowserRouter>
    </ConfigProvider>
  );
};

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <InnerApp />
    </ThemeProvider>
  );
};

export default App;
