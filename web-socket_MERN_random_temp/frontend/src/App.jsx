import { useEffect, useState } from "react";
import { BsCloudSunFill } from "react-icons/bs";
import WeatherCard from "./components/WeatherCard";
import "./App.css";

function App() {
  const [weatherHistory, setWeatherHistory] = useState([]); // [previous, latest]
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:3000");

    ws.onopen = () => {
      setConnected(true);
      console.log("Connected to server");
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log("Weather from server:", data);

      setWeatherHistory((prev) => {
        const newHistory = [...prev, data]; // add new data
        return newHistory.slice(-2);        // keep only last 2
      });
    };

    ws.onclose = () => setConnected(false);

    return () => ws.close();
  }, []);

  const previous = weatherHistory[0];
  const latest = weatherHistory[1];

  return (
    <div className="app">
      <h1 className="title">
        <BsCloudSunFill style={{ marginRight: "10px", color: "#facc15" }} />
        Live IoT Weather
      </h1>

      <div className={`status ${connected ? "online" : "offline"}`}>
        {connected ? "Device Stream Online" : "Waiting for device..."}
      </div>

      <div className="cards-container">
        <WeatherCard title="Latest Data" data={latest} faded={false} />
        <WeatherCard title="Previous Data" data={previous} faded={true} />
      </div>
    </div>
  );
}

export default App;
