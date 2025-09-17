import { styled } from '@mui/material/styles';
import { 
  ListItem, ListItemText, ListItemSecondaryAction, 
  IconButton, Chip, Box, Typography, Avatar 
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';

const StyledListItem = styled(ListItem)(({ theme }) => ({
  borderRadius: 12,
  marginBottom: theme.spacing(1.5),
  backgroundColor: 'white',
  boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
  '&:hover': {
    backgroundColor: '#fafafa'
  },
  '&:active': {
    backgroundColor: '#f0f0f0'
  }
}));

const StyledAvatar = styled(Avatar)(({ theme }) => ({
  width: 32,
  height: 32,
  mr: 2,
  bgcolor: 'primary.light',
  color: 'white',
  fontSize: 14
}));

const RoleChip = styled(Chip)(({ theme }) => ({
  '& .MuiChip-label': {
    fontSize: 12
  }
}));

const UserItem = ({ user, onEdit, onDelete }) => {
  // 获取用户名首字母
  const getInitials = (name) => {
    return name.charAt(0).toUpperCase();
  };

  return (
    <StyledListItem>
      <StyledAvatar>
        {getInitials(user.userName)}
      </StyledAvatar>
      <ListItemText
        primary={user.userName}
        secondary={
          <Box>
            <Typography 
              variant="body2" 
              color="text.secondary"
              sx={{ fontSize: 12, mb: 1 }}
            >
              {user.email}
            </Typography>
            <RoleChip 
              label={user.role} 
              size="small" 
              color={
                user.role === '管理员' ? 'primary' :
                user.role === '开发者' ? 'secondary' :
                user.role === '测试员' ? 'success' : 'default'
              }
            />
          </Box>
        }
      />
      <ListItemSecondaryAction>
        <IconButton 
          size="small" 
          onClick={onEdit}
          sx={{ color: '#4caf50', mr: -1 }}
        >
          <EditIcon fontSize="small" />
        </IconButton>
        <IconButton 
          size="small" 
          onClick={onDelete}
          sx={{ color: '#f44336' }}
        >
          <DeleteIcon fontSize="small" />
        </IconButton>
      </ListItemSecondaryAction>
    </StyledListItem>
  );
};

export default UserItem;
    