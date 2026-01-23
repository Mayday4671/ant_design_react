import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Layout, Menu, Typography, Breadcrumb, ConfigProvider, theme } from 'antd';
import {
    RocketOutlined,
    PictureOutlined,
    CodeOutlined,
    BulbOutlined,
    StarOutlined,
    SettingOutlined,
    ConsoleSqlOutlined,
    CoffeeOutlined
} from '@ant-design/icons';
import { useAppTheme } from '../contexts/theme-context';
import '../assets/styles/layouts/ai-tools-layout.css'; // Reuse existing styles

const { Sider, Content } = Layout;
const { Title } = Typography;

// ========== 顶部导航链接 ==========
const topNavLinks = [
    { key: '/', label: 'AI工具导航' },
    { key: '/tools/image', label: '图片工具' },
    { key: '/tools/java', label: 'Java工具' },
    { key: '/articles', label: '每日AI资讯' },
    { key: '/docs', label: '项目文档' },
    { key: '/about', label: '关于我们' },
];

const JavaToolsLayout: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [collapsed, setCollapsed] = useState(false);

    // Theme Context
    const { isDarkMode, setIsDarkMode, getAntdTheme, frontendBackgroundImage, contentOpacity } = useAppTheme();
    const { token: { colorBgContainer, borderRadiusLG } } = theme.useToken();
    const themeConfig = getAntdTheme(frontendBackgroundImage);

    // Layout Background
    const defaultBg = isDarkMode ? '#141414' : '#f0f2f5';
    const layoutBgStyle = frontendBackgroundImage
        ? `url(${frontendBackgroundImage}) center/cover fixed`
        : defaultBg;

    // Glass Effect
    const blurAmount = Math.round(contentOpacity * 20);
    const glassStyle = {
        background: isDarkMode
            ? `rgba(30, 30, 45, ${contentOpacity})`
            : `rgba(255, 255, 255, ${contentOpacity})`,
        backdropFilter: frontendBackgroundImage && blurAmount > 0 ? `blur(${blurAmount}px) saturate(${100 + contentOpacity * 80}%)` : undefined,
        WebkitBackdropFilter: frontendBackgroundImage && blurAmount > 0 ? `blur(${blurAmount}px) saturate(${100 + contentOpacity * 80}%)` : undefined,
    };

    // Menu Items Configuration
    const menuItems = [
        {
            key: '/tools/java/sql-json',
            icon: <ConsoleSqlOutlined />,
            label: 'SQL 转 JSON',
        },
        {
            key: '/tools/java/sql-to-bean',
            icon: <CodeOutlined />,
            label: 'SQL 转 Java Bean',
        },
        // Future Java tools can go here
    ];

    // Find current active menu item's label for breadcrumb
    const currentItem = menuItems.find(item => item.key === location.pathname);

    return (
        <ConfigProvider theme={themeConfig}>
            <Layout
                className={`ai-nav-layout ${isDarkMode ? 'dark-mode' : 'light-mode'} ${frontendBackgroundImage ? 'has-bg-image' : ''}`}
                style={{
                    background: layoutBgStyle,
                    // @ts-expect-error CSS Variable
                    '--content-opacity': contentOpacity,
                    '--blur-amount': `${blurAmount}px`,
                    height: '100vh',
                    overflow: 'hidden',
                }}
            >
                <Sider
                    width={220}
                    className="ai-nav-sider"
                    theme={isDarkMode ? 'dark' : 'light'}
                    style={frontendBackgroundImage ? glassStyle : undefined}
                    collapsible
                    collapsed={collapsed}
                    onCollapse={setCollapsed}
                >
                    <div className="sider-inner">
                        {/* Logo */}
                        <div className="sider-logo" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
                            <CoffeeOutlined className="logo-icon" style={{ color: '#faad14' }} />
                            {!collapsed && <Title level={4} className="logo-text">Java工具箱</Title>}
                        </div>

                        {/* 分类菜单 */}
                        <div className="sider-menu-wrapper">
                            <Menu
                                mode="inline"
                                selectedKeys={[location.pathname]}
                                className="sider-menu"
                                items={menuItems}
                                onClick={({ key }) => navigate(key)}
                            />
                        </div>
                    </div>
                </Sider>

                {/* ========== 主内容区 ========== */}
                <Layout
                    className="ai-nav-main"
                    style={{
                        background: 'transparent'
                    }}
                >
                    {/* 顶部导航 */}
                    <div className="top-nav-wrapper">
                        <div
                            className="top-nav"
                            style={{
                                background: isDarkMode
                                    ? 'rgba(15, 15, 25, 0.9)'
                                    : 'rgba(255, 255, 255, 0.95)',
                            }}
                        >
                            {/* 左侧导航链接 */}
                            <div className="top-nav-left">
                                {topNavLinks.map((link) => (
                                    <div
                                        key={link.key}
                                        className={`top-nav-item ${location.pathname.startsWith(link.key) && link.key !== '/' ? 'active' : ''}`}
                                        onClick={() => navigate(link.key)}
                                    >
                                        {link.key === '/' && <RocketOutlined className="nav-item-icon" />}
                                        {link.key === '/tools/image' && <PictureOutlined className="nav-item-icon" />}
                                        {link.key === '/tools/java' && <CoffeeOutlined className="nav-item-icon" />}
                                        <span>{link.label}</span>
                                    </div>
                                ))}
                            </div>

                            {/* 右侧操作 */}
                            <div className="top-nav-right">
                                <div
                                    className="nav-action-btn"
                                    onClick={() => setIsDarkMode(!isDarkMode)}
                                >
                                    {isDarkMode ? <BulbOutlined /> : <StarOutlined />}
                                </div>
                                <div
                                    className="nav-action-btn primary"
                                    onClick={() => navigate('/admin')}
                                >
                                    <SettingOutlined />
                                    <span>管理后台</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <Content className="main-content" style={{ overflow: 'hidden', height: '100%', display: 'flex', flexDirection: 'column', padding: 24 }}>
                        <div style={{ marginBottom: 16 }}>
                            <Breadcrumb
                                items={[
                                    { title: '首页', href: '/' },
                                    { title: 'Java工具', href: '/tools/java' },
                                    { title: currentItem?.label || '当前工具' },
                                ]}
                            />
                        </div>

                        {/* 卡片容器 */}
                        <div style={{
                            flex: 1,
                            overflow: 'auto',
                            background: frontendBackgroundImage ? glassStyle.background : colorBgContainer,
                            backdropFilter: frontendBackgroundImage ? glassStyle.backdropFilter : undefined,
                            WebkitBackdropFilter: frontendBackgroundImage ? glassStyle.WebkitBackdropFilter : undefined,
                            borderRadius: borderRadiusLG,
                            padding: 24,
                            boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.03), 0 1px 6px -1px rgba(0, 0, 0, 0.02), 0 2px 4px 0 rgba(0, 0, 0, 0.02)'
                        }}>
                            <Outlet />
                        </div>
                    </Content>
                </Layout>
            </Layout>
        </ConfigProvider>
    );
};

export default JavaToolsLayout;
