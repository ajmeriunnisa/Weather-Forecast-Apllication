
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


// Function to show and clear error messages
function showError(msg) {
    errorMsg.textContent = msg;
    errorMsg.classList.remove("hidden");
}

function clearError() {
    errorMsg.textContent = "";
    errorMsg.classList.add("hidden");
}


// Function to fetch current weather for a city
async function fetchWeather(city) {
    try {
        clearError();
        
        const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=mtric`);
        
        if (!res.ok) {
            throw new Error("City Not Found");
        }

        const data = await res.json();
        updateWeatherUI(data);
        // fetchForecast(city);
        // saveRecentCity(city);
    } catch (error) {
        showError(error.message)
    }
}


// Function to update the weather section
function updateWeatherUI(data){
    document.getElementById("location").textContent=data.name;
    document.getElementById("temperature").textContent=data.main.temp;
    document.getElementById("condition").textContent=data.weather[0].description;
    document.getElementById("humidity").textContent=data.main.humidity;
    document.getElementById("wind").textContent=data.wind.speed;

    weatherInfo.classList.remove("hidden");
}


// Event listener for current location button
currentBtn.addEventListener("click",getLocationWeather);

function getLocationWeather(){
    if(!navigator.geolocation){
        showError("Geolocation is not supported by your browser");
        return;
    }

    navigator.geolocation.getCurrentPosition(async position => {
        const{latitude,longitude}=position.coords;
        
        try{
            const res=await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`);

            const data=await res.json();
            updateWeatherUI(data);
        } catch(err){
            showError("Unable to get weather for your location");
        }
    });
}