import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Layouts
import AdminLayout from '../layouts/admin-layout';
import AIToolsLayout from '../layouts/ai-tools-layout';

// Frontend Pages - AI Tools Home
import AIToolsHome from '../pages/frontend/ai-tools-home';
import { About, Articles, ArticleDetail, AIChat } from '../pages/frontend';

// Admin Pages
import { Dashboard, UserList, Settings, ArticleManage, GPTChat, KnowledgeAdmin, CategoryAdmin } from '../pages/admin';
import KnowledgeViewer from '../pages/frontend/knowledge';

const AppRouter: React.FC = () => {
    return (
        <Routes>
            {/* 前台 AI 工具导航路由 */}
            <Route path="/" element={<AIToolsLayout />}>
                <Route index element={<AIToolsHome />} />
                <Route path="about" element={<About />} />
                <Route path="articles" element={<Articles />} />
                <Route path="article/:id" element={<ArticleDetail />} />
                <Route path="ai-chat" element={<AIChat />} />
                <Route path="docs" element={<KnowledgeViewer />} />
            </Route>

            {/* 后台管理路由 */}
            <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<Dashboard />} />
                <Route path="users" element={<UserList />} />
                <Route path="articles" element={<ArticleManage />} />
                <Route path="knowledge" element={<KnowledgeAdmin />} />
                <Route path="knowledge/category" element={<CategoryAdmin />} />
                <Route path="ai" element={<GPTChat />} />
                <Route path="settings" element={<Settings />} />
            </Route>
        </Routes>
    );
};

export default AppRouter;
