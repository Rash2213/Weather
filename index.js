function getWeatherEmoji(weatherId) {
    switch(true){
        case(weatherId >= 200 && weatherId < 300):
            return "🌩️";
        case(weatherId >= 300 && weatherId < 400):
            return "🌧️";
        case(weatherId >= 500 && weatherId < 600):
            return "🌧️";
        case(weatherId >= 600 && weatherId < 700):
            return "❄️";
        case(weatherId >= 700 && weatherId < 800):
            return "🌫️";
        case(weatherId === 800):
            return "☀️";
        case(weatherId >= 801 && weatherId < 900):
            return "☁️";
        default:
            return "?";
    }
}

async function getWeatherData(city) {
    const apiKey = "2021df9f17bd485a3b35ab192b4fc2a5";
    const apiurl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;
    const response = await fetch(apiurl);
    if(!response.ok){
        throw new Error("City not found or API error.");
    }
    return response.json();
}

function displayError(message, card) {
    if (!card) return; 
    const errorDisplay = document.createElement("p");
    errorDisplay.textContent = message;
    errorDisplay.classList.add("errorDisplay");
    card.textContent = "";
    card.style.display = "flex";
    card.appendChild(errorDisplay);
}

function displayWeatherInfo(data, card) {
    if (!card || !data || !data.name || !data.main || !data.main.temp) {
        if (card) card.textContent = "";
        return;
    }
    card.textContent = "";
    card.style.display = "flex";
    const cityDisplay = document.createElement("h1");
    cityDisplay.textContent = data.name;
    cityDisplay.classList.add("cityDisplay");
    card.appendChild(cityDisplay);

    const tempDisplay = document.createElement("p");
    tempDisplay.textContent = `Temperature: ${(data.main.temp - 273.15).toFixed(1)}°C`;
    tempDisplay.classList.add("tempDisplay");
    card.appendChild(tempDisplay);

    if (typeof data.main.humidity !== "undefined") {
        const humidityDisplay = document.createElement("p");
        humidityDisplay.textContent = `Humidity: ${data.main.humidity}%`;
        humidityDisplay.classList.add("humidityDisplay");
        card.appendChild(humidityDisplay);
    }

    if (Array.isArray(data.weather) && data.weather.length > 0) {
        const descDisplay = document.createElement("p");
        descDisplay.textContent = `Description: ${data.weather[0].description}`;
        descDisplay.classList.add("descDisplay");
        card.appendChild(descDisplay);

        const weatherEmojiDisplay = document.createElement("p");
        weatherEmojiDisplay.textContent = getWeatherEmoji(data.weather[0].id);
        card.appendChild(weatherEmojiDisplay);
    }

    if (Array.isArray(data.weather) && data.weather.length > 0) {
    showWeatherVideo(data.weather[0].id);
    }
}

function showWeatherVideo(weatherId) {
    const bgVideo = document.getElementById('bgVideo');
    const bgSource = document.getElementById('bgSource');
    if (!bgVideo || !bgSource) return;
    let videoFile = "Videos/startearth.mp4"; // default

    if (weatherId >= 200 && weatherId < 300) {
        videoFile = "Videos/Thunderstorm.mp4";
    } else if (weatherId >= 300 && weatherId < 400) {
        videoFile = "Videos/Drizzle.mp4";
    } else if (weatherId >= 500 && weatherId < 600) {
        videoFile = "Videos/Rain.mp4";
    } else if (weatherId >= 600 && weatherId < 700) {
        videoFile = "Videos/Snow.mp4";
    } else if (weatherId >= 700 && weatherId < 800) {
        videoFile = "Videos/Fog.mp4";
    } else if (weatherId === 800) {
        videoFile = "Videos/Sunny.mp4";
    } else if (weatherId >= 801) {
        videoFile = "Videos/Clouds.mp4";
    }

    if (bgSource.src.endsWith(videoFile)) return; // Already showing

    bgSource.src = videoFile;
    bgVideo.load();
    
    // Handle video play promise to prevent uncaught errors
    const playPromise = bgVideo.play();
    if (playPromise !== undefined) {
        playPromise.catch(error => {
            // Auto-play was prevented or interrupted
            console.log('Video play was prevented:', error);
        });
    }
}

// Browser-only code
if (typeof window !== "undefined" && typeof document !== "undefined") {
    const weatherForm = document.querySelector(".weatherForm");
    const cityInput = document.querySelector(".cityInput");
    const card = document.querySelector(".card");

    // Only add event listener if all elements exist
    if (weatherForm && cityInput && card) {
        weatherForm.addEventListener("submit", async event => {
            event.preventDefault();
            const city = cityInput.value;
            if(city){
                try{
                    const weatherData = await getWeatherData(city);
                    displayWeatherInfo(weatherData, card);
                }
                catch(error){
                    console.error(error);
                    displayError(error.message, card);
                }
            }
            else{
                displayError("Please enter a city name.", card);
            }
        });
    }
}

// Export for tests
if (typeof module !== "undefined" && typeof module.exports !== "undefined") {
    module.exports = { getWeatherEmoji, displayError, getWeatherData, displayWeatherInfo };
}