import { styled } from '@mui/material/styles';
import { 
  ListItem, ListItemText, ListItemSecondaryAction, 
  IconButton, Box, Typography, Chip 
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

const RecordItem = ({ record, caseName, formattedDate, onEdit, onDelete }) => {
  return (
    <StyledListItem>
      <ListItemText
        primary={record.title}
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
              {record.content}
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Chip 
                label={caseName} 
                size="small" 
                color="primary"
                sx={{ 
                  backgroundColor: 'rgba(33, 150, 243, 0.1)',
                  color: '#2196f3',
                  '& .MuiChip-label': {
                    fontSize: 11
                  }
                }}
              />
              <Typography variant="caption" color="text.secondary">
                {formattedDate}
              </Typography>
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

export default RecordItem;
    