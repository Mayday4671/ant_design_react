import React, { useEffect, useState } from 'react';
import { Typography, Row, Col, Card, Button, Space, Tag, Input, Spin, Tabs, Avatar } from 'antd';
import {
    SearchOutlined, SendOutlined,
    EyeOutlined, HeartOutlined, ClockCircleOutlined, RightOutlined,
    BookOutlined, CodeOutlined, BulbOutlined, TeamOutlined,
    BarChartOutlined, LineChartOutlined, PieChartOutlined, DotChartOutlined,
    StarFilled, FireOutlined, ThunderboltOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import {
    getFeaturedArticles, getLatestArticles, getCategories,
    type Article, type Category
} from '../../../services/article-mock';
import '../../../assets/styles/pages/frontend/home.css';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

// ========== 分类图标映射 ==========
const categoryIcons: Record<string, React.ReactNode> = {
    '技术分享': <CodeOutlined />,
    '产品设计': <BulbOutlined />,
    '行业动态': <BarChartOutlined />,
    '团队故事': <TeamOutlined />,
};

// ========== 分类颜色映射 ==========
const categoryColors: Record<string, string> = {
    '技术分享': '#1890ff',
    '产品设计': '#722ed1',
    '行业动态': '#13c2c2',
    '团队故事': '#52c41a',
};

// ========== 子组件 ==========

// Hero Section - AntV 风格
const HeroSection: React.FC<{ onNavigate: (path: string) => void }> = ({ onNavigate }) => {
    const [prompt, setPrompt] = useState('');

    return (
        <section className="hero-section">
            <div className="hero-background">
                <div className="hero-gradient" />
                <div className="hero-pattern" />
                <div className="hero-decoration hero-decoration-left" />
                <div className="hero-decoration hero-decoration-right" />
            </div>
            <div className="hero-content">
                <Space direction="vertical" size={24} align="center" style={{ width: '100%' }}>
                    {/* Main Title */}
                    <Title level={1} className="hero-title">
                        让知识触手可及
                    </Title>
                    <Paragraph className="hero-subtitle">
                        专业的技术博客与知识分享平台，汇聚前沿技术、产品设计与行业洞察
                    </Paragraph>

                    {/* Interactive Search Box - AntV Style */}
                    <div className="hero-search-box">
                        <div className="search-box-tabs">
                            <Tabs
                                defaultActiveKey="search"
                                centered
                                items={[
                                    { key: 'search', label: <><SearchOutlined /> 搜索文章</>, },
                                    { key: 'explore', label: <><BulbOutlined /> 探索话题</>, },
                                ]}
                            />
                        </div>
                        <div className="search-box-input">
                            <TextArea
                                placeholder="今天，你想了解什么？"
                                autoSize={{ minRows: 2, maxRows: 4 }}
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                                className="search-textarea"
                            />
                            <div className="search-box-actions">
                                <Space>
                                    <Tag color="blue">React</Tag>
                                    <Tag color="purple">TypeScript</Tag>
                                    <Tag color="green">AI</Tag>
                                </Space>
                                <Button
                                    type="primary"
                                    icon={<SendOutlined />}
                                    onClick={() => onNavigate(`/articles?search=${prompt}`)}
                                >
                                    搜索
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="hero-stats">
                        <Space size={48}>
                            <div className="stat-item">
                                <Text className="stat-number">1000+</Text>
                                <Text className="stat-label">优质文章</Text>
                            </div>
                            <div className="stat-item">
                                <Text className="stat-number">50K+</Text>
                                <Text className="stat-label">月阅读量</Text>
                            </div>
                            <div className="stat-item">
                                <Text className="stat-number">100+</Text>
                                <Text className="stat-label">知名作者</Text>
                            </div>
                        </Space>
                    </div>
                </Space>
            </div>
        </section>
    );
};

// 精选案例卡片 - AntV 风格
const FeaturedCard: React.FC<{ article: Article; onClick: () => void; bgColor: string }> = ({ article, onClick, bgColor }) => (
    <Card
        hoverable
        className="featured-case-card"
        onClick={onClick}
        style={{ backgroundColor: bgColor }}
    >
        <div className="featured-case-tag">
            <Tag icon={categoryIcons[article.category] || <BookOutlined />} color={categoryColors[article.category]}>
                {article.category}
            </Tag>
        </div>
        <Title level={5} className="featured-case-title" ellipsis={{ rows: 2 }}>
            {article.title}
        </Title>
        <div className="featured-case-image">
            <img src={article.coverImage} alt={article.title} />
        </div>
        <div className="featured-case-meta">
            <Space size={16}>
                <Text type="secondary"><EyeOutlined /> {article.views}</Text>
                <Text type="secondary"><HeartOutlined /> {article.likes}</Text>
            </Space>
        </div>
    </Card>
);

// 文章列表卡片
const ArticleCard: React.FC<{ article: Article; onClick: () => void }> = ({ article, onClick }) => (
    <Card hoverable className="article-list-card" onClick={onClick}>
        <div className="article-list-content">
            <div className="article-list-info">
                <Space className="article-list-meta" size={8}>
                    <Tag color={categoryColors[article.category]}>{article.category}</Tag>
                    <Text type="secondary"><ClockCircleOutlined /> {article.readTime} 分钟</Text>
                </Space>
                <Title level={5} className="article-list-title" ellipsis={{ rows: 2 }}>
                    {article.title}
                </Title>
                <Paragraph className="article-list-summary" ellipsis={{ rows: 2 }}>
                    {article.summary}
                </Paragraph>
                <div className="article-list-footer">
                    <Space>
                        <Avatar src={article.author.avatar} size={24} />
                        <Text type="secondary">{article.author.name}</Text>
                    </Space>
                    <Space size={16}>
                        <Text type="secondary"><EyeOutlined /> {article.views}</Text>
                        <Text type="secondary"><HeartOutlined /> {article.likes}</Text>
                    </Space>
                </div>
            </div>
            <div className="article-list-cover">
                <img src={article.coverImage} alt={article.title} />
            </div>
        </div>
    </Card>
);

// 分类导航卡片
const CategoryCard: React.FC<{ category: Category; onClick: () => void }> = ({ category, onClick }) => (
    <Card hoverable className="category-card" onClick={onClick}>
        <div className="category-icon" style={{ color: categoryColors[category.name] }}>
            {categoryIcons[category.name] || <BookOutlined />}
        </div>
        <Title level={5} className="category-title">{category.name}</Title>
        <Text type="secondary" className="category-desc">{category.description}</Text>
        <div className="category-count">
            <Tag>{category.count} 篇文章</Tag>
        </div>
    </Card>
);

// 产品展示卡片 - 模拟 AntV 产品展示
const ShowcaseItem: React.FC<{ icon: React.ReactNode; title: string; desc: string; color: string }> = ({ icon, title, desc, color }) => (
    <div className="showcase-item">
        <div className="showcase-icon" style={{ backgroundColor: `${color}15`, color }}>
            {icon}
        </div>
        <div className="showcase-info">
            <Text strong>{title}</Text>
            <Text type="secondary">{desc}</Text>
        </div>
    </div>
);

// ========== 主组件 ==========

const Home: React.FC = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [featuredArticles, setFeaturedArticles] = useState<Article[]>([]);
    const [latestArticles, setLatestArticles] = useState<Article[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);

    // 精选卡片背景色
    const cardBgColors = ['#e6f7ff', '#f9f0ff', '#e6fffb', '#fff7e6'];

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [featured, latest, cats] = await Promise.all([
                    getFeaturedArticles(4),
                    getLatestArticles(6),
                    getCategories(),
                ]);
                setFeaturedArticles(featured.data);
                setLatestArticles(latest.data);
                setCategories(cats.data);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleArticleClick = (id: string) => {
        navigate(`/article/${id}`);
    };

    if (loading) {
        return (
            <div className="loading-container">
                <Spin size="large" />
            </div>
        );
    }

    return (
        <div className="home-container">
            {/* Hero Section */}
            <HeroSection onNavigate={navigate} />

            {/* 精选案例 Section - AntV Style */}
            <section className="featured-section">
                <div className="section-content">
                    <div className="section-header">
                        <div className="section-header-left">
                            <Tag icon={<FireOutlined />} color="red">精选</Tag>
                            <Title level={3} className="section-title">精选案例</Title>
                        </div>
                        <Button type="link" onClick={() => navigate('/articles')}>
                            查看更多 <RightOutlined />
                        </Button>
                    </div>
                    <Row gutter={[24, 24]}>
                        {featuredArticles.map((article, index) => (
                            <Col xs={24} sm={12} lg={6} key={article.id}>
                                <FeaturedCard
                                    article={article}
                                    bgColor={cardBgColors[index % cardBgColors.length]}
                                    onClick={() => handleArticleClick(article.id)}
                                />
                            </Col>
                        ))}
                    </Row>
                </div>
            </section>

            {/* 分类导航 Section */}
            <section className="categories-section">
                <div className="section-content">
                    <div className="section-header">
                        <div className="section-header-left">
                            <Title level={3} className="section-title">丰富内容，选用自如</Title>
                        </div>
                    </div>
                    <Paragraph className="section-subtitle" style={{ textAlign: 'center', marginBottom: 32 }}>
                        覆盖技术、设计、产品等多个领域，满足你的求知欲
                    </Paragraph>
                    <Row gutter={[24, 24]} justify="center">
                        {categories.map((category) => (
                            <Col xs={12} sm={6} key={category.id}>
                                <CategoryCard
                                    category={category}
                                    onClick={() => navigate(`/articles?category=${category.name}`)}
                                />
                            </Col>
                        ))}
                    </Row>
                </div>
            </section>

            {/* 最新文章 Section */}
            <section className="latest-section">
                <div className="section-content">
                    <div className="section-header">
                        <div className="section-header-left">
                            <Tag icon={<ThunderboltOutlined />} color="blue">最新</Tag>
                            <Title level={3} className="section-title">最新发布</Title>
                        </div>
                        <Button type="link" onClick={() => navigate('/articles')}>
                            查看全部 <RightOutlined />
                        </Button>
                    </div>
                    <Row gutter={[24, 24]}>
                        {latestArticles.map((article) => (
                            <Col xs={24} lg={12} key={article.id}>
                                <ArticleCard
                                    article={article}
                                    onClick={() => handleArticleClick(article.id)}
                                />
                            </Col>
                        ))}
                    </Row>
                </div>
            </section>

            {/* 产品展示 Section - 模拟 AntV */}
            <section className="showcase-section">
                <div className="section-content">
                    <div className="section-header" style={{ justifyContent: 'center' }}>
                        <Title level={3} className="section-title">我们提供</Title>
                    </div>
                    <Row gutter={[48, 32]} justify="center">
                        <Col xs={24} sm={12} md={6}>
                            <ShowcaseItem
                                icon={<LineChartOutlined />}
                                title="深度技术"
                                desc="前沿技术解析"
                                color="#1890ff"
                            />
                        </Col>
                        <Col xs={24} sm={12} md={6}>
                            <ShowcaseItem
                                icon={<PieChartOutlined />}
                                title="产品洞察"
                                desc="产品设计方法论"
                                color="#722ed1"
                            />
                        </Col>
                        <Col xs={24} sm={12} md={6}>
                            <ShowcaseItem
                                icon={<BarChartOutlined />}
                                title="行业分析"
                                desc="市场趋势解读"
                                color="#13c2c2"
                            />
                        </Col>
                        <Col xs={24} sm={12} md={6}>
                            <ShowcaseItem
                                icon={<DotChartOutlined />}
                                title="实战案例"
                                desc="真实项目经验"
                                color="#52c41a"
                            />
                        </Col>
                    </Row>
                </div>
            </section>

            {/* CTA Section */}
            <section className="cta-section">
                <div className="section-content">
                    <Space direction="vertical" size={24} align="center">
                        <Title level={2} className="cta-title">
                            开始你的学习之旅
                        </Title>
                        <Paragraph className="cta-subtitle">
                            加入我们，获取最新的技术文章和行业资讯
                        </Paragraph>
                        <Space size="large">
                            <Button type="primary" size="large" icon={<StarFilled />}>
                                立即订阅
                            </Button>
                            <Button size="large" onClick={() => navigate('/about')}>
                                了解更多
                            </Button>
                        </Space>
                    </Space>
                </div>
            </section>
        </div>
    );
};

export default Home;
