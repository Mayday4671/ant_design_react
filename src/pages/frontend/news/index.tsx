import React, { useEffect, useState } from 'react';
import { Typography, Row, Col, Card, Tag, Input, Spin, Empty, List } from 'antd';
import { EyeOutlined, CalendarOutlined, UserOutlined, SearchOutlined } from '@ant-design/icons';
import { getNewsList, type News } from '../../../services/portal-mock';

const { Title, Paragraph } = Typography;

const NewsList: React.FC = () => {
    const [loading, setLoading] = useState(true);
    const [news, setNews] = useState<News[]>([]);
    const [category, setCategory] = useState<string>('');
    const [search, setSearch] = useState('');

    const categories = ['全部', '公告', '新闻', '活动', '更新'];

    useEffect(() => {
        const fetchNews = async () => {
            setLoading(true);
            try {
                const res = await getNewsList(1, 10, category === '全部' ? '' : category);
                setNews(res.data.list);
            } finally {
                setLoading(false);
            }
        };
        fetchNews();
    }, [category]);

    const filteredNews = search
        ? news.filter(n =>
            n.title.toLowerCase().includes(search.toLowerCase()) ||
            n.summary.toLowerCase().includes(search.toLowerCase())
        )
        : news;

    const getCategoryColor = (cat: string) => {
        const colors: Record<string, string> = {
            '公告': 'orange',
            '新闻': 'blue',
            '活动': 'purple',
            '更新': 'green',
        };
        return colors[cat] || 'default';
    };

    return (
        <div>
            {/* Header */}
            <div style={{ textAlign: 'center', marginBottom: 48 }}>
                <Title level={2}>新闻公告</Title>
                <Paragraph type="secondary" style={{ maxWidth: 600, margin: '0 auto' }}>
                    了解公司最新动态、产品更新和行业资讯
                </Paragraph>
            </div>

            {/* Filters */}
            <Card style={{ marginBottom: 24 }}>
                <Row gutter={[16, 16]} align="middle">
                    <Col xs={24} md={16}>
                        <span style={{ marginRight: 8 }}>分类：</span>
                        {categories.map((cat) => (
                            <Tag
                                key={cat}
                                color={(category === cat || (cat === '全部' && !category)) ? 'blue' : 'default'}
                                style={{ cursor: 'pointer', marginBottom: 8 }}
                                onClick={() => setCategory(cat === '全部' ? '' : cat)}
                            >
                                {cat}
                            </Tag>
                        ))}
                    </Col>
                    <Col xs={24} md={8}>
                        <Input
                            placeholder="搜索新闻..."
                            prefix={<SearchOutlined />}
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            allowClear
                        />
                    </Col>
                </Row>
            </Card>

            {/* News List */}
            {loading ? (
                <div style={{ textAlign: 'center', padding: 100 }}>
                    <Spin size="large" />
                </div>
            ) : filteredNews.length === 0 ? (
                <Empty description="暂无新闻" />
            ) : (
                <List
                    itemLayout="vertical"
                    size="large"
                    dataSource={filteredNews}
                    renderItem={(item) => (
                        <Card hoverable style={{ marginBottom: 16 }}>
                            <Row gutter={24}>
                                <Col xs={24} md={6}>
                                    <img
                                        alt={item.title}
                                        src={item.image}
                                        style={{
                                            width: '100%',
                                            height: 150,
                                            objectFit: 'cover',
                                            borderRadius: 8,
                                        }}
                                    />
                                </Col>
                                <Col xs={24} md={18}>
                                    <div>
                                        <Tag color={getCategoryColor(item.category)}>{item.category}</Tag>
                                        <Title level={4} style={{ marginTop: 8, marginBottom: 8 }}>
                                            {item.title}
                                        </Title>
                                        <Paragraph type="secondary" ellipsis={{ rows: 2 }}>
                                            {item.summary}
                                        </Paragraph>
                                        <div style={{ display: 'flex', gap: 24, color: '#999' }}>
                                            <span>
                                                <UserOutlined style={{ marginRight: 4 }} />
                                                {item.author}
                                            </span>
                                            <span>
                                                <CalendarOutlined style={{ marginRight: 4 }} />
                                                {item.publishTime}
                                            </span>
                                            <span>
                                                <EyeOutlined style={{ marginRight: 4 }} />
                                                {item.views} 阅读
                                            </span>
                                        </div>
                                    </div>
                                </Col>
                            </Row>
                        </Card>
                    )}
                />
            )}
        </div>
    );
};

export default NewsList;
