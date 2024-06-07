document.addEventListener('DOMContentLoaded', () => {
    const searchForm = document.getElementById('searchForm');
    const resultsContainer = document.getElementById('results');
    const paymentForm = document.getElementById('paymentForm');

    if (searchForm) {
        searchForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const origin = document.getElementById('origin').value;
            const destination = document.getElementById('destination').value;
            const departureDate = document.getElementById('departure-date').value;

            fetch(`/api/flights?origin=${origin}&destination=${destination}&date=${departureDate}`)
                .then(response => response.json())
                .then(data => {
                    resultsContainer.innerHTML = '';
                    if (data.flights.length > 0) {
                        data.flights.forEach(flight => {
                            const flightDiv = document.createElement('div');
                            flightDiv.classList.add('flight');
                            flightDiv.id = `flight-${flight.id}`;
                            flightDiv.innerHTML = `
                                <p>Flight Number: ${flight.flight_number}</p>
                                <p>Origin: ${flight.origin}</p>
                                <p>Destination: ${flight.destination}</p>
                                <p>Departure: ${flight.departure_time}</p>
                                <p>Arrival: ${flight.arrival_time}</p>
                                <p>Date: ${flight.date}</p>
                                <p>Price: $${flight.price}</p>
                                <label for="num-passengers">Number of Passengers:</label>
                                <input type="number" id="num-passengers-${flight.id}" name="num-passengers" min="1" value="1">
                                <button onclick="selectFlight(${flight.id})">Select</button>
                            `;
                            resultsContainer.appendChild(flightDiv);
                        });
                    } else {
                        resultsContainer.textContent = 'No flights found';
                    }
                });
        });
    }

    if (paymentForm) {
        paymentForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const urlParams = new URLSearchParams(window.location.search);
            const flightId = urlParams.get('flightId');
            const numPassengers = urlParams.get('numPassengers');
            const cardholderName = document.getElementById('cardholder-name').value;
            const cardNumber = document.getElementById('card-number').value;
            const expiryDate = document.getElementById('expiry-date').value;
            const cvv = document.getElementById('cvv').value;
            const billingAddress = document.getElementById('billing-address').value;

            const paymentData = {
                flightId,
                cardholderName,
                cardNumber,
                expiryDate,
                cvv,
                billingAddress,
                numPassengers
            };

            fetch('/api/payment', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(paymentData)
            })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        window.location.href = '/confirmation';
                    } else {
                        alert('Payment failed. Please try again.');
                    }
                });
        });
    }
});

function selectFlight(flightId) {
    const numPassengers = document.querySelector(`#num-passengers-${flightId}`).value;
    window.location.href = `/payment?flightId=${flightId}&numPassengers=${numPassengers}`;
}
