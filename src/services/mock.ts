import dayjs from 'dayjs';

export interface User {
    id: string;
    name: string;
    email: string;
    role: '管理员' | '用户' | '访客';
    status: '活跃' | '非活跃';
    lastLogin: string;
}

export interface DashboardStats {
    totalUsers: number;
    activeUsers: number;
    revenue: number;
    newOrders: number;
}

const generateUsers = (count: number): User[] => {
    return Array.from({ length: count }).map((_, i) => ({
        id: `user_${i + 1}`,
        name: `User ${i + 1}`,
        email: `user${i + 1}@example.com`,
        role: i % 5 === 0 ? '管理员' : '用户',
        status: i % 3 === 0 ? '非活跃' : '活跃',
        lastLogin: dayjs().subtract(i, 'day').format('YYYY-MM-DD HH:mm:ss'),
    }));
};

const mockUsers = generateUsers(50);

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const getStats = async (): Promise<DashboardStats> => {
    await delay(800);
    return {
        totalUsers: 1250,
        activeUsers: 843,
        revenue: 45200,
        newOrders: 156,
    };
};

export const getUsers = async (
    page: number = 1,
    pageSize: number = 10,
    search?: string
): Promise<{ data: User[]; total: number }> => {
    await delay(600);

    let filtered = [...mockUsers];

    if (search) {
        const lower = search.toLowerCase();
        filtered = filtered.filter(
            (u) =>
                u.name.toLowerCase().includes(lower) ||
                u.email.toLowerCase().includes(lower)
        );
    }

    const start = (page - 1) * pageSize;
    const end = start + pageSize;

    return {
        data: filtered.slice(start, end),
        total: filtered.length,
    };
};

export const createUser = async (user: Omit<User, 'id'>) => {
    await delay(500);
    const newUser = {
        ...user,
        id: `user_${mockUsers.length + 1}_${Date.now()}`,
    };
    mockUsers.unshift(newUser);
    return newUser;
};

export const updateUser = async (id: string, data: Partial<User>) => {
    await delay(500);
    const userIndex = mockUsers.findIndex(u => u.id === id);
    if (userIndex > -1) {
        mockUsers[userIndex] = { ...mockUsers[userIndex], ...data };
        return mockUsers[userIndex];
    }
    return null;
};

export const deleteUser = async (id: string) => {
    await delay(500);
    const index = mockUsers.findIndex(u => u.id === id);
    if (index > -1) {
        mockUsers.splice(index, 1);
        return true;
    }
    return false;
};

