import React, { createContext, useContext, useState, useEffect } from 'react';
import { fetchUsers, createUserApi, updateUserApi, deleteUserApi } from '../../../api/users';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let mounted = true;
        (async () => {
            try {
                const data = await fetchUsers();
                if (mounted) setUsers(Array.isArray(data) ? data : []);
            } catch (e) {
                console.error('Failed to load users:', e);
            } finally {
                if (mounted) setLoading(false);
            }
        })();
        return () => { mounted = false; };
    }, []);

    const createUser = async (newUser) => {
        const created = await createUserApi(newUser);
        setUsers(prev => [created, ...prev]);
        return created;
    };

    const updateUser = async (updatedUser) => {
        const { userId, ...payload } = updatedUser;
        const saved = await updateUserApi(userId, payload);
        setUsers(prev => prev.map(u => u.userId === userId ? saved : u));
        return saved;
    };

    const deleteUser = async (userId) => {
        await deleteUserApi(userId);
        setUsers(prev => prev.filter(u => u.userId !== userId));
    };

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
