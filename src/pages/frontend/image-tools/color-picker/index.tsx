import React, { useState, useRef, useEffect } from 'react';
import { Upload, Button, Row, Col, Typography, Card, Space, message, Tooltip, Empty } from 'antd';
import { InboxOutlined, BgColorsOutlined, CopyOutlined, RedoOutlined } from '@ant-design/icons';

const { Dragger } = Upload;
const { Title, Text } = Typography;

// Helper to convert RGB to Hex
const rgbToHex = (r: number, g: number, b: number) => {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase();
};

// Helper to convert RGB to HSL
const rgbToHsl = (r: number, g: number, b: number) => {
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h = 0, s, l = (max + min) / 2;

    if (max === min) {
        h = s = 0; // achromatic
    } else {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }

    return {
        h: Math.round(h * 360),
        s: Math.round(s * 100),
        l: Math.round(l * 100)
    };
};

interface ColorInfo {
    hex: string;
    rgb: string;
    hsl: string;
}

const ImageColorPicker: React.FC = () => {
    const [imgSrc, setImgSrc] = useState('');
    const [pickedColor, setPickedColor] = useState<ColorInfo | null>(null);
    const [hoverColor, setHoverColor] = useState<string | null>(null);
    const [colorHistory, setColorHistory] = useState<ColorInfo[]>([]);

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const imgRef = useRef<HTMLImageElement>(null);

    // EyeDropper API support check
    // @ts-ignore
    const hasEyeDropper = typeof window !== 'undefined' && !!window.EyeDropper;

    const onSelectFile = (file: File) => {
        const reader = new FileReader();
        reader.addEventListener('load', () => {
            setImgSrc(reader.result?.toString() || '');
        });
        reader.readAsDataURL(file);
        return false;
    };

    const reset = () => {
        setImgSrc('');
        setPickedColor(null);
        setHoverColor(null);
    };

    // Draw image to canvas when loaded to enable pixel reading
    useEffect(() => {
        if (!imgSrc || !canvasRef.current || !imgRef.current) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        const img = imgRef.current;

        img.onload = () => {
            canvas.width = img.width;
            canvas.height = img.height;
            ctx?.drawImage(img, 0, 0);
        };
    }, [imgSrc]);

    const getColorAtPos = (x: number, y: number, naturalWidth: number, naturalHeight: number, clientWidth: number, clientHeight: number) => {
        if (!canvasRef.current) return null;
        const ctx = canvasRef.current.getContext('2d');
        if (!ctx) return null;

        // Calculate mapped coordinates
        const scaleX = naturalWidth / clientWidth;
        const scaleY = naturalHeight / clientHeight;
        const realX = Math.floor(x * scaleX);
        const realY = Math.floor(y * scaleY);

        // Get pixel data
        const pixel = ctx.getImageData(realX, realY, 1, 1).data;
        const r = pixel[0];
        const g = pixel[1];
        const b = pixel[2];
        // const a = pixel[3]; // Ignore alpha for now for hex

        const hex = rgbToHex(r, g, b);
        const hslObj = rgbToHsl(r, g, b);

        return {
            hex,
            rgb: `rgb(${r}, ${g}, ${b})`,
            hsl: `hsl(${hslObj.h}, ${hslObj.s}%, ${hslObj.l}%)`
        };
    };

    const handleMouseMove = (e: React.MouseEvent<HTMLImageElement>) => {
        if (!imgRef.current) return;
        const rect = imgRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const color = getColorAtPos(x, y, imgRef.current.naturalWidth, imgRef.current.naturalHeight, imgRef.current.clientWidth, imgRef.current.clientHeight);
        if (color) {
            setHoverColor(color.hex);
        }
    };

    const handleClick = (e: React.MouseEvent<HTMLImageElement>) => {
        if (!imgRef.current) return;
        const rect = imgRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const color = getColorAtPos(x, y, imgRef.current.naturalWidth, imgRef.current.naturalHeight, imgRef.current.clientWidth, imgRef.current.clientHeight);
        if (color) {
            setPickedColor(color);
            addToHistory(color);
        }
    };

    const addToHistory = (color: ColorInfo) => {
        setColorHistory(prev => {
            // Avoid duplicates at the top
            if (prev.length > 0 && prev[0].hex === color.hex) return prev;
            return [color, ...prev].slice(0, 10);
        });
    };

    const openEyeDropper = async () => {
        // @ts-ignore
        if (!window.EyeDropper) {
            message.error('您的浏览器不支持屏幕取色功能');
            return;
        }

        try {
            // @ts-ignore
            const eyeDropper = new window.EyeDropper();
            // @ts-ignore
            const result = await eyeDropper.open();
            const hex = result.sRGBHex;

            // Convert Hex to RGB to HSL manually since EyeDropper returns Hex
            // Simple parsing for now
            const r = parseInt(hex.slice(1, 3), 16);
            const g = parseInt(hex.slice(3, 5), 16);
            const b = parseInt(hex.slice(5, 7), 16);
            const hslObj = rgbToHsl(r, g, b);

            const color: ColorInfo = {
                hex: hex.toUpperCase(),
                rgb: `rgb(${r}, ${g}, ${b})`,
                hsl: `hsl(${hslObj.h}, ${hslObj.s}%, ${hslObj.l}%)`
            };

            setPickedColor(color);
            addToHistory(color);
        } catch (e) {
            console.log('EyeDropper closed', e);
        }
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        message.success(`已复制: ${text}`);
    };

    return (
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: 32 }}>
                <Title level={2}>图片颜色拾取</Title>
                <Text type="secondary">
                    从上传的图片中提取颜色，或使用屏幕取色器 (无需上传)。
                </Text>
            </div>

            <Row gutter={24}>
                <Col xs={24} lg={16}>
                    <Card title="1. 图片区域" bordered={true} style={{ height: '100%' }} bodyStyle={{ padding: 24, minHeight: 500, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                        {/* Hidden Canvas for processing */}
                        <canvas ref={canvasRef} style={{ display: 'none' }} />

                        {!imgSrc ? (
                            <div style={{ textAlign: 'center' }}>
                                <Dragger
                                    accept="image/*"
                                    showUploadList={false}
                                    beforeUpload={onSelectFile}
                                    style={{
                                        padding: '60px 0',
                                        background: 'var(--color-bg-layout)',
                                        borderRadius: 12,
                                        border: '2px dashed var(--color-border)',
                                        marginBottom: 24
                                    }}
                                >
                                    <p className="ant-upload-drag-icon">
                                        <InboxOutlined style={{ color: '#1677ff', fontSize: 64 }} />
                                    </p>
                                    <p className="ant-upload-text" style={{ fontSize: 16 }}>点击或拖拽图片到此处</p>
                                </Dragger>

                                {hasEyeDropper && (
                                    <>
                                        <div style={{ margin: '16px 0', color: 'var(--color-text-tertiary)' }}>- 或 -</div>
                                        <Button
                                            type="primary"
                                            icon={<BgColorsOutlined />}
                                            size="large"
                                            onClick={openEyeDropper}
                                        >
                                            直接使用屏幕取色 (无需图片)
                                        </Button>
                                    </>
                                )}
                            </div>
                        ) : (
                            <div style={{ position: 'relative', width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                <div style={{
                                    position: 'relative',
                                    border: '1px solid var(--color-border)',
                                    cursor: 'crosshair',
                                    maxWidth: '100%',
                                    display: 'inline-block'
                                }}>
                                    <img
                                        ref={imgRef}
                                        src={imgSrc}
                                        style={{ maxWidth: '100%', maxHeight: 500, display: 'block' }}
                                        onMouseMove={handleMouseMove}
                                        onMouseLeave={() => setHoverColor(null)}
                                        onClick={handleClick}
                                        alt="Color pick source"
                                        crossOrigin="anonymous"
                                    />
                                    {/* Magnifier logic could go here, but keeping it simple for now */}
                                </div>

                                <Space style={{ marginTop: 24 }}>
                                    <Button onClick={reset} icon={<RedoOutlined />}>重新上传</Button>
                                    {hasEyeDropper && <Button onClick={openEyeDropper} icon={<BgColorsOutlined />}>屏幕取色</Button>}
                                </Space>

                                {hoverColor && (
                                    <div style={{
                                        position: 'absolute',
                                        top: 10,
                                        right: 10,
                                        background: 'rgba(0,0,0,0.7)',
                                        color: '#fff',
                                        padding: '4px 8px',
                                        borderRadius: 4,
                                        pointerEvents: 'none',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 8
                                    }}>
                                        <div style={{ width: 16, height: 16, background: hoverColor, border: '1px solid #fff' }}></div>
                                        <span>{hoverColor}</span>
                                    </div>
                                )}
                            </div>
                        )}
                    </Card>
                </Col>

                <Col xs={24} lg={8}>
                    <Card title="2. 颜色信息" bordered={true} style={{ height: '100%' }} bodyStyle={{ padding: 24, minHeight: 500 }}>
                        {pickedColor ? (
                            <div style={{ animation: 'fadeIn 0.3s ease' }}>
                                {/* Current Color Big Preview */}
                                <div style={{
                                    width: '100%',
                                    height: 120,
                                    background: pickedColor.hex,
                                    borderRadius: 12,
                                    border: '1px solid var(--color-border)',
                                    marginBottom: 24,
                                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                                }}></div>

                                <div style={{ marginBottom: 24 }}>
                                    <Text type="secondary" style={{ display: 'block', marginBottom: 8 }}>HEX</Text>
                                    <div style={{ display: 'flex' }}>
                                        <div style={{
                                            flex: 1,
                                            background: 'var(--color-bg-layout)',
                                            padding: '8px 12px',
                                            borderRadius: '6px 0 0 6px',
                                            border: '1px solid var(--color-border)',
                                            borderRight: 'none',
                                            fontFamily: 'monospace',
                                            fontSize: 16
                                        }}>
                                            {pickedColor.hex}
                                        </div>
                                        <Button
                                            type="primary"
                                            icon={<CopyOutlined />}
                                            style={{ borderRadius: '0 6px 6px 0' }}
                                            onClick={() => copyToClipboard(pickedColor.hex)}
                                        />
                                    </div>
                                </div>

                                <div style={{ marginBottom: 24 }}>
                                    <Text type="secondary" style={{ display: 'block', marginBottom: 8 }}>RGB</Text>
                                    <div style={{ display: 'flex' }}>
                                        <div style={{
                                            flex: 1,
                                            background: 'var(--color-bg-layout)',
                                            padding: '8px 12px',
                                            borderRadius: '6px 0 0 6px',
                                            border: '1px solid var(--color-border)',
                                            borderRight: 'none',
                                            fontFamily: 'monospace',
                                            fontSize: 16
                                        }}>
                                            {pickedColor.rgb}
                                        </div>
                                        <Button
                                            icon={<CopyOutlined />}
                                            style={{ borderRadius: '0 6px 6px 0' }}
                                            onClick={() => copyToClipboard(pickedColor.rgb)}
                                        />
                                    </div>
                                </div>

                                <div style={{ marginBottom: 24 }}>
                                    <Text type="secondary" style={{ display: 'block', marginBottom: 8 }}>HSL</Text>
                                    <div style={{ display: 'flex' }}>
                                        <div style={{
                                            flex: 1,
                                            background: 'var(--color-bg-layout)',
                                            padding: '8px 12px',
                                            borderRadius: '6px 0 0 6px',
                                            border: '1px solid var(--color-border)',
                                            borderRight: 'none',
                                            fontFamily: 'monospace',
                                            fontSize: 16
                                        }}>
                                            {pickedColor.hsl}
                                        </div>
                                        <Button
                                            icon={<CopyOutlined />}
                                            style={{ borderRadius: '0 6px 6px 0' }}
                                            onClick={() => copyToClipboard(pickedColor.hsl)}
                                        />
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="点击图片或使用屏幕取色获取颜色" style={{ marginTop: 80 }} />
                        )}

                        {colorHistory.length > 0 && (
                            <div style={{ marginTop: 48, paddingTop: 24, borderTop: '1px solid var(--color-border)' }}>
                                <Text strong style={{ display: 'block', marginBottom: 12 }}>最近记录</Text>
                                <Space wrap>
                                    {colorHistory.map((c, idx) => (
                                        <Tooltip key={idx} title={c.hex}>
                                            <div
                                                style={{
                                                    width: 32,
                                                    height: 32,
                                                    borderRadius: '50%',
                                                    background: c.hex,
                                                    border: '2px solid #fff',
                                                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                                                    cursor: 'pointer'
                                                }}
                                                onClick={() => setPickedColor(c)}
                                            ></div>
                                        </Tooltip>
                                    ))}
                                </Space>
                            </div>
                        )}
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default ImageColorPicker;
