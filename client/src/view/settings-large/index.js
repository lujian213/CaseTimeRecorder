import React, { useState } from 'react';
import { Box, Container, Snackbar, Alert } from '@mui/material';
import Navbar from './components/layout/Navbar';
import CaseList from './components/case/CaseList';
import RecordList from './components/record/RecordList';
import UserList from './components/user/UserList';
import { CaseProvider } from './context/CaseContext';
import { RecordProvider } from './context/RecordContext';
import { UserProvider } from './context/UserContext';

const App = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  // 显示通知
  const showNotification = (message, severity = 'success') => {
    setNotification({
      open: true,
      message,
      severity
    });
  };

  // 关闭通知
  const handleCloseNotification = () => {
    setNotification(prev => ({ ...prev, open: false }));
  };

  // 渲染当前激活的标签内容
  const renderTabContent = () => {
    switch (activeTab) {
      case 0:
        return <CaseList showNotification={showNotification} />;
      case 1:
        return <RecordList showNotification={showNotification} />;
      case 2:
        return <UserList showNotification={showNotification} />;
      default:
        return null;
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 3, height: '100vh', overflow: 'auto' }}>
      <CaseProvider>
        <RecordProvider>
          <UserProvider>
            <Box sx={{ 
              display: 'flex', 
              flexDirection: 'column', 
              minHeight: 'calc(100vh - 48px)',
              borderRadius: 2,
              boxShadow: 3,
              overflow: 'hidden',
              backgroundColor: 'background.paper'
            }}>
              {/* 导航栏 */}
              <Navbar 
                activeTab={activeTab} 
                onTabChange={setActiveTab} 
              />
              
              {/* 主要内容区域 */}
              <Box sx={{ 
                flexGrow: 1, 
                p: 3,
                overflow: 'auto'
              }}>
                {renderTabContent()}
              </Box>
              
              {/* 通知提示 */}
              <Snackbar
                open={notification.open}
                autoHideDuration={3000}
                onClose={handleCloseNotification}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              >
                <Alert 
                  onClose={handleCloseNotification}
                  severity={notification.severity}
                  sx={{ width: '100%' }}
                >
                  {notification.message}
                </Alert>
              </Snackbar>
            </Box>
          </UserProvider>
        </RecordProvider>
      </CaseProvider>
    </Container>
  );
};

export default App;
