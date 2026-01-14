import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Layouts
import AdminLayout from '../layouts/admin-layout';
import FrontendLayout from '../layouts/frontend-layout';

// Frontend Pages
import { Home, About, Articles, ArticleDetail } from '../pages/frontend';

// Admin Pages
import { Dashboard, UserList, Settings, ArticleManage, GPTChat } from '../pages/admin';

const AppRouter: React.FC = () => {
    return (
        <Routes>
            {/* 前台展示路由 */}
            <Route path="/" element={<FrontendLayout />}>
                <Route index element={<Home />} />
                <Route path="about" element={<About />} />
                <Route path="articles" element={<Articles />} />
                <Route path="article/:id" element={<ArticleDetail />} />
            </Route>

            {/* 后台管理路由 */}
            <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<Dashboard />} />
                <Route path="users" element={<UserList />} />
                <Route path="articles" element={<ArticleManage />} />
                <Route path="ai" element={<GPTChat />} />
                <Route path="settings" element={<Settings />} />
            </Route>
        </Routes>
    );
};

export default AppRouter;
