import React, { useState, useEffect, useCallback, useMemo, memo } from 'react';
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
import { calculateMinutes } from '../../utils/dateUtils';
import { fetchCategories } from '../../../../api/categories';

const RecordForm = ({ open, onClose, onSubmit, initialData }) => {
  const { createRecord, updateRecord } = useRecordContext();
  const { cases } = useCaseContext();
  const { users } = useUserContext();
  
  const [formData, setFormData] = useState({
    recordId: null,
    caseId: 0,
    userId: '',
    startTime: new Date(),
    endTime: new Date(Date.now() + 3600000), // 默认1小时后
    category: '',
    comments: ''
  });
  const [errors, setErrors] = useState({});
  const [duration, setDuration] = useState('0');
  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);

  // 使用 useMemo 优化计算
  const memoizedDuration = useMemo(() => {
    if (formData.startTime && formData.endTime) {
      return calculateMinutes(formData.startTime.getTime(), formData.endTime.getTime());
    }
    return '0';
  }, [formData.startTime, formData.endTime]);

  // 使用 useMemo 优化案例和用户选项
  const caseOptions = useMemo(() => 
    cases.map(caseItem => (
      <MenuItem key={caseItem.caseId} value={caseItem.caseId}>
        {caseItem.caseName}
      </MenuItem>
    )), [cases]
  );

  const userOptions = useMemo(() => 
    users.map(user => (
      <MenuItem key={user.userId} value={user.userId}>
        {user.userName} ({user.userId})
      </MenuItem>
    )), [users]
  );

  const categoryOptions = useMemo(() => 
    categories.map(category => (
      <MenuItem key={category.name || category} value={category.name || category}>
        {category.name || category}
      </MenuItem>
    )), [categories]
  );

  // 初始化表单数据
  useEffect(() => {
    if (initialData) {
      setFormData({
        recordId: initialData.recordId,
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
        recordId: null,
        caseId: defaultCaseId,
        userId: defaultUserId,
        startTime: new Date(),
        endTime: new Date(Date.now() + 3600000),
        category: categories.length > 0 ? (categories[0].name || categories[0]) : '',
        comments: ''
      });
    }
    setErrors({});
  }, [initialData, open, cases, users, categories]);

  // 更新 duration 状态
  useEffect(() => {
    setDuration(memoizedDuration);
  }, [memoizedDuration]);

  // 获取分类数据
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const data = await fetchCategories();
        if (mounted) {
          setCategories(Array.isArray(data) ? data : []);
          setCategoriesLoading(false);
        }
      } catch (e) {
        console.error('Failed to load categories:', e);
        if (mounted) setCategoriesLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  // 处理输入变化 - 使用 useCallback 优化
  const handleChange = useCallback((e) => {
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
  }, [errors]);

  // 处理日期时间变化 - 使用 useCallback 优化
  const handleDateTimeChange = useCallback((name, date) => {
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
  }, [errors]);

  // 表单验证 - 使用 useCallback 优化
  const validateForm = useCallback(() => {
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
  }, [formData]);

  // 处理提交 - 使用 useCallback 优化
  const handleSubmit = useCallback(() => {
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
  }, [validateForm, formData, initialData, updateRecord, createRecord, onSubmit]);

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
            时长: {duration} 分钟
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
              {caseOptions}
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
              {userOptions}
            </Select>
          </FormControl>
          
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DateTimePicker
              label="开始时间"
              value={formData.startTime}
              onChange={(date) => handleDateTimeChange('startTime', date)}
              slotProps={{
                textField: {
                  fullWidth: true,
                  error: !!errors.startTime,
                  helperText: errors.startTime
                }
              }}
            />
          </LocalizationProvider>
          
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DateTimePicker
              label="结束时间"
              value={formData.endTime}
              onChange={(date) => handleDateTimeChange('endTime', date)}
              slotProps={{
                textField: {
                  fullWidth: true,
                  error: !!errors.endTime,
                  helperText: errors.endTime
                }
              }}
            />
          </LocalizationProvider>
          
          <FormControl fullWidth error={!!errors.category}>
            <InputLabel>类别</InputLabel>
            <Select
              name="category"
              value={formData.category}
              onChange={handleChange}
              label="类别"
              disabled={categoriesLoading}
            >
              {categoryOptions}
            </Select>
            {errors.category && (
              <Box sx={{ color: 'error.main', fontSize: '0.75rem', mt: 0.5, ml: 1.75 }}>
                {errors.category}
              </Box>
            )}
          </FormControl>
          
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

// 使用 memo 优化组件重渲染
export default memo(RecordForm);
