/**
 * 前台展示 Mock 服务
 * 所有接口遵循统一的返回格式，方便后期对接后台接口
 */
import dayjs from 'dayjs';

// ============ 通用接口类型 ============

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

// ============ 业务数据类型 ============

// 产品/服务
export interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    originalPrice?: number;
    image: string;
    category: string;
    tags: string[];
    rating: number;
    sales: number;
    isHot?: boolean;
    isNew?: boolean;
}

// 新闻/公告
export interface News {
    id: string;
    title: string;
    summary: string;
    content: string;
    image: string;
    category: '公告' | '新闻' | '活动' | '更新';
    author: string;
    publishTime: string;
    views: number;
}

// 合作伙伴
export interface Partner {
    id: string;
    name: string;
    logo: string;
    description: string;
    website?: string;
}

// 客户评价
export interface Testimonial {
    id: string;
    name: string;
    avatar: string;
    company: string;
    position: string;
    content: string;
    rating: number;
}

// 统计数据
export interface SiteStats {
    totalUsers: number;
    totalProducts: number;
    totalOrders: number;
    satisfactionRate: number;
}

// 轮播图
export interface Banner {
    id: string;
    title: string;
    subtitle: string;
    image: string;
    link?: string;
    buttonText?: string;
}

// ============ Mock 数据 ============

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const mockProducts: Product[] = [
    {
        id: 'prod_1',
        name: '企业级云服务套餐',
        description: '为企业提供安全、稳定、高效的云计算解决方案，支持弹性扩展。',
        price: 2999,
        originalPrice: 3999,
        image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&h=300&fit=crop',
        category: '云服务',
        tags: ['热门', '企业级'],
        rating: 4.8,
        sales: 1520,
        isHot: true,
    },
    {
        id: 'prod_2',
        name: '智能数据分析平台',
        description: '基于 AI 的智能数据分析工具，助力企业做出数据驱动的决策。',
        price: 1599,
        image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop',
        category: '数据分析',
        tags: ['AI', '新品'],
        rating: 4.6,
        sales: 890,
        isNew: true,
    },
    {
        id: 'prod_3',
        name: 'API 接口管理系统',
        description: '一站式 API 全生命周期管理平台，简化接口开发与维护流程。',
        price: 999,
        originalPrice: 1299,
        image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400&h=300&fit=crop',
        category: '开发工具',
        tags: ['开发者', '高效'],
        rating: 4.7,
        sales: 2100,
    },
    {
        id: 'prod_4',
        name: '网络安全防护套件',
        description: '多层次网络安全防护，实时监控与威胁预警，保障业务安全。',
        price: 3999,
        image: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=400&h=300&fit=crop',
        category: '安全服务',
        tags: ['安全', '企业级'],
        rating: 4.9,
        sales: 670,
        isHot: true,
    },
    {
        id: 'prod_5',
        name: '低代码开发平台',
        description: '无需编程基础，拖拽式搭建企业应用，快速实现数字化转型。',
        price: 1999,
        image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop',
        category: '开发工具',
        tags: ['低代码', '新品'],
        rating: 4.5,
        sales: 430,
        isNew: true,
    },
    {
        id: 'prod_6',
        name: '企业协同办公系统',
        description: '集成即时通讯、项目管理、文档协作等功能的一体化办公平台。',
        price: 699,
        originalPrice: 999,
        image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=300&fit=crop',
        category: '办公软件',
        tags: ['协作', '高效'],
        rating: 4.4,
        sales: 3200,
    },
];

const mockNews: News[] = [
    {
        id: 'news_1',
        title: '公司成功完成 C 轮融资，估值突破 10 亿美元',
        summary: '本轮融资由顶级投资机构领投，将用于产品研发和市场拓展。',
        content: '详细内容...',
        image: 'https://images.unsplash.com/photo-1579532537598-459ecdaf39cc?w=600&h=400&fit=crop',
        category: '新闻',
        author: '官方团队',
        publishTime: dayjs().subtract(1, 'day').format('YYYY-MM-DD HH:mm'),
        views: 8520,
    },
    {
        id: 'news_2',
        title: '重要通知：系统将于本周末进行升级维护',
        summary: '为提升服务质量，系统将在周六凌晨 2:00-6:00 进行升级。',
        content: '详细内容...',
        image: 'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=600&h=400&fit=crop',
        category: '公告',
        author: '技术团队',
        publishTime: dayjs().subtract(2, 'day').format('YYYY-MM-DD HH:mm'),
        views: 3240,
    },
    {
        id: 'news_3',
        title: '新版本 v3.0 正式发布，带来全新体验',
        summary: '全新 UI 设计、性能优化 50%、新增多项实用功能。',
        content: '详细内容...',
        image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600&h=400&fit=crop',
        category: '更新',
        author: '产品团队',
        publishTime: dayjs().subtract(5, 'day').format('YYYY-MM-DD HH:mm'),
        views: 12350,
    },
    {
        id: 'news_4',
        title: '技术沙龙活动报名开启，邀您共探前沿技术',
        summary: '本次沙龙将邀请业内专家分享 AI、云计算等前沿话题。',
        content: '详细内容...',
        image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&h=400&fit=crop',
        category: '活动',
        author: '市场团队',
        publishTime: dayjs().subtract(7, 'day').format('YYYY-MM-DD HH:mm'),
        views: 2180,
    },
];

const mockPartners: Partner[] = [
    { id: 'partner_1', name: '阿里云', logo: 'https://img.alicdn.com/tfs/TB1Ly5oS3HqK1RjSZFPXXcwapXa-238-54.png', description: '云计算战略合作伙伴' },
    { id: 'partner_2', name: '腾讯云', logo: 'https://cloudcache.tencent-cloud.com/qcloud/portal/resource/css/logo.svg', description: '技术生态合作伙伴' },
    { id: 'partner_3', name: '华为云', logo: 'https://res-static.hc-cdn.cn/cloudbu-site/china/zh-cn/logo-new.png', description: '战略合作伙伴' },
    { id: 'partner_4', name: 'AWS', logo: 'https://a0.awsstatic.com/libra-css/images/logos/aws_logo_smile_1200x630.png', description: '全球技术合作伙伴' },
    { id: 'partner_5', name: 'Microsoft', logo: 'https://img-prod-cms-rt-microsoft-com.akamaized.net/cms/api/am/imageFileData/RE1Mu3b', description: '战略合作伙伴' },
    { id: 'partner_6', name: 'Google Cloud', logo: 'https://www.gstatic.com/devrel-devsite/prod/vda9a5e332dd51f5aa0718a2c8c35b77f928a94ff0e9a5c8a38e9046c5b18c3aa/cloud/images/cloud-logo.svg', description: '技术合作伙伴' },
];

const mockTestimonials: Testimonial[] = [
    {
        id: 'test_1',
        name: '张明',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=zhangming',
        company: '科技创新有限公司',
        position: 'CTO',
        content: '使用这个平台后，我们的开发效率提升了 50%，强烈推荐给各位同行！',
        rating: 5,
    },
    {
        id: 'test_2',
        name: '李晓红',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=lixiaohong',
        company: '数据科技集团',
        position: '产品总监',
        content: '界面设计简洁美观，功能强大，完全满足我们的业务需求。',
        rating: 5,
    },
    {
        id: 'test_3',
        name: '王建国',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=wangjianguo',
        company: '智能制造公司',
        position: '技术经理',
        content: '客户服务非常专业，响应及时，解决问题效率很高。',
        rating: 4,
    },
];

const mockBanners: Banner[] = [
    {
        id: 'banner_1',
        title: '开启数字化转型新时代',
        subtitle: '专业的企业级解决方案，助力业务腾飞',
        image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1200&h=500&fit=crop',
        link: '/products',
        buttonText: '立即体验',
    },
    {
        id: 'banner_2',
        title: '智能云服务',
        subtitle: '安全、稳定、高效的云计算平台',
        image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200&h=500&fit=crop',
        link: '/products',
        buttonText: '了解更多',
    },
    {
        id: 'banner_3',
        title: '新年特惠活动',
        subtitle: '全场产品 8 折起，限时优惠',
        image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=1200&h=500&fit=crop',
        link: '/products',
        buttonText: '立即抢购',
    },
];

// ============ API 方法 ============

// 获取轮播图
export const getBanners = async (): Promise<ApiResponse<Banner[]>> => {
    await delay(300);
    return {
        code: 0,
        message: 'success',
        data: mockBanners,
    };
};

// 获取产品列表
export const getProducts = async (
    page: number = 1,
    pageSize: number = 6,
    category?: string
): Promise<PaginatedResponse<Product>> => {
    await delay(500);
    let filtered = [...mockProducts];
    if (category) {
        filtered = filtered.filter(p => p.category === category);
    }
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

// 获取热门产品
export const getHotProducts = async (limit: number = 4): Promise<ApiResponse<Product[]>> => {
    await delay(400);
    const hotProducts = mockProducts
        .filter(p => p.isHot || p.sales > 1000)
        .slice(0, limit);
    return {
        code: 0,
        message: 'success',
        data: hotProducts,
    };
};

// 获取新闻列表
export const getNewsList = async (
    page: number = 1,
    pageSize: number = 4,
    category?: string
): Promise<PaginatedResponse<News>> => {
    await delay(400);
    let filtered = [...mockNews];
    if (category) {
        filtered = filtered.filter(n => n.category === category);
    }
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

// 获取合作伙伴
export const getPartners = async (): Promise<ApiResponse<Partner[]>> => {
    await delay(300);
    return {
        code: 0,
        message: 'success',
        data: mockPartners,
    };
};

// 获取客户评价
export const getTestimonials = async (): Promise<ApiResponse<Testimonial[]>> => {
    await delay(300);
    return {
        code: 0,
        message: 'success',
        data: mockTestimonials,
    };
};

// 获取网站统计
export const getSiteStats = async (): Promise<ApiResponse<SiteStats>> => {
    await delay(200);
    return {
        code: 0,
        message: 'success',
        data: {
            totalUsers: 15000,
            totalProducts: 128,
            totalOrders: 52000,
            satisfactionRate: 98.5,
        },
    };
};
