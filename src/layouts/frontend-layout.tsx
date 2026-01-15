import React from 'react';
import { Layout, Menu, Typography, Button, Space, Row, Col, Divider, ConfigProvider, theme } from 'antd';
import {
    HomeOutlined, AppstoreOutlined, FileTextOutlined, TeamOutlined,
    GithubOutlined, GlobalOutlined
} from '@ant-design/icons';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAppTheme } from '../contexts/theme-context';

const { Header, Content, Footer } = Layout;
const { Title, Text, Link } = Typography;

const FrontendLayout: React.FC = () => {
    const { isDarkMode, getAntdTheme } = useAppTheme();
    const {
        token: { colorPrimary },
    } = theme.useToken();
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

    return (
        <ConfigProvider theme={frontendTheme}>
            <Layout
                style={{
                    minHeight: '100vh',
                    background: isDarkMode
                        ? 'linear-gradient(180deg, #141414 0%, #1f1f1f 100%)'
                        : 'linear-gradient(180deg, #f5f7fa 0%, #ffffff 100%)',
                }}
            >
                {/* ========== Header ========== */}
                <Header
                    style={{
                        position: 'sticky',
                        top: 0,
                        zIndex: 100,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '0 48px',
                        background: isDarkMode
                            ? 'rgba(20, 20, 20, 0.95)'
                            : 'rgba(255, 255, 255, 0.95)',
                        backdropFilter: 'blur(8px)',
                        borderBottom: `1px solid ${isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.06)'}`,
                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
                    }}
                >
                    {/* Logo */}
                    <div
                        style={{ display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' }}
                        onClick={() => navigate('/')}
                    >
                        <div
                            style={{
                                width: 36,
                                height: 36,
                                borderRadius: 8,
                                background: `linear-gradient(135deg, ${colorPrimary} 0%, #722ed1 100%)`,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: '#fff',
                                fontSize: 18,
                                fontWeight: 'bold',
                            }}
                        >
                            A
                        </div>
                        <Title
                            level={4}
                            style={{
                                margin: 0,
                                background: `linear-gradient(135deg, ${colorPrimary} 0%, #722ed1 100%)`,
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                fontWeight: 700,
                            }}
                        >
                            Awesome Products
                        </Title>
                    </div>

                    {/* Navigation Menu */}
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

                    {/* Right Actions */}
                    <Space size="middle">
                        <Button type="text" icon={<GithubOutlined />} style={{ fontSize: 18 }} />
                        <Button type="text" icon={<GlobalOutlined />}>中文</Button>
                        <Button type="primary" onClick={() => navigate('/admin')}>
                            控制台
                        </Button>
                    </Space>
                </Header>

                {/* ========== Content ========== */}
                <Content style={{ flex: 1 }}>
                    <Outlet />
                </Content>

                {/* ========== Footer ========== */}
                <Footer
                    style={{
                        background: isDarkMode ? '#141414' : '#001529',
                        padding: '64px 48px 32px',
                    }}
                >
                    <div style={{ maxWidth: 1600, margin: '0 auto' }}>
                        {/* Footer Links */}
                        <Row gutter={[48, 48]}>
                            {Object.values(footerLinks).map((section) => (
                                <Col xs={12} sm={12} md={6} key={section.title}>
                                    <Title level={5} style={{ color: 'rgba(255,255,255,0.85)', marginBottom: 24 }}>
                                        {section.title}
                                    </Title>
                                    <Space direction="vertical" size={12}>
                                        {section.links.map((link) => (
                                            <Link
                                                key={link.label}
                                                onClick={() => link.href.startsWith('http') ? window.open(link.href) : navigate(link.href)}
                                                style={{ color: 'rgba(255,255,255,0.65)', cursor: 'pointer' }}
                                            >
                                                {link.label}
                                            </Link>
                                        ))}
                                    </Space>
                                </Col>
                            ))}
                        </Row>

                        <Divider style={{ borderColor: 'rgba(255,255,255,0.1)', margin: '48px 0 24px' }} />

                        {/* Copyright */}
                        <Row justify="space-between" align="middle">
                            <Col>
                                <Text style={{ color: 'rgba(255,255,255,0.45)' }}>
                                    © {new Date().getFullYear()} Awesome Products. Made with ❤️ using Ant Design.
                                </Text>
                            </Col>
                            <Col>
                                <Space split={<Divider type="vertical" style={{ borderColor: 'rgba(255,255,255,0.2)' }} />}>
                                    <Link style={{ color: 'rgba(255,255,255,0.45)' }}>服务条款</Link>
                                    <Link style={{ color: 'rgba(255,255,255,0.45)' }}>隐私政策</Link>
                                    <Link style={{ color: 'rgba(255,255,255,0.45)' }}>Sitemap</Link>
                                </Space>
                            </Col>
                        </Row>
                    </div>
                </Footer>
            </Layout>
        </ConfigProvider>
    );
};

export default FrontendLayout;
