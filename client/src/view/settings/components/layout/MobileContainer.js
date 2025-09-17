import { styled } from '@mui/material/styles';
import { Container } from '@mui/material';

// 移动端容器，固定最大宽度模拟手机屏幕
const MobileContainer = styled(Container)(({ theme }) => ({
  maxWidth: '375px',
  minHeight: '100vh',
  backgroundColor: '#f5f5f5',
  padding: theme.spacing(2),
  margin: '0 auto',
  boxShadow: '0 0 10px rgba(0,0,0,0.1)',
  position: 'relative'
}));

export default MobileContainer;
    