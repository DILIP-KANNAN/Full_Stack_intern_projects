import React, { useEffect, useState } from "react";
import axios from "axios";
import './new.css';

const API_KEY = "cbb28006f792f3d036949baf4ecddd6d"; // Replace with your API key

const Forecast = ({ lat, lon, unit }) => {
  const [forecastData, setForecastData] = useState([]);

  useEffect(() => {
    if (!lat || !lon) {
      console.error("Latitude or Longitude is missing! API request skipped.");
      return;
    }

    const fetchForecast = async () => {
      try {
        const response = await axios.get(
          `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=${unit}`
        );
        
        const dailyForecast = extractDailyForecast(response.data.list);
        setForecastData(dailyForecast);
      } catch (error) {
        console.error("Error fetching forecast data", error);
      }
    };

    fetchForecast();
  }, [lat, lon, unit]);

  const extractDailyForecast = (data) => {
    const dailyData = {};

    data.forEach((item) => {
      const date = item.dt_txt.split(" ")[0];
      const time = item.dt_txt.split(" ")[1];

      if (!dailyData[date] || time === "12:00:00") {
        dailyData[date] = item;
      }
    });

    return Object.values(dailyData).slice(1, 6);
  };

  return (
    <div className="mt-4">
      <h4 className="bg-warning d-inline-flex rounded">5-Day Forecast</h4>
      {forecastData.length === 0 ? (
        <p>Loading or No Data Available...</p>
      ) : (
        <div className="deta row g-3 d-flex">
          {forecastData.map((day, index) => (
            <div key={index} className="col-md-3 p-2 bg-light text-center rounded">
              <p>{new Date(day.dt * 1000).toLocaleDateString()}</p>
              <img
                src={`http://openweathermap.org/img/wn/${day.weather[0].icon}.png`}
                alt="weather-icon"
              />
              <h5>{day.weather[0].description}</h5>
              <h5>Temp: {day.main.temp}°{unit === "metric" ? "C" : "F"}</h5>
              <p>feels like {day.main.feels_like}°{unit === "metric" ? "C" : "F"}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Forecast;
