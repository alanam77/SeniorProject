import React from 'react';
import { Box, Chip, Typography } from '@mui/material';

function TagList({ tags, onTagClick }) {
  const handleClick = (tag) => {
    onTagClick(tag);
  };

  return (
    <Box sx={{ p: 2, display: 'flex', alignItems: 'center' }}>
      <Typography variant="subtitle1" sx={{ mr: 1, mb: 0 }}>
        Tags:
      </Typography>
      {tags.map((tag) => (
        <Chip
          key={tag}
          label={tag}
          variant="outlined"
          sx={{ mr: 1, mb: 1, cursor: 'pointer' }}
          onClick={() => handleClick(tag)}
        />
      ))}
    </Box>
  );
}

export default TagList;
