import { Grid, Pagination } from '@mui/material';
import React, { useState, useEffect } from 'react';
import Card from '../../components/Card/Card';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { useOutletContext } from 'react-router-dom';

const theme = createTheme({
  typography: {
    fontFamily: 'Roboto, sans-serif',
    fontSize: 16,
    poster: {
      fontSize: '4rem',
      color: '#EE5A24',
    },
    body1: {
      fontWeight: 'bold',
      color: '#333333',
    },
    h5: {
      fontWeight: 'bold',
      color: '#EE5A24',
      fontStyle: 'italic',
    },
    h6: {
      fontWeight: 'bold',
      color: '#333333',
      fontStyle: 'normal',
    },
    h7: {
      color: '#888888',
      fontStyle: 'italic',
    },
  },
});



function Home() {
  const searchQuery = useOutletContext();
  console.log(searchQuery);
  const [listings, setListings] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [listingsPerPage, setListingsPerPage] = useState(16);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        let url = `http://localhost:8080/api/listings?page=${currentPage}&perPage=${listingsPerPage}`;
        if (searchQuery) {
          url = `http://localhost:8080/api/listings?search=${searchQuery}`;
        }
        const response = await fetch(url);
        const data = await response.json();
        setListings(data);
        console.log(data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchListings();
  }, [searchQuery, currentPage, listingsPerPage]);
  

  const indexOfLastListing = currentPage * listingsPerPage;
  const indexOfFirstListing = indexOfLastListing - listingsPerPage;
  const currentListings = listings.slice(indexOfFirstListing, indexOfLastListing);

  return (
    <ThemeProvider theme={theme}>
      <div style={{ padding: '10px', margin: '0 auto', maxWidth: '1200px' }}>
        <Grid container spacing={3}>
          {currentListings.map((listing) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={listing._id}>
              <Card 
              id={listing._id} 
              title={listing.name} 
              image={listing.image} 
              price={listing.price} 
              userId={listing.userId} 
              description={listing.description} 
              condition={listing.condition} 
              tags={listing.tags} />
            </Grid>
          ))}
        </Grid>
        <Pagination
          count={Math.ceil(listings.length / listingsPerPage)}
          page={currentPage}
          onChange={(event, value) => setCurrentPage(value)}
          style={{ marginTop: '40px' }}
        />
      </div>
    </ThemeProvider>
  );
}

export default Home;
