import React, { useState, useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Button, MenuItem, Box, FormHelperText
} from '@mui/material';
import { useUserContext } from '../../context/UserContext';

const UserForm = ({ open, onClose, onSubmit, initialData }) => {
  const { addUser, updateUser } = useUserContext();
  const [formData, setFormData] = useState({
    userName: '',
    email: '',
    role: '',
    userId: ''
  });
  const [errors, setErrors] = useState({});
  const [isNewUser, setIsNewUser] = useState(true);

  // 初始化表单数据
  useEffect(() => {
    if (initialData) {
      setFormData({
        userId: initialData.userId.toString(),
        userName: initialData.userName || '',
        email: initialData.email || '',
        role: initialData.role || ''
      });
      setIsNewUser(false);
    } else {
      setFormData({
        userId: '',
        userName: '',
        email: '',
        role: ''
      });
      setIsNewUser(true);
    }
    setErrors({});
  }, [initialData, open]);

  // 表单验证
  const validateForm = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!formData.userName.trim()) {
      newErrors.userName = '用户名不能为空';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = '邮箱不能为空';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = '请输入有效的邮箱地址';
    }
    
    if (!formData.role) {
      newErrors.role = '请选择角色';
    }
    
    if (isNewUser && !formData.userId.trim()) {
      newErrors.userId = '用户ID不能为空';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

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
  };

  // 处理提交
  const handleFormSubmit = () => {
    if (validateForm()) {
      const userData = {
        ...formData,
        userId: Number(formData.userId)
      };
      
      if (initialData) {
        // 编辑模式
        updateUser(userData);
        onSubmit(userData);
      } else {
        // 新增模式
        const newUser = addUser(userData);
        onSubmit(newUser);
      }
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="xs"
      sx={{
        '& .MuiDialogContent-root': { padding: 2 },
        '& .MuiDialogActions-root': { padding: 1.5 }
      }}
    >
      <DialogTitle sx={{ padding: 2, fontSize: 13, fontWeight: 600 }}>
        {initialData ? '编辑用户' : '新增用户'}
      </DialogTitle>
      
      <DialogContent>
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
          />
          
          <TextField
            label="邮箱"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            fullWidth
            size="small"
            error={!!errors.email}
            helperText={errors.email}
          />
          
          <TextField
            select
            label="角色"
            name="role"
            value={formData.role}
            onChange={handleChange}
            fullWidth
            size="small"
            error={!!errors.role}
            helperText={errors.role}
          >
            <MenuItem value="">请选择角色</MenuItem>
            <MenuItem value="管理员">管理员</MenuItem>
            <MenuItem value="开发者">开发者</MenuItem>
            <MenuItem value="测试员">测试员</MenuItem>
            <MenuItem value="项目经理">项目经理</MenuItem>
            <MenuItem value="其他">其他</MenuItem>
          </TextField>
        </Box>
      </DialogContent>
      
      <DialogActions>
        <Button size="small" onClick={onClose}>取消</Button>
        <Button size="small" color="primary" onClick={handleFormSubmit}>
          {initialData ? '更新' : '创建'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UserForm;
    