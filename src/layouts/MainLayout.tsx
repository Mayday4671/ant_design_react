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
    const { backgroundImage } = useAppTheme();
    const [collapsed, setCollapsed] = useState(false);
    const {
        token: { borderRadiusLG },
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
                    borderRight: backgroundImage ? '1px solid rgba(255, 255, 255, 0.1)' : undefined,
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
                    display: 'flex',
                    alignItems: 'center',
                    borderBottom: backgroundImage ? '1px solid rgba(255, 255, 255, 0.1)' : undefined,
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
                        borderRadius: borderRadiusLG,
                        transition: 'all 0.3s ease',
                        border: backgroundImage ? `1px solid rgba(255, 255, 255, 0.1)` : 'none',
                    }}
                >
                    <Outlet />
                </Content>
            </Layout>
        </Layout>
    );
};

export default MainLayout;
