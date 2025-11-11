import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Paper, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, IconButton,
  TextField, Button, CircularProgress, Fab,
  InputAdornment, FormControl, InputLabel, Select, MenuItem
} from '@mui/material';
import {
  Add as AddIcon, Edit as EditIcon,
  Delete as DeleteIcon, Search as SearchIcon,
  Download as DownloadIcon
} from '@mui/icons-material';
import axios from 'axios';
//import RecordForm from './RecordForm';
import { useRecordContext } from '../../context/RecordContext';
import { useCaseContext } from '../../context/CaseContext';
import { useUserContext } from '../../context/UserContext';
import { formatDateTime, calculateHours } from '../../utils/dateUtils';
import RecordForm from './RecordForm';

const RecordList = ({ showNotification }) => {
  const { records, loading, deleteRecord, reloadByCase } = useRecordContext();
  const { cases } = useCaseContext();
  const { users } = useUserContext();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCaseId, setSelectedCaseId] = useState(1);
  const [formOpen, setFormOpen] = useState(false);
  const [currentRecord, setCurrentRecord] = useState(null);
  const [downloading, setDownloading] = useState(false);

  // 过滤记录
  const filteredRecords = records.filter(record => {
    // 案例筛选
    if (selectedCaseId !== 'all' && record.caseId !== Number(selectedCaseId)) {
      return false;
    }

    // 搜索词筛选
    const searchLower = searchTerm.toLowerCase();
    const caseName = cases.find(c => c.caseId === record.caseId)?.caseName || '';
    const userName = users.find(u => u.userId === record.userId)?.userName || '';

    return (
      caseName.toLowerCase().includes(searchLower) ||
      userName.toLowerCase().includes(searchLower) ||
      record.category.toLowerCase().includes(searchLower) ||
      record.comments.toLowerCase().includes(searchLower)
    );
  });

  // 打开新增表单
  const handleAdd = () => {
    setCurrentRecord(null);
    setFormOpen(true);
  };

  // 打开编辑表单
  const handleEdit = (record) => {
    setCurrentRecord(record);
    setFormOpen(true);
  };

  // 处理删除
  const handleDelete = (caseId, recordId) => {
    deleteRecord(caseId, recordId);
    showNotification('记录已删除', 'info');
  };

  // 处理表单提交
  const handleFormSubmit = (data, isNew) => {
    setFormOpen(false);
    showNotification(isNew ? '记录创建成功' : '记录更新成功');
  };

  // 处理下载
  const handleDownload = async () => {
    if (selectedCaseId === 'all') {
      showNotification('请先选择一个具体案例', 'warning');
      return;
    }

    setDownloading(true);
    try {
      const response = await axios.get(`/exportrecords/${selectedCaseId}`, {
        responseType: 'blob',
        headers: {
          'Accept': 'application/octet-stream'
        }
      });

      // 创建下载链接
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;

      // 获取案例名称作为文件名
      const caseName = getCaseName(selectedCaseId);
      // 清理文件名中的特殊字符
      const cleanCaseName = caseName.replace(/[<>:"/\\|?*]/g, '_');

      // 从响应头获取文件类型
      const contentType = response.headers['content-type'] || response.headers['Content-Type'] || '';
      let extension = '.xlsx'; // 默认扩展名

      if (contentType.includes('csv') || contentType.includes('text/csv')) {
        extension = '.csv';
      } else if (contentType.includes('json') || contentType.includes('application/json')) {
        extension = '.json';
      } else if (contentType.includes('pdf') || contentType.includes('application/pdf')) {
        extension = '.pdf';
      } else if (contentType.includes('excel') || contentType.includes('spreadsheet') || contentType.includes('application/vnd.ms-excel')) {
        extension = '.xlsx';
      } else if (contentType.includes('text/plain')) {
        extension = '.txt';
      } else if (contentType.includes('xml') || contentType.includes('application/xml')) {
        extension = '.xml';
      } else if (contentType.includes('zip') || contentType.includes('application/zip')) {
        extension = '.zip';
      } else if (contentType.includes('doc') || contentType.includes('application/msword')) {
        extension = '.doc';
      } else if (contentType.includes('docx') || contentType.includes('application/vnd.openxmlformats-officedocument.wordprocessingml.document')) {
        extension = '.docx';
      } else if (contentType.includes('text/html')) {
        extension = '.html';
      }

      const fileName = `${cleanCaseName}_records_${new Date().toISOString().split('T')[0]}${extension}`;
      link.download = fileName;

      // 触发下载
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      showNotification('记录导出成功', 'success');
    } catch (error) {
      console.error('Download failed:', error);
      showNotification('导出失败，请重试', 'error');
    } finally {
      setDownloading(false);
    }
  };

  // 获取案例名称
  const getCaseName = (caseId) => {
    const caseItem = cases.find(c => c.caseId === caseId);
    return caseItem ? caseItem.caseName : `未知案例(${caseId})`;
  };

  // 获取用户名
  const getUserName = (userId) => {
    const user = users.find(u => u.userId === userId);
    return user ? user.userName : userId;
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', my: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h6" component="h1">
          记录管理
        </Typography>

        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="outlined"
            startIcon={downloading ? <CircularProgress size={16} /> : <DownloadIcon />}
            onClick={handleDownload}
            disabled={downloading || selectedCaseId === 'all'}
            sx={{
              transition: 'all 0.2s',
              '&:hover': {
                transform: 'scale(1.02)'
              }
            }}
          >
            {downloading ? '导出中...' : '导出记录'}
          </Button>

          <Fab
            color="primary"
            size="small"
            onClick={handleAdd}
            sx={{
              transition: 'all 0.2s',
              '&:hover': {
                transform: 'scale(1.05)'
              }
            }}
          >
            <AddIcon />
          </Fab>
        </Box>
      </Box>

      {/* 筛选和搜索 */}
      <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel>案例筛选</InputLabel>
          <Select
            value={selectedCaseId}
            label="案例筛选"
            onChange={(e) => setSelectedCaseId(e.target.value)}
          >
            <MenuItem value="all">所有案例</MenuItem>
            {cases.map(caseItem => (
              <MenuItem key={caseItem.caseId} value={caseItem.caseId}>
                {caseItem.caseName}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          fullWidth
          variant="outlined"
          size="small"
          placeholder="搜索记录..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon fontSize="small" />
              </InputAdornment>
            ),
          }}
          sx={{ flexGrow: 1 }}
        />
      </Box>

      {/* 记录表格 */}
      <TableContainer component={Paper} sx={{
        boxShadow: 1,
        transition: 'all 0.3s'
      }}>
        <Table size="small">
          <TableHead>
            <TableRow sx={{ backgroundColor: 'action.hover' }}>
              <TableCell>ID</TableCell>
              <TableCell>案例</TableCell>
              <TableCell>用户</TableCell>
              <TableCell>开始时间</TableCell>
              <TableCell>结束时间</TableCell>
              <TableCell>时长(小时)</TableCell>
              <TableCell>类别</TableCell>
              <TableCell>备注</TableCell>
              <TableCell align="right">操作</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredRecords.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
                  没有找到记录
                </TableCell>
              </TableRow>
            ) : (
              filteredRecords.map((record) => (
                <TableRow
                  key={record.recordId}
                  hover
                  sx={{
                    transition: 'background-color 0.2s',
                    '&:hover': {
                      backgroundColor: 'action.hover'
                    }
                  }}
                >
                  <TableCell>{record.recordId}</TableCell>
                  <TableCell>{getCaseName(record.caseId)}</TableCell>
                  <TableCell>{getUserName(record.userId)}</TableCell>
                  <TableCell>{formatDateTime(record.startTime)}</TableCell>
                  <TableCell>{formatDateTime(record.endTime)}</TableCell>
                  <TableCell>
                    {Math.max(0, calculateHours(record.startTime, record.endTime))}
                  </TableCell>
                  <TableCell>{record.category}</TableCell>
                  <TableCell>{record.comments}</TableCell>
                  <TableCell align="right">
                    <IconButton
                      size="small"
                      onClick={() => handleEdit(record)}
                      sx={{
                        color: 'primary.main',
                        '&:hover': {
                          backgroundColor: 'primary.light'
                        }
                      }}
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>

                    <IconButton
                      size="small"
                      onClick={() => handleDelete(record.caseId, record.recordId)}
                      sx={{
                        color: 'error.main',
                        '&:hover': {
                          backgroundColor: 'error.light'
                        }
                      }}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* 记录表单对话框 */}
      <RecordForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleFormSubmit}
        initialData={currentRecord}
      />
    </Box>
  );
};

export default RecordList;
