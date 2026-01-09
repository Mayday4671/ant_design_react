import React, { useEffect, useState } from 'react';
import { Card, Col, Row, Statistic, Typography, Spin } from 'antd';
import {
    UserOutlined,
    ShoppingOutlined,
    DollarOutlined,
    RiseOutlined,
} from '@ant-design/icons';
import { getStats } from '../services/mock';
import type { DashboardStats } from '../services/mock';

const { Title } = Typography;

const Dashboard: React.FC = () => {
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState<DashboardStats | null>(null);

    useEffect(() => {
        getStats().then((data) => {
            setStats(data);
            setLoading(false);
        });
    }, []);

    if (loading) {
        return <div style={{ textAlign: 'center', marginTop: 50 }}><Spin size="large" /></div>;
    }

    return (
        <div>
            <Title level={2}>仪表盘</Title>

            <Row gutter={[16, 16]}>
                <Col xs={24} sm={12} lg={6}>
                    <Card bordered={false}>
                        <Statistic
                            title="总用户数"
                            value={stats?.totalUsers}
                            prefix={<UserOutlined />}
                            valueStyle={{ color: '#3f8600' }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card bordered={false}>
                        <Statistic
                            title="活跃用户数"
                            value={stats?.activeUsers}
                            prefix={<RiseOutlined />}
                            valueStyle={{ color: '#cf1322' }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card bordered={false}>
                        <Statistic
                            title="总收入"
                            value={stats?.revenue}
                            precision={2}
                            valueStyle={{ color: '#1677ff' }}
                            prefix={<DollarOutlined />}
                            suffix="$"
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card bordered={false}>
                        <Statistic
                            title="新订单"
                            value={stats?.newOrders}
                            prefix={<ShoppingOutlined />}
                        />
                    </Card>
                </Col>
            </Row>

            <div style={{ marginTop: 24 }}>
                <Card title="流量概览" bordered={false}>
                    <div style={{ height: 200, background: '#fafafa', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ccc' }}>
                        图表占位符 (例如: Recharts 或 Ant Design Charts)
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default Dashboard;
