import React, { useEffect, useState } from 'react';
import {  Card, CardActionArea, CardMedia, Grid, Typography, CardActions, Button, Modal, Box, Divider } from '@mui/material'
import '../UserListingCard/UserProfileCard.css'
import { Link, Link as RouterLink } from 'react-router-dom';
import axios from 'axios';
import EditForm from '../../scenes/EditListing';
import { hydrate, render } from 'react-dom';

function UserListingCard(props) {
  const [listee,setListee] = useState({firstName: "", lastName: ""});
  const [open, setOpen] = useState();
  const getListee = async () => {
    const url = `http://localhost:8080/api/getuser/${props.userId}`;
    const response = await axios.get(url);
    return response.data;
  };
  const deleteListing = async () => {
    const url = `http://localhost:8080/api/listings/${props.Id}`;
    await axios.delete(url, {headers: {'x-auth-token': localStorage.getItem('token')}});
    window.location.reload();
  };
  useEffect(() => {
    getListee().then((res) => {
      setListee({...listee, firstName: res.firstName, lastName: res.lastName});
    });
  }, []);
  const handleButtonClick = () => {
    setOpen(true);
  }
  return (
    <div className='container-card'>
      <Grid item md={false}>
        <Card className='card'>
          <Link to={'/editListing'} state={{id: props.Id, name: props.title, price: props.price, description: props.description, condition: props.condition, image: props.image, tags: props.tags}} style={{textDecoration: 'none'}}>
            <CardActionArea sx={{fill: "100%"}}>
              <CardMedia
                className={'media'}
                image={props.image}
                title={props.title}
              />
              <Typography variant="h5" sx={{fontSize: '1rem'}} gutterBottom>
                {props.title}
              </Typography>
              <Typography variant="h6" component="p">
                ${Number(props.price).toFixed(2)}
              </Typography>
              <Typography variant="h7" component="p">
                Listed By: {listee.firstName} {listee.lastName}
              </Typography>
            </CardActionArea>
          </Link>
          <CardActions>
            <Button variant='contained' size='small' onClick={handleButtonClick} style={{margin: 'auto', paddingBottom: 'auto', backgroundColor: 'crimson'}}>
              Delete
            </Button>
          </CardActions>
        </Card>
      </Grid>
      <Grid item md={false}>
        <Modal open={open} style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}} onClose={() => setOpen(false)}>
          <Box border={'inset'} borderColor={'crimson'} borderRadius={4} sx={{ width: 400, bgcolor: 'background.paper', p: 2 }}>
            <Typography variant="body1">Are you sure you wish to delete this listing?</Typography>
            <Divider />
            <Grid container alignItems='center' justifyContent='center'>
              <Button variant='contained' style={{marginTop: "2.5%", marginLeft: "2.5%", marginRight: "2.5%", backgroundColor: 'crimson'}} onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button data-testid='confirmBtn' variant='contained' style={{marginTop: "2.5%", backgroundColor: 'crimson'}} onClick={() => {
                setOpen(false);
                deleteListing();
              }}>
                Confirm
              </Button>
            </Grid>
          </Box>
        </Modal>
      </Grid>
    </div>
  );
}
export default UserListingCard;