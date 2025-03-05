import React from "react";
import './new.css';
const WeatherDetails = ({ data }) => {
  return (
    <div className="container mt-4">
      <div className="row g-3 justify-content-center">
        <div className="col-6 col-md-4">
          <div className="bg-primary-subtle rounded p-3 text-center weather-box">
          <img width="35" height="35" src="https://img.icons8.com/ios-filled/50/humidity.png" alt="humidity"/>
            <strong>Humidity:</strong> {data.main.humidity}%
          </div>
        </div>
        <div className="col-6 col-md-4">
          <div className="bg-primary-subtle rounded p-3 text-center weather-box">
          <img width="35" height="35" src="https://img.icons8.com/ios-filled/50/wind--v1.png" alt="wind--v1"/>
            <strong>Wind Speed:</strong> {data.wind.speed} m/s
          </div>
        </div>
        <div className="col-6 col-md-4">
          <div className="bg-primary-subtle rounded p-3 text-center weather-box">
          <img width="35" height="35" src="https://img.icons8.com/ios/50/cloud--v1.png" alt="cloud--v1"/>
            <strong>Cloudiness:</strong> {data.clouds.all}%
          </div>
        </div>
        <div className="col-6 col-md-4">
          <div className="bg-primary-subtle rounded p-3 text-center weather-box">
          <img width="35" height="35" src="https://img.icons8.com/plumpy/24/fog-night--v1.png" alt="fog-night--v1"/>
            <strong>Visibility:</strong> {data.visibility}
          </div>
        </div>
        <div className="col-6 col-md-4">
          <div className="bg-primary-subtle rounded p-3 text-center weather-box">
          <img width="35" height="35" src="https://img.icons8.com/ios/50/atmospheric-pressure.png" alt="atmospheric-pressure"/>
            <strong>Pressure:</strong> {data.main.pressure} hPa
          </div>
        </div>
        <div className="col-6 col-md-4">
          <div className="bg-primary-subtle rounded p-3 text-center weather-box-1">
            <div>
              <img width="35" height="35" src="https://img.icons8.com/ios-filled/50/sunrise.png" alt="sunrise"/>
              <strong>Sunrise:</strong> {new Date(data.sys.sunrise * 1000).toLocaleTimeString()} <br />
            </div>
           <div>
            <img width="35" height="35" src="https://img.icons8.com/ios-filled/50/sunset.png" alt="sunset"/>
            <strong>Sunset:</strong> {new Date(data.sys.sunset * 1000).toLocaleTimeString()}
           </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeatherDetails;
