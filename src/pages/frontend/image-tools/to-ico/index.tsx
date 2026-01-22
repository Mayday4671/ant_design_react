import React, { useState, useRef } from 'react';
import { Upload, Button, Row, Col, Typography, Card, Checkbox, message, Spin } from 'antd';
import { InboxOutlined, DownloadOutlined, RedoOutlined, FileImageOutlined } from '@ant-design/icons';
import type { CheckboxValueType } from 'antd/es/checkbox/Group';

const { Dragger } = Upload;
const { Title, Text } = Typography;

const AVAILABLE_SIZES = [16, 32, 48, 64, 128, 256];

const ImageToIco: React.FC = () => {
    const [imgSrc, setImgSrc] = useState('');
    const [selectedSizes, setSelectedSizes] = useState<CheckboxValueType[]>([16, 32, 48, 64]);
    const [loading, setLoading] = useState(false);
    const [generating, setGenerating] = useState(false);
    const imgRef = useRef<HTMLImageElement>(null);

    const onSelectFile = (file: File) => {
        setLoading(true);
        const reader = new FileReader();
        reader.addEventListener('load', () => {
            setImgSrc(reader.result?.toString() || '');
            setLoading(false);
        });
        reader.readAsDataURL(file);
        return false;
    };

    const reset = () => {
        setImgSrc('');
        setLoading(false);
    };

    // ICO Generation Helper
    const generateIco = async () => {
        if (!imgSrc || selectedSizes.length === 0) return;
        setGenerating(true);

        try {
            const blobs: { width: number; height: number; blob: Blob }[] = [];

            // 1. Generate PNG blobs for each size
            for (const size of selectedSizes) {
                const s = Number(size);
                const canvas = document.createElement('canvas');
                canvas.width = s;
                canvas.height = s;
                const ctx = canvas.getContext('2d');
                if (!ctx || !imgRef.current) continue;

                ctx.drawImage(imgRef.current, 0, 0, s, s);

                const blob = await new Promise<Blob | null>(resolve => canvas.toBlob(resolve, 'image/png'));
                if (blob) {
                    blobs.push({ width: s, height: s, blob });
                }
            }

            // 2. Construct ICO file
            // Header (6 bytes) + Directory (16 bytes * count) + Images data
            const count = blobs.length;
            const headerSize = 6;
            const directorySize = 16 * count;
            const offsetStart = headerSize + directorySize;

            let currentOffset = offsetStart;
            const directoryBuffer = new Uint8Array(directorySize);
            const headerBuffer = new Uint8Array(headerSize);
            const imageBuffers: ArrayBuffer[] = [];

            // Write Header
            const headerView = new DataView(headerBuffer.buffer);
            headerView.setUint16(0, 0, true); // Reserved
            headerView.setUint16(2, 1, true); // Type (1 = ICO)
            headerView.setUint16(4, count, true); // Count

            // Write Directory & Collect Image Data
            for (let i = 0; i < count; i++) {
                const { width, height, blob } = blobs[i];
                const arrayBuffer = await blob.arrayBuffer();
                imageBuffers.push(arrayBuffer);
                const size = arrayBuffer.byteLength;

                const view = new DataView(directoryBuffer.buffer, i * 16, 16);
                view.setUint8(0, width >= 256 ? 0 : width);
                view.setUint8(1, height >= 256 ? 0 : height);
                view.setUint8(2, 0); // Palette count (0 for no palette)
                view.setUint8(3, 0); // Reserved
                view.setUint16(4, 1, true); // Color planes
                view.setUint16(6, 32, true); // Bits per pixel
                view.setUint32(8, size, true); // Image size
                view.setUint32(12, currentOffset, true); // Image offset

                currentOffset += size;
            }

            // Combine all parts
            const finalBlob = new Blob([headerBuffer, directoryBuffer, ...imageBuffers], { type: 'image/x-icon' });

            // Download
            const link = document.createElement('a');
            link.download = 'favicon.ico';
            link.href = URL.createObjectURL(finalBlob);
            link.click();
            URL.revokeObjectURL(link.href);

            message.success('ICO 图标生成成功！');
        } catch (error) {
            console.error(error);
            message.error('生成失败，请重试');
        } finally {
            setGenerating(false);
        }
    };

    return (
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: 32 }}>
                <Title level={2}>图片转 ICO 图标</Title>
                <Text type="secondary">
                    将图片转换为网站 Favicon 图标，支持包含多种尺寸。
                </Text>
            </div>

            <Row gutter={24}>
                <Col xs={24} lg={10}>
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
                                <p className="ant-upload-hint" style={{ color: 'var(--color-text-tertiary)' }}>
                                    建议上传正方形图片 (PNG/JPG)
                                </p>
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
                                    ref={imgRef}
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
                <Col xs={24} lg={14}>
                    <Card title="2. 生成设置" bordered={true} style={{ height: '100%' }} bodyStyle={{ padding: 24, minHeight: 400, display: 'flex', flexDirection: 'column' }}>
                        <div style={{ flex: 1 }}>
                            <Title level={5}>选择包含尺寸</Title>
                            <Text type="secondary">生成的 ICO 文件将包含以下选中的图标尺寸：</Text>
                            <div style={{ marginTop: 16, marginBottom: 32 }}>
                                <Checkbox.Group
                                    options={AVAILABLE_SIZES.map(s => ({ label: `${s}x${s}`, value: s }))}
                                    value={selectedSizes}
                                    onChange={setSelectedSizes}
                                    style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}
                                />
                            </div>

                            <div style={{ background: 'var(--color-bg-layout)', padding: 16, borderRadius: 8 }}>
                                <Text strong>什么是 ICO 格式？</Text>
                                <p style={{ marginTop: 8, color: 'var(--color-text-secondary)', fontSize: 13 }}>
                                    ICO 是 Windows 的图标文件格式，一个文件中可以包含多个不同尺寸的图片。
                                    浏览器会根据设备屏幕分辨率自动选择最清晰的尺寸显示。
                                    通常建议包含 16x16, 32x32, 48x48 等常用尺寸。
                                </p>
                            </div>
                        </div>

                        <div style={{ marginTop: 24 }}>
                            <Button
                                type="primary"
                                icon={<DownloadOutlined />}
                                size="large"
                                block
                                onClick={generateIco}
                                disabled={!imgSrc || selectedSizes.length === 0 || generating}
                                loading={generating}
                                style={{ height: 48, fontSize: 16 }}
                            >
                                {generating ? '生成中...' : '生成并下载 ICO'}
                            </Button>
                        </div>
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default ImageToIco;
