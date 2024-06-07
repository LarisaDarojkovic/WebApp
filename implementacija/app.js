const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const { getFlights, createPayment } = require('./database');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

app.get('/results', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'results.html'));
});

app.get('/payment', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'payment.html'));
});

app.get('/api/flights', async (req, res) => {
    const { origin, destination, date } = req.query;
    const flights = await getFlights(origin, destination, date);
    res.json({ flights });
});

app.post('/api/payment', async (req, res) => {
    const { flightId, cardholderName, cardNumber, expiryDate, cvv, billingAddress } = req.body;
    const paymentData = { flightId, cardholderName, cardNumber, expiryDate, cvv, billingAddress };
    const success = await createPayment(paymentData);
    res.json({ success });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
app.get('/confirmation', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'confirmation.html'));
});
