var containerWeather = document.getElementById('weather');
var forecastContainer = document.getElementById('five-day');
var historyContainer = document.getElementById('history');

var searchButton = document.getElementById('search-button');
var APIkey = '52295644386b9059a3d034279446c259';


function getApi() {
  var searchValue = document.getElementById('search-city').value;
  var requestUrl = `https://api.openweathermap.org/data/2.5/weather?q=${searchValue}&appid=${APIkey}&units=imperial`;

  fetch(requestUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log(data);
      $('#search-city').val('')
      //temp
      var temp = document.createElement('div');
      temp.textContent = "Temp: " + data.main.temp + " F";
      temp.classList = "current-list-group";

      //search city
      var cityEl = document.createElement('h3');
      cityEl.textContent = data.name;
      //humidity
      var humidity = document.createElement('div');
      humidity.textContent = "Humidity: " + data.main.humidity + "% ";
      humidity.classList = "current-list-group";
      //wind speed
      var windSpeed = document.createElement('div');
      windSpeed.textContent = "Wind Speed: " + data.wind.speed + "mph ";
      windSpeed.classList = "current-list-group";
      //weather icon next to city
      var weatherIcon = document.createElement("img")
      weatherIcon.setAttribute("src", `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`);
      cityEl.appendChild(weatherIcon);

      var currentDate = document.createElement("div")
      currentDate.textContent = " (" + moment(data.value).calendar("MMM D, YYYY") + ") ";
      cityEl.appendChild(currentDate);

      //put all var into container
      containerWeather.innerHTML = '';
      containerWeather.append(cityEl, temp, humidity, windSpeed);
      var lon = data.coord.lon;
      var lat = data.coord.lat;
      getUv(lat, lon);
      //cities in search on left side

      var searchNameEl = document.createElement('h3')
      searchNameEl.textContent = data.name;
      window.localStorage.setItem("h2", data.name);
      window.localStorage.getItem("h2");
      historyContainer.append(searchNameEl);

    });

}

// UV Index
function getUv(lat, lon) {
  var queryURL = `https://api.openweathermap.org/data/2.5/uvi?appid=${APIkey}&lat=${lat}&lon=${lon}`;
  fetch(queryURL)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log(data)

      var UVIndex = document.createElement('div');
      UVIndex.textContent = "UV Index: " + data.value;
      console.log(data.value)
      UVIndex.classList = "current-list-group"
      containerWeather.appendChild(UVIndex)

      //change colors based on uv index value
      if (data.value > 8) {
        UVIndex.style.backgroundColor = "red";
      } else if (data.value < 4) {
        UVIndex.style.backgroundColor = "green";
      } else {
        UVIndex.style.backgroundColor = "orange";
      };

    })
}

// five day forecast
function getFiveDay() {

  var searchValue = document.getElementById('search-city').value;
  var fiveDayUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${searchValue}&units=imperial&appid=${APIkey}`;

  fetch(fiveDayUrl)
    .then(function (response) {
      return response.json();
    })

    .then(function (data) {

      forecastContainer.innerHTML = '';
      for (let i = 0; i < data.list.length; i += 8) {
        var div = document.createElement("div");
        div.style.display = "inline-block";
        div.setAttribute('class', 'col-md-2  col-sm-4')


        //date
        var fivecurrentDate = document.createElement("div")
        fivecurrentDate.textContent = moment(data.list[i].dt_txt).calendar("MMM D, YYYY");


        var temp5 = document.createElement('div');
        temp5.textContent = "Temp: " + data.list[i].main.temp + " F";
        temp5.classList = "five-day-list-group";



        //humidity
        var fivehumidity = document.createElement('div');
        fivehumidity.textContent = "Humidity: " + data.list[i].main.humidity + "% ";
        fivehumidity.classList = "five-day-list-group";


        //pic icon for weather
        var pic = data.list[i].weather[0].icon
        var fiveweatherIcon = document.createElement("img")
        fiveweatherIcon.setAttribute("src", `https://openweathermap.org/img/wn/${pic}@2x.png`);
        fivehumidity.appendChild(fiveweatherIcon);


        temp5.appendChild(fivehumidity);
        fivecurrentDate.appendChild(temp5);
        div.appendChild(fivecurrentDate);
        forecastContainer.appendChild(div);

      }

    })


}

searchButton.addEventListener('click', getApi);
searchButton.addEventListener('click', getFiveDay);
window.addEventListener("load", function () {
  window.localStorage.getItem("history")
})
