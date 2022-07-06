import * as axios from "axios";
// let weather = {
//   paris: {
//     temp: 19.7,
//     humidity: 80
//   },
//   tokyo: {
//     temp: 17.3,
//     humidity: 50
//   },
//   lisbon: {
//     temp: 30.2,
//     humidity: 20
//   },
//   "san francisco": {
//     temp: 20.9,
//     humidity: 100
//   },
//   moscow: {
//     temp: -5,
//     humidity: 20
//   }
// };
// let city = prompt("Enter a city");
// city = city?.toLowerCase();

// if (weather[city] !== undefined) {
//   let temperature = Math.floor(weather[city].temp);
//   let humidity = weather[city].humidity;

//   alert(
//     `It is currently ${temperature}°C in ${city} with a humidity of ${humidity}%`
//   );
// } else {
//   alert(
//     "Sorry, we don't know the weather for this city, try going to https://www.google.com/search?q=weather+sydney"
//   );
// }

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

const getCurrentTime = () => {
  const now = new Date();

  const hour = now.getHours().toString().padStart(2, "0");
  const min = now.getMinutes().toString().padStart(2, "0");

  return `${hour}:${min}`;
};

let dayEl = document.querySelector("#day");
let timeEl = document.querySelector("#time");

const tempEl = document.querySelector(".temp");
const cityEl = document.querySelector("#city");
const precipitationEl = document.querySelector("#precipitation");
const windEl = document.querySelector("#wind");
const descriptionEl = document.querySelector("#description");

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
};

const searchCity = (event) => {
  event.preventDefault();
  const formInputEl = document.querySelector("#form-input").value;
  let units = "metric";
  let apiKey = "ff302840c34e328a290e351206228b12";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?appid=${apiKey}&q=${formInputEl}&units=${units}`;
  axios.get(`${apiUrl}`).then(updateData);
};
let formEl = document.querySelector("#form");
formEl.addEventListener("submit", searchCity);

const getPosition = ({ coords }) => {
  const { latitude, longitude } = coords;
  let units = "metric";
  let apiKey = "ff302840c34e328a290e351206228b12";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=${units}`;
  axios.get(`${apiUrl}`).then(updateData);
};

const getCurrentPosition = () => {
  navigator.geolocation.getCurrentPosition(getPosition);
};

let currentButtonEl = document.querySelector("#current-button");
currentButtonEl.addEventListener("click", getCurrentPosition);

const convertToFahrenheit = (celcium) => {
  return Math.round(celcium * 1.8 + 32);
};

const convertToCelcium = (fahrenheit) => {
  return Math.round((fahrenheit - 32) / 1.8);
};

const onClickFahrenheit = () => {
  const celcium = tempEl.textContent;
  if (celcium < 50) {
    tempEl.textContent = convertToFahrenheit(celcium);
  }
};
const onClickCelcium = () => {
  const fahrenheit = tempEl.textContent;

  if (fahrenheit > 50) {
    tempEl.textContent = convertToCelcium(fahrenheit);
  }
};

const celciumEl = document.querySelector("#celcium");
const fahrenheitEl = document.querySelector("#fahrenheit");
celciumEl.addEventListener("click", onClickCelcium);
fahrenheitEl.addEventListener("click", onClickFahrenheit);
