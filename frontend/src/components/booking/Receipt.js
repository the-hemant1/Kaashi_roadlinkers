import React, { useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useReactToPrint } from 'react-to-print';
import {
  Container,
  Paper,
  Typography,
  Grid,
  Button,
  Box,
  Divider
} from '@mui/material';
import { Print as PrintIcon } from '@mui/icons-material';
import { format } from 'date-fns';

const Receipt = () => {
  const { id } = useParams();
  const componentRef = useRef();
  const [booking, setBooking] = React.useState(null);

  React.useEffect(() => {
    // Fetch booking details from API
    fetch(`http://localhost:5000/api/bookings/${id}`)
      .then(res => res.json())
      .then(data => setBooking(data))
      .catch(err => console.error('Error fetching booking:', err));
  }, [id]);

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  if (!booking) {
    return (
      <Container sx={{ py: 4 }}>
        <Typography>Loading...</Typography>
      </Container>
    );
  }

  return (
    <Container sx={{ py: 4 }}>
      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          variant="contained"
          startIcon={<PrintIcon />}
          onClick={handlePrint}
        >
          Print Receipt
        </Button>
      </Box>

      <Paper ref={componentRef} sx={{ p: 4 }}>
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography variant="h4" gutterBottom>
            Travel Receipt
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Booking Reference: {booking.bookingReference}
          </Typography>
        </Box>

        <Divider sx={{ my: 3 }} />

        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>
              Journey Details
            </Typography>
            <Typography>From: {booking.bus.source}</Typography>
            <Typography>To: {booking.bus.destination}</Typography>
            <Typography>
              Date: {format(new Date(booking.travelDate), 'PPP')}
            </Typography>
            <Typography>
              Departure: {format(new Date(booking.bus.departureTime), 'pp')}
            </Typography>
            <Typography>Bus Number: {booking.bus.busNumber}</Typography>
            <Typography>Bus Type: {booking.bus.busType}</Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>
              Passenger Details
            </Typography>
            {booking.passengers.map((passenger, index) => (
              <Box key={index} sx={{ mb: 1 }}>
                <Typography>
                  {passenger.name} ({passenger.age} years)
                </Typography>
                <Typography color="text.secondary">
                  Seat: {booking.seatNumbers[index]}
                </Typography>
              </Box>
            ))}
          </Grid>
        </Grid>

        <Divider sx={{ my: 3 }} />

        <Box sx={{ textAlign: 'right' }}>
          <Typography variant="h6" gutterBottom>
            Payment Details
          </Typography>
          <Typography>Total Amount: ${booking.totalAmount}</Typography>
          <Typography>Status: {booking.paymentStatus}</Typography>
          <Typography variant="caption" display="block" sx={{ mt: 2 }}>
            Booked on: {format(new Date(booking.bookingDate), 'PPP')}
          </Typography>
        </Box>

        <Box sx={{ mt: 4, pt: 2, borderTop: '1px dashed grey.300' }}>
          <Typography variant="caption" display="block" textAlign="center">
            This is a computer-generated receipt and does not require a signature.
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default Receipt; 