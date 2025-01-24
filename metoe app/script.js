const apikey = '0b9dfbdb4bc0c11efff1e9376901009b';
const apiurl = 'https://api.openweathermap.org/data/2.5/weather';

const locationInput = document.getElementById('locationInput');
const searchButton = document.getElementById('searchButton');
const locationElement = document.getElementById('location');
const temperatureElement = document.getElementById('temperature');
const descriptionElement = document.getElementById('description');
const humidityElement = document.getElementById('humidity');
const windDirectionElement = document.getElementById("windDirection");
const weatherIcon = document.getElementById('weatherIcon');
const addToFavoritesButton = document.getElementById('addToFavorites');
const favoritesList = document.getElementById('favorites');

let favorites = JSON.parse(localStorage.getItem('favorites')) || [];

searchButton.addEventListener('click', () => {
    const location = locationInput.value;
    if (location) {
        fetchWeather(location);
    }
});

addToFavoritesButton.addEventListener('click', () => {
    const location = locationElement.textContent;
    const temperature = temperatureElement.textContent;

    if (location && !favorites.some(fav => fav.city === location)) {
        favorites.push({ city: location, temperature });
        saveFavorites();
        updateFavoritesUI();
    }
});

function fetchWeather(location) {
    const url = `${apiurl}?q=${location}&appid=${apikey}&units=metric`;

    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('City not found or invalid request');
            }
            return response.json();
        })
        .then(data => {
            locationElement.textContent = data.name;
            temperatureElement.textContent = `${Math.round(data.main.temp)}`;
            descriptionElement.textContent = data.weather[0].description;
            humidityElement.textContent = `Humidity: ${data.main.humidity}%`;
            windDirectionElement.textContent = `Wind speed: ${data.wind.speed} km/h`;
            weatherIcon.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
            weatherIcon.alt = data.weather[0].description;
        })
        .catch(error => {
            console.error('Error fetching weather data:', error);
            alert('Error fetching weather data. Please try again.');
        });
}
function updateFavoritesUI() {
    favoritesList.innerHTML = ''; 

    favorites.forEach(fav => {
        
        const li = document.createElement('li');
        li.textContent = `${fav.city} - ${fav.temperature}°C`;

       
        const showDetailsButton = document.createElement('button');
        showDetailsButton.innerHTML = "<box-icon name='show-alt'></box-icon>";
        showDetailsButton.classList.add('details-button');
        showDetailsButton.addEventListener('click', () => fetchWeather(fav.city));

    
        const removeButton = document.createElement('button');
        removeButton.classList.add('remove-button');
        removeButton.innerHTML = "<box-icon name='trash'></box-icon>";

        removeButton.addEventListener('click', () => removeFavorite(fav.city));
        li.appendChild(showDetailsButton);
        li.appendChild(removeButton);
        favoritesList.appendChild(li);
    });
}

function removeFavorite(city) {
    favorites = favorites.filter(fav => fav.city !== city);
    saveFavorites();
    updateFavoritesUI();
}

function saveFavorites() {
    localStorage.setItem('favorites', JSON.stringify(favorites));
}

window.addEventListener('load', () => {
    updateFavoritesUI();
});
