import React, { useState } from 'react';
import { 
  Box, Typography, List, CircularProgress, Button, 
  Fab 
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { useUserContext } from '../../context/UserContext';
import UserItem from './UserItem';
import UserForm from './UserForm';
import SearchBar from '../ui/SearchBar';

const UserList = ({ showNotification }) => {
  const { users, loading, deleteUser } = useUserContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  // 过滤用户
  const filteredUsers = users.filter(user => 
    user.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 打开表单对话框
  const handleOpenForm = (user = null) => {
    setCurrentUser(user);
    setDialogOpen(true);
  };

  // 处理表单提交
  const handleFormSubmit = (userData) => {
    setDialogOpen(false);
    showNotification(currentUser ? '用户已更新' : '用户已创建');
  };

  // 处理删除
  const handleDelete = (userId) => {
    deleteUser(userId);
    showNotification('用户已删除', 'info');
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', my: 8 }}>
        <CircularProgress size={24} />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h6" sx={{ 
        fontSize: 16, 
        fontWeight: 600, 
        mb: 2,
        color: '#333'
      }}>
        用户管理
      </Typography>
      
      <SearchBar 
        value={searchTerm}
        onChange={setSearchTerm}
        placeholder="搜索用户..."
        sx={{ mb: 2 }}
      />
      
      {filteredUsers.length === 0 ? (
        <Box sx={{ 
          textAlign: 'center', 
          py: 8, 
          color: '#666',
          backgroundColor: 'white',
          borderRadius: 2,
          mb: 2
        }}>
          <Typography>没有找到用户</Typography>
          <Button 
            variant="text" 
            color="primary" 
            size="small"
            onClick={() => handleOpenForm()}
            sx={{ mt: 1 }}
          >
            + 创建第一个用户
          </Button>
        </Box>
      ) : (
        <List sx={{ padding: 0, mb: 8 }}>
          {filteredUsers.map(user => (
            <UserItem 
              key={user.userId}
              user={user}
              onEdit={() => handleOpenForm(user)}
              onDelete={() => handleDelete(user.userId)}
            />
          ))}
        </List>
      )}
      
      {/* 新增按钮 */}
      <Fab
        color="primary"
        size="small"
        sx={{
          position: 'fixed',
          right: 20,
          bottom: 76, // 避开底部导航
          width: 56,
          height: 56,
          boxShadow: 3
        }}
        onClick={() => handleOpenForm()}
      >
        <AddIcon />
      </Fab>
      
      {/* 用户表单对话框 */}
      <UserForm
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onSubmit={handleFormSubmit}
        initialData={currentUser}
      />
    </Box>
  );
};

export default UserList;
    