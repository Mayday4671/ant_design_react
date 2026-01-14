import React from 'react';
import { Typography, Card, Row, Col, Timeline, Avatar, Space } from 'antd';
import { CheckCircleOutlined, GithubOutlined, MailOutlined, GlobalOutlined } from '@ant-design/icons';

const { Title, Paragraph, Text, Link } = Typography;

const About: React.FC = () => {
    const teamMembers = [
        { name: '张三', role: '技术负责人', avatar: 'Z' },
        { name: '李四', role: '产品经理', avatar: 'L' },
        { name: '王五', role: '前端开发', avatar: 'W' },
    ];

    return (
        <div>
            <Title level={2}>关于我们</Title>

            {/* About Section */}
            <Card style={{ marginBottom: 24 }}>
                <Paragraph style={{ fontSize: 16 }}>
                    我们是一家专注于提供高质量 Web 解决方案的技术团队。我们的目标是帮助企业
                    构建现代化、高性能、用户友好的 Web 应用程序。
                </Paragraph>
                <Paragraph style={{ fontSize: 16 }}>
                    本项目采用 <Text strong>React 19</Text> + <Text strong>TypeScript</Text> +
                    <Text strong>Ant Design 6</Text> 技术栈，遵循最佳实践，确保代码质量和可维护性。
                </Paragraph>
            </Card>

            {/* Features */}
            <Row gutter={[24, 24]} style={{ marginBottom: 24 }}>
                <Col xs={24} md={12}>
                    <Card title="技术栈" style={{ height: '100%' }}>
                        <Space direction="vertical" size="small">
                            <div><CheckCircleOutlined style={{ color: '#52c41a' }} /> React 19</div>
                            <div><CheckCircleOutlined style={{ color: '#52c41a' }} /> TypeScript</div>
                            <div><CheckCircleOutlined style={{ color: '#52c41a' }} /> Ant Design 6</div>
                            <div><CheckCircleOutlined style={{ color: '#52c41a' }} /> React Router 7</div>
                            <div><CheckCircleOutlined style={{ color: '#52c41a' }} /> Vite</div>
                        </Space>
                    </Card>
                </Col>
                <Col xs={24} md={12}>
                    <Card title="发展历程" style={{ height: '100%' }}>
                        <Timeline
                            items={[
                                { children: '2024 Q1 - 项目立项' },
                                { children: '2024 Q2 - 核心功能开发' },
                                { children: '2024 Q3 - 测试与优化' },
                                { children: '2024 Q4 - 正式发布' },
                            ]}
                        />
                    </Card>
                </Col>
            </Row>

            {/* Team */}
            <Card title="团队成员" style={{ marginBottom: 24 }}>
                <Row gutter={[24, 24]}>
                    {teamMembers.map((member, index) => (
                        <Col xs={24} sm={8} key={index}>
                            <Card.Meta
                                avatar={<Avatar size={48} style={{ backgroundColor: '#1677ff' }}>{member.avatar}</Avatar>}
                                title={member.name}
                                description={member.role}
                            />
                        </Col>
                    ))}
                </Row>
            </Card>

            {/* Contact */}
            <Card title="联系我们">
                <Space size="large">
                    <Link href="https://github.com" target="_blank">
                        <GithubOutlined style={{ fontSize: 24 }} /> GitHub
                    </Link>
                    <Link href="mailto:contact@example.com">
                        <MailOutlined style={{ fontSize: 24 }} /> Email
                    </Link>
                    <Link href="https://example.com" target="_blank">
                        <GlobalOutlined style={{ fontSize: 24 }} /> Website
                    </Link>
                </Space>
            </Card>
        </div>
    );
};

export default About;
