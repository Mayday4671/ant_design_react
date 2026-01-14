import React, { useState, useRef, useEffect } from 'react';
import {
    Typography, Card, Input, Button, Space, Select, Avatar, message, Spin
} from 'antd';
import {
    SendOutlined, RobotOutlined, UserOutlined, SettingOutlined,
    KeyOutlined, ClearOutlined
} from '@ant-design/icons';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark, oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';
import {
    sendChatMessageStream, getStoredApiKey, saveApiKey, clearApiKey,
    AVAILABLE_MODELS, type ChatMessage
} from '../../../services/openai';
import { useAppTheme } from '../../../contexts/theme-context';
import '../../../assets/styles/pages/admin/gpt-chat.css';

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

const GPTChat: React.FC = () => {
    const { isDarkMode } = useAppTheme();
    const [apiKey, setApiKey] = useState(getStoredApiKey());
    const [showApiKeyInput, setShowApiKeyInput] = useState(!getStoredApiKey());
    const [tempApiKey, setTempApiKey] = useState('');
    const [model, setModel] = useState('gpt-4o-mini');
    const [messages, setMessages] = useState<DisplayMessage[]>([]);
    const [inputValue, setInputValue] = useState('');
    const [loading, setLoading] = useState(false);
    const [systemPrompt, setSystemPrompt] = useState('你是一个乐于助人的 AI 助手。');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // 保存 API Key
    const handleSaveApiKey = () => {
        if (!tempApiKey.trim()) {
            message.error('请输入有效的 API Key');
            return;
        }
        saveApiKey(tempApiKey.trim());
        setApiKey(tempApiKey.trim());
        setShowApiKeyInput(false);
        message.success('API Key 已保存');
    };

    // 清除 API Key
    const handleClearApiKey = () => {
        clearApiKey();
        setApiKey('');
        setShowApiKeyInput(true);
        message.success('API Key 已清除');
    };

    // 发送消息
    const handleSend = async () => {
        if (!inputValue.trim() || loading) return;

        if (!apiKey) {
            message.error('请先设置 API Key');
            setShowApiKeyInput(true);
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
            { role: 'system', content: systemPrompt },
            ...messages.map((m) => ({ role: m.role, content: m.content })),
            { role: 'user', content: userMessage.content },
        ];

        try {
            await sendChatMessageStream(
                chatMessages,
                model,
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
        message.success('对话已清空');
    };

    // 按 Enter 发送
    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className="gpt-chat-page">
            <div className="gpt-chat-container">
                {/* 头部 */}
                <div className="gpt-chat-header">
                    <div className="header-left">
                        <RobotOutlined className="header-icon" />
                        <Title level={3} style={{ margin: 0 }}>AI 助手</Title>
                    </div>
                    <Space wrap>
                        <Select
                            value={model}
                            onChange={setModel}
                            options={AVAILABLE_MODELS}
                            style={{ width: 160 }}
                            size="middle"
                        />
                        <Button
                            icon={<KeyOutlined />}
                            onClick={() => setShowApiKeyInput(!showApiKeyInput)}
                            type={apiKey ? 'default' : 'primary'}
                        >
                            {apiKey ? 'API Key ✓' : '设置 API Key'}
                        </Button>
                        <Button icon={<ClearOutlined />} onClick={handleClear}>
                            清空
                        </Button>
                    </Space>
                </div>

                {/* API Key 设置 */}
                {showApiKeyInput && (
                    <Card className="api-key-card" size="small">
                        <Space direction="vertical" style={{ width: '100%' }}>
                            <Text strong>请输入你的 OpenAI API Key：</Text>
                            <Space.Compact style={{ width: '100%' }}>
                                <Input.Password
                                    placeholder="sk-..."
                                    value={tempApiKey}
                                    onChange={(e) => setTempApiKey(e.target.value)}
                                    onPressEnter={handleSaveApiKey}
                                />
                                <Button type="primary" onClick={handleSaveApiKey}>
                                    保存
                                </Button>
                                {apiKey && (
                                    <Button danger onClick={handleClearApiKey}>
                                        清除
                                    </Button>
                                )}
                            </Space.Compact>
                            <Text type="secondary" style={{ fontSize: 12 }}>
                                API Key 仅存储在本地浏览器中。
                                <a href="https://platform.openai.com/api-keys" target="_blank" rel="noreferrer">
                                    获取 API Key →
                                </a>
                            </Text>
                        </Space>
                    </Card>
                )}

                {/* 系统提示词 */}
                <Card className="system-prompt-card" size="small">
                    <div className="system-prompt-row">
                        <Text type="secondary">
                            <SettingOutlined /> 系统提示词：
                        </Text>
                        <Input
                            value={systemPrompt}
                            onChange={(e) => setSystemPrompt(e.target.value)}
                            placeholder="设置 AI 的角色和行为..."
                            variant="borderless"
                            className="system-prompt-input"
                        />
                    </div>
                </Card>

                {/* 消息列表 */}
                <div className="messages-container">
                    {messages.length === 0 ? (
                        <div className="empty-state">
                            <RobotOutlined className="empty-icon" />
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

export default GPTChat;
