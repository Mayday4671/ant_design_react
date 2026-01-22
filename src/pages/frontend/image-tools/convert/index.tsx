import React, { useState, useRef } from 'react';
import { Upload, Button, Row, Col, Typography, Radio, Space, Slider, Card } from 'antd';
import { InboxOutlined, DownloadOutlined, RedoOutlined, FileImageOutlined } from '@ant-design/icons';

const { Dragger } = Upload;
const { Title, Text } = Typography;

const ImageConvert: React.FC = () => {
    const [imgSrc, setImgSrc] = useState('');
    const [fileName, setFileName] = useState('');
    const [targetFormat, setTargetFormat] = useState<'png' | 'jpeg' | 'webp' | 'ico'>('png');
    const [quality, setQuality] = useState(0.92);
    const [convertedUrl, setConvertedUrl] = useState('');

    const imgRef = useRef<HTMLImageElement>(null);

    const onSelectFile = (file: File) => {
        setFileName(file.name.split('.')[0]);
        const reader = new FileReader();
        reader.addEventListener('load', () => {
            setImgSrc(reader.result?.toString() || '');
            setConvertedUrl('');
        });
        reader.readAsDataURL(file);
        return false;
    };

    const convertImage = () => {
        const img = imgRef.current;
        if (!img) return;

        const canvas = document.createElement('canvas');
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        ctx.fillStyle = '#FFFFFF'; // Fill white for potential transparent -> jpeg conversion
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);

        let mimeType = `image/${targetFormat}`;
        if (targetFormat === 'ico') mimeType = 'image/x-icon'; // Browsers might fall back to png usually, acts as simple rename often or needs scaling. 
        // For simplicity in client-side, ICO is often just a rename or low-res PNG. Real ICO requires specific binary format.
        // We will fallback to PNG for ICO visually but name it .ico for user convenience, or force PNG mime.
        // Actually browser canvas.toDataURL supports 'image/vnd.microsoft.icon' in some browsers, but mostly 'image/webp', 'image/png', 'image/jpeg'.

        if (targetFormat === 'ico') {
            // simple fallback: resize to 256x256 for icon-ish behavior
            const iconCanvas = document.createElement('canvas');
            iconCanvas.width = 256;
            iconCanvas.height = 256;
            const iconCtx = iconCanvas.getContext('2d');
            if (iconCtx) iconCtx.drawImage(img, 0, 0, 256, 256);
            setConvertedUrl(iconCanvas.toDataURL('image/png')); // Export as png, download as ico
        } else {
            setConvertedUrl(canvas.toDataURL(mimeType, quality));
        }
    };

    return (
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: 32 }}>
                <Title level={2}>图片格式转换</Title>
                <Text type="secondary">
                    支持 PNG, JPG, WebP, ICON 格式互转。
                </Text>
            </div>

            <Row gutter={[48, 24]}>
                <Col xs={24} lg={12}>
                    <Card title="1. 上传图片" bordered={false} bodyStyle={{ minHeight: 400 }}>
                        {!imgSrc ? (
                            <Dragger
                                accept="image/*"
                                showUploadList={false}
                                beforeUpload={onSelectFile}
                                style={{
                                    padding: '48px 0',
                                    background: 'transparent',
                                    border: '2px dashed var(--color-border)',
                                    borderRadius: 8
                                }}
                            >
                                <p className="ant-upload-drag-icon">
                                    <InboxOutlined style={{ color: '#1677ff', fontSize: 48 }} />
                                </p>
                                <p className="ant-upload-text">点击或拖拽图片到此处</p>
                            </Dragger>
                        ) : (
                            <div style={{
                                border: '1px solid var(--color-border)',
                                padding: 16,
                                borderRadius: 8,
                                background: 'rgba(0,0,0,0.02)',
                                textAlign: 'center'
                            }}>
                                <img
                                    ref={imgRef}
                                    src={imgSrc}
                                    style={{ maxWidth: '100%', maxHeight: 300, objectFit: 'contain' }}
                                    onLoad={convertImage} // Auto convert initial
                                />
                                <div style={{ marginTop: 16 }}>
                                    <Button onClick={() => setImgSrc('')} icon={<RedoOutlined />}>重新上传</Button>
                                </div>
                            </div>
                        )}
                    </Card>
                </Col>

                <Col xs={24} lg={12}>
                    <Card title="2. 转换设置" bordered={false} bodyStyle={{ minHeight: 400 }}>
                        <div style={{ padding: 24, background: 'var(--color-bg-layout)', borderRadius: 8 }}>
                            <Space direction="vertical" size="large" style={{ width: '100%' }}>
                                <div>
                                    <Text strong>目标格式</Text>
                                    <div style={{ marginTop: 8 }}>
                                        <Radio.Group
                                            value={targetFormat}
                                            onChange={e => {
                                                setTargetFormat(e.target.value);
                                                setTimeout(convertImage, 100);
                                            }}
                                            buttonStyle="solid"
                                        >
                                            <Radio.Button value="png">PNG</Radio.Button>
                                            <Radio.Button value="jpeg">JPG</Radio.Button>
                                            <Radio.Button value="webp">WebP</Radio.Button>
                                            <Radio.Button value="ico">ICON</Radio.Button>
                                        </Radio.Group>
                                    </div>
                                </div>

                                {(targetFormat === 'jpeg' || targetFormat === 'webp') && (
                                    <div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <Text>质量</Text>
                                            <Text>{Math.round(quality * 100)}%</Text>
                                        </div>
                                        <Slider
                                            min={0.1}
                                            max={1}
                                            step={0.01}
                                            value={quality}
                                            onChange={v => {
                                                setQuality(v);
                                                setTimeout(convertImage, 100); // debounce slightly in real app
                                            }}
                                        />
                                    </div>
                                )}

                                <Button
                                    type="primary"
                                    icon={<DownloadOutlined />}
                                    size="large"
                                    href={convertedUrl}
                                    download={`${fileName}_converted.${targetFormat === 'jpeg' ? 'jpg' : targetFormat}`}
                                    disabled={!convertedUrl}
                                    block
                                >
                                    下载 {targetFormat.toUpperCase()}
                                </Button>
                            </Space>
                        </div>
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default ImageConvert;
