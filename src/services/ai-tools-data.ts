import type { AITool } from './ai-tools-mock';

// 手动映射分类
// Featured items mapped to specific categories manually for better UX
export const scrapedTools: AITool[] = [
    // Originally Featured
    { id: 'doubao-s', name: '豆包', description: '字节跳动推出，智能对话助手，办公创作全能！', icon: '', category: 'chat', tags: ['字节', '对话'], url: 'https://ai-bot.cn/sites/4189.html', isHot: true },
    { id: 'huiwa', name: '绘蛙', description: 'AI电商营销工具，免费生成商品图', icon: '', category: 'image', tags: ['电商', '生图'], url: 'https://ai-bot.cn/sites/9195.html', isHot: true },
    { id: 'trae', name: 'TRAE编程', description: '字节推出的AI编程IDE，Vibe Coding 必备！', icon: '', category: 'coding', tags: ['编程', 'IDE'], url: 'https://ai-bot.cn/sites/65814.html', isNew: true },
    { id: 'aippt', name: 'AiPPT', description: 'AI快速生成高质量PPT', icon: '', category: 'office', tags: ['PPT', '办公'], url: 'https://www.aippt.cn', isHot: true },
    { id: 'metaso', name: '秘塔AI搜索', description: '最好用的AI搜索工具，没有广告，直达结果', icon: '', category: 'chat', tags: ['搜索', '无广告'], url: 'https://metaso.cn', isHot: true },
    { id: 'liblib', name: 'LiblibAI', description: '一站式 AI 内容创作生成平台', icon: '', category: 'image', tags: ['模型', '创作'], url: 'https://ai-bot.cn/sites/66771.html' },
    { id: 'duiyou', name: '堆友AI', description: '免费AI绘画和生图神器', icon: '', category: 'image', tags: ['阿里', '免费'], url: 'https://d.design' },
    { id: 'designkit', name: '美图设计室', description: 'AI图像创作和设计平台', icon: '', category: 'design', tags: ['美图', '设计'], url: 'https://www.designkit.cn' },
    { id: 'flowith', name: 'Flowith', description: '免费用Gemini 3、GPT-5', icon: '', category: 'chat', tags: ['GPT-5', '免费'], url: 'https://ai-bot.cn/sites/11395.html' },
    { id: 'raccoons', name: '办公小浣熊', description: '最强AI数据分析助手', icon: '', category: 'office', tags: ['数据分析', '办公'], url: 'https://ai-bot.cn/sites/8516.html' },
    { id: 'haisnap', name: '响指HaiSnap', description: 'AI零代码应用开发平台', icon: '', category: 'coding', tags: ['零代码', '开发'], url: 'https://ai-bot.cn/sites/64863.html' },
    { id: 'miaoda', name: '秒哒', description: '百度推出的无代码AI应用开发平台', icon: '', category: 'coding', tags: ['百度', '无代码'], url: 'https://ai-bot.cn/sites/65909.html' },
    { id: 'xianchou', name: '献丑AI', description: '首个 AI 视频开源社区', icon: '', category: 'video', tags: ['视频', '开源'], url: 'https://ai-bot.cn/sites/70208.html' },
    { id: 'typeless', name: 'Typeless', description: 'AI语音输入工具，智能上下文润色', icon: '', category: 'audio', tags: ['语音', '输入'], url: 'https://ai-bot.cn/sites/69958.html' },
    { id: 'atoms', name: 'Atoms', description: '第一支自动构建真实业务的 AI 团队', icon: '', category: 'office', tags: ['Agent', '团队'], url: 'https://ai-bot.cn/sites/70016.html' },
    { id: 'miaohui', name: '秒绘AI', description: '一键生成爆款图文，免费发布小红书', icon: '', category: 'image', tags: ['小红书', '图文'], url: 'https://ai-bot.cn/sites/70073.html' },
    { id: 'wuli', name: '呜哩', description: '阿里推出的AIGC创意生产力平台', icon: '', category: 'image', tags: ['阿里', '创意'], url: 'https://ai-bot.cn/sites/70059.html' },
    { id: 'koukoutu', name: '抠抠图', description: '免费在线AI抠图工具，一键批量抠图', icon: '', category: 'image', tags: ['抠图', '工具'], url: 'https://ai-bot.cn/sites/70008.html' },

    // AI写作工具 -> writing
    { id: 'wawa', name: '蛙蛙写作', description: 'AI小说和内容创作工具', icon: '', category: 'writing', tags: ['小说', '创作'], url: 'https://ai-bot.cn/sites/8204.html' },
    { id: 'xfhuiwen', name: '讯飞绘文', description: '免费AI写作工具，5分钟生成一篇原创稿！', icon: '', category: 'writing', tags: ['讯飞', '办公'], url: 'https://ai-bot.cn/sites/6242.html' },
    { id: 'biling', name: '笔灵AI写作', description: 'AI一键生成论文/小说，降重降AI', icon: '', category: 'writing', tags: ['论文', '降重'], url: 'https://ibiling.cn' },
    { id: 'miaobi', name: '新华妙笔', description: '新华社推出的体制内办公学习平台', icon: '', category: 'writing', tags: ['公文', '体制内'], url: 'https://miaobi.xinhuaskl.com' },
    { id: 'biling-novel', name: '笔灵AI小说', description: 'AI一键写全篇+爆文拆解，新手过稿神器', icon: '', category: 'writing', tags: ['小说', '网文'], url: 'https://ai-bot.cn/sites/22626.html' },
    { id: 'gaoding-copy', name: '稿定AI文案', description: '小红书、公众号、短视频文案生成', icon: '', category: 'writing', tags: ['文案', '社媒'], url: 'https://ai-bot.cn/sites/49483.html' },
    { id: 'paperpal', name: 'Paperpal', description: '英文论文写作助手', icon: '', category: 'writing', tags: ['英文', '论文'], url: 'https://paperpal.cn' },
    { id: 'bimuyu', name: '笔目鱼', description: '专业英文论文写作器', icon: '', category: 'writing', tags: ['英文', '写作'], url: 'https://ai-bot.cn/sites/53972.html' },
    { id: 'gaoyi', name: '稿易AI论文', description: 'AI论文写作助手，免费大纲', icon: '', category: 'writing', tags: ['论文', '大纲'], url: 'https://ai-bot.cn/sites/36409.html' },
    { id: 'qianbi', name: '千笔AI论文', description: '全网首家论文无限改稿平台', icon: '', category: 'writing', tags: ['论文', '改稿'], url: 'https://ai-bot.cn/sites/7358.html' },
    { id: 'weipu', name: '维普科创助手', description: '维普的一站式AI科研服务平台', icon: '', category: 'writing', tags: ['科研', '维普'], url: 'https://ai-bot.cn/sites/60799.html' },
    { id: 'qinyan', name: '沁言学术', description: 'AI科研写作平台，一站式文献管理', icon: '', category: 'writing', tags: ['科研', '文献'], url: 'https://ai-bot.cn/sites/56573.html' },
    { id: 'maomao', name: '茅茅虫', description: '一站式AI论文写作助手', icon: '', category: 'writing', tags: ['论文', '助手'], url: 'https://ai-bot.cn/sites/7381.html' },
    { id: 'guangsu', name: '光速写作', description: 'AI写作、PPT生成，长文本支持', icon: '', category: 'writing', tags: ['长文本', 'PPT'], url: 'https://ai-bot.cn/sites/7244.html' },
    { id: 'mowen', name: '墨问', description: '专为创作者设计的AI笔记工具', icon: '', category: 'writing', tags: ['笔记', '创作'], url: 'https://ai-bot.cn/sites/62793.html' },
    { id: 'luobi', name: '落笔AI写作', description: '专注于小说网文创作', icon: '', category: 'writing', tags: ['小说', '网文'], url: 'https://ai-bot.cn/sites/66726.html' },

    // AI图像工具 -> image
    { id: 'jimeng', name: '即梦', description: '抖音旗下免费AI图片创作工具', icon: '', category: 'image', tags: ['抖音', '免费'], url: 'https://jimeng.com' },
    { id: 'duiyou-reactor', name: '堆友AI反应堆', description: '阿里堆友推出的画风生成器', icon: '', category: 'image', tags: ['阿里', '画风'], url: 'https://ai-bot.cn/sites/3382.html' },
    { id: 'liblib-image', name: '哩布哩布AI', description: '国内领先的AI图像创作平台', icon: '', category: 'image', tags: ['模型', 'SD'], url: 'https://ai-bot.cn/sites/6474.html' },
    { id: 'gaoding-img', name: '稿定AI', description: 'AI绘图、图片修复、抠图消除', icon: '', category: 'image', tags: ['设计', '修图'], url: 'https://www.gaoding.com' },
    { id: 'abei', name: '阿贝智能', description: '一站式AI绘本创作平台', icon: '', category: 'image', tags: ['绘本', '创作'], url: 'https://ai-bot.cn/sites/17330.html' },
    { id: 'civitai', name: 'Civitai', description: '全球最大的AI模型分享社区', icon: '', category: 'image', tags: ['模型', '社区'], url: 'https://ai-bot.cn/sites/6297.html' },
    { id: 'tusi', name: '吐司AI', description: '国内知名模型社区和在线生图平台', icon: '', category: 'image', tags: ['模型', '在线'], url: 'https://ai-bot.cn/tusiart/' },
    { id: 'zaodian', name: '造点AI', description: '夸克推出的AI图像与视频创作', icon: '', category: 'image', tags: ['夸克', '视频'], url: 'https://ai-bot.cn/sites/63437.html' },
    { id: 'runninghub', name: 'RunningHub', description: '基于云端ComfyUI的工作流平台', icon: '', category: 'image', tags: ['ComfyUI', '工作流'], url: 'https://ai-bot.cn/sites/56061.html' },
    { id: 'tongyi-wanxiang', name: '通义万相', description: '阿里推出的AI创意生成助手', icon: '', category: 'image', tags: ['阿里', '创意'], url: 'https://ai-bot.cn/sites/3400.html' },
    { id: 'keling', name: '可灵AI', description: '快手推出的顶尖视频和图像大模型', icon: '', category: 'image', tags: ['快手', '视频'], url: 'https://ai-bot.cn/sites/13002.html', isHot: true },
    { id: 'miaohua', name: '秒画', description: '商汤科技推出的免费AI作画平台', icon: '', category: 'image', tags: ['商汤', '免费'], url: 'https://ai-bot.cn/sites/4749.html' },
    { id: 'whee', name: 'WHEE', description: '美图旗下的AI图片和画作平台', icon: '', category: 'image', tags: ['美图', '图片'], url: 'https://ai-bot.cn/sites/2976.html' },
    { id: '360zhitu', name: '360智图', description: '360推出的AI智绘作图平台', icon: '', category: 'image', tags: ['360', '作图'], url: 'https://ai-bot.cn/sites/4177.html' },

    // AI视频工具 -> video
    { id: 'jimeng-video', name: '即梦AI视频', description: '一站式AI视频、数字人生成', icon: '', category: 'video', tags: ['即梦', '视频'], url: 'https://ai-bot.cn/sites/17772.html', isHot: true },
    { id: 'huiwa-video', name: '绘蛙AI视频', description: '绘蛙推出的电商商品生图视频', icon: '', category: 'video', tags: ['电商', '商品'], url: 'https://ai-bot.cn/sites/33687.html' },
    { id: 'vidu', name: 'Vidu', description: '生数科技推出的原创视频大模型', icon: '', category: 'video', tags: ['大模型', '原创'], url: 'https://ai-bot.cn/sites/14695.html', isNew: true },
    { id: 'youyan', name: '有言', description: '视频创作和3D数字人生成平台', icon: '', category: 'video', tags: ['3D', '数字人'], url: 'https://ai-bot.cn/sites/10847.html' },
    { id: 'duiyou-video', name: '堆友AI视频', description: '阿里堆友推出的免费视频生成', icon: '', category: 'video', tags: ['阿里', '免费'], url: 'https://ai-bot.cn/sites/61400.html' },
    { id: 'hailuo', name: '海螺视频', description: 'MiniMax推出的高质量视频生成', icon: '', category: 'video', tags: ['MiniMax', '高质量'], url: 'https://ai-bot.cn/hailuoai-video/', isHot: true },
    { id: 'hunyuan', name: '腾讯混元AI视频', description: '腾讯推出的AI视频生成大模型', icon: '', category: 'video', tags: ['腾讯', '混元'], url: 'https://ai-bot.cn/sites/46196.html' },
    { id: 'wanxiang-video', name: '万相AI视频', description: '阿里通义推出的AI视频工具', icon: '', category: 'video', tags: ['阿里', '通义'], url: 'https://ai-bot.cn/tongyi-wanxvideo/' },
    { id: 'huasheng', name: '花生AI', description: 'B站推出的原生AI视频工具', icon: '', category: 'video', tags: ['B站', '原生'], url: 'https://ai-bot.cn/sites/67673.html' }
];
