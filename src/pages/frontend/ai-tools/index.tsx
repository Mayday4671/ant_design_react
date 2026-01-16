import React, { useEffect, useState, useMemo } from 'react';
import { Typography, Row, Col, Card, Input, Tag, Menu, Spin, Empty, Avatar, Badge, Space } from 'antd';
import {
    SearchOutlined, MessageOutlined, PictureOutlined, EditOutlined,
    VideoCameraOutlined, AudioOutlined, CodeOutlined, FileTextOutlined,
    HighlightOutlined, RightOutlined, LinkOutlined
} from '@ant-design/icons';
import {
    getCategories, getToolsByCategory,
    type AITool, type AICategory
} from '../../../services/ai-tools-mock';
import '../../../assets/styles/pages/frontend/ai-tools.css';

const { Title, Text, Paragraph } = Typography;

// ========== 图标映射 ==========
const iconMap: Record<string, React.ReactNode> = {
    'MessageOutlined': <MessageOutlined />,
    'PictureOutlined': <PictureOutlined />,
    'EditOutlined': <EditOutlined />,
    'VideoCameraOutlined': <VideoCameraOutlined />,
    'AudioOutlined': <AudioOutlined />,
    'CodeOutlined': <CodeOutlined />,
    'FileTextOutlined': <FileTextOutlined />,
    'HighlightOutlined': <HighlightOutlined />,
};

// ========== 颜色映射 ==========
const categoryGradients: Record<string, string> = {
    'chat': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    'image': 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    'writing': 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    'video': 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
    'audio': 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
    'coding': 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
    'office': 'linear-gradient(135deg, #d299c2 0%, #fef9d7 100%)',
    'design': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
};

// ========== 子组件 ==========

// 工具卡片
const ToolCard: React.FC<{ tool: AITool }> = ({ tool }) => {
    const gradient = categoryGradients[tool.category] || categoryGradients['chat'];

    return (
        <a href={tool.url} target="_blank" rel="noopener noreferrer" className="tool-card-link">
            <Card hoverable className="tool-card">
                <div className="tool-card-content">
                    <div
                        className="tool-icon-wrapper"
                        style={{ background: gradient }}
                    >
                        <Avatar
                            src={tool.icon}
                            size={40}
                            className="tool-icon"
                            shape="square"
                            style={{ background: 'transparent' }}
                        >
                            <span style={{ color: '#fff', fontWeight: 600, fontSize: 16 }}>
                                {tool.name[0]}
                            </span>
                        </Avatar>
                    </div>
                    <div className="tool-info">
                        <div className="tool-title-row">
                            <Text strong className="tool-name">{tool.name}</Text>
                            {tool.isHot && <Tag color="red" className="tool-badge">热门</Tag>}
                            {tool.isNew && <Tag color="green" className="tool-badge">新</Tag>}
                        </div>
                        <Paragraph
                            className="tool-description"
                            ellipsis={{ rows: 2 }}
                            type="secondary"
                        >
                            {tool.description}
                        </Paragraph>
                    </div>
                    <LinkOutlined className="tool-link-icon" />
                </div>
            </Card>
        </a>
    );
};

// 分类区块
const CategorySection: React.FC<{
    category: AICategory;
    tools: AITool[];
}> = ({ category, tools }) => (
    <section id={category.id} className="category-section">
        <div className="category-header">
            <Space>
                {iconMap[category.icon]}
                <Title level={4} className="category-title">{category.name}</Title>
                <Tag>{tools.length} 个工具</Tag>
            </Space>
        </div>
        <Row gutter={[16, 16]}>
            {tools.map(tool => (
                <Col xs={24} sm={12} md={8} lg={6} xl={4} key={tool.id}>
                    <ToolCard tool={tool} />
                </Col>
            ))}
        </Row>
    </section>
);

// ========== 主组件 ==========

const AITools: React.FC = () => {
    const [loading, setLoading] = useState(true);
    const [categories, setCategories] = useState<AICategory[]>([]);
    const [toolsByCategory, setToolsByCategory] = useState<Record<string, AITool[]>>({});
    const [searchValue, setSearchValue] = useState('');
    const [activeCategory] = useState<string>('');

    // 热门标签
    const hotTags = ['对话', '绘画', '写作', '编程', '视频', '设计'];

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [catsRes, toolsRes] = await Promise.all([
                    getCategories(),
                    getToolsByCategory(),
                ]);
                setCategories(catsRes.data);
                setToolsByCategory(toolsRes.data);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    // 搜索过滤
    const filteredToolsByCategory = useMemo(() => {
        if (!searchValue) return toolsByCategory;

        const search = searchValue.toLowerCase();
        const filtered: Record<string, AITool[]> = {};

        Object.entries(toolsByCategory).forEach(([catId, tools]) => {
            const matchedTools = tools.filter(t =>
                t.name.toLowerCase().includes(search) ||
                t.description.toLowerCase().includes(search) ||
                t.tags.some(tag => tag.includes(search))
            );
            if (matchedTools.length > 0) {
                filtered[catId] = matchedTools;
            }
        });

        return filtered;
    }, [toolsByCategory, searchValue]);

    // 侧边栏菜单项 - 使用 SubMenu 实现折叠
    const menuItems = [
        {
            key: 'ai-tools',
            icon: <SearchOutlined />,
            label: 'AI 工具分类',
            children: categories.map(cat => ({
                key: cat.id,
                icon: iconMap[cat.icon],
                label: (
                    <a href={`#${cat.id}`}>
                        {cat.name}
                        <Badge count={toolsByCategory[cat.id]?.length || 0} className="category-count" />
                    </a>
                ),
            })),
        },
    ];

    // Note: anchorItems removed as not currently used

    if (loading) {
        return (
            <div className="loading-container">
                <Spin size="large" />
            </div>
        );
    }

    return (
        <div className="ai-tools-container">
            {/* Hero / Search Section */}
            <section className="ai-tools-hero">
                <div className="hero-content">
                    <Title level={2} className="hero-title">
                        🤖 AI 工具导航
                    </Title>
                    <Paragraph className="hero-subtitle">
                        发现最新最热的 AI 工具，提升你的工作效率
                    </Paragraph>
                    <Input
                        placeholder="搜索 AI 工具..."
                        size="large"
                        className="hero-search"
                        prefix={<SearchOutlined />}
                        value={searchValue}
                        onChange={e => setSearchValue(e.target.value)}
                        allowClear
                    />
                    <div className="hero-tags">
                        <Text type="secondary">热门：</Text>
                        {hotTags.map(tag => (
                            <Tag
                                key={tag}
                                className="hot-tag"
                                onClick={() => setSearchValue(tag)}
                            >
                                {tag}
                            </Tag>
                        ))}
                    </div>
                </div>
            </section>

            {/* Main Content */}
            <div className="ai-tools-main">
                {/* Sidebar */}
                <aside className="ai-tools-sidebar">
                    <div className="sidebar-sticky">
                        <Menu
                            mode="inline"
                            selectedKeys={[activeCategory]}
                            defaultOpenKeys={['ai-tools']}
                            items={menuItems}
                            className="sidebar-menu"
                        />
                    </div>
                </aside>

                {/* Content */}
                <main className="ai-tools-content">
                    {Object.keys(filteredToolsByCategory).length === 0 ? (
                        <Empty description="未找到匹配的工具" />
                    ) : (
                        categories
                            .filter(cat => filteredToolsByCategory[cat.id]?.length > 0)
                            .map(cat => (
                                <CategorySection
                                    key={cat.id}
                                    category={cat}
                                    tools={filteredToolsByCategory[cat.id] || []}
                                />
                            ))
                    )}
                </main>
            </div>
        </div>
    );
};

export default AITools;
