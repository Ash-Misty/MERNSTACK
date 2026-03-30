const express = require("express");
const WebSocket = require("ws");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());


//  MongoDB
mongoose.connect("mongodb+srv://AshMisty:Ashini%402006@cluster0.walx9gm.mongodb.net/esp32")
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("MongoDB Error:", err));

// Time Formatter
function getLocalTime() {
  const now = new Date();

  return now.toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });
}

//  Schema
const logSchema = new mongoose.Schema({
  type: String,        // sensor | led | control
  status: String,      // SAFE / INTRUSION / ON / OFF / START / STOP
  motion: Boolean,
  distance: Number,
  time: String,
  createdAt: { type: Date, default: Date.now }
});

const Log = mongoose.model("Log", logSchema);

// HTTP SERVER
// const server = app.listen(3000,'0.0.0.0', () => {
//   console.log(" Server running on port 3000");
// });
const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});

// WebSocket SERVER
const wss = new WebSocket.Server({ server });

let esp32Client = null;

wss.on("connection", (ws) => {
  console.log(" Client connected");

  ws.on("message", async (message) => {
    let msg;

    //  SAFE PARSE
    try {
      msg = JSON.parse(message.toString());
    } catch (e) {
      console.log("❌ Invalid JSON");
      return;
    }

    console.log(" Message:", msg);

    //  ESP32 REGISTER
    if (msg.type === "esp32_connect") {
      esp32Client = ws;
      console.log(" ESP32 registered");

      ws.send(JSON.stringify({
        type: "connection",
        status: "ESP32_CONNECTED"
      }));
      return;
    }

    //  SENSOR DATA FROM ESP32
    if (msg.type === "sensor") {

      const payload = {
        type: "sensor",
        motion: msg.motion ?? false,
        distance: msg.distance ?? 0,
        status: msg.status ?? "SAFE",
        time: getLocalTime()
      };

      await Log.create(payload);

      // Broadcast to all apps
      wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify(payload));
        }
      });

      return;
    }

    // LED CONTROL FROM APP
    if (msg.type === "led") {

      const payload = {
        type: "led",
        status: msg.value,
        time: getLocalTime()
      };

      if (esp32Client && esp32Client.readyState === WebSocket.OPEN) {
        esp32Client.send(JSON.stringify(msg));
      } else {
        console.log(" ESP32 not connected");
      }

      await Log.create(payload);
      return;
    }

    //  SENSOR CONTROL 
    if (msg.type === "control") {

      const action = msg.action === "start" ? "START" : "STOP";

      const payload = {
        type: "control",
        status: action,
        time: getLocalTime()
      };

      // Forward to ESP32
      if (esp32Client && esp32Client.readyState === WebSocket.OPEN) {
        esp32Client.send(JSON.stringify(msg));
        console.log(` Sent ${action} to ESP32`);
      } else {
        console.log(" ESP32 not connected");
      }

      // Save log
      await Log.create(payload);

      wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify(payload));
        }
      });

      return;
    }

  });

  //  DISCONNECT
  ws.on("close", () => {
    console.log("Client disconnected");

    if (ws === esp32Client) {
      esp32Client = null;
      console.log(" ESP32 disconnected");
    }
  });

  ws.on("error", (err) => {
    console.error(" WebSocket error:", err);
  });
});

