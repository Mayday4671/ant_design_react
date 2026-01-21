import React, { useState } from 'react';
import { Layout, Menu, Button, ConfigProvider } from 'antd';
import {
    MenuFoldOutlined, MenuUnfoldOutlined, DashboardOutlined,
    UserOutlined, SettingOutlined,
    RobotOutlined, HomeOutlined, ReadOutlined, CrownOutlined
} from '@ant-design/icons';
import { useLocation, useNavigate, Outlet } from 'react-router-dom';
import { useAppTheme } from '../contexts/theme-context';

const { Header, Sider, Content } = Layout;

const AdminLayout: React.FC = () => {
    const { adminBackgroundImage, isDarkMode, getAntdTheme, contentOpacity } = useAppTheme();
    const [collapsed, setCollapsed] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    // 使用后台专属的背景图生成主题
    const adminTheme = getAntdTheme(adminBackgroundImage);

    // 现代化背景渐变
    const layoutBg = isDarkMode
        ? 'linear-gradient(135deg, #0d0d1a 0%, #1a1a2e 50%, #16213e 100%)'
        : 'linear-gradient(135deg, #e8eaf6 0%, #f5f7fa 50%, #e3f2fd 100%)';

    // 玻璃拟态样式 - blur 和透明度根据 contentOpacity 动态变化
    // 透明度越低，blur 越弱，背景图越清晰
    const blurAmount = Math.round(contentOpacity * 20); // 0-20px
    const glassStyle = {
        background: isDarkMode
            ? `rgba(30, 30, 45, ${contentOpacity})`
            : `rgba(255, 255, 255, ${contentOpacity})`,
        backdropFilter: adminBackgroundImage && blurAmount > 0 ? `blur(${blurAmount}px) saturate(${100 + contentOpacity * 80}%)` : undefined,
        WebkitBackdropFilter: adminBackgroundImage && blurAmount > 0 ? `blur(${blurAmount}px) saturate(${100 + contentOpacity * 80}%)` : undefined,
    };

    // 菜单项样式
    const menuItemStyle: React.CSSProperties = {
        margin: '4px 12px',
        borderRadius: '12px',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    };

    return (
        <ConfigProvider theme={adminTheme}>
            <Layout
                style={{
                    minHeight: '100vh',
                    background: adminBackgroundImage
                        ? `url(${adminBackgroundImage}) center/cover fixed`
                        : layoutBg,
                }}
            >
                <Sider
                    trigger={null}
                    collapsible
                    collapsed={collapsed}
                    width={240}
                    theme={isDarkMode ? 'dark' : 'light'}
                    style={{
                        ...glassStyle,
                        borderRight: `1px solid ${isDarkMode ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)'}`,
                        boxShadow: isDarkMode
                            ? '4px 0 24px rgba(0,0,0,0.3), inset 0 0 60px rgba(255,255,255,0.02)'
                            : '4px 0 24px rgba(0,0,0,0.08), inset 0 0 60px rgba(255,255,255,0.5)',
                        position: 'fixed',
                        height: '100vh',
                        left: 0,
                        top: 0,
                        zIndex: 100,
                    }}
                >
                    {/* Logo区域 */}
                    <div
                        style={{
                            padding: collapsed ? '24px 8px' : '28px 24px',
                            textAlign: 'center',
                            borderBottom: `1px solid ${isDarkMode ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)'}`,
                            background: isDarkMode
                                ? 'linear-gradient(180deg, rgba(255,255,255,0.03) 0%, transparent 100%)'
                                : 'linear-gradient(180deg, rgba(102, 126, 234, 0.05) 0%, transparent 100%)',
                            position: 'relative',
                        }}
                    >
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: collapsed ? 0 : 12,
                        }}>
                            <CrownOutlined style={{
                                fontSize: collapsed ? 28 : 32,
                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                filter: 'drop-shadow(0 2px 8px rgba(102, 126, 234, 0.4))',
                                animation: 'logoFloat 3s ease-in-out infinite',
                            }} />
                            {!collapsed && (
                                <h1
                                    style={{
                                        margin: 0,
                                        fontSize: '1.25rem',
                                        fontWeight: 700,
                                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                        WebkitBackgroundClip: 'text',
                                        WebkitTextFillColor: 'transparent',
                                        letterSpacing: '0.5px',
                                    }}
                                >
                                    管理控制台
                                </h1>
                            )}
                        </div>
                        {/* 底部渐变线 */}
                        <div style={{
                            position: 'absolute',
                            bottom: -1,
                            left: 20,
                            right: 20,
                            height: 2,
                            background: 'linear-gradient(90deg, transparent, #667eea, #764ba2, transparent)',
                            borderRadius: 2,
                        }} />
                    </div>

                    {/* 菜单列表 */}
                    <div style={{
                        flex: 1,
                        overflowY: 'auto',
                        overflowX: 'hidden',
                        padding: '12px 0',
                    }}>
                        <Menu
                            theme={isDarkMode ? 'dark' : 'light'}
                            mode="inline"
                            selectedKeys={[location.pathname]}
                            onClick={({ key }) => navigate(key)}
                            style={{
                                border: 'none',
                                background: 'transparent',
                            }}
                            items={[
                                {
                                    key: '/admin',
                                    icon: <DashboardOutlined style={{ fontSize: 18 }} />,
                                    label: '仪表盘',
                                    style: menuItemStyle,
                                },
                                {
                                    key: '/admin/articles',
                                    icon: <ReadOutlined style={{ fontSize: 18 }} />,
                                    label: '文章管理',
                                    style: menuItemStyle,
                                },
                                {
                                    key: '/admin/users',
                                    icon: <UserOutlined style={{ fontSize: 18 }} />,
                                    label: '用户列表',
                                    style: menuItemStyle,
                                },
                                {
                                    key: 'knowledge-group',
                                    icon: <ReadOutlined style={{ fontSize: 18 }} />,
                                    label: '项目文档',
                                    style: menuItemStyle,
                                    children: [
                                        {
                                            key: '/admin/knowledge',
                                            label: '文档管理',
                                        },
                                        {
                                            key: '/admin/knowledge/category',
                                            label: '分类管理',
                                        },
                                    ],
                                },
                                {
                                    key: '/admin/ai',
                                    icon: <RobotOutlined style={{ fontSize: 18 }} />,
                                    label: 'AI 助手',
                                    style: menuItemStyle,
                                },
                                {
                                    key: '/admin/settings',
                                    icon: <SettingOutlined style={{ fontSize: 18 }} />,
                                    label: '设置',
                                    style: menuItemStyle,
                                },
                                {
                                    type: 'divider',
                                    style: {
                                        margin: '16px 24px',
                                        background: isDarkMode
                                            ? 'linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)'
                                            : 'linear-gradient(90deg, transparent, rgba(0,0,0,0.08), transparent)',
                                    },
                                },
                                {
                                    key: '/',
                                    icon: <HomeOutlined style={{ fontSize: 18 }} />,
                                    label: '返回前台',
                                    style: menuItemStyle,
                                },
                            ]}
                        />
                    </div>
                </Sider>

                {/* 主内容区 */}
                <Layout style={{
                    marginLeft: collapsed ? 80 : 240,
                    background: 'transparent',
                    transition: 'margin-left 0.2s',
                }}>
                    {/* 顶部导航栏 */}
                    <Header
                        style={{
                            padding: '0 24px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            ...glassStyle,
                            borderBottom: `1px solid ${isDarkMode ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)'}`,
                            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                            position: 'sticky',
                            top: 0,
                            zIndex: 50,
                        }}
                    >
                        <Button
                            type="text"
                            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                            onClick={() => setCollapsed(!collapsed)}
                            style={{
                                fontSize: '18px',
                                width: 48,
                                height: 48,
                                borderRadius: 12,
                                transition: 'all 0.3s',
                            }}
                        />
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 16,
                        }}>
                            <span style={{
                                fontSize: 14,
                                color: isDarkMode ? 'rgba(255,255,255,0.65)' : 'rgba(0,0,0,0.65)',
                            }}>
                                欢迎回来，管理员
                            </span>
                            <div style={{
                                width: 36,
                                height: 36,
                                borderRadius: '50%',
                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: '#fff',
                                fontSize: 14,
                                fontWeight: 600,
                                boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
                            }}>
                                A
                            </div>
                        </div>
                    </Header>

                    {/* 内容区域 */}
                    <Content
                        style={{
                            margin: 24,
                            padding: 28,
                            minHeight: 'calc(100vh - 112px)',
                            ...glassStyle,
                            borderRadius: 20,
                            boxShadow: isDarkMode
                                ? '0 8px 32px rgba(0,0,0,0.3), inset 0 0 60px rgba(255,255,255,0.02)'
                                : '0 8px 32px rgba(0,0,0,0.08), inset 0 0 60px rgba(255,255,255,0.5)',
                            border: `1px solid ${isDarkMode ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.04)'}`,
                        }}
                    >
                        <Outlet />
                    </Content>
                </Layout>
            </Layout>

            {/* 添加全局动画样式 */}
            <style>{`
                @keyframes logoFloat {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-3px); }
                }
                
                .ant-menu-item {
                    position: relative;
                    overflow: hidden;
                }
                
                .ant-menu-item::before {
                    content: '';
                    position: absolute;
                    left: 0;
                    top: 50%;
                    transform: translateY(-50%) scaleY(0);
                    width: 4px;
                    height: 60%;
                    background: linear-gradient(180deg, #667eea 0%, #764ba2 100%);
                    border-radius: 0 4px 4px 0;
                    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                }
                
                .ant-menu-item:hover {
                    transform: translateX(4px);
                }
                
                .ant-menu-item:hover .anticon {
                    transform: scale(1.15);
                    filter: drop-shadow(0 0 8px rgba(102, 126, 234, 0.4));
                }
                
                .ant-menu-item .anticon {
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                }
                
                .ant-menu-item-selected::before {
                    transform: translateY(-50%) scaleY(1);
                }
                
                .ant-menu-item-selected {
                    background: linear-gradient(135deg, rgba(102, 126, 234, 0.15) 0%, rgba(118, 75, 162, 0.1) 100%) !important;
                    box-shadow: 0 4px 15px rgba(102, 126, 234, 0.15);
                }
                
                .ant-menu-item-selected .anticon {
                    color: #667eea !important;
                    filter: drop-shadow(0 0 10px rgba(102, 126, 234, 0.4));
                }
            `}</style>
        </ConfigProvider>
    );
};

export default AdminLayout;
