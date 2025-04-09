// Socket.IO Connection
const socket = io('http://localhost:5000', {
    transports: ['websocket']
});

socket.on('connect', () => {
    console.log('Connected to server');
});

socket.on('disconnect', () => {
    console.log('Disconnected from server');
});

// Chatbot Functionality
const chatbot = document.getElementById('chatbot');
const chatbotMessages = document.getElementById('chatbot-messages');
const chatbotForm = document.getElementById('chatbot-form');
const chatbotInput = document.getElementById('chatbot-message');
const chatbotFab = document.getElementById('chatbot-fab');
const chatbotToggle = document.getElementById('chatbot-toggle');

function toggleChatbot() {
    chatbot.classList.toggle('active');
    if (chatbot.classList.contains('active')) {
        chatbotInput.focus();
    }
}

chatbotFab.addEventListener('click', toggleChatbot);
chatbotToggle.addEventListener('click', toggleChatbot);

chatbotForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const message = chatbotInput.value.trim();
    if (message) {
        addMessage(message, 'user');
        socket.emit('message', message);
        chatbotInput.value = '';
    }
});

socket.on('bot-response', (response) => {
    addMessage(response, 'bot');
});

function addMessage(text, sender) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `chatbot-message ${sender}`;
    messageDiv.textContent = text;
    chatbotMessages.appendChild(messageDiv);
    chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
}

// Seat Selection
document.querySelectorAll('.seat').forEach(seat => {
    if (!seat.classList.contains('booked')) {
        seat.addEventListener('click', () => {
            seat.classList.toggle('selected');
            updateSelectedSeats();
        });
    }
});

function updateSelectedSeats() {
    const selectedSeats = document.querySelectorAll('.seat.selected');
    const seatNumbers = Array.from(selectedSeats).map(seat => seat.dataset.seatNumber);
    const totalAmount = seatNumbers.length * parseFloat(document.getElementById('fare').value || 0);
    
    document.getElementById('selected-seats').value = seatNumbers.join(',');
    document.getElementById('total-amount').textContent = totalAmount.toFixed(2);
}

// Print Receipt
function printReceipt() {
    window.print();
}

// Form Validation
document.querySelectorAll('form').forEach(form => {
    form.addEventListener('submit', (e) => {
        if (!form.checkValidity()) {
            e.preventDefault();
            e.stopPropagation();
        }
        form.classList.add('was-validated');
    });
}); 