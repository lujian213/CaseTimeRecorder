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
import UserForm from './UserForm';
import { useUserContext } from '../../context/UserContext';

const UserList = ({ showNotification }) => {
    const { users, loading, deleteUser } = useUserContext();
    const [searchTerm, setSearchTerm] = useState('');
    const [formOpen, setFormOpen] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);

    // 过滤用户
    const filteredUsers = users.filter(user =>
        user.userId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.role.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // 打开新增表单
    const handleAdd = () => {
        setCurrentUser(null);
        setFormOpen(true);
    };

    // 打开编辑表单
    const handleEdit = (user) => {
        setCurrentUser(user);
        setFormOpen(true);
    };

    // 处理删除
    const handleDelete = (userId) => {
        deleteUser(userId);
        showNotification('用户已删除', 'info');
    };

    // 处理表单提交
    const handleFormSubmit = (data, isNew) => {
        setFormOpen(false);
        showNotification(isNew ? '用户创建成功' : '用户更新成功');
    };

    // 获取角色标签
    const getRoleChip = (role) => {
        const roleColors = {
            '管理员': 'primary',
            '开发者': 'secondary',
            '测试员': 'success',
            '项目经理': 'info'
        };

        const color = roleColors[role] || 'default';
        return (
            <Chip
                label={role}
                color={color}
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
                    用户管理
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
                placeholder="搜索用户..."
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

            {/* 用户表格 */}
            <TableContainer component={Paper} sx={{
                boxShadow: 1,
                transition: 'all 0.3s'
            }}>
                <Table size="small">
                    <TableHead>
                        <TableRow sx={{ backgroundColor: 'action.hover' }}>
                            <TableCell>用户ID</TableCell>
                            <TableCell>用户名</TableCell>
                            <TableCell>密码</TableCell>
                            <TableCell>角色</TableCell>
                            <TableCell align="right">操作</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredUsers.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                                    没有找到用户
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredUsers.map((user) => (
                                <TableRow
                                    key={user.userId}
                                    hover
                                    sx={{
                                        transition: 'background-color 0.2s',
                                        '&:hover': {
                                            backgroundColor: 'action.hover'
                                        }
                                    }}
                                >
                                    <TableCell>{user.userId}</TableCell>
                                    <TableCell>{user.userName}</TableCell>
                                    <TableCell>
                                        {user.password ? '••••••••' : '未设置'}
                                    </TableCell>
                                    <TableCell>{getRoleChip(user.role)}</TableCell>
                                    <TableCell align="right">
                                        <IconButton
                                            size="small"
                                            onClick={() => handleEdit(user)}
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
                                            onClick={() => handleDelete(user.userId)}
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

            {/* 用户表单对话框 */}
            <UserForm
                open={formOpen}
                onClose={() => setFormOpen(false)}
                onSubmit={handleFormSubmit}
                initialData={currentUser}
            />
        </Box>
    );
};

export default UserList;
