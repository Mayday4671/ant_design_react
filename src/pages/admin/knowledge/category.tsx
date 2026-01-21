import React, { useState, useEffect } from 'react';
import {
    Typography, Table, Button, Modal, Form, Input, Space, message, Popconfirm, Card
} from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import {
    fetchCategories, createCategory, updateCategory, deleteCategory,
    type KnowledgeCategory
} from '../../../services/knowledge';

const { Title } = Typography;
const { TextArea } = Input;

const CategoryAdmin: React.FC = () => {
    const [categories, setCategories] = useState<KnowledgeCategory[]>([]);
    const [loading, setLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [editingCat, setEditingCat] = useState<KnowledgeCategory | null>(null);
    const [form] = Form.useForm();

    // 加载数据
    const loadData = async () => {
        setLoading(true);
        try {
            const res = await fetchCategories();
            setCategories(res.data);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    // 打开新建/编辑模态框
    const handleEdit = (cat?: KnowledgeCategory) => {
        setEditingCat(cat || null);
        if (cat) {
            form.setFieldsValue(cat);
        } else {
            form.resetFields();
            form.setFieldsValue({ order: categories.length + 1 });
        }
        setModalVisible(true);
    };

    // 保存分类
    const handleSave = async () => {
        try {
            const values = await form.validateFields();

            if (editingCat) {
                await updateCategory(editingCat.id, values);
                message.success('分类更新成功');
            } else {
                await createCategory(values);
                message.success('分类创建成功');
            }

            setModalVisible(false);
            loadData();
        } catch (error) {
            console.error('保存失败:', error);
        }
    };

    // 删除分类
    const handleDelete = async (id: string) => {
        await deleteCategory(id);
        message.success('分类删除成功');
        loadData();
    };

    const columns = [
        {
            title: '名称',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: '描述',
            dataIndex: 'description',
            key: 'description',
            ellipsis: true,
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
            width: 200,
            render: (_: unknown, record: KnowledgeCategory) => (
                <Space>
                    <Button icon={<EditOutlined />} size="small" onClick={() => handleEdit(record)}>
                        编辑
                    </Button>
                    <Popconfirm
                        title="确定删除？该分类下的所有文档也将被删除！"
                        onConfirm={() => handleDelete(record.id)}
                    >
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
                <Title level={4} style={{ margin: 0 }}>分类管理</Title>
                <Button type="primary" icon={<PlusOutlined />} onClick={() => handleEdit()}>
                    新建分类
                </Button>
            </div>

            <Card>
                <Table
                    columns={columns}
                    dataSource={categories}
                    rowKey="id"
                    loading={loading}
                    pagination={{ pageSize: 10 }}
                />
            </Card>

            {/* 编辑模态框 */}
            <Modal
                title={editingCat ? '编辑分类' : '新建分类'}
                open={modalVisible}
                onOk={handleSave}
                onCancel={() => setModalVisible(false)}
                destroyOnClose
            >
                <Form form={form} layout="vertical">
                    <Form.Item name="name" label="名称" rules={[{ required: true, message: '请输入分类名称' }]}>
                        <Input placeholder="请输入分类名称" />
                    </Form.Item>
                    <Form.Item name="description" label="描述">
                        <TextArea rows={3} placeholder="请输入分类描述" />
                    </Form.Item>
                    <Form.Item name="order" label="排序">
                        <Input type="number" placeholder="数字越小越靠前" />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default CategoryAdmin;
