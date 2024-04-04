const express = require('express');
const axios = require('axios');
const apiKey = process.env.WEATHER_API_KEY;
const router = express.Router();
const NodeCache = require("node-cache");
const cache = new NodeCache({ stdTTL: 3600 });

router.get('/weather/:city', async (req, res) => {
    const city = req.params.city;
    const cachedWeatherData = cache.get(city);

    if (cachedWeatherData) {
        console.log(`Weather data for ${city} found in cache.`);
        res.json(cachedWeatherData);
    } else {
        const apiUrl = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}`;

        try {
            const response = await axios.get(apiUrl);
            const weatherData = response.data;
            cache.set(city, weatherData); // Cache the fetched weather data
            console.log(`Weather data for ${city} cached successfully.`);
            res.json(weatherData);
        } catch (error) {
            console.error('Error fetching weather data:', error.message);
            res.status(500).json({ error: 'Failed to fetch weather data' });
        }
    }
});

module.exports = router;
