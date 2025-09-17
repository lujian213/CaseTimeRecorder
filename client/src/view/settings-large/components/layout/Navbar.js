import React from 'react';
import { AppBar, Tabs, Tab, Typography, Box } from '@mui/material';
import { Assignment as CaseIcon, Timeline as RecordIcon, People as UserIcon } from '@mui/icons-material';

const Navbar = ({ activeTab, onTabChange }) => {
  // 导航标签定义
  const tabs = [
    { label: '案例', icon: <CaseIcon /> },
    { label: '记录', icon: <RecordIcon /> },
    { label: '用户', icon: <UserIcon /> }
  ];

  return (
    <AppBar position="static" elevation={2} sx={{ 
      bgcolor: 'primary.main', 
      color: 'white' 
    }}>
      <Box sx={{ width: '100%' }}>
        <Tabs
          value={activeTab}
          onChange={(_, newValue) => onTabChange(newValue)}
          indicatorColor="secondary"
          textColor="inherit"
          variant="fullWidth"
          sx={{
            '& .MuiTab-root': {
              minHeight: 60,
              fontSize: '0.875rem',
              transition: 'all 0.2s ease',
              '&:hover': {
                bgcolor: 'rgba(255, 255, 255, 0.1)',
              },
              '&.Mui-selected': {
                bgcolor: 'rgba(255, 255, 255, 0.15)',
              }
            },
            '& .MuiTab-iconWrapper': {
              mr: 1,
              display: 'flex',
              alignItems: 'center',
            }
          }}
        >
          {tabs.map((tab, index) => (
            <Tab 
              key={index} 
              label={tab.label} 
              icon={tab.icon}
              iconPosition="start"
            />
          ))}
        </Tabs>
      </Box>
    </AppBar>
  );
};

export default Navbar;
