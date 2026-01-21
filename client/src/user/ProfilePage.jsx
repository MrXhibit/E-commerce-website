import React from 'react';
import { Box, Container, Grid, Card, Typography, Avatar, Button, Divider, IconButton, Chip } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import Header from './Header';
import Footer from './Footer';

const user = {
  name: 'Felecia Burke',
  avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
  balance: 5000,
  location: 'Hong Kong, China',
  email: 'example@mail.com',
  phone: '+1 (070) 123-4567',
  firstName: 'Felecia',
  lastName: 'Burke',
  dob: '10 June, 1990',
  gender: 'Female',
  address: '898 Joanne Lane Street',
  city: 'Boston',
  country: 'United States',
  state: 'Massachusetts',
  zip: '02110',
  card: {
    type: 'VISA',
    holder: 'Mark Anderson',
    expire: '12/31',
    number: '0123 4567 8910 1112',
    balance: 1000000,
  },
  wishlist: [
    {
      id: 1,
      name: 'Apple Watch Series 4',
      productId: '790841',
      color: 'Gold',
      size: '44mm',
      price: 399,
      image: 'https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/MQKW2_VW_34FR+watch-44-alum-gold-nc-6s_VW_34FR_WF_CO_GEO_US?wid=2000&hei=2000&fmt=jpeg&qlt=95&.v=1529520060556',
      status: 'In Stock',
    },
    {
      id: 2,
      name: 'Apple Watch Series 4',
      productId: '790841',
      color: 'Gold',
      size: '44mm',
      price: 399,
      image: 'https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/MQKW2_VW_34FR+watch-44-alum-gold-nc-6s_VW_34FR_WF_CO_GEO_US?wid=2000&hei=2000&fmt=jpeg&qlt=95&.v=1529520060556',
      status: 'In Stock',
    },
    {
      id: 3,
      name: 'Apple Watch Series 4',
      productId: '790841',
      color: 'Gold',
      size: '44mm',
      price: 399,
      image: 'https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/MQKW2_VW_34FR+watch-44-alum-gold-nc-6s_VW_34FR_WF_CO_GEO_US?wid=2000&hei=2000&fmt=jpeg&qlt=95&.v=1529520060556',
      status: 'In Stock',
    },
  ],
};

const ProfilePage = () => (
  <>
    <Header />
    <Box sx={{ background: '#f4f6fa', minHeight: '100vh', py: 6 }}>
      <Container maxWidth="xl">
        <Typography variant="h4" fontWeight={700} sx={{ mb: 4 }}>
          Account
        </Typography>
        <Grid container spacing={4}>
          {/* Profile Card */}
          <Grid item xs={12} md={3}>
            <Card sx={{ p: 3, textAlign: 'center', boxShadow: 2 }}>
              <Avatar src={user.avatar} alt={user.name} sx={{ width: 90, height: 90, mx: 'auto', mb: 2 }} />
              <Typography variant="h6" fontWeight={700}>{user.name}</Typography>
              <Button variant="contained" color="primary" sx={{ mt: 2, mb: 2, borderRadius: 8, fontWeight: 700 }}>
                Balance: ${user.balance.toLocaleString()}
              </Button>
              <Divider sx={{ my: 2 }} />
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <LocationOnIcon fontSize="small" sx={{ mr: 1 }} />
                <Typography variant="body2">{user.location}</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <EmailIcon fontSize="small" sx={{ mr: 1 }} />
                <Typography variant="body2">{user.email}</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <PhoneIcon fontSize="small" sx={{ mr: 1 }} />
                <Typography variant="body2">{user.phone}</Typography>
              </Box>
            </Card>
          </Grid>
          {/* Account Details, Shipping, Payment */}
          <Grid item xs={12} md={9}>
            <Grid container spacing={4}>
              {/* Account Details */}
              <Grid item xs={12} md={4}>
                <Card sx={{ p: 3, boxShadow: 2, position: 'relative' }}>
                  <IconButton size="small" sx={{ position: 'absolute', top: 12, right: 12 }}><EditIcon fontSize="small" /></IconButton>
                  <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 2 }}>Account Details</Typography>
                  <Typography variant="body2" color="text.secondary">First Name</Typography>
                  <Typography variant="body1" fontWeight={600}>{user.firstName}</Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>Last Name</Typography>
                  <Typography variant="body1" fontWeight={600}>{user.lastName}</Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>Date of Birth</Typography>
                  <Typography variant="body1" fontWeight={600}>{user.dob}</Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>Gender</Typography>
                  <Typography variant="body1" fontWeight={600}>{user.gender}</Typography>
                </Card>
              </Grid>
              {/* Shipping Address */}
              <Grid item xs={12} md={4}>
                <Card sx={{ p: 3, boxShadow: 2, position: 'relative' }}>
                  <IconButton size="small" sx={{ position: 'absolute', top: 12, right: 12 }}><EditIcon fontSize="small" /></IconButton>
                  <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 2 }}>Shipping Address</Typography>
                  <Typography variant="body2" color="text.secondary">Address</Typography>
                  <Typography variant="body1" fontWeight={600}>{user.address}</Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>City</Typography>
                  <Typography variant="body1" fontWeight={600}>{user.city}</Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>Country</Typography>
                  <Typography variant="body1" fontWeight={600}>{user.country}</Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>State</Typography>
                  <Typography variant="body1" fontWeight={600}>{user.state}</Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>Zip Code</Typography>
                  <Typography variant="body1" fontWeight={600}>{user.zip}</Typography>
                </Card>
              </Grid>
              {/* Payment Methods */}
              <Grid item xs={12} md={4}>
                <Card sx={{ p: 3, boxShadow: 2, position: 'relative' }}>
                  <IconButton size="small" sx={{ position: 'absolute', top: 12, right: 12 }}><EditIcon fontSize="small" /></IconButton>
                  <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 2 }}>Payment Methods</Typography>
                  <Box sx={{ background: 'linear-gradient(90deg, #ff6a00 0%, #ee0979 100%)', borderRadius: 2, p: 2, mb: 2, color: 'white' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <CreditCardIcon fontSize="large" />
                      <Typography variant="h6" fontWeight={700}>VISA</Typography>
                    </Box>
                    <Typography variant="h6" fontWeight={700} sx={{ letterSpacing: 2, mt: 1 }}>{user.card.number}</Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                      <Typography variant="body2">{user.card.holder}</Typography>
                      <Typography variant="body2">EXP: {user.card.expire}</Typography>
                    </Box>
                  </Box>
                  <Typography variant="body2" color="text.secondary">Card Type</Typography>
                  <Typography variant="body1" fontWeight={600}>{user.card.type}</Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>Card Holder</Typography>
                  <Typography variant="body1" fontWeight={600}>{user.card.holder}</Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>Expire</Typography>
                  <Typography variant="body1" fontWeight={600}>{user.card.expire}</Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>Card Number</Typography>
                  <Typography variant="body1" fontWeight={600}>{user.card.number}</Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>Balance</Typography>
                  <Typography variant="body1" fontWeight={600}>${user.card.balance.toLocaleString()}</Typography>
                </Card>
              </Grid>
            </Grid>
            {/* Wish List */}
            <Card sx={{ mt: 4, p: 3, boxShadow: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" fontWeight={700}>Wish List</Typography>
                <Button size="small">View All</Button>
              </Box>
              <Grid container spacing={2}>
                {user.wishlist.map(item => (
                  <Grid item xs={12} sm={6} md={4} lg={3} key={item.id}>
                    <Card sx={{ p: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', boxShadow: 1 }}>
                      <img src={item.image} alt={item.name} style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 8, marginBottom: 8 }} />
                      <Typography variant="subtitle1" fontWeight={700} align="center">{item.name}</Typography>
                      <Typography variant="body2" color="text.secondary">Product ID: {item.productId}</Typography>
                      <Typography variant="body2" color="text.secondary">Color: {item.color}</Typography>
                      <Typography variant="body2" color="text.secondary">Size: {item.size}</Typography>
                      <Typography variant="body2" color="text.secondary">Price: ${item.price}</Typography>
                      <Chip label={item.status} color="primary" size="small" sx={{ mt: 1 }} />
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
    <Footer />
  </>
);

export default ProfilePage;