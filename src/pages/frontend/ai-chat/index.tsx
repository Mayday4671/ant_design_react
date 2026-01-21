import React from 'react';
import AIChat from '../../../components/AIChat';
// CSS 由组件内部引入，无需在此引入

const AIChatPage: React.FC = () => {
    return (
        <div style={{
            height: '100%',
            padding: 14, // 配合 Layout 的 padding，这里再给一点内边距，或者直接撑满
            // 用户之前希望四周有空隙，Layout 已经给了 14px。
            // 之前的实现是 height: 100%。
            // 这里我们直接渲染组件。
            boxSizing: 'border-box',
        }}>
            <AIChat
                width="100%"
                height="100%"
                className="frontend-ai-chat-page"
                style={{
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
                    border: '1px solid rgba(0, 0, 0, 0.05)',
                }}
            />
        </div>
    );
};

export default AIChatPage;
