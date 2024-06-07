const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database(':memory:');

db.serialize(() => {
    db.run(`CREATE TABLE flights (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        flight_number TEXT,
        origin TEXT,
        destination TEXT,
        departure_time TEXT,
        arrival_time TEXT,
        date TEXT,
        price REAL
    )`);

    db.run(`CREATE TABLE payments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        cardholder_name TEXT,
        card_number TEXT,
        expiry_date TEXT,
        cvv TEXT,
        billing_address TEXT
    )`);

    const stmt = db.prepare("INSERT INTO flights (flight_number, origin, destination, departure_time, arrival_time, date, price) VALUES (?, ?, ?, ?, ?, ?, ?)");
    stmt.run("RY123", "New York", "London", "08:00", "20:00", "2024-06-15", 500);
    stmt.run("RY456", "Paris", "Tokyo", "09:00", "23:00", "2024-06-15", 700);
    stmt.finalize();
});

const getFlights = (origin, destination, date) => {
    return new Promise((resolve, reject) => {
        db.all(`SELECT * FROM flights WHERE origin = ? AND destination = ? AND date = ?`, [origin, destination, date], (err, rows) => {
            if (err) {
                reject(err);
            } else {
                resolve(rows);
            }
        });
    });
};

const createPayment = (paymentData) => {
    return new Promise((resolve, reject) => {
        const { flightId, cardholderName, cardNumber, expiryDate, cvv, billingAddress } = paymentData;
        db.run(`INSERT INTO payments (flight_id, cardholder_name, card_number, expiry_date, cvv, billing_address) VALUES (?, ?, ?, ?, ?, ?)`,
            [flightId, cardholderName, cardNumber, expiryDate, cvv, billingAddress],
            function(err) {
                if (err) {
                    reject(err);
                } else {
                    resolve(true);
                }
            });
    });
};

module.exports = {
    getFlights,
    createPayment
};
