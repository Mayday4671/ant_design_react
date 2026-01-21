import React, { useState, useEffect } from 'react';
import { Layout, Menu, Typography, Spin, Empty, Anchor } from 'antd';
import { BookOutlined, FileTextOutlined } from '@ant-design/icons';
import { useSearchParams } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark, oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';
import {
    fetchCategories, fetchDocuments, fetchDocumentById,
    type KnowledgeCategory, type KnowledgeDocument
} from '../../../services/knowledge';
import { useAppTheme } from '../../../contexts';

const { Sider, Content } = Layout;
const { Title, Text } = Typography;

// 生成标题 ID
const generateId = (text: string) => {
    return text
        .toLowerCase()
        .replace(/[^a-z0-9\u4e00-\u9fa5]+/g, '-')
        .replace(/^-|-$/g, '');
};

// 提取标题生成目录
const extractHeadings = (content: string) => {
    const headingRegex = /^(#{1,6})\s+(.+)$/gm;
    const headings: { level: number; text: string; id: string }[] = [];
    let match;

    while ((match = headingRegex.exec(content)) !== null) {
        const level = match[1].length;
        const text = match[2].trim();
        const id = generateId(text);
        headings.push({ level, text, id });
    }

    return headings;
};

const KnowledgeViewer: React.FC = () => {
    const { isDarkMode } = useAppTheme();
    const [searchParams, setSearchParams] = useSearchParams();

    const [categories, setCategories] = useState<KnowledgeCategory[]>([]);
    const [documents, setDocuments] = useState<KnowledgeDocument[]>([]);
    const [selectedDoc, setSelectedDoc] = useState<KnowledgeDocument | null>(null);
    const [loading, setLoading] = useState(true);
    const [contentLoading, setContentLoading] = useState(false);

    const docId = searchParams.get('doc');

    // 加载分类和文档列表
    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            try {
                const [catsRes, docsRes] = await Promise.all([
                    fetchCategories(),
                    fetchDocuments(),
                ]);
                setCategories(catsRes.data);
                setDocuments(docsRes.data);

                // 如果没有选中文档，默认选择第一个
                if (!docId && docsRes.data.length > 0) {
                    setSearchParams({ doc: docsRes.data[0].id });
                }
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);

    // 加载选中的文档内容
    useEffect(() => {
        const loadDoc = async () => {
            if (!docId) return;
            setContentLoading(true);
            try {
                const res = await fetchDocumentById(docId);
                setSelectedDoc(res.data);
            } finally {
                setContentLoading(false);
            }
        };
        loadDoc();
    }, [docId]);

    // 构建侧边栏菜单
    const menuItems = categories.map(cat => {
        const catDocs = documents.filter(d => d.categoryId === cat.id);
        return {
            key: cat.id,
            icon: <BookOutlined />,
            label: cat.name,
            children: catDocs.map(doc => ({
                key: doc.id,
                icon: <FileTextOutlined />,
                label: doc.title,
            })),
        };
    });

    // 目录项
    const headings = selectedDoc ? extractHeadings(selectedDoc.content) : [];
    const tocItems = headings.map(h => ({
        key: h.id,
        href: `#${h.id}`,
        title: h.text,
    }));

    // 自定义 Markdown 渲染器添加 ID
    const createHeadingComponent = (level: 1 | 2 | 3 | 4 | 5 | 6) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return ({ children }: any) => {
            const text = String(children || '');
            const id = generateId(text);
            switch (level) {
                case 1: return <h1 id={id}>{children}</h1>;
                case 2: return <h2 id={id}>{children}</h2>;
                case 3: return <h3 id={id}>{children}</h3>;
                case 4: return <h4 id={id}>{children}</h4>;
                case 5: return <h5 id={id}>{children}</h5>;
                case 6: return <h6 id={id}>{children}</h6>;
            }
        };
    };

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
                <Spin size="large" />
            </div>
        );
    }

    const cardStyle = {
        background: isDarkMode ? 'rgba(30, 30, 45, 0.6)' : 'rgba(255, 255, 255, 0.6)',
        backdropFilter: 'blur(12px)',
        borderRadius: 12,
        border: `1px solid ${isDarkMode ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.4)'}`,
        height: '100%',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column' as const,
    };

    return (
        <Layout style={{ height: '100%', background: 'transparent', padding: '0 4px 12px' }}>
            {/* 左侧文档导航 */}
            <Sider
                width={280}
                style={{
                    background: 'transparent',
                    border: 'none',
                    height: '100%',
                    marginRight: 12,
                }}
            >
                <div style={cardStyle}>
                    <div style={{ padding: '20px 20px 10px', flexShrink: 0 }}>
                        <Title level={5} style={{ margin: 0, display: 'flex', alignItems: 'center' }}>
                            <BookOutlined style={{ marginRight: 8 }} /> 项目文档
                        </Title>
                    </div>
                    <div style={{ flex: 1, overflow: 'auto', padding: '0 12px 12px' }}>
                        <Menu
                            mode="inline"
                            selectedKeys={docId ? [docId] : []}
                            defaultOpenKeys={categories.map(c => c.id)}
                            items={menuItems}
                            onClick={({ key }) => setSearchParams({ doc: key })}
                            style={{ background: 'transparent', border: 'none' }}
                        />
                    </div>
                </div>
            </Sider>

            {/* 中间内容区 */}
            <Content
                style={{
                    height: '100%',
                    overflow: 'hidden',
                }}
            >
                <div style={{
                    ...cardStyle,
                    padding: '32px 48px',
                    overflow: 'auto',
                }}>
                    {contentLoading ? (
                        <div style={{ textAlign: 'center', padding: 48 }}>
                            <Spin size="large" />
                        </div>
                    ) : selectedDoc ? (
                        <div className="markdown-body">
                            <Title level={2}>{selectedDoc.title}</Title>
                            <Text type="secondary" style={{ display: 'block', marginBottom: 24 }}>
                                最后更新：{new Date(selectedDoc.updatedAt).toLocaleString()}
                            </Text>
                            <ReactMarkdown
                                remarkPlugins={[remarkGfm]}
                                components={{
                                    h1: createHeadingComponent(1),
                                    h2: createHeadingComponent(2),
                                    h3: createHeadingComponent(3),
                                    h4: createHeadingComponent(4),
                                    h5: createHeadingComponent(5),
                                    h6: createHeadingComponent(6),
                                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                    code({ inline, className, children, ...props }: any) {
                                        const match = /language-(\w+)/.exec(className || '');
                                        return !inline && match ? (
                                            <SyntaxHighlighter
                                                style={isDarkMode ? oneDark : oneLight}
                                                language={match[1]}
                                                PreTag="div"
                                                {...props}
                                            >
                                                {String(children).replace(/\n$/, '')}
                                            </SyntaxHighlighter>
                                        ) : (
                                            <code className={className} {...props}>
                                                {children}
                                            </code>
                                        );
                                    },
                                }}
                            >
                                {selectedDoc.content}
                            </ReactMarkdown>
                        </div>
                    ) : (
                        <Empty description="请从左侧选择文档" />
                    )}
                </div>
            </Content>

            {/* 右侧目录 */}
            {selectedDoc && headings.length > 0 && (
                <Sider
                    width={240}
                    style={{
                        background: 'transparent',
                        height: '100%',
                        marginLeft: 12,
                    }}
                >
                    <div style={{ ...cardStyle, padding: 20 }}>
                        <Title level={5} style={{ marginBottom: 16, display: 'flex', alignItems: 'center' }}>
                            <FileTextOutlined style={{ marginRight: 8 }} /> 目录
                        </Title>
                        <div style={{ flex: 1, overflow: 'auto' }}>
                            <Anchor
                                items={tocItems}
                                offsetTop={20}
                                style={{ background: 'transparent' }}
                                targetOffset={20}
                            />
                        </div>
                    </div>
                </Sider>
            )}
        </Layout>
    );
};

export default KnowledgeViewer;
