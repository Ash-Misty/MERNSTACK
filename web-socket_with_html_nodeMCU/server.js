const express = require("express");
const WebSocket = require("ws");
const cors = require("cors");
const db = require("./db");

const app = express();
app.use(cors());
app.use(express.static("public"));

const server = app.listen(3000, () =>
  console.log("Server running on http://localhost:3000")
);

const wss = new WebSocket.Server({ server });

let espClient = null;   // store ESP8266 connection

function broadcastToBrowsers(data) {
  wss.clients.forEach(client => {
    if (client !== espClient && client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(data));
    }
  });
}

wss.on("connection", (ws) => {
  console.log("New client connected");

  ws.on("message", (msg) => {
    try {
      const data = JSON.parse(msg);

      // If ESP sends weather data
      if (data.temperature) {
        console.log("Weather from ESP:", data);

        db.query(
          "INSERT INTO weather_data(city, temperature, humidity, description) VALUES (?, ?, ?, ?)",
          [data.city, data.temperature, data.humidity, data.description]
        );

        broadcastToBrowsers(data);
      }

      // If browser sends city request
      if (data.cityRequest) {
        console.log("City requested:", data.cityRequest);

        if (espClient) {
          espClient.send(JSON.stringify({ city: data.cityRequest }));
        }
      }

      // Register ESP device
      if (data.device === "esp8266") {
        espClient = ws;
        console.log("ESP8266 registered");
      }

    } catch (err) {
      console.log("Invalid message");
    }
  });

  ws.on("close", () => {
    if (ws === espClient) espClient = null;
    console.log("Client disconnected");
  });
});
