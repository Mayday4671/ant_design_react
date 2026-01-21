/**
 * 知识库/项目管理服务层
 * 使用 LocalStorage 进行数据持久化
 */

// ========== 类型定义 ==========

export interface KnowledgeCategory {
    id: string;
    name: string;
    description: string;
    order: number;
    createdAt: string;
    updatedAt: string;
}

export interface KnowledgeDocument {
    id: string;
    categoryId: string;
    title: string;
    content: string;
    order: number;
    createdAt: string;
    updatedAt: string;
}

// ========== LocalStorage Keys ==========

const CATEGORIES_KEY = 'knowledge_categories';
const DOCUMENTS_KEY = 'knowledge_documents';

// ========== 初始数据 ==========

const initialCategories: KnowledgeCategory[] = [
    {
        id: 'cat-1',
        name: '快速开始',
        description: '快速入门指南',
        order: 1,
        createdAt: '2026-01-01T00:00:00Z',
        updatedAt: '2026-01-01T00:00:00Z',
    },
    {
        id: 'cat-2',
        name: '开发指南',
        description: '详细的开发文档',
        order: 2,
        createdAt: '2026-01-01T00:00:00Z',
        updatedAt: '2026-01-01T00:00:00Z',
    },
    {
        id: 'cat-3',
        name: 'API 参考',
        description: 'API 接口文档',
        order: 3,
        createdAt: '2026-01-01T00:00:00Z',
        updatedAt: '2026-01-01T00:00:00Z',
    },
];

const initialDocuments: KnowledgeDocument[] = [
    {
        id: 'doc-1',
        categoryId: 'cat-1',
        title: '项目介绍',
        content: `# 项目介绍

欢迎使用我们的项目！

## 概述

这是一个基于 React + Ant Design 构建的现代化 Web 应用。

## 主要功能

- 🎨 美观的 UI 设计
- 🌙 支持深色模式
- 📱 响应式布局
- 🤖 AI 智能助手

## 快速开始

\`\`\`bash
npm install
npm run dev
\`\`\`
`,
        order: 1,
        createdAt: '2026-01-01T00:00:00Z',
        updatedAt: '2026-01-01T00:00:00Z',
    },
    {
        id: 'doc-2',
        categoryId: 'cat-1',
        title: '安装配置',
        content: `# 安装配置

## 环境要求

- Node.js 18+
- npm 或 pnpm

## 安装步骤

1. 克隆仓库
2. 安装依赖
3. 启动开发服务器

\`\`\`bash
git clone <repo-url>
cd project
npm install
npm run dev
\`\`\`
`,
        order: 2,
        createdAt: '2026-01-01T00:00:00Z',
        updatedAt: '2026-01-01T00:00:00Z',
    },
];

// ========== 工具函数 ==========

const generateId = () => `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

const getCategories = (): KnowledgeCategory[] => {
    const data = localStorage.getItem(CATEGORIES_KEY);
    if (!data) {
        localStorage.setItem(CATEGORIES_KEY, JSON.stringify(initialCategories));
        return initialCategories;
    }
    return JSON.parse(data);
};

const saveCategories = (categories: KnowledgeCategory[]) => {
    localStorage.setItem(CATEGORIES_KEY, JSON.stringify(categories));
};

const getDocuments = (): KnowledgeDocument[] => {
    const data = localStorage.getItem(DOCUMENTS_KEY);
    if (!data) {
        localStorage.setItem(DOCUMENTS_KEY, JSON.stringify(initialDocuments));
        return initialDocuments;
    }
    return JSON.parse(data);
};

const saveDocuments = (documents: KnowledgeDocument[]) => {
    localStorage.setItem(DOCUMENTS_KEY, JSON.stringify(documents));
};

// ========== 分类 CRUD ==========

export const fetchCategories = async (): Promise<{ data: KnowledgeCategory[] }> => {
    await new Promise(r => setTimeout(r, 100)); // 模拟延迟
    return { data: getCategories().sort((a, b) => a.order - b.order) };
};

export const createCategory = async (category: Omit<KnowledgeCategory, 'id' | 'createdAt' | 'updatedAt'>): Promise<{ data: KnowledgeCategory }> => {
    const categories = getCategories();
    const newCategory: KnowledgeCategory = {
        ...category,
        id: generateId(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    };
    categories.push(newCategory);
    saveCategories(categories);
    return { data: newCategory };
};

export const updateCategory = async (id: string, updates: Partial<KnowledgeCategory>): Promise<{ data: KnowledgeCategory }> => {
    const categories = getCategories();
    const index = categories.findIndex(c => c.id === id);
    if (index === -1) throw new Error('Category not found');

    categories[index] = {
        ...categories[index],
        ...updates,
        updatedAt: new Date().toISOString(),
    };
    saveCategories(categories);
    return { data: categories[index] };
};

export const deleteCategory = async (id: string): Promise<void> => {
    const categories = getCategories();
    const filtered = categories.filter(c => c.id !== id);
    saveCategories(filtered);

    // 同时删除该分类下的所有文档
    const documents = getDocuments();
    const filteredDocs = documents.filter(d => d.categoryId !== id);
    saveDocuments(filteredDocs);
};

// ========== 文档 CRUD ==========

export const fetchDocuments = async (categoryId?: string): Promise<{ data: KnowledgeDocument[] }> => {
    await new Promise(r => setTimeout(r, 100));
    let documents = getDocuments();
    if (categoryId) {
        documents = documents.filter(d => d.categoryId === categoryId);
    }
    return { data: documents.sort((a, b) => a.order - b.order) };
};

export const fetchDocumentById = async (id: string): Promise<{ data: KnowledgeDocument | null }> => {
    const documents = getDocuments();
    const doc = documents.find(d => d.id === id);
    return { data: doc || null };
};

export const createDocument = async (doc: Omit<KnowledgeDocument, 'id' | 'createdAt' | 'updatedAt'>): Promise<{ data: KnowledgeDocument }> => {
    const documents = getDocuments();
    const newDoc: KnowledgeDocument = {
        ...doc,
        id: generateId(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    };
    documents.push(newDoc);
    saveDocuments(documents);
    return { data: newDoc };
};

export const updateDocument = async (id: string, updates: Partial<KnowledgeDocument>): Promise<{ data: KnowledgeDocument }> => {
    const documents = getDocuments();
    const index = documents.findIndex(d => d.id === id);
    if (index === -1) throw new Error('Document not found');

    documents[index] = {
        ...documents[index],
        ...updates,
        updatedAt: new Date().toISOString(),
    };
    saveDocuments(documents);
    return { data: documents[index] };
};

export const deleteDocument = async (id: string): Promise<void> => {
    const documents = getDocuments();
    const filtered = documents.filter(d => d.id !== id);
    saveDocuments(filtered);
};

// ========== 辅助函数 ==========

export const getDocumentsByCategory = async (): Promise<{ data: Record<string, KnowledgeDocument[]> }> => {
    const documents = getDocuments();
    const grouped: Record<string, KnowledgeDocument[]> = {};

    documents.forEach(doc => {
        if (!grouped[doc.categoryId]) {
            grouped[doc.categoryId] = [];
        }
        grouped[doc.categoryId].push(doc);
    });

    // 排序
    Object.keys(grouped).forEach(key => {
        grouped[key].sort((a, b) => a.order - b.order);
    });

    return { data: grouped };
};
