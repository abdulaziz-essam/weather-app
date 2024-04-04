const WebSocket = require('ws');

const socket = new WebSocket('ws://localhost:3333');

socket.on('open', () => {
    console.log('Connected to WebSocket server');

    // Sending an array of city names to subscribe for live updates
    const cities =  ['Makkah', 'Madina', 'Riyadh', 'Jeddah', 'Taif', 'Dammam'];
    socket.send(JSON.stringify(cities));
});

socket.on('message', (data) => {
    const weatherData = JSON.parse(data);
    console.log('Received live weather data:', weatherData);
});

socket.on('close', () => {
    console.log('Disconnected from WebSocket server');
});
