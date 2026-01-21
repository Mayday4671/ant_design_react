import React, { useState, useRef, useEffect } from 'react';
import {
    Typography, Input, Button, Avatar, message, Spin, Select
} from 'antd';
import {
    SendOutlined, RobotOutlined, UserOutlined, ClearOutlined
} from '@ant-design/icons';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark, oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';
import {
    sendChatMessageStream, getStoredApiKey, getStoredGoogleApiKey, AVAILABLE_MODELS, type ChatMessage
} from '../../services/openai';
import { useAppTheme } from '../../contexts';
import '../../assets/styles/components/ai-chat.css';

const { Title, Text } = Typography;
const { TextArea } = Input;

interface DisplayMessage extends ChatMessage {
    id: string;
    loading?: boolean;
}

export interface AIChatProps {
    /** 初始选中的模型 */
    initialModel?: string;
    /** 模型变更回调 */
    onModelChange?: (model: string) => void;
    /** 组件宽度 (支持 '100%' 或 具体像素) */
    width?: string | number;
    /** 组件高度 (支持 '100%' 或 具体像素) */
    height?: string | number;
    /** 自定义类名 */
    className?: string;
    /** 自定义样式 */
    style?: React.CSSProperties;
    /** 自定义用户头像 */
    userAvatar?: React.ReactNode | string;
    /** 自定义 AI 头像 */
    assistantAvatar?: React.ReactNode | string;
    /** 是否显示头部标题栏 */
    showHeader?: boolean;
}

// Markdown 代码块渲染组件
const CodeBlock: React.FC<{ inline?: boolean; className?: string; children?: React.ReactNode; isDark: boolean }> = ({
    inline, className, children, isDark
}) => {
    const match = /language-(\w+)/.exec(className || '');
    const language = match ? match[1] : '';
    const code = String(children).replace(/\n$/, '');

    if (!inline && language) {
        return (
            <SyntaxHighlighter
                style={isDark ? oneDark : oneLight}
                language={language}
                PreTag="div"
                customStyle={{
                    margin: '12px 0',
                    borderRadius: 8,
                    fontSize: 13,
                }}
            >
                {code}
            </SyntaxHighlighter>
        );
    }

    if (!inline && code.includes('\n')) {
        return (
            <SyntaxHighlighter
                style={isDark ? oneDark : oneLight}
                language="text"
                PreTag="div"
                customStyle={{
                    margin: '12px 0',
                    borderRadius: 8,
                    fontSize: 13,
                }}
            >
                {code}
            </SyntaxHighlighter>
        );
    }

    return (
        <code className="inline-code">
            {children}
        </code>
    );
};

const AIChat: React.FC<AIChatProps> = ({
    initialModel = 'gpt-4o-mini',
    onModelChange,
    width = '100%',
    height = '100%',
    className = '',
    style = {},
    userAvatar,
    assistantAvatar,
    showHeader = true,
}) => {
    const { isDarkMode } = useAppTheme();
    const [selectedModel, setSelectedModel] = useState(initialModel);
    const [messages, setMessages] = useState<DisplayMessage[]>([]);
    const [inputValue, setInputValue] = useState('');
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // 根据模型选择对应的 API Key
    const getApiKey = () => {
        if (selectedModel.startsWith('gemini-')) {
            return getStoredGoogleApiKey();
        }
        return getStoredApiKey();
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleModelChange = (val: string) => {
        setSelectedModel(val);
        onModelChange?.(val);
    };

    // 发送消息
    const handleSend = async () => {
        if (!inputValue.trim() || loading) return;

        const apiKey = getApiKey();
        if (!apiKey) {
            const keyType = selectedModel.startsWith('gemini-') ? 'Google API Key' : 'OpenAI API Key';
            message.warning(`请在后台设置中配置 ${keyType}`);
            return;
        }

        const userMessage: DisplayMessage = {
            id: Date.now().toString(),
            role: 'user',
            content: inputValue.trim(),
        };

        const assistantMessage: DisplayMessage = {
            id: (Date.now() + 1).toString(),
            role: 'assistant',
            content: '',
            loading: true,
        };

        setMessages((prev) => [...prev, userMessage, assistantMessage]);
        setInputValue('');
        setLoading(true);

        const chatMessages: ChatMessage[] = [
            { role: 'system', content: '你是一个乐于助人的 AI 助手，专业地回答各种问题。' },
            ...messages.map((m) => ({ role: m.role, content: m.content })),
            { role: 'user', content: userMessage.content },
        ];

        try {
            await sendChatMessageStream(
                chatMessages,
                selectedModel,
                apiKey,
                (content) => {
                    setMessages((prev) =>
                        prev.map((m) =>
                            m.id === assistantMessage.id
                                ? { ...m, content: m.content + content, loading: true }
                                : m
                        )
                    );
                },
                () => {
                    setMessages((prev) =>
                        prev.map((m) =>
                            m.id === assistantMessage.id ? { ...m, loading: false } : m
                        )
                    );
                    setLoading(false);
                },
                (error) => {
                    message.error(`请求失败: ${error.message}`);
                    setMessages((prev) =>
                        prev.map((m) =>
                            m.id === assistantMessage.id
                                ? { ...m, content: `错误: ${error.message}`, loading: false }
                                : m
                        )
                    );
                    setLoading(false);
                }
            );
        } catch {
            message.error('发送失败');
            setLoading(false);
        }
    };

    // 清空对话
    const handleClear = () => {
        setMessages([]);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    // 渲染头像辅助函数
    const renderAvatar = (role: 'user' | 'assistant') => {
        const customAvatar = role === 'user' ? userAvatar : assistantAvatar;

        if (customAvatar) {
            if (typeof customAvatar === 'string') {
                return <Avatar src={customAvatar} className={`common-message-avatar ${role}`} size={36} />;
            }
            return <div className={`common-message-avatar ${role}`}>{customAvatar}</div>;
        }

        return (
            <Avatar
                icon={role === 'user' ? <UserOutlined /> : <RobotOutlined />}
                className={`common-message-avatar ${role}`}
                size={36}
            />
        );
    };

    return (
        <div
            className={`common-ai-chat-container ${className}`}
            style={{ width, height, ...style }}
        >
            {/* 头部 */}
            {showHeader && (
                <div className="common-ai-chat-header">
                    <div className="common-header-left">
                        <RobotOutlined style={{ fontSize: 24, color: '#1677ff' }} />
                        <Title level={4} style={{ margin: 0 }}>AI 智能对话</Title>
                        <Select
                            value={selectedModel}
                            onChange={handleModelChange}
                            options={AVAILABLE_MODELS}
                            style={{ width: 180 }}
                            size="small"
                        />
                    </div>
                    {messages.length > 0 && (
                        <Button icon={<ClearOutlined />} onClick={handleClear} type="text">
                            清空对话
                        </Button>
                    )}
                </div>
            )}

            {/* 消息列表 */}
            <div className="common-messages-container">
                {messages.length === 0 ? (
                    <div className="common-empty-state">
                        <RobotOutlined className="common-empty-icon" style={{ fontSize: 64, color: '#d9d9d9', marginBottom: 24 }} />
                        <Title level={4}>你好！我是 AI 助手</Title>
                        <Text type="secondary">有什么可以帮你的？</Text>
                    </div>
                ) : (
                    messages.map((msg) => (
                        <div
                            key={msg.id}
                            className={`common-message-item ${msg.role}`}
                        >
                            {renderAvatar(msg.role as 'user' | 'assistant')}
                            <div className="common-message-content">
                                {msg.role === 'assistant' ? (
                                    msg.loading && !msg.content ? (
                                        <Spin size="small" />
                                    ) : (
                                        <ReactMarkdown
                                            components={{
                                                code: (props) => <CodeBlock {...props} isDark={isDarkMode} />,
                                            }}
                                        >
                                            {msg.content}
                                        </ReactMarkdown>
                                    )
                                ) : (
                                    <div className="user-message-text">{msg.content}</div>
                                )}
                            </div>
                        </div>
                    ))
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* 输入区域 */}
            <div className="common-input-area">
                <TextArea
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="输入消息，按 Enter 发送，Shift+Enter 换行"
                    autoSize={{ minRows: 1, maxRows: 5 }}
                    disabled={loading}
                    className="common-message-input"
                />
                <Button
                    type="primary"
                    icon={<SendOutlined />}
                    onClick={handleSend}
                    loading={loading}
                    disabled={!inputValue.trim()}
                    className="common-send-button"
                />
            </div>
        </div>
    );
};

export default AIChat;
