const express = require('express');
const axios = require('axios');
const NodeCache = require("node-cache");
require('dotenv').config({ path: '../.env' });


const apiKey = process.env.WEATHER_API_KEY;

const router = express.Router();
const cache = new NodeCache({ stdTTL: 3600 });

router.get('/weather/statistics', async (req, res) => {
    try {
        const cities = ['Makkah', 'Madina', 'Riyadh', 'Jeddah', 'Taif', 'Dammam'];

        const fetchWeatherData = async (city) => {
            const apiUrl = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}`;
            const response = await axios.get(apiUrl);

            if (!response.data || typeof response.data !== 'object') {
                throw new Error(`Invalid response data for city: ${city}`);
            }

            const cityData = response.data;
            if (!cityData.location || !cityData.current || typeof cityData.current.temp_c !== 'number') {
                throw new Error(`Invalid data for city: ${city}`);
            }

            return {
                city: cityData.location.name,
                temperature: cityData.current.temp_c
            };
        };

        // Array to store weather data for each city
        const cityWeatherData = [];

        // Fetch weather data for each city
        for (const city of cities) {
            let weatherData = cache.get(city);

            if (!weatherData) {
                console.log(`Fetching weather data for ${city} from API...`);
                // Fetch weather data from API if not available in cache
                weatherData = await fetchWeatherData(city);
                cache.set(city, weatherData); // Cache the fetched weather data
            } else {
                console.log(`Weather data for ${city} found in cache.`);
            }

            cityWeatherData.push(weatherData);
        }

        if (cityWeatherData.length === 0) {
            throw new Error('No valid temperature data found');
        }

        // Calculate average temperature
        const totalTemperature = cityWeatherData.reduce((acc, city) => acc + city.temperature, 0);
        const averageTemperature = totalTemperature / cityWeatherData.length;

        // Find highest and lowest temperatures
        const highestTemperatureCity = cityWeatherData.reduce((prev, current) => (prev.temperature > current.temperature) ? prev : current);
        const lowestTemperatureCity = cityWeatherData.reduce((prev, current) => (prev.temperature < current.temperature) ? prev : current);

        res.json({
            averageTemperature,
            highestTemperature: highestTemperatureCity,
            lowestTemperature: lowestTemperatureCity,
            cityStatistics: cityWeatherData
        });
    } catch (error) {
        console.error('Error fetching weather data for statistics:', error.message);
        res.status(500).json({ error: 'Failed to fetch weather data for statistics' });
    }
});

module.exports = router;
