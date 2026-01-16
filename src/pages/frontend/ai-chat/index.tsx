import React, { useState, useRef, useEffect } from 'react';
import {
    Typography, Input, Button, Avatar, message, Spin
} from 'antd';
import {
    SendOutlined, RobotOutlined, UserOutlined, ClearOutlined
} from '@ant-design/icons';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark, oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';
import {
    sendChatMessageStream, getStoredApiKey, type ChatMessage
} from '../../../services/openai';
import { useAppTheme } from '../../../contexts/theme-context';
import '../../../assets/styles/pages/frontend/ai-chat.css';

const { Title, Text } = Typography;
const { TextArea } = Input;

interface DisplayMessage extends ChatMessage {
    id: string;
    loading?: boolean;
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

const AIChat: React.FC = () => {
    const { isDarkMode } = useAppTheme();
    const apiKey = getStoredApiKey();
    const [messages, setMessages] = useState<DisplayMessage[]>([]);
    const [inputValue, setInputValue] = useState('');
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // 发送消息
    const handleSend = async () => {
        if (!inputValue.trim() || loading) return;

        if (!apiKey) {
            message.warning('请联系管理员在后台配置 API Key');
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

        // 构建消息历史
        const chatMessages: ChatMessage[] = [
            { role: 'system', content: '你是一个乐于助人的 AI 助手，专业地回答各种问题。' },
            ...messages.map((m) => ({ role: m.role, content: m.content })),
            { role: 'user', content: userMessage.content },
        ];

        try {
            await sendChatMessageStream(
                chatMessages,
                'gpt-4o-mini',
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

    // 按 Enter 发送
    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className="frontend-ai-chat-page">
            <div className="frontend-ai-chat-container">
                {/* 头部 */}
                <div className="frontend-ai-chat-header">
                    <div className="header-left">
                        <RobotOutlined className="header-icon" />
                        <Title level={3} style={{ margin: 0 }}>AI 智能对话</Title>
                    </div>
                    {messages.length > 0 && (
                        <Button icon={<ClearOutlined />} onClick={handleClear} type="text">
                            清空对话
                        </Button>
                    )}
                </div>

                {/* 消息列表 */}
                <div className="messages-container">
                    {messages.length === 0 ? (
                        <div className="empty-state">
                            <RobotOutlined className="empty-icon" />
                            <Title level={4} style={{ marginTop: 16 }}>你好！我是 AI 助手</Title>
                            <Text type="secondary">有什么可以帮你的？</Text>
                        </div>
                    ) : (
                        messages.map((msg) => (
                            <div
                                key={msg.id}
                                className={`message-item ${msg.role}`}
                            >
                                <Avatar
                                    icon={msg.role === 'user' ? <UserOutlined /> : <RobotOutlined />}
                                    className={`message-avatar ${msg.role}`}
                                    size={36}
                                />
                                <div className="message-content">
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
                                        <div className="user-message">{msg.content}</div>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* 输入区域 */}
                <div className="input-area">
                    <TextArea
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="输入消息，按 Enter 发送，Shift+Enter 换行"
                        autoSize={{ minRows: 1, maxRows: 5 }}
                        disabled={loading}
                        className="message-input"
                    />
                    <Button
                        type="primary"
                        icon={<SendOutlined />}
                        onClick={handleSend}
                        loading={loading}
                        disabled={!inputValue.trim()}
                        className="send-button"
                    />
                </div>
            </div>
        </div>
    );
};

export default AIChat;

