const axios = require('axios');
const express = require('express');
const http = require('http');
const WebSocket = require('ws');
require('dotenv').config({ path: '../.env' });
const app = express();
const port = 3333;

// Create HTTP server with Express app
const server = http.createServer(app);

// Create WebSocket server
const wss = new WebSocket.Server({ server });

// Array to store city names for live updates
let liveCities = [];

// WeatherAPI key
const apiKey = process.env.WEATHER_API_KEY;;

// Function to fetch weather data for a single city from WeatherAPI
async function fetchWeatherData(city) {
    try {
        const apiUrl = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}`;
        const response = await axios.get(apiUrl);
        return response.data;
    } catch (error) {
        console.error(`Error fetching weather data for ${city}:`, error);
        return null;
    }
}

// Function to send live updates to connected clients
async function sendLiveUpdates() {
    const promises = liveCities.map(async (city) => {
        const weatherData = await fetchWeatherData(city);
        if (weatherData) {
            wss.clients.forEach((client) => {
                if (client.readyState === WebSocket.OPEN) {
                    client.send(JSON.stringify(weatherData));
                }
            });
        }
    });
    await Promise.all(promises);
}

// Interval for periodic updates (every 10 seconds)
const updateInterval = setInterval(sendLiveUpdates, 10000);

// WebSocket server connection handling
// WebSocket server connection handling
wss.on('connection', (ws) => {
    console.log('A new client connected');

    // Handle incoming messages (if any)
    ws.on('message', (message) => {
        console.log('Received message:', message);
        try {
            // Assuming the client sends an array of city names to subscribe for live updates
            liveCities = JSON.parse(message);
            console.log('Subscribed cities:', liveCities);
        } catch (error) {
            console.error('Invalid message format:', error);
        }
    });

    // Handle WebSocket client disconnection
    ws.on('close', () => {
        console.log('WebSocket client disconnected');
    });
});

// Middleware to parse JSON request body
app.use(express.json());

server.listen(port, () => console.log(`Example app listening on port ${port}!`));
