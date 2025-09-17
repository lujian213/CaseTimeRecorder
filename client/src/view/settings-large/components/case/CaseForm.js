import React, { useState, useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogContentText,
  DialogActions, Button, TextField, MenuItem, Box,
  FormControl, InputLabel, Select
} from '@mui/material';
import { useCaseContext } from '../../context/CaseContext';

const CaseForm = ({ open, onClose, onSubmit, initialData }) => {
  const { createCase, updateCase } = useCaseContext();
  const [formData, setFormData] = useState({
    caseName: '',
    description: '',
    status: 'ACTIVE'
  });
  const [errors, setErrors] = useState({});

  // 初始化表单数据（编辑模式）
  useEffect(() => {
    if (initialData) {
      setFormData({
        caseName: initialData.caseName || '',
        description: initialData.description || '',
        status: initialData.status || 'ACTIVE'
      });
    } else {
      setFormData({
        caseName: '',
        description: '',
        status: 'ACTIVE'
      });
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
  };

  // 表单验证
  const validateForm = () => {
    const newErrors = {};
    if (!formData.caseName.trim()) {
      newErrors.caseName = '案例名称不能为空';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 处理提交
  const handleSubmit = () => {
    if (validateForm()) {
      if (initialData) {
        // 编辑模式
        const updatedCase = { ...initialData, ...formData };
        updateCase(updatedCase);
        onSubmit(updatedCase, false);
      } else {
        // 新增模式
        const newCase = createCase(formData);
        onSubmit(newCase, true);
      }
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
        {initialData ? '编辑案例' : '新增案例'}
      </DialogTitle>
      
      <DialogContent dividers>
        <DialogContentText sx={{ mb: 2 }}>
          {initialData ? '请修改案例信息' : '请输入新案例的信息'}
        </DialogContentText>
        
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            label="案例名称"
            name="caseName"
            value={formData.caseName}
            onChange={handleChange}
            fullWidth
            size="small"
            error={!!errors.caseName}
            helperText={errors.caseName}
            sx={{ transition: 'all 0.2s' }}
          />
          
          <TextField
            label="描述"
            name="description"
            value={formData.description}
            onChange={handleChange}
            fullWidth
            multiline
            rows={3}
            size="small"
            sx={{ transition: 'all 0.2s' }}
          />
          
          <FormControl fullWidth size="small">
            <InputLabel>状态</InputLabel>
            <Select
              name="status"
              value={formData.status}
              onChange={handleChange}
              label="状态"
              sx={{ transition: 'all 0.2s' }}
            >
              <MenuItem value="ACTIVE">激活</MenuItem>
              <MenuItem value="INACTIVE">未激活</MenuItem>
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

export default CaseForm;
