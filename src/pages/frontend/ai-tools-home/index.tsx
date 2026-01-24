import React, { useEffect, useState } from 'react';
import { useOutletContext, useSearchParams, useNavigate } from 'react-router-dom';
import { Typography, Row, Col, Card, Tag, Spin, Empty, Avatar, Space, FloatButton, Tooltip } from 'antd';
import {
    MessageOutlined, PictureOutlined, EditOutlined,
    VideoCameraOutlined, AudioOutlined, CodeOutlined, FileTextOutlined,
    HighlightOutlined, FireOutlined, ThunderboltOutlined,
    LinkOutlined, RobotOutlined
} from '@ant-design/icons';
import {
    getCategories, getToolsByCategory, getHotTools, getNewTools,
    type AITool, type AICategory
} from '../../../services/ai-tools-mock';
import BorderBeam from '../../../components/BorderBeam';
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

    // 使用Google Favicon API获取图标（解决CORS跨域问题）
    const getFaviconUrl = (url: string) => {
        try {
            const domain = new URL(url).hostname;
            return `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;
        } catch {
            return '';
        }
    };

    const iconUrl = getFaviconUrl(tool.url);

    return (
        <a href={tool.url} target="_blank" rel="noopener noreferrer" className="tool-card-link">
            <Card hoverable className="tool-card" size="small">
                <BorderBeam
                    colorFrom="rgba(99, 102, 241, 0.8)"
                    colorTo="rgba(168, 85, 247, 0.8)"
                    duration={3}
                    borderRadius={12}
                />
                <div className="tool-card-content">
                    <div className="tool-icon-wrapper" style={{ background: gradient }}>
                        <Avatar
                            src={iconUrl}
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
    <section id={`category-${category.id}`} className="category-section">
        <div className="category-header">
            <Space align="center">
                <span className="category-icon">{iconMap[category.icon]}</span>
                <Title level={4} className="category-title">{category.name}</Title>
                <Tag className="category-count">{tools.length} 个</Tag>
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
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const context = useOutletContext<LayoutContext>();

    const [loading, setLoading] = useState(true);
    const [categories, setCategories] = useState<AICategory[]>([]);
    const [toolsByCategory, setToolsByCategory] = useState<Record<string, AITool[]>>({});
    const [hotTools, setHotTools] = useState<AITool[]>([]);
    const [newTools, setNewTools] = useState<AITool[]>([]);

    // 从 URL 或 context 获取过滤参数
    const searchValue = searchParams.get('search') || context?.searchValue || '';
    const categoryFilter = searchParams.get('category') || '';
    const subCategoryFilter = searchParams.get('sub') || ''; // 子分类过滤

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

            // 如果有子分类过滤，进一步筛选
            if (subCategoryFilter) {
                allTools = allTools.filter(t =>
                    t.subCategory === subCategoryFilter ||
                    // 如果子分类是 xxx-all，则显示该分类下所有工具
                    subCategoryFilter.endsWith('-all')
                );
            }
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

    // 只有搜索时才显示过滤结果（分类现在是锚点跳转模式）
    if (searchValue) {
        const filteredTools = getFilteredTools();

        // 获取显示名称
        const categoryName = categoryFilter
            ? categories.find(c => c.id === categoryFilter)?.name || categoryFilter
            : '搜索结果';

        // 子分类配置
        const subCategoryConfig: Record<string, { key: string; label: string }[]> = {
            writing: [
                { key: 'all', label: '全部' },
                { key: 'writing-paper', label: 'AI论文写作' },
                { key: 'writing-novel', label: 'AI小说创作' },
                { key: 'writing-copy', label: 'AI营销文案' },
                { key: 'writing-doc', label: 'AI公文写作' },
            ],
            image: [
                { key: 'all', label: '全部' },
                { key: 'image-gen', label: 'AI图像生成' },
                { key: 'image-edit', label: 'AI图片编辑' },
                { key: 'image-remove', label: 'AI抠图去背' },
                { key: 'image-model', label: 'AI模型社区' },
            ],
            video: [
                { key: 'all', label: '全部' },
                { key: 'video-gen', label: 'AI视频生成' },
                { key: 'video-edit', label: 'AI视频编辑' },
                { key: 'video-avatar', label: 'AI数字人' },
            ],
            office: [
                { key: 'all', label: '全部' },
                { key: 'office-ppt', label: 'AI PPT生成' },
                { key: 'office-doc', label: 'AI文档处理' },
                { key: 'office-data', label: 'AI数据分析' },
                { key: 'office-meet', label: 'AI会议助手' },
            ],
            chat: [
                { key: 'all', label: '全部' },
                { key: 'chat-cn', label: '国产大模型' },
                { key: 'chat-global', label: '海外大模型' },
                { key: 'chat-role', label: 'AI角色扮演' },
            ],
            coding: [
                { key: 'all', label: '全部' },
                { key: 'coding-ide', label: 'AI编程IDE' },
                { key: 'coding-assist', label: 'AI代码助手' },
                { key: 'coding-nocode', label: 'AI零代码开发' },
            ],
        };

        const subCategories = subCategoryConfig[categoryFilter] || [];
        const hasSubCategories = subCategories.length > 0 && !searchValue;

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

                    {/* 子分类标签过滤器 */}
                    {hasSubCategories && (
                        <div className="sub-category-filter">
                            {subCategories.map(sub => (
                                <Tag
                                    key={sub.key}
                                    className={`sub-category-tag ${subCategoryFilter === sub.key || (sub.key === 'all' && !subCategoryFilter) ? 'active' : ''}`}
                                    onClick={() => {
                                        if (sub.key === 'all') {
                                            setSearchParams({ category: categoryFilter });
                                        } else {
                                            setSearchParams({ category: categoryFilter, sub: sub.key });
                                        }
                                    }}
                                >
                                    {sub.label}
                                </Tag>
                            ))}
                        </div>
                    )}

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

            {/* 浮动按钮组 */}
            <FloatButton.Group shape="circle" style={{ right: 3, bottom: 40 }}>
                <Tooltip title="AI 智能对话" placement="left">
                    <FloatButton
                        icon={<RobotOutlined />}
                        className="ai-chat-button"
                        type="primary"
                        onClick={() => navigate('/ai-chat')}
                    />
                </Tooltip>
                <FloatButton.BackTop visibilityHeight={300} className="ai-backtop-button" />
            </FloatButton.Group>
        </div>
    );
};

export default AIToolsHome;
