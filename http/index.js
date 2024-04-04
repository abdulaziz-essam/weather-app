const express = require('express');
const weatherStatisticsRoutes = require('./weatherStatisticsRoutes');
const weatherCityRoutes = require('./weatherCityRoutes');
const weatherBulkRoutes = require('./weatherBulkRoutes');
const mapRoutes = require('./map');
require('dotenv').config();
const app = express();
const port = 3000;
const bodyParser = require('body-parser');
// Middleware to enable CORS
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*'); // Allow requests from any origin
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS'); // Allow only GET, POST, and OPTIONS methods
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept'); // Allow specific headers
  next();
});
// S

app.use(bodyParser.json()); // Parse JSON bodies
app.use(bodyParser.urlencoded({ extended: true })); // Parse URL-encoded bodies
// Serve static files from 'public' directory
app.use(express.static('public'));
app.use(express.json());

app.use(weatherStatisticsRoutes);
app.use(weatherCityRoutes);
app.use(weatherBulkRoutes);
app.use(mapRoutes);
app.listen(port, () => console.log(`Example app listening on port ${port}!`));

// const axios = require('axios');






// const apiKey = process.env.WEATHER_API_KEY;

// // Middleware to parse JSON request body
// app.use(express.json());
// const NodeCache = require("node-cache");
// const cache = new NodeCache({ stdTTL: 3600 }); // Cache data for 1 hour (3600 seconds)

// app.get('/weather/statistics', async (req, res) => {

// });








// app.get('/weather/:city', async (req, res) => {
//     const city = req.params.city;
//     const cachedWeatherData = cache.get(city);

//     if (cachedWeatherData) {
//         console.log(`Weather data for ${city} found in cache.`);
//         res.json(cachedWeatherData);
//     } else {
//         const apiUrl = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}`;

//         try {
//             const response = await axios.get(apiUrl);
//             const weatherData = response.data;
//             cache.set(city, weatherData); // Cache the fetched weather data
//             console.log(`Weather data for ${city} cached successfully.`);
//             res.json(weatherData);
//         } catch (error) {
//             console.error('Error fetching weather data:', error.message);
//             res.status(500).json({ error: 'Failed to fetch weather data' });
//         }
//     }
// });

// app.post('/weather/bulk', async (req, res) => {
//     const cities = req.body.cities;
//     const weatherDataArray = [];
 
//     try {
//         for (const city of cities) {
//             const apiUrl = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}`;
//             const response = await axios.get(apiUrl);
//             const weatherData = response.data;
//             weatherDataArray.push(weatherData);
//         }
//         res.json(weatherDataArray);
//     } catch (error) {
//         console.error('Error fetching weather data:', error.message);
//         res.status(500).json({ error: 'Failed to fetch weather data for some cities' });
//     }
// });


// app.listen(port, () => console.log(`Example app listening on port ${port}!`));



// // var expressWs = require('express-ws')(app);



// //   // Regular GET route
// //   app.get('/', function(req, res, next){
// //     console.log('get route', req.testing);
// //     res.end();
// //   });
  
//   // WebSocket route
//   // app.ws('/web', function(ws, req) {
//   //   console.log('WebSocket connected');
    
//   //   // Handle incoming messages
//   //   ws.on('message', function(msg) {
//   //     console.log(msg);
//   //   });
  
//   //   // Handle WebSocket connection close
//   //   ws.on('close', function() {
//   //     console.log('WebSocket disconnected');
//   //     // Optionally handle cleanup tasks here
//   //   });
//   // });