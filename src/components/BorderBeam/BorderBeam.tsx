import React from 'react';
import './BorderBeam.css';

interface BorderBeamProps {
    /**
     * 光束颜色（支持渐变）
     */
    colorFrom?: string;
    colorTo?: string;
    /**
     * 动画持续时间（秒）
     */
    duration?: number;
    /**
     * 动画延迟（秒）
     */
    delay?: number;
    /**
     * 光束大小
     */
    size?: number;
    /**
     * 边框圆角
     */
    borderRadius?: number;
    /**
     * 自定义类名
     */
    className?: string;
}

const BorderBeam: React.FC<BorderBeamProps> = ({
    colorFrom = 'rgba(99, 102, 241, 0.8)',
    colorTo = 'rgba(168, 85, 247, 0.8)',
    duration = 5,
    delay = 0,
    size = 200,
    borderRadius = 12,
    className = '',
}) => {
    return (
        <div
            className={`border-beam ${className}`}
            style={{
                '--border-beam-duration': `${duration}s`,
                '--border-beam-delay': `${delay}s`,
                '--border-beam-size': `${size}px`,
                '--border-beam-color-from': colorFrom,
                '--border-beam-color-to': colorTo,
                '--border-beam-border-radius': `${borderRadius}px`,
            } as React.CSSProperties}
        />
    );
};

export default BorderBeam;
