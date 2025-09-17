import { styled } from '@mui/material/styles';
import { Box, IconButton, Typography } from '@mui/material';
import { 
  Assignment as CaseIcon, 
  NoteAdd as RecordIcon, 
  People as UserIcon 
} from '@mui/icons-material';

const NavContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-around',
  alignItems: 'center',
  height: 56,
  backgroundColor: 'white',
  borderTop: '1px solid #eee',
  position: 'fixed',
  bottom: 0,
  left: 0,
  right: 0,
  maxWidth: '375px',
  margin: '0 auto',
  zIndex: 100
}));

const NavItem = styled(Box)(({ theme, active }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  color: active ? theme.palette.primary.main : '#757575',
  fontSize: 12
}));

const BottomNav = ({ activeModule, onModuleChange }) => {
  return (
    <NavContainer>
      <IconButton 
        size="small" 
        onClick={() => onModuleChange('case')}
        sx={{ p: 1 }}
      >
        <NavItem active={activeModule === 'case'}>
          <CaseIcon fontSize="small" />
          <Typography variant="caption" sx={{ mt: 0.5 }}>
            案例
          </Typography>
        </NavItem>
      </IconButton>
      
      <IconButton 
        size="small" 
        onClick={() => onModuleChange('record')}
        sx={{ p: 1 }}
      >
        <NavItem active={activeModule === 'record'}>
          <RecordIcon fontSize="small" />
          <Typography variant="caption" sx={{ mt: 0.5 }}>
            记录
          </Typography>
        </NavItem>
      </IconButton>
      
      <IconButton 
        size="small" 
        onClick={() => onModuleChange('user')}
        sx={{ p: 1 }}
      >
        <NavItem active={activeModule === 'user'}>
          <UserIcon fontSize="small" />
          <Typography variant="caption" sx={{ mt: 0.5 }}>
            用户
          </Typography>
        </NavItem>
      </IconButton>
    </NavContainer>
  );
};

export default BottomNav;
    