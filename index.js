const express = require("express");
const app = express();
const path = require('path');

app.set('views', path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(express.static('public'));

app.listen(8080, () => {
    console.log("Server is running on port 8080");
});

const API_URL = "https://api.openweathermap.org/data/2.5/weather";
const API_KEY = "d2f3f3849ca06481632a71c1c16c9239";

// let city = "kanyakumari";

let getWeatherInfo = async (city) => {
    try {
        let response = await fetch(`${API_URL}?q=${city}&appid=${API_KEY}&units=metric`);
        let data = await response.json();
        console.log(data);
        let result = {
            city: city,
            temp: data.main.temp,
            tempMin: data.main.temp_min,
            tempMax: data.main.temp_max,
            humidity: data.main.humidity,
            feelsLike: data.main.feels_like,
            wind : data.wind.speed,
            weather: data.weather[0].description,
            imgUrl: data.main.humidity>70 ? "/img/rain.jpg" : data.main.temp>15 ? "/img/summer.jpg": "/img/cold.jpg"
        };
        console.log(result.imgUrl)
        return result;
    } catch (err) {
        console.error(err);
        return null;
    }
};

app.get("/home/weather", async (req, res) => {
    try {
        const city = req.query.city;
        let result = await getWeatherInfo(city);
        console.log(result);

        if (result) {
            res.render("index", { result });
        } else {
            res.render("error", { message: "Failed to retrieve weather data" });
        }
    } catch (err) {
        console.error(err);
        res.status(500).send("Server Error");
    }
});

app.get('/home', (req, res) => {
    res.render("home")
});