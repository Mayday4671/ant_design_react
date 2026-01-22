import React, { useState, useRef, useEffect } from 'react';
import { Upload, Button, Row, Col, Typography, Input, Card, Radio, message, Space } from 'antd';
import { InboxOutlined, CopyOutlined, DownloadOutlined, RedoOutlined, SwapOutlined } from '@ant-design/icons';

const { Dragger } = Upload;
const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

type Mode = 'img2base64' | 'base642img';

const ImageBase64: React.FC = () => {
    const [mode, setMode] = useState<Mode>('img2base64');
    const [imgSrc, setImgSrc] = useState('');
    const [base64Str, setBase64Str] = useState('');
    const [loading, setLoading] = useState(false);

    // Image to Base64 logic
    const onSelectFile = (file: File) => {
        setLoading(true);
        const reader = new FileReader();
        reader.addEventListener('load', () => {
            const result = reader.result?.toString() || '';
            setImgSrc(result);
            setBase64Str(result);
            setLoading(false);
        });
        reader.readAsDataURL(file);
        return false;
    };

    // Base64 to Image logic
    const handleBase64Change = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const val = e.target.value;
        setBase64Str(val);
        // Try to preview if it looks like an image data URI
        if (val.trim().startsWith('data:image')) {
            setImgSrc(val.trim());
        } else {
            // Should we try to auto-prepend? Let's just reset preview if invalid
            setImgSrc('');
        }
    };

    const handleCopy = () => {
        if (!base64Str) return;
        navigator.clipboard.writeText(base64Str);
        message.success('Base64 代码已复制');
    };

    const handleDownload = () => {
        if (!imgSrc) return;
        const link = document.createElement('a');
        link.download = 'image_from_base64.png';
        link.href = imgSrc;
        link.click();
    };

    const reset = () => {
        setImgSrc('');
        setBase64Str('');
    };

    return (
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: 32 }}>
                <Title level={2}>图片 Base64 转换</Title>
                <Text type="secondary">
                    在线图片与 Base64 编码互相转换工具，支持一键复制与下载。
                </Text>
            </div>

            <div style={{ marginBottom: 24, textAlign: 'center' }}>
                <Radio.Group
                    value={mode}
                    onChange={e => {
                        setMode(e.target.value);
                        reset();
                    }}
                    buttonStyle="solid"
                    size="large"
                >
                    <Radio.Button value="img2base64">图片 转 Base64</Radio.Button>
                    <Radio.Button value="base642img">Base64 转 图片</Radio.Button>
                </Radio.Group>
            </div>

            <Row gutter={24}>
                {mode === 'img2base64' ? (
                    <>
                        <Col xs={24} lg={12}>
                            <Card title="1. 上传图片" bordered={true} style={{ height: '100%' }} bodyStyle={{ padding: 24, minHeight: 400 }}>
                                {!imgSrc ? (
                                    <Dragger
                                        accept="image/*"
                                        showUploadList={false}
                                        beforeUpload={onSelectFile}
                                        style={{
                                            padding: '60px 0',
                                            background: 'var(--color-bg-layout)',
                                            borderRadius: 12,
                                            border: '2px dashed var(--color-border)',
                                        }}
                                    >
                                        <p className="ant-upload-drag-icon">
                                            <InboxOutlined style={{ color: '#1677ff', fontSize: 64 }} />
                                        </p>
                                        <p className="ant-upload-text" style={{ fontSize: 16, marginTop: 16 }}>点击或拖拽图片到此处</p>
                                    </Dragger>
                                ) : (
                                    <div style={{
                                        border: '1px solid var(--color-border)',
                                        padding: 24,
                                        borderRadius: 12,
                                        background: 'var(--color-bg-layout)',
                                        textAlign: 'center',
                                        position: 'relative',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        height: '100%',
                                        maxHeight: 400
                                    }}>
                                        <img
                                            src={imgSrc}
                                            style={{ maxWidth: '100%', maxHeight: 300, objectFit: 'contain', borderRadius: 8 }}
                                        />
                                        <div style={{ marginTop: 24 }}>
                                            <Button onClick={reset} icon={<RedoOutlined />}>重新上传</Button>
                                        </div>
                                    </div>
                                )}
                            </Card>
                        </Col>
                        <Col xs={24} lg={12}>
                            <Card title="2. Base64 结果" bordered={true} style={{ height: '100%' }} bodyStyle={{ padding: 24, minHeight: 400, display: 'flex', flexDirection: 'column' }}>
                                <TextArea
                                    value={base64Str}
                                    readOnly
                                    placeholder="Base64 编码结果将显示在这里..."
                                    style={{ flex: 1, resize: 'none', marginBottom: 16, fontFamily: 'monospace', fontSize: 12 }}
                                />
                                <Button
                                    type="primary"
                                    icon={<CopyOutlined />}
                                    size="large"
                                    block
                                    onClick={handleCopy}
                                    disabled={!base64Str}
                                >
                                    复制 Base64 代码
                                </Button>
                            </Card>
                        </Col>
                    </>
                ) : (
                    <>
                        <Col xs={24} lg={12}>
                            <Card title="1. 输入 Base64" bordered={true} style={{ height: '100%' }} bodyStyle={{ padding: 24, minHeight: 400, display: 'flex', flexDirection: 'column' }}>
                                <TextArea
                                    value={base64Str}
                                    onChange={handleBase64Change}
                                    placeholder="粘贴 Base64 代码到此处 (data:image/png;base64,...)"
                                    style={{ flex: 1, resize: 'none', fontFamily: 'monospace', fontSize: 12 }}
                                />
                                <div style={{ marginTop: 16, color: 'var(--color-text-tertiary)', fontSize: 12 }}>
                                    * 支持带有 data URI scheme 的完整字符串
                                </div>
                            </Card>
                        </Col>
                        <Col xs={24} lg={12}>
                            <Card title="2. 图片预览" bordered={true} style={{ height: '100%' }} bodyStyle={{ padding: 24, minHeight: 400 }}>
                                {!imgSrc ? (
                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        height: '100%',
                                        background: 'var(--color-bg-layout)',
                                        borderRadius: 12,
                                        color: 'var(--color-text-tertiary)',
                                        flexDirection: 'column',
                                        gap: 16,
                                        minHeight: 300
                                    }}>
                                        <div style={{ fontSize: 48, opacity: 0.2 }}>🖼️</div>
                                        <div>预览区域</div>
                                    </div>
                                ) : (
                                    <div style={{
                                        border: '1px solid var(--color-border)',
                                        padding: 24,
                                        borderRadius: 12,
                                        background: 'var(--color-bg-layout)', // Checkerboard ideally
                                        textAlign: 'center',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        height: '100%',
                                        minHeight: 300
                                    }}>
                                        <img
                                            src={imgSrc}
                                            style={{ maxWidth: '100%', maxHeight: 400, objectFit: 'contain' }}
                                        />
                                        <div style={{ marginTop: 24, width: '100%' }}>
                                            <Button
                                                type="primary"
                                                icon={<DownloadOutlined />}
                                                size="large"
                                                block
                                                onClick={handleDownload}
                                            >
                                                下载图片
                                            </Button>
                                        </div>
                                    </div>
                                )}
                            </Card>
                        </Col>
                    </>
                )}
            </Row>
        </div>
    );
};

export default ImageBase64;
