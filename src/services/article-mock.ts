/**
 * 文章系统 Mock 服务
 * 统一数据格式，方便后期对接后台接口
 */
import dayjs from 'dayjs';

// ============ 类型定义 ============

export interface Article {
    id: string;
    title: string;
    slug: string;
    summary: string;
    content: string;
    coverImage: string;
    category: string;
    tags: string[];
    author: {
        id: string;
        name: string;
        avatar: string;
    };
    status: 'draft' | 'published' | 'archived';
    views: number;
    likes: number;
    comments: number;
    publishTime: string;
    updateTime: string;
    readTime: number; // 阅读时长（分钟）
    featured: boolean;
}

export interface Category {
    id: string;
    name: string;
    slug: string;
    description: string;
    count: number;
}

export interface ApiResponse<T> {
    code: number;
    message: string;
    data: T;
}

export interface PaginatedResponse<T> {
    code: number;
    message: string;
    data: {
        list: T[];
        total: number;
        page: number;
        pageSize: number;
    };
}

// ============ Mock 数据 ============

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const generateId = () => `article_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

const mockCategories: Category[] = [
    { id: 'cat_1', name: '技术分享', slug: 'tech', description: '前沿技术、编程技巧', count: 12 },
    { id: 'cat_2', name: '产品设计', slug: 'design', description: 'UI/UX、产品思维', count: 8 },
    { id: 'cat_3', name: '行业动态', slug: 'industry', description: '行业趋势、市场分析', count: 6 },
    { id: 'cat_4', name: '团队故事', slug: 'team', description: '团队文化、成长历程', count: 4 },
];

let mockArticles: Article[] = [
    {
        id: 'article_1',
        title: '2024 前端技术趋势：从 React 19 到 AI 驱动开发',
        slug: 'frontend-trends-2024',
        summary: '探索 2024 年最值得关注的前端技术趋势，包括 React 19 新特性、AI 辅助编程、以及 Web 性能优化的最新实践。',
        content: `# 2024 前端技术趋势

## React 19 新特性

React 19 带来了许多令人兴奋的新功能...

## AI 驱动开发

AI 正在改变我们编写代码的方式...

## Web 性能优化

Core Web Vitals 依然是重要的性能指标...`,
        coverImage: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&h=400&fit=crop',
        category: '技术分享',
        tags: ['React', 'AI', '前端'],
        author: { id: 'author_1', name: '张晓明', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=xiaoming' },
        status: 'published',
        views: 3580,
        likes: 256,
        comments: 42,
        publishTime: dayjs().subtract(1, 'day').format('YYYY-MM-DD HH:mm'),
        updateTime: dayjs().subtract(1, 'day').format('YYYY-MM-DD HH:mm'),
        readTime: 8,
        featured: true,
    },
    {
        id: 'article_2',
        title: '打造极致用户体验：现代 Web 设计的 10 个原则',
        slug: 'modern-web-design-principles',
        summary: '优秀的用户体验是产品成功的关键。本文总结了现代 Web 设计中最重要的 10 个原则，帮助你打造更具吸引力的产品。',
        content: `# 现代 Web 设计的 10 个原则

## 1. 简约优雅

Less is more，减少视觉噪音...

## 2. 一致性

保持设计语言的统一...`,
        coverImage: 'https://images.unsplash.com/photo-1559028012-481c04fa702d?w=800&h=400&fit=crop',
        category: '产品设计',
        tags: ['UI设计', 'UX', '用户体验'],
        author: { id: 'author_2', name: '李雪', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=lixue' },
        status: 'published',
        views: 2890,
        likes: 198,
        comments: 35,
        publishTime: dayjs().subtract(3, 'day').format('YYYY-MM-DD HH:mm'),
        updateTime: dayjs().subtract(2, 'day').format('YYYY-MM-DD HH:mm'),
        readTime: 12,
        featured: true,
    },
    {
        id: 'article_3',
        title: 'TypeScript 5.0 完全指南：新特性与最佳实践',
        slug: 'typescript-5-guide',
        summary: 'TypeScript 5.0 带来了更快的编译速度和多种新特性。本文深入解析这些变化，并分享实际项目中的最佳实践。',
        content: `# TypeScript 5.0 完全指南

## 装饰器

TypeScript 5.0 支持标准装饰器...

## 类型推断增强

更智能的类型推断...`,
        coverImage: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=400&fit=crop',
        category: '技术分享',
        tags: ['TypeScript', '前端', '编程'],
        author: { id: 'author_1', name: '张晓明', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=xiaoming' },
        status: 'published',
        views: 4120,
        likes: 312,
        comments: 56,
        publishTime: dayjs().subtract(5, 'day').format('YYYY-MM-DD HH:mm'),
        updateTime: dayjs().subtract(4, 'day').format('YYYY-MM-DD HH:mm'),
        readTime: 15,
        featured: false,
    },
    {
        id: 'article_4',
        title: 'Ant Design 6.0 深度解析：设计系统的新纪元',
        slug: 'antd-6-deep-dive',
        summary: 'Ant Design 6.0 带来了全新的设计语言和组件升级。让我们一起探索这些变化如何帮助我们构建更好的企业级应用。',
        content: `# Ant Design 6.0 深度解析

## 全新设计语言

基于 Ant Design 5.0 的持续演进...

## 组件升级

表格、表单等核心组件的优化...`,
        coverImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=400&fit=crop',
        category: '技术分享',
        tags: ['Ant Design', 'React', '组件库'],
        author: { id: 'author_3', name: '王强', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=wangqiang' },
        status: 'published',
        views: 5230,
        likes: 428,
        comments: 78,
        publishTime: dayjs().subtract(7, 'day').format('YYYY-MM-DD HH:mm'),
        updateTime: dayjs().subtract(6, 'day').format('YYYY-MM-DD HH:mm'),
        readTime: 10,
        featured: true,
    },
    {
        id: 'article_5',
        title: '从零到一：我们的产品设计方法论',
        slug: 'product-design-methodology',
        summary: '分享团队在产品设计过程中总结的方法论，从用户研究到原型设计，从可用性测试到迭代优化的完整流程。',
        content: `# 产品设计方法论

## 用户研究

深入了解用户需求...

## 设计思维

以用户为中心的设计方法...`,
        coverImage: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=800&h=400&fit=crop',
        category: '产品设计',
        tags: ['产品', '方法论', '设计思维'],
        author: { id: 'author_2', name: '李雪', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=lixue' },
        status: 'published',
        views: 1890,
        likes: 145,
        comments: 28,
        publishTime: dayjs().subtract(10, 'day').format('YYYY-MM-DD HH:mm'),
        updateTime: dayjs().subtract(9, 'day').format('YYYY-MM-DD HH:mm'),
        readTime: 6,
        featured: false,
    },
    {
        id: 'article_6',
        title: '云原生时代的微服务架构实践',
        slug: 'cloud-native-microservices',
        summary: '在云原生时代，如何设计和实现高可用、可扩展的微服务架构？本文分享了我们在实际项目中的经验和教训。',
        content: `# 微服务架构实践

## 服务拆分原则

如何合理拆分服务...

## 服务治理

服务发现、负载均衡...`,
        coverImage: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&h=400&fit=crop',
        category: '技术分享',
        tags: ['微服务', '云原生', '架构'],
        author: { id: 'author_3', name: '王强', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=wangqiang' },
        status: 'published',
        views: 2340,
        likes: 178,
        comments: 32,
        publishTime: dayjs().subtract(12, 'day').format('YYYY-MM-DD HH:mm'),
        updateTime: dayjs().subtract(11, 'day').format('YYYY-MM-DD HH:mm'),
        readTime: 14,
        featured: false,
    },
    {
        id: 'article_7',
        title: '2024 行业发展报告：AI 与数字化转型',
        slug: 'industry-report-2024',
        summary: '深入分析 2024 年科技行业发展趋势，AI 技术如何推动企业数字化转型，以及未来的机遇与挑战。',
        content: `# 2024 行业发展报告

## AI 技术发展

大语言模型的突破...

## 数字化转型

企业数字化的关键要素...`,
        coverImage: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&h=400&fit=crop',
        category: '行业动态',
        tags: ['AI', '数字化', '行业趋势'],
        author: { id: 'author_1', name: '张晓明', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=xiaoming' },
        status: 'published',
        views: 6780,
        likes: 534,
        comments: 89,
        publishTime: dayjs().subtract(2, 'day').format('YYYY-MM-DD HH:mm'),
        updateTime: dayjs().subtract(1, 'day').format('YYYY-MM-DD HH:mm'),
        readTime: 18,
        featured: true,
    },
    {
        id: 'article_8',
        title: '团队成长记：从 3 人到 30 人的组织演进',
        slug: 'team-growth-story',
        summary: '回顾团队从初创到成长的历程，分享在不同阶段遇到的挑战和解决方案，以及沉淀下来的团队文化。',
        content: `# 团队成长记

## 初创期

艰难但充满激情的开始...

## 成长期

面临的挑战与突破...`,
        coverImage: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&h=400&fit=crop',
        category: '团队故事',
        tags: ['团队', '成长', '创业'],
        author: { id: 'author_2', name: '李雪', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=lixue' },
        status: 'published',
        views: 1560,
        likes: 123,
        comments: 45,
        publishTime: dayjs().subtract(15, 'day').format('YYYY-MM-DD HH:mm'),
        updateTime: dayjs().subtract(14, 'day').format('YYYY-MM-DD HH:mm'),
        readTime: 7,
        featured: false,
    },
];

// ============ API 方法 ============

// 获取文章列表
export const getArticles = async (
    page: number = 1,
    pageSize: number = 10,
    filters?: { category?: string; status?: string; search?: string; featured?: boolean }
): Promise<PaginatedResponse<Article>> => {
    await delay(400);
    let filtered = [...mockArticles];

    if (filters?.category) {
        filtered = filtered.filter(a => a.category === filters.category);
    }
    if (filters?.status) {
        filtered = filtered.filter(a => a.status === filters.status);
    }
    if (filters?.featured !== undefined) {
        filtered = filtered.filter(a => a.featured === filters.featured);
    }
    if (filters?.search) {
        const search = filters.search.toLowerCase();
        filtered = filtered.filter(a =>
            a.title.toLowerCase().includes(search) ||
            a.summary.toLowerCase().includes(search) ||
            a.tags.some(t => t.toLowerCase().includes(search))
        );
    }

    // 按发布时间排序
    filtered.sort((a, b) => new Date(b.publishTime).getTime() - new Date(a.publishTime).getTime());

    const start = (page - 1) * pageSize;
    const end = start + pageSize;

    return {
        code: 0,
        message: 'success',
        data: {
            list: filtered.slice(start, end),
            total: filtered.length,
            page,
            pageSize,
        },
    };
};

// 获取单篇文章
export const getArticleById = async (id: string): Promise<ApiResponse<Article | null>> => {
    await delay(300);
    const article = mockArticles.find(a => a.id === id);
    return {
        code: article ? 0 : 404,
        message: article ? 'success' : 'Article not found',
        data: article || null,
    };
};

// 获取推荐文章
export const getFeaturedArticles = async (limit: number = 4): Promise<ApiResponse<Article[]>> => {
    await delay(300);
    const featured = mockArticles
        .filter(a => a.featured && a.status === 'published')
        .slice(0, limit);
    return { code: 0, message: 'success', data: featured };
};

// 获取最新文章
export const getLatestArticles = async (limit: number = 6): Promise<ApiResponse<Article[]>> => {
    await delay(300);
    const latest = mockArticles
        .filter(a => a.status === 'published')
        .sort((a, b) => new Date(b.publishTime).getTime() - new Date(a.publishTime).getTime())
        .slice(0, limit);
    return { code: 0, message: 'success', data: latest };
};

// 获取热门文章
export const getPopularArticles = async (limit: number = 5): Promise<ApiResponse<Article[]>> => {
    await delay(300);
    const popular = mockArticles
        .filter(a => a.status === 'published')
        .sort((a, b) => b.views - a.views)
        .slice(0, limit);
    return { code: 0, message: 'success', data: popular };
};

// 获取分类列表
export const getCategories = async (): Promise<ApiResponse<Category[]>> => {
    await delay(200);
    return { code: 0, message: 'success', data: mockCategories };
};

// 创建文章
export const createArticle = async (article: Omit<Article, 'id' | 'views' | 'likes' | 'comments' | 'publishTime' | 'updateTime'>): Promise<ApiResponse<Article>> => {
    await delay(500);
    const now = dayjs().format('YYYY-MM-DD HH:mm');
    const newArticle: Article = {
        ...article,
        id: generateId(),
        views: 0,
        likes: 0,
        comments: 0,
        publishTime: now,
        updateTime: now,
    };
    mockArticles.unshift(newArticle);
    return { code: 0, message: 'success', data: newArticle };
};

// 更新文章
export const updateArticle = async (id: string, data: Partial<Article>): Promise<ApiResponse<Article | null>> => {
    await delay(500);
    const index = mockArticles.findIndex(a => a.id === id);
    if (index === -1) {
        return { code: 404, message: 'Article not found', data: null };
    }
    mockArticles[index] = {
        ...mockArticles[index],
        ...data,
        updateTime: dayjs().format('YYYY-MM-DD HH:mm'),
    };
    return { code: 0, message: 'success', data: mockArticles[index] };
};

// 删除文章
export const deleteArticle = async (id: string): Promise<ApiResponse<boolean>> => {
    await delay(400);
    const index = mockArticles.findIndex(a => a.id === id);
    if (index === -1) {
        return { code: 404, message: 'Article not found', data: false };
    }
    mockArticles.splice(index, 1);
    return { code: 0, message: 'success', data: true };
};

// 获取统计数据
export const getArticleStats = async (): Promise<ApiResponse<{
    total: number;
    published: number;
    draft: number;
    totalViews: number;
    totalLikes: number;
}>> => {
    await delay(200);
    return {
        code: 0,
        message: 'success',
        data: {
            total: mockArticles.length,
            published: mockArticles.filter(a => a.status === 'published').length,
            draft: mockArticles.filter(a => a.status === 'draft').length,
            totalViews: mockArticles.reduce((sum, a) => sum + a.views, 0),
            totalLikes: mockArticles.reduce((sum, a) => sum + a.likes, 0),
        },
    };
};
