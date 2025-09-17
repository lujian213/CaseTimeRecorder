import React, { useState, useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Button, MenuItem, Box
} from '@mui/material';
import { useCaseContext } from '../../context/CaseContext';

const CaseForm = ({ open, onClose, onSubmit, initialData }) => {
  const { addCase, updateCase } = useCaseContext();
  const [formData, setFormData] = useState({
    caseName: '',
    description: '',
    status: 'ACTIVE',
    priority: 'MEDIUM'
  });
  const [errors, setErrors] = useState({});

  // 初始化表单数据（编辑模式）
  useEffect(() => {
    if (initialData) {
      setFormData({
        caseName: initialData.caseName || '',
        description: initialData.description || '',
        status: initialData.status || 'ACTIVE',
        priority: initialData.priority || 'MEDIUM'
      });
    } else {
      setFormData({
        caseName: '',
        description: '',
        status: 'ACTIVE',
        priority: 'MEDIUM'
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
  const handleFormSubmit = () => {
    if (validateForm()) {
      if (initialData) {
        // 编辑模式
        const updatedData = { ...formData, caseId: initialData.caseId };
        updateCase(updatedData);
        onSubmit(updatedData);
      } else {
        // 新增模式
        const newCase = addCase(formData);
        onSubmit(newCase);
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
        {initialData ? '编辑案例' : '新增案例'}
      </DialogTitle>
      
      <DialogContent>
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
          />
          
          <TextField
            select
            label="状态"
            name="status"
            value={formData.status}
            onChange={handleChange}
            fullWidth
            size="small"
          >
            <MenuItem value="ACTIVE">激活</MenuItem>
            <MenuItem value="INACTIVE">未激活</MenuItem>
          </TextField>
          
          <TextField
            select
            label="优先级"
            name="priority"
            value={formData.priority}
            onChange={handleChange}
            fullWidth
            size="small"
          >
            <MenuItem value="HIGH">高</MenuItem>
            <MenuItem value="MEDIUM">中</MenuItem>
            <MenuItem value="LOW">低</MenuItem>
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

export default CaseForm;
    