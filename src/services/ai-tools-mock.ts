


import { scrapedTools } from './ai-tools-data';

export interface AICategory {
    id: string;
    name: string;
    icon: string;
}

export interface AITool {
    id: string;
    name: string;
    description: string;
    icon: string; // URL or placeholder
    category: string; // Category ID
    tags: string[];
    url: string;
    isHot?: boolean;
    isNew?: boolean;
}

const categories: AICategory[] = [
    { id: 'chat', name: 'AI 对话', icon: 'MessageOutlined' },
    { id: 'image', name: 'AI 绘画', icon: 'PictureOutlined' },
    { id: 'writing', name: 'AI 写作', icon: 'EditOutlined' },
    { id: 'video', name: 'AI 视频', icon: 'VideoCameraOutlined' },
    { id: 'audio', name: 'AI 音频', icon: 'AudioOutlined' },
    { id: 'coding', name: 'AI 编程', icon: 'CodeOutlined' },
    { id: 'office', name: 'AI 办公', icon: 'FileTextOutlined' },
    { id: 'design', name: 'AI 设计', icon: 'HighlightOutlined' },
];

const tools: AITool[] = [
    // ========== AI 对话 (Chat) ==========
    {
        id: 'chatgpt',
        name: 'ChatGPT',
        description: 'OpenAI 开发的大型语言模型，支持多轮对话、代码生成、文本创作等。',
        icon: '',
        category: 'chat',
        tags: ['OpenAI', 'LLM', '聊天机器人'],
        url: 'https://chat.openai.com',
        isHot: true
    },
    {
        id: 'claude',
        name: 'Claude 3',
        description: 'Anthropic 开发的 AI 助手，擅长长文本分析、写作和编程任务，逻辑性强。',
        icon: '',
        category: 'chat',
        tags: ['Anthropic', '长文本', '安全'],
        url: 'https://claude.ai',
        isHot: true
    },
    {
        id: 'gemini',
        name: 'Gemini',
        description: 'Google 最新的多模态 AI 模型，支持文本、图像和代码，与 Google 生态深度集成。',
        icon: '',
        category: 'chat',
        tags: ['Google', '多模态', '实时联网'],
        url: 'https://gemini.google.com',
        isNew: true
    },
    {
        id: 'kimi',
        name: 'Kimi 智能助手',
        description: '月之暗面开发的 AI 助手，支持超长文本处理（20万字+）和联网搜索。',
        icon: '',
        category: 'chat',
        tags: ['月之暗面', '国产AI', '长文本'],
        url: 'https://kimi.moonshot.cn',
        isHot: true
    },
    {
        id: 'copilot',
        name: 'Microsoft Copilot',
        description: '微软推出的 AI 助手，基于 GPT-4，集成了 Bing 搜索和 Office 办公套件。',
        icon: '',
        category: 'chat',
        tags: ['Microsoft', 'Bing', 'GPT-4'],
        url: 'https://copilot.microsoft.com',
    },
    {
        id: 'perplexity',
        name: 'Perplexity AI',
        description: '基于 AI 的搜索引擎，提供带有引用的精确答案，适合学术研究和资料查找。',
        icon: '',
        category: 'chat',
        tags: ['搜索', '引用', '研究'],
        url: 'https://www.perplexity.ai',
        isNew: true
    },
    {
        id: 'ernie',
        name: '文心一言',
        description: '百度开发的知识增强大语言模型，中文理解能力强。',
        icon: '',
        category: 'chat',
        tags: ['百度', '国产AI', '中文'],
        url: 'https://yiyan.baidu.com',
    },
    {
        id: 'doubao',
        name: '豆包',
        description: '字节跳动推出的 AI 对话助手，语音交互体验优秀。',
        icon: '',
        category: 'chat',
        tags: ['字节跳动', '语音', '生活助手'],
        url: 'https://www.doubao.com',
        isNew: true
    },

    // ========== AI 绘画 (Image) ==========
    {
        id: 'midjourney',
        name: 'Midjourney',
        description: '最流行的 AI 绘画工具，擅长生成艺术风格强烈、细节丰富的高质量图像。',
        icon: '',
        category: 'image',
        tags: ['艺术', '高质量', 'Discord'],
        url: 'https://www.midjourney.com',
        isHot: true
    },
    {
        id: 'stablediffusion',
        name: 'Stable Diffusion',
        description: '开源的 AI 图像生成模型，支持本地部署和高度定制化训练。',
        icon: '',
        category: 'image',
        tags: ['开源', '本地部署', 'ControlNet'],
        url: 'https://stability.ai',
        isHot: true
    },
    {
        id: 'dalle3',
        name: 'DALL·E 3',
        description: 'OpenAI 开发的图像生成模型，语义理解能力极强，集成在 ChatGPT 中。',
        icon: '',
        category: 'image',
        tags: ['OpenAI', '语义理解', '易用'],
        url: 'https://openai.com/dall-e-3',
    },
    {
        id: 'ideogram',
        name: 'Ideogram',
        description: '擅长生成带有准确文字的图像，适合海报和 Logo 设计。',
        icon: '',
        category: 'image',
        tags: ['文字生成', '海报', '设计'],
        url: 'https://ideogram.ai',
        isNew: true
    },
    {
        id: 'firefly',
        name: 'Adobe Firefly',
        description: 'Adobe 推出的创意生成 AI，与 Photoshop 深度集成，版权安全。',
        icon: '',
        category: 'image',
        tags: ['Adobe', '商业安全', '设计'],
        url: 'https://firefly.adobe.com',
    },
    {
        id: 'leonardo',
        name: 'Leonardo.ai',
        description: '功能强大的游戏资产和艺术生成平台，模型微调功能丰富。',
        icon: '',
        category: 'image',
        tags: ['游戏资产', '微调', '免费额度'],
        url: 'https://leonardo.ai',
    },
    {
        id: 'liblib',
        name: 'LiblibAI',
        description: '国内领先的 AI 创作平台，提供大量 Stable Diffusion 模型下载和生图。',
        icon: '',
        category: 'image',
        tags: ['模型站', 'SD', '国产'],
        url: 'https://www.liblib.art',
    },

    // ========== AI 视频 (Video) ==========
    {
        id: 'sora',
        name: 'Sora',
        description: 'OpenAI 发布的文生视频模型，能生成长达一分钟的高质量视频（暂未完全开放）。',
        icon: '',
        category: 'video',
        tags: ['OpenAI', '文生视频', '未开放'],
        url: 'https://openai.com/sora',
        isHot: true
    },
    {
        id: 'runway',
        name: 'Runway Gen-2',
        description: '专业的 AI 视频制作工具，支持文生视频、图生视频和视频风格化。',
        icon: '',
        category: 'video',
        tags: ['视频编辑', '专业', '特效'],
        url: 'https://runwayml.com',
        isHot: true
    },
    {
        id: 'pika',
        name: 'Pika Art',
        description: '创意视频生成平台，擅长动画风格，可控制视频中的运动。',
        icon: '',
        category: 'video',
        tags: ['动画', '文生视频', 'Discord'],
        url: 'https://pika.art',
        isNew: true
    },
    {
        id: 'heygen',
        name: 'HeyGen',
        description: 'AI 数字人视频生成工具，支持嘴型同步和多语言翻译，适合营销视频。',
        icon: '',
        category: 'video',
        tags: ['数字人', '口型同步', '营销'],
        url: 'https://www.heygen.com',
    },
    {
        id: 'luma',
        name: 'Luma Dream Machine',
        description: '高质量的视频生成模型，生成速度快，物理规律模拟较好。',
        icon: '',
        category: 'video',
        tags: ['Luma', '3D', '快速'],
        url: 'https://lumalabs.ai/dream-machine',
        isNew: true
    },
    {
        id: 'clipchamp',
        name: 'Clipchamp',
        description: '微软集成的视频剪辑工具，包含 AI 自动剪辑、语音合成等功能。',
        icon: '',
        category: 'video',
        tags: ['剪辑', 'Microsoft', '易用'],
        url: 'https://clipchamp.com',
    },

    // ========== AI 写作 (Writing) ==========
    {
        id: 'notionai',
        name: 'Notion AI',
        description: '集成在 Notion 中的 AI 写作助手，支持摘要、翻译、润色和扩写。',
        icon: '',
        category: 'writing',
        tags: ['Notion', '笔记', '办公'],
        url: 'https://www.notion.so/product/ai',
        isHot: true
    },
    {
        id: 'jasper',
        name: 'Jasper',
        description: '专为营销人员设计的 AI 写作工具，擅长生成博客、广告文案和社交媒体内容。',
        icon: '',
        category: 'writing',
        tags: ['营销', '文案', '商业'],
        url: 'https://www.jasper.ai',
    },
    {
        id: 'grammarly',
        name: 'Grammarly',
        description: '智能语法检查和写作助手，提供改写建议和语气调整。',
        icon: '',
        category: 'writing',
        tags: ['语法', '润色', '英语'],
        url: 'https://www.grammarly.com',
    },
    {
        id: 'writer',
        name: 'Writer',
        description: '企业级生成式 AI 平台，确保内容符合品牌声音和合规要求。',
        icon: '',
        category: 'writing',
        tags: ['企业', '品牌', '合规'],
        url: 'https://writer.com',
    },
    {
        id: 'xiezuocat',
        name: '秘塔写作猫',
        description: '国产 AI 写作工具，支持长文写作、论文辅助及改写润色。',
        icon: '',
        category: 'writing',
        tags: ['长文', '国产', '论文'],
        url: 'https://xiezuocat.com',
    },

    // ========== AI 音频 (Audio) ==========
    {
        id: 'suno',
        name: 'Suno',
        description: 'AI 音乐生成平台，可根据歌词或描述创作完整的歌曲（含人声）。',
        icon: '',
        category: 'audio',
        tags: ['音乐生成', '写歌', '人声'],
        url: 'https://suno.com',
        isHot: true,
        isNew: true
    },
    {
        id: 'udio',
        name: 'Udio',
        description: '另一款强大的 AI 音乐生成器，音质逼真，风格多样。',
        icon: '',
        category: 'audio',
        tags: ['音乐', '高保真', '创作'],
        url: 'https://www.udio.com',
        isNew: true
    },
    {
        id: 'elevenlabs',
        name: 'ElevenLabs',
        description: '最逼真的 AI 语音合成（TTS）和声音克隆工具。',
        icon: '',
        category: 'audio',
        tags: ['配音', '克隆', 'TTS'],
        url: 'https://elevenlabs.io',
    },
    {
        id: 'fishaudio',
        name: 'Fish Audio',
        description: '新一代语音克隆和合成工具，效果自然。',
        icon: '',
        category: 'audio',
        tags: ['语音', '开源', '克隆'],
        url: 'https://fish.audio',
    },

    // ========== AI 编程 (Coding) ==========
    {
        id: 'cursor',
        name: 'Cursor',
        description: '基于 VS Code 的 AI 代码编辑器，深度集成 GPT-4，支持代码生成和重构。',
        icon: '',
        category: 'coding',
        tags: ['编辑器', 'IDE', 'GPT-4'],
        url: 'https://cursor.sh',
        isHot: true
    },
    {
        id: 'githubcopilot',
        name: 'GitHub Copilot',
        description: 'GitHub 推出的 AI 编程助手，实时提供代码补全建议。',
        icon: '',
        category: 'coding',
        tags: ['补全', '插件', 'GitHub'],
        url: 'https://github.com/features/copilot',
        isHot: true
    },
    {
        id: 'devin',
        name: 'Devin',
        description: 'Cognition 推出的全球首个 AI 软件工程师，能自主完成编码任务。',
        icon: '',
        category: 'coding',
        tags: ['Agent', '自主', '工程师'],
        url: 'https://www.cognition-labs.com/devin',
        isNew: true
    },
    {
        id: 'deepseek',
        name: 'DeepSeek',
        description: '幻方量化旗下的代码模型，开源且性能强大，适合代码补全。',
        icon: '',
        category: 'coding',
        tags: ['开源', '代码模型', '国产'],
        url: 'https://www.deepseek.com',
    },
    {
        id: 'tongyi',
        name: '通义灵码',
        description: '阿里云推出的智能编码助手，支持多种 IDE 和编程语言。',
        icon: '',
        category: 'coding',
        tags: ['阿里', '插件', '免费'],
        url: 'https://tongyi.aliyun.com/lingma',
    },

    // ========== AI 办公 (Office) ==========
    {
        id: 'gamma',
        name: 'Gamma',
        description: 'AI 驱动的 PPT 和网页生成工具，通过对话即可生成精美幻灯片。',
        icon: '',
        category: 'office',
        tags: ['PPT', '演示文稿', '排版'],
        url: 'https://gamma.app',
        isHot: true
    },
    {
        id: 'chatdoc',
        name: 'ChatDOC',
        description: '基于 ChatPDF 的文档阅读工具，支持超长文档分析和表格提取。',
        icon: '',
        category: 'office',
        tags: ['PDF', '阅读', '分析'],
        url: 'https://chatdoc.com',
    },
    {
        id: 'beautifulai',
        name: 'Beautiful.ai',
        description: '智能 PPT 制作软件，自动排版，确保设计美观。',
        icon: '',
        category: 'office',
        tags: ['PPT', '设计', '自动化'],
        url: 'https://www.beautiful.ai',
    },
    {
        id: 'feishu',
        name: '飞书智能伙伴',
        description: '飞书集成的 AI 助手，支持文档总结、会议纪要和自动化流程。',
        icon: '',
        category: 'office',
        tags: ['飞书', '协作', '办公'],
        url: 'https://www.feishu.cn',
    },

    // ========== AI 设计 (Design) ==========
    {
        id: 'canva',
        name: 'Canva Magic',
        description: 'Canva 推出的 AI 设计套件，包含文生图、魔法编辑和自动排版。',
        icon: '',
        category: 'design',
        tags: ['设计', '排版', '多功能'],
        url: 'https://www.canva.com',
        isHot: true
    },
    {
        id: 'figmaai',
        name: 'Figma AI',
        description: 'Figma 的 AI 设计功能，支持自动布局、图层重命名和组件生成。',
        icon: '',
        category: 'design',
        tags: ['UI/UX', '协作', '矢量'],
        url: 'https://www.figma.com',
        isNew: true
    },
    {
        id: 'mastergo',
        name: 'MasterGo AI',
        description: '国产界面设计工具的 AI 功能，支持生成图标、图片和文本。',
        icon: '',
        category: 'design',
        tags: ['UI', '国产', '协作'],
        url: 'https://mastergo.com',
    },
    {
        id: 'khroma',
        name: 'Khroma',
        description: 'AI 配色工具，根据个人喜好生成无限的配色方案。',
        icon: '',
        category: 'design',
        tags: ['配色', '灵感', '色彩'],
        url: 'https://www.khroma.co',
    },

    // 更多占位数据以填充网格...
    {
        id: 'vrew',
        name: 'Vrew',
        description: 'AI 语音识别自动添加字幕的视频剪辑软件。',
        icon: '',
        category: 'video',
        tags: ['字幕', '剪辑', '语音'],
        url: 'https://vrew.voyagerx.com',
    },
    {
        id: 'tome',
        name: 'Tome',
        description: 'AI 讲故事工具，自动生成包含文本和图像的演示文稿。',
        icon: '',
        category: 'office',
        tags: ['故事', 'PPT', '创意'],
        url: 'https://tome.app',
    },
];

export const getCategories = async () => {
    return { data: categories };
};

export const getToolsByCategory = async () => {
    // 模拟数据结构 transformation
    const allTools = [...tools, ...scrapedTools];
    const toolsByCat: Record<string, AITool[]> = {};
    categories.forEach(cat => {
        toolsByCat[cat.id] = allTools.filter(t => t.category === cat.id);
    });
    return { data: toolsByCat };
};

export const getHotTools = async (limit = 6) => {
    const allTools = [...tools, ...scrapedTools];
    const hot = allTools.filter(t => t.isHot).slice(0, limit);
    return { data: hot };
};

export const getNewTools = async (limit = 6) => {
    const allTools = [...tools, ...scrapedTools];
    const fresh = allTools.filter(t => t.isNew).slice(0, limit);
    return { data: fresh };
};
