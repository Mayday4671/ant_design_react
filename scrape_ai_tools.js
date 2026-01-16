/**
 * AI工具数据爬虫 - 从ai-bot.cn抓取工具信息和图标
 * 使用 Node.js ESM 运行
 */

import https from 'https';
import fs from 'fs';

// 请求配置
const headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
    'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
};

/**
 * 发送HTTPS请求
 */
function fetchPage(url) {
    return new Promise((resolve, reject) => {
        const req = https.get(url, { headers, timeout: 15000 }, (res) => {
            // 处理重定向
            if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
                fetchPage(res.headers.location).then(resolve).catch(reject);
                return;
            }

            let data = '';
            res.setEncoding('utf-8');
            res.on('data', chunk => data += chunk);
            res.on('end', () => resolve(data));
        });
        req.on('error', reject);
        req.on('timeout', () => {
            req.destroy();
            reject(new Error('Request timeout'));
        });
    });
}

/**
 * 解析工具 - 使用正则提取
 */
function parseTools(html, defaultCategory = 'chat') {
    const tools = [];

    // 匹配 site-card 结构
    // <a href="url"><img src="icon"><div>name</div><p>desc</p></a>
    const patterns = [
        // 模式1: div.site-card > a > img + title + desc
        /<a[^>]*href="([^"]*sites\/\d+[^"]*)"[^>]*>[\s\S]*?<img[^>]*(?:data-src|src)="([^"]*)"[^>]*>[\s\S]*?<[^>]*class="[^"]*title[^"]*"[^>]*>([^<]+)<[\s\S]*?<[^>]*class="[^"]*desc[^"]*"[^>]*>([^<]*)</gi,

        // 模式2: 带logo的链接卡片
        /<a[^>]*href="([^"]*)"[^>]*>[\s\S]*?<img[^>]*(?:data-src|src)="([^"]*logo[^"]*)"[^>]*alt="([^"]*)"[^>]*>/gi,

        // 模式3: img with alt + 父级链接
        /<a[^>]*href="([^"]*)"[^>]*>[\s\S]*?<img[^>]*(?:data-src|src)="([^"]*)"[^>]*alt="([^"]*)"[^>]*>/gi,
    ];

    for (const pattern of patterns) {
        let match;
        while ((match = pattern.exec(html)) !== null) {
            const [, url, icon, nameOrAlt, desc] = match;
            const name = (nameOrAlt || '').trim();

            // 过滤无效名称
            if (!name || name.length < 2 || name.length > 30) continue;
            if (name.includes('返回') || name.includes('首页') || name.includes('logo')) continue;

            // 处理URL
            let finalUrl = url;
            if (url.startsWith('/')) {
                finalUrl = 'https://ai-bot.cn' + url;
            }

            // 处理图标URL
            let finalIcon = icon;
            if (icon.startsWith('//')) {
                finalIcon = 'https:' + icon;
            } else if (icon.startsWith('/')) {
                finalIcon = 'https://ai-bot.cn' + icon;
            }

            tools.push({
                name,
                description: (desc || '').trim().slice(0, 150) || `${name} - AI智能工具`,
                icon: finalIcon,
                url: finalUrl,
                category: defaultCategory,
            });
        }

        // 如果找到足够的工具，停止尝试其他模式
        if (tools.length > 10) break;
    }

    return tools;
}

/**
 * 去重
 */
function dedupe(tools) {
    const seen = new Set();
    return tools.filter(t => {
        const key = t.name.toLowerCase();
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
    });
}

/**
 * 生成TypeScript代码
 */
function generateTS(tools) {
    const now = new Date().toISOString();
    let ts = `import type { AITool } from './ai-tools-mock';

// 从 ai-bot.cn 抓取的AI工具数据
// 生成时间: ${now}
// 工具数量: ${tools.length}

export const scrapedTools: AITool[] = [
`;

    tools.forEach((tool, i) => {
        const id = tool.name.toLowerCase().replace(/[^a-z0-9\u4e00-\u9fa5]/g, '').slice(0, 20) || `tool${i}`;
        const name = tool.name.replace(/'/g, "\\'");
        const desc = (tool.description || '').replace(/'/g, "\\'").replace(/[\n\r]/g, ' ').trim().slice(0, 150);
        const icon = tool.icon || '';
        const url = tool.url || '';
        const category = tool.category || 'chat';
        const isHot = tool.isHot ? 'true' : 'false';
        const isNew = tool.isNew ? 'true' : 'false';

        ts += `    {
        id: '${id}-${i}',
        name: '${name}',
        description: '${desc || name + " - AI工具"}',
        icon: '${icon}',
        category: '${category}',
        tags: [],
        url: '${url}',
        isHot: ${isHot},
        isNew: ${isNew},
    },
`;
    });

    ts += '];\n';
    return ts;
}

/**
 * 延迟函数
 */
const delay = ms => new Promise(r => setTimeout(r, ms));

/**
 * 主函数
 */
async function main() {
    console.log('='.repeat(50));
    console.log('AI工具数据爬虫 (Node.js ESM版)');
    console.log('='.repeat(50));

    const allTools = [];
    const categories = [
        { url: 'https://ai-bot.cn/', id: 'chat', name: '首页', isHot: true },
        { url: 'https://ai-bot.cn/ai-chat/', id: 'chat', name: 'AI对话' },
        { url: 'https://ai-bot.cn/ai-write/', id: 'writing', name: 'AI写作' },
        { url: 'https://ai-bot.cn/ai-image/', id: 'image', name: 'AI图像' },
        { url: 'https://ai-bot.cn/ai-video/', id: 'video', name: 'AI视频' },
        { url: 'https://ai-bot.cn/ai-audio/', id: 'audio', name: 'AI音频' },
        { url: 'https://ai-bot.cn/ai-code/', id: 'coding', name: 'AI编程' },
        { url: 'https://ai-bot.cn/ai-office/', id: 'office', name: 'AI办公' },
        { url: 'https://ai-bot.cn/ai-design/', id: 'design', name: 'AI设计' },
    ];

    for (const cat of categories) {
        console.log(`\n正在抓取: ${cat.name} (${cat.url})`);
        try {
            const html = await fetchPage(cat.url);
            console.log(`  获取到 ${html.length} 字符`);

            const tools = parseTools(html, cat.id);
            tools.forEach(t => {
                if (cat.isHot) t.isHot = true;
            });

            console.log(`  解析出 ${tools.length} 个工具`);
            allTools.push(...tools);
        } catch (e) {
            console.log(`  抓取失败: ${e.message}`);
        }

        // 礼貌延迟
        await delay(800);
    }

    // 去重
    const uniqueTools = dedupe(allTools);
    console.log(`\n${'='.repeat(50)}`);
    console.log(`总共抓取 ${uniqueTools.length} 个唯一工具`);
    console.log('='.repeat(50));

    if (uniqueTools.length === 0) {
        console.log('\n未能抓取到工具，可能需要检查网络或网站结构变化');
        return;
    }

    // 生成文件
    const tsContent = generateTS(uniqueTools);
    fs.writeFileSync('./src/services/ai-tools-data.ts', tsContent, 'utf-8');
    console.log('\n已保存到: src/services/ai-tools-data.ts');

    // JSON备份
    fs.writeFileSync('./ai-tools-scraped.json', JSON.stringify(uniqueTools, null, 2), 'utf-8');
    console.log('JSON备份已保存到: ai-tools-scraped.json');

    // 显示部分结果
    console.log('\n前5个工具预览:');
    uniqueTools.slice(0, 5).forEach((t, i) => {
        console.log(`  ${i + 1}. ${t.name}: ${t.icon ? '✓有图标' : '✗无图标'}`);
    });
}

main().catch(console.error);
