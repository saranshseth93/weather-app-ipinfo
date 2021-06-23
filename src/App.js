import React, { useState, useEffect } from "react";
import env from "react-dotenv";
import iconDay from "./assets/amcharts_weather_icons_1.0.0/animated/day.svg";
import iconNight from "./assets/amcharts_weather_icons_1.0.0/animated/night.svg";
import iconCloudDay from "./assets/amcharts_weather_icons_1.0.0/animated/cloudy-day-1.svg";
import iconCloudNight from "./assets/amcharts_weather_icons_1.0.0/animated/cloudy-night-1.svg";
import iconRainy from "./assets/amcharts_weather_icons_1.0.0/animated/rainy-1.svg";
import iconSnow from "./assets/amcharts_weather_icons_1.0.0/animated/snowy-1.svg";
import iconThunder from "./assets/amcharts_weather_icons_1.0.0/animated/thunder.svg";
import moment from "moment";

const api = {
  key: env.API_KEY,
  base: env.BASE_URL
};

function App() {
  const [query, setQuery] = useState("");
  const [weather, setWeather] = useState({});
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [currentDate, setCurrentDate] = useState("");
  const [currentTime, setCurrentTime] = useState("");
  const [icon, setIcon] = useState("");

  // Similar to componentDidMount and componentDidUpdate:
  useEffect(() => {
    loadTemp();
  }, [city]); // Whenever city is changed

  const initialLoad = () => {
    console.log("initial");
    fetch("https://ipinfo.io?token=75832bdf153bdc")
      .then(res => res.json())
      .then(result => {
        if (result !== "undefined" || result !== "") {
          console.log(result);
          let date = new Date();
          let locDate = date.toLocaleString("de-DE", {
            timeZone: result.timezone
          });

          let currDate = locDate.split(",")[0];
          let currTime = locDate.split(",")[1].trim();

          let day = moment(currDate, "DD.MM.YYYY").format("dddd, DD MMM YYYY");
          let time = moment(currTime, "HH:mm:ss").format("hh:mmA");

          setCurrentDate(day);
          setCurrentTime(time);
          setCity(result.city);
          setCountry(result.country);
        }
      });
  };

  const loadIcon = result => {
    if (
      result.weather[0].main === "Clear" &&
      currentTime.indexOf("AM") !== -1
    ) {
      setIcon(iconDay);
    } else if (
      result.weather[0].main === "Clear" &&
      currentTime.indexOf("PM") !== -1
    ) {
      setIcon(iconNight);
    } else if (
      (result.weather[0].main === "Cloudy" ||
        result.weather[0].main === "Haze" ||
        result.weather[0].main === "Clouds") &&
      currentTime.indexOf("AM") !== -1
    ) {
      setIcon(iconCloudDay);
    } else if (
      (result.weather[0].main === "Cloudy" ||
        result.weather[0].main === "Haze" ||
        result.weather[0].main === "Clouds") &&
      currentTime.indexOf("PM") !== -1
    ) {
      setIcon(iconCloudNight);
    } else if (
      result.weather[0].main === "Mist" ||
      result.weather[0].main === "Rainy"
    ) {
      setIcon(iconRainy);
    } else if (
      result.weather[0].main === "Snow" ||
      result.weather[0].main === "Hail"
    ) {
      setIcon(iconSnow);
    } else if (
      result.weather[0].main === "Thunder" ||
      result.weather[0].main === "Thunderstorm"
    ) {
      setIcon(iconThunder);
    }
  };

  const loadTemp = () => {
    if (query === "") {
      console.log(query);
      if (city !== "") {
        fetch(
          `${api.base}weather?q=${city}, ${country} &units=metric&APPID=${api.key}`
        )
          .then(res => res.json())
          .then(result => {
            setWeather(result);
            // setQuery("");

            loadIcon(result);
          });
      } else {
        initialLoad();
      }
    } else {
      fetch(`${api.base}weather?q=${query}&units=metric&APPID=${api.key}`)
        .then(res => res.json())
        .then(result => {
          if (result.message !== "city not found") {
            setWeather(result);
            // setQuery("");

            setCurrentDate(
              moment()
                .utcOffset(Math.round(result.timezone / 60))
                .format("dddd, DD MMM YYYY")
            );
            setCurrentTime(
              moment()
                .utcOffset(Math.round(result.timezone / 60))
                .format("hh:mmA")
            );
            console.log(result);
            loadIcon(result);
          } else {
            setWeather(result);
          }
        });
    }
  };

  const search = evt => {
    if (evt.key === "Enter") {
      loadTemp();
    }
  };

  return (
    <div
      className={
        typeof weather.main !== "undefined"
          ? weather.main.temp > 16
            ? "app warm"
            : "app"
          : "app"
      }
      onLoad={loadTemp}
    >
      <main>
        <div className="search-box">
          <input
            type="text"
            className="search-bar"
            placeholder="Search City Name..."
            onChange={e => setQuery(e.target.value)}
            value={query}
            onKeyPress={search}
          />
        </div>
        {weather.message === "city not found" && (
          <div className="error-box">
            <p>City Not Found</p>
          </div>
        )}
        {typeof weather.main !== "undefined" ? (
          <div>
            <div className="location-box">
              <div className="location">
                {weather.name}, {weather.sys.country}
              </div>
              <div className="date">
                {currentDate} {currentTime}
              </div>
            </div>
            <div className="weather-box">
              <div className="temp">
                {typeof icon !== "undefined" ? (
                  <div className="weather-icon">
                    <img src={icon} alt="Weather icon" />
                  </div>
                ) : (
                  ""
                )}
                {Math.round(weather.main.temp)}°c
                <div className="info-box">
                  <p>Feels like {Math.round(weather.main.feels_like)}°c</p>
                  <p>Humidity {Math.round(weather.main.humidity)}%</p>
                </div>
              </div>
              <div className="weather">{weather.weather[0].main}</div>
            </div>
          </div>
        ) : (
          ""
        )}
      </main>
    </div>
  );
}

export default App;
