import React, { useState, useEffect } from 'react';
import {
    Typography, Table, Button, Modal, Form, Input, Space, message, Popconfirm, Select, Card
} from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import {
    fetchCategories, fetchDocuments, createDocument, updateDocument, deleteDocument,
    type KnowledgeCategory, type KnowledgeDocument
} from '../../../services/knowledge';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

const { Title } = Typography;

const KnowledgeAdmin: React.FC = () => {
    const [categories, setCategories] = useState<KnowledgeCategory[]>([]);
    const [documents, setDocuments] = useState<KnowledgeDocument[]>([]);
    const [loading, setLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [previewVisible, setPreviewVisible] = useState(false);
    const [editingDoc, setEditingDoc] = useState<KnowledgeDocument | null>(null);
    const [previewContent, setPreviewContent] = useState('');
    const [form] = Form.useForm();
    // 用于实时预览的 content 状态
    const [editingContent, setEditingContent] = useState('');

    // 加载数据
    const loadData = async () => {
        setLoading(true);
        try {
            const [catsRes, docsRes] = await Promise.all([
                fetchCategories(),
                fetchDocuments(),
            ]);
            setCategories(catsRes.data);
            setDocuments(docsRes.data);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    // 打开新建/编辑模态框
    const handleEdit = (doc?: KnowledgeDocument) => {
        setEditingDoc(doc || null);
        if (doc) {
            form.setFieldsValue({
                title: doc.title,
                categoryId: doc.categoryId,
                order: doc.order,
                content: doc.content, // 设置 content 字段
            });
            setEditingContent(doc.content); // 初始化预览内容
        } else {
            form.resetFields();
            form.setFieldsValue({ order: documents.length + 1 });
            setEditingContent('');
        }
        setModalVisible(true);
    };

    // 保存文档
    const handleSave = async () => {
        try {
            const values = await form.validateFields();
            // content 已经在 values 中了，不需要额外获取
            const content = values.content || '';

            if (editingDoc) {
                await updateDocument(editingDoc.id, { ...values, content });
                message.success('文档更新成功');
            } else {
                await createDocument({ ...values, content });
                message.success('文档创建成功');
            }

            setModalVisible(false);
            loadData();
        } catch (error) {
            console.error('保存失败:', error);
        }
    };

    // 删除文档
    const handleDelete = async (id: string) => {
        await deleteDocument(id);
        message.success('文档删除成功');
        loadData();
    };

    // 预览文档
    const handlePreview = (doc: KnowledgeDocument) => {
        setPreviewContent(doc.content);
        setPreviewVisible(true);
    };

    // 获取分类名称
    const getCategoryName = (categoryId: string) => {
        const cat = categories.find(c => c.id === categoryId);
        return cat?.name || '未分类';
    };

    const columns = [
        {
            title: '标题',
            dataIndex: 'title',
            key: 'title',
            ellipsis: true,
        },
        {
            title: '分类',
            dataIndex: 'categoryId',
            key: 'categoryId',
            width: 150,
            render: (id: string) => getCategoryName(id),
        },
        {
            title: '排序',
            dataIndex: 'order',
            key: 'order',
            width: 80,
        },
        {
            title: '更新时间',
            dataIndex: 'updatedAt',
            key: 'updatedAt',
            width: 180,
            render: (date: string) => new Date(date).toLocaleString(),
        },
        {
            title: '操作',
            key: 'action',
            width: 240,
            render: (_: unknown, record: KnowledgeDocument) => (
                <Space>
                    <Button icon={<EyeOutlined />} size="small" onClick={() => handlePreview(record)}>
                        预览
                    </Button>
                    <Button icon={<EditOutlined />} size="small" onClick={() => handleEdit(record)}>
                        编辑
                    </Button>
                    <Popconfirm title="确定删除？" onConfirm={() => handleDelete(record.id)}>
                        <Button icon={<DeleteOutlined />} size="small" danger>
                            删除
                        </Button>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <div style={{ padding: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                <Title level={4} style={{ margin: 0 }}>项目文档管理</Title>
                <Button type="primary" icon={<PlusOutlined />} onClick={() => handleEdit()}>
                    新建文档
                </Button>
            </div>

            <Card>
                <Table
                    columns={columns}
                    dataSource={documents}
                    rowKey="id"
                    loading={loading}
                    pagination={{ pageSize: 10 }}
                />
            </Card>

            {/* 编辑模态框 */}
            <Modal
                title={editingDoc ? '编辑文档' : '新建文档'}
                open={modalVisible}
                onOk={handleSave}
                onCancel={() => setModalVisible(false)}
                width={1200}
                destroyOnClose
            >
                <Form form={form} layout="vertical">
                    <Form.Item name="title" label="标题" rules={[{ required: true, message: '请输入标题' }]}>
                        <Input placeholder="请输入文档标题" />
                    </Form.Item>
                    <Form.Item name="categoryId" label="分类" rules={[{ required: true, message: '请选择分类' }]}>
                        <Select placeholder="请选择分类">
                            {categories.map(cat => (
                                <Select.Option key={cat.id} value={cat.id}>
                                    {cat.name}
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item name="order" label="排序">
                        <Input type="number" placeholder="数字越小越靠前" />
                    </Form.Item>
                    <div style={{ display: 'flex', gap: 16, height: 500 }}>
                        {/* 左侧编辑区 */}
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                            <div style={{ marginBottom: 8, fontWeight: 'bold' }}>Markdown 编辑</div>
                            <Form.Item name="content" noStyle rules={[{ required: true, message: '请输入内容' }]}>
                                <Input.TextArea
                                    style={{ flex: 1, resize: 'none', height: '100%' }}
                                    placeholder="请输入 Markdown 内容..."
                                    onChange={(e) => setEditingContent(e.target.value)}
                                />
                            </Form.Item>
                        </div>
                        {/* 右侧预览区 */}
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                            <div style={{ marginBottom: 8, fontWeight: 'bold' }}>实时预览</div>
                            <div
                                className="markdown-body"
                                style={{
                                    flex: 1,
                                    border: '1px solid #d9d9d9',
                                    borderRadius: 6,
                                    padding: 12,
                                    overflowY: 'auto',
                                    background: '#fff' // 预览区保持白色背景，避免透明
                                }}
                            >
                                <ReactMarkdown
                                    remarkPlugins={[remarkGfm]}
                                    components={{
                                        code({ inline, className, children, ...props }: any) {
                                            const match = /language-(\w+)/.exec(className || '');
                                            return !inline && match ? (
                                                <SyntaxHighlighter
                                                    style={oneDark}
                                                    language={match[1]}
                                                    PreTag="div"
                                                    {...props}
                                                >
                                                    {String(children).replace(/\n$/, '')}
                                                </SyntaxHighlighter>
                                            ) : (
                                                <code className={className} {...props}>
                                                    {children}
                                                </code>
                                            );
                                        },
                                    }}
                                >
                                    {editingContent || '暂无内容'}
                                </ReactMarkdown>
                            </div>
                        </div>
                    </div>
                </Form>
            </Modal>

            {/* 预览模态框 */}
            <Modal
                title="文档预览"
                open={previewVisible}
                onCancel={() => setPreviewVisible(false)}
                footer={null}
                width={800}
            >
                <div
                    className="markdown-body"
                    style={{ padding: 16, maxHeight: '60vh', overflowY: 'auto' }}
                >
                    <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        components={{
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            code({ inline, className, children, ...props }: any) {
                                const match = /language-(\w+)/.exec(className || '');
                                return !inline && match ? (
                                    <SyntaxHighlighter
                                        style={oneDark}
                                        language={match[1]}
                                        PreTag="div"
                                        {...props}
                                    >
                                        {String(children).replace(/\n$/, '')}
                                    </SyntaxHighlighter>
                                ) : (
                                    <code className={className} {...props}>
                                        {children}
                                    </code>
                                );
                            },
                        }}
                    >
                        {previewContent}
                    </ReactMarkdown>
                </div>
            </Modal>
        </div>
    );
};

export default KnowledgeAdmin;
