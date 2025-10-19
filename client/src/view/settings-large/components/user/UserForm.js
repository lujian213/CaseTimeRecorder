import React, { useState, useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogContentText,
  DialogActions, Button, TextField, MenuItem, Box,
  FormControl, InputLabel, Select, Alert
} from '@mui/material';
import { useUserContext } from '../../context/UserContext';

const UserForm = ({ open, onClose, onSubmit, initialData }) => {
  const { createUser, updateUser, users } = useUserContext();
  const [formData, setFormData] = useState({
    userId: '',
    userName: '',
    role: ''
  });
  const [errors, setErrors] = useState({});
  const [isNewUser, setIsNewUser] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  // 初始化表单数据
  useEffect(() => {
    setErrorMessage('');
    if (initialData) {
      setFormData({
        userId: initialData.userId,
        userName: initialData.userName || '',
        role: initialData.role || ''
      });
      setIsNewUser(false);
    } else {
      setFormData({
        userId: '',
        userName: '',
        role: ''
      });
      setIsNewUser(true);
    }
    setErrors({});
  }, [initialData, open]);

  // 处理输入变化
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // 清除对应字段的错误
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
    
    // 清除全局错误消息
    if (errorMessage) {
      setErrorMessage('');
    }
  };

  // 表单验证
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.userId.trim()) {
      newErrors.userId = '用户ID不能为空';
    } else if (isNewUser) {
      // 新增用户时检查ID是否已存在
      const exists = users.some(u => u.userId === formData.userId);
      if (exists) {
        newErrors.userId = '该用户ID已存在';
      }
    }
    
    if (!formData.userName.trim()) {
      newErrors.userName = '用户名不能为空';
    }
    
    if (!formData.role) {
      newErrors.role = '请选择角色';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 处理提交
  const handleSubmit = () => {
    try {
      if (validateForm()) {
        if (initialData) {
          // 编辑模式
          const updatedUser = { ...initialData, ...formData };
          updateUser(updatedUser);
          onSubmit(updatedUser, false);
        } else {
          // 新增模式
          const newUser = createUser(formData);
          onSubmit(newUser, true);
        }
      }
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          transition: 'all 0.3s ease'
        }
      }}
    >
      <DialogTitle sx={{ fontSize: '1.5rem', pb: 1 }}>
        {initialData ? '编辑用户' : '新增用户'}
      </DialogTitle>
      
      <DialogContent dividers>
        <DialogContentText sx={{ mb: 2 }}>
          {initialData ? '请修改用户信息' : '请输入新用户的信息'}
        </DialogContentText>
        
        {errorMessage && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {errorMessage}
          </Alert>
        )}
        
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            label="用户ID"
            name="userId"
            value={formData.userId}
            onChange={handleChange}
            fullWidth
            size="small"
            error={!!errors.userId}
            helperText={errors.userId || (isNewUser ? '' : '用户ID不可修改')}
            disabled={!isNewUser}
            sx={{ transition: 'all 0.2s' }}
          />
          
          <TextField
            label="用户名"
            name="userName"
            value={formData.userName}
            onChange={handleChange}
            fullWidth
            size="small"
            error={!!errors.userName}
            helperText={errors.userName}
            sx={{ transition: 'all 0.2s' }}
          />
          
          <FormControl fullWidth size="small" error={!!errors.role}>
            <InputLabel>角色</InputLabel>
            <Select
              name="role"
              value={formData.role}
              onChange={handleChange}
              label="角色"
              sx={{ transition: 'all 0.2s' }}
            >
              <MenuItem value="USER">USER</MenuItem>
              <MenuItem value="ADMIN">ADMIN</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </DialogContent>
      
      <DialogActions sx={{ p: 2, justifyContent: 'flex-end', gap: 1 }}>
        <Button
          onClick={onClose}
          sx={{ 
            minWidth: 80,
            transition: 'all 0.2s',
            '&:hover': {
              transform: 'translateY(-2px)'
            }
          }}
        >
          取消
        </Button>
        <Button
          onClick={handleSubmit}
          color="primary"
          sx={{ 
            minWidth: 80,
            transition: 'all 0.2s',
            '&:hover': {
              transform: 'translateY(-2px)'
            }
          }}
        >
          {initialData ? '更新' : '创建'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UserForm;
