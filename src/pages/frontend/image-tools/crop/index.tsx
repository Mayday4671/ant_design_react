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
    const [scale, setScale] = useState(1);
    const [rotate, setRotate] = useState(0);
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
        [completedCrop, scale, rotate],
    );

    return (
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: 32 }}>
                <Title level={2}>在线图片裁剪</Title>
                <Text type="secondary">
                    上传图片并按需调整裁剪区域，支持自由比例和固定比例。
                </Text>
            </div>

            <Row gutter={24}>
                <Col xs={24} lg={14}>
                    <Card title="1. 上传与裁剪" bordered={true} bodyStyle={{ padding: 24, minHeight: 500 }}>
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
                                background: 'var(--color-modal-mask)', // Darker background for crop focus
                                borderRadius: 8,
                                padding: 24,
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                minHeight: 400
                            }}>
                                <ReactCrop
                                    crop={crop}
                                    onChange={(_, percentCrop) => setCrop(percentCrop)}
                                    onComplete={(c) => setCompletedCrop(c)}
                                    aspect={undefined} // Free crop by default
                                    style={{ maxWidth: '100%' }}
                                >
                                    <img
                                        ref={imgRef}
                                        alt="Crop me"
                                        src={imgSrc}
                                        style={{ transform: `scale(${scale}) rotate(${rotate}deg)`, maxHeight: '60vh', maxWidth: '100%' }}
                                        onLoad={onImageLoad}
                                    />
                                </ReactCrop>
                            </div>
                        )}

                        {imgSrc && (
                            <div style={{ marginTop: 24, display: 'flex', gap: 16, justifyContent: 'center' }}>
                                <Button onClick={() => setImgSrc('')} icon={<RedoOutlined />}>重新上传</Button>
                                {/* Add more controls like rotate here if needed later */}
                            </div>
                        )}
                    </Card>
                </Col>

                <Col xs={24} lg={10}>
                    <Card title="2. 预览结果" bordered={true} bodyStyle={{ padding: 24, minHeight: 500 }} extra={<Button type="primary" icon={<DownloadOutlined />} onClick={handleDownload} disabled={!completedCrop}>下载结果</Button>}>
                        {!!completedCrop ? (
                            <div style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center'
                            }}>
                                <div style={{
                                    border: '1px solid var(--color-border)',
                                    background: 'var(--color-bg-layout)', // Checkerboard ideally
                                    borderRadius: 8,
                                    overflow: 'hidden',
                                    marginBottom: 16,
                                    maxWidth: '100%'
                                }}>
                                    <canvas
                                        ref={previewCanvasRef}
                                        style={{
                                            border: '1px solid black',
                                            objectFit: 'contain',
                                            width: completedCrop.width,
                                            height: completedCrop.height,
                                            maxWidth: '100%',
                                            maxHeight: 400
                                        }}
                                    />
                                </div>
                                <Text type="secondary">尺寸: {Math.round(completedCrop.width)} x {Math.round(completedCrop.height)} px</Text>
                            </div>
                        ) : (
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
                                <div style={{ fontSize: 48, opacity: 0.2 }}>🖼️</div>
                                <div>请在左侧裁剪图片</div>
                            </div>
                        )}
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
