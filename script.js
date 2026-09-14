// ===============================
// Get HTML Elements
// ===============================

const cityInput = document.getElementById("cityInput");
const searchButton = document.getElementById("searchButton");
const locationButton = document.getElementById("locationButton");

const cityName = document.getElementById("cityName");
const temperature = document.getElementById("temperature");
const description = document.getElementById("description");

const humidity = document.getElementById("humidity");
const wind = document.getElementById("wind");

const weatherIcon = document.getElementById("weatherIcon");

const loadingMessage = document.getElementById("loadingMessage");
const errorMessage = document.getElementById("errorMessage");
const lastSearch = document.getElementById("lastSearch");


// ===============================
// Search Button
// ===============================

searchButton.addEventListener("click", function () {

    const city = cityInput.value.trim();

    if (city === "") {

        showError("Please enter a city name.");

        return;
    }

    getWeather(city);

});


// ===============================
// Enter Key Search
// ===============================

cityInput.addEventListener("keydown", function (event) {

    if (event.key === "Enter") {

        searchButton.click();

    }

});


// ===============================
// Get Weather By City
// ===============================

async function getWeather(city) {

    showLoading(true);

    clearError();


    try {

        // Get city coordinates

        const locationResponse =
            await fetch(
                `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`
            );


        if (!locationResponse.ok) {

            throw new Error("Location request failed.");

        }


        const locationData =
            await locationResponse.json();


        if (
            !locationData.results ||
            locationData.results.length === 0
        ) {

            throw new Error("City not found.");

        }


        const location =
            locationData.results[0];


        const latitude =
            location.latitude;

        const longitude =
            location.longitude;


        // Get weather data

        const weatherResponse =
            await fetch(
                `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code&timezone=auto`
            );


        if (!weatherResponse.ok) {

            throw new Error("Weather request failed.");

        }


        const weatherData =
            await weatherResponse.json();


        const current =
            weatherData.current;


        // Display data

        cityName.textContent =
            `${location.name}, ${location.country}`;


        temperature.textContent =
            `${current.temperature_2m}°C`;


        humidity.textContent =
            current.relative_humidity_2m;


        wind.textContent =
            current.wind_speed_10m;


        description.textContent =
            getWeatherDescription(
                current.weather_code
            );


        weatherIcon.textContent =
            getWeatherIcon(
                current.weather_code
            );


        // Save last searched city

        localStorage.setItem(
            "lastCity",
            location.name
        );


        lastSearch.textContent =
            `Last searched: ${location.name}`;


    }

    catch (error) {

        console.error(error);

        showError(
            error.message === "City not found."
                ? "City not found. Please check the spelling."
                : "Unable to get weather. Please check your internet connection."
        );

    }


    finally {

        showLoading(false);

    }

}


// ===============================
// Current Location
// ===============================

locationButton.addEventListener(
    "click",
    function () {

        clearError();

        showLoading(true);


        if (!navigator.geolocation) {

            showLoading(false);

            showError(
                "Your browser does not support location."
            );

            return;

        }


        navigator.geolocation.getCurrentPosition(

            function (position) {

                const latitude =
                    position.coords.latitude;

                const longitude =
                    position.coords.longitude;


                getWeatherByCoordinates(
                    latitude,
                    longitude
                );

            },

            function () {

                showLoading(false);

                showError(
                    "Location permission was denied."
                );

            }

        );

    }
);


// ===============================
// Weather By Coordinates
// ===============================

async function getWeatherByCoordinates(
    latitude,
    longitude
) {

    try {

        const response =
            await fetch(
                `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code&timezone=auto`
            );


        if (!response.ok) {

            throw new Error("Weather request failed.");

        }


        const data =
            await response.json();


        const current =
            data.current;


        // Reverse geocoding

        const locationResponse =
            await fetch(
                `https://geocoding-api.open-meteo.com/v1/search?name=Mumbai&count=1&language=en&format=json`
            );


        cityName.textContent =
            "Your Location";


        temperature.textContent =
            `${current.temperature_2m}°C`;


        humidity.textContent =
            current.relative_humidity_2m;


        wind.textContent =
            current.wind_speed_10m;


        description.textContent =
            getWeatherDescription(
                current.weather_code
            );


        weatherIcon.textContent =
            getWeatherIcon(
                current.weather_code
            );


        lastSearch.textContent =
            "Weather for your current location";


    }

    catch (error) {

        console.error(error);

        showError(
            "Unable to get weather for your location."
        );

    }

    finally {

        showLoading(false);

    }

}


// ===============================
// Weather Description
// ===============================

function getWeatherDescription(code) {

    if (code === 0) {
        return "Clear sky";
    }

    if (code === 1) {
        return "Mainly clear";
    }

    if (code === 2) {
        return "Partly cloudy";
    }

    if (code === 3) {
        return "Overcast";
    }

    if (code === 45 || code === 48) {
        return "Fog";
    }

    if (code >= 51 && code <= 57) {
        return "Drizzle";
    }

    if (code >= 61 && code <= 67) {
        return "Rain";
    }

    if (code >= 71 && code <= 77) {
        return "Snow";
    }

    if (code >= 80 && code <= 82) {
        return "Rain showers";
    }

    if (code >= 85 && code <= 86) {
        return "Snow showers";
    }

    if (code >= 95 && code <= 99) {
        return "Thunderstorm";
    }

    return "Unknown weather";

}


// ===============================
// Weather Icon
// ===============================

function getWeatherIcon(code) {

    if (code === 0) {
        return "☀️";
    }

    if (code === 1 || code === 2) {
        return "🌤️";
    }

    if (code === 3) {
        return "☁️";
    }

    if (code === 45 || code === 48) {
        return "🌫️";
    }

    if (code >= 51 && code <= 67) {
        return "🌧️";
    }

    if (code >= 71 && code <= 77) {
        return "❄️";
    }

    if (code >= 80 && code <= 82) {
        return "🌦️";
    }

    if (code >= 85 && code <= 86) {
        return "🌨️";
    }

    if (code >= 95 && code <= 99) {
        return "⛈️";
    }

    return "🌡️";

}


// ===============================
// Loading
// ===============================

function showLoading(isLoading) {

    if (isLoading) {

        loadingMessage.textContent =
            "Loading weather...";

        searchButton.disabled = true;
        locationButton.disabled = true;

    }

    else {

        loadingMessage.textContent = "";

        searchButton.disabled = false;
        locationButton.disabled = false;

    }

}


// ===============================
// Error
// ===============================

function showError(message) {

    errorMessage.textContent =
        message;

}


// ===============================
// Clear Error
// ===============================

function clearError() {

    errorMessage.textContent = "";

}


// ===============================
// Load Last City
// ===============================

const savedCity =
    localStorage.getItem("lastCity");


if (savedCity) {

    cityInput.value =
        savedCity;

    getWeather(savedCity);

}