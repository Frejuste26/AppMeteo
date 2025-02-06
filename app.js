let searchBar = document.getElementById('searchInput');
let searchButton = document.getElementById('searchButton');
let currentCity = document.getElementById('currentCity');
let currentDate = document.getElementById('currentDate');
let currentIcon = document.getElementById('currentIcon');
let currentTemp = document.getElementById('currentTemp');
let currentDesc = document.getElementById('currentDesc');
let weatherCity = document.getElementById('weatherCity');
let weatherIcon = document.getElementById('weatherIcon');
let weatherTemp = document.getElementById('weatherTemp');
let weatherDesc = document.getElementById('weatherDesc');
let forecastContainer = document.getElementById('forecastContainer');
let favoriteCitiesContainer = document.getElementById('favoriteCitiesContainer');
let addFavoriteButton = document.getElementById('addFavoriteButton');
let loader = document.getElementById('loader');
let errorMessage = document.getElementById('errorMessage');

const apiKey = '02f6dee25424d3457843e7a29e0ead89';

// Gestion des villes favorites
let favoriteCities = JSON.parse(localStorage.getItem('favoriteCities')) || [];

function displayFavoriteCities() {
  favoriteCitiesContainer.innerHTML = '';
  favoriteCities.forEach(city => {
    const cityElement = document.createElement('div');
    cityElement.innerText = city;
    cityElement.classList.add('favorite-city');
    cityElement.addEventListener('click', () => {
      getWeather(city);
      getForecast(city);
    });
    favoriteCitiesContainer.appendChild(cityElement);
  });
}

addFavoriteButton.addEventListener('click', () => {
  let ville = searchBar.value;
  if (ville && !favoriteCities.includes(ville)) {
    favoriteCities.push(ville);
    localStorage.setItem('favoriteCities', JSON.stringify(favoriteCities));
    displayFavoriteCities();
  }
});

// Fonction pour récupérer la météo actuelle
async function getWeather(ville) {
  loader.classList.add('show-loader');
  errorMessage.classList.remove('show-error');
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${ville}&appid=${apiKey}&units=metric`
    );
    if (!response.ok) throw new Error("Ville non trouvée");
    const data = await response.json();
    weatherCity.innerText = data.name;
    weatherIcon.src = `http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
    weatherTemp.innerText = `${data.main.temp}°C`;
    weatherDesc.innerText = data.weather[0].description;
  } catch (error) {
    errorMessage.innerText = error.message;
    errorMessage.classList.add('show-error');
  } finally {
    loader.classList.remove('show-loader');
  }
}

async function fetchCurrentWeather(lat, lon) {
  loader.classList.add('show-loader');
  errorMessage.classList.remove('show-error');
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`
    );
    if (!response.ok) throw new Error("Erreur de récupération des données météo");
    const data = await response.json();
    currentCity.innerText = data.name;
    currentIcon.src = `http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
    currentTemp.innerText = `${data.main.temp}°C`;
    currentDesc.innerText = data.weather[0].description;
  } catch (error) {
    errorMessage.innerText = error.message;
    errorMessage.classList.add('show-error');
  } finally {
    loader.classList.remove('show-loader');
  }
}

if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(
    (position) => {
      // Récupérer les coordonnées de l'utilisateur
      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;
      console.log(`Latitude: ${latitude}, Longitude: ${longitude}`); // Debug
      // Appeler la fonction pour récupérer les données météo
      fetchCurrentWeather(latitude, longitude);
    },
    (error) => {
      console.log("Impossible de récupérer votre position. Veuillez activer la géolocalisation.");
      console.error('Erreur de géolocalisation:', error);
    }
  );
} else {
  console.log("La géolocalisation n'est pas supportée par ce navigateur.");
}

// Obtenir la date actuelle
let date = new Date();
let options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
let formattedDate = date.toLocaleDateString('fr-FR', options);
currentDate.innerText = formattedDate;

// Fonction pour récupérer les prévisions à 5 jours
async function getForecast(ville) {
  loader.classList.add('show-loader');
  errorMessage.classList.remove('show-error');
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?q=${ville}&appid=${apiKey}&units=metric`
    );
    if (!response.ok) throw new Error("Prévision non trouvée");
    const data = await response.json();
    forecastContainer.innerHTML = '';

    // Filtrer les prévisions pour afficher uniquement 1 par jour
    const dailyForecasts = data.list.filter((forecast) => forecast.dt_txt.includes("12:00:00"));

    dailyForecasts.forEach((forecast) => {
      const forecastElement = document.createElement('div');
      forecastElement.classList.add('forecast');
      forecastElement.innerHTML = `
        <h4>${new Date(forecast.dt_txt).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'short' })}</h4>
        <img src="http://openweathermap.org/img/wn/${forecast.weather[0].icon}@2x.png" alt="${forecast.weather[0].description}">
        <p>${forecast.main.temp}°C</p>
        <p>${forecast.weather[0].description}</p>
      `;
      forecastContainer.appendChild(forecastElement);
    });
  } catch (error) {
    errorMessage.innerText = error.message;
    errorMessage.classList.add('show-error');
  } finally {
    loader.classList.remove('show-loader');
  }
}

searchButton.addEventListener(
  'click', (e) => {
    let ville = searchBar.value;
    if (ville === "" || ville === undefined) {
      console.log("Veuillez entrer une ville.");
    } else {
      getWeather(ville);
      getForecast(ville);
    }
  }
);

// Initial display of favorite cities
displayFavoriteCities();
