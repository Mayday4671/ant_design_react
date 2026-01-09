import React from 'react';
import { Table, Button, Space, Card, Input } from 'antd';
import type { TableProps } from 'antd';
import { PlusOutlined, ReloadOutlined, SearchOutlined } from '@ant-design/icons';
import { useAppTheme } from '../../contexts/ThemeContext';

interface CommonTableProps<T> extends Omit<TableProps<T>, 'title'> {
    headerTitle?: string;
    onAdd?: () => void;
    onRefresh?: () => void;
    onSearch?: (value: string) => void;
    searchPlaceholder?: string;
    extraActions?: React.ReactNode;
}

const CommonTable = <T extends object>({
    headerTitle,
    onAdd,
    onRefresh,
    onSearch,
    searchPlaceholder = 'Search...',
    extraActions,
    ...tableProps
}: CommonTableProps<T>) => {
    const { backgroundImage } = useAppTheme();
    return (
        <Card bordered={backgroundImage ? true : false} styles={{ body: { padding: 0 } }} style={{ background: 'transparent' }}>
            {(headerTitle || onAdd || onSearch || onRefresh || extraActions) && (
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, padding: '16px 24px 0' }}>
                    {headerTitle && <h2 style={{ margin: 0, fontSize: '1.2rem' }}>{headerTitle}</h2>}
                    <Space>
                        {onSearch && (
                            <Input
                                placeholder={searchPlaceholder}
                                prefix={<SearchOutlined />}
                                onChange={(e) => onSearch(e.target.value)}
                                style={{ width: 200 }}
                            />
                        )}
                        {extraActions}
                        {onRefresh && (
                            <Button icon={<ReloadOutlined />} onClick={onRefresh} />
                        )}
                        {onAdd && (
                            <Button type="primary" icon={<PlusOutlined />} onClick={onAdd}>
                                添加
                            </Button>
                        )}
                    </Space>
                </div>
            )}
            <Table<T> {...tableProps} />
        </Card>
    );
};

export default CommonTable;
