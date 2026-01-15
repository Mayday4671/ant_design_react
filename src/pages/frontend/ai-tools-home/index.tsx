import React, { useEffect, useState } from 'react';
import { useOutletContext, useSearchParams } from 'react-router-dom';
import { Typography, Row, Col, Card, Tag, Spin, Empty, Avatar, Space } from 'antd';
import {
    MessageOutlined, PictureOutlined, EditOutlined,
    VideoCameraOutlined, AudioOutlined, CodeOutlined, FileTextOutlined,
    HighlightOutlined, FireOutlined, ThunderboltOutlined, RightOutlined,
    LinkOutlined
} from '@ant-design/icons';
import {
    getCategories, getToolsByCategory, getHotTools, getNewTools,
    type AITool, type AICategory
} from '../../../services/ai-tools-mock';
import '../../../assets/styles/pages/frontend/ai-tools-home.css';

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

// ========== 工具卡片组件 ==========
const ToolCard: React.FC<{ tool: AITool }> = ({ tool }) => {
    const gradient = categoryGradients[tool.category] || categoryGradients['chat'];

    return (
        <a href={tool.url} target="_blank" rel="noopener noreferrer" className="tool-card-link">
            <Card hoverable className="tool-card" size="small">
                <div className="tool-card-content">
                    <div className="tool-icon-wrapper" style={{ background: gradient }}>
                        <Avatar
                            src={tool.icon}
                            size={36}
                            shape="square"
                            style={{ background: 'transparent' }}
                        >
                            <span style={{ color: '#fff', fontWeight: 600 }}>
                                {tool.name[0]}
                            </span>
                        </Avatar>
                    </div>
                    <div className="tool-info">
                        <div className="tool-title-row">
                            <Text strong className="tool-name">{tool.name}</Text>
                            {tool.isHot && <Tag color="red" className="tool-badge">热</Tag>}
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

// ========== 分类区块组件 ==========
const CategorySection: React.FC<{
    category: AICategory;
    tools: AITool[];
}> = ({ category, tools }) => (
    <section id={category.id} className="category-section">
        <div className="category-header">
            <Space align="center">
                <span className="category-icon">{iconMap[category.icon]}</span>
                <Title level={4} className="category-title">{category.name}</Title>
                <Tag className="category-count">{tools.length} 个</Tag>
            </Space>
            <a className="view-more">
                查看更多 <RightOutlined />
            </a>
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

// ========== 特色区块组件 ==========
const FeaturedSection: React.FC<{
    title: string;
    icon: React.ReactNode;
    tools: AITool[];
    color: string;
}> = ({ title, icon, tools, color }) => (
    <section className="featured-section">
        <div className="category-header">
            <Space align="center">
                <span className="category-icon" style={{ color }}>{icon}</span>
                <Title level={4} className="category-title">{title}</Title>
            </Space>
            <a className="view-more">
                查看更多 <RightOutlined />
            </a>
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
interface LayoutContext {
    searchValue: string;
    selectedCategory: string;
}

const AIToolsHome: React.FC = () => {
    const [searchParams] = useSearchParams();
    const context = useOutletContext<LayoutContext>();

    const [loading, setLoading] = useState(true);
    const [categories, setCategories] = useState<AICategory[]>([]);
    const [toolsByCategory, setToolsByCategory] = useState<Record<string, AITool[]>>({});
    const [hotTools, setHotTools] = useState<AITool[]>([]);
    const [newTools, setNewTools] = useState<AITool[]>([]);

    // 从 URL 或 context 获取过滤参数
    const searchValue = searchParams.get('search') || context?.searchValue || '';
    const categoryFilter = searchParams.get('category') || '';

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [catsRes, toolsRes, hotRes, newRes] = await Promise.all([
                    getCategories(),
                    getToolsByCategory(),
                    getHotTools(6),
                    getNewTools(6),
                ]);
                setCategories(catsRes.data);
                setToolsByCategory(toolsRes.data);
                setHotTools(hotRes.data);
                setNewTools(newRes.data);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    // 过滤逻辑
    const getFilteredTools = () => {
        let allTools: AITool[] = [];

        if (categoryFilter) {
            allTools = toolsByCategory[categoryFilter] || [];
        } else {
            Object.values(toolsByCategory).forEach(tools => {
                allTools = [...allTools, ...tools];
            });
        }

        if (searchValue) {
            const search = searchValue.toLowerCase();
            allTools = allTools.filter(t =>
                t.name.toLowerCase().includes(search) ||
                t.description.toLowerCase().includes(search) ||
                t.tags.some(tag => tag.includes(search))
            );
        }

        return allTools;
    };

    if (loading) {
        return (
            <div className="loading-container">
                <Spin size="large" />
            </div>
        );
    }

    // 如果有搜索或分类过滤，显示过滤结果
    if (searchValue || categoryFilter) {
        const filteredTools = getFilteredTools();
        const categoryName = categoryFilter
            ? categories.find(c => c.id === categoryFilter)?.name
            : '搜索结果';

        return (
            <div className="ai-tools-home">
                <section className="category-section">
                    <div className="category-header">
                        <Space align="center">
                            <Title level={4} className="category-title">
                                {searchValue ? `"${searchValue}" 搜索结果` : categoryName}
                            </Title>
                            <Tag className="category-count">{filteredTools.length} 个</Tag>
                        </Space>
                    </div>
                    {filteredTools.length === 0 ? (
                        <Empty description="未找到匹配的工具" />
                    ) : (
                        <Row gutter={[16, 16]}>
                            {filteredTools.map(tool => (
                                <Col xs={24} sm={12} md={8} lg={6} xl={4} key={tool.id}>
                                    <ToolCard tool={tool} />
                                </Col>
                            ))}
                        </Row>
                    )}
                </section>
            </div>
        );
    }

    // 默认首页展示
    return (
        <div className="ai-tools-home">
            {/* 热门推荐 */}
            <FeaturedSection
                title="热门推荐"
                icon={<FireOutlined />}
                tools={hotTools}
                color="#f5222d"
            />

            {/* 最新上线 */}
            <FeaturedSection
                title="最新上线"
                icon={<ThunderboltOutlined />}
                tools={newTools}
                color="#52c41a"
            />

            {/* 按分类展示 */}
            {categories.map(cat => (
                <CategorySection
                    key={cat.id}
                    category={cat}
                    tools={toolsByCategory[cat.id] || []}
                />
            ))}
        </div>
    );
};

export default AIToolsHome;
