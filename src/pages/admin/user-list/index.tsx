import React, { useEffect, useState } from 'react';
import { Tag, Space, Button, Form, message, Popconfirm } from 'antd';
import type { TablePaginationConfig } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { getUsers, updateUser, createUser, deleteUser } from '../../../services/mock';
import type { User } from '../../../services/mock';
import CommonTable from '../../../components/common/common-table';
import CommonModal from '../../../components/common/common-modal';
import CommonForm from '../../../components/common/common-form';
import type { FormField } from '../../../components/common/common-form';

/**
 * React vs Vue Note:
 * This component is a Functional Component.
 * In Vue 3, this is similar to using <script setup> with Composition API.
 */
const UserList: React.FC = () => {
    // State Management (React useState vs Vue ref)
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState<User[]>([]);
    const [total, setTotal] = useState(0);
    const [searchText, setSearchText] = useState('');
    const [pagination, setPagination] = useState<TablePaginationConfig>({
        current: 1,
        pageSize: 10,
    });

    // Modal & Form State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [form] = Form.useForm(); // Ant Design Form instance

    // Fetch Data Function
    const fetchData = async (page: number, size: number, search?: string) => {
        setLoading(true);
        try {
            const res = await getUsers(page, size, search);
            setData(res.data);
            setTotal(res.total);
        } finally {
            setLoading(false);
        }
    };

    /**
     * Lifecycle Hook (React useEffect vs Vue onMounted/watch)
     */
    useEffect(() => {
        fetchData(pagination.current || 1, pagination.pageSize || 10, searchText);
    }, [pagination.current, pagination.pageSize, searchText]);

    // Handlers
    const handleTableChange = (newPagination: TablePaginationConfig) => {
        setPagination(newPagination);
    };

    const handleSearch = (value: string) => {
        setSearchText(value);
        setPagination({ ...pagination, current: 1 });
    };

    // Toggle Status (Update)
    const handleStatusToggle = async (record: User) => {
        const newStatus = record.status === '活跃' ? '非活跃' : '活跃';
        setLoading(true);
        await updateUser(record.id, { status: newStatus });
        message.success(`用户 ${record.name} 状态已更新`);
        fetchData(pagination.current || 1, pagination.pageSize || 10, searchText);
    };

    // Open Modal for Create
    const handleAdd = () => {
        setEditingUser(null);
        form.resetFields();
        setIsModalOpen(true);
    };

    // Open Modal for Edit
    const handleEdit = (record: User) => {
        setEditingUser(record);
        form.setFieldsValue(record);
        setIsModalOpen(true);
    };

    // Handle Delete
    const handleDelete = async (id: string) => {
        setLoading(true);
        await deleteUser(id);
        message.success('用户删除成功');
        fetchData(pagination.current || 1, pagination.pageSize || 10, searchText);
    };

    // Handle Modal OK (Submit)
    const handleModalOk = () => {
        form.submit();
    };

    const onFormFinish = async (values: any) => {
        try {
            setLoading(true);

            if (editingUser) {
                // Update
                await updateUser(editingUser.id, values);
                message.success('用户更新成功');
            } else {
                // Create
                await createUser({
                    ...values,
                    lastLogin: '从未', // Default value
                });
                message.success('用户创建成功');
            }

            setIsModalOpen(false);
            fetchData(pagination.current || 1, pagination.pageSize || 10, searchText);
        } catch (error) {
            console.error('Operation Failed:', error);
        } finally {
            setLoading(false);
        }
    };

    const columns: ColumnsType<User> = [
        {
            title: '姓名',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: '邮箱',
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: '角色',
            dataIndex: 'role',
            key: 'role',
        },
        {
            title: '状态',
            dataIndex: 'status',
            key: 'status',
            render: (status) => (
                <Tag color={status === '活跃' ? 'green' : 'red'}>
                    {status}
                </Tag>
            ),
        },
        {
            title: '最后登录时间',
            dataIndex: 'lastLogin',
            key: 'lastLogin',
        },
        {
            title: '操作',
            key: 'action',
            render: (_, record) => (
                <Space size="small">
                    <Button
                        type="link"
                        size="small"
                        icon={<EditOutlined />}
                        onClick={() => handleEdit(record)}
                    >
                        编辑
                    </Button>
                    <Popconfirm
                        title="确定删除此用户吗?"
                        onConfirm={() => handleDelete(record.id)}
                        okText="是"
                        cancelText="否"
                    >
                        <Button type="link" size="small" danger icon={<DeleteOutlined />}>
                            删除
                        </Button>
                    </Popconfirm>
                    <Button type="link" size="small" onClick={() => handleStatusToggle(record)}>
                        {record.status === '活跃' ? '停用' : '启用'}
                    </Button>
                </Space>
            ),
        },
    ];

    const formFields: FormField[] = [
        {
            name: 'name',
            label: '姓名',
            type: 'input',
            rules: [{ required: true, message: '请输入姓名' }],
        },
        {
            name: 'email',
            label: '邮箱',
            type: 'input',
            rules: [
                { required: true, message: '请输入邮箱' },
                { type: 'email', message: '请输入有效的邮箱地址' }
            ],
        },
        {
            name: 'role',
            label: '角色',
            type: 'select',
            options: [
                { label: '管理员', value: '管理员' },
                { label: '用户', value: '用户' },
                { label: '访客', value: '访客' },
            ],
            rules: [{ required: true, message: '请选择角色' }],
        },
        {
            name: 'status',
            label: '状态',
            type: 'select',
            options: [
                { label: '活跃', value: '活跃' },
                { label: '非活跃', value: '非活跃' },
            ],
            rules: [{ required: true, message: '请选择状态' }],
        },
    ];

    return (
        <div>
            <CommonTable
                headerTitle="用户列表"
                columns={columns}
                dataSource={data}
                rowKey="id"
                pagination={{
                    ...pagination,
                    total,
                    showSizeChanger: true,
                }}
                loading={loading}
                onChange={handleTableChange}
                onSearch={handleSearch}
                onRefresh={() => fetchData(pagination.current || 1, pagination.pageSize || 10, searchText)}
                onAdd={handleAdd}
                searchPlaceholder="搜索用户..."
            />

            <CommonModal
                title={editingUser ? "编辑用户" : "添加用户"}
                open={isModalOpen}
                onOk={handleModalOk}
                onCancel={() => setIsModalOpen(false)}
                okText="保存"
                cancelText="取消"
            >
                <CommonForm
                    form={form}
                    fields={formFields}
                    onFinish={onFormFinish}
                    showSubmit={false}
                    initialValues={{ status: '活跃', role: '用户' }}
                />
            </CommonModal>
        </div>
    );
};

export default UserList;
