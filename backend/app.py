from flask import Flask, request, jsonify, render_template, redirect, url_for, flash
from flask_cors import CORS
from flask_socketio import SocketIO, emit
from datetime import datetime
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = Flask(__name__)
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'your-secret-key-here')

CORS(app)
socketio = SocketIO(app, cors_allowed_origins="*")

# Fake bus data
FAKE_BUSES = [
    {
        'id': '1',
        'name': 'Kaashi Deluxe',
        'type': 'AC Sleeper',
        'departure_time': '20:00',
        'arrival_time': '06:00',
        'seats_available': 15,
        'price': 1200,
        'image': 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
    },
    {
        'id': '2',
        'name': 'Kaashi Express',
        'type': 'Non-AC Seater',
        'departure_time': '21:30',
        'arrival_time': '07:30',
        'seats_available': 25,
        'price': 800,
        'image': 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
    },
    {
        'id': '3',
        'name': 'Kaashi Premium',
        'type': 'AC Seater',
        'departure_time': '22:00',
        'arrival_time': '08:00',
        'seats_available': 20,
        'price': 1000,
        'image': 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
    }
]

# Chatbot responses
CHATBOT_RESPONSES = {
    'greeting': {
        'message': 'Hello! I\'m your bus booking assistant. How can I help you today?',
        'quickOptions': ['Search buses', 'Check ticket price', 'Payment methods', 'Cancel booking']
    },
    'search_buses': {
        'message': 'You can search for buses by clicking on the "Search Buses" button on the homepage. You\'ll need to provide:\n- Departure city\n- Destination city\n- Travel date',
        'quickOptions': ['Popular routes', 'Check ticket price', 'Payment methods']
    },
    'ticket_price': {
        'message': 'Our ticket prices vary based on the bus type:\n- AC Sleeper: ₹1200\n- Non-AC Seater: ₹800\n- AC Seater: ₹1000\n\nWould you like to search for buses?',
        'quickOptions': ['Search buses', 'Payment methods', 'Popular routes']
    },
    'payment_methods': {
        'message': 'We accept the following payment methods:\n- UPI (Google Pay, PhonePe, etc.)\n- Credit/Debit Cards\n- Net Banking\n\nAll payments are secure and encrypted.',
        'quickOptions': ['Search buses', 'Check ticket price', 'Popular routes']
    },
    'cancel_booking': {
        'message': 'To cancel your booking, please contact our customer support at support@kaashiroadlinkers.com with your booking reference number.',
        'quickOptions': ['Search buses', 'Check ticket price', 'Payment methods']
    },
    'popular_routes': {
        'message': 'Our popular routes include:\n- Delhi to Varanasi\n- Mumbai to Pune\n- Bangalore to Chennai\n\nWould you like to search for buses on these routes?',
        'quickOptions': ['Search buses', 'Check ticket price', 'Payment methods']
    },
    'default': {
        'message': 'I\'m not sure I understand. Here are some things I can help you with:',
        'quickOptions': ['Search buses', 'Check ticket price', 'Payment methods', 'Popular routes']
    }
}

@app.route('/')
def home():
    popular_routes = [
        {
            'from': 'Delhi',
            'to': 'Varanasi',
            'image': 'https://source.unsplash.com/400x200/?varanasi',
            'price': '1200'
        },
        {
            'from': 'Mumbai',
            'to': 'Pune',
            'image': 'https://source.unsplash.com/400x200/?mumbai',
            'price': '800'
        },
        {
            'from': 'Bangalore',
            'to': 'Chennai',
            'image': 'https://source.unsplash.com/400x200/?bangalore',
            'price': '1000'
        }
    ]
    return render_template('home.html', 
                         popular_routes=popular_routes,
                         today=datetime.now().strftime('%Y-%m-%d'))

@app.route('/search')
def search_buses():
    from_location = request.args.get('from', '')
    to_location = request.args.get('to', '')
    date = request.args.get('date', '')
    
    return render_template('search_results.html',
                         buses=FAKE_BUSES,
                         from_location=from_location,
                         to_location=to_location,
                         date=date)

@app.route('/bus/<bus_id>')
def bus_details(bus_id):
    bus = next((bus for bus in FAKE_BUSES if bus['id'] == bus_id), None)
    if not bus:
        flash('Bus not found', 'danger')
        return redirect(url_for('home'))
    
    return render_template('bus_details.html', bus=bus)

@app.route('/book_bus/<bus_id>', methods=['POST'])
def book_bus(bus_id):
    bus = next((bus for bus in FAKE_BUSES if bus['id'] == bus_id), None)
    if not bus:
        flash('Bus not found', 'danger')
        return redirect(url_for('home'))
    
    seats = int(request.form.get('seats', 1))
    name = request.form.get('name')
    email = request.form.get('email')
    phone = request.form.get('phone')
    payment_method = request.form.get('payment_method', 'upi')
    
    # Generate booking reference
    booking_ref = generate_booking_reference()
    
    # Calculate total amount
    total_amount = seats * bus['price']
    
    # Create booking data
    booking = {
        'booking_ref': booking_ref,
        'bus_id': bus_id,
        'bus_name': bus['name'],
        'passenger_name': name,
        'email': email,
        'phone': phone,
        'seats': seats,
        'total_amount': total_amount,
        'booking_date': datetime.now().strftime('%Y-%m-%d %H:%M'),
        'travel_date': datetime.now().strftime('%Y-%m-%d'),
        'departure_time': bus['departure_time'],
        'arrival_time': bus['arrival_time'],
        'payment_method': payment_method
    }
    
    return render_template('booking_receipt.html', booking=booking, bus=bus)

def generate_booking_reference():
    date = datetime.now()
    year = str(date.year)[-2:]
    month = str(date.month).zfill(2)
    day = str(date.day).zfill(2)
    random = str(int(date.timestamp() % 10000)).zfill(4)
    return f'BK{year}{month}{day}{random}'

@socketio.on('message')
def handle_message(message):
    message = message.lower()
    
    if any(word in message for word in ['hi', 'hello', 'hey']):
        response = CHATBOT_RESPONSES['greeting']
    elif any(word in message for word in ['search', 'find', 'bus', 'buses']):
        response = CHATBOT_RESPONSES['search_buses']
    elif any(word in message for word in ['price', 'cost', 'ticket']):
        response = CHATBOT_RESPONSES['ticket_price']
    elif any(word in message for word in ['payment', 'pay', 'upi', 'card']):
        response = CHATBOT_RESPONSES['payment_methods']
    elif any(word in message for word in ['cancel', 'refund']):
        response = CHATBOT_RESPONSES['cancel_booking']
    elif any(word in message for word in ['popular', 'routes', 'route']):
        response = CHATBOT_RESPONSES['popular_routes']
    else:
        response = CHATBOT_RESPONSES['default']
    
    emit('bot-response', response)

if __name__ == '__main__':
    socketio.run(app, debug=True) 