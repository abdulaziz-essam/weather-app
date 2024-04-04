const express = require('express');
const axios = require('axios');
const router = express.Router();

const googleAPIKey = process.env.GOOGLE_API_KEY;
const openweathermapAPIKey = process.env.OPEN_WEATHER_API;

router.get('/live', async (req, res) => {
    try {
        const country = req.query.country;
        console.log('Requested country: ', country);

        if (!country) {
            return res.status(400).send('Country parameter is missing');
        }

        // Make a request to the geocoding API to get coordinates for the country
        const geocodingResponse = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${country}&key=${googleAPIKey}`);
        console.log('Geocoding API response:', geocodingResponse.data);

        const location = geocodingResponse.data.results[0]?.geometry?.location;
        if (!location) {
            return res.status(404).send('Location not found for the specified country');
        }

        console.log('Location:', location);

        // Make a request to the weather API to get weather data for the coordinates
        const weatherResponse = await axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${location.lat}&lon=${location.lng}&appid=${openweathermapAPIKey}`);
        const weatherData = weatherResponse.data;

        res.json(weatherData);
    } catch (error) {
        console.error('Error fetching weather data:', error);
        res.status(500).send('Error fetching weather data');
    }
});

module.exports = router;
