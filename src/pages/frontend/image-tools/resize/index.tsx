import React, { useState, useRef, useEffect } from 'react';
import { Upload, Button, Row, Col, Typography, InputNumber, Switch, Space, Radio, message, Card } from 'antd';
import { InboxOutlined, DownloadOutlined, RedoOutlined, ColumnHeightOutlined, ColumnWidthOutlined } from '@ant-design/icons';

const { Dragger } = Upload;
const { Title, Text } = Typography;

const ImageResize: React.FC = () => {
    const [imgSrc, setImgSrc] = useState('');
    const [originalDimensions, setOriginalDimensions] = useState({ width: 0, height: 0 });
    const [resizeType, setResizeType] = useState<'percentage' | 'dimensions'>('percentage');
    const [percentage, setPercentage] = useState<number>(50);
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
    const [lockAspectRatio, setLockAspectRatio] = useState(true);
    const [processedImgSrc, setProcessedImgSrc] = useState('');

    const imgRef = useRef<HTMLImageElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const onSelectFile = (file: File) => {
        const reader = new FileReader();
        reader.addEventListener('load', () => {
            setImgSrc(reader.result?.toString() || '');
            setProcessedImgSrc('');
        });
        reader.readAsDataURL(file);
        return false;
    };

    const onImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
        const { naturalWidth, naturalHeight } = e.currentTarget;
        setOriginalDimensions({ width: naturalWidth, height: naturalHeight });
        setDimensions({ width: Math.round(naturalWidth * 0.5), height: Math.round(naturalHeight * 0.5) });
        setPercentage(50);
        handleResize(naturalWidth, naturalHeight, 'percentage', 50, { width: 0, height: 0 }, true);
    };

    const handleResize = (
        origW: number,
        origH: number,
        type: 'percentage' | 'dimensions',
        pct: number,
        dims: { width: number, height: number },
        lock: boolean
    ) => {
        let newW = 0;
        let newH = 0;

        if (type === 'percentage') {
            const scale = pct / 100;
            newW = Math.round(origW * scale);
            newH = Math.round(origH * scale);
        } else {
            newW = dims.width;
            newH = dims.height;
        }

        if (canvasRef.current) {
            const canvas = canvasRef.current;
            const ctx = canvas.getContext('2d');
            canvas.width = newW;
            canvas.height = newH;

            if (ctx && imgRef.current) {
                ctx.imageSmoothingQuality = 'high';
                ctx.drawImage(imgRef.current, 0, 0, newW, newH);
                setProcessedImgSrc(canvas.toDataURL('image/png'));
            }
        }
    };

    // Update dimensions when percentage changes
    useEffect(() => {
        if (!originalDimensions.width) return;
        if (resizeType === 'percentage') {
            const scale = percentage / 100;
            setDimensions({
                width: Math.round(originalDimensions.width * scale),
                height: Math.round(originalDimensions.height * scale)
            });
            handleResize(originalDimensions.width, originalDimensions.height, 'percentage', percentage, dimensions, lockAspectRatio);
        }
    }, [percentage, resizeType]);

    // Update resize when dimensions change
    const onDimensionChange = (key: 'width' | 'height', value: number | null) => {
        if (!value) return;
        let newDims = { ...dimensions, [key]: value };

        if (lockAspectRatio) {
            const ratio = originalDimensions.width / originalDimensions.height;
            if (key === 'width') {
                newDims.height = Math.round(value / ratio);
            } else {
                newDims.width = Math.round(value * ratio);
            }
        }
        setDimensions(newDims);
        handleResize(originalDimensions.width, originalDimensions.height, 'dimensions', percentage, newDims, lockAspectRatio);
    };

    const triggerResize = () => {
        handleResize(originalDimensions.width, originalDimensions.height, resizeType, percentage, dimensions, lockAspectRatio);
    };

    return (
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: 32 }}>
                <Title level={2}>在线修改尺寸</Title>
                <Text type="secondary">
                    快速调整图片长宽，支持按百分比或像素精确缩放。
                </Text>
            </div>

            <Row gutter={[48, 24]}>
                <Col xs={24} lg={10}>
                    <Card title="1. 上传与设置" bordered={false} bodyStyle={{ minHeight: 400 }}>
                        {!imgSrc ? (
                            <Dragger
                                accept="image/*"
                                showUploadList={false}
                                beforeUpload={onSelectFile}
                                style={{
                                    padding: '48px 0',
                                    background: 'var(--color-bg-container)',
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
                                background: 'var(--color-bg-layout)',
                                textAlign: 'center',
                                position: 'relative'
                            }}>
                                <img
                                    ref={imgRef}
                                    src={imgSrc}
                                    style={{ maxWidth: '100%', maxHeight: 300, display: 'none' }} // Hidden source
                                    onLoad={onImageLoad}
                                />
                                <div style={{ marginBottom: 16 }}>
                                    <Text type="secondary">原始尺寸: {originalDimensions.width} x {originalDimensions.height}</Text>
                                </div>
                                <Button onClick={() => setImgSrc('')} icon={<RedoOutlined />}>重新上传</Button>
                            </div>
                        )}

                        {imgSrc && (
                            <div style={{ marginTop: 32 }}>
                                <Title level={5} style={{ marginBottom: 16 }}>2. 缩放设置</Title>
                                <Space direction="vertical" style={{ width: '100%' }} size="large">
                                    <Radio.Group value={resizeType} onChange={e => {
                                        setResizeType(e.target.value);
                                        // triggering effect by state change
                                    }} buttonStyle="solid">
                                        <Radio.Button value="percentage">按百分比</Radio.Button>
                                        <Radio.Button value="dimensions">按像素</Radio.Button>
                                    </Radio.Group>

                                    {resizeType === 'percentage' ? (
                                        <div>
                                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                <Text>缩放比例</Text>
                                                <Text>{percentage}%</Text>
                                            </div>
                                            <InputNumber
                                                min={1}
                                                max={500}
                                                style={{ width: '100%' }}
                                                value={percentage}
                                                onChange={val => setPercentage(val || 100)}
                                                addonAfter="%"
                                            />
                                        </div>
                                    ) : (
                                        <Row gutter={16}>
                                            <Col span={12}>
                                                <Text>宽度 (px)</Text>
                                                <InputNumber
                                                    min={1}
                                                    value={dimensions.width}
                                                    onChange={val => onDimensionChange('width', val)}
                                                    style={{ width: '100%' }}
                                                    prefix={<ColumnWidthOutlined />}
                                                />
                                            </Col>
                                            <Col span={12}>
                                                <Text>高度 (px)</Text>
                                                <InputNumber
                                                    min={1}
                                                    value={dimensions.height}
                                                    onChange={val => onDimensionChange('height', val)}
                                                    style={{ width: '100%' }}
                                                    prefix={<ColumnHeightOutlined />}
                                                />
                                            </Col>
                                        </Row>
                                    )}

                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                        <Text>锁定长宽比</Text>
                                        <Switch checked={lockAspectRatio} onChange={setLockAspectRatio} />
                                    </div>

                                    <Button type="primary" onClick={triggerResize} block>应用调整</Button>
                                </Space>
                            </div>
                        )}
                    </Card>
                </Col>

                <Col xs={24} lg={14}>
                    <Card title="3. 结果预览" bordered={false} bodyStyle={{ minHeight: 400 }}>
                        <div style={{
                            flex: 1,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            background: 'var(--color-bg-layout)',
                            borderRadius: 8,
                            minHeight: 400,
                            border: '1px solid var(--color-border-secondary)',
                            overflow: 'hidden',
                            padding: 16
                        }}>
                            <canvas ref={canvasRef} style={{ maxWidth: '100%', maxHeight: 400, objectFit: 'contain' }} />
                            {!imgSrc && <Text type="secondary">请先上传图片</Text>}
                        </div>

                        {processedImgSrc && (
                            <div style={{ marginTop: 24, textAlign: 'center' }}>
                                <Text type="secondary" style={{ display: 'block', marginBottom: 12 }}>
                                    新尺寸: {dimensions.width} x {dimensions.height}
                                </Text>
                                <Button
                                    type="primary"
                                    icon={<DownloadOutlined />}
                                    size="large"
                                    href={processedImgSrc}
                                    download={`resized_${dimensions.width}x${dimensions.height}.png`}
                                    block
                                >
                                    下载图片
                                </Button>
                            </div>
                        )}
                    </Card>
                </Col>
            </Row>
        </div >
    );
};

export default ImageResize;
