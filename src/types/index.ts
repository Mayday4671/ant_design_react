// 通用类型定义

// API 响应类型
export interface ApiResponse<T = any> {
    code: number;
    message: string;
    data: T;
}

// 分页请求参数
export interface PaginationParams {
    page: number;
    pageSize: number;
}

// 分页响应数据
export interface PaginatedData<T> {
    list: T[];
    total: number;
    page: number;
    pageSize: number;
}
