# Bus Ticket Booking System

A modern web application for booking bus tickets with features including real-time seat selection, printable receipts, and an integrated chatbot for customer support.

## Features

- User authentication and registration
- Real-time bus search and filtering
- Interactive seat selection
- Secure payment processing
- Printable ticket receipts
- Live chat support with AI chatbot
- Booking history and management
- Responsive design for all devices

## Tech Stack

- Backend: Python with Flask
- Frontend: Flask Templates, Bootstrap 5, Vanilla JavaScript
- Database: MongoDB
- Real-time Features: Flask-SocketIO
- Authentication: Flask-Login
- Form Handling: Flask-WTF
- Styling: Bootstrap 5 and Custom CSS

## Prerequisites

- Python 3.8 or higher
- MongoDB (v4.4 or higher)
- pip (Python package manager)

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd bus-ticket-booking-system
```

2. Set up Python virtual environment and install dependencies:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

3. Create a `.env` file in the root directory:
```env
MONGODB_URI=mongodb://localhost:27017/bus-booking
SECRET_KEY=your_secret_key
PORT=5000
```

4. Start the application:
```bash
python backend/app.py
```

The application will be available at http://localhost:5000

## Project Structure

```
bus-ticket-booking-system/
├── backend/
│   ├── static/
│   │   ├── css/         # CSS files
│   │   └── js/          # JavaScript files
│   ├── templates/       # HTML templates
│   │   ├── base.html
│   │   ├── home.html
│   │   └── ...
│   ├── app.py          # Main Flask application
│   └── requirements.txt # Python dependencies
└── README.md
```

## Routes

### Authentication
- GET/POST /login - User login
- GET/POST /register - New user registration
- GET /logout - User logout

### Buses
- GET / - Home page with search form
- GET /search - Search for buses
- GET /bus/<bus_id> - Bus details

### Bookings
- GET/POST /booking/<bus_id> - Create new booking
- GET /booking/confirmation/<booking_id> - Booking confirmation
- GET /my-bookings - User's booking history

## Features in Detail

### Real-time Chat Support
- Integrated chatbot using Flask-SocketIO
- Real-time message updates
- Automated responses for common queries

### Seat Selection
- Interactive seat map
- Real-time seat availability updates
- Multiple seat selection support

### Printable Receipts
- Professional receipt layout
- Print-optimized styling
- Booking reference generation

### Security Features
- Password hashing
- Session management
- CSRF protection
- Input validation

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 