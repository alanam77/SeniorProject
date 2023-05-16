import React, { useState } from 'react';
import { Box, useMediaQuery } from '@mui/material';
import { Outlet, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Navbar from '../../components/Navbar/Navbar';
import Home from '../Home';
import TagList from '../../components/TagList/TagList';
import { useNavigate } from 'react-router-dom';

function Layout() {
  const [searchQuery, setSearchQuery] = useState('');
  const tags = [
    "CSCI",
    "ENG",
    "PHYS",
    "PHIL",
    "PSYCH",
    "BMED",
    "Calculator",
    "Electronic",
    "Book",
    "Supplies",
  ];
  const navigate = useNavigate();
  const location = useLocation();

  const handleSearch = (query) => {
    setSearchQuery(query);
    console.log(query);
  };

  const handleTagClick = (tag) => {
    setSearchQuery(tag);
    if (location.pathname !== '/home') {
      navigate('/');
    }
  };

  return (
    <Box width="100%" height="100%">
      <Box>
        <Navbar handleSearch={handleSearch} />
        <TagList tags={tags} onTagClick={handleTagClick} />
        <Outlet context={searchQuery} />
      </Box>
    </Box>
  );
}

export default Layout;
