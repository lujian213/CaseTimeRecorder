import React, { createContext, useContext, useState, useEffect } from 'react';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    // 初始化模拟数据
    useEffect(() => {
        // 模拟API请求延迟
        setTimeout(() => {
            setUsers([
                { userId: "user1", userName: "张三", role: "管理员" },
                { userId: "user2", userName: "李四", role: "开发者" },
                { userId: "user3", userName: "王五", role: "测试员" }
            ]);
            setLoading(false);
        }, 600);
    }, []);

    // 创建用户
    const createUser = (newUser) => {
        // 检查用户ID是否已存在
        const exists = users.some(u => u.userId === newUser.userId);
        if (exists) {
            throw new Error(`用户ID ${newUser.userId} 已存在`);
        }

        setUsers(prev => [...prev, newUser]);
        return newUser;
    };

    // 更新用户
    const updateUser = (updatedUser) => {
        setUsers(prev => prev.map(u =>
            u.userId === updatedUser.userId ? updatedUser : u
        ));
    };

    // 删除用户
    const deleteUser = (userId) => {
        setUsers(prev => prev.filter(u => u.userId !== userId));
    };

    // 根据ID获取用户
    const getUserById = (userId) => {
        return users.find(u => u.userId === userId);
    };

    return (
        <UserContext.Provider value={{
            users,
            loading,
            createUser,
            updateUser,
            deleteUser,
            getUserById
        }}>
            {children}
        </UserContext.Provider>
    );
};

// 自定义Hook简化Context使用
export const useUserContext = () => {
    const context = useContext(UserContext);
    if (context === undefined) {
        throw new Error('useUserContext must be used within a UserProvider');
    }
    return context;
};
