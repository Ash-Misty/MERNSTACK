import { useEffect, useState } from "react";
import { BsCloudSunFill } from "react-icons/bs";
import WeatherCard from "./components/WeatherCard";
import "./App.css";

function App() {
  const [weatherHistory, setWeatherHistory] = useState([]);
  const [connected, setConnected] = useState(false);

  // City 
   const [city, setCity] = useState("");

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
        const newHistory = [...prev, data];
        return newHistory.slice(-2); // keep only last 2
      });
    };

    ws.onclose = () => setConnected(false);

    return () => ws.close();
  }, []);

  //  City  logic 
  
  useEffect(() => {
    const ws = new WebSocket("ws://localhost:3000");
    const timer = setTimeout(() => {
      if (city && ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({ cityRequest: city }));
        console.log("City sent:", city);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [city]);
  

  const previous = weatherHistory[0];
  const latest = weatherHistory[1];

  return (
    <div className="app">
      <h1 className="title">
        <BsCloudSunFill style={{ marginRight: "10px", color: "#facc15" }} />
        Live IoT Weather
      </h1>

      {/* City Input  */}
      
      <input
        type="text"
        placeholder="Enter city..."
        value={city}
        onChange={(e) => setCity(e.target.value)}
        className="city-input"
      />
      

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
  