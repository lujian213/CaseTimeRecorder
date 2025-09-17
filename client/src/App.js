import React, { Suspense } from 'react';
import {
  Box, Typography, ThemeProvider, createTheme,
  CssBaseline, Paper,
  IconButton,
  Tooltip,
} from '@mui/material';
import { Timer } from '@mui/icons-material';
import HomeIcon from '@mui/icons-material/Home';
import SettingsIcon from '@mui/icons-material/Settings';
import { Outlet, useNavigate } from 'react-router-dom';

// 自定义主题
const theme = createTheme({
  palette: {
    primary: { main: '#6366F1' },
    secondary: { main: '#10B981' },
    error: { main: '#EF4444' },
  },
  typography: {
    fontFamily: '"Segoe UI", Roboto, sans-serif',
  },
});

const App = () => {
  const navigate = useNavigate();

  const handleSettings = () => {
    window.electronIPC.openNewWindow('settings');
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{
        width: '100%',
        height: '100%',
        overflow: 'hidden'
      }}>
        <Paper elevation={8} sx={{
          borderRadius: 0,
          height: '100vh',
          backgroundColor: 'rgba(255, 255, 255, 0.98)',
          overflow: 'hidden',
          fontSize: 12,
        }}>
          {/* 自定义标题栏（使用Electron原生拖动） */}
          <Box
            sx={{
              bgcolor: 'primary.main',
              color: 'white',
              p: 2,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              height: '24px',
              boxSizing: 'border-box',
              WebkitAppRegion: 'drag',  // 启用原生拖动
              userSelect: 'none'
            }}
          >
            <Box display="flex" alignItems="center" gap={1.5}>
              <Timer sx={{ height: 16, width: 16 }} />
              <Typography variant="div" fontWeight="medium">任务计时器</Typography>
            </Box>

            <Box sx={{
              display: 'flex',
              gap: 1,
              WebkitAppRegion: 'no-drag'  // 禁用拖动
            }}>
              {/* <Tooltip title="Home">
                <IconButton
                  size="small"
                  sx={{ color: 'white', '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' } }}
                  onClick={() => navigate('/')}
                >
                  <HomeIcon fontSize="small" sx={{ height: 16, width: 16 }} />
                </IconButton>
              </Tooltip> */}
              <Tooltip title="Settings">
                <IconButton
                  size="small"
                  sx={{ color: 'white', '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' } }}
                  onClick={handleSettings}
                >
                  <SettingsIcon fontSize="small" sx={{ height: 16, width: 16 }} />
                </IconButton>
              </Tooltip>
            </Box>

            {/* 按钮区域禁用拖动 */}
            {/* <Box sx={{
              display: 'flex',
              gap: 1,
              WebkitAppRegion: 'no-drag'  // 禁用拖动
            }}>
              <Tooltip title="最小化">
                <IconButton
                  size="small"
                  sx={{ color: 'white', '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' } }}
                  onClick={() => window.electronIPC.windowControl('minimize')}
                >
                  <Minimize fontSize="small" sx={{height: 16, width: 16}}/>
                </IconButton>
              </Tooltip>
              <Tooltip title="关闭">
                <IconButton
                  size="small"
                  sx={{ color: 'white', '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' } }}
                  onClick={() => window.electronIPC.windowControl('close')}
                >
                  <Close fontSize="small" sx={{height: 16, width: 16}}/>
                </IconButton>
              </Tooltip>
            </Box> */}
          </Box>
          <Suspense fallback={<div>loading...</div>}>
            <Outlet />
          </Suspense>
        </Paper>
      </Box >
    </ThemeProvider >
  );
};

export default App;