import { styled } from '@mui/material/styles';
import { 
  ListItem, ListItemText, ListItemSecondaryAction, 
  IconButton, Chip, Box, Typography 
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

const StatusChip = styled(Chip)(({ theme, status }) => ({
  backgroundColor: status === 'ACTIVE' 
    ? theme.palette.success.main 
    : theme.palette.grey[400],
  color: 'white',
  '& .MuiChip-label': {
    fontSize: 12
  }
}));

const PriorityChip = styled(Chip)(({ theme, priority }) => {
  const colors = {
    HIGH: theme.palette.error.main,
    MEDIUM: theme.palette.warning.main,
    LOW: theme.palette.success.main
  };
  
  return {
    backgroundColor: colors[priority] || theme.palette.grey[300],
    color: 'white',
    '& .MuiChip-label': {
      fontSize: 12
    }
  };
});

const CaseItem = ({ caseItem, onEdit, onDelete }) => {
  return (
    <StyledListItem>
      <ListItemText
        primary={caseItem.caseName}
        secondary={
          <Box>
            <Typography 
              variant="body2" 
              color="text.secondary"
              sx={{ 
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                fontSize: 12,
                mt: 0.5,
                mb: 1
              }}
            >
              {caseItem.description}
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <StatusChip 
                label={caseItem.status === 'ACTIVE' ? '激活' : '未激活'} 
                size="small" 
                status={caseItem.status}
              />
              <PriorityChip 
                label={
                  caseItem.priority === 'HIGH' ? '高优先级' : 
                  caseItem.priority === 'MEDIUM' ? '中优先级' : '低优先级'
                } 
                size="small" 
                priority={caseItem.priority}
              />
            </Box>
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

export default CaseItem;
    