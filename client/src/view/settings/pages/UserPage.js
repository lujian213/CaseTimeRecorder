import React, { useState } from 'react';
import { useUserContext } from '../context/UserContext';
import UserList from '../components/user/UserList';
import UserForm from '../components/user/UserForm';

const UserPage = ({ formOpen, currentItem, onCloseForm, onEdit }) => {
  const { users, loading, error, createUser, updateUser, deleteUser } = useUserContext();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchQuery, setSearchQuery] = useState('');

  // 处理表单提交
  const handleFormSubmit = (data) => {
    if (data.userId) {
      // 编辑现有用户
      updateUser(data);
    } else {
      // 创建新用户
      createUser(data);
    }
    onCloseForm();
  };

  // 处理删除用户
  const handleDelete = (userId) => {
    deleteUser(userId);
  };

  return (
    <div>
      <UserList
        users={users}
        loading={loading}
        error={error}
        onEdit={onEdit}
        onDelete={handleDelete}
        page={page}
        setPage={setPage}
        rowsPerPage={rowsPerPage}
        setRowsPerPage={setRowsPerPage}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />
      
      {/* 用户表单对话框 */}
      <UserForm
        open={formOpen}
        initialData={currentItem}
        onClose={onCloseForm}
        onSubmit={handleFormSubmit}
      />
    </div>
  );
};

export default UserPage;
