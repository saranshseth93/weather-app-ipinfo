import React, { useState, useEffect } from "react";
import env from "react-dotenv";

const api = {
  key: env.API_KEY,
  base: env.BASE_URL
};

function App() {
  const [query, setQuery] = useState("");
  const [weather, setWeather] = useState({});
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");

  fetch("https://ipinfo.io?token=75832bdf153bdc")
    .then(res => res.json())
    .then(result => {
      if (result !== "undefined" || result !== "") {
        setCity(result.city);
        setCountry(result.country);
      }
    });

  // Similar to componentDidMount and componentDidUpdate:
  useEffect(() => {
    // Update the document title using the browser API
    loadTemp();
  }, [city]); // Whenever city is changed

  const loadTemp = () => {
    fetch(
      `${api.base}weather?q=${city}, ${country} &units=metric&APPID=${api.key}`
    )
      .then(res => res.json())
      .then(result => {
        setWeather(result);
        setQuery("");
      });
  };

  const search = evt => {
    if (evt.key === "Enter") {
      fetch(`${api.base}weather?q=${query}&units=metric&APPID=${api.key}`)
        .then(res => res.json())
        .then(result => {
          setWeather(result);
          setQuery("");
        });
    }
  };

  const dateBuilder = d => {
    let months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December"
    ];
    let days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday"
    ];

    let day = days[d.getDay()];
    let date = d.getDate();
    let month = months[d.getMonth()];
    let year = d.getFullYear();

    return `${day} ${date} ${month} ${year}`;
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
            placeholder="Search..."
            onChange={e => setQuery(e.target.value)}
            value={query}
            onKeyPress={search}
          />
        </div>
        {typeof weather.main !== "undefined" ? (
          <div>
            <div className="location-box">
              <div className="location">
                {weather.name}, {weather.sys.country}
              </div>
              <div className="date">{dateBuilder(new Date())}</div>
            </div>
            <div className="weather-box">
              <div className="temp">{Math.round(weather.main.temp)}°c</div>
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
