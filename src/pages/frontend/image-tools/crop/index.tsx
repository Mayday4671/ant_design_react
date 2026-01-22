import React, { useState, useRef, useEffect } from 'react';
import { Upload, Button, Row, Col, Typography, Space, Card } from 'antd';
import { InboxOutlined, DownloadOutlined, RedoOutlined } from '@ant-design/icons';
import ReactCrop, { type Crop, type PixelCrop, centerCrop, makeAspectCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

const { Dragger } = Upload;
const { Title, Text } = Typography;

function centerAspectCrop(mediaWidth: number, mediaHeight: number, aspect: number) {
    return centerCrop(
        makeAspectCrop(
            {
                unit: '%',
                width: 90,
            },
            aspect,
            mediaWidth,
            mediaHeight,
        ),
        mediaWidth,
        mediaHeight,
    )
}

const ImageCrop: React.FC = () => {
    const [imgSrc, setImgSrc] = useState('');
    const [crop, setCrop] = useState<Crop>();
    const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
    const [aspect, setAspect] = useState<number | undefined>(undefined);
    const imgRef = useRef<HTMLImageElement>(null);
    const previewCanvasRef = useRef<HTMLCanvasElement>(null);

    const onSelectFile = (file: File) => {
        const reader = new FileReader();
        reader.addEventListener('load', () => setImgSrc(reader.result?.toString() || ''));
        reader.readAsDataURL(file);
        return false;
    };

    const onImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
        if (aspect) {
            const { width, height } = e.currentTarget;
            setCrop(centerAspectCrop(width, height, aspect));
        }
    };

    const handleDownload = () => {
        if (!completedCrop || !previewCanvasRef.current || !imgRef.current) return;

        const image = imgRef.current;
        const canvas = previewCanvasRef.current;
        const crop = completedCrop;

        const scaleX = image.naturalWidth / image.width;
        const scaleY = image.naturalHeight / image.height;
        const ctx = canvas.getContext('2d');
        const pixelRatio = window.devicePixelRatio;

        if (!ctx) return;

        canvas.width = crop.width * pixelRatio * scaleX;
        canvas.height = crop.height * pixelRatio * scaleY;

        ctx.scale(pixelRatio, pixelRatio);
        ctx.imageSmoothingQuality = 'high';

        const cropX = crop.x * scaleX;
        const cropY = crop.y * scaleY;

        const centerX = image.naturalWidth / 2;
        const centerY = image.naturalHeight / 2;

        ctx.save();
        ctx.translate(-cropX, -cropY);
        ctx.translate(centerX, centerY);
        ctx.translate(-centerX, -centerY);
        ctx.drawImage(
            image,
            0,
            0,
            image.naturalWidth,
            image.naturalHeight,
            0,
            0,
            image.naturalWidth,
            image.naturalHeight,
        );
        ctx.restore();

        // Download
        canvas.toBlob((blob) => {
            if (!blob) return;
            const previewUrl = URL.createObjectURL(blob);
            const anchor = document.createElement('a');
            anchor.download = 'cropped.png';
            anchor.href = previewUrl;
            anchor.click();
            URL.revokeObjectURL(previewUrl);
        });
    };

    useDebounceEffect(
        async () => {
            if (
                completedCrop?.width &&
                completedCrop?.height &&
                imgRef.current &&
                previewCanvasRef.current
            ) {
                // simple preview drawing for now
                canvasPreview(imgRef.current, previewCanvasRef.current, completedCrop);
            }
        },
        100,
        [completedCrop],
    );

    return (
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: 32 }}>
                <Title level={2}>在线图片裁剪</Title>
                <Text type="secondary">
                    自由裁剪或按比例裁剪，制作头像、封面图的首选工具。
                </Text>
            </div>

            <Row gutter={[48, 24]}>
                <Col xs={24} lg={14}>
                    <Card title="1. 上传与裁剪" bordered={false} bodyStyle={{ minHeight: 400 }}>
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
                                textAlign: 'center'
                            }}>
                                <ReactCrop
                                    crop={crop}
                                    onChange={(_, percentCrop) => setCrop(percentCrop)}
                                    onComplete={(c) => setCompletedCrop(c)}
                                    aspect={aspect}
                                >
                                    <img
                                        ref={imgRef}
                                        alt="Crop me"
                                        src={imgSrc}
                                        style={{ maxWidth: '100%', maxHeight: 500 }}
                                        onLoad={onImageLoad}
                                    />
                                </ReactCrop>
                                <div style={{ marginTop: 16 }}>
                                    <Button onClick={() => setImgSrc('')} icon={<RedoOutlined />}>重新上传</Button>
                                </div>
                            </div>
                        )}

                        {imgSrc && (
                            <div style={{ marginTop: 24 }}>
                                <Text strong>裁剪比例：</Text>
                                <Space wrap>
                                    <Button type={!aspect ? 'primary' : 'default'} onClick={() => setAspect(undefined)}>自由</Button>
                                    <Button type={aspect === 1 ? 'primary' : 'default'} onClick={() => setAspect(1)}>1:1 (头像)</Button>
                                    <Button type={aspect === 16 / 9 ? 'primary' : 'default'} onClick={() => setAspect(16 / 9)}>16:9 (封面)</Button>
                                    <Button type={aspect === 4 / 3 ? 'primary' : 'default'} onClick={() => setAspect(4 / 3)}>4:3</Button>
                                </Space>
                            </div>
                        )}
                    </Card>
                </Col>

                <Col xs={24} lg={10}>
                    <Card title="2. 实时预览与下载" bordered={false} bodyStyle={{ minHeight: 400 }}>
                        <div style={{
                            flex: 1,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            background: 'var(--color-bg-layout)',
                            borderRadius: 8,
                            minHeight: 300,
                            border: '1px solid var(--color-border-secondary)',
                            overflow: 'hidden'
                        }}>
                            {completedCrop ? (
                                <canvas
                                    ref={previewCanvasRef}
                                    style={{
                                        border: '1px solid black',
                                        objectFit: 'contain',
                                        maxWidth: '100%',
                                        maxHeight: 300,
                                    }}
                                />
                            ) : (
                                <div style={{ color: 'var(--color-text-tertiary)' }}>
                                    {imgSrc ? '请在左侧选择裁剪区域' : '请先上传图片'}
                                </div>
                            )}
                        </div>

                        <div style={{ marginTop: 24, textAlign: 'center' }}>
                            <Button
                                type="primary"
                                icon={<DownloadOutlined />}
                                size="large"
                                disabled={!completedCrop}
                                onClick={handleDownload}
                                block
                            >
                                下载裁剪结果
                            </Button>
                        </div>
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

// Helper for preview
async function canvasPreview(
    image: HTMLImageElement,
    canvas: HTMLCanvasElement,
    crop: PixelCrop,
) {
    const ctx = canvas.getContext('2d')
    if (!ctx) {
        throw new Error('No 2d context')
    }

    const scaleX = image.naturalWidth / image.width
    const scaleY = image.naturalHeight / image.height
    const pixelRatio = window.devicePixelRatio

    canvas.width = Math.floor(crop.width * scaleX * pixelRatio)
    canvas.height = Math.floor(crop.height * scaleY * pixelRatio)

    ctx.scale(pixelRatio, pixelRatio)
    ctx.imageSmoothingQuality = 'high'

    const cropX = crop.x * scaleX
    const cropY = crop.y * scaleY

    // const centerX = image.naturalWidth / 2
    // const centerY = image.naturalHeight / 2

    ctx.save()

    // 0,0 is top left
    ctx.translate(-cropX, -cropY)
    // move to center
    // ctx.translate(centerX, centerY)
    // ctx.translate(-centerX, -centerY)

    ctx.drawImage(
        image,
        0,
        0,
        image.naturalWidth,
        image.naturalHeight,
        0,
        0,
        image.naturalWidth,
        image.naturalHeight,
    )

    ctx.restore()
}

function useDebounceEffect(
    fn: () => void,
    waitTime: number,
    deps?: React.DependencyList,
) {
    useEffect(() => {
        const t = setTimeout(() => {
            fn.apply(undefined, deps as any)
        }, waitTime)

        return () => {
            clearTimeout(t)
        }
    }, deps)
}

export default ImageCrop;
