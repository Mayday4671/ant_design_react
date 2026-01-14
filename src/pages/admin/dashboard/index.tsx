import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Statistic, Table, Tag, Typography, DatePicker } from 'antd';
import {
    FileTextOutlined, EyeOutlined, LikeOutlined, CommentOutlined,
    RiseOutlined, FallOutlined
} from '@ant-design/icons';
import { Line, Column, Pie, Area } from '@ant-design/charts';
import { getArticles, getCategories, type Article, type Category } from '../../../services/article-mock';
import dayjs from 'dayjs';

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

// 每日统计数据类型
interface DailyStat {
    date: string;
    views: number;
    likes: number;
    comments: number;
}

interface WeeklyPublish {
    week: string;
    count: number;
    type: string;
}

// 生成模拟的每日统计数据
const generateDailyStats = (): DailyStat[] => {
    const data: DailyStat[] = [];
    for (let i = 30; i >= 0; i--) {
        const date = dayjs().subtract(i, 'day').format('MM-DD');
        data.push({
            date,
            views: Math.floor(Math.random() * 500) + 100,
            likes: Math.floor(Math.random() * 50) + 10,
            comments: Math.floor(Math.random() * 20) + 5,
        });
    }
    return data;
};

// 生成每周发布趋势
const generateWeeklyPublish = (): WeeklyPublish[] => {
    const data: WeeklyPublish[] = [];
    const weeks = ['第1周', '第2周', '第3周', '第4周', '第5周', '第6周', '第7周', '第8周'];
    weeks.forEach(week => {
        data.push({
            week,
            count: Math.floor(Math.random() * 8) + 2,
            type: '发布数',
        });
        data.push({
            week,
            count: Math.floor(Math.random() * 3) + 1,
            type: '草稿数',
        });
    });
    return data;
};

const Dashboard: React.FC = () => {
    const [articles, setArticles] = useState<Article[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [dailyStats] = useState(generateDailyStats());
    const [weeklyPublish] = useState(generateWeeklyPublish());

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        try {
            const [articleRes, categoryRes] = await Promise.all([
                getArticles(1, 100),
                getCategories(),
            ]);
            setArticles(articleRes.data.list);
            setCategories(categoryRes.data);
        } finally {
            setLoading(false);
        }
    };

    // 计算统计数据
    const totalArticles = articles.length;
    const publishedArticles = articles.filter(a => a.status === 'published').length;
    const draftArticles = articles.filter(a => a.status === 'draft').length;
    const totalViews = articles.reduce((sum, a) => sum + a.views, 0);
    const totalLikes = articles.reduce((sum, a) => sum + a.likes, 0);

    // 分类统计
    const categoryStats = categories.map(cat => ({
        category: cat.name,
        count: articles.filter(a => a.category === cat.name).length,
    }));

    // 状态分布
    const statusStats = [
        { type: '已发布', value: publishedArticles },
        { type: '草稿', value: draftArticles },
    ];

    // 热门文章
    const topArticles = [...articles]
        .sort((a, b) => b.views - a.views)
        .slice(0, 5);

    // 图表配置
    const lineConfig = {
        data: dailyStats,
        xField: 'date',
        yField: 'views',
        smooth: true,
        color: '#1677ff',
        point: { size: 3 },
        area: { style: { fill: 'l(270) 0:#ffffff 1:#1677ff20' } },
    };

    const areaConfig = {
        data: dailyStats.flatMap(d => [
            { date: d.date, value: d.likes, type: '点赞' },
            { date: d.date, value: d.comments, type: '评论' },
        ]),
        xField: 'date',
        yField: 'value',
        seriesField: 'type',
        smooth: true,
        color: ['#52c41a', '#fa8c16'],
    };

    const columnConfig = {
        data: weeklyPublish,
        xField: 'week',
        yField: 'count',
        seriesField: 'type',
        isGroup: true,
        color: ['#1677ff', '#d9d9d9'],
    };

    const pieConfig = {
        data: categoryStats.filter(c => c.count > 0),
        angleField: 'count',
        colorField: 'category',
        radius: 0.8,
        innerRadius: 0.6,
        label: {
            text: 'category',
            position: 'outside',
        },
        legend: {
            position: 'right' as const,
        },
    };

    const statusPieConfig = {
        data: statusStats,
        angleField: 'value',
        colorField: 'type',
        radius: 0.9,
        innerRadius: 0.6,
        color: ['#52c41a', '#faad14'],
        label: {
            text: 'value',
            position: 'inside',
        },
        legend: {
            position: 'bottom' as const,
        },
        annotations: [
            {
                type: 'text',
                style: {
                    text: `${totalArticles}`,
                    x: '50%',
                    y: '50%',
                    textAlign: 'center',
                    fontSize: 24,
                    fontWeight: 'bold',
                },
            },
        ],
    };

    // 热门文章表格列
    const columns = [
        {
            title: '排名',
            key: 'rank',
            width: 60,
            render: (_: unknown, __: unknown, index: number) => (
                <Tag color={index < 3 ? 'gold' : 'default'}>{index + 1}</Tag>
            ),
        },
        {
            title: '标题',
            dataIndex: 'title',
            ellipsis: true,
        },
        {
            title: '分类',
            dataIndex: 'category',
            width: 100,
            render: (cat: string) => <Tag color="blue">{cat}</Tag>,
        },
        {
            title: '浏览',
            dataIndex: 'views',
            width: 80,
            render: (views: number) => <Text type="secondary"><EyeOutlined /> {views}</Text>,
        },
        {
            title: '点赞',
            dataIndex: 'likes',
            width: 80,
            render: (likes: number) => <Text type="secondary"><LikeOutlined /> {likes}</Text>,
        },
    ];

    return (
        <div>
            <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Title level={2} style={{ margin: 0 }}>数据统计</Title>
                <RangePicker />
            </div>

            {/* 统计卡片 */}
            <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
                <Col xs={24} sm={12} lg={6}>
                    <Card>
                        <Statistic
                            title="文章总数"
                            value={totalArticles}
                            prefix={<FileTextOutlined />}
                            suffix="篇"
                        />
                        <div style={{ marginTop: 8 }}>
                            <Text type="secondary">已发布 {publishedArticles} / 草稿 {draftArticles}</Text>
                        </div>
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card>
                        <Statistic
                            title="总浏览量"
                            value={totalViews}
                            prefix={<EyeOutlined />}
                            styles={{ content: { color: '#1677ff' } }}
                        />
                        <div style={{ marginTop: 8 }}>
                            <Text type="success"><RiseOutlined /> 较昨日 +12%</Text>
                        </div>
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card>
                        <Statistic
                            title="总点赞数"
                            value={totalLikes}
                            prefix={<LikeOutlined />}
                            styles={{ content: { color: '#52c41a' } }}
                        />
                        <div style={{ marginTop: 8 }}>
                            <Text type="success"><RiseOutlined /> 较昨日 +8%</Text>
                        </div>
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card>
                        <Statistic
                            title="今日新增"
                            value={2}
                            prefix={<CommentOutlined />}
                            styles={{ content: { color: '#fa8c16' } }}
                            suffix="篇"
                        />
                        <div style={{ marginTop: 8 }}>
                            <Text type="danger"><FallOutlined /> 较昨日 -1</Text>
                        </div>
                    </Card>
                </Col>
            </Row>

            {/* 图表区域 */}
            <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
                <Col xs={24} lg={16}>
                    <Card title="浏览量趋势（近30天）" loading={loading}>
                        <Line {...lineConfig} height={280} />
                    </Card>
                </Col>
                <Col xs={24} lg={8}>
                    <Card title="文章状态" loading={loading}>
                        <Pie {...statusPieConfig} height={280} />
                    </Card>
                </Col>
            </Row>

            <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
                <Col xs={24} lg={12}>
                    <Card title="互动趋势（点赞/评论）" loading={loading}>
                        <Area {...areaConfig} height={250} />
                    </Card>
                </Col>
                <Col xs={24} lg={12}>
                    <Card title="发布趋势（近8周）" loading={loading}>
                        <Column {...columnConfig} height={250} />
                    </Card>
                </Col>
            </Row>

            <Row gutter={[16, 16]}>
                <Col xs={24} lg={12}>
                    <Card title="分类分布" loading={loading}>
                        <Pie {...pieConfig} height={300} />
                    </Card>
                </Col>
                <Col xs={24} lg={12}>
                    <Card title="热门文章 TOP 5" loading={loading}>
                        <Table
                            dataSource={topArticles}
                            columns={columns}
                            rowKey="id"
                            pagination={false}
                            size="small"
                        />
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default Dashboard;
