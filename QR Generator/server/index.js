const path = require("path");
require("dotenv").config({
  path: path.join(__dirname, "..", ".env"),
});

const express = require("express");
const cors = require("cors");
const { generatePayload, resolveShortUrl } = require("./services/urlService");

const app = express();
const PORT = process.env.PORT || 3000;
const publicDir = path.join(__dirname, "..", "public");

// Render and similar platforms forward protocol headers through a proxy.
app.set("trust proxy", 1);
app.use(cors());
app.use(express.json());
app.use(express.static(publicDir));

app.post("/generate", async (req, res) => {
  try {
    const { url, type } = req.body || {};
    const payload = await generatePayload(url, type, req);
    res.status(200).json({
      success: true,
      message: "Generated successfully.",
      data: payload,
    });
  } catch (error) {
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({
      success: false,
      message: error.message || "Something went wrong.",
    });
  }
});

app.get("/:id", (req, res, next) => {
  const originalUrl = resolveShortUrl(req.params.id);

  if (!originalUrl) {
    return next();
  }

  return res.redirect(originalUrl);
});

app.use((error, req, res, next) => {
  if (error instanceof SyntaxError && "body" in error) {
    return res.status(400).json({
      success: false,
      message: "Invalid JSON payload.",
    });
  }

  return next(error);
});

app.get("*", (req, res) => {
  res.sendFile(path.join(publicDir, "index.html"));
});

app.listen(PORT, () => {
  console.log(`Smart URL Tool is running on port ${PORT}`);
});
