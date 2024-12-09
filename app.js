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

const apiKey = '02f6dee25424d3457843e7a29e0ead89';

//Function for get weather without a city
async function getWeather(ville) {
  const response = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${ville}&appid=${apiKey}&units=metric`
  );
  const data = await response.json();
  weatherCity.innerText = data.name;
  weatherIcon.src = `http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
  weatherTemp.innerText = `${data.main.temp}°C`;
  weatherDesc.innerText = data.weather[0].description;
}
searchButton.addEventListener(
    'click', (e) => {
        let ville = searchBar.value;
        if (ville === "" || ville === undefined){
            console.log("Please select");
        }else{
            getWeather(ville);
        }
    }
);

//get the current date from the computer
let date = new Date();
let options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
let formattedDate = date.toLocaleDateString('fr-FR', options);
currentDate.innerText = formattedDate;
//fetch the current weather data from the OpenWeatherMap API

async function fetchCurrentWeather(lat, lon) {
  const response = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`
  );
  const data = await response.json();

  currentCity.innerText = data.name;
  currentIcon.src = `http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
  currentTemp.innerText = `${data.main.temp}°C`;
  currentDesc.innerText = data.weather[0].description;
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