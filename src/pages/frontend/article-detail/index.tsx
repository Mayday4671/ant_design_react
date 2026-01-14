import React, { useEffect, useState } from 'react';
import { Typography, Tag, Avatar, Space, Spin, Card, Divider, Button, Row, Col } from 'antd';
import {
    EyeOutlined, HeartOutlined, MessageOutlined, ClockCircleOutlined,
    CalendarOutlined, ArrowLeftOutlined, ShareAltOutlined
} from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import { getArticleById, getLatestArticles, type Article } from '../../../services/article-mock';
import '../../../assets/styles/pages/frontend/article-detail.css';

const { Title, Text, Paragraph } = Typography;

const ArticleDetail: React.FC = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const [loading, setLoading] = useState(true);
    const [article, setArticle] = useState<Article | null>(null);
    const [relatedArticles, setRelatedArticles] = useState<Article[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            if (!id) return;
            setLoading(true);
            try {
                const [articleRes, relatedRes] = await Promise.all([
                    getArticleById(id),
                    getLatestArticles(4),
                ]);
                setArticle(articleRes.data);
                setRelatedArticles(relatedRes.data.filter(a => a.id !== id).slice(0, 3));
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

    if (loading) {
        return (
            <div className="loading-container">
                <Spin size="large" />
            </div>
        );
    }

    if (!article) {
        return (
            <div className="not-found">
                <Title level={4}>文章未找到</Title>
                <Button type="primary" onClick={() => navigate('/articles')}>
                    返回文章列表
                </Button>
            </div>
        );
    }

    return (
        <div className="article-detail-container">
            {/* Back Button */}
            <Button
                type="text"
                icon={<ArrowLeftOutlined />}
                onClick={() => navigate(-1)}
                className="back-button"
            >
                返回
            </Button>

            <Row gutter={[32, 32]}>
                {/* Main Content */}
                <Col xs={24} lg={18}>
                    <article className="article-main">
                        {/* Header */}
                        <header className="article-header">
                            <Tag color="blue" className="article-category-tag">{article.category}</Tag>
                            <Title level={1} className="article-main-title">{article.title}</Title>

                            <div className="article-meta">
                                <Space className="author-info">
                                    <Avatar src={article.author.avatar} size={40} />
                                    <div>
                                        <Text strong>{article.author.name}</Text>
                                        <br />
                                        <Text type="secondary" className="publish-date">
                                            <CalendarOutlined /> {article.publishTime}
                                        </Text>
                                    </div>
                                </Space>
                                <Space split={<Divider type="vertical" />} className="article-stats-row">
                                    <Text type="secondary">
                                        <ClockCircleOutlined /> {article.readTime} 分钟阅读
                                    </Text>
                                    <Text type="secondary">
                                        <EyeOutlined /> {article.views}
                                    </Text>
                                    <Text type="secondary">
                                        <HeartOutlined /> {article.likes}
                                    </Text>
                                    <Text type="secondary">
                                        <MessageOutlined /> {article.comments}
                                    </Text>
                                </Space>
                            </div>
                        </header>

                        {/* Cover Image */}
                        <div className="article-cover-image">
                            <img src={article.coverImage} alt={article.title} />
                        </div>

                        {/* Summary */}
                        <div className="article-summary-box">
                            <Paragraph className="article-summary-text">
                                {article.summary}
                            </Paragraph>
                        </div>

                        {/* Content */}
                        <div className="article-body">
                            <div
                                className="article-content-html"
                                dangerouslySetInnerHTML={{
                                    __html: article.content.replace(/\n/g, '<br>').replace(/# (.*)/g, '<h2>$1</h2>').replace(/## (.*)/g, '<h3>$1</h3>')
                                }}
                            />
                        </div>

                        {/* Tags */}
                        <div className="article-tags">
                            {article.tags.map((tag) => (
                                <Tag key={tag} className="article-tag">{tag}</Tag>
                            ))}
                        </div>

                        {/* Actions */}
                        <div className="article-actions">
                            <Space size="middle">
                                <Button icon={<HeartOutlined />} size="large">
                                    点赞 ({article.likes})
                                </Button>
                                <Button icon={<ShareAltOutlined />} size="large">
                                    分享
                                </Button>
                            </Space>
                        </div>
                    </article>
                </Col>

                {/* Sidebar */}
                <Col xs={24} lg={6}>
                    {/* Author Card */}
                    <Card className="author-card">
                        <div className="author-card-content">
                            <Avatar src={article.author.avatar} size={64} />
                            <Title level={5}>{article.author.name}</Title>
                            <Text type="secondary">技术博主</Text>
                            <Button type="primary" block style={{ marginTop: 16 }}>
                                关注作者
                            </Button>
                        </div>
                    </Card>

                    {/* Related Articles */}
                    <Card title="相关推荐" className="related-card">
                        {relatedArticles.map((item) => (
                            <div
                                key={item.id}
                                className="related-item"
                                onClick={() => navigate(`/article/${item.id}`)}
                            >
                                <img src={item.coverImage} alt={item.title} className="related-image" />
                                <div className="related-content">
                                    <Text className="related-title" ellipsis>{item.title}</Text>
                                    <Text type="secondary" className="related-views">
                                        <EyeOutlined /> {item.views}
                                    </Text>
                                </div>
                            </div>
                        ))}
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default ArticleDetail;
