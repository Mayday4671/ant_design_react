import React, { useState, useRef } from 'react';
import { Upload, Button, Row, Col, Typography, Card, Space, InputNumber } from 'antd';
import { InboxOutlined, DownloadOutlined, AppstoreOutlined, RedoOutlined } from '@ant-design/icons';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

const { Dragger } = Upload;
const { Title, Text } = Typography;

const ImageGridCrop: React.FC = () => {
    const [imgSrc, setImgSrc] = useState('');
    const [gridRows, setGridRows] = useState(3);
    const [gridCols, setGridCols] = useState(3);
    const [generating, setGenerating] = useState(false);

    // Canvas ref for processing
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const imgRef = useRef<HTMLImageElement>(null);
    const [previewBlobs, setPreviewBlobs] = useState<string[]>([]);

    const onSelectFile = (file: File) => {
        const reader = new FileReader();
        reader.addEventListener('load', () => {
            setImgSrc(reader.result?.toString() || '');
            setPreviewBlobs([]);
        });
        reader.readAsDataURL(file);
        return false;
    };

    const reset = () => {
        setImgSrc('');
        setPreviewBlobs([]);
    };

    const generateGrid = async () => {
        if (!imgRef.current) return;
        setGenerating(true);

        const img = imgRef.current;
        const width = img.naturalWidth;
        const height = img.naturalHeight;

        const pieceWidth = width / gridCols;
        const pieceHeight = height / gridRows;

        const newBlobs: string[] = [];
        const zip = new JSZip();

        // Canvas for processing
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Process grid
        for (let r = 0; r < gridRows; r++) {
            for (let c = 0; c < gridCols; c++) {
                // Determine crop dimensions
                // If isSquare is true, we might need more complex logic to actually "crop" 
                // but usually "Grid Crop" means slicing the existing image. 
                // "Social Media 9-Grid" usually implies the original image fits a certain ratio or we slice what is there.
                // Let's stick to slicing "what is there" for now, maybe add aspect ratio later.

                canvas.width = pieceWidth;
                canvas.height = pieceHeight;

                ctx.drawImage(
                    img,
                    c * pieceWidth, r * pieceHeight, pieceWidth, pieceHeight, // Source
                    0, 0, pieceWidth, pieceHeight // Dest
                );

                const blob = await new Promise<Blob | null>(resolve => canvas.toBlob(resolve, 'image/jpeg'));
                if (blob) {
                    const url = URL.createObjectURL(blob);
                    newBlobs.push(url);
                    // Add to zip
                    zip.file(`slice_${r + 1}_${c + 1}.jpg`, blob);
                }
            }
        }

        setPreviewBlobs(newBlobs);
        setGenerating(false);

        // Auto download zip? Or just show preview and let user download?
        // Let's just generate the zip object but wait for user to click "Download Zip"
        // Actually, to make it simple, let's just create the preview first.

        // We'll regenerate zip on download click to avoid holding raw data in memory if not needed immediately
    };

    const downloadZip = async () => {
        if (previewBlobs.length === 0) return;
        setGenerating(true);
        const zip = new JSZip();

        // Re-fetch blobs from object URLs (efficient enough for client side small number of images)
        for (let i = 0; i < previewBlobs.length; i++) {
            const response = await fetch(previewBlobs[i]);
            const blob = await response.blob();
            zip.file(`slice_${i + 1}.jpg`, blob);
        }

        const content = await zip.generateAsync({ type: 'blob' });
        saveAs(content, 'grid_crop_images.zip');
        setGenerating(false);
    };

    return (
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: 32 }}>
                <Title level={2}>九宫格切图</Title>
                <Text type="secondary">
                    将一张图片切割成 3x3 (或自定义) 的网格拼图，支持一键打包下载。
                </Text>
            </div>

            <Row gutter={24}>
                <Col xs={24} lg={12}>
                    <Card title="1. 上传与设置" bordered={true} style={{ height: '100%' }} bodyStyle={{ padding: 24, minHeight: 500, display: 'flex', flexDirection: 'column' }}>
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
                                    flex: 1
                                }}
                            >
                                <p className="ant-upload-drag-icon">
                                    <InboxOutlined style={{ color: '#1677ff', fontSize: 64 }} />
                                </p>
                                <p className="ant-upload-text" style={{ fontSize: 16 }}>点击或拖拽图片到此处</p>
                            </Dragger>
                        ) : (
                            <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                                <div style={{
                                    border: '1px solid var(--color-border)',
                                    borderRadius: 12,
                                    padding: 16,
                                    background: 'var(--color-bg-layout)',
                                    textAlign: 'center',
                                    marginBottom: 24,
                                    position: 'relative'
                                }}>
                                    <img
                                        ref={imgRef}
                                        src={imgSrc}
                                        style={{ maxWidth: '100%', maxHeight: 300, objectFit: 'contain' }}
                                        onLoad={() => {
                                            // Auto generate preview on load?
                                        }}
                                    />
                                    {/* Optional: Overlay grid lines on top of this preview? */}
                                </div>

                                <Space direction="vertical" style={{ width: '100%' }}>
                                    <div>
                                        <Text>切分行数:</Text>
                                        <InputNumber min={1} max={10} value={gridRows} onChange={v => setGridRows(v || 3)} style={{ width: '100%', marginTop: 8 }} />
                                    </div>
                                    <div>
                                        <Text>切分列数:</Text>
                                        <InputNumber min={1} max={10} value={gridCols} onChange={v => setGridCols(v || 3)} style={{ width: '100%', marginTop: 8 }} />
                                    </div>

                                    <div style={{ marginTop: 16, display: 'flex', gap: 16 }}>
                                        <Button onClick={reset} icon={<RedoOutlined />}>重新上传</Button>
                                        <Button type="primary" onClick={generateGrid} loading={generating} icon={<AppstoreOutlined />}>生成切片</Button>
                                    </div>
                                </Space>
                            </div>
                        )}
                    </Card>
                </Col>

                <Col xs={24} lg={12}>
                    <Card title="2. 预览与下载" bordered={true} style={{ height: '100%' }} bodyStyle={{ padding: 24, minHeight: 500, display: 'flex', flexDirection: 'column' }}>
                        {previewBlobs.length > 0 ? (
                            <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                                <div style={{
                                    display: 'grid',
                                    gridTemplateColumns: `repeat(${gridCols}, 1fr)`,
                                    gap: 2,
                                    background: 'var(--color-border)',
                                    border: '1px solid var(--color-border)',
                                    marginBottom: 24
                                }}>
                                    {previewBlobs.map((blob, idx) => (
                                        <img key={idx} src={blob} style={{ width: '100%', display: 'block' }} />
                                    ))}
                                </div>
                                <div style={{ marginTop: 'auto' }}>
                                    <Button
                                        type="primary"
                                        size="large"
                                        block
                                        icon={<DownloadOutlined />}
                                        onClick={downloadZip}
                                        loading={generating}
                                    >
                                        打包下载 (ZIP)
                                    </Button>
                                </div>
                            </div>
                        ) : (
                            <div style={{
                                flex: 1,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexDirection: 'column',
                                color: 'var(--color-text-tertiary)'
                            }}>
                                <AppstoreOutlined style={{ fontSize: 48, marginBottom: 16, opacity: 0.2 }} />
                                <div>请先点击“生成切片”</div>
                            </div>
                        )}
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default ImageGridCrop;
