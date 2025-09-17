import React, { useState, useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogContentText,
  DialogActions, Button, TextField, MenuItem, Box,
  FormControl, InputLabel, Select, Alert
} from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { useRecordContext } from '../../context/RecordContext';
import { useCaseContext } from '../../context/CaseContext';
import { useUserContext } from '../../context/UserContext';
import { calculateHours } from '../../utils/dateUtils';

const RecordForm = ({ open, onClose, onSubmit, initialData }) => {
  const { createRecord, updateRecord } = useRecordContext();
  const { cases } = useCaseContext();
  const { users } = useUserContext();
  
  const [formData, setFormData] = useState({
    caseId: 0,
    userId: '',
    startTime: new Date(),
    endTime: new Date(Date.now() + 3600000), // 默认1小时后
    category: '',
    comments: ''
  });
  const [errors, setErrors] = useState({});
  const [duration, setDuration] = useState('0');

  // 初始化表单数据
  useEffect(() => {
    if (initialData) {
      setFormData({
        caseId: initialData.caseId,
        userId: initialData.userId,
        startTime: new Date(initialData.startTime),
        endTime: new Date(initialData.endTime),
        category: initialData.category,
        comments: initialData.comments
      });
    } else {
      // 默认选择第一个案例和用户
      const defaultCaseId = cases.length > 0 ? cases[0].caseId : 0;
      const defaultUserId = users.length > 0 ? users[0].userId : '';
      
      setFormData({
        caseId: defaultCaseId,
        userId: defaultUserId,
        startTime: new Date(),
        endTime: new Date(Date.now() + 3600000),
        category: '',
        comments: ''
      });
    }
    setErrors({});
  }, [initialData, open, cases, users]);

  // 计算时长
  useEffect(() => {
    if (formData.startTime && formData.endTime) {
      setDuration(
        calculateHours(formData.startTime.getTime(), formData.endTime.getTime())
      );
    }
  }, [formData.startTime, formData.endTime]);

  // 处理输入变化
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // 清除验证错误
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  // 处理日期时间变化
  const handleDateTimeChange = (name, date) => {
    if (date) {
      setFormData(prev => ({ ...prev, [name]: date }));
      
      // 清除验证错误
      if (errors[name]) {
        setErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors[name];
          return newErrors;
        });
      }
    }
  };

  // 表单验证
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.caseId || formData.caseId === 0) {
      newErrors.caseId = '请选择案例';
    }
    
    if (!formData.userId) {
      newErrors.userId = '请选择用户';
    }
    
    if (!formData.startTime) {
      newErrors.startTime = '请选择开始时间';
    }
    
    if (!formData.endTime) {
      newErrors.endTime = '请选择结束时间';
    } else if (formData.endTime <= formData.startTime) {
      newErrors.endTime = '结束时间必须晚于开始时间';
    }
    
    if (!formData.category.trim()) {
      newErrors.category = '请输入类别';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 处理提交
  const handleSubmit = () => {
    if (validateForm()) {
      const recordData = {
        ...formData,
        startTime: formData.startTime.getTime(),
        endTime: formData.endTime.getTime()
      };
      
      if (initialData) {
        // 编辑模式
        const updatedRecord = { ...initialData, ...recordData };
        updateRecord(updatedRecord);
        onSubmit(updatedRecord, false);
      } else {
        // 新增模式
        const newRecord = createRecord(recordData);
        onSubmit(newRecord, true);
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
          transition: 'all 0.3s ease',
          maxHeight: '90vh',
          overflow: 'auto'
        }
      }}
    >
      <DialogTitle sx={{ fontSize: '1.5rem', pb: 1 }}>
        {initialData ? '编辑记录' : '新增记录'}
      </DialogTitle>
      
      <DialogContent dividers>
        <DialogContentText sx={{ mb: 2 }}>
          {initialData ? '请修改记录信息' : '请输入新记录的信息'}
        </DialogContentText>
        
        {duration > 0 && (
          <Alert severity="info" sx={{ mb: 2, fontSize: '0.875rem', padding: '8px 16px' }}>
            时长: {duration} 小时
          </Alert>
        )}
        
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <FormControl fullWidth error={!!errors.caseId}>
            <InputLabel>案例</InputLabel>
            <Select
              name="caseId"
              value={formData.caseId}
              onChange={handleChange}
              label="案例"
            >
              {cases.map(caseItem => (
                <MenuItem key={caseItem.caseId} value={caseItem.caseId}>
                  {caseItem.caseName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          
          <FormControl fullWidth error={!!errors.userId}>
            <InputLabel>用户</InputLabel>
            <Select
              name="userId"
              value={formData.userId}
              onChange={handleChange}
              label="用户"
            >
              {users.map(user => (
                <MenuItem key={user.userId} value={user.userId}>
                  {user.userName} ({user.userId})
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DateTimePicker
              label="开始时间"
              value={formData.startTime}
              onChange={(date) => handleDateTimeChange('startTime', date)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  fullWidth
                  error={!!errors.startTime}
                  helperText={errors.startTime}
                />
              )}
            />
          </LocalizationProvider>
          
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DateTimePicker
              label="结束时间"
              value={formData.endTime}
              onChange={(date) => handleDateTimeChange('endTime', date)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  fullWidth
                  error={!!errors.endTime}
                  helperText={errors.endTime}
                />
              )}
            />
          </LocalizationProvider>
          
          <TextField
            label="类别"
            name="category"
            value={formData.category}
            onChange={handleChange}
            fullWidth
            error={!!errors.category}
            helperText={errors.category}
          />
          
          <TextField
            label="备注"
            name="comments"
            value={formData.comments}
            onChange={handleChange}
            fullWidth
            multiline
            rows={3}
          />
        </Box>
      </DialogContent>
      
      <DialogActions sx={{ p: 2, justifyContent: 'flex-end', gap: 1 }}>
        <Button
          onClick={onClose}
          sx={{ minWidth: 80 }}
        >
          取消
        </Button>
        <Button
          onClick={handleSubmit}
          color="primary"
          sx={{ minWidth: 80 }}
        >
          {initialData ? '更新' : '创建'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default RecordForm;
