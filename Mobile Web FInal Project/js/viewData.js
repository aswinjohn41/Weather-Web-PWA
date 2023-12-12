// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDxHhPpj0Ponr7MjzvF6WhVR6xZ2eV4uWE",
    authDomain: "proj2-da404.firebaseapp.com",
    databaseURL: "https://proj2-da404-default-rtdb.firebaseio.com",
    projectId: "proj2-da404",
    storageBucket: "proj2-da404.appspot.com",
    messagingSenderId: "47776761825",
    appId: "1:47776761825:web:015aea350ead3a8efe74a0"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Reference to the database
const database = firebase.database();
const weatherDataRef = database.ref('weatherData');

// Reference to the HTML element where you want to display the data
const weatherDataContainer = document.getElementById('weather-data');

// Fetch data from Firebase and display it as a list
weatherDataRef.on('value', (snapshot) => {
    // Clear previous data
    weatherDataContainer.innerHTML = '';

    // Check if there is any data in the snapshot
    if (snapshot.exists()) {
        // Add the "SAVED DATA" heading
        weatherDataContainer.innerHTML = '<h2>SAVED DATA</h2>';

        // Iterate through the data and create list items
        snapshot.forEach((childSnapshot) => {
            const weatherItem = childSnapshot.val();
            const listItem = document.createElement('li');

            // Customize the HTML structure based on your data
            listItem.innerHTML = `
                <strong>${weatherItem.city}, ${weatherItem.country}</strong><br>
                Temperature: ${weatherItem.temperature}&deg;C<br>
                Weather: ${weatherItem.weather}<br>
                Min Temperature: ${weatherItem.minTemperature}&deg;C<br>
                Max Temperature: ${weatherItem.maxTemperature}&deg;C<br>
                Feels Like: ${weatherItem.feelsLike}&deg;C<br>
                Humidity: ${weatherItem.humidity}%<br>
                Pressure: ${weatherItem.pressure} mb<br>
                Wind Speed: ${weatherItem.windSpeed} KMPH<br>
                Timestamp: ${new Date(weatherItem.timestamp).toLocaleString()}<br>
                <hr>
            `;

            // Append the list item to the container
            weatherDataContainer.appendChild(listItem);
        });
    } else {
        // Display a message when there is no data
        weatherDataContainer.innerHTML = '<p>No weather data available.</p>';
    }
});

// Handle back button click
const backButton = document.getElementById('back-button');
backButton.addEventListener('click', () => {
    // Redirect back to the main page
    window.location.href = 'index.html';
});
