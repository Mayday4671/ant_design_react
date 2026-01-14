import React, { useState } from 'react';
import { Layout, Menu, Button, theme, ConfigProvider } from 'antd';
import {
    MenuFoldOutlined, MenuUnfoldOutlined, DashboardOutlined,
    UserOutlined, SettingOutlined,
    RobotOutlined, HomeOutlined, ReadOutlined
} from '@ant-design/icons';
import { useLocation, useNavigate, Outlet } from 'react-router-dom';
import { useAppTheme } from '../contexts/theme-context';

const { Header, Sider, Content } = Layout;

const AdminLayout: React.FC = () => {
    const { adminBackgroundImage, contentOpacity, isDarkMode, getAntdTheme, colorPrimary } = useAppTheme();
    const [collapsed, setCollapsed] = useState(false);
    const {
        token: { borderRadiusLG },
    } = theme.useToken();
    const navigate = useNavigate();
    const location = useLocation();

    // 使用后台专属的背景图生成主题
    const adminTheme = getAntdTheme(adminBackgroundImage);

    // 默认背景色（无背景图时）
    const defaultBgColor = isDarkMode ? '#0a0a0a' : '#f0f2f5';
    const siderBg = isDarkMode ? '#141414' : '#ffffff';
    const headerBg = isDarkMode ? '#141414' : '#ffffff';
    const contentBg = isDarkMode ? '#1f1f1f' : '#ffffff';

    return (
        <ConfigProvider theme={adminTheme}>
            <Layout
                style={{
                    minHeight: '100vh',
                    background: adminBackgroundImage
                        ? `url(${adminBackgroundImage}) center/cover fixed`
                        : defaultBgColor,
                }}
            >
                <Sider
                    trigger={null}
                    collapsible
                    collapsed={collapsed}
                    theme={isDarkMode ? 'dark' : 'light'}
                    style={{
                        background: adminBackgroundImage
                            ? `rgba(${isDarkMode ? '20, 20, 20' : '255, 255, 255'}, ${contentOpacity})`
                            : siderBg,
                        borderRight: `1px solid ${isDarkMode ? '#303030' : '#f0f0f0'}`,
                        boxShadow: adminBackgroundImage ? 'none' : '2px 0 8px rgba(0,0,0,0.05)',
                    }}
                >
                    <div
                        style={{
                            padding: '20px 16px',
                            textAlign: 'center',
                            borderBottom: `1px solid ${isDarkMode ? '#303030' : '#f0f0f0'}`,
                        }}
                    >
                        <h1
                            style={{
                                margin: 0,
                                fontSize: collapsed ? '0.9rem' : '1.1rem',
                                fontWeight: 600,
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                color: isDarkMode ? '#fff' : colorPrimary,
                            }}
                        >
                            {collapsed ? '🏠' : '后台管理系统'}
                        </h1>
                    </div>
                    <Menu
                        theme={isDarkMode ? 'dark' : 'light'}
                        mode="inline"
                        selectedKeys={[location.pathname]}
                        onClick={({ key }) => navigate(key)}
                        style={{ border: 'none', background: 'transparent' }}
                        items={[
                            {
                                key: '/admin',
                                icon: <DashboardOutlined />,
                                label: '仪表盘',
                            },
                            {
                                key: '/admin/articles',
                                icon: <ReadOutlined />,
                                label: '文章管理',
                            },
                            {
                                key: '/admin/users',
                                icon: <UserOutlined />,
                                label: '用户列表',
                            },
                            {
                                key: '/admin/ai',
                                icon: <RobotOutlined />,
                                label: 'AI 助手',
                            },
                            {
                                key: '/admin/settings',
                                icon: <SettingOutlined />,
                                label: '设置',
                            },
                            {
                                type: 'divider',
                            },
                            {
                                key: '/',
                                icon: <HomeOutlined />,
                                label: '返回前台',
                            },
                        ]}
                    />
                </Sider>
                <Layout style={{ background: 'transparent' }}>
                    <Header
                        style={{
                            padding: '0 16px',
                            display: 'flex',
                            alignItems: 'center',
                            background: adminBackgroundImage
                                ? `rgba(${isDarkMode ? '20, 20, 20' : '255, 255, 255'}, ${contentOpacity})`
                                : headerBg,
                            borderBottom: `1px solid ${isDarkMode ? '#303030' : '#f0f0f0'}`,
                            boxShadow: adminBackgroundImage ? 'none' : '0 2px 8px rgba(0,0,0,0.04)',
                        }}
                    >
                        <Button
                            type="text"
                            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                            onClick={() => setCollapsed(!collapsed)}
                            style={{
                                fontSize: '16px',
                                width: 48,
                                height: 48,
                            }}
                        />
                    </Header>
                    <Content
                        style={{
                            margin: 24,
                            padding: 24,
                            minHeight: 280,
                            background: adminBackgroundImage
                                ? `rgba(${isDarkMode ? '30, 30, 30' : '255, 255, 255'}, ${contentOpacity})`
                                : contentBg,
                            borderRadius: borderRadiusLG,
                            boxShadow: adminBackgroundImage ? 'none' : '0 2px 8px rgba(0,0,0,0.06)',
                            border: adminBackgroundImage
                                ? `1px solid rgba(${isDarkMode ? '255,255,255' : '0,0,0'}, 0.1)`
                                : 'none',
                        }}
                    >
                        <Outlet />
                    </Content>
                </Layout>
            </Layout>
        </ConfigProvider>
    );
};

export default AdminLayout;
