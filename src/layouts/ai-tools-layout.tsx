import React, { useState, useMemo } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Layout, Menu, Input, Typography, ConfigProvider } from 'antd';
import {
    HomeOutlined, MessageOutlined, PictureOutlined, EditOutlined,
    VideoCameraOutlined, AudioOutlined, CodeOutlined, FileTextOutlined,
    HighlightOutlined, SearchOutlined, RocketOutlined,
    SettingOutlined, GithubOutlined, BulbOutlined, ThunderboltOutlined,
    StarOutlined, FireOutlined, TeamOutlined, RobotOutlined, CloudOutlined,
    ExperimentOutlined, SafetyCertificateOutlined, FormOutlined, BookOutlined,
    DashboardOutlined
} from '@ant-design/icons';
import { useAppTheme } from '../contexts/theme-context';

import '../assets/styles/layouts/ai-tools-layout.css';

const { Sider, Content } = Layout;
const { Title, Text } = Typography;

// ========== 侧边栏分类配置 ==========
const sidebarCategories = [
    { key: 'all', icon: <HomeOutlined />, label: '全部工具' },
    { key: 'hot', icon: <FireOutlined />, label: '热门推荐' },
    { key: 'new', icon: <ThunderboltOutlined />, label: '最新上线' },
    { key: 'chat', icon: <MessageOutlined />, label: 'AI 聊天' },
    { key: 'docs', icon: <FileTextOutlined />, label: '项目文档' },
    { type: 'divider' as const },
    { key: 'writing', icon: <EditOutlined />, label: 'AI 写作' },
    { key: 'image', icon: <PictureOutlined />, label: 'AI 图像' },
    { key: 'video', icon: <VideoCameraOutlined />, label: 'AI 视频' },
    { key: 'office', icon: <FileTextOutlined />, label: 'AI 办公' },
    { key: 'agent', icon: <RobotOutlined />, label: 'AI 智能体' },
    { key: 'coding', icon: <CodeOutlined />, label: 'AI 编程' },
    { key: 'design', icon: <HighlightOutlined />, label: 'AI 设计' },
    { key: 'audio', icon: <AudioOutlined />, label: 'AI 音频' },
    { key: 'search', icon: <SearchOutlined />, label: 'AI 搜索' },
    { key: 'platform', icon: <CloudOutlined />, label: 'AI 开发平台' },
    { key: 'learning', icon: <BookOutlined />, label: 'AI 学习网站' },
    { key: 'model', icon: <ExperimentOutlined />, label: 'AI 训练模型' },
    { key: 'benchmark', icon: <DashboardOutlined />, label: 'AI 模型评测' },
    { key: 'detect', icon: <SafetyCertificateOutlined />, label: 'AI 内容检测' },
    { key: 'prompt', icon: <FormOutlined />, label: 'AI 提示指令' },
];

// ========== 顶部导航链接 ==========
const topNavLinks = [
    { key: '/', label: 'AI工具导航' },
    { key: '/articles', label: '每日AI资讯' },
    { key: '/docs', label: '项目文档' },
    { key: '/about', label: '关于我们' },
];

// ========== 热门搜索标签 ==========
const hotSearchTags = ['ChatGPT', 'Midjourney', 'Claude', 'Stable Diffusion', 'Cursor', 'Suno'];

const AIToolsLayout: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { isDarkMode, setIsDarkMode, getAntdTheme, frontendBackgroundImage, contentOpacity } = useAppTheme();
    const [searchValue, setSearchValue] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');

    // 使用主题上下文的主题配置（支持背景图和透明度）
    const themeConfig = getAntdTheme(frontendBackgroundImage);

    // 默认背景
    const defaultBg = isDarkMode ? '#141414' : '#f0f2f5';
    // 布局背景样式
    const layoutBgStyle = frontendBackgroundImage
        ? `url(${frontendBackgroundImage}) center/cover fixed`
        : defaultBg;

    // 动态 blur 效果（跟随透明度变化）
    const blurAmount = Math.round(contentOpacity * 20); // 0-20px
    // 玻璃拟态样式（应用 contentOpacity 和动态 blur）
    const glassStyle = {
        background: isDarkMode
            ? `rgba(30, 30, 45, ${contentOpacity})`
            : `rgba(255, 255, 255, ${contentOpacity})`,
        backdropFilter: frontendBackgroundImage && blurAmount > 0 ? `blur(${blurAmount}px) saturate(${100 + contentOpacity * 80}%)` : undefined,
        WebkitBackdropFilter: frontendBackgroundImage && blurAmount > 0 ? `blur(${blurAmount}px) saturate(${100 + contentOpacity * 80}%)` : undefined,
    };

    const handleSearch = () => {
        if (searchValue.trim()) {
            if (location.pathname.startsWith('/articles')) {
                // 如果在资讯页面，保留在资讯页面进行搜索
                navigate(`/articles?search=${encodeURIComponent(searchValue)}`);
            } else {
                // 否则跳转到 AI 工具首页
                navigate(`/?search=${encodeURIComponent(searchValue)}`);
            }
        }
    };

    const handleCategoryClick = (key: string) => {
        setSelectedCategory(key);
        if (key === 'chat') {
            // AI 聊天 - 跳转到 AI 聊天页面
            navigate('/ai-chat');
        } else if (key === 'docs') {
            // 项目文档 - 跳转到文档页面
            navigate('/docs');
        } else if (key === 'all' || key === 'hot' || key === 'new') {
            // 特殊分类，跳转到首页顶部
            navigate('/');
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
            // 普通分类，滚动到对应锚点
            navigate('/');
            setTimeout(() => {
                const element = document.getElementById(`category-${key}`);
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }, 100);
        }
    };

    const menuItems = useMemo(() =>
        sidebarCategories.map(item => {
            if (item.type === 'divider') {
                return { type: 'divider' as const };
            }
            return {
                key: item.key,
                icon: item.icon,
                label: item.label,
            };
        }),
        []);

    return (
        <ConfigProvider theme={themeConfig}>
            <Layout
                className={`ai-nav-layout ${isDarkMode ? 'dark-mode' : 'light-mode'} ${frontendBackgroundImage ? 'has-bg-image' : ''}`}
                style={{
                    background: layoutBgStyle,
                    // @ts-expect-error CSS 变量
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
                >
                    <div className="sider-inner">
                        {/* Logo */}
                        <div className="sider-logo" onClick={() => {
                            navigate('/');
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}>
                            <RocketOutlined className="logo-icon" />
                            <Title level={4} className="logo-text">AI 工具导航</Title>
                        </div>

                        {/* 分类菜单 */}
                        <div className="sider-menu-wrapper">
                            <Menu
                                mode="inline"
                                selectedKeys={[selectedCategory]}
                                items={menuItems}
                                className="sider-menu"
                                onClick={({ key }) => handleCategoryClick(key)}
                            />
                        </div>

                        {/* 底部操作 */}
                        <div className="sider-footer">
                            <div
                                className="sider-footer-item"
                                onClick={() => navigate('/admin')}
                            >
                                <SettingOutlined /> 管理后台
                            </div>
                            <div
                                className="sider-footer-item"
                                onClick={() => window.open('https://github.com')}
                            >
                                <GithubOutlined /> GitHub
                            </div>
                            <div
                                className="sider-footer-item"
                                onClick={() => setIsDarkMode(!isDarkMode)}
                            >
                                {isDarkMode ? <BulbOutlined /> : <StarOutlined />}
                                {isDarkMode ? ' 浅色模式' : ' 深色模式'}
                            </div>
                        </div>
                    </div>
                </Sider>

                {/* ========== 主内容区 ========== */}
                <Layout
                    className="ai-nav-main"
                    style={{
                        background: isDarkMode ? '#141414' : '#f0f2f5'
                    }}
                >
                    {/* 顶部导航 - 重新设计 */}
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
                                {topNavLinks.map((link, index) => (
                                    <div
                                        key={link.key}
                                        className={`top-nav-item ${location.pathname === link.key ? 'active' : ''}`}
                                        onClick={() => {
                                            navigate(link.key);
                                            if (link.key === '/') {
                                                window.scrollTo({ top: 0, behavior: 'smooth' });
                                            }
                                        }}
                                    >
                                        {index === 0 && <RocketOutlined className="nav-item-icon" />}
                                        {index === 1 && <FireOutlined className="nav-item-icon" />}
                                        {index === 2 && <TeamOutlined className="nav-item-icon" />}
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

                    {/* Hero 搜索区 - 仅在首页显示 */}
                    {location.pathname === '/' && (
                        <div className="hero-search-area">
                            <div className="hero-brand">
                                <RocketOutlined className="hero-icon" />
                                <Title level={2} className="hero-title">AI 工具导航</Title>
                            </div>
                            <Text className="hero-subtitle">
                                发现最新最热的 AI 工具，提升你的工作效率
                            </Text>
                            <Input
                                size="large"
                                placeholder="搜索 AI 工具、网站、应用..."
                                prefix={<SearchOutlined />}
                                className="hero-search-input"
                                value={searchValue}
                                onChange={e => setSearchValue(e.target.value)}
                                onPressEnter={handleSearch}
                                allowClear
                            />
                            <div className="hero-hot-tags">
                                <Text className="hot-label">热门搜索：</Text>
                                {hotSearchTags.map(tag => (
                                    <span
                                        key={tag}
                                        className="hot-tag"
                                        onClick={() => {
                                            setSearchValue(tag);
                                            navigate(`/?search=${encodeURIComponent(tag)}`);
                                        }}
                                    >
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* 内容区 */}
                    <Content className="main-content" style={{ overflow: 'hidden', height: '100%', display: 'flex', flexDirection: 'column', padding: 14 }}>
                        <Outlet context={{ searchValue, selectedCategory }} />
                    </Content>
                </Layout>
            </Layout>
        </ConfigProvider>
    );
};

export default AIToolsLayout;
