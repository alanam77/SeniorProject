import React from 'react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import jwt_decode from 'jwt-decode';
import { Link, useNavigate } from 'react-router-dom'
import { Grid, Box, Button, useMediaQuery, Typography, Avatar } from '@mui/material'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import '../UserProfile/index.css'
import UserListingCard from '../../components/UserListingCard/UserProfileCard';

const theme = createTheme({
  typography: {
    poster: {
      fontSize: '4rem',
      color: 'black',
    }
    ,
    body1: {
      fontWeight: 'bold',
      color: 'black',
    }
    ,
    h5: {
      fontWeight: 'bold',
      color: 'black',
      fontStyle: 'italic',
    }
    ,
    h6: {
      fontWeight: 'bold',
      color: 'black',
      fontStyle: 'normal',
    }
    ,
    h7: {
      color: 'gray',
      fontStyle: 'italic',
    }
    ,
  }
});


function UserProfile(props) {
  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
  });
  const [listings, setListings] = useState([]);
  const getUserListings = async () => {
    const url = "http://localhost:8080/api/finduser/listings/";
    const res = await axios.get(url, { headers: { "x-auth-token": props.user_id } });
    return res.data;
  }
  const getData = async () => {
    const url = "http://localhost:8080/api/finduser/";
    const res = await axios.get(url, { headers: { "x-auth-token": props.user_id } });
    return res.data;
  };
  useEffect(() => {
    getData().then((res) => {
      setUser({ ...user, firstName: res.firstName, lastName: res.lastName, email: res.email });
    }).catch((err) => { console.log(err) });
    getUserListings().then((res) => {
      setListings(res);
    }).catch((err) => { console.log(err) });
  }, []);
  return (
    <ThemeProvider theme={theme}>
      <div className='root'>
        <Grid container spacing={3} direction="column" alignItems="center" justifyContent="center" style={{ minHeight: 'auto' }}>
          <Grid item xs={12}>
            <Typography variant="poster" component="h1" align='center'>
              {user.firstName} {user.lastName}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Avatar alt={`${user.firstName} ${user.lastName}`} src={`${user.firstName} ${user.lastName}`} sx={{ width: 200, height: 200 }} />
          </Grid>
          <Grid item xs={12}>
            <Typography variant="body1">
              Email: {user.email}
            </Typography>
          </Grid>
        </Grid>
        <Grid container spacing={0} direction="column" alignItems="center" justifyContent="center" style={{ minHeight: 'auto', padding: '10px' }}>
          <Button data-testid="create-btn" variant="contained" component={Link} to="/createListing" sx={{ backgroundColor: '#d24f09dc' }}>Create Listing</Button>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h5" component="h2" align='center'>
            Your Listings:
          </Typography>
        </Grid>
        <Grid container spacing={2}>
          {listings.slice(0, listings.length).map(listing => (
          <div>
            <UserListingCard
              key={listing._id}
              title={listing.name}
              description={listing.description}
              condition={listing.condition}
              image={listing.image}
              price={listing.price}
              userId={listing.userId}
              route={props.route}
              tags={listing.tags}
              Id={listing._id}
            />
          </div>
          ))}
        </Grid>
      </div>
    </ThemeProvider>

  );
}

export default UserProfile