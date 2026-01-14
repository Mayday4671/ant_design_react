import React from 'react';
import { Layout, Menu, Typography, Button, Space, theme, ConfigProvider } from 'antd';
import { HomeOutlined, InfoCircleOutlined, SettingOutlined, ReadOutlined } from '@ant-design/icons';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAppTheme } from '../contexts/theme-context';

const { Header, Content, Footer } = Layout;
const { Title } = Typography;

const FrontendLayout: React.FC = () => {
    const { frontendBackgroundImage, contentOpacity, isDarkMode, getAntdTheme } = useAppTheme();
    const {
        token: { borderRadiusLG },
    } = theme.useToken();
    const navigate = useNavigate();
    const location = useLocation();

    const menuItems = [
        { key: '/', icon: <HomeOutlined />, label: '首页' },
        { key: '/articles', icon: <ReadOutlined />, label: '文章' },
        { key: '/about', icon: <InfoCircleOutlined />, label: '关于' },
    ];

    // 使用前台专属的背景图生成主题
    const frontendTheme = getAntdTheme(frontendBackgroundImage);

    return (
        <ConfigProvider theme={frontendTheme}>
            <Layout
                style={{
                    minHeight: '100vh',
                    backgroundImage: frontendBackgroundImage ? `url(${frontendBackgroundImage})` : 'none',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundAttachment: 'fixed',
                }}
            >
                <Header
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '0 48px',
                        borderBottom: frontendBackgroundImage ? '1px solid rgba(255, 255, 255, 0.1)' : undefined,
                    }}
                >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                        <Title
                            level={4}
                            style={{
                                margin: 0,
                                color: isDarkMode ? '#fff' : '#1677ff',
                            }}
                        >
                            📚 技术博客
                        </Title>
                    </div>
                    <Menu
                        mode="horizontal"
                        selectedKeys={[location.pathname === '/' ? '/' : location.pathname.startsWith('/article') ? '/articles' : location.pathname]}
                        onClick={({ key }) => navigate(key)}
                        items={menuItems}
                        style={{
                            flex: 1,
                            minWidth: 0,
                            justifyContent: 'center',
                            background: 'transparent',
                            borderBottom: 'none',
                        }}
                    />
                    <Space>
                        <Button
                            type="primary"
                            icon={<SettingOutlined />}
                            onClick={() => navigate('/admin')}
                        >
                            管理后台
                        </Button>
                    </Space>
                </Header>

                <Content
                    style={{
                        padding: '32px 40px',
                    }}
                >
                    <div
                        style={{
                            minHeight: 'calc(100vh - 180px)',
                            backgroundColor: frontendBackgroundImage
                                ? `rgba(${isDarkMode ? '30, 30, 30' : '255, 255, 255'}, ${contentOpacity})`
                                : undefined,
                            borderRadius: borderRadiusLG,
                            padding: '28px 32px',
                            border: frontendBackgroundImage ? `1px solid rgba(255, 255, 255, 0.1)` : 'none',
                        }}
                    >
                        <Outlet />
                    </div>
                </Content>

                <Footer
                    style={{
                        textAlign: 'center',
                        background: 'transparent',
                        color: isDarkMode ? 'rgba(255, 255, 255, 0.65)' : undefined,
                    }}
                >
                    © {new Date().getFullYear()} 技术博客. All rights reserved.
                </Footer>
            </Layout>
        </ConfigProvider>
    );
};

export default FrontendLayout;
