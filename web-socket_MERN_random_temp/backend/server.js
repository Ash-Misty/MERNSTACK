const express = require("express");
const WebSocket = require("ws");
const mongoose = require("mongoose");
const cors = require("cors");
const Weather = require("./models/Weather");

mongoose.connect("mongodb://127.0.0.1:27017/weather_iot")
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log("Mongo Error:", err));

const app = express();
app.use(cors());

const server = app.listen(3000, () =>
  console.log("Server running on port 3000")
);

const wss = new WebSocket.Server({ server });

let espClient = null;
const browserClients = new Set();

function broadcastToBrowsers(data) {
  browserClients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(data));
    }
  });
}

wss.on("connection", ws => {
  console.log("New WebSocket connection");

  ws.isESP = false;         
  browserClients.add(ws);  

  ws.on("message", async msg => {
    // let data;

    // // Parse message
    // try {
    //   data = JSON.parse(msg.toString());
    // } catch (err) {
    //   console.log("Invalid message:", err.message);
    //   return;
    // }

    // // ESP Registration
    // if (data.device === "esp8266") {
    //   ws.isESP = true;
    //   espClient = ws;
    //   browserClients.delete(ws); // ESP should not receive browser broadcasts
    //   console.log("ESP Registered");
    //   return;
    // }

    // //Handle weather data FROM ESP ONLY
    // if (ws.isESP && data.temperature !== undefined) {
    //   console.log("Weather Received:", data);

    //   try {
    //     await Weather.create(data);
    //     console.log("Data saved to DB");
    //   } catch (err) {
    //     console.log("DB Save Error:", err.message);
    //   }

    //   broadcastToBrowsers(data);
    //   return;
    // }

    // console.log("Message ignored:", data);

    
    //  ESP IoT logic commented out 

     const data = JSON.parse(msg);

    //  ESP Registration
    if (data.device === "esp8266") {
      espClient = ws;
      browserClients.delete(ws);
      console.log("ESP Device Registered");
      return;
    }

    //City request from React
    if (data.cityRequest) {
      console.log("City requested:", data.cityRequest);
      if (espClient && espClient.readyState === WebSocket.OPEN) {
        espClient.send(JSON.stringify({ city: data.cityRequest }));
      } else {
        console.log("ESP not connected");
      }
      return;
  }

    //Weather from ESP
    if (data.temperature) {
      console.log("Weather received:", data);
      await Weather.create(data);
      broadcastToBrowsers(data);
      return;
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
