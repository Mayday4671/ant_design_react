import type { AITool } from './ai-tools-mock';

// AI工具数据 - 完整版（含图标和子分类）
// 更新时间: 2026-01-16
// 参考: ai-bot.cn 分类体系

export const scrapedTools: AITool[] = [
    // ==================== AI 写作 ====================
    // 论文写作
    { id: 'xiezuomao', name: '秘塔写作猫', description: '国产AI写作工具，支持长文写作、论文辅助', icon: 'https://xiezuocat.com/favicon.ico', category: 'writing', subCategory: 'writing-paper', tags: ['长文', '论文'], url: 'https://xiezuocat.com', isHot: true },
    { id: 'biling', name: '笔灵AI写作', description: 'AI一键生成论文/小说，支持降重降AI率', icon: 'https://ibiling.cn/favicon.ico', category: 'writing', subCategory: 'writing-paper', tags: ['论文', '降重'], url: 'https://ibiling.cn', isHot: true },
    { id: 'paperpal', name: 'Paperpal', description: '英文论文写作助手', icon: 'https://paperpal.cn/favicon.ico', category: 'writing', subCategory: 'writing-paper', tags: ['英文', '论文'], url: 'https://paperpal.cn' },
    { id: 'qianbi', name: '千笔AI论文', description: '论文无限改稿平台', icon: 'https://qianbi.com/favicon.ico', category: 'writing', subCategory: 'writing-paper', tags: ['论文', '改稿'], url: 'https://qianbi.com' },
    { id: 'maomao', name: '茅茅虫', description: '一站式AI论文写作助手', icon: 'https://maomaochong.com/favicon.ico', category: 'writing', subCategory: 'writing-paper', tags: ['论文'], url: 'https://maomaochong.com' },
    // 小说创作
    { id: 'wawa', name: '蛙蛙写作', description: 'AI小说和内容创作工具', icon: 'https://wawa.com/favicon.ico', category: 'writing', subCategory: 'writing-novel', tags: ['小说', '创作'], url: 'https://wawa.com' },
    { id: 'luobi', name: '落笔AI', description: '专注于小说网文创作', icon: 'https://luobi.com/favicon.ico', category: 'writing', subCategory: 'writing-novel', tags: ['小说', '网文'], url: 'https://luobi.com' },
    // 营销文案
    { id: 'jasper', name: 'Jasper', description: '专为营销人员设计的AI写作工具', icon: 'https://www.jasper.ai/favicon.ico', category: 'writing', subCategory: 'writing-copy', tags: ['营销', '文案'], url: 'https://www.jasper.ai' },
    { id: 'copy', name: 'Copy.ai', description: 'AI营销文案生成工具', icon: 'https://www.copy.ai/favicon.ico', category: 'writing', subCategory: 'writing-copy', tags: ['文案', '营销'], url: 'https://www.copy.ai' },
    { id: 'gaodingcopy', name: '稿定AI文案', description: '小红书、公众号、短视频文案生成', icon: 'https://www.gaoding.com/favicon.ico', category: 'writing', subCategory: 'writing-copy', tags: ['文案', '社媒'], url: 'https://www.gaoding.com/copy' },
    // 公文写作
    { id: 'miaobi', name: '新华妙笔', description: '新华社推出的体制内办公学习平台', icon: 'https://miaobi.xinhuaskl.com/favicon.ico', category: 'writing', subCategory: 'writing-doc', tags: ['公文', '体制内'], url: 'https://miaobi.xinhuaskl.com' },
    // 通用写作
    { id: 'xfhuiwen', name: '讯飞绘文', description: '讯飞推出的免费AI写作工具', icon: 'https://huiwen.iflyrec.com/favicon.ico', category: 'writing', tags: ['讯飞', '免费'], url: 'https://huiwen.iflyrec.com' },
    { id: 'effidit', name: 'Effidit', description: '腾讯AI Lab推出的智能写作助手', icon: 'https://effidit.qq.com/favicon.ico', category: 'writing', tags: ['腾讯'], url: 'https://effidit.qq.com' },
    { id: 'notion', name: 'Notion AI', description: 'Notion集成的AI写作助手', icon: 'https://www.notion.so/favicon.ico', category: 'writing', tags: ['笔记', '协作'], url: 'https://www.notion.so/product/ai', isHot: true },
    { id: 'guangsu', name: '光速写作', description: 'AI写作、PPT生成工具', icon: 'https://guangsu.com/favicon.ico', category: 'writing', tags: ['PPT', '长文'], url: 'https://guangsu.com' },

    // ==================== AI 图像 ====================
    // 图像生成
    { id: 'jimeng', name: '即梦AI', description: '抖音旗下免费AI图片和视频创作工具', icon: 'https://jimeng.jianying.com/favicon.ico', category: 'image', subCategory: 'image-gen', tags: ['抖音', '免费'], url: 'https://jimeng.jianying.com', isHot: true },
    { id: 'midjourney', name: 'Midjourney', description: '最流行的AI绘画工具', icon: 'https://www.midjourney.com/favicon.ico', category: 'image', subCategory: 'image-gen', tags: ['艺术', '高质量'], url: 'https://www.midjourney.com', isHot: true },
    { id: 'stablediffusion', name: 'Stable Diffusion', description: '开源的AI图像生成模型', icon: 'https://stability.ai/favicon.ico', category: 'image', subCategory: 'image-gen', tags: ['开源', 'SD'], url: 'https://stability.ai', isHot: true },
    { id: 'dalle', name: 'DALL·E 3', description: 'OpenAI的图像生成模型', icon: 'https://openai.com/favicon.ico', category: 'image', subCategory: 'image-gen', tags: ['OpenAI'], url: 'https://openai.com/dall-e-3' },
    { id: 'keling', name: '可灵AI', description: '快手推出的视频和图像生成大模型', icon: 'https://klingai.kuaishou.com/favicon.ico', category: 'image', subCategory: 'image-gen', tags: ['快手'], url: 'https://klingai.kuaishou.com', isHot: true },
    { id: 'wanxiang', name: '通义万相', description: '阿里推出的AI创意生成助手', icon: 'https://tongyi.aliyun.com/favicon.ico', category: 'image', subCategory: 'image-gen', tags: ['阿里'], url: 'https://tongyi.aliyun.com/wanxiang' },
    { id: 'huiwa', name: '绘蛙', description: 'AI电商营销工具，免费生成商品图', icon: 'https://huiwa.com/favicon.ico', category: 'image', subCategory: 'image-gen', tags: ['电商'], url: 'https://huiwa.com', isHot: true },
    { id: 'duiyou', name: '堆友AI', description: '阿里推出的免费AI绘画神器', icon: 'https://d.design/favicon.ico', category: 'image', subCategory: 'image-gen', tags: ['阿里', '免费'], url: 'https://d.design' },
    { id: 'miaohua', name: '秒画', description: '商汤科技的免费AI作画平台', icon: 'https://miaohua.sensetime.com/favicon.ico', category: 'image', subCategory: 'image-gen', tags: ['商汤', '免费'], url: 'https://miaohua.sensetime.com' },
    { id: 'ideogram', name: 'Ideogram', description: '擅长生成带文字的图像', icon: 'https://ideogram.ai/favicon.ico', category: 'image', subCategory: 'image-gen', tags: ['文字生成'], url: 'https://ideogram.ai', isNew: true },
    { id: 'leonardo', name: 'Leonardo.ai', description: '游戏资产和艺术生成平台', icon: 'https://leonardo.ai/favicon.ico', category: 'image', subCategory: 'image-gen', tags: ['游戏资产'], url: 'https://leonardo.ai' },
    { id: 'firefly', name: 'Adobe Firefly', description: 'Adobe推出的创意生成AI', icon: 'https://firefly.adobe.com/favicon.ico', category: 'image', subCategory: 'image-gen', tags: ['Adobe', '设计'], url: 'https://firefly.adobe.com' },
    // 图片编辑
    { id: 'gaoding', name: '稿定AI', description: 'AI绘图、抠图消除一站式平台', icon: 'https://www.gaoding.com/favicon.ico', category: 'image', subCategory: 'image-edit', tags: ['设计', '修图'], url: 'https://www.gaoding.com/ai' },
    { id: 'picwish', name: '佐糖', description: '一键抠图、图片修复、AI绘画', icon: 'https://picwish.cn/favicon.ico', category: 'image', subCategory: 'image-edit', tags: ['抠图', '修复'], url: 'https://picwish.cn' },
    // 抠图去背
    { id: 'remove', name: 'Remove.bg', description: '在线智能抠图去背景工具', icon: 'https://www.remove.bg/favicon.ico', category: 'image', subCategory: 'image-remove', tags: ['抠图', '去背景'], url: 'https://www.remove.bg' },
    { id: 'koukoutu', name: '抠抠图', description: '免费在线AI抠图工具', icon: 'https://www.koutu.com/favicon.ico', category: 'image', subCategory: 'image-remove', tags: ['抠图', '工具'], url: 'https://www.koutu.com' },
    // 模型社区
    { id: 'liblib', name: 'LiblibAI', description: '国内领先的AI创作平台', icon: 'https://www.liblib.art/favicon.ico', category: 'image', subCategory: 'image-model', tags: ['模型站', 'SD'], url: 'https://www.liblib.art', isHot: true },
    { id: 'tusi', name: '吐司AI', description: '国内知名SD模型社区', icon: 'https://tusiart.com/favicon.ico', category: 'image', subCategory: 'image-model', tags: ['模型', 'SD'], url: 'https://tusiart.com' },
    { id: 'civitai', name: 'Civitai', description: '全球最大AI模型分享社区', icon: 'https://civitai.com/favicon.ico', category: 'image', subCategory: 'image-model', tags: ['模型', '社区'], url: 'https://civitai.com' },

    // ==================== AI 视频 ====================
    // 视频生成
    { id: 'hailuovideo', name: '海螺视频', description: 'MiniMax推出的高质量视频生成', icon: 'https://hailuoai.video/favicon.ico', category: 'video', subCategory: 'video-gen', tags: ['MiniMax', '高质量'], url: 'https://hailuoai.video', isHot: true, isNew: true },
    { id: 'vidu', name: 'Vidu', description: '生数科技原创视频大模型', icon: 'https://www.vidu.studio/favicon.ico', category: 'video', subCategory: 'video-gen', tags: ['原创'], url: 'https://www.vidu.studio', isNew: true },
    { id: 'runway', name: 'Runway', description: '专业AI视频制作工具', icon: 'https://runwayml.com/favicon.ico', category: 'video', subCategory: 'video-gen', tags: ['专业', '编辑'], url: 'https://runwayml.com', isHot: true },
    { id: 'pika', name: 'Pika', description: '创意视频生成平台', icon: 'https://pika.art/favicon.ico', category: 'video', subCategory: 'video-gen', tags: ['动画', '创意'], url: 'https://pika.art', isNew: true },
    { id: 'luma', name: 'Luma Dream Machine', description: '高质量视频生成模型', icon: 'https://lumalabs.ai/favicon.ico', category: 'video', subCategory: 'video-gen', tags: ['Luma', '3D'], url: 'https://lumalabs.ai/dream-machine', isNew: true },
    { id: 'sora', name: 'Sora', description: 'OpenAI文生视频模型', icon: 'https://openai.com/favicon.ico', category: 'video', subCategory: 'video-gen', tags: ['OpenAI'], url: 'https://openai.com/sora', isHot: true },
    { id: 'jimengvideo', name: '即梦视频', description: '一站式AI视频生成', icon: 'https://jimeng.jianying.com/favicon.ico', category: 'video', subCategory: 'video-gen', tags: ['即梦'], url: 'https://jimeng.jianying.com', isHot: true },
    { id: 'huasheng', name: '花生AI', description: 'B站原生AI视频工具', icon: 'https://huasheng.bilibili.com/favicon.ico', category: 'video', subCategory: 'video-gen', tags: ['B站'], url: 'https://huasheng.bilibili.com', isNew: true },
    // 视频编辑
    { id: 'vrew', name: 'Vrew', description: 'AI语音识别自动添加字幕', icon: 'https://vrew.voyagerx.com/favicon.ico', category: 'video', subCategory: 'video-edit', tags: ['字幕', '剪辑'], url: 'https://vrew.voyagerx.com' },
    { id: 'clipchamp', name: 'Clipchamp', description: '微软视频剪辑工具', icon: 'https://clipchamp.com/favicon.ico', category: 'video', subCategory: 'video-edit', tags: ['Microsoft', '剪辑'], url: 'https://clipchamp.com' },
    // 数字人
    { id: 'heygen', name: 'HeyGen', description: 'AI数字人视频生成', icon: 'https://www.heygen.com/favicon.ico', category: 'video', subCategory: 'video-avatar', tags: ['数字人'], url: 'https://www.heygen.com' },
    { id: 'youyan', name: '有言', description: '视频创作和3D数字人生成', icon: 'https://www.youyan.xyz/favicon.ico', category: 'video', subCategory: 'video-avatar', tags: ['3D', '数字人'], url: 'https://www.youyan.xyz' },

    // ==================== AI 办公 ====================
    // PPT生成
    { id: 'gamma', name: 'Gamma', description: 'AI驱动的PPT和网页生成', icon: 'https://gamma.app/favicon.ico', category: 'office', subCategory: 'office-ppt', tags: ['PPT', '演示'], url: 'https://gamma.app', isHot: true },
    { id: 'aippt', name: 'AiPPT', description: 'AI快速生成高质量PPT', icon: 'https://www.aippt.cn/favicon.ico', category: 'office', subCategory: 'office-ppt', tags: ['PPT'], url: 'https://www.aippt.cn', isHot: true },
    { id: 'beautifulai', name: 'Beautiful.ai', description: '智能PPT制作软件', icon: 'https://www.beautiful.ai/favicon.ico', category: 'office', subCategory: 'office-ppt', tags: ['PPT', '设计'], url: 'https://www.beautiful.ai' },
    { id: 'tome', name: 'Tome', description: 'AI讲故事工具', icon: 'https://tome.app/favicon.ico', category: 'office', subCategory: 'office-ppt', tags: ['故事', 'PPT'], url: 'https://tome.app' },
    // 文档处理
    { id: 'chatdoc', name: 'ChatDOC', description: '文档阅读工具，支持超长文档', icon: 'https://chatdoc.com/favicon.ico', category: 'office', subCategory: 'office-doc', tags: ['PDF', '阅读'], url: 'https://chatdoc.com' },
    { id: 'napkin', name: 'Napkin', description: 'AI将文字转换为图表', icon: 'https://napkin.ai/favicon.ico', category: 'office', subCategory: 'office-doc', tags: ['图表'], url: 'https://www.napkin.ai', isNew: true },
    // 数据分析
    { id: 'raccoons', name: '办公小浣熊', description: '最强AI数据分析助手', icon: 'https://raccoon.sensetime.com/favicon.ico', category: 'office', subCategory: 'office-data', tags: ['数据分析', '商汤'], url: 'https://raccoon.sensetime.com', isHot: true },
    // 会议助手
    { id: 'otter', name: 'Otter.ai', description: 'AI会议记录和转录', icon: 'https://otter.ai/favicon.ico', category: 'office', subCategory: 'office-meet', tags: ['会议', '转录'], url: 'https://otter.ai' },
    { id: 'feishu', name: '飞书智能伙伴', description: '飞书AI助手', icon: 'https://www.feishu.cn/favicon.ico', category: 'office', subCategory: 'office-meet', tags: ['飞书', '协作'], url: 'https://www.feishu.cn' },
    // 通用
    { id: 'copilot', name: 'Microsoft Copilot', description: '微软AI助手，集成Office', icon: 'https://copilot.microsoft.com/favicon.ico', category: 'office', tags: ['Microsoft', 'Office'], url: 'https://copilot.microsoft.com', isHot: true },

    // ==================== AI 智能体 ====================
    { id: 'coze', name: '扣子', description: '字节跳动的AI Bot开发平台', icon: 'https://www.coze.cn/favicon.ico', category: 'agent', tags: ['字节', 'Bot'], url: 'https://www.coze.cn', isHot: true },
    { id: 'dify', name: 'Dify', description: '开源的LLM应用开发平台', icon: 'https://dify.ai/favicon.ico', category: 'agent', tags: ['开源', 'LLM'], url: 'https://dify.ai', isHot: true },
    { id: 'gpts', name: 'GPTs', description: 'OpenAI的自定义GPT商店', icon: 'https://openai.com/favicon.ico', category: 'agent', tags: ['OpenAI', '商店'], url: 'https://chat.openai.com/gpts', isHot: true },
    { id: 'bailian', name: '百炼', description: '阿里云的AI应用开发平台', icon: 'https://bailian.aliyun.com/favicon.ico', category: 'agent', tags: ['阿里', '平台'], url: 'https://bailian.aliyun.com' },
    { id: 'autogpt', name: 'AutoGPT', description: '自主运行的AI代理项目', icon: 'https://agpt.co/favicon.ico', category: 'agent', tags: ['开源', '自主'], url: 'https://agpt.co' },
    { id: 'devin', name: 'Devin', description: '全球首个AI软件工程师', icon: 'https://www.cognition-labs.com/favicon.ico', category: 'agent', tags: ['Agent', '工程师'], url: 'https://www.cognition-labs.com/devin', isNew: true },
    { id: 'langchain', name: 'LangChain', description: 'LLM应用开发框架', icon: 'https://www.langchain.com/favicon.ico', category: 'agent', tags: ['框架', '开发'], url: 'https://www.langchain.com' },
    { id: 'flowise', name: 'Flowise', description: '可视化LLM应用构建工具', icon: 'https://flowiseai.com/favicon.ico', category: 'agent', tags: ['可视化', '低代码'], url: 'https://flowiseai.com' },

    // ==================== AI 聊天 ====================
    // 国产大模型
    { id: 'doubao', name: '豆包', description: '字节跳动智能对话助手', icon: 'https://www.doubao.com/favicon.ico', category: 'chat', subCategory: 'chat-cn', tags: ['字节', '对话'], url: 'https://www.doubao.com', isHot: true },
    { id: 'kimi', name: 'Kimi', description: '月之暗面AI助手，支持20万字长文本', icon: 'https://kimi.moonshot.cn/favicon.ico', category: 'chat', subCategory: 'chat-cn', tags: ['月之暗面', '长文本'], url: 'https://kimi.moonshot.cn', isHot: true },
    { id: 'yiyan', name: '文心一言', description: '百度知识增强大语言模型', icon: 'https://yiyan.baidu.com/favicon.ico', category: 'chat', subCategory: 'chat-cn', tags: ['百度', '中文'], url: 'https://yiyan.baidu.com', isHot: true },
    { id: 'tongyi', name: '通义千问', description: '阿里云智能对话助手', icon: 'https://tongyi.aliyun.com/favicon.ico', category: 'chat', subCategory: 'chat-cn', tags: ['阿里'], url: 'https://tongyi.aliyun.com', isHot: true },
    { id: 'hunyuan', name: '腾讯混元', description: '腾讯大语言模型', icon: 'https://hunyuan.tencent.com/favicon.ico', category: 'chat', subCategory: 'chat-cn', tags: ['腾讯'], url: 'https://hunyuan.tencent.com' },
    { id: 'zhipu', name: '智谱清言', description: '智谱AI对话助手', icon: 'https://chatglm.cn/favicon.ico', category: 'chat', subCategory: 'chat-cn', tags: ['智谱', 'GLM'], url: 'https://chatglm.cn' },
    { id: 'xunfei', name: '讯飞星火', description: '科大讯飞认知大模型', icon: 'https://xinghuo.xfyun.cn/favicon.ico', category: 'chat', subCategory: 'chat-cn', tags: ['讯飞'], url: 'https://xinghuo.xfyun.cn' },
    // 海外大模型
    { id: 'chatgpt', name: 'ChatGPT', description: 'OpenAI开发的大语言模型', icon: 'https://chat.openai.com/favicon.ico', category: 'chat', subCategory: 'chat-global', tags: ['OpenAI', 'GPT'], url: 'https://chat.openai.com', isHot: true },
    { id: 'claude', name: 'Claude', description: 'Anthropic开发的AI助手', icon: 'https://claude.ai/favicon.ico', category: 'chat', subCategory: 'chat-global', tags: ['Anthropic', '安全'], url: 'https://claude.ai', isHot: true },
    { id: 'gemini', name: 'Gemini', description: 'Google的多模态AI模型', icon: 'https://gemini.google.com/favicon.ico', category: 'chat', subCategory: 'chat-global', tags: ['Google', '多模态'], url: 'https://gemini.google.com', isHot: true },
    // 角色扮演
    { id: 'character', name: 'Character.AI', description: '与虚拟角色对话', icon: 'https://character.ai/favicon.ico', category: 'chat', subCategory: 'chat-role', tags: ['角色', '娱乐'], url: 'https://character.ai' },

    // ==================== AI 编程 ====================
    // AI编程IDE
    { id: 'cursor', name: 'Cursor', description: '基于VS Code的AI代码编辑器', icon: 'https://cursor.sh/favicon.ico', category: 'coding', subCategory: 'coding-ide', tags: ['编辑器', 'IDE'], url: 'https://cursor.sh', isHot: true },
    { id: 'trae', name: 'TRAE', description: '字节推出的AI编程IDE', icon: 'https://www.trae.ai/favicon.ico', category: 'coding', subCategory: 'coding-ide', tags: ['字节', 'IDE'], url: 'https://www.trae.ai', isNew: true },
    { id: 'windsurf', name: 'Windsurf', description: 'Codeium的AI编程IDE', icon: 'https://codeium.com/favicon.ico', category: 'coding', subCategory: 'coding-ide', tags: ['IDE'], url: 'https://codeium.com/windsurf', isNew: true },
    { id: 'replit', name: 'Replit AI', description: '在线编程平台AI助手', icon: 'https://replit.com/favicon.ico', category: 'coding', subCategory: 'coding-ide', tags: ['在线', 'IDE'], url: 'https://replit.com' },
    // AI代码助手
    { id: 'copilotcode', name: 'GitHub Copilot', description: 'GitHub的AI编程助手', icon: 'https://github.com/favicon.ico', category: 'coding', subCategory: 'coding-assist', tags: ['补全', 'GitHub'], url: 'https://github.com/features/copilot', isHot: true },
    { id: 'tongyilingma', name: '通义灵码', description: '阿里云智能编码助手', icon: 'https://tongyi.aliyun.com/favicon.ico', category: 'coding', subCategory: 'coding-assist', tags: ['阿里', '免费'], url: 'https://tongyi.aliyun.com/lingma' },
    { id: 'codegeex', name: 'CodeGeeX', description: '智谱AI免费编程助手', icon: 'https://codegeex.cn/favicon.ico', category: 'coding', subCategory: 'coding-assist', tags: ['智谱', '开源'], url: 'https://codegeex.cn' },
    { id: 'deepseek', name: 'DeepSeek', description: '幻方量化代码模型', icon: 'https://www.deepseek.com/favicon.ico', category: 'coding', subCategory: 'coding-assist', tags: ['开源'], url: 'https://www.deepseek.com', isHot: true },
    // AI零代码开发
    { id: 'v0', name: 'v0.dev', description: 'Vercel的AI前端代码生成', icon: 'https://v0.dev/favicon.ico', category: 'coding', subCategory: 'coding-nocode', tags: ['前端', 'Vercel'], url: 'https://v0.dev', isNew: true },
    { id: 'bolt', name: 'Bolt.new', description: 'StackBlitz的AI全栈开发', icon: 'https://bolt.new/favicon.ico', category: 'coding', subCategory: 'coding-nocode', tags: ['全栈', '在线'], url: 'https://bolt.new', isNew: true },
    { id: 'haisnap', name: '响指HaiSnap', description: 'AI零代码应用开发平台', icon: 'https://haisnap.com/favicon.ico', category: 'coding', subCategory: 'coding-nocode', tags: ['零代码', '开发'], url: 'https://haisnap.com' },
    { id: 'miaoda', name: '秒哒', description: '百度推出的无代码AI应用开发平台', icon: 'https://miaoda.baidu.com/favicon.ico', category: 'coding', subCategory: 'coding-nocode', tags: ['百度', '无代码'], url: 'https://miaoda.baidu.com', isNew: true },

    // ==================== AI 设计 ====================
    { id: 'canva', name: 'Canva', description: 'AI设计套件', icon: 'https://www.canva.cn/favicon.ico', category: 'design', tags: ['设计', '排版'], url: 'https://www.canva.cn', isHot: true },
    { id: 'designkit', name: '美图设计室', description: 'AI图像创作和设计平台', icon: 'https://www.designkit.cn/favicon.ico', category: 'design', tags: ['美图'], url: 'https://www.designkit.cn' },
    { id: 'mastergo', name: 'MasterGo', description: '国产界面设计工具', icon: 'https://mastergo.com/favicon.ico', category: 'design', tags: ['UI', '协作'], url: 'https://mastergo.com' },
    { id: 'pixso', name: 'Pixso', description: '产品设计协作平台', icon: 'https://pixso.cn/favicon.ico', category: 'design', tags: ['UI/UX'], url: 'https://pixso.cn' },
    { id: 'figma', name: 'Figma AI', description: 'Figma的AI设计功能', icon: 'https://www.figma.com/favicon.ico', category: 'design', tags: ['UI/UX', '矢量'], url: 'https://www.figma.com', isNew: true },
    { id: 'khroma', name: 'Khroma', description: 'AI配色工具', icon: 'https://www.khroma.co/favicon.ico', category: 'design', tags: ['配色'], url: 'https://www.khroma.co' },
    { id: 'logoai', name: 'Logo AI', description: 'AI自动生成Logo', icon: 'https://www.logoai.com/favicon.ico', category: 'design', tags: ['Logo'], url: 'https://www.logoai.com' },
    { id: 'looka', name: 'Looka', description: 'AI品牌Logo设计平台', icon: 'https://looka.com/favicon.ico', category: 'design', tags: ['Logo', '品牌'], url: 'https://looka.com' },

    // ==================== AI 音频 ====================
    { id: 'suno', name: 'Suno', description: 'AI音乐生成平台', icon: 'https://suno.com/favicon.ico', category: 'audio', tags: ['音乐生成', '人声'], url: 'https://suno.com', isHot: true, isNew: true },
    { id: 'udio', name: 'Udio', description: '强大的AI音乐生成器', icon: 'https://www.udio.com/favicon.ico', category: 'audio', tags: ['音乐'], url: 'https://www.udio.com', isNew: true },
    { id: 'elevenlabs', name: 'ElevenLabs', description: '最逼真的AI语音合成', icon: 'https://elevenlabs.io/favicon.ico', category: 'audio', tags: ['配音', '克隆'], url: 'https://elevenlabs.io', isHot: true },
    { id: 'fishaudio', name: 'Fish Audio', description: '新一代语音克隆工具', icon: 'https://fish.audio/favicon.ico', category: 'audio', tags: ['语音', '克隆'], url: 'https://fish.audio' },
    { id: 'mubert', name: 'Mubert', description: 'AI生成版权免费背景音乐', icon: 'https://mubert.com/favicon.ico', category: 'audio', tags: ['音乐', '版权'], url: 'https://mubert.com' },
    { id: 'tianyin', name: '天音AI', description: '网易AI作曲编曲工具', icon: 'https://tianyin.music.163.com/favicon.ico', category: 'audio', tags: ['网易', '作曲'], url: 'https://tianyin.music.163.com' },

    // ==================== AI 搜索 ====================
    { id: 'metaso', name: '秘塔AI搜索', description: '最好用的AI搜索工具，没有广告', icon: 'https://metaso.cn/favicon.ico', category: 'search', tags: ['搜索', '无广告'], url: 'https://metaso.cn', isHot: true },
    { id: 'perplexity', name: 'Perplexity', description: 'AI搜索引擎，提供带引用的答案', icon: 'https://www.perplexity.ai/favicon.ico', category: 'search', tags: ['搜索', '引用'], url: 'https://www.perplexity.ai', isHot: true },
    { id: 'phind', name: 'Phind', description: '面向开发者的AI搜索引擎', icon: 'https://www.phind.com/favicon.ico', category: 'search', tags: ['搜索', '开发者'], url: 'https://www.phind.com' },
    { id: 'you', name: 'You.com', description: 'AI搜索引擎', icon: 'https://you.com/favicon.ico', category: 'search', tags: ['搜索'], url: 'https://you.com' },
    { id: 'tiangongsearch', name: '天工AI搜索', description: '昆仑万维AI搜索', icon: 'https://www.tiangong.cn/favicon.ico', category: 'search', tags: ['搜索', '昆仑'], url: 'https://search.tiangong.cn' },
    { id: 'consensus', name: 'Consensus', description: '学术论文AI搜索', icon: 'https://consensus.app/favicon.ico', category: 'search', tags: ['学术', '论文'], url: 'https://consensus.app' },

    // ==================== AI 开发平台 ====================
    { id: 'huggingface', name: 'Hugging Face', description: 'AI模型和数据集开源平台', icon: 'https://huggingface.co/favicon.ico', category: 'platform', tags: ['开源', '模型'], url: 'https://huggingface.co', isHot: true },
    { id: 'replicate', name: 'Replicate', description: '云端运行开源AI模型', icon: 'https://replicate.com/favicon.ico', category: 'platform', tags: ['云端', '模型'], url: 'https://replicate.com' },
    { id: 'openaiapi', name: 'OpenAI API', description: 'OpenAI开发者平台', icon: 'https://openai.com/favicon.ico', category: 'platform', tags: ['API', 'OpenAI'], url: 'https://platform.openai.com', isHot: true },
    { id: 'anthropicapi', name: 'Anthropic API', description: 'Claude开发者API', icon: 'https://www.anthropic.com/favicon.ico', category: 'platform', tags: ['API', 'Claude'], url: 'https://www.anthropic.com' },
    { id: 'dashscope', name: '灵积', description: '阿里云模型服务平台', icon: 'https://dashscope.aliyun.com/favicon.ico', category: 'platform', tags: ['阿里', 'API'], url: 'https://dashscope.aliyun.com' },

    // ==================== AI 学习网站 ====================
    { id: 'aibot', name: 'AI工具集', description: '国内知名AI工具导航', icon: 'https://ai-bot.cn/favicon.ico', category: 'learning', tags: ['导航', '国内'], url: 'https://ai-bot.cn', isHot: true },
    { id: 'futurepedia', name: 'Futurepedia', description: '海外最大AI工具目录', icon: 'https://www.futurepedia.io/favicon.ico', category: 'learning', tags: ['导航', '海外'], url: 'https://www.futurepedia.io' },
    { id: 'toolify', name: 'Toolify.ai', description: '发现最好用的AI工具', icon: 'https://www.toolify.ai/favicon.ico', category: 'learning', tags: ['导航'], url: 'https://www.toolify.ai' },
    { id: 'kaggle', name: 'Kaggle', description: 'AI竞赛和学习社区', icon: 'https://www.kaggle.com/favicon.ico', category: 'learning', tags: ['竞赛', '学习'], url: 'https://www.kaggle.com' },
    { id: 'papers', name: 'Papers With Code', description: 'AI论文和代码仓库', icon: 'https://paperswithcode.com/favicon.ico', category: 'learning', tags: ['论文', '代码'], url: 'https://paperswithcode.com' },

    // ==================== AI 训练模型 ====================
    { id: 'modelscope', name: '魔搭社区', description: '阿里开源模型社区', icon: 'https://modelscope.cn/favicon.ico', category: 'model', tags: ['阿里', '开源'], url: 'https://modelscope.cn', isHot: true },
    { id: 'hfmodels', name: 'HF Models', description: 'Hugging Face模型库', icon: 'https://huggingface.co/favicon.ico', category: 'model', tags: ['开源', '模型'], url: 'https://huggingface.co/models' },
    { id: 'ollama', name: 'Ollama', description: '本地运行大语言模型', icon: 'https://ollama.com/favicon.ico', category: 'model', tags: ['本地', '开源'], url: 'https://ollama.com', isHot: true },
    { id: 'lmstudio', name: 'LM Studio', description: '本地LLM运行工具', icon: 'https://lmstudio.ai/favicon.ico', category: 'model', tags: ['本地', '工具'], url: 'https://lmstudio.ai' },
    { id: 'llamacpp', name: 'llama.cpp', description: 'LLaMA模型推理工具', icon: 'https://github.com/favicon.ico', category: 'model', tags: ['开源', 'LLaMA'], url: 'https://github.com/ggerganov/llama.cpp' },

    // ==================== AI 模型评测 ====================
    { id: 'lmsys', name: 'LMSys', description: '大模型竞技场排行榜', icon: 'https://lmsys.org/favicon.ico', category: 'benchmark', tags: ['排行榜'], url: 'https://chat.lmsys.org', isHot: true },
    { id: 'opencompass', name: 'OpenCompass', description: '开源大模型评测平台', icon: 'https://opencompass.org.cn/favicon.ico', category: 'benchmark', tags: ['评测', '开源'], url: 'https://opencompass.org.cn' },
    { id: 'artificiala', name: 'Artificial Analysis', description: 'AI模型性能和价格比较', icon: 'https://artificialanalysis.ai/favicon.ico', category: 'benchmark', tags: ['性能', '价格'], url: 'https://artificialanalysis.ai' },
    { id: 'superclue', name: 'SuperCLUE', description: '中文大模型评测基准', icon: 'https://www.superclueai.com/favicon.ico', category: 'benchmark', tags: ['中文', '评测'], url: 'https://www.superclueai.com' },

    // ==================== AI 内容检测 ====================
    { id: 'gptzero', name: 'GPTZero', description: 'AI生成文本检测工具', icon: 'https://gptzero.me/favicon.ico', category: 'detect', tags: ['检测', '文本'], url: 'https://gptzero.me', isHot: true },
    { id: 'originality', name: 'Originality.ai', description: 'AI内容检测和抄袭检查', icon: 'https://originality.ai/favicon.ico', category: 'detect', tags: ['检测', '抄袭'], url: 'https://originality.ai' },
    { id: 'copyleaks', name: 'Copyleaks', description: 'AI和抄袭检测平台', icon: 'https://copyleaks.com/favicon.ico', category: 'detect', tags: ['检测'], url: 'https://copyleaks.com' },
    { id: 'zerogpt', name: 'ZeroGPT', description: '免费AI文本检测', icon: 'https://www.zerogpt.com/favicon.ico', category: 'detect', tags: ['免费', '检测'], url: 'https://www.zerogpt.com' },

    // ==================== AI 提示指令 ====================
    { id: 'prompthero', name: 'PromptHero', description: 'AI提示词分享社区', icon: 'https://prompthero.com/favicon.ico', category: 'prompt', tags: ['提示词', '社区'], url: 'https://prompthero.com', isHot: true },
    { id: 'lexica', name: 'Lexica', description: 'SD提示词搜索引擎', icon: 'https://lexica.art/favicon.ico', category: 'prompt', tags: ['提示词', 'SD'], url: 'https://lexica.art' },
    { id: 'openart', name: 'OpenArt', description: 'AI艺术和提示词学习', icon: 'https://openart.ai/favicon.ico', category: 'prompt', tags: ['艺术', '学习'], url: 'https://openart.ai' },
    { id: 'promptbase', name: 'PromptBase', description: '提示词交易市场', icon: 'https://promptbase.com/favicon.ico', category: 'prompt', tags: ['提示词', '市场'], url: 'https://promptbase.com' },
    { id: 'flowgpt', name: 'FlowGPT', description: 'ChatGPT提示词社区', icon: 'https://flowgpt.com/favicon.ico', category: 'prompt', tags: ['ChatGPT', '社区'], url: 'https://flowgpt.com' },
];
