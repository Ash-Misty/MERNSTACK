const express = require("express");
const WebSocket = require("ws");
const mongoose = require("mongoose");
const cors = require("cors");
const Weather = require("./models/Weather");

// Connect to MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/weather_iot")
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log("Mongo Error:", err));

const app = express();
app.use(cors());

const server = app.listen(3000, () =>
  console.log("Server running on port 3000")
);

const wss = new WebSocket.Server({ server });

// Track clients
let espClient = null;
const browserClients = new Set();

// Broadcast data to all React clients
function broadcastToBrowsers(data) {
  browserClients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(data));
    }
  });
}

wss.on("connection", ws => {
  console.log("🔌 New WebSocket connection");

  // Assume browser client first
  browserClients.add(ws);
  console.log("Browser client registered");

  ws.on("message", async msg => {
    console.log(" RAW MESSAGE:", msg.toString());

    try {
      const data = JSON.parse(msg);

      // ESP registration
      if (data.device === "esp8266") {
        espClient = ws;
        browserClients.delete(ws); // remove ESP from browser set
        console.log("ESP Device Registered");
        return;
      }

      // Weather data from ESP
      if (data.temperature) {
        console.log(" Weather Received:", data);

        try {
          await Weather.create(data);
          console.log("Saved to DB");
        } catch (err) {
          console.log(" DB Save Error:", err.message);
        }

        broadcastToBrowsers(data);
      }

    } catch (err) {
      console.log("Invalid message");
    }
  });

  ws.on("close", () => {
    browserClients.delete(ws);

    if (ws === espClient) {
      espClient = null;
      console.log("ESP Disconnected");
    }

    console.log("Client disconnected");
  });
});
