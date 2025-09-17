import React, { createContext, useContext, useState, useEffect } from 'react';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // 初始化模拟数据
  useEffect(() => {
    setTimeout(() => {
      setUsers([
        { userId: 1, userName: "张三", email: "zhangsan@example.com", role: "管理员" },
        { userId: 2, userName: "李四", email: "lisi@example.com", role: "开发者" },
        { userId: 3, userName: "王五", email: "wangwu@example.com", role: "测试员" }
      ]);
      setLoading(false);
    }, 800);
  }, []);

  // 新增用户
  const addUser = (newUser) => {
    const userWithId = {
      ...newUser,
      userId: users.length > 0 ? Math.max(...users.map(u => u.userId)) + 1 : 1
    };
    setUsers(prev => [...prev, userWithId]);
    return userWithId;
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

  return (
    <UserContext.Provider value={{ 
      users, 
      loading, 
      addUser, 
      updateUser, 
      deleteUser 
    }}>
      {children}
    </UserContext.Provider>
  );
};

// 自定义Hook简化Context使用
export const useUserContext = () => useContext(UserContext);
    