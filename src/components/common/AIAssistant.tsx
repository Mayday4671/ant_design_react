import React, { useState, useRef, useEffect } from 'react';
import { FloatButton, Drawer, Input, Button, Avatar, Spin, message, Typography, Tooltip } from 'antd';
import { RobotOutlined, SendOutlined, UserOutlined, ClearOutlined } from '@ant-design/icons';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark, oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { sendChatMessageStream, getStoredApiKey, type ChatMessage } from '../../services/openai';
import { useAppTheme } from '../../contexts/theme-context';
import '../../assets/styles/components/ai-assistant.css';

const { Text } = Typography;
const { TextArea } = Input;

interface DisplayMessage extends ChatMessage {
    id: string;
    loading?: boolean;
}

const CodeBlock: React.FC<{ inline?: boolean; className?: string; children?: React.ReactNode; isDark: boolean }> = ({
    inline, className, children, isDark
}) => {
    const match = /language-(\w+)/.exec(className || '');
    const language = match ? match[1] : '';
    return !inline && language ? (
        <SyntaxHighlighter
            style={isDark ? oneDark : oneLight}
            language={language}
            PreTag="div"
            customStyle={{ margin: '8px 0', borderRadius: 6, fontSize: 12 }}
        >
            {String(children).replace(/\n$/, '')}
        </SyntaxHighlighter>
    ) : (
        <code className={className} style={{ background: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)', padding: '2px 4px', borderRadius: 4 }}>
            {children}
        </code>
    );
};

const AIAssistant: React.FC = () => {
    const { isDarkMode } = useAppTheme();
    const [visible, setVisible] = useState(false);
    const [messages, setMessages] = useState<DisplayMessage[]>([]);
    const [inputValue, setInputValue] = useState('');
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const apiKey = getStoredApiKey();

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        if (visible) scrollToBottom();
    }, [messages, visible]);

    const handleSend = async () => {
        if (!inputValue.trim() || loading) return;
        if (!apiKey) {
            message.error('管理员尚未配置 API Key');
            return;
        }

        const userMsg: DisplayMessage = {
            id: Date.now().toString(),
            role: 'user',
            content: inputValue.trim(),
        };

        const aiMsg: DisplayMessage = {
            id: (Date.now() + 1).toString(),
            role: 'assistant',
            content: '',
            loading: true,
        };

        setMessages(prev => [...prev, userMsg, aiMsg]);
        setInputValue('');
        setLoading(true);

        const chatMessages: ChatMessage[] = [
            { role: 'system', content: '你是一个智能、友好的 AI 助手，能够回答用户关于本网站内容的问题，或者提供通用的帮助。' },
            ...messages.map(m => ({ role: m.role, content: m.content })),
            { role: 'user', content: userMsg.content },
        ];

        try {
            await sendChatMessageStream(
                chatMessages,
                'gpt-4o-mini',
                apiKey,
                (content) => {
                    setMessages(prev => prev.map(m => m.id === aiMsg.id ? { ...m, content: m.content + content } : m));
                },
                () => {
                    setMessages(prev => prev.map(m => m.id === aiMsg.id ? { ...m, loading: false } : m));
                    setLoading(false);
                },
                (error) => {
                    setMessages(prev => prev.map(m => m.id === aiMsg.id ? { ...m, content: `错误: ${error.message}`, loading: false } : m));
                    setLoading(false);
                }
            );
        } catch (err) {
            setLoading(false);
        }
    };

    return (
        <>
            <FloatButton
                icon={<RobotOutlined />}
                type="primary"
                style={{ right: 90, bottom: 40 }}
                tooltip="AI 助手"
                onClick={() => setVisible(true)}
                badge={{ dot: !apiKey }}
                className="ai-assistant-float-btn"
            />

            <Drawer
                title={
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <RobotOutlined style={{ color: '#1890ff' }} />
                        <span>AI 智能助手</span>
                    </div>
                }
                placement="right"
                onClose={() => setVisible(false)}
                open={visible}
                width={400}
                className={`ai-assistant-drawer ${isDarkMode ? 'dark-mode' : 'light-mode'}`}
                extra={
                    messages.length > 0 && (
                        <Tooltip title="清空对话">
                            <Button type="text" icon={<ClearOutlined />} onClick={() => setMessages([])} />
                        </Tooltip>
                    )
                }
            >
                {!apiKey ? (
                    <div className="ai-config-warning">
                        <RobotOutlined style={{ fontSize: 48, color: '#d9d9d9' }} />
                        <Text type="secondary">AI 助手暂不可用</Text>
                        <Text type="secondary" style={{ fontSize: 12 }}>请联系管理员在后台配置 API Key</Text>
                    </div>
                ) : (
                    <>
                        <div className="ai-assistant-messages">
                            {messages.length === 0 && (
                                <div className="ai-config-warning" style={{ marginTop: 20 }}>
                                    <RobotOutlined style={{ fontSize: 32, color: '#1890ff' }} />
                                    <Text>你好！我是你的 AI 助手，有什么可以帮你的吗？</Text>
                                </div>
                            )}
                            {messages.map(msg => (
                                <div key={msg.id} className={`ai-message-item ${msg.role}`}>
                                    {msg.role === 'assistant' && (
                                        <Avatar icon={<RobotOutlined />} size="small" style={{ background: '#1890ff' }} />
                                    )}
                                    <div className="ai-message-content">
                                        {msg.role === 'user' ? msg.content : (
                                            <ReactMarkdown components={{ code: (props) => <CodeBlock {...props} isDark={isDarkMode} /> }}>
                                                {msg.content}
                                            </ReactMarkdown>
                                        )}
                                        {msg.loading && <Spin size="small" style={{ marginLeft: 8 }} />}
                                    </div>
                                    {msg.role === 'user' && (
                                        <Avatar icon={<UserOutlined />} size="small" style={{ background: '#87d068' }} />
                                    )}
                                </div>
                            ))}
                            <div ref={messagesEndRef} />
                        </div>
                        <div className="ai-assistant-input-area">
                            <TextArea
                                value={inputValue}
                                onChange={e => setInputValue(e.target.value)}
                                placeholder="输入问题..."
                                autoSize={{ minRows: 1, maxRows: 4 }}
                                onPressEnter={e => {
                                    if (!e.shiftKey) { e.preventDefault(); handleSend(); }
                                }}
                                disabled={loading}
                            />
                            <Button type="primary" icon={<SendOutlined />} onClick={handleSend} loading={loading} disabled={!inputValue.trim()} />
                        </div>
                    </>
                )}
            </Drawer>
        </>
    );
};
export default AIAssistant;
