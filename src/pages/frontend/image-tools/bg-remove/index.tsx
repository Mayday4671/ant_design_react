import React, { useState, useRef, useEffect } from 'react';
import { Upload, Button, Row, Col, Typography, Card, Space, Slider, InputNumber, Switch, Tooltip } from 'antd';
import { InboxOutlined, DownloadOutlined, BgColorsOutlined, RedoOutlined, UndoOutlined } from '@ant-design/icons';
import { message } from 'antd';

const { Dragger } = Upload;
const { Title, Text } = Typography;

const ImageBgRemove: React.FC = () => {
    const [imgSrc, setImgSrc] = useState('');
    const [processedImgSrc, setProcessedImgSrc] = useState('');
    const [tolerance, setTolerance] = useState(20);
    const [pickingColor, setPickingColor] = useState(false);
    const [targetColor, setTargetColor] = useState<{ r: number, g: number, b: number } | null>(null);
    const [isOriginal, setIsOriginal] = useState(false); // Toggle to compare

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const imgRef = useRef<HTMLImageElement>(null);

    const onSelectFile = (file: File) => {
        const reader = new FileReader();
        reader.addEventListener('load', () => {
            setImgSrc(reader.result?.toString() || '');
            setProcessedImgSrc('');
            setTargetColor(null);
        });
        reader.readAsDataURL(file);
        return false;
    };

    const reset = () => {
        setImgSrc('');
        setProcessedImgSrc('');
        setTargetColor(null);
    };

    useEffect(() => {
        if (imgSrc && imgRef.current) {
            // Initial draw or reset
            processImage();
        }
    }, [imgSrc, targetColor, tolerance]);

    const processImage = () => {
        if (!imgRef.current || !targetColor) {
            setProcessedImgSrc('');
            return;
        }

        const img = imgRef.current;
        const canvas = document.createElement('canvas');
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        ctx.drawImage(img, 0, 0);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        const { r: tr, g: tg, b: tb } = targetColor;
        const tol = tolerance;

        for (let i = 0; i < data.length; i += 4) {
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];
            // alpha is data[i+3]

            // Improved distance calculation (can use Euclidean or simple Manhattan)
            // Using simple absolute diff sum for speed
            if (
                Math.abs(r - tr) <= tol &&
                Math.abs(g - tg) <= tol &&
                Math.abs(b - tb) <= tol
            ) {
                data[i + 3] = 0; // Transparent
            }
        }

        ctx.putImageData(imageData, 0, 0);
        setProcessedImgSrc(canvas.toDataURL('image/png'));
    };

    const handleImageClick = (e: React.MouseEvent<HTMLImageElement>) => {
        if (!pickingColor || !imgRef.current) return;

        const img = imgRef.current;
        const rect = img.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // Map to natural dimensions
        const scaleX = img.naturalWidth / img.clientWidth;
        const scaleY = img.naturalHeight / img.clientHeight;
        const realX = Math.floor(x * scaleX);
        const realY = Math.floor(y * scaleY);

        const canvas = document.createElement('canvas');
        canvas.width = 1;
        canvas.height = 1;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        ctx.drawImage(img, realX, realY, 1, 1, 0, 0, 1, 1);
        const pixel = ctx.getImageData(0, 0, 1, 1).data;

        setTargetColor({ r: pixel[0], g: pixel[1], b: pixel[2] });
        setPickingColor(false);
        message.success('已选择颜色，正在去除...');
    };

    const downloadImage = () => {
        if (!processedImgSrc) return;
        const link = document.createElement('a');
        link.download = 'removed_bg.png';
        link.href = processedImgSrc;
        link.click();
    };

    return (
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: 32 }}>
                <Title level={2}>一键抠图 (颜色去除)</Title>
                <Text type="secondary">
                    点击图片中的颜色进行去除，支持调节容差范围。纯客户端处理，保护隐私。
                </Text>
            </div>

            <Row gutter={24}>
                <Col xs={24} lg={16}>
                    <Card
                        title="工作区"
                        bordered={true}
                        extra={
                            <Space>
                                <Switch
                                    checkedChildren="原图"
                                    unCheckedChildren="处理后"
                                    checked={isOriginal}
                                    onChange={setIsOriginal}
                                    disabled={!processedImgSrc}
                                />
                            </Space>
                        }
                        style={{ height: '100%' }}
                        bodyStyle={{ padding: 24, minHeight: 500, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAMUlEQVQ4T2nk5+d/YgYBAZgYIAX////3n6iY0ECkY1CACWokD4z6gNGAAWqgIAwM5wAA+j0s0s/R1zQAAAAASUVORK5CYII=)' }}
                    >
                        {!imgSrc ? (
                            <div style={{ width: '100%', background: 'var(--color-bg-container)', borderRadius: 12 }}>
                                <Dragger
                                    accept="image/*"
                                    showUploadList={false}
                                    beforeUpload={onSelectFile}
                                    style={{ padding: '60px 0', border: 'none' }}
                                >
                                    <p className="ant-upload-drag-icon">
                                        <InboxOutlined style={{ color: '#1677ff', fontSize: 64 }} />
                                    </p>
                                    <p className="ant-upload-text">点击或拖拽图片到此处</p>
                                </Dragger>
                            </div>
                        ) : (
                            <div style={{ position: 'relative', maxWidth: '100%', maxHeight: 600 }}>
                                <img
                                    ref={imgRef}
                                    src={isOriginal || !processedImgSrc ? imgSrc : processedImgSrc}
                                    style={{
                                        maxWidth: '100%',
                                        maxHeight: 500,
                                        display: 'block',
                                        cursor: pickingColor ? 'crosshair' : 'default',
                                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                                    }}
                                    onClick={handleImageClick}
                                    crossOrigin="anonymous"
                                />
                                {pickingColor && (
                                    <div style={{
                                        position: 'absolute',
                                        top: 10,
                                        left: '50%',
                                        transform: 'translateX(-50%)',
                                        background: 'rgba(0,0,0,0.7)',
                                        color: '#fff',
                                        padding: '4px 12px',
                                        borderRadius: 20,
                                        pointerEvents: 'none'
                                    }}>
                                        请点击图片中需要去除的颜色
                                    </div>
                                )}
                            </div>
                        )}
                    </Card>
                </Col>

                <Col xs={24} lg={8}>
                    <Card title="工具箱" bordered={true} style={{ height: '100%' }}>
                        <Space direction="vertical" style={{ width: '100%' }} size="large">
                            <div>
                                <Text strong>1. 选择颜色</Text>
                                <Button
                                    type={pickingColor ? "primary" : "default"}
                                    block
                                    icon={<BgColorsOutlined />}
                                    style={{ marginTop: 8 }}
                                    onClick={() => setPickingColor(!pickingColor)}
                                    disabled={!imgSrc}
                                >
                                    {pickingColor ? '正在取色...' : '点击取色'}
                                </Button>
                                <Text type="secondary" style={{ fontSize: 12, display: 'block', marginTop: 4 }}>
                                    点击按钮后，在左侧图片上点击要去除的背景色。
                                </Text>
                            </div>

                            <div>
                                <Text strong>2. 调整容差: {tolerance}</Text>
                                <Slider
                                    min={0}
                                    max={100}
                                    value={tolerance}
                                    onChange={setTolerance}
                                    disabled={!targetColor}
                                />
                                <Text type="secondary" style={{ fontSize: 12 }}>
                                    值越大，去除的相似颜色范围越广。
                                </Text>
                            </div>

                            <div style={{ paddingTop: 24, borderTop: '1px solid var(--color-border)' }}>
                                <Button
                                    type="primary"
                                    size="large"
                                    block
                                    icon={<DownloadOutlined />}
                                    onClick={downloadImage}
                                    disabled={!processedImgSrc}
                                >
                                    下载 PNG
                                </Button>
                                <Button
                                    block
                                    style={{ marginTop: 12 }}
                                    icon={<RedoOutlined />}
                                    onClick={reset}
                                >
                                    重新开始
                                </Button>
                            </div>
                        </Space>
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default ImageBgRemove;
