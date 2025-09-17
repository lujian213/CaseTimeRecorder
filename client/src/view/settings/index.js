import React, { useState } from 'react';
import { Box, Snackbar, Alert } from '@mui/material';
import { CaseProvider } from './context/CaseContext';
import { RecordProvider } from './context/RecordContext';
import { UserProvider } from './context/UserContext';
import MobileContainer from './components/layout/MobileContainer';
import BottomNav from './components/layout/BottomNav';
import CaseList from './components/case/CaseList';
import RecordList from './components/record/RecordList';
import UserList from './components/user/UserList';

const App = () => {
  const [activeModule, setActiveModule] = useState('case');
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  // 显示通知
  const showNotification = (message, severity = 'success') => {
    setNotification({ open: true, message, severity });
  };

  // 渲染当前模块
  const renderModule = () => {
    switch (activeModule) {
      case 'case':
        return <CaseList showNotification={showNotification} />;
      case 'record':
        return <RecordList showNotification={showNotification} />;
      case 'user':
        return <UserList showNotification={showNotification} />;
      default:
        return <CaseList showNotification={showNotification} />;
    }
  };

  return (
    <CaseProvider>
      <RecordProvider>
        <UserProvider>
          <MobileContainer>
            {renderModule()}
            <BottomNav 
              activeModule={activeModule} 
              onModuleChange={setActiveModule} 
            />
          </MobileContainer>
          
          {/* 全局通知 */}
          <Snackbar
            open={notification.open}
            autoHideDuration={3000}
            onClose={() => setNotification(prev => ({ ...prev, open: false }))}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            sx={{ bottom: 70 }}
          >
            <Alert
              onClose={() => setNotification(prev => ({ ...prev, open: false }))}
              severity={notification.severity}
              sx={{ width: '100%' }}
            >
              {notification.message}
            </Alert>
          </Snackbar>
        </UserProvider>
      </RecordProvider>
    </CaseProvider>
  );
};

export default App;
    