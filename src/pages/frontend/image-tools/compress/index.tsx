import React, { useState, useEffect } from 'react';
import { Upload, Slider, Button, Row, Col, Descriptions, message, Spin, Alert, Typography, Card } from 'antd';
import { InboxOutlined, DownloadOutlined, ArrowRightOutlined } from '@ant-design/icons';
import imageCompression from 'browser-image-compression';

const { Dragger } = Upload;
const { Title, Text } = Typography;

const ImageCompress: React.FC = () => {
    const [originalFile, setOriginalFile] = useState<File | null>(null);
    const [compressedFile, setCompressedFile] = useState<File | null>(null);
    const [isCompressing, setIsCompressing] = useState(false);
    const [compressionRate, setCompressionRate] = useState<number>(0);

    // Compression Options
    const [maxSizeMB, setMaxSizeMB] = useState<number>(1);

    const handleUpload = (file: File) => {
        setOriginalFile(file);
        setCompressedFile(null);
        handleCompress(file, maxSizeMB);
        return false; // Prevent auto upload
    };

    const handleCompress = async (file: File, targetSize: number) => {
        setIsCompressing(true);
        try {
            const options = {
                maxSizeMB: targetSize,
                maxWidthOrHeight: 1920,
                useWebWorker: true,
                initialQuality: 0.8, // Start with high quality
            };

            const compressedBlob = await imageCompression(file, options);
            const compressed = new File([compressedBlob], file.name, {
                type: file.type,
                lastModified: Date.now(),
            });

            setCompressedFile(compressed);

            // Calculate saving
            const saving = ((file.size - compressed.size) / file.size) * 100;
            setCompressionRate(Math.max(0, saving));

        } catch (error) {
            console.error('Compression failed:', error);
            message.error('压缩失败，请重试');
        } finally {
            setIsCompressing(false);
        }
    };

    // Re-compress when options change
    useEffect(() => {
        if (originalFile) {
            const timer = setTimeout(() => {
                handleCompress(originalFile, maxSizeMB);
            }, 500); // Debounce
            return () => clearTimeout(timer);
        }
    }, [maxSizeMB]);

    const formatSize = (bytes: number) => {
        if (bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const handleDownload = () => {
        if (!compressedFile) return;
        const url = URL.createObjectURL(compressedFile);
        const link = document.createElement('a');
        link.href = url;
        link.download = `compressed_${originalFile?.name}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    return (
        <div style={{ maxWidth: 1200, margin: '24px auto', padding: '0 24px' }}>
            <div style={{ textAlign: 'center', marginBottom: 48 }}>
                <Title level={2}>在线图片压缩</Title>
                <Text type="secondary">
                    纯前端本地压缩，您的图片不会上传到服务器，安全、快速、高效。
                </Text>
            </div>

            <Row gutter={24}>
                <Col xs={24} lg={10}>
                    <Card title="1. 上传图片" bordered={true} bodyStyle={{ padding: 24, minHeight: 400 }}>
                        <Dragger
                            accept="image/*"
                            showUploadList={false}
                            beforeUpload={handleUpload}
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
                            <p className="ant-upload-hint" style={{ color: 'var(--color-text-tertiary)' }}>
                                支持 JPG, PNG, WebP 等常见格式
                            </p>
                        </Dragger>

                        {originalFile && (
                            <div style={{ marginTop: 24 }}>
                                <Descriptions title="原始文件信息" column={1} size="small" bordered>
                                    <Descriptions.Item label="文件名">{originalFile.name}</Descriptions.Item>
                                    <Descriptions.Item label="原始大小">{formatSize(originalFile.size)}</Descriptions.Item>
                                    <Descriptions.Item label="类型">{originalFile.type}</Descriptions.Item>
                                </Descriptions>
                            </div>
                        )}
                    </Card>
                </Col>

                <Col xs={24} lg={14}>
                    <Card title="2. 压缩设置与预览" bordered={true} bodyStyle={{ padding: 24, minHeight: 400 }} extra={originalFile && <Text type="success" strong>已节省 {compressionRate.toFixed(1)}%</Text>}>
                        {!originalFile ? (
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                height: 300,
                                background: 'var(--color-bg-layout)',
                                borderRadius: 12,
                                color: 'var(--color-text-tertiary)',
                                flexDirection: 'column',
                                gap: 16
                            }}>
                                <InboxOutlined style={{ fontSize: 48, opacity: 0.2 }} />
                                <div>请先在左侧上传图片</div>
                            </div>
                        ) : (
                            <>
                                <div style={{ marginBottom: 32, padding: '0 12px' }}>
                                    <Text strong>目标大小限制 (MB)</Text>
                                    <Slider
                                        min={0.1}
                                        max={5}
                                        step={0.1}
                                        value={maxSizeMB}
                                        onChange={setMaxSizeMB}
                                        marks={{ 0.1: '0.1M', 1: '1M', 2: '2M', 5: '5M' }}
                                    />
                                    <div style={{ marginTop: 12 }}>
                                        <Alert
                                            message="提示：设置的值越小，压缩率越高，画质可能越低。"
                                            type="info"
                                            showIcon
                                        />
                                    </div>
                                </div>

                                <div style={{
                                    background: 'var(--color-bg-layout)',
                                    borderRadius: 12,
                                    padding: 24,
                                    border: '1px solid var(--color-border-secondary)'
                                }}>
                                    <Spin spinning={isCompressing} tip="压缩中...">
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0 32px' }}>
                                            <div style={{ textAlign: 'center' }}>
                                                <Text type="secondary">原始大小</Text>
                                                <div style={{ fontSize: 24, fontWeight: 'bold' }}>
                                                    {formatSize(originalFile.size)}
                                                </div>
                                            </div>

                                            <ArrowRightOutlined style={{ fontSize: 24, color: '#1677ff', opacity: 0.5 }} />

                                            <div style={{ textAlign: 'center' }}>
                                                <Text type="secondary">压缩后</Text>
                                                <div style={{ fontSize: 24, fontWeight: 'bold', color: '#52c41a' }}>
                                                    {compressedFile ? formatSize(compressedFile.size) : '-'}
                                                </div>
                                            </div>
                                        </div>

                                        <div style={{ textAlign: 'center' }}>
                                            {compressedFile && (
                                                <Button
                                                    type="primary"
                                                    icon={<DownloadOutlined />}
                                                    size="large"
                                                    onClick={handleDownload}
                                                    style={{ height: 48, padding: '0 40px', fontSize: 16 }}
                                                >
                                                    下载压缩后的图片
                                                </Button>
                                            )}
                                        </div>
                                    </Spin>
                                </div>
                            </>
                        )}
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default ImageCompress;
