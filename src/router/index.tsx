import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Layouts
import AdminLayout from '../layouts/admin-layout';
import AIToolsLayout from '../layouts/ai-tools-layout';
import ImageToolsLayout from '../layouts/image-tools-layout';

// Frontend Pages - AI Tools Home
import AIToolsHome from '../pages/frontend/ai-tools-home';
import { About, Articles, ArticleDetail, AIChat } from '../pages/frontend';

// Admin Pages
import { Dashboard, UserList, Settings, ArticleManage, GPTChat, KnowledgeAdmin, CategoryAdmin } from '../pages/admin';
import KnowledgeViewer from '../pages/frontend/knowledge';
import ImageCompress from '../pages/frontend/image-tools/compress';
import ImageCrop from '../pages/frontend/image-tools/crop';
import ImageResize from '../pages/frontend/image-tools/resize';
import ImageConvert from '../pages/frontend/image-tools/convert';
import ImageWatermark from '../pages/frontend/image-tools/watermark';
import ImageBase64 from '../pages/frontend/image-tools/base64';
import ImageToIco from '../pages/frontend/image-tools/to-ico';
import ImageColorPicker from '../pages/frontend/image-tools/color-picker';
import ImageGridCrop from '../pages/frontend/image-tools/grid-crop';
import ImageBgRemove from '../pages/frontend/image-tools/bg-remove';

const AppRouter: React.FC = () => {
    return (
        <Routes>
            {/* 前台 AI 工具导航路由 (通用) */}
            <Route path="/" element={<AIToolsLayout />}>
                <Route index element={<AIToolsHome />} />
                <Route path="about" element={<About />} />
                <Route path="articles" element={<Articles />} />
                <Route path="article/:id" element={<ArticleDetail />} />
                <Route path="ai-chat" element={<AIChat />} />
                <Route path="docs" element={<KnowledgeViewer />} />
            </Route>

            {/* 图片工具专区 (独立布局) */}
            <Route path="/tools/image" element={<ImageToolsLayout />}>
                <Route index element={<ImageCompress />} />
                <Route path="compress" element={<ImageCompress />} />
                <Route path="crop" element={<ImageCrop />} />
                <Route path="resize" element={<ImageResize />} />
                <Route path="convert" element={<ImageConvert />} />
                <Route path="watermark" element={<ImageWatermark />} />
                <Route path="base64" element={<ImageBase64 />} />
                <Route path="to-ico" element={<ImageToIco />} />
                <Route path="color-picker" element={<ImageColorPicker />} />
                <Route path="grid-crop" element={<ImageGridCrop />} />
                <Route path="bg-remove" element={<ImageBgRemove />} />
                <Route path="*" element={<ImageCompress />} />
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
