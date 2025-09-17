import React, { useState, useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Button, MenuItem, Box
} from '@mui/material';
import { useRecordContext } from '../../context/RecordContext';
import { useCaseContext } from '../../context/CaseContext';

const RecordForm = ({ open, onClose, onSubmit, initialData }) => {
  const { addRecord, updateRecord } = useRecordContext();
  const { cases } = useCaseContext();
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    caseId: ''
  });
  const [errors, setErrors] = useState({});

  // 初始化表单数据（编辑模式）
  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || '',
        content: initialData.content || '',
        caseId: initialData.caseId.toString() || ''
      });
    } else {
      // 默认选中第一个案例
      setFormData({
        title: '',
        content: '',
        caseId: cases.length > 0 ? cases[0].caseId.toString() : ''
      });
    }
    setErrors({});
  }, [initialData, open, cases]);

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
    if (!formData.title.trim()) {
      newErrors.title = '记录标题不能为空';
    }
    if (!formData.caseId) {
      newErrors.caseId = '请选择关联案例';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 处理提交
  const handleFormSubmit = () => {
    if (validateForm()) {
      const recordData = {
        ...formData,
        caseId: Number(formData.caseId)
      };
      
      if (initialData) {
        // 编辑模式
        const updatedData = { ...recordData, recordId: initialData.recordId };
        updateRecord(updatedData);
        onSubmit(updatedData);
      } else {
        // 新增模式
        const newRecord = addRecord(recordData);
        onSubmit(newRecord);
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
        {initialData ? '编辑记录' : '新增记录'}
      </DialogTitle>
      
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            label="记录标题"
            name="title"
            value={formData.title}
            onChange={handleChange}
            fullWidth
            size="small"
            error={!!errors.title}
            helperText={errors.title}
          />
          
          <TextField
            select
            label="关联案例"
            name="caseId"
            value={formData.caseId}
            onChange={handleChange}
            fullWidth
            size="small"
            error={!!errors.caseId}
            helperText={errors.caseId}
          >
            {cases.map(caseItem => (
              <MenuItem key={caseItem.caseId} value={caseItem.caseId.toString()}>
                {caseItem.caseName}
              </MenuItem>
            ))}
          </TextField>
          
          <TextField
            label="记录内容"
            name="content"
            value={formData.content}
            onChange={handleChange}
            fullWidth
            multiline
            rows={4}
            size="small"
          />
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

export default RecordForm;
    