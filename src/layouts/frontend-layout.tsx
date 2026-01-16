import React from 'react';
import { Layout, Menu, Typography, Button, Space, Row, Col, Divider, ConfigProvider } from 'antd';
import {
    HomeOutlined, AppstoreOutlined, FileTextOutlined, TeamOutlined,
    GithubOutlined, GlobalOutlined, RocketOutlined
} from '@ant-design/icons';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAppTheme } from '../contexts/theme-context';

const { Header, Content, Footer } = Layout;
const { Title, Text, Link } = Typography;

const FrontendLayout: React.FC = () => {
    const { isDarkMode, getAntdTheme } = useAppTheme();
    const navigate = useNavigate();
    const location = useLocation();

    // 导航菜单项
    const menuItems = [
        { key: '/', icon: <HomeOutlined />, label: '首页' },
        { key: '/ai-tools', icon: <AppstoreOutlined />, label: 'AI 工具' },
        { key: '/articles', icon: <FileTextOutlined />, label: '文档' },
        { key: '/about', icon: <TeamOutlined />, label: '关于我们' },
    ];

    // 页脚链接数据
    const footerLinks = {
        products: {
            title: '产品',
            links: [
                { label: '数据可视化', href: '/products' },
                { label: '图分析引擎', href: '/products' },
                { label: '移动端图表', href: '/products' },
                { label: '地理空间', href: '/products' },
            ]
        },
        resources: {
            title: '资源',
            links: [
                { label: '快速开始', href: '/articles' },
                { label: 'API 文档', href: '/articles' },
                { label: '示例代码', href: '/articles' },
                { label: '更新日志', href: '/articles' },
            ]
        },
        community: {
            title: '社区',
            links: [
                { label: 'GitHub', href: 'https://github.com' },
                { label: '讨论区', href: '/about' },
                { label: '贡献指南', href: '/about' },
                { label: '问题反馈', href: '/about' },
            ]
        },
        company: {
            title: '关于',
            links: [
                { label: '关于我们', href: '/about' },
                { label: '联系我们', href: '/about' },
                { label: '加入我们', href: '/about' },
                { label: '隐私政策', href: '/about' },
            ]
        }
    };

    // 使用前台专属主题
    const frontendTheme = getAntdTheme('');

    // 玻璃拟态样式
    const glassStyle = {
        background: isDarkMode
            ? 'rgba(20, 20, 30, 0.8)'
            : 'rgba(255, 255, 255, 0.85)',
        backdropFilter: 'blur(20px) saturate(180%)',
        WebkitBackdropFilter: 'blur(20px) saturate(180%)',
    };

    return (
        <ConfigProvider theme={frontendTheme}>
            <Layout
                style={{
                    minHeight: '100vh',
                    background: isDarkMode
                        ? 'linear-gradient(135deg, #0d0d1a 0%, #1a1a2e 50%, #16213e 100%)'
                        : 'linear-gradient(135deg, #e8eaf6 0%, #f5f7fa 50%, #e3f2fd 100%)',
                }}
            >
                {/* ========== Header - Premium Glass Design ========== */}
                <Header
                    style={{
                        position: 'sticky',
                        top: 0,
                        zIndex: 100,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '0 48px',
                        height: 70,
                        ...glassStyle,
                        borderBottom: `1px solid ${isDarkMode ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.04)'}`,
                        boxShadow: isDarkMode
                            ? '0 4px 30px rgba(0, 0, 0, 0.3)'
                            : '0 4px 30px rgba(0, 0, 0, 0.08)',
                    }}
                >
                    {/* Logo - Enhanced Design */}
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 14,
                            cursor: 'pointer',
                            transition: 'transform 0.3s ease',
                        }}
                        onClick={() => navigate('/')}
                        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
                        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                    >
                        <div
                            style={{
                                width: 42,
                                height: 42,
                                borderRadius: 12,
                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: '#fff',
                                fontSize: 22,
                                boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
                                animation: 'logoFloat 3s ease-in-out infinite',
                            }}
                        >
                            <RocketOutlined />
                        </div>
                        <Title
                            level={4}
                            style={{
                                margin: 0,
                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                fontWeight: 700,
                                letterSpacing: '0.5px',
                            }}
                        >
                            Awesome Products
                        </Title>
                    </div>

                    {/* Navigation Menu - Modern Style */}
                    <Menu
                        mode="horizontal"
                        selectedKeys={[
                            location.pathname === '/' ? '/' :
                                location.pathname.startsWith('/article') ? '/articles' :
                                    location.pathname
                        ]}
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

                    {/* Right Actions - Enhanced Buttons */}
                    <Space size="middle">
                        <Button
                            type="text"
                            icon={<GithubOutlined />}
                            style={{
                                fontSize: 20,
                                width: 42,
                                height: 42,
                                borderRadius: 12,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                transition: 'all 0.3s',
                            }}
                            onClick={() => window.open('https://github.com')}
                        />
                        <Button
                            type="text"
                            icon={<GlobalOutlined />}
                            style={{
                                height: 42,
                                borderRadius: 12,
                                padding: '0 16px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: 6,
                                transition: 'all 0.3s',
                            }}
                        >
                            中文
                        </Button>
                        <Button
                            type="primary"
                            onClick={() => navigate('/admin')}
                            style={{
                                height: 42,
                                borderRadius: 12,
                                padding: '0 24px',
                                fontWeight: 600,
                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                border: 'none',
                                boxShadow: '0 4px 15px rgba(102, 126, 234, 0.35)',
                                transition: 'all 0.3s',
                            }}
                        >
                            控制台
                        </Button>
                    </Space>
                </Header>

                {/* ========== Content ========== */}
                <Content style={{ flex: 1 }}>
                    <Outlet />
                </Content>

                {/* ========== Footer - Premium Dark Design ========== */}
                <Footer
                    style={{
                        background: isDarkMode
                            ? 'linear-gradient(180deg, #0d0d1a 0%, #1a1a2e 100%)'
                            : 'linear-gradient(180deg, #1a1a2e 0%, #0d0d1a 100%)',
                        padding: '72px 48px 40px',
                        position: 'relative',
                        overflow: 'hidden',
                    }}
                >
                    {/* Decorative gradient line */}
                    <div style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        height: 3,
                        background: 'linear-gradient(90deg, transparent, #667eea, #764ba2, #f093fb, transparent)',
                    }} />

                    <div style={{ maxWidth: 1600, margin: '0 auto', position: 'relative', zIndex: 1 }}>
                        {/* Footer Links */}
                        <Row gutter={[48, 48]}>
                            {Object.values(footerLinks).map((section) => (
                                <Col xs={12} sm={12} md={6} key={section.title}>
                                    <Title
                                        level={5}
                                        style={{
                                            color: 'rgba(255,255,255,0.95)',
                                            marginBottom: 28,
                                            fontWeight: 600,
                                            letterSpacing: '0.5px',
                                        }}
                                    >
                                        {section.title}
                                    </Title>
                                    <Space direction="vertical" size={14}>
                                        {section.links.map((link) => (
                                            <Link
                                                key={link.label}
                                                onClick={() => link.href.startsWith('http') ? window.open(link.href) : navigate(link.href)}
                                                style={{
                                                    color: 'rgba(255,255,255,0.6)',
                                                    cursor: 'pointer',
                                                    transition: 'all 0.3s',
                                                    display: 'inline-block',
                                                }}
                                                onMouseEnter={(e) => {
                                                    e.currentTarget.style.color = '#a5b4fc';
                                                    e.currentTarget.style.transform = 'translateX(4px)';
                                                }}
                                                onMouseLeave={(e) => {
                                                    e.currentTarget.style.color = 'rgba(255,255,255,0.6)';
                                                    e.currentTarget.style.transform = 'translateX(0)';
                                                }}
                                            >
                                                {link.label}
                                            </Link>
                                        ))}
                                    </Space>
                                </Col>
                            ))}
                        </Row>

                        <Divider style={{
                            borderColor: 'rgba(255,255,255,0.08)',
                            margin: '56px 0 28px',
                        }} />

                        {/* Copyright */}
                        <Row justify="space-between" align="middle">
                            <Col>
                                <Text style={{ color: 'rgba(255,255,255,0.4)' }}>
                                    © {new Date().getFullYear()} Awesome Products. Made with ❤️ using Ant Design.
                                </Text>
                            </Col>
                            <Col>
                                <Space split={<Divider type="vertical" style={{ borderColor: 'rgba(255,255,255,0.15)' }} />}>
                                    {['服务条款', '隐私政策', 'Sitemap'].map(item => (
                                        <Link
                                            key={item}
                                            style={{
                                                color: 'rgba(255,255,255,0.4)',
                                                transition: 'color 0.3s',
                                            }}
                                            onMouseEnter={(e) => e.currentTarget.style.color = '#a5b4fc'}
                                            onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.4)'}
                                        >
                                            {item}
                                        </Link>
                                    ))}
                                </Space>
                            </Col>
                        </Row>
                    </div>
                </Footer>
            </Layout>

            {/* Global Styles for Menu Animations */}
            <style>{`
                @keyframes logoFloat {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-3px); }
                }

                .ant-menu-horizontal {
                    line-height: 68px !important;
                }

                .ant-menu-horizontal > .ant-menu-item,
                .ant-menu-horizontal > .ant-menu-submenu {
                    padding: 0 20px !important;
                    margin: 0 4px !important;
                    border-radius: 12px !important;
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
                    position: relative !important;
                }

                .ant-menu-horizontal > .ant-menu-item::after,
                .ant-menu-horizontal > .ant-menu-submenu::after {
                    display: none !important;
                }

                .ant-menu-horizontal > .ant-menu-item::before {
                    content: '';
                    position: absolute;
                    bottom: 12px;
                    left: 50%;
                    transform: translateX(-50%) scaleX(0);
                    width: 24px;
                    height: 3px;
                    background: linear-gradient(90deg, #667eea, #764ba2);
                    border-radius: 3px;
                    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                }

                .ant-menu-horizontal > .ant-menu-item:hover::before,
                .ant-menu-horizontal > .ant-menu-item-selected::before {
                    transform: translateX(-50%) scaleX(1);
                }

                .ant-menu-horizontal > .ant-menu-item:hover {
                    background: ${isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(102, 126, 234, 0.08)'} !important;
                }

                .ant-menu-horizontal > .ant-menu-item-selected {
                    background: ${isDarkMode ? 'rgba(102, 126, 234, 0.15)' : 'rgba(102, 126, 234, 0.1)'} !important;
                    font-weight: 600 !important;
                }

                .ant-menu-horizontal > .ant-menu-item .anticon {
                    font-size: 16px !important;
                    transition: all 0.3s !important;
                }

                .ant-menu-horizontal > .ant-menu-item:hover .anticon {
                    transform: scale(1.15);
                    filter: drop-shadow(0 0 6px rgba(102, 126, 234, 0.4));
                }

                .ant-menu-horizontal > .ant-menu-item-selected .anticon {
                    color: #667eea !important;
                }

                .ant-btn-text:hover {
                    background: ${isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(102, 126, 234, 0.08)'} !important;
                }

                .ant-btn-primary:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 6px 20px rgba(102, 126, 234, 0.45) !important;
                }
            `}</style>
        </ConfigProvider>
    );
};

export default FrontendLayout;
