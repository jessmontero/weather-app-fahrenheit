function formatDate(timestamp) {

let date = new Date(timestamp);
let hours = date.getHours(0);
if(hours < 10) {
    hours = `0${hours}`;
}

let minutes = date.getMinutes();
if(minutes <10) {
    minutes = `0${minutes}`;
}

let days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
let day = days[date.getDay()];

return `${day} ${hours}:${minutes}`;

}

function getForecast(coordinates) {
  let apiKey = "ddf0440bcec2a49b426ccbeada3e4574";
  let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&exclude=current,minutely,hourly,alerts&appid=${apiKey}&units=imperial`;
  
  axios.get(apiUrl).then(displayForecast);
}

function formatDay(timestamp) {
  let date = new Date(timestamp * 1000);
  let day = date.getDay();
  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return days[day];
}

function displayForecast(response) {

  let forecast = response.data.daily;

  let forecastElement = document.querySelector("#forecast");

  let forecastHTML = `<div class="row">`;
  
  forecast.forEach(function (forecastDay, index) {
    if (index < 6) {
    forecastHTML =
    forecastHTML +
     `
      <div class="col-2">
        <ul class="my-auto">
            <li class="forecast-day">
                ${formatDay(forecastDay.dt)}
            </li>
            <li>
                <img src="images/${forecastDay.weather[0].icon}.png" alt="${forecastDay.weather[0].description}" width="32px">
            </li>
            <li>
            <span class="max-min-temp">
                <span class="forecast-max-temp">${Math.round(forecastDay.temp.max)}°</span><span class="forecast-min-temp">/${Math.round(forecastDay.temp.min)}°</span>
            </span>
            </li>
        </ul>
      </div>
    `;
    }
  });
forecastHTML = forecastHTML + `</div>`;

forecastElement.innerHTML = forecastHTML;
}

function showTemperature(response) {
  document.querySelector("#search-input").value = "";
  document.querySelector("#city").innerHTML = response.data.name;
  document.querySelector("#temperature").innerHTML = Math.round(
    response.data.main.temp
  );
  document.querySelector("#conditions").innerHTML =
    response.data.weather[0].description;
  document.querySelector("#feels-like").innerHTML = Math.round(
    response.data.main.feels_like
  );
  document.querySelector("#humidity").innerHTML = response.data.main.humidity;
  document.querySelector("#wind").innerHTML = Math.round(
    response.data.wind.speed
  );
  document.querySelector("#day-time").innerHTML = formatDate(response.data.dt*1000);

  centigradeTemperature = response.data.main.temp;

  let iconElement = document.querySelector("#icon");
  iconElement.setAttribute("src", `images/${response.data.weather[0].icon}.png`);
  iconElement.setAttribute("alt", response.data.weather[0].description);

  let body = document.querySelector("#weather-app");
  let submitButton = document.querySelector("#submit-button");
  let locationButton = document.querySelector("#current-location-button");

  if (response.data.main.temp > 66) {
      body.style.background = "linear-gradient(to top, #f2616b 0%, #f9986e 100%)";
      submitButton.classList.add("style-warm");
      locationButton.classList.add("style-warm");
      submitButton.classList.remove("style-cold");
      locationButton.classList.remove("style-cold");
  } else {
      body.style.background = "linear-gradient(to top, #338b93 0%, #75c9a6 100%)";
      submitButton.classList.add("style-cold");
      locationButton.classList.add("style-cold");
      submitButton.classList.remove("style-warm");
      locationButton.classList.remove("style-warm");
  }

  getForecast(response.data.coord);

}


function search(city) {
  let apiKey = "ddf0440bcec2a49b426ccbeada3e4574";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${apiKey}`;
  axios.get(apiUrl).then(showTemperature);
}

function handleSubmit(event) {
  event.preventDefault();
  let city = document.querySelector("#search-input").value;
  search(city);
}

function showPosition(position) {
  let latitude = position.coords.latitude;
  let longitude = position.coords.longitude;
  let apiKey = "ddf0440bcec2a49b426ccbeada3e4574";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=imperial`;

  axios.get(apiUrl).then(showTemperature);
}

function getCurrentPosition() {
  document.querySelector("#search-input").value = "";
  navigator.geolocation.getCurrentPosition(showPosition);
}

let form = document.querySelector("#city-search");
form.addEventListener("submit", handleSubmit);

let button = document.querySelector("#current-location-button");
button.addEventListener("click", getCurrentPosition);

search("London");
