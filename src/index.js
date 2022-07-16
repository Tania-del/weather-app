import * as axios from "axios";

const tempEl = document.querySelector(".temp");

const dayEl = document.querySelector("#day");
const timeEl = document.querySelector("#time");
const cityEl = document.querySelector("#city");
const precipitationEl = document.querySelector("#precipitation");
const windEl = document.querySelector("#wind");
const descriptionEl = document.querySelector("#description");
const iconEl = document.querySelector("#icon");
const formEl = document.querySelector("#form");
const celciumEl = document.querySelector("#celcium");
const fahrenheitEl = document.querySelector("#fahrenheit");
const currentTownEl = document.querySelector("#town-list");
const currentButtonEl = document.querySelector("#current-button");

const units = "metric";
const apiKey = "ff302840c34e328a290e351206228b12";

const getCurrentDay = () => {
  const now = new Date();
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  const day = now.getDay();
  return `${days[day]}`;
};
const formatDay = (timestamp) => {
  const date = new Date(timestamp * 1000);
  const day = date.getDay();
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return days[day];
};

const getDailyWeather = ({ lat, lon }) => {
  let apiUrlDaily = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=${apiKey}&units=${units}`;
  axios.get(`${apiUrlDaily}`).then(displayForecast);
};
const displayForecast = ({ data }) => {
  let forecast = data.daily;
  console.log(forecast);
  const forecastEl = document.querySelector("#forecast");
  let forecastHTML = '<div class="row row-cols-5 weekly-container">';
  forecast.forEach(function (forecastDay, index) {
    if (index < 5) {
      forecastHTML += `<div class="col"><strong>${formatDay(
        forecastDay.dt
      )}</strong> <br /><br />
            <div id="icon">
            <img
            src="http://openweathermap.org/img/wn/${
              forecastDay.weather[0].icon
            }@2x.png"
            alt=""
            width="42"
            />
            </div><br /><span class="weather-max">${Math.round(
              forecastDay.temp.max
            )}°</span><span class="weather-min">${Math.round(
        forecastDay.temp.min
      )}°</span>
        </div>`;
    }
  });

  forecastHTML += "</div>";

  forecastEl.innerHTML = forecastHTML;
};

const getCurrentTime = () => {
  const now = new Date();
  const hour = now.getHours().toString().padStart(2, "0");
  const min = now.getMinutes().toString().padStart(2, "0");
  return `${hour}:${min}`;
};

const updateData = (response) => {
  const { temp, humidity } = response.data.main;
  console.log(response);
  const { speed } = response.data.wind;
  const { description } = response.data.weather[0];
  dayEl.textContent = getCurrentDay();
  timeEl.textContent = getCurrentTime();
  tempEl.textContent = Math.round(temp);
  cityEl.textContent = response.data.name;
  precipitationEl.textContent = humidity;
  windEl.textContent = Math.round(speed);
  descriptionEl.textContent = description;
  iconEl.setAttribute(
    "src",
    `http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
  );
  getDailyWeather(response.data.coord);
};

const getWeatherByCity = (city) => {
  const apiUrl = `https://api.openweathermap.org/data/2.5/weather?appid=${apiKey}&q=${city}&units=${units}`;
  axios.get(`${apiUrl}`).then(updateData);
};

const searchCity = (event) => {
  event.preventDefault();
  const city = document.querySelector("#form-input").value;
  getWeatherByCity(city);
};

formEl.addEventListener("submit", searchCity);

const getTownEl = (event) => {
  event.preventDefault();
  const city = event.target.textContent;
  getWeatherByCity(city);
};

currentTownEl.addEventListener("click", getTownEl);

const getWetherByCoords = ({ latitude, longitude }) => {
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=${units}`;
  axios.get(`${apiUrl}`).then(updateData);
};

const getCoords = ({ coords }) => {
  getWetherByCoords(coords);
};

const getCurrentPosition = () => {
  navigator.geolocation.getCurrentPosition(getCoords);
};

getCurrentPosition();
currentButtonEl.addEventListener("click", getCurrentPosition);

const convertToFahrenheit = (celcium) => {
  return Math.round(celcium * 1.8 + 32);
};

const onClickFahrenheit = () => {
  const celcium = tempEl.textContent;
  if (celcium < 50) {
    tempEl.textContent = convertToFahrenheit(celcium);
  }
};

fahrenheitEl.addEventListener("click", onClickFahrenheit);

const convertToCelcium = (fahrenheit) => {
  return Math.round((fahrenheit - 32) / 1.8);
};

const onClickCelcium = () => {
  const fahrenheit = tempEl.textContent;

  if (fahrenheit > 50) {
    tempEl.textContent = convertToCelcium(fahrenheit);
  }
};
celciumEl.addEventListener("click", onClickCelcium);
