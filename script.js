//state
let currentCity = ""
let units = "metric"

//error
let error = document.getElementById('error');

//selectors
let city = document.querySelector(".weather-city");
let datetime = document.querySelector(".weather-datetime");
let weatherforecast = document.querySelector(".weather-forecast");
let weathertemperature = document.querySelector(".weather-temperature");
let weathericon = document.querySelector(".weather-icon");
let weatherminmax = document.querySelector(".weather-minmax");
let weatherrealfeel = document.querySelector(".weather-realfeel");
let weatherhumidity = document.querySelector(".weather-humidity");
let weatherwind = document.querySelector(".weather-wind");
let weatherpressure = document.querySelector(".weather-pressure");

//search
document.querySelector(".weather-search").addEventListener("submit", e => {
    let search = document.querySelector(".weather-searchform");
    //prevent default action
    e.preventDefault();
    //change current city
    currentCity = search.value;
    //get weather forecast
    getWeather();
    //clear form
    search.value = ""
})

//units
document.querySelector(".weather-unit-celcius").addEventListener("click", () => {
    if(units !== "metric"){
        //change to metric
        units = "metric"
        //get weather forecast
        getWeather()
    }
})

document.querySelector(".weather-unit-fahrenheit").addEventListener("click", () => {
    if(units !== "imperial"){
        //change to imperial
        units = "imperial"
        //get weather forecast
        getWeather()
    }
})

function convertTimeStamp(timestamp, timezone){
    const convertTimezone = timezone / 3600; //convert seconds to hours

    const date = new Date(timestamp * 1000);

    const options = {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "numeric",
        minute: "numeric",
        timeZone: `Etc/GMT${convertTimezone >= 0 ? "-" : "+"}${Math.abs(convertTimezone)}`,
        hour12: true,
    }
    return date.toLocaleString("en-US", options)

}
//convert country code to name
function convertCountryCode(country){
    let regionNames = new Intl.DisplayNames(["en"], {type: "region"});
    return regionNames.of(country)
}

function getWeather(){
    const apiKey = "9ab11fa9e431cd2f116081573b55fc41"

    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${currentCity}&appid=${apiKey}&units=${units}`).then(res => res.json()).then(data => {
        console.log(data)
        console.log(data.cod)
        if(data.cod == '404'){
            error.style.display = "block"
        } else {
            error.style.display = "none"
        }
        city.innerHTML = `${data.name},${convertCountryCode(data.sys.country)}`
        datetime.innerHTML = convertTimeStamp(data.dt, data.timezone);
        weatherforecast.innerHTML = `<p>${data.weather[0].main}`
        weathertemperature.innerHTML = `${data.main.temp.toFixed()}&#176`
        weathericon.innerHTML = ` <img src="http://openweathermap.org/img/wn/${data.weather[0].icon}@4x.png" alt="weatherIcon">`
        weatherminmax.innerHTML = `<p>Min:${data.main.temp_min.toFixed()}&#176</p><p>Max:${data.main.temp_max.toFixed()}&#176</p>`
        weatherrealfeel.innerHTML = `${data.main.feels_like.toFixed()}&#176`
        weatherhumidity.innerHTML= `${data.main.humidity}%`
        weatherwind.innerHTML= `${data.wind.speed} ${units === "imperial" ? "mph" : "m/s"}`
        weatherpressure.innerHTML= `${data.main.pressure}hpa`

    })
}

document.body.addEventListener("load",getWeather())
