import React from 'react';
import { Box, BottomNavigation, BottomNavigationAction } from '@mui/material';
import { 
  Assignment as CaseIcon, 
  Notes as RecordIcon, 
  People as UserIcon 
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';

// 自定义底部导航样式
const StyledBottomNavigation = styled(BottomNavigation)(({ theme }) => ({
  position: 'fixed',
  bottom: 0,
  left: 0,
  right: 0,
  maxWidth: '375px',
  margin: '0 auto',
  backgroundColor: 'white',
  boxShadow: '0 -2px 10px rgba(0,0,0,0.05)',
  zIndex: 100
}));

const BottomNav = ({ value, onChange }) => {
  return (
    <StyledBottomNavigation
      value={value}
      onChange={onChange}
      showLabels
    >
      <BottomNavigationAction 
        label="案例" 
        icon={<CaseIcon />} 
        value="cases"
      />
      <BottomNavigationAction 
        label="记录" 
        icon={<RecordIcon />} 
        value="records"
      />
      <BottomNavigationAction 
        label="用户" 
        icon={<UserIcon />} 
        value="users"
      />
    </StyledBottomNavigation>
  );
};

export default BottomNav;
    