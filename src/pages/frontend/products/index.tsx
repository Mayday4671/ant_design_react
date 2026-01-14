import React, { useEffect, useState } from 'react';
import { Typography, Row, Col, Card, Tag, Rate, Input, Spin, Empty, Pagination, Button } from 'antd';
import { FireOutlined, StarOutlined, SearchOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import { getProducts, type Product } from '../../../services/portal-mock';

const { Title, Text, Paragraph } = Typography;

const Products: React.FC = () => {
    const [loading, setLoading] = useState(true);
    const [products, setProducts] = useState<Product[]>([]);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [pageSize] = useState(6);
    const [category, setCategory] = useState<string>('');
    const [search, setSearch] = useState('');

    const categories = ['全部', '云服务', '数据分析', '开发工具', '安全服务', '办公软件'];

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const res = await getProducts(page, pageSize, category === '全部' ? '' : category);
            setProducts(res.data.list);
            setTotal(res.data.total);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, [page, category]);

    const filteredProducts = search
        ? products.filter(p =>
            p.name.toLowerCase().includes(search.toLowerCase()) ||
            p.description.toLowerCase().includes(search.toLowerCase())
        )
        : products;

    return (
        <div>
            {/* Header */}
            <div style={{ textAlign: 'center', marginBottom: 48 }}>
                <Title level={2}>产品与服务</Title>
                <Paragraph type="secondary" style={{ maxWidth: 600, margin: '0 auto' }}>
                    我们提供全方位的企业级解决方案，助力您的数字化转型
                </Paragraph>
            </div>

            {/* Filters */}
            <Card style={{ marginBottom: 24 }}>
                <Row gutter={[16, 16]} align="middle">
                    <Col xs={24} md={16}>
                        <span style={{ marginRight: 8 }}>类别：</span>
                        {categories.map((cat) => (
                            <Tag
                                key={cat}
                                color={(category === cat || (cat === '全部' && !category)) ? 'blue' : 'default'}
                                style={{ cursor: 'pointer', marginBottom: 8 }}
                                onClick={() => {
                                    setCategory(cat === '全部' ? '' : cat);
                                    setPage(1);
                                }}
                            >
                                {cat}
                            </Tag>
                        ))}
                    </Col>
                    <Col xs={24} md={8}>
                        <Input
                            placeholder="搜索产品..."
                            prefix={<SearchOutlined />}
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            allowClear
                        />
                    </Col>
                </Row>
            </Card>

            {/* Products Grid */}
            {loading ? (
                <div style={{ textAlign: 'center', padding: 100 }}>
                    <Spin size="large" />
                </div>
            ) : filteredProducts.length === 0 ? (
                <Empty description="暂无产品" />
            ) : (
                <>
                    <Row gutter={[24, 24]}>
                        {filteredProducts.map((product) => (
                            <Col xs={24} sm={12} lg={8} key={product.id}>
                                <Card
                                    hoverable
                                    cover={
                                        <div style={{ position: 'relative', overflow: 'hidden' }}>
                                            <img
                                                alt={product.name}
                                                src={product.image}
                                                style={{ height: 200, width: '100%', objectFit: 'cover' }}
                                            />
                                            {product.isHot && (
                                                <Tag color="red" style={{ position: 'absolute', top: 8, left: 8 }}>
                                                    <FireOutlined /> 热门
                                                </Tag>
                                            )}
                                            {product.isNew && (
                                                <Tag color="green" style={{ position: 'absolute', top: 8, left: 8 }}>
                                                    <StarOutlined /> 新品
                                                </Tag>
                                            )}
                                        </div>
                                    }
                                    actions={[
                                        <Button type="link" icon={<ShoppingCartOutlined />}>加入购物车</Button>,
                                        <Button type="primary">立即购买</Button>
                                    ]}
                                >
                                    <Card.Meta
                                        title={
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <Text strong ellipsis style={{ maxWidth: '65%' }}>{product.name}</Text>
                                                <Tag color="blue">{product.category}</Tag>
                                            </div>
                                        }
                                        description={
                                            <Text type="secondary">
                                                {product.description}
                                            </Text>
                                        }
                                    />
                                    <div style={{ marginTop: 16 }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <div>
                                                <Text type="danger" strong style={{ fontSize: 20 }}>¥{product.price}</Text>
                                                {product.originalPrice && (
                                                    <Text delete type="secondary" style={{ marginLeft: 8 }}>
                                                        ¥{product.originalPrice}
                                                    </Text>
                                                )}
                                            </div>
                                            <Rate disabled defaultValue={product.rating} style={{ fontSize: 12 }} />
                                        </div>
                                        <div style={{ marginTop: 8 }}>
                                            {product.tags.map((tag: string) => (
                                                <Tag key={tag} style={{ marginRight: 4 }}>{tag}</Tag>
                                            ))}
                                        </div>
                                        <Text type="secondary" style={{ fontSize: 12 }}>已售 {product.sales}</Text>
                                    </div>
                                </Card>
                            </Col>
                        ))}
                    </Row>

                    {/* Pagination */}
                    <div style={{ textAlign: 'center', marginTop: 32 }}>
                        <Pagination
                            current={page}
                            pageSize={pageSize}
                            total={total}
                            onChange={setPage}
                            showTotal={(total) => `共 ${total} 个产品`}
                        />
                    </div>
                </>
            )}
        </div>
    );
};

export default Products;
