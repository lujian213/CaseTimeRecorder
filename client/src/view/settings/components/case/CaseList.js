import React, { useState } from 'react';
import { 
  Box, Typography, List, CircularProgress, Button, 
  Fab 
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { useCaseContext } from '../../context/CaseContext';
import CaseItem from './CaseItem';
import CaseForm from './CaseForm';
import SearchBar from '../ui/SearchBar';

const CaseList = ({ showNotification }) => {
  const { cases, loading, deleteCase } = useCaseContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentCase, setCurrentCase] = useState(null);

  // 过滤案例
  const filteredCases = cases.filter(caseItem => 
    caseItem.caseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    caseItem.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 打开表单对话框
  const handleOpenForm = (caseItem = null) => {
    setCurrentCase(caseItem);
    setDialogOpen(true);
  };

  // 处理表单提交
  const handleFormSubmit = (caseData) => {
    setDialogOpen(false);
    showNotification(currentCase ? '案例已更新' : '案例已创建');
  };

  // 处理删除
  const handleDelete = (caseId) => {
    deleteCase(caseId);
    showNotification('案例已删除', 'info');
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
        案例管理
      </Typography>
      
      <SearchBar 
        value={searchTerm}
        onChange={setSearchTerm}
        placeholder="搜索案例..."
        sx={{ mb: 2 }}
      />
      
      {filteredCases.length === 0 ? (
        <Box sx={{ 
          textAlign: 'center', 
          py: 8, 
          color: '#666',
          backgroundColor: 'white',
          borderRadius: 2,
          mb: 2
        }}>
          <Typography>没有找到案例</Typography>
          <Button 
            variant="text" 
            color="primary" 
            size="small"
            onClick={() => handleOpenForm()}
            sx={{ mt: 1 }}
          >
            + 创建第一个案例
          </Button>
        </Box>
      ) : (
        <List sx={{ padding: 0, mb: 8 }}>
          {filteredCases.map(caseItem => (
            <CaseItem 
              key={caseItem.caseId}
              caseItem={caseItem}
              onEdit={() => handleOpenForm(caseItem)}
              onDelete={() => handleDelete(caseItem.caseId)}
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
      
      {/* 案例表单对话框 */}
      <CaseForm
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onSubmit={handleFormSubmit}
        initialData={currentCase}
      />
    </Box>
  );
};

export default CaseList;
    