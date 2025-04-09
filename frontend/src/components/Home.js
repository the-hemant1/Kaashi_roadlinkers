import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  Paper,
  Grid,
  TextField,
  Button,
  Card,
  CardContent,
  CardMedia
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import DirectionsBusIcon from '@mui/icons-material/DirectionsBus';

const Home = () => {
  const navigate = useNavigate();
  const [searchData, setSearchData] = React.useState({
    from: '',
    to: '',
    date: new Date()
  });

  const handleSearch = (e) => {
    e.preventDefault();
    navigate('/search', { state: searchData });
  };

  const featuredRoutes = [
    {
      from: 'New York',
      to: 'Boston',
      image: 'https://source.unsplash.com/400x200/?new-york',
      price: '$45'
    },
    {
      from: 'Los Angeles',
      to: 'San Francisco',
      image: 'https://source.unsplash.com/400x200/?los-angeles',
      price: '$55'
    },
    {
      from: 'Chicago',
      to: 'Detroit',
      image: 'https://source.unsplash.com/400x200/?chicago',
      price: '$35'
    }
  ];

  return (
    <Container>
      <Box sx={{ my: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom align="center">
          Book Your Bus Journey
        </Typography>
        
        <Paper elevation={3} sx={{ p: 4, mb: 4 }}>
          <form onSubmit={handleSearch}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={3}>
                <TextField
                  fullWidth
                  label="From"
                  value={searchData.from}
                  onChange={(e) => setSearchData({ ...searchData, from: e.target.value })}
                  required
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <TextField
                  fullWidth
                  label="To"
                  value={searchData.to}
                  onChange={(e) => setSearchData({ ...searchData, to: e.target.value })}
                  required
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    label="Date of Journey"
                    value={searchData.date}
                    onChange={(newValue) => setSearchData({ ...searchData, date: newValue })}
                    renderInput={(params) => <TextField {...params} fullWidth required />}
                    minDate={new Date()}
                  />
                </LocalizationProvider>
              </Grid>
              <Grid item xs={12} md={3}>
                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  fullWidth
                  sx={{ height: '56px' }}
                  startIcon={<DirectionsBusIcon />}
                >
                  Search Buses
                </Button>
              </Grid>
            </Grid>
          </form>
        </Paper>

        <Typography variant="h4" gutterBottom sx={{ mt: 6, mb: 3 }}>
          Popular Routes
        </Typography>
        
        <Grid container spacing={4}>
          {featuredRoutes.map((route, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Card>
                <CardMedia
                  component="img"
                  height="200"
                  image={route.image}
                  alt={`${route.from} to ${route.to}`}
                />
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {route.from} to {route.to}
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Starting from {route.price}
                  </Typography>
                  <Button
                    variant="outlined"
                    color="primary"
                    sx={{ mt: 2 }}
                    onClick={() => setSearchData({ ...searchData, from: route.from, to: route.to })}
                  >
                    Check Availability
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Container>
  );
};

export default Home; 