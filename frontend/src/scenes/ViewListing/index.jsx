import React, { useState } from 'react';
import { Grid, Typography, Divider, Chip, Avatar, Button, Modal, Box } from '@mui/material';
import { useLocation } from 'react-router-dom';


const ViewListing = () => {
  const location = useLocation();
  const item = location.state;
  const [open, setOpen] = useState(false);
  const handleButtonClick = () => {
    setOpen(true);
  }
  return (
    <div style={{ flexGrow: 1, margin: '32px', }}>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <img src={item.image} alt={item.name} style={{ maxWidth: '90%', maxHeight: '90%' }} />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography variant="h5" gutterBottom>
            {item.name}
          </Typography>
          <Typography variant="h6" gutterBottom>
            ${item.price}
          </Typography>
          <Divider />
          <Typography variant="body1" gutterBottom>
            {item.description}
          </Typography>
          <Typography variant="body2" gutterBottom>
            Condition: {item.condition}
          </Typography>
          <Typography variant="body3" gutterBottom>
            Listed By: {item.userFirst} {item.userLast}
          </Typography>
          <Divider />
          <Typography variant="subtitle1" gutterBottom>
            Tags:
          </Typography>
          <div>
            {item.tags.map((tag) => (
              <Chip
                key={tag}
                label={tag}
                variant="outlined"
                avatar={<Avatar>{tag[0].toUpperCase()}</Avatar>}
                style={{ margin: '4px' }}
              />
            ))}
          </div>
          <Grid item xs={12} sm={6}>
            <Button onClick={handleButtonClick} variant='contained' style={{backgroundColor: 'crimson'}} gutterBottom>
              Contact Seller
            </Button>
          </Grid>
        </Grid>
      </Grid>
      <Modal open={open} style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}} onClose={() => setOpen(false)}>
        <Box border={'inset'} borderColor={'crimson'} borderRadius={4} sx={{ width: 400, bgcolor: 'background.paper', p: 2 }}>
          <Typography variant="h6">Contact Seller</Typography>
          <Typography variant='body1' gutterBottom>Email: {item.userEmail}</Typography>
          <Divider />
          <Button variant='contained' style={{marginTop: "2.5%", backgroundColor: 'crimson'}} onClick={() => setOpen(false)}>Close</Button>
        </Box>
      </Modal>
    </div>
  );
};

export default ViewListing;