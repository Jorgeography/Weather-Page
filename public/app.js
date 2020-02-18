// // Create a new date instance dynamically with JS
let d = new Date();
let month = d.getMonth() + 1;
let newDate = month + "." + d.getDate() + "." + d.getFullYear();

const apiEndpoint = "http://api.openweathermap.org/data/2.5/weather?zip=";

const iconElement = document.querySelector(".weather-icon");
const tempElement = document.querySelector(".temperature-value p");
const descElement = document.querySelector(".temperature-description p");
const locationElement = document.querySelector(".location p");
const notificationElement = document.querySelector(".notification");

const weather = {};

weather.temperature = {
  unit: "celsius"
};

const KELVIN = 273;
const key = "&appid=82005d27a116c2880c8f0fcb866998a0";

const getData = async url => {
  const result = await fetch(url);
  const data = await result.json();
  return data;
};

const postData = async (url, postData) => {
  const result = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(postData)
  });
  const data = await result.json();
  return data;
};

const update = myupdatedata => {
  document.getElementById("date").textContent = myupdatedata.date;
  document.getElementById("temp").textContent = myupdatedata.temp;
  document.getElementById("content").textContent = myupdatedata.feel;
};

document.getElementById("generate").addEventListener("click", async () => {
  let zipCode = document.getElementById("zip").value;
  let feeling = document.getElementById("feelings").value;
  const getFromAPI = await getData(apiEndpoint + zipCode + key);
  console.log(getFromAPI);
  const postBackServer = await postData("/addData", {
    temperature: Math.floor(getFromAPI.main.temp) - 235,
    feeling: feeling,
    date: newDate
  }); 

  const getFromServer = await getData("/givemydata");
  console.log(getFromServer);
  update(getFromServer);
});

//For weather icon

if ('geolocation' in navigator) {
    navigator.geolocation.getCurrentPosition(setPosition, showError);
} else {
    notificationElement.style.display = "block";
    notificationElement.innerHTML = "";
}

function setPosition(position) {
    let latitude = position.coords.latitude;
    let longitude = position.coords.longitude;

    getWeather(latitude, longitude);
}

function showError(error) {
    notificationElement.style.display = "block";
    notificationElement.innerHTML = `<p> ${error.message} </p>`;
}

function getWeather(latitude, longitude) {
    let api = `http://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}${key}`;

    fetch(api)
        .then(function (response) {
            let data = response.json();
            return data;
        })
        .then(function (data) {
            weather.temperature.value = Math.floor(data.main.temp - KELVIN);
            weather.description = data.weather[0].description;
            weather.iconId = data.weather[0].icon;
            weather.city = data.name;
            weather.country = data.sys.country;
        })
        .then(function () {
            displayWeather();
        });
}


// const string= document.getElementById(temp);
// const newTemp= string.replace(temp, weather.temperature.value) 
// document.write(newTemp);

// document.getElementById(temp).innerHTML = weather.temperature.value;

function displayWeather() {
    iconElement.innerHTML = `<img src="../icons/${weather.iconId}.svg"/>`;
    tempElement.innerHTML = `${weather.temperature.value}°<span>C</span>`;
    descElement.innerHTML = weather.description;
    locationElement.innerHTML = `${weather.city}, ${weather.country}`;
}

document.getElementById("showImage").onclick = function () {
    document.getElementById("unknown").style.visibility = "hidden";
}

function celsiusToFahrenheit(temperature) {
  return (temperature * 9) / 5 + 32;
}

tempElement.addEventListener("click", function() {
  if (weather.temperature.value === undefined) return;

  if (weather.temperature.unit == "celsius") {
    let fahrenheit = celsiusToFahrenheit(weather.temperature.value);
    fahrenheit = Math.floor(fahrenheit);

    tempElement.innerHTML = `${fahrenheit}°<span>F</span>`;
    weather.temperature.unit = "fahrenheit";
  } else {
    tempElement.innerHTML = `${weather.temperature.value}°<span>C</span>`;
    weather.temperature.unit = "celsius";
  }
});
