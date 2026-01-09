import React, { useState } from 'react';
import { Layout, Menu, Button, theme } from 'antd';
import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    DashboardOutlined,
    UserOutlined,
    SettingOutlined,
} from '@ant-design/icons';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAppTheme } from '../contexts/ThemeContext';

const { Header, Sider, Content } = Layout;

const MainLayout: React.FC = () => {
    const { backgroundImage, contentOpacity } = useAppTheme();
    const [collapsed, setCollapsed] = useState(false);
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();
    const navigate = useNavigate();
    const location = useLocation();

    return (
        <Layout
            style={{
                minHeight: '100vh',
                backgroundImage: backgroundImage ? `url(${backgroundImage})` : 'none',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundAttachment: 'fixed',
            }}
        >
            <Sider
                trigger={null}
                collapsible
                collapsed={collapsed}
                theme="light"
                style={{
                    backgroundColor: `rgba(255, 255, 255, ${backgroundImage ? 0.8 : 1})`,
                }}
            >
                <div style={{ padding: '16px', textAlign: 'center' }}>
                    <h1 style={{ margin: 0, fontSize: collapsed ? '0.8rem' : '1.2rem', whiteSpace: 'nowrap', overflow: 'hidden' }}>
                        {collapsed ? '应用' : 'AntDesign 应用'}
                    </h1>
                </div>
                <Menu
                    theme="light"
                    mode="inline"
                    selectedKeys={[location.pathname]}
                    onClick={({ key }) => navigate(key)}
                    items={[
                        {
                            key: '/',
                            icon: <DashboardOutlined />,
                            label: '仪表盘',
                        },
                        {
                            key: '/users',
                            icon: <UserOutlined />,
                            label: '用户列表',
                        },
                        {
                            key: '/settings',
                            icon: <SettingOutlined />,
                            label: '设置',
                        },
                    ]}
                />
            </Sider>
            <Layout style={{ background: 'transparent' }}>
                <Header style={{
                    padding: 0,
                    background: `rgba(255, 255, 255, ${backgroundImage ? 0.8 : 1})`,
                    display: 'flex',
                    alignItems: 'center',
                    backdropFilter: backgroundImage ? 'blur(8px)' : 'none'
                }}>
                    <Button
                        type="text"
                        icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                        onClick={() => setCollapsed(!collapsed)}
                        style={{
                            fontSize: '16px',
                            width: 64,
                            height: 64,
                        }}
                    />
                </Header>
                <Content
                    style={{
                        margin: '24px 16px',
                        padding: 24,
                        minHeight: 280,
                        background: colorBgContainer, // Keeping original variable but might need rgba if we want transparency on card itself.
                        // Actually colorBgContainer comes from token. 
                        // Let's override background with opacity if set.
                        backgroundColor: `rgba(255, 255, 255, ${contentOpacity})`,
                        borderRadius: borderRadiusLG,
                        backdropFilter: backgroundImage ? 'blur(4px)' : 'none',
                        transition: 'all 0.3s ease'
                    }}
                >
                    <Outlet />
                </Content>
            </Layout>
        </Layout>
    );
};

export default MainLayout;
