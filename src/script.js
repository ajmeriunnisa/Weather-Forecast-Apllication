
// OpenWeatherMap API Key
const API_KEY = "7631e2ed1cff814273ba939280f5dda1";


//Get DOM elements
const searchBtn = document.getElementById("searchBtn");
const currentBtn = document.getElementById("currentBtn");
const cityInput = document.getElementById("cityInput");
const errorMsg = document.getElementById("errorMsg");
const weatherInfo = document.getElementById("weatherInfo");
const forecastSection = document.getElementById("forecastSection");
const forecastContainer = document.getElementById("forecastContainer");
const recentCities = document.getElementById("recentCities");


//When search button in clicked
searchBtn.addEventListener("click", () => {
    const city = cityInput.value.trim();
    if (city) {
        fetchWeather(city);
    } else {
        showError("Please enter a city name");
    }
});


function showError(msg){
    errorMsg.textContent=msg;
    errorMsg.classList.remove("hidden");
}

function clearError(){
    errorMsg.textContent="";
    errorMsg.classList.add("hidden");
}