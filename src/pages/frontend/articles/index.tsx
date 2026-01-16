import React, { useEffect, useState } from 'react';
import { Typography, Row, Col, Card, Tag, Avatar, Space, Spin, Pagination, Empty } from 'antd';
import { EyeOutlined, HeartOutlined, ClockCircleOutlined, FireOutlined } from '@ant-design/icons';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { getArticles, getCategories, type Article, type Category } from '../../../services/article-mock';
import '../../../assets/styles/pages/frontend/articles.css';

const { Title, Text, Paragraph } = Typography;

const Articles: React.FC = () => {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const [loading, setLoading] = useState(true);
    const [articles, setArticles] = useState<Article[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState(searchParams.get('search') || '');
    const [category, setCategory] = useState(searchParams.get('category') || '');
    const pageSize = 9;

    useEffect(() => {
        getCategories().then(res => setCategories(res.data));
    }, []);

    // 监听 URL 参数变化，同步到状态
    useEffect(() => {
        const urlSearch = searchParams.get('search') || '';
        const urlCategory = searchParams.get('category') || '';

        if (urlSearch !== search) {
            setSearch(urlSearch);
        }
        if (urlCategory !== category) {
            setCategory(urlCategory);
        }
    }, [searchParams]);

    useEffect(() => {
        const fetchArticles = async () => {
            setLoading(true);
            try {
                const res = await getArticles(page, pageSize, {
                    category: category || undefined,
                    search: search || undefined,
                    status: 'published',
                });
                setArticles(res.data.list);
                setTotal(res.data.total);
            } finally {
                setLoading(false);
            }
        };
        fetchArticles();
    }, [page, category, search]);

    const handleCategoryChange = (value: string) => {
        setCategory(value);
        setPage(1);
        setSearchParams(prev => {
            if (value) prev.set('category', value);
            else prev.delete('category');
            return prev;
        });
    };

    return (
        <div className="articles-container">
            {/* Category Tags */}
            <div className="article-category-filter">
                <Tag
                    className={`article-category-tag ${!category ? 'active' : ''}`}
                    onClick={() => handleCategoryChange('')}
                >
                    全部
                </Tag>
                {categories.map(cat => (
                    <Tag
                        key={cat.id}
                        className={`article-category-tag ${category === cat.name ? 'active' : ''}`}
                        onClick={() => handleCategoryChange(cat.name)}
                    >
                        {cat.name}
                    </Tag>
                ))}
            </div>

            {/* Articles Grid */}
            {loading ? (
                <div className="loading-container">
                    <Spin size="large" />
                </div>
            ) : articles.length === 0 ? (
                <Empty description="暂无文章" />
            ) : (
                <>
                    <Row gutter={[24, 24]}>
                        {articles.map((article) => (
                            <Col xs={24} sm={12} lg={8} key={article.id}>
                                <Card
                                    hoverable
                                    className="article-list-card"
                                    onClick={() => navigate(`/article/${article.id}`)}
                                >
                                    <div className="article-list-cover">
                                        <img src={article.coverImage} alt={article.title} />
                                        {article.featured && (
                                            <Tag color="#f50" className="featured-badge">
                                                <FireOutlined /> 精选
                                            </Tag>
                                        )}
                                    </div>
                                    <div className="article-list-content">
                                        <Tag color="blue">{article.category}</Tag>
                                        <Title level={5} ellipsis={{ rows: 2 }} className="article-list-title">
                                            {article.title}
                                        </Title>
                                        <Paragraph ellipsis={{ rows: 2 }} className="article-list-summary">
                                            {article.summary}
                                        </Paragraph>
                                        <div className="article-list-footer">
                                            <Space>
                                                <Avatar src={article.author.avatar} size={20} />
                                                <Text type="secondary" className="author-name">{article.author.name}</Text>
                                            </Space>
                                            <Space split={<span className="stat-divider">·</span>}>
                                                <Text type="secondary" className="stat-item">
                                                    <ClockCircleOutlined /> {article.readTime}分钟
                                                </Text>
                                                <Text type="secondary" className="stat-item">
                                                    <EyeOutlined /> {article.views}
                                                </Text>
                                                <Text type="secondary" className="stat-item">
                                                    <HeartOutlined /> {article.likes}
                                                </Text>
                                            </Space>
                                        </div>
                                    </div>
                                </Card>
                            </Col>
                        ))}
                    </Row>

                    {/* Pagination */}
                    <div className="articles-pagination">
                        <Pagination
                            current={page}
                            pageSize={pageSize}
                            total={total}
                            onChange={setPage}
                            showTotal={(total) => `共 ${total} 篇文章`}
                        />
                    </div>
                </>
            )}
        </div>
    );
};

export default Articles;
