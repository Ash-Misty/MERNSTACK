const WebSocket = require("ws");

const ws = new WebSocket("ws://localhost:3000");

const descriptions = ["sunny", "cloudy", "rainy", "windy", "stormy"];
const cities = [
  "Chennai","Mumbai","Delhi","Bangalore","Hyderabad",
  "Kolkata","Pune","Ahmedabad","Jaipur","Lucknow"
];

ws.on("open", () => {
  console.log("Fake MCU Connected");

  // Register device
  ws.send(JSON.stringify({ device: "esp8266" }));

  // Send random weather every 3 sec
  setInterval(() => {
    const data = {
      city: cities[Math.floor(Math.random() * cities.length)],
      temperature: Math.floor(Math.random() * 20) + 20, // 20–40°C
      humidity: Math.floor(Math.random() * 50) + 40,    // 50–90%
      description: descriptions[Math.floor(Math.random() * descriptions.length)]
    };

    ws.send(JSON.stringify(data));
    console.log("Sent:", data);

  }, 3000);
});

ws.on("error", err => {
  console.log(" ESP Connection Error:", err.message);
});
