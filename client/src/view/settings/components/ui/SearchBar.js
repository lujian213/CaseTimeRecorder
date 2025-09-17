import { TextField, InputAdornment } from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';

const SearchBar = ({ value, onChange, placeholder, ...props }) => {
  return (
    <TextField
      placeholder={placeholder || "搜索..."}
      variant="outlined"
      size="small"
      fullWidth
      value={value}
      onChange={(e) => onChange(e.target.value)}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon fontSize="small" />
          </InputAdornment>
        ),
        sx: { borderRadius: 2 }
      }}
      sx={{
        backgroundColor: 'white',
        borderRadius: 2,
        ...props.sx
      }}
      {...props}
    />
  );
};

export default SearchBar;
    