import React, { useEffect, useState } from 'react';
import { Card, CardActionArea, CardMedia, Grid, Typography } from '@mui/material'
import '../Card/Card.css'
import { Link } from 'react-router-dom';
import axios from 'axios';

function SaleCard(props) {
  const [listee,setListee] = useState({firstName: "", lastName: "", email: ""});
  const getListee = async () => {
    const url = `http://localhost:8080/api/getuser/${props.userId}`;
    const response = await axios.get(url);
    return response.data;
  };
  useEffect(() => {
    getListee().then((res) => {
      setListee({...listee, firstName: res.firstName, lastName: res.lastName, email: res.email});
    });
  }, []);
  return (
    <div className='container-card'>
      <Grid item md={false}>
        <Card className='card'>
          <Link to={'/viewListing'} state={{userEmail: listee.email ,userFirst: listee.firstName, userLast: listee.lastName ,id: props.id, name: props.title, price: props.price, description: props.description, condition: props.condition, image: props.image, tags: props.tags}} style={{textDecoration: 'none'}}>
            <CardActionArea sx={{fill: "100%"}}>
              <CardMedia
                className={'media'}
                image={props.image}
                title={props.title}
              />
              <Typography variant="h5" sx={{ fontSize: '1rem' }} gutterBottom>
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
        </Card>
      </Grid>
    </div>
  );
}
export default SaleCard;