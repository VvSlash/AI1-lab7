// klasa w notacji E2015
const WeatherApp = class {
    constructor(apiKey, resultsBlockSelector) {
        this.apiKey = apiKey;
        this.resultsBlock = document.querySelector(resultsBlockSelector);
        this.currentWeatherLink = `https://api.openweathermap.org/data/2.5/weather?q={query}&appid=${apiKey}&units=metric&lang=pl`;
        this.forecastLink = `https://api.openweathermap.org/data/2.5/forecast?q={query}&appid=${apiKey}&units=metric&lang=pl`;
        this.currentWeather = undefined;
        this.forecast = undefined;
    }

    getCurrentWeather(query) {
        let url = this.currentWeatherLink.replace("{query}", query);
        let req = new XMLHttpRequest();
        req.open("GET", url, true);
        req.addEventListener("load", () => {
            this.currentWeather = JSON.parse(req.responseText);
            console.log(this.currentWeather);
            this.drawWeather();
        });
        req.send();
    }

    getForecast(query) {
        let url = this.forecastLink.replace("{query}", query);
        fetch(url).then((response) => {
            return response.json();
        })
        .then((data) => {
            console.log(data);
            this.forecast = data.list;
            this.drawWeather();
        });
    }

    getWeather(query) {
        this.getCurrentWeather(query);
        this.getForecast(query);
    }

    drawWeather() {
        this.resultsBlock.innerHTML=null;
        if(this.currentWeather){
            const date = new Date(this.currentWeather.dt*1000);
            const weatherBlock = this.createWeatherBlock(
                `${date.toLocaleDateString("pl-PL")} ${date.toLocaleTimeString("pl-PL")}`, 
                this.currentWeather.main.temp, 
                this.currentWeather.main.feels_like, 
                this.currentWeather.weather[0].icon, 
                this.currentWeather.weather[0].description
            );
            this.resultsBlock.appendChild(weatherBlock);
        }
        if(this.forecast){
            for(let i=0;i<this.forecast.length;i++){
                let weather = this.forecast[i];
                const date = new Date(weather.dt*1000);
                const weatherBlock = this.createWeatherBlock(
                    `${date.toLocaleDateString("pl-PL")} ${date.toLocaleTimeString("pl-PL")}`, 
                    weather.main.temp, 
                    weather.main.feels_like, 
                    weather.weather[0].icon, 
                    weather.weather[0].description
                );
                this.resultsBlock.appendChild(weatherBlock);
            }
        }
    }
    // Tworzenie bloków
    createWeatherBlock(dateString, temperature, feelsLikeTemperature, iconName, description) {
        const weatherBlock = document.createElement("div");
        weatherBlock.className = "weatherBlock";
        const dateBlock = document.createElement("div");
        dateBlock.className = "dateBlock";
        dateBlock.innerText = dateString;
        weatherBlock.appendChild(dateBlock);
        const temperatureBlock = document.createElement("div");
        temperatureBlock.className = "temperatureBlock";
        temperatureBlock.innerText = `${temperature} °C`; // konkatenacja zgodna ze składnią E2015
        weatherBlock.appendChild(temperatureBlock);
        const feelsLikeTemperatureBlock = document.createElement("div");
        feelsLikeTemperatureBlock.className = "feelsLikeTemperatureBlock";
        feelsLikeTemperatureBlock.innerText = `Odczuwalna: ${feelsLikeTemperature} °C`; // konkatenacja zgodna ze składnią E2015
        weatherBlock.appendChild(feelsLikeTemperatureBlock);
        const icon = document.createElement("img");
        icon.className = "weatherIcon";
        icon.src = `https://openweathermap.org/img/wn/${iconName}@2x.png`; // konkatenacja zgodna ze składnią E2015
        weatherBlock.appendChild(icon);
        const descriptionBlock = document.createElement("div");
        descriptionBlock.className = "descriptionBlock";
        descriptionBlock.innerText = description; // konkatenacja zgodna ze składnią E2015
        weatherBlock.appendChild(descriptionBlock);
        return weatherBlock;
    }
}
// Tworzenie instancji klasy
document.weatherApp = new WeatherApp("42b5550a25c709e9a7942e57a920ca8e", "#weatherResultsContainer");

document.querySelector("#checkButton").addEventListener("click", function() {
    const query = document.querySelector("#locationInput").value;
    document.weatherApp.getWeather(query);
});