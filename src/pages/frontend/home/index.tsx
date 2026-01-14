import React, { useEffect, useState } from 'react';
import { Typography, Row, Col, Card, Tag, Avatar, Space, Spin, Divider, Button } from 'antd';
import {
    EyeOutlined, HeartOutlined, ClockCircleOutlined,
    FireOutlined, RightOutlined, CalendarOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import {
    getFeaturedArticles, getLatestArticles, getPopularArticles, getCategories,
    type Article, type Category
} from '../../../services/article-mock';
import '../../../assets/styles/pages/frontend/home.css';

const { Title, Text, Paragraph } = Typography;

// ============ 子组件 ============

// 精选文章大卡片
const FeaturedCard: React.FC<{ article: Article; onClick: () => void }> = ({ article, onClick }) => (
    <Card
        hoverable
        className="featured-card"
        cover={
            <div className="featured-cover" style={{ backgroundImage: `url(${article.coverImage})` }}>
                <div className="featured-overlay">
                    <Tag color="#f50" className="featured-tag">
                        <FireOutlined /> 精选
                    </Tag>
                    <div className="featured-content">
                        <Tag color="blue">{article.category}</Tag>
                        <Title level={3} className="featured-title">{article.title}</Title>
                        <Paragraph className="featured-summary">{article.summary}</Paragraph>
                        <Space className="featured-meta">
                            <Avatar src={article.author.avatar} size={32} />
                            <Text className="featured-author">{article.author.name}</Text>
                            <Divider type="vertical" className="featured-divider" />
                            <Text className="featured-date">
                                <CalendarOutlined /> {article.publishTime.split(' ')[0]}
                            </Text>
                            <Divider type="vertical" className="featured-divider" />
                            <Text className="featured-date">
                                <ClockCircleOutlined /> {article.readTime} 分钟阅读
                            </Text>
                        </Space>
                    </div>
                </div>
            </div>
        }
        onClick={onClick}
        styles={{ body: { display: 'none' } }}
    />
);

// 文章卡片
const ArticleCard: React.FC<{ article: Article; onClick: () => void }> = ({ article, onClick }) => (
    <Card hoverable className="article-card" onClick={onClick}>
        <div className="article-cover">
            <img src={article.coverImage} alt={article.title} />
            {article.featured && (
                <Tag color="#f50" className="article-featured-tag">
                    <FireOutlined />
                </Tag>
            )}
        </div>
        <div className="article-content">
            <Tag color="blue" className="article-category">{article.category}</Tag>
            <Title level={5} className="article-title" ellipsis={{ rows: 2 }}>
                {article.title}
            </Title>
            <Paragraph className="article-summary" ellipsis={{ rows: 2 }}>
                {article.summary}
            </Paragraph>
            <div className="article-footer">
                <Space className="article-author">
                    <Avatar src={article.author.avatar} size={24} />
                    <Text type="secondary">{article.author.name}</Text>
                </Space>
                <Space className="article-stats">
                    <Text type="secondary"><EyeOutlined /> {article.views}</Text>
                    <Text type="secondary"><HeartOutlined /> {article.likes}</Text>
                </Space>
            </div>
        </div>
    </Card>
);

// 热门文章列表项
const PopularItem: React.FC<{ article: Article; index: number; onClick: () => void }> = ({ article, index, onClick }) => (
    <div className="popular-item" onClick={onClick}>
        <div className={`popular-rank rank-${index + 1}`}>{index + 1}</div>
        <div className="popular-content">
            <Text className="popular-title" ellipsis>{article.title}</Text>
            <Space className="popular-stats">
                <Text type="secondary" className="popular-stat">
                    <EyeOutlined /> {article.views}
                </Text>
            </Space>
        </div>
    </div>
);

// 分类标签
const CategoryTag: React.FC<{ category: Category; onClick: () => void }> = ({ category, onClick }) => (
    <Tag className="category-tag" onClick={onClick}>
        {category.name} <span className="category-count">{category.count}</span>
    </Tag>
);

// ============ 主组件 ============

const Home: React.FC = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [featuredArticles, setFeaturedArticles] = useState<Article[]>([]);
    const [latestArticles, setLatestArticles] = useState<Article[]>([]);
    const [popularArticles, setPopularArticles] = useState<Article[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [featured, latest, popular, cats] = await Promise.all([
                    getFeaturedArticles(3),
                    getLatestArticles(6),
                    getPopularArticles(5),
                    getCategories(),
                ]);
                setFeaturedArticles(featured.data);
                setLatestArticles(latest.data);
                setPopularArticles(popular.data);
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
            {/* Hero / Featured Articles */}
            <section className="featured-section">
                <Row gutter={[24, 24]}>
                    <Col xs={24} lg={16}>
                        {featuredArticles[0] && (
                            <FeaturedCard
                                article={featuredArticles[0]}
                                onClick={() => handleArticleClick(featuredArticles[0].id)}
                            />
                        )}
                    </Col>
                    <Col xs={24} lg={8}>
                        <Row gutter={[0, 24]}>
                            {featuredArticles.slice(1, 3).map((article) => (
                                <Col span={24} key={article.id}>
                                    <Card
                                        hoverable
                                        className="featured-small-card"
                                        onClick={() => handleArticleClick(article.id)}
                                    >
                                        <div
                                            className="featured-small-bg"
                                            style={{ backgroundImage: `url(${article.coverImage})` }}
                                        >
                                            <div className="featured-small-overlay">
                                                <Tag color="blue">{article.category}</Tag>
                                                <Title level={5} className="featured-small-title">
                                                    {article.title}
                                                </Title>
                                            </div>
                                        </div>
                                    </Card>
                                </Col>
                            ))}
                        </Row>
                    </Col>
                </Row>
            </section>

            {/* Main Content */}
            <section className="main-section">
                <Row gutter={[32, 32]}>
                    {/* Articles Grid */}
                    <Col xs={24} lg={16}>
                        <div className="section-header">
                            <Title level={4} className="section-title">
                                最新文章
                            </Title>
                            <Button type="link" onClick={() => navigate('/articles')}>
                                查看全部 <RightOutlined />
                            </Button>
                        </div>
                        <Row gutter={[24, 24]}>
                            {latestArticles.map((article) => (
                                <Col xs={24} sm={12} key={article.id}>
                                    <ArticleCard
                                        article={article}
                                        onClick={() => handleArticleClick(article.id)}
                                    />
                                </Col>
                            ))}
                        </Row>
                    </Col>

                    {/* Sidebar */}
                    <Col xs={24} lg={8}>
                        {/* Popular Articles */}
                        <Card className="sidebar-card" title={
                            <span><FireOutlined style={{ color: '#f50' }} /> 热门文章</span>
                        }>
                            {popularArticles.map((article, index) => (
                                <PopularItem
                                    key={article.id}
                                    article={article}
                                    index={index}
                                    onClick={() => handleArticleClick(article.id)}
                                />
                            ))}
                        </Card>

                        {/* Categories */}
                        <Card className="sidebar-card categories-card" title="文章分类">
                            <div className="categories-list">
                                {categories.map((category) => (
                                    <CategoryTag
                                        key={category.id}
                                        category={category}
                                        onClick={() => navigate(`/articles?category=${category.name}`)}
                                    />
                                ))}
                            </div>
                        </Card>

                        {/* Newsletter */}
                        <Card className="sidebar-card newsletter-card">
                            <div className="newsletter-content">
                                <Title level={5}>📬 订阅我们</Title>
                                <Paragraph type="secondary">
                                    获取最新文章推送，不错过任何精彩内容
                                </Paragraph>
                                <Button type="primary" block>
                                    立即订阅
                                </Button>
                            </div>
                        </Card>
                    </Col>
                </Row>
            </section>
        </div>
    );
};

export default Home;
