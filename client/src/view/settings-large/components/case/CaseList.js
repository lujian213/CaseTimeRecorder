import React, { useState } from 'react';
import {
    Box, Typography, Paper, Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow, IconButton,
    TextField, Button, Chip, CircularProgress, Fab,
    InputAdornment
} from '@mui/material';
import {
    Add as AddIcon, Edit as EditIcon,
    Delete as DeleteIcon, Search as SearchIcon
} from '@mui/icons-material';
import CaseForm from './CaseForm';
import { useCaseContext } from '../../context/CaseContext';

const CaseList = ({ showNotification }) => {
    const { cases, loading, deleteCase } = useCaseContext();
    const [searchTerm, setSearchTerm] = useState('');
    const [formOpen, setFormOpen] = useState(false);
    const [currentCase, setCurrentCase] = useState(null);

    // 过滤案例
    const filteredCases = cases.filter(caseItem =>
        caseItem.caseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        caseItem.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        caseItem.status.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // 打开新增表单
    const handleAdd = () => {
        setCurrentCase(null);
        setFormOpen(true);
    };

    // 打开编辑表单
    const handleEdit = (caseItem) => {
        setCurrentCase(caseItem);
        setFormOpen(true);
    };

    // 处理删除
    const handleDelete = (caseId) => {
        deleteCase(caseId);
        showNotification('案例已删除', 'info');
    };

    // 处理表单提交
    const handleFormSubmit = (data, isNew) => {
        setFormOpen(false);
        showNotification(isNew ? '案例创建成功' : '案例更新成功');
    };

    // 获取状态标签
    const getStatusChip = (status) => {
        const statusConfig = {
            ACTIVE: { color: 'success', label: '激活' },
            CLOSED: { color: 'default', label: '已结案' },
            DELETED: { color: 'error', label: '已删除' },
        };

        const config = statusConfig[status] || { color: 'default', label: status };
        return (
            <Chip
                label={config.label}
                color={config.color}
                size="small"
            />
        );
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
                    案例管理
                </Typography>

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

            {/* 搜索框 */}
            <TextField
                fullWidth
                variant="outlined"
                size="small"
                placeholder="搜索案例..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <SearchIcon fontSize="small" />
                        </InputAdornment>
                    ),
                }}
                sx={{ mb: 3 }}
            />

            {/* 案例表格 */}
            <TableContainer component={Paper} sx={{
                boxShadow: 1,
                transition: 'all 0.3s'
            }}>
                <Table size="small">
                    <TableHead>
                        <TableRow sx={{ backgroundColor: 'action.hover' }}>
                            <TableCell>ID</TableCell>
                            <TableCell>案例名称</TableCell>
                            <TableCell>描述</TableCell>
                            <TableCell>状态</TableCell>
                            <TableCell align="right">操作</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredCases.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                                    没有找到案例
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredCases.map((caseItem) => (
                                <TableRow
                                    key={caseItem.caseId}
                                    hover
                                    sx={{
                                        transition: 'background-color 0.2s',
                                        '&:hover': {
                                            backgroundColor: 'action.hover'
                                        }
                                    }}
                                >
                                    <TableCell>{caseItem.caseId}</TableCell>
                                    <TableCell>{caseItem.caseName}</TableCell>
                                    <TableCell>
                                        <Typography noWrap sx={{
                                            maxWidth: 200,
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            whiteSpace: 'nowrap'
                                        }}>
                                            {caseItem.description}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>{getStatusChip(caseItem.status)}</TableCell>
                                    <TableCell align="right">
                                        <IconButton
                                            size="small"
                                            onClick={() => handleEdit(caseItem)}
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
                                            onClick={() => handleDelete(caseItem.caseId)}
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

            {/* 案例表单对话框 */}
            <CaseForm
                open={formOpen}
                onClose={() => setFormOpen(false)}
                onSubmit={handleFormSubmit}
                initialData={currentCase}
            />
        </Box>
    );
};

export default CaseList;
