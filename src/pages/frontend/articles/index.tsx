import React, { useEffect, useState } from 'react';
import { Typography, Row, Col, Card, Tag, Avatar, Space, Spin, Input, Select, Pagination, Empty } from 'antd';
import { EyeOutlined, HeartOutlined, ClockCircleOutlined, SearchOutlined, FireOutlined } from '@ant-design/icons';
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

    const handleSearch = (value: string) => {
        setSearch(value);
        setPage(1);
        setSearchParams(prev => {
            if (value) prev.set('search', value);
            else prev.delete('search');
            return prev;
        });
    };

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
            {/* Header */}
            <div className="articles-header">
                <Title level={2}>全部文章</Title>
                <Paragraph type="secondary">
                    探索我们的精彩内容，发现有价值的见解
                </Paragraph>
            </div>

            {/* Filters */}
            <div className="articles-filters">
                <Space wrap>
                    <Input.Search
                        placeholder="搜索文章..."
                        allowClear
                        onSearch={handleSearch}
                        defaultValue={search}
                        style={{ width: 240 }}
                        prefix={<SearchOutlined />}
                    />
                    <Select
                        placeholder="选择分类"
                        allowClear
                        value={category || undefined}
                        onChange={handleCategoryChange}
                        style={{ width: 150 }}
                        options={[
                            { value: '', label: '全部分类' },
                            ...categories.map(c => ({ value: c.name, label: c.name }))
                        ]}
                    />
                </Space>
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
