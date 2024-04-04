const express = require('express');
const axios = require('axios');
const NodeCache = require('node-cache');
require('dotenv').config({ path: '../.env' });

const apiKey = process.env.WEATHER_API_KEY;
const router = express.Router();
const cache = new NodeCache({ stdTTL: 3600 }); // Cache with a TTL of 1 hour

router.post('/weather/bulk', async (req, res) => {
    console.log('Request body:', req.body); // Log the entire request body

    const cities = Array.isArray(req.body.cities) ? req.body.cities : [];

    console.log('Type of cities:', typeof cities); // Log the type of cities

    const weatherDataArray = [];

    try {
        for (const city of cities) {
            let weatherData = cache.get(city); // Check if data is cached for the city

            if (!weatherData) {
                // If data is not cached, fetch from the API
                const apiUrl = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}`;
                console.log('API URL:', apiUrl); // Log the API URL being requested
                const response = await axios.get(apiUrl);
                weatherData = response.data;
                // Cache the fetched weather data with the city name as the key
                cache.set(city, weatherData);
            } else {
                console.log('Data fetched from cache for city:', city);
            }

            console.log('Response data:', weatherData); // Log the response data
            weatherDataArray.push(weatherData);
        }
        res.json(weatherDataArray);
    } catch (error) {
        console.error('Error fetching weather data:', error.message);
        res.status(500).json({ error: 'Failed to fetch weather data for some cities' });
    }
});

module.exports = router;
