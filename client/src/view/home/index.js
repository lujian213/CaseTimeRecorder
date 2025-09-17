import React, { useState, useEffect } from 'react';
import {
    Box, Button, Card, CardContent, Typography,
    IconButton,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Stack,
    Popover,
    TextField
} from '@mui/material';
import {
    PlayArrow, Stop,
} from '@mui/icons-material';
import axios from 'axios';
import NotesIcon from '@mui/icons-material/Notes';
import { categoriesValue } from './recoil/selector';
import { useRecoilValue } from 'recoil';
//import CheckIcon from '@mui/icons-material/Check';

// 辅助函数：数字补零
const pad = (num) => num.toString().padStart(2, '0');

// 格式化时间
const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    return hours > 0
        ? `${pad(hours)}:${pad(minutes)}:${pad(secs)}`
        : `${pad(minutes)}:${pad(secs)}`;
};


export default function Home() {
    // 任务状态管理
    const [tasks, setTasks] = useState([]);
    const [activeTimer, setActiveTimer] = useState(null);
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [categories, setCategories] = useState([])

    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;

    useEffect(() => {
        const fetchTasks = async () => {
            const response = await axios.get(`http://103.119.16.229:9733/user/${'lujian'}/bindings`);
            const result = response.data;
            const mapped = result.map(item => ({ ...item, isRunning: false, seconds: 0, comments: '' }))
            setTasks(mapped)
            if (window.electronIPC && window.electronIPC.resizeWindow) {
                const length = mapped.length;
                const height = 200 + length * 50
                window.electronIPC.resizeWindow(height);
            }
        }
        fetchTasks()
    }, [])

    useEffect(() => {
        const fetchTasks = async () => {
            const resposne = await axios.get('http://103.119.16.229:9733/categories');
            const result = resposne.data;
            const mapped = result.map(item => item.name)
            setCategories(mapped)
            setTasks(pre => {
                const mappedTask = pre.map(task => {
                    if (!task.type) {
                        task.type = mapped[0]
                    }
                    return task
                })
                return mappedTask
            })
        }
        fetchTasks()
    }, [])

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    // const handleSaveComments = () => {
    //     setAnchorEl(null);
    // }

    // 切换计时器
    const toggleTimer = async (taskId) => {
        // 如果点击的是未运行的任务，则启动它
        const task = tasks.find(t => t.caseId === taskId);
        let currentRecordId = null;
        try {
            const response = await axios.post('http://103.119.16.229:9733/record/start', null, {
                params: {
                    caseId: taskId,
                    userId: 'lujian',
                    category: task.type,
                    comments: task.comments
                }
            })
            const result = response.data;
            currentRecordId = result.recordId;
        } catch (e) {

        }

        // 停止当前运行的计时器
        if (activeTimer) {
            clearInterval(activeTimer);
            setActiveTimer(null);

            // 更新任务状态为停止
            setTasks(prev => prev.map(task =>
                task.isRunning ? { ...task, isRunning: false } : task
            ));
        }

        if (!task.isRunning) {
            const timer = setInterval(() => {
                setTasks(prev => prev.map(t =>
                    t.caseId === taskId ? { ...t, seconds: t.seconds + 1 } : t
                ));
            }, 1000);

            setActiveTimer(timer);

            // 更新任务状态为运行中
            setTasks(prev => prev.map(t =>
                t.caseId === taskId ? { ...t, isRunning: true, recordId: currentRecordId } : t
            ));

        }
    };

    const handleTypeChange = (event, taskId) => {
        const value = event.target.value;
        setTasks(prev => prev.map(task => task.caseId === taskId ? { ...task, type: value } : task));
    }

    const handleCommentsChange = (event, taskId) => {
        const value = event.target.value;
        setTasks(prev => prev.map(task => task.caseId === taskId ? { ...task, comments: value } : task));
    }

    // 停止所有计时器
    const stopAllTimers = async () => {
        const task = tasks.find(task => task.isRunning === true);
        await axios.post('http://103.119.16.229:9733/record/stop', null, {
            params: {
                caseId: task.caseId,
                recordId: task.recordId
            }
        })
        if (activeTimer) {
            clearInterval(activeTimer);
            setActiveTimer(null);
        }

        setTasks(prev => prev.map(task =>
            task.isRunning ? { ...task, isRunning: false } : task
        ));
    };

    // 组件卸载时清理计时器
    useEffect(() => {
        return () => {
            if (activeTimer) {
                clearInterval(activeTimer);
            }
        };
    }, [activeTimer]);
    return (
        <Box sx={{
            height: 'calc(100% - 24px)',
        }}>
            {/* 主内容区 */}
            <Box sx={{
                height: '100%',
                boxSizing: 'border-box',
                display: 'flex',
                flexDirection: 'column'
            }
            }>
                {/* 任务列表 */}
                < Box sx={{
                    flexGrow: 1,
                    maxHeight: 'calc(100% - 120px)',
                    overflowY: 'auto',
                }}>
                    {
                        tasks.map((task) => (
                            <Card
                                key={task.caseId}
                                sx={
                                    (theme) => ({
                                        borderLeft: task.isRunning ? `4px solid ${theme.palette.secondary.main}` : 'none',
                                        bgcolor: task.isRunning ? 'rgba(240, 253, 244, 0.9)' : 'white',
                                        transition: 'all 0.3s ease',
                                        borderRadius: 0,
                                        borderBottom: '1px solid lightgray',
                                        boxShadow: 'none',
                                    })}
                            >
                                <CardContent sx={{ p: 1, paddingBottom: '8px !important' }}>
                                    <Stack direction={'row'} sx={{
                                        alignItems: 'center',
                                        justifyContent: 'space-between'
                                    }}>
                                        <Box display="flex" alignItems="center">
                                            <Typography variant="div" sx={{
                                                mr: 2,
                                                fontSize: 12,
                                                whiteSpace: 'nowrap',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis'
                                            }}>
                                                {task.caseName}
                                            </Typography>
                                            <Box display="flex" alignItems="center" gap={2}>
                                                <FormControl variant="standard" sx={{ marginBottom: '-5px' }} size='small'>
                                                    <InputLabel id="demo-simple-select-standard-label"></InputLabel>
                                                    <Select
                                                        labelId="demo-simple-select-standard-label"
                                                        id="demo-simple-select-standard"
                                                        value={task.type || ""}
                                                        onChange={(event) => handleTypeChange(event, task.caseId)}
                                                        label=""
                                                        sx={{
                                                            height: 16,
                                                            fontSize: 10,
                                                            width: 'fit-content',
                                                            marginTop: '0px !important',
                                                        }}
                                                    >
                                                        <MenuItem value="" dense={true} sx={{
                                                            fontSize: 10
                                                        }}>
                                                            <em>None</em>
                                                        </MenuItem>
                                                        {
                                                            categories.map(item => {
                                                                return <MenuItem dense={true} sx={{
                                                                    fontSize: 10
                                                                }} key={item} value={item}>{item}</MenuItem>
                                                            })
                                                        }
                                                    </Select>
                                                </FormControl>
                                            </Box>
                                            <Box>
                                                <IconButton aria-label="open-comments" size="small" onClick={handleClick}>
                                                    <NotesIcon fontSize="inherit" />
                                                </IconButton>
                                                <Popover
                                                    id={id}
                                                    open={open}
                                                    anchorEl={anchorEl}
                                                    onClose={handleClose}
                                                    sx={{
                                                        '& .MuiPaper-root': {
                                                            padding: '10px',
                                                        }
                                                    }}
                                                    anchorOrigin={{
                                                        vertical: 'bottom',
                                                        horizontal: 'left',
                                                    }}
                                                >
                                                    {/* <IconButton sx={{
                                                        position: 'absolute',
                                                        right: 10,
                                                        top: 5,
                                                        zIndex: 2
                                                    }} aria-label="save-comments" size="small" onClick={handleSaveComments}>
                                                        <CheckIcon fontSize="inherit" />
                                                    </IconButton> */}
                                                    <TextField InputLabelProps={{
                                                        shrink: true,  // 强制标签保持在顶部
                                                        sx: {
                                                            fontSize: '10px',  // 可选：调整标签字体大小
                                                            color: 'text.secondary' // 可选：调整标签颜色
                                                        }
                                                    }}
                                                        id="comments-input"
                                                        label="Comments"
                                                        variant="standard"
                                                        value={task.comments}
                                                        onChange={(event) => handleCommentsChange(event, task.caseId)}
                                                    />
                                                </Popover>
                                            </Box>
                                            <Typography
                                                variant="div"
                                                sx={{ color: 'black', fontSize: 10, marginLeft: '10px' }}
                                                fontWeight="medium"
                                                fontFamily="monospace"
                                            >
                                                {task.comments}
                                            </Typography>
                                        </Box>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <Box>
                                                {/* <Typography
                                                    variant="div"
                                                    sx={{ color: 'black' }}
                                                    fontWeight="medium"
                                                    fontFamily="monospace"
                                                >
                                                    {task.description}
                                                </Typography> */}
                                            </Box>

                                            <Box>
                                                <Typography
                                                    variant="div"
                                                    sx={task.isRunning ? { color: 'green' } : { color: 'black' }}
                                                    fontWeight="medium"
                                                    fontFamily="monospace"
                                                >
                                                    {formatTime(task.seconds)}
                                                </Typography>
                                                <IconButton aria-label="delete" size="small" color="primary" variant="contained" disabled={task.isRunning || !task.type || !task.comments}
                                                    onClick={() => toggleTimer(task.caseId)}>
                                                    <PlayArrow fontSize="small" />
                                                </IconButton>
                                            </Box>
                                        </Box>
                                    </Stack>
                                </CardContent>
                            </Card>
                        ))
                    }
                </Box >

                <Box display="flex" gap={2} sx={{ marginTop: 'auto' }}>
                    {/* 全局停止按钮 */}
                    <Button
                        variant="contained"
                        startIcon={<Stop />}
                        fullWidth
                        size="small"
                        onClick={stopAllTimers}
                        sx={{
                            marginBottom: '10px',
                            bgcolor: '#6b7280',
                            '&:hover': { bgcolor: '#4b5563' }
                        }}
                    >
                        休息
                    </Button>
                </Box>
            </Box >
        </Box>
    )
}