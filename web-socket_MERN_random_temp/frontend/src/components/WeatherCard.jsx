import React from "react";
import { WiThermometer, WiHumidity, WiCloud } from "react-icons/wi";
import "./WeatherCard.css";

const WeatherCard = ({ title, data, faded }) => {
  return (
    <div className="card-container">
      <h2 className="card-title">{title}</h2>
      {data ? (
        <div className={`card ${faded ? "previous" : ""}`}>
          <h3 className="city">{data.city}</h3>
          <div className="temp">
            <WiThermometer style={{ marginRight: "5px", color: "#f87171" }} />
            {data.temperature}°C
          </div>
          <p>
            <WiHumidity style={{ marginRight: "5px", color: "#3b82f6" }} />
            Humidity: {data.humidity}%
          </p>
          <p>
            <WiCloud style={{ marginRight: "5px", color: "#facc15" }} />
            {data.description}
          </p>
        </div>
      ) : (
        <p>No data yet</p>
      )}
    </div>
  );
};

export default WeatherCard;
