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
const app = firebase.initializeApp(firebaseConfig);

// Weather API configuration
const weatherApi = {
    key: '9f23b56e8dcad8299bf4e5a2a3fc932b',
    baseUrl: 'https://api.openweathermap.org/data/2.5/weather'
};

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/service-worker.js')
            .then(registration => {
                console.log('ServiceWorker registration successful with scope: ', registration.scope);
            })
            .catch(err => {
                console.log('ServiceWorker registration failed: ', err);
            });
    });
}

document.addEventListener('DOMContentLoaded', () => {
    let searchInputBox = document.getElementById('input-box');
    let searchButton = document.getElementById('search-button');

    searchInputBox.addEventListener('keypress', (event) => {
        if (event.keyCode === 13) {
            getWeatherReport(searchInputBox.value);
        }
    });

    searchButton.addEventListener('click', () => {
        getWeatherReport(searchInputBox.value);
    });

    let viewButton = document.getElementById('view-button');
    viewButton.addEventListener('click', () => {
        window.location.href = 'viewData.html';
    });
});

async function getWeatherReport(city) {
    try {
        const response = await fetch(`${weatherApi.baseUrl}?q=${city}&appid=${weatherApi.key}&units=metric`);
        const weather = await response.json();
        if (weather.cod === '400') {
            showAlert('Empty Input', 'Please enter any city', 'error');
        } else if (weather.cod === '404') {
            showAlert('Bad Input', 'Entered city didn\'t match', 'warning');
        } else {
            var database = app.database();
            database.ref('weatherData').push({
                city: weather.name,
                country: weather.sys.country,
                temperature: Math.floor(weather.main.temp_min),
                weather: weather.weather[0].main,
                minTemperature: Math.floor(weather.main.temp_min),
                maxTemperature: Math.ceil(weather.main.temp_max),
                feelsLike: weather.main.feels_like,
                humidity: weather.main.humidity,
                pressure: weather.main.pressure,
                windSpeed: weather.wind.speed,
                timestamp: firebase.database.ServerValue.TIMESTAMP
            });

            // Display notification
            displayNotification('Data Added Successfully', '');

            // ... (your existing code)
        }
    } catch (error) {
        console.error('Error fetching weather data:', error);
    }
    resetInput();
}

function displayWeatherReport(weather) {
    // ... (your existing code)
}

function resetInput() {
    searchInputBox.value = '';
}

function showAlert(title, message, type) {
    Swal.fire(title, message, type);
}

let viewButton = document.getElementById('view-button');
viewButton.addEventListener('click', () => {
    window.location.href = 'viewData.html';
});

function displayNotification(title, body) {
    if (!("Notification" in window)) {
        console.log("This browser does not support system notifications");
        return;
    }

    if (Notification.permission === "granted") {
        var notification = new Notification(title, { body: body });
    } else if (Notification.permission !== 'denied') {
        Notification.requestPermission().then(permission => {
            if (permission === 'granted') {
                var notification = new Notification(title, { body: body });
            }
        });
    }
}
