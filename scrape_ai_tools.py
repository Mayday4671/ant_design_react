"""
AI工具数据爬虫 - 从ai-bot.cn抓取工具信息和图标
"""
import requests
from bs4 import BeautifulSoup
import json
import time
import re

# 请求头
headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
    'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
}

# 分类映射
CATEGORY_MAP = {
    'ai-chat': 'chat',
    'ai-write': 'writing', 
    'ai-image': 'image',
    'ai-video': 'video',
    'ai-audio': 'audio',
    'ai-code': 'coding',
    'ai-office': 'office',
    'ai-design': 'design',
    '对话': 'chat',
    '写作': 'writing',
    '图像': 'image',
    '视频': 'video',
    '音频': 'audio',
    '编程': 'coding',
    '办公': 'office',
    '设计': 'design',
}

def get_page(url, retries=3):
    """获取页面内容"""
    for i in range(retries):
        try:
            resp = requests.get(url, headers=headers, timeout=15)
            resp.encoding = 'utf-8'
            if resp.status_code == 200:
                return resp.text
        except Exception as e:
            print(f"请求失败 ({i+1}/{retries}): {url}, 错误: {e}")
            time.sleep(1)
    return None

def parse_tool_card(card):
    """解析单个工具卡片"""
    try:
        # 获取名称
        name_elem = card.select_one('.card-title, .site-title, h3, h4, .title')
        name = name_elem.get_text(strip=True) if name_elem else None
        
        # 获取描述
        desc_elem = card.select_one('.card-desc, .site-desc, .desc, p, .description')
        description = desc_elem.get_text(strip=True) if desc_elem else ''
        
        # 获取图标
        icon_elem = card.select_one('img')
        icon = ''
        if icon_elem:
            icon = icon_elem.get('src', '') or icon_elem.get('data-src', '') or icon_elem.get('data-lazy-src', '')
            # 处理相对路径
            if icon and not icon.startswith('http'):
                if icon.startswith('//'):
                    icon = 'https:' + icon
                elif icon.startswith('/'):
                    icon = 'https://ai-bot.cn' + icon
        
        # 获取链接
        link_elem = card.select_one('a')
        url = ''
        if link_elem:
            url = link_elem.get('href', '')
            if url and not url.startswith('http'):
                if url.startswith('/'):
                    url = 'https://ai-bot.cn' + url
        
        if name:
            return {
                'name': name,
                'description': description[:200] if description else f'{name} - AI工具',
                'icon': icon,
                'url': url,
            }
    except Exception as e:
        print(f"解析卡片失败: {e}")
    return None

def scrape_homepage():
    """抓取首页推荐工具"""
    print("正在抓取首页...")
    tools = []
    
    html = get_page('https://ai-bot.cn/')
    if not html:
        print("获取首页失败")
        return tools
    
    soup = BeautifulSoup(html, 'html.parser')
    
    # 查找工具卡片的多种可能选择器
    selectors = [
        '.site-card',
        '.tool-card', 
        '.card-item',
        '.site-item',
        '.ai-tool-item',
        '[class*="card"]',
        'article',
    ]
    
    cards = []
    for sel in selectors:
        cards = soup.select(sel)
        if len(cards) > 5:
            print(f"使用选择器 '{sel}' 找到 {len(cards)} 个卡片")
            break
    
    for card in cards[:100]:  # 最多100个
        tool = parse_tool_card(card)
        if tool and tool['name']:
            tools.append(tool)
    
    print(f"首页抓取完成，共 {len(tools)} 个工具")
    return tools

def scrape_category_page(category_url, category_id):
    """抓取分类页面"""
    print(f"正在抓取分类: {category_url}")
    tools = []
    
    html = get_page(category_url)
    if not html:
        return tools
    
    soup = BeautifulSoup(html, 'html.parser')
    
    # 查找工具卡片
    cards = soup.select('.site-card, .tool-card, .card-item, article, [class*="card"]')
    
    for card in cards[:50]:
        tool = parse_tool_card(card)
        if tool and tool['name']:
            tool['category'] = category_id
            tools.append(tool)
    
    print(f"  找到 {len(tools)} 个工具")
    return tools

def main():
    """主函数"""
    print("=" * 50)
    print("AI工具数据爬虫")
    print("=" * 50)
    
    all_tools = []
    seen_names = set()
    
    # 1. 抓取首页
    homepage_tools = scrape_homepage()
    for tool in homepage_tools:
        if tool['name'] not in seen_names:
            tool['category'] = 'chat'  # 默认分类
            tool['isHot'] = True
            all_tools.append(tool)
            seen_names.add(tool['name'])
    
    # 2. 抓取各分类页面
    categories = [
        ('https://ai-bot.cn/ai-chat/', 'chat'),
        ('https://ai-bot.cn/ai-write/', 'writing'),
        ('https://ai-bot.cn/ai-image/', 'image'),
        ('https://ai-bot.cn/ai-video/', 'video'),
        ('https://ai-bot.cn/ai-audio/', 'audio'),
        ('https://ai-bot.cn/ai-code/', 'coding'),
        ('https://ai-bot.cn/ai-office/', 'office'),
        ('https://ai-bot.cn/ai-design/', 'design'),
    ]
    
    for cat_url, cat_id in categories:
        time.sleep(0.5)  # 礼貌延迟
        cat_tools = scrape_category_page(cat_url, cat_id)
        for tool in cat_tools:
            if tool['name'] not in seen_names:
                all_tools.append(tool)
                seen_names.add(tool['name'])
    
    # 3. 生成TypeScript代码
    print("\n" + "=" * 50)
    print(f"总共抓取 {len(all_tools)} 个工具")
    print("=" * 50)
    
    # 生成TypeScript格式
    ts_output = """import type { AITool } from './ai-tools-mock';

// 从 ai-bot.cn 抓取的AI工具数据
// 生成时间: """ + time.strftime('%Y-%m-%d %H:%M:%S') + """

export const scrapedTools: AITool[] = [
"""
    
    for i, tool in enumerate(all_tools):
        name = tool['name'].replace("'", "\\'")
        desc = tool['description'].replace("'", "\\'").replace('\n', ' ')[:150]
        icon = tool['icon']
        url = tool['url']
        category = tool.get('category', 'chat')
        is_hot = 'true' if tool.get('isHot') else 'false'
        is_new = 'true' if tool.get('isNew') else 'false'
        
        # 生成ID
        tool_id = re.sub(r'[^a-zA-Z0-9]', '', name.lower())[:20] or f'tool{i}'
        
        ts_output += f"""    {{
        id: '{tool_id}',
        name: '{name}',
        description: '{desc}',
        icon: '{icon}',
        category: '{category}',
        tags: [],
        url: '{url}',
        isHot: {is_hot},
    }},
"""
    
    ts_output += "];\n"
    
    # 保存文件
    output_file = 'ai-tools-scraped.ts'
    with open(output_file, 'w', encoding='utf-8') as f:
        f.write(ts_output)
    
    print(f"\n数据已保存到: {output_file}")
    
    # 同时保存JSON格式备份
    with open('ai-tools-scraped.json', 'w', encoding='utf-8') as f:
        json.dump(all_tools, f, ensure_ascii=False, indent=2)
    
    print("JSON备份已保存到: ai-tools-scraped.json")

if __name__ == '__main__':
    main()
