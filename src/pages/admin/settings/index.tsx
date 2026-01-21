import React from 'react';
import {
    Typography, Card, Form, Input, Slider, Switch, Row, Col, Space, ColorPicker, Radio, Tooltip, Button, message
} from 'antd';
import { CheckOutlined } from '@ant-design/icons';
import { getStoredApiKey, saveApiKey, clearApiKey, getStoredGoogleApiKey, saveGoogleApiKey, clearGoogleApiKey } from '../../../services/openai';
import {
    useAppTheme, PRESET_THEMES, PRIMARY_COLORS
} from '../../../contexts/theme-context';
import '../../../assets/styles/pages/admin/settings.css';

const { Title, Text, Paragraph } = Typography;

// 预设主题预览卡片 - 模拟真实 UI 界面
const ThemePreviewCard: React.FC<{
    themeConfig: typeof PRESET_THEMES[0];
    isActive: boolean;
    onClick: () => void;
}> = ({ themeConfig, isActive, onClick }) => {
    const bgColor = themeConfig.isDark ? '#141414' : '#f5f5f5';
    const cardBg = themeConfig.isDark ? '#1f1f1f' : '#ffffff';
    const borderColor = themeConfig.isDark ? '#303030' : '#e8e8e8';

    return (
        <div
            className={`theme-preview-card ${isActive ? 'active' : ''}`}
            onClick={onClick}
            style={{
                borderColor: isActive ? themeConfig.colorPrimary : 'transparent',
            }}
        >
            {/* 模拟界面 */}
            <div className="theme-preview-content" style={{ background: bgColor }}>
                {/* 顶栏 */}
                <div className="theme-preview-header" style={{ background: cardBg, borderBottom: `1px solid ${borderColor}` }}>
                    <div className="theme-preview-logo" style={{ background: themeConfig.colorPrimary }} />
                    <div className="theme-preview-nav-items">
                        <div className="theme-preview-nav-item active" style={{ background: `${themeConfig.colorPrimary}15` }} />
                        <div className="theme-preview-nav-item" />
                    </div>
                </div>
                {/* 主体 */}
                <div className="theme-preview-body">
                    <div className="theme-preview-sidebar" style={{ background: cardBg, borderRight: `1px solid ${borderColor}` }}>
                        <div className="theme-preview-menu active" style={{ borderLeft: `2px solid ${themeConfig.colorPrimary}`, background: `${themeConfig.colorPrimary}10` }} />
                        <div className="theme-preview-menu" />
                        <div className="theme-preview-menu" />
                    </div>
                    <div className="theme-preview-main">
                        <div className="theme-preview-card-inner" style={{ background: cardBg, borderRadius: themeConfig.borderRadius }}>
                            <div className="theme-preview-title" />
                            <div className="theme-preview-btn" style={{ background: themeConfig.colorPrimary, borderRadius: themeConfig.borderRadius }} />
                        </div>
                    </div>
                </div>
            </div>
            {/* 选中标记 */}
            {isActive && (
                <div className="theme-check" style={{ background: themeConfig.colorPrimary }}>
                    <CheckOutlined style={{ color: '#fff', fontSize: 10 }} />
                </div>
            )}
            {/* 名称 */}
            <div className="theme-name">{themeConfig.name}</div>
        </div>
    );
};

const Settings: React.FC = () => {
    // API Key State
    const [_apiKey, setApiKey] = React.useState(getStoredApiKey());
    const [tempApiKey, setTempApiKey] = React.useState(getStoredApiKey());
    const [_googleApiKey, setGoogleApiKey] = React.useState(getStoredGoogleApiKey());
    const [tempGoogleApiKey, setTempGoogleApiKey] = React.useState(getStoredGoogleApiKey());

    const handleSaveApiKey = () => {
        if (!tempApiKey.trim()) {
            message.error('请输入有效的 API Key');
            return;
        }
        saveApiKey(tempApiKey.trim());
        setApiKey(tempApiKey.trim());
        message.success('OpenAI API Key 已保存');
    };

    const handleSaveGoogleApiKey = () => {
        if (!tempGoogleApiKey.trim()) {
            message.error('请输入有效的 Google API Key');
            return;
        }
        saveGoogleApiKey(tempGoogleApiKey.trim());
        setGoogleApiKey(tempGoogleApiKey.trim());
        message.success('Google API Key 已保存');
    };

    const {
        presetThemeId,
        colorPrimary,
        setColorPrimary,
        borderRadius,
        setBorderRadius,
        isDarkMode,
        setIsDarkMode,
        isCompact,
        setIsCompact,
        adminBackgroundImage,
        setAdminBackgroundImage,
        frontendBackgroundImage,
        setFrontendBackgroundImage,
        contentOpacity,
        setContentOpacity,
        applyPresetTheme,
    } = useAppTheme();

    return (
        <div className="settings-container">
            <Title level={2}>定制主题</Title>
            <Paragraph type="secondary" style={{ marginBottom: 32 }}>
                Ant Design 开放更多样式算法，让你定制主题更简单
            </Paragraph>

            {/* 我的主题 */}
            <Card
                className="settings-card"
                title="我的主题"
                extra={
                    <Space>
                        <Text type="secondary">当前：</Text>
                        <Text strong style={{ color: colorPrimary }}>
                            {PRESET_THEMES.find(t => t.id === presetThemeId)?.name || '自定义'}
                        </Text>
                    </Space>
                }
            >
                {/* 主题选择 */}
                <Form.Item label="主题" className="form-item-inline">
                    <div className="theme-grid">
                        {PRESET_THEMES.map((t) => (
                            <ThemePreviewCard
                                key={t.id}
                                themeConfig={t}
                                isActive={presetThemeId === t.id}
                                onClick={() => applyPresetTheme(t.id)}
                            />
                        ))}
                    </div>
                </Form.Item>

                {/* 主色 */}
                <Form.Item label="主色" className="form-item-inline">
                    <Space size={8} wrap align="center">
                        {PRIMARY_COLORS.map((color) => (
                            <Tooltip title={color} key={color}>
                                <div
                                    className={`color-dot ${colorPrimary === color ? 'active' : ''}`}
                                    style={{ background: color }}
                                    onClick={() => setColorPrimary(color)}
                                >
                                    {colorPrimary === color && <CheckOutlined style={{ color: '#fff', fontSize: 12 }} />}
                                </div>
                            </Tooltip>
                        ))}
                        <ColorPicker
                            value={colorPrimary}
                            onChange={(c) => setColorPrimary(c.toHexString())}
                            showText
                        />
                    </Space>
                </Form.Item>

                {/* 圆角 */}
                <Row gutter={48}>
                    <Col xs={24} md={12}>
                        <Form.Item label={`圆角：${borderRadius}px`} className="form-item-inline">
                            <Slider
                                min={0}
                                max={20}
                                value={borderRadius}
                                onChange={setBorderRadius}
                                marks={{ 0: '0', 6: '6', 12: '12', 20: '20' }}
                                style={{ maxWidth: 300 }}
                            />
                        </Form.Item>
                    </Col>
                    <Col xs={24} md={12}>
                        <Form.Item label={`内容透明度：${Math.round(contentOpacity * 100)}%`} className="form-item-inline">
                            <Slider
                                min={0}
                                max={1}
                                step={0.05}
                                value={contentOpacity}
                                onChange={setContentOpacity}
                                marks={{ 0: '透明', 0.5: '50%', 1: '不透明' }}
                                style={{ maxWidth: 300 }}
                            />
                        </Form.Item>
                    </Col>
                </Row>

                {/* 宽松度 */}
                <Form.Item label="宽松度" className="form-item-inline">
                    <Radio.Group value={isCompact ? 'compact' : 'default'} onChange={(e) => setIsCompact(e.target.value === 'compact')}>
                        <Radio value="default">默认</Radio>
                        <Radio value="compact">紧凑</Radio>
                    </Radio.Group>
                </Form.Item>

                {/* 深色/浅色 */}
                <Row gutter={24}>
                    <Col>
                        <Form.Item label="紧凑模式">
                            <Switch checked={isCompact} onChange={setIsCompact} />
                        </Form.Item>
                    </Col>
                    <Col>
                        <Form.Item label="深色模式">
                            <Switch checked={isDarkMode} onChange={setIsDarkMode} />
                        </Form.Item>
                    </Col>
                </Row>
            </Card>

            {/* AI 助手配置 */}
            <Card title="AI 助手配置" className="settings-card">
                <Form.Item label="OpenAI API Key" extra="用于前台 AI 助手的对话功能（仅存储在本地）">
                    <Space.Compact style={{ width: '100%', maxWidth: 500 }}>
                        <Input.Password
                            placeholder="sk-..."
                            value={tempApiKey}
                            onChange={(e) => setTempApiKey(e.target.value)}
                            onPressEnter={handleSaveApiKey}
                        />
                        <Button type="primary" onClick={handleSaveApiKey}>
                            保存
                        </Button>
                        {getStoredApiKey() && (
                            <Button danger onClick={() => {
                                clearApiKey();
                                setApiKey('');
                                setTempApiKey('');
                                message.success('API Key 已清除');
                            }}>
                                清除
                            </Button>
                        )}
                    </Space.Compact>
                </Form.Item>

                <Form.Item label="Google Gemini API Key" extra="用于 Gemini 模型对话（仅存储在本地）">
                    <Space.Compact style={{ width: '100%', maxWidth: 500 }}>
                        <Input.Password
                            placeholder="AIza..."
                            value={tempGoogleApiKey}
                            onChange={(e) => setTempGoogleApiKey(e.target.value)}
                            onPressEnter={handleSaveGoogleApiKey}
                        />
                        <Button type="primary" onClick={handleSaveGoogleApiKey}>
                            保存
                        </Button>
                        {getStoredGoogleApiKey() && (
                            <Button danger onClick={() => {
                                clearGoogleApiKey();
                                setGoogleApiKey('');
                                setTempGoogleApiKey('');
                                message.success('Google Key 已清除');
                            }}>
                                清除
                            </Button>
                        )}
                    </Space.Compact>
                </Form.Item>
            </Card>

            {/* 背景图片 */}
            <Card title="背景图片" className="settings-card">
                <Row gutter={24}>
                    <Col xs={24} md={12}>
                        <Form.Item label="后台管理背景图" extra="输入图片 URL，留空则使用纯色背景">
                            <Input
                                placeholder="https://example.com/bg.jpg"
                                value={adminBackgroundImage}
                                onChange={(e) => setAdminBackgroundImage(e.target.value)}
                                allowClear
                            />
                            {adminBackgroundImage && (
                                <div className="bg-preview" style={{ backgroundImage: `url(${adminBackgroundImage})` }} />
                            )}
                        </Form.Item>
                    </Col>
                    <Col xs={24} md={12}>
                        <Form.Item label="前台展示背景图" extra="输入图片 URL，留空则使用纯色背景">
                            <Input
                                placeholder="https://example.com/bg.jpg"
                                value={frontendBackgroundImage}
                                onChange={(e) => setFrontendBackgroundImage(e.target.value)}
                                allowClear
                            />
                            {frontendBackgroundImage && (
                                <div className="bg-preview" style={{ backgroundImage: `url(${frontendBackgroundImage})` }} />
                            )}
                        </Form.Item>
                    </Col>
                </Row>
            </Card>
        </div>
    );
};

export default Settings;
