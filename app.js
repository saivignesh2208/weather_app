import express from "express";
import axios from "axios";
import bodyparser from "body-parser";
import { config } from './config.js';

const app=express();
const port = 3000;
const key = config.WEATHER_API_KEY;
app.use(express.urlencoded({ extended: true }));

app.use(express.static("public"));

app.get("/",(req,res)=>{
    res.render("index.ejs");
});
app.get("/getdata", async (req, res) => {
    const location = req.query.location; // Use req.query for GET requests
    if (!location) {
        return res.status(400).send("Location is required");
    }

    try {
        const geo_url = `http://api.weatherapi.com/v1/current.json?key=${key}&q=${location}`;
        const response = await axios.get(geo_url); // Fetch weather data
        const locData = response.data; // Weather data

        // Extract relevant data to pass to the view
        const weatherData = {
            location: locData.location.name,
            region: locData.location.region,
            country: locData.location.country,
            tempC: locData.current.temp_c,
            feelsLike: locData.current.feelslike_c,
            humidity: locData.current.humidity,
            condition: locData.current.condition.text,
            uv: locData.current.uv,
            icon: locData.current.condition.icon, // Icon for weather condition
            windSpeed: locData.current.wind_kph, // Wind speed in Km/h
            pressure: locData.current.pressure_mb // Pressure in hPa
        };

        console.log(weatherData); // Log the extracted weather data for debugging

        // Render the data in the EJS view
        res.render("index2.ejs", { weather: weatherData });

    } catch (error) {
        console.error(error);
        res.status(500).send("Error fetching weather data");
    }
});
app.listen(port,()=>{
    console.log("app is listening on 3000");
});