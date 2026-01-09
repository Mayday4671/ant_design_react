import React, { useState } from 'react';
import { Card, Typography, message, ColorPicker, Slider, Input, Switch, Row, Col } from 'antd';
import CommonForm from '../components/Common/CommonForm';
import type { FormField } from '../components/Common/CommonForm';
import { useAppTheme } from '../contexts/ThemeContext';

const { Title, Text } = Typography;

const Settings: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const {
        primaryColor, setPrimaryColor,
        backgroundImage, setBackgroundImage,
        contentOpacity, setContentOpacity,
        isDarkMode, setIsDarkMode
    } = useAppTheme();

    const onFinish = (values: any) => {
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            message.success('配置已保存');
            console.log('Saved:', values);
        }, 1000);
    };

    const profileFields: FormField[] = [
        {
            name: 'displayName',
            label: '显示名称',
            type: 'input',
            rules: [{ required: true, message: '请输入显示名称' }],
        },
        {
            name: 'email',
            label: '邮箱',
            type: 'input',
            rules: [{ required: true, type: 'email', message: '请输入有效邮箱' }],
        },
        {
            name: 'notifications',
            label: '启用通知',
            type: 'switch',
        }
    ];

    return (
        <div>
            <Title level={2}>设置</Title>

            <Card bordered={false} title="外观设置 (实时预览)" style={{ marginBottom: 24 }}>
                <Row gutter={[24, 24]}>
                    <Col span={24} md={12}>
                        <div style={{ marginBottom: 16 }}>
                            <Text strong>主题色</Text>
                            <div style={{ marginTop: 8 }}>
                                <ColorPicker
                                    showText
                                    value={primaryColor}
                                    onChangeComplete={(c) => setPrimaryColor(c.toHexString())}
                                />
                            </div>
                        </div>
                        <div style={{ marginBottom: 16 }}>
                            <Text strong>深色模式</Text>
                            <div style={{ marginTop: 8 }}>
                                <Switch
                                    checked={isDarkMode}
                                    onChange={setIsDarkMode}
                                    checkedChildren="开启"
                                    unCheckedChildren="关闭"
                                />
                            </div>
                        </div>
                    </Col>
                    <Col span={24} md={12}>
                        <div style={{ marginBottom: 16 }}>
                            <Text strong>背景图片 URL</Text>
                            <div style={{ marginTop: 8 }}>
                                <Input
                                    placeholder="输入图片 URL (例如: https://source.unsplash.com/random)"
                                    value={backgroundImage}
                                    onChange={(e) => setBackgroundImage(e.target.value)}
                                    allowClear
                                />
                            </div>
                        </div>
                        <div style={{ marginBottom: 16 }}>
                            <Text strong>内容卡片透明度: {contentOpacity}</Text>
                            <div style={{ marginTop: 8 }}>
                                <Slider
                                    min={0.1}
                                    max={1}
                                    step={0.1}
                                    value={contentOpacity}
                                    onChange={setContentOpacity}
                                />
                            </div>
                        </div>
                    </Col>
                </Row>
            </Card>

            <Card bordered={false} title="个人资料">
                <CommonForm
                    fields={profileFields}
                    onFinish={onFinish}
                    loading={loading}
                    submitText="保存更改"
                    initialValues={{
                        displayName: 'Admin User',
                        email: 'admin@example.com',
                        notifications: true,
                    }}
                    layout="vertical"
                />
            </Card>
        </div>
    );
};

export default Settings;
