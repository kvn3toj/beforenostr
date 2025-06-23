import React, { useState } from 'react';
import { Box, InputBase, IconButton, Paper } from '@mui/material';
import { Search } from '@mui/icons-material';

interface SearchBarProps {
  onSearch: (query: string) => void;
  onFilterChange: (filters: any) => void;
  placeholder?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({
  onSearch,
  onFilterChange,
  placeholder = '¿Qué estás buscando?',
}) => {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);
  };

  const handleChange = (value: string) => {
    setQuery(value);
    // Trigger search on every keystroke for better UX
    onSearch(value);
  };

  return (
    <Box sx={{ mb: 3, display: 'flex', justifyContent: 'center' }}>
      <Paper
        component="form"
        onSubmit={handleSubmit}
        sx={{
          p: '2px 4px',
          display: 'flex',
          alignItems: 'center',
          width: '100%',
          maxWidth: 600,
          borderRadius: 2,
          boxShadow: 1,
        }}
      >
        <IconButton type="submit" sx={{ p: '10px' }} aria-label="search">
          <Search />
        </IconButton>
        <InputBase
          sx={{ ml: 1, flex: 1 }}
          placeholder={placeholder}
          value={query}
          onChange={(e) => handleChange(e.target.value)}
          inputProps={{ 'aria-label': 'search marketplace' }}
        />
      </Paper>
    </Box>
  );
};

export default SearchBar;
