import React, { useState, useRef, useEffect } from 'react';
import { Upload, Button, Row, Col, Typography, Input, Slider, ColorPicker, Space, Card } from 'antd';
import { InboxOutlined, DownloadOutlined, RedoOutlined } from '@ant-design/icons';
// @ts-expect-error ColorPicker type
import type { Color } from 'antd/es/color-picker';

const { Dragger } = Upload;
const { Title, Text } = Typography;

const ImageWatermark: React.FC = () => {
    const [imgSrc, setImgSrc] = useState('');
    const [text, setText] = useState('My Watermark');
    const [fontSize, setFontSize] = useState(40);
    const [opacity, setOpacity] = useState(0.5);
    const [color, setColor] = useState('#ffffff');
    const [angle, setAngle] = useState(-30);
    const [gap, setGap] = useState(200);

    const imgRef = useRef<HTMLImageElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const onSelectFile = (file: File) => {
        const reader = new FileReader();
        reader.addEventListener('load', () => setImgSrc(reader.result?.toString() || ''));
        reader.readAsDataURL(file);
        return false;
    };

    const drawWatermark = () => {
        const canvas = canvasRef.current;
        const img = imgRef.current;
        if (!canvas || !img) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;

        // Draw Original
        ctx.drawImage(img, 0, 0);

        // Draw Watermarks (Tiled)
        ctx.save();
        ctx.font = `${fontSize}px Arial`;
        ctx.fillStyle = color;
        ctx.globalAlpha = opacity;

        // simple tiling logic: rotate canvas, draw grid
        // Simpler approach for demo: just draw repeated text over the image
        // To handle rotation properly, we might rotate context but tiling is tricky.
        // Let's implement a centered single watermark first, OR a grid. Grid is popular.

        const diag = Math.sqrt(canvas.width ** 2 + canvas.height ** 2);
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate((angle * Math.PI) / 180);
        ctx.translate(-diag / 2, -diag / 2); // Move to corner of a large conceptual grid covering rotation

        const step = gap + fontSize * text.length * 0.5;
        for (let y = 0; y < diag; y += gap) {
            for (let x = 0; x < diag; x += step) {
                ctx.fillText(text, x, y);
            }
        }

        ctx.restore();
    };

    useEffect(() => {
        if (imgSrc) {
            // small delay to ensure image loaded in hidden img tag if needed, but onLoad handles it.
            // here we trigger re-draw on param change
            drawWatermark();
        }
    }, [text, fontSize, opacity, color, angle, gap]);

    const handleDownload = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const link = document.createElement('a');
        link.download = 'watermark.png';
        link.href = canvas.toDataURL('image/png');
        link.click();
    };

    return (
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: 32 }}>
                <Title level={2}>图片加水印</Title>
                <Text type="secondary">
                    添加自定义文字水印，保护您的图片版权。
                </Text>
            </div>

            <Row gutter={24}>
                <Col xs={24} lg={8}>
                    <Card title="1. 水印设置" bordered={true} style={{ height: '100%' }} bodyStyle={{ padding: 24, minHeight: 400 }}>
                        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                            <div>
                                <Text>水印文字</Text>
                                <Input value={text} onChange={e => setText(e.target.value)} style={{ marginTop: 8 }} />
                            </div>

                            <div>
                                <Text>字体大小: {fontSize}px</Text>
                                <Slider min={12} max={100} value={fontSize} onChange={setFontSize} />
                            </div>

                            <div>
                                <Text>透明度: {opacity}</Text>
                                <Slider min={0} max={1} step={0.1} value={opacity} onChange={setOpacity} />
                            </div>

                            <div>
                                <Text>颜色</Text>
                                <br />
                                <div style={{ marginTop: 8 }}>
                                    <ColorPicker value={color} onChange={(_, hex) => setColor(hex)} showText />
                                </div>
                            </div>

                            <div>
                                <Text>旋转角度: {angle}°</Text>
                                <Slider min={-180} max={180} value={angle} onChange={setAngle} />
                            </div>

                            <div>
                                <Text>间距: {gap}px</Text>
                                <Slider min={50} max={500} value={gap} onChange={setGap} />
                            </div>
                        </Space>

                        {imgSrc && (
                            <div style={{ marginTop: 32 }}>
                                <Button
                                    type="primary"
                                    icon={<DownloadOutlined />}
                                    size="large"
                                    onClick={handleDownload}
                                    style={{ height: 48, fontSize: 16 }}
                                    block
                                >
                                    下载水印图片
                                </Button>
                            </div>
                        )}
                    </Card>
                </Col>

                <Col xs={24} lg={16}>
                    <Card title="2. 预览" bordered={true} style={{ height: '100%' }} bodyStyle={{ padding: 24, minHeight: 600 }}>
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
                                overflow: 'auto',
                                position: 'relative'
                            }}>
                                {/* Hidden source image */}
                                <img
                                    ref={imgRef}
                                    src={imgSrc}
                                    style={{ display: 'none' }}
                                    onLoad={drawWatermark}
                                />
                                <canvas
                                    ref={canvasRef}
                                    style={{ maxWidth: '100%', height: 'auto', border: '1px solid #ddd', borderRadius: 4, background: '#fff' }}
                                />
                                <div style={{ marginTop: 24 }}>
                                    <Button onClick={() => setImgSrc('')} icon={<RedoOutlined />} size="middle">重新上传</Button>
                                </div>
                            </div>
                        )}
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default ImageWatermark;
