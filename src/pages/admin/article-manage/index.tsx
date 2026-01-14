import React, { useEffect, useState } from 'react';
import {
    Typography, Table, Button, Space, Tag, Modal, Form, Input, Select, Switch,
    message, Popconfirm, Card, Row, Col, Statistic, Avatar, Image
} from 'antd';
import {
    PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined,
    FileTextOutlined, CheckCircleOutlined, ClockCircleOutlined, HeartOutlined
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import {
    getArticles, createArticle, updateArticle, deleteArticle, getCategories, getArticleStats,
    type Article, type Category
} from '../../../services/article-mock';

const { Title, Text } = Typography;
const { TextArea } = Input;

const ArticleManage: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const [articles, setArticles] = useState<Article[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [modalOpen, setModalOpen] = useState(false);
    const [editingArticle, setEditingArticle] = useState<Article | null>(null);
    const [stats, setStats] = useState<{ total: number; published: number; draft: number; totalViews: number; totalLikes: number } | null>(null);
    const [form] = Form.useForm();

    // 获取统计数据
    const fetchStats = async () => {
        const res = await getArticleStats();
        setStats(res.data);
    };

    // 获取分类
    const fetchCategories = async () => {
        const res = await getCategories();
        setCategories(res.data);
    };

    // 获取文章列表
    const fetchArticles = async () => {
        setLoading(true);
        try {
            const res = await getArticles(page, pageSize);
            setArticles(res.data.list);
            setTotal(res.data.total);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
        fetchStats();
    }, []);

    useEffect(() => {
        fetchArticles();
    }, [page, pageSize]);

    // 打开新增/编辑弹窗
    const handleOpenModal = (article?: Article) => {
        if (article) {
            setEditingArticle(article);
            form.setFieldsValue({
                ...article,
                tags: article.tags.join(', '),
            });
        } else {
            setEditingArticle(null);
            form.resetFields();
        }
        setModalOpen(true);
    };

    // 提交表单
    const handleSubmit = async () => {
        try {
            const values = await form.validateFields();
            const articleData = {
                ...values,
                tags: values.tags ? values.tags.split(',').map((t: string) => t.trim()).filter(Boolean) : [],
                author: editingArticle?.author || {
                    id: 'author_admin',
                    name: 'Admin',
                    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin',
                },
                slug: values.title.toLowerCase().replace(/\s+/g, '-'),
                readTime: Math.ceil(values.content.length / 500),
            };

            if (editingArticle) {
                await updateArticle(editingArticle.id, articleData);
                message.success('文章更新成功');
            } else {
                await createArticle(articleData);
                message.success('文章创建成功');
            }

            setModalOpen(false);
            fetchArticles();
            fetchStats();
        } catch (error) {
            console.error('Submit error:', error);
        }
    };

    // 删除文章
    const handleDelete = async (id: string) => {
        await deleteArticle(id);
        message.success('文章删除成功');
        fetchArticles();
        fetchStats();
    };

    // 切换文章状态
    const handleToggleStatus = async (article: Article) => {
        const newStatus = article.status === 'published' ? 'draft' : 'published';
        await updateArticle(article.id, { status: newStatus });
        message.success(`文章已${newStatus === 'published' ? '发布' : '设为草稿'}`);
        fetchArticles();
        fetchStats();
    };


    const columns: ColumnsType<Article> = [
        {
            title: '封面',
            dataIndex: 'coverImage',
            key: 'coverImage',
            width: 100,
            render: (url: string) => (
                <Image src={url} width={80} height={50} style={{ objectFit: 'cover', borderRadius: 4 }} />
            ),
        },
        {
            title: '标题',
            dataIndex: 'title',
            key: 'title',
            ellipsis: true,
            render: (title: string, record: Article) => (
                <Space direction="vertical" size={0}>
                    <Text strong>{title}</Text>
                    <Space size={4}>
                        <Tag color="blue">{record.category}</Tag>
                        {record.featured && <Tag color="red">精选</Tag>}
                    </Space>
                </Space>
            ),
        },
        {
            title: '作者',
            dataIndex: 'author',
            key: 'author',
            width: 120,
            render: (author: Article['author']) => (
                <Space>
                    <Avatar src={author.avatar} size={24} />
                    <Text>{author.name}</Text>
                </Space>
            ),
        },
        {
            title: '状态',
            dataIndex: 'status',
            key: 'status',
            width: 100,
            render: (status: Article['status']) => (
                <Tag color={status === 'published' ? 'green' : status === 'draft' ? 'orange' : 'default'}>
                    {status === 'published' ? '已发布' : status === 'draft' ? '草稿' : '已归档'}
                </Tag>
            ),
        },
        {
            title: '数据',
            key: 'stats',
            width: 150,
            render: (_, record: Article) => (
                <Space split={<span style={{ color: '#d9d9d9' }}>|</span>}>
                    <Text type="secondary"><EyeOutlined /> {record.views}</Text>
                    <Text type="secondary"><HeartOutlined /> {record.likes}</Text>
                </Space>
            ),
        },
        {
            title: '发布时间',
            dataIndex: 'publishTime',
            key: 'publishTime',
            width: 160,
        },
        {
            title: '操作',
            key: 'actions',
            width: 200,
            render: (_, record: Article) => (
                <Space>
                    <Button
                        type="text"
                        size="small"
                        icon={<EditOutlined />}
                        onClick={() => handleOpenModal(record)}
                    >
                        编辑
                    </Button>
                    <Button
                        type="text"
                        size="small"
                        onClick={() => handleToggleStatus(record)}
                    >
                        {record.status === 'published' ? '下架' : '发布'}
                    </Button>
                    <Popconfirm
                        title="确定删除这篇文章吗？"
                        onConfirm={() => handleDelete(record.id)}
                        okText="确定"
                        cancelText="取消"
                    >
                        <Button type="text" size="small" danger icon={<DeleteOutlined />} />
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <div>
            <Title level={2}>文章管理</Title>

            {/* 统计卡片 */}
            {stats && (
                <Row gutter={16} style={{ marginBottom: 24 }}>
                    <Col xs={12} sm={6}>
                        <Card>
                            <Statistic
                                title="文章总数"
                                value={stats.total}
                                prefix={<FileTextOutlined />}
                            />
                        </Card>
                    </Col>
                    <Col xs={12} sm={6}>
                        <Card>
                            <Statistic
                                title="已发布"
                                value={stats.published}
                                valueStyle={{ color: '#52c41a' }}
                                prefix={<CheckCircleOutlined />}
                            />
                        </Card>
                    </Col>
                    <Col xs={12} sm={6}>
                        <Card>
                            <Statistic
                                title="草稿"
                                value={stats.draft}
                                valueStyle={{ color: '#faad14' }}
                                prefix={<ClockCircleOutlined />}
                            />
                        </Card>
                    </Col>
                    <Col xs={12} sm={6}>
                        <Card>
                            <Statistic
                                title="总阅读量"
                                value={stats.totalViews}
                                prefix={<EyeOutlined />}
                            />
                        </Card>
                    </Col>
                </Row>
            )}

            {/* 文章列表 */}
            <Card
                title="文章列表"
                extra={
                    <Button type="primary" icon={<PlusOutlined />} onClick={() => handleOpenModal()}>
                        新增文章
                    </Button>
                }
            >
                <Table
                    columns={columns}
                    dataSource={articles}
                    rowKey="id"
                    loading={loading}
                    pagination={{
                        current: page,
                        pageSize: pageSize,
                        total: total,
                        onChange: (p, ps) => {
                            setPage(p);
                            setPageSize(ps);
                        },
                        showTotal: (total) => `共 ${total} 篇文章`,
                    }}
                />
            </Card>

            {/* 编辑弹窗 */}
            <Modal
                title={editingArticle ? '编辑文章' : '新增文章'}
                open={modalOpen}
                onOk={handleSubmit}
                onCancel={() => setModalOpen(false)}
                width={700}
                okText="保存"
                cancelText="取消"
            >
                <Form form={form} layout="vertical" style={{ marginTop: 24 }}>
                    <Form.Item
                        name="title"
                        label="文章标题"
                        rules={[{ required: true, message: '请输入文章标题' }]}
                    >
                        <Input placeholder="请输入文章标题" />
                    </Form.Item>

                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                name="category"
                                label="分类"
                                rules={[{ required: true, message: '请选择分类' }]}
                            >
                                <Select placeholder="请选择分类">
                                    {categories.map((cat) => (
                                        <Select.Option key={cat.id} value={cat.name}>
                                            {cat.name}
                                        </Select.Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name="tags" label="标签">
                                <Input placeholder="多个标签用逗号分隔" />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Form.Item
                        name="coverImage"
                        label="封面图片 URL"
                        rules={[{ required: true, message: '请输入封面图片URL' }]}
                    >
                        <Input placeholder="请输入图片URL" />
                    </Form.Item>

                    <Form.Item
                        name="summary"
                        label="文章摘要"
                        rules={[{ required: true, message: '请输入文章摘要' }]}
                    >
                        <TextArea rows={2} placeholder="请输入文章摘要" />
                    </Form.Item>

                    <Form.Item
                        name="content"
                        label="文章内容"
                        rules={[{ required: true, message: '请输入文章内容' }]}
                    >
                        <TextArea rows={8} placeholder="请输入文章内容（支持 Markdown 格式）" />
                    </Form.Item>

                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item name="status" label="发布状态" initialValue="draft">
                                <Select>
                                    <Select.Option value="draft">草稿</Select.Option>
                                    <Select.Option value="published">发布</Select.Option>
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name="featured" label="设为精选" valuePropName="checked">
                                <Switch />
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </Modal>
        </div>
    );
};

export default ArticleManage;
