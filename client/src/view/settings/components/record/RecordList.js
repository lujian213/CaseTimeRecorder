import React, { useState } from 'react';
import { 
  Box, Typography, List, CircularProgress, Button, 
  Fab, TextField, MenuItem 
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { useRecordContext } from '../../context/RecordContext';
import { useCaseContext } from '../../context/CaseContext';
import RecordItem from './RecordItem';
import RecordForm from './RecordForm';
import SearchBar from '../ui/SearchBar';

const RecordList = ({ showNotification }) => {
  const { records, loading, deleteRecord } = useRecordContext();
  const { cases, getCaseById } = useCaseContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCaseId, setSelectedCaseId] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentRecord, setCurrentRecord] = useState(null);

  // 过滤记录
  const filteredRecords = records.filter(record => {
    const matchesSearch = 
      record.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.content.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesCase = selectedCaseId 
      ? record.caseId === Number(selectedCaseId) 
      : true;
      
    return matchesSearch && matchesCase;
  });

  // 格式化日期
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('zh-CN', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // 打开表单对话框
  const handleOpenForm = (record = null) => {
    setCurrentRecord(record);
    setDialogOpen(true);
  };

  // 处理表单提交
  const handleFormSubmit = (recordData) => {
    setDialogOpen(false);
    showNotification(currentRecord ? '记录已更新' : '记录已创建');
  };

  // 处理删除
  const handleDelete = (recordId) => {
    deleteRecord(recordId);
    showNotification('记录已删除', 'info');
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
        记录管理
      </Typography>
      
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 2 }}>
        <SearchBar 
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="搜索记录..."
        />
        
        <TextField
          select
          label="关联案例"
          value={selectedCaseId}
          onChange={(e) => setSelectedCaseId(e.target.value)}
          fullWidth
          size="small"
        >
          <MenuItem value="">所有案例</MenuItem>
          {cases.map(caseItem => (
            <MenuItem key={caseItem.caseId} value={caseItem.caseId}>
              {caseItem.caseName}
            </MenuItem>
          ))}
        </TextField>
      </Box>
      
      {filteredRecords.length === 0 ? (
        <Box sx={{ 
          textAlign: 'center', 
          py: 8, 
          color: '#666',
          backgroundColor: 'white',
          borderRadius: 2,
          mb: 2
        }}>
          <Typography>没有找到记录</Typography>
          <Button 
            variant="text" 
            color="primary" 
            size="small"
            onClick={() => handleOpenForm()}
            sx={{ mt: 1 }}
            disabled={cases.length === 0}
          >
            + 创建第一个记录
          </Button>
          {cases.length === 0 && (
            <Typography variant="body2" sx={{ mt: 1, color: '#999' }}>
              请先创建案例
            </Typography>
          )}
        </Box>
      ) : (
        <List sx={{ padding: 0, mb: 8 }}>
          {filteredRecords.map(record => {
            const relatedCase = getCaseById(record.caseId);
            return (
              <RecordItem 
                key={record.recordId}
                record={record}
                caseName={relatedCase ? relatedCase.caseName : '未知案例'}
                formattedDate={formatDate(record.createdAt)}
                onEdit={() => handleOpenForm(record)}
                onDelete={() => handleDelete(record.recordId)}
              />
            );
          })}
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
        disabled={cases.length === 0}
      >
        <AddIcon />
      </Fab>
      
      {/* 记录表单对话框 */}
      <RecordForm
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onSubmit={handleFormSubmit}
        initialData={currentRecord}
      />
    </Box>
  );
};

export default RecordList;
    