
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
const recentCitiesContainer = document.getElementById("recentCitiesContainer");



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
        fetchForecast(city);
        saveRecentCity(city);
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
            fetchForecast(data.name);
            saveRecentCity(data.name);
        } catch(err){
            showError("Unable to get weather for your location");
        }
    });
}

// Function to fetch 5-day forecast
async function fetchForecast(city) {
    try{
        const res=await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`);

        if(!res.ok)
            throw new Error("Could not fetch forecast data");

        const data=await res.json();

        // Fiter: take only one forecast per day around noon
        const forecasts=data.list.filter(item=>item.dt_txt.includes("12:00:00"));
        displayForecast(forecasts);
        forecastSection.classList.remove("hidden");
    } catch(error){
        showError("Forecast error:" + error.message);
    } 
}

// Function to display 5-day forecast in cards
function displayForecast(list){
    const container=document.getElementById("forecastContainer");
    container.innerHTML="";

    list.forEach(item => {
        const div=document.createElement("div");
        div.className="bg-cyan-100 rounded-lg p-4 shadow";

        const date=item.dt_txt.split(" ")[0];
        const icon=item.weather[0].icon;
        const iconUrl=`https://openweathermap.org/img/wn/${icon}@2x.png`;

        div.innerHTML=`
        <p class="font-semibold">${date}</p>
        <img src="${iconUrl}" alt="${item.weather[0].description}" class="mx-auto w-12">
        <p><i class="fa-solid fa-temperature-half text-cyan-800"></i>Temp: ${item.main.temp}&deg;C</p>
      <p><i class="fa-solid fa-droplet text-cyan-800"></i>Humidity: ${item.main.humidity}%</p>
      <p><i class="fa-solid fa-wind text-cyan-800"></i>wind: ${item.wind.speed} m/s</p>
        `;
        container.appendChild(div);
    });
}


// Function to save recent cities in localstorage
function saveRecentCity(city){
    let cities=JSON.parse(localStorage.getItem("recentCities")) || [];

    if(!cities.includes(city)){
        cities.push(city);
        localStorage.setItem("recentCities",JSON.stringify(cities));
    }
    updateRecentDropdown();
}


// Function to load recent cities into dropdown
function updateRecentDropdown() {
  const cities = JSON.parse(localStorage.getItem("recentCities")) || [];

  if (cities.length === 0) {
    recentCitiesContainer.classList.add("hidden");
    return;
  }

  recentCities.innerHTML = `<option disabled selected>Select a city</option>`;

  cities.forEach(city => {
    const opt = document.createElement("option");
    opt.textContent = city;
    opt.value = city;
    recentCities.appendChild(opt);
  });

  recentCitiesContainer.classList.remove("hidden");
}

// Event listener for recent cities
recentCities.addEventListener("change",(e)=>{
    fetchWeather(e.target.value);
});


// Calling updateRecentDropdown function on load 
window.onload=updateRecentDropdown;