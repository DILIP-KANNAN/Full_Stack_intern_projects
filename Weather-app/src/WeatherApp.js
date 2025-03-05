import WeatherDetails from "./WeatherDetails";
import Forecast from "./Forecast";
import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import './index.css'
import "bootstrap/dist/css/bootstrap.min.css";
import 'bootstrap-icons/font/bootstrap-icons.css';

const API_KEY = "45fa98156fff63d1d43fdbdad56bc903";
const WEATHER_URL = "https://api.openweathermap.org/data/2.5/weather";

function WeatherApp() {
  const [city, setCity] = useState("");
  const [unit, setUnit] = useState("metric");
  const [weatherData, setWeatherData] = useState(null);
  const [lat, setLat] = useState(null);
  const [lon, setLon] = useState(null);
  const [loading, setLoading] = useState(false);

  // Function to fetch weather data by coordinates
  const fetchWeatherByCoords = useCallback(async (latitude, longitude) => {
    if (!latitude || !longitude) return;
    setLoading(true);
    try {
      const response = await axios.get(
        `${WEATHER_URL}?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=${unit}`
      );
      setWeatherData(response.data);
    } catch (error) {
      console.error("Error fetching weather data", error);
    } finally {
      setLoading(false);
    }
  }, [unit]);

  // Get user location when the component mounts
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLat(position.coords.latitude);
        setLon(position.coords.longitude);
        fetchWeatherByCoords(position.coords.latitude, position.coords.longitude);
      },
      (error) => console.error("Error getting location", error)
    );
  }, [fetchWeatherByCoords]);

  // Fetch weather when lat/lon changes
  useEffect(() => {
    if (lat && lon) fetchWeatherByCoords(lat, lon);
  }, [lat, lon, fetchWeatherByCoords]);

  // Handle city search
  const handleSearch = async () => {
    if (!city) return;
    setLoading(true);
    try {
      const locationRes = await axios.get(`${WEATHER_URL}?q=${city}&appid=${API_KEY}`);
      const { lat, lon } = locationRes.data.coord;
      setLat(lat);
      setLon(lon);
      fetchWeatherByCoords(lat, lon);
    } catch (error) {
      alert("City not found");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid py-2 px-4">
      <div className="row">
        {/* Search Bar & Current Weather */}
        <div className="con col-md-4 bg-primary text-light py-5 rounded shadow-lg d-flex flex-column">
          <div className="input-group d-flex bg-light border border-secondary rounded align-self-center" 
                style={{width: '300px'} }>
            <input
                type="text"
                className="form-control p-2 "
                placeholder="Enter city..."
                value={city}
                onChange={(e) => setCity(e.target.value)}
                style={{width: '190px'}}
            />
            <select
                className="form-select p-2"
                value={unit}
                style={{width: '40px'}}
                onChange={(e) => setUnit(e.target.value)}
            >
                <option value="metric">°C</option>
                <option value="imperial">°F</option>
            </select>
            <button className="btn p-2 btn-outline-dark" onClick={handleSearch} style={{width: '40px'}}>
                <i className="bi bi-search"></i> 
            </button>
          </div>

          {loading ? (
            <p>Loading weather...</p>
          ) : weatherData ? (
            <div className="cont">
              <div className="text-center my-3" d-flex flex-column>
                <h2 className="bg-warning d-flex rounded justify-content-center text-dark"  style={{width: '75%'}}><i class="bi bi-geo-alt-fill"></i>{weatherData?.name || "Loading..."}</h2>
                <img
                    className="bg-light img-fluid rounded-circle"
                    src={`http://openweathermap.org/img/wn/${weatherData?.weather[0].icon}@2x.png`}
                    alt="weather-icon"
                />
              </div>
              <div>
                <h1>{weatherData?.main.temp}°{unit === "metric" ? "C" : "F"}</h1>
              <div className="det">
                <p>{weatherData?.weather[0].description}</p>
                <p>feels like {weatherData?.main.feels_like}°{unit === "metric" ? "C" : "F"}</p>
                <p>min temp {weatherData?.main.temp_min}°{unit === "metric" ? "C" : "F"}</p>
                <p>max temp {weatherData?.main.temp_max}°{unit === "metric" ? "C" : "F"}</p>
                <p>Day: {new Date(weatherData?.dt * 1000).toLocaleDateString()}</p>
              </div>
              </div>
            </div>
          ) : (
            <p>No data available</p>
          )}
        </div>

        {/* Weather Details & Forecast */}
        <div className="col-md-8 justify-self-center">
          {weatherData && <WeatherDetails data={weatherData} />}
          {weatherData && <Forecast lat={lat} lon={lon} unit={unit} />}
        </div>
      </div>
    </div>
  );
}

export default WeatherApp;
