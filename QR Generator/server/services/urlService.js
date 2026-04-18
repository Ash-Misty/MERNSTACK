const QRCode = require("qrcode");

// This is intentionally in-memory only, so restarting the server resets mappings.
const urlStore = Object.create(null);

function createError(message, statusCode) {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
}

function isValidType(type) {
  return ["short", "qr", "both"].includes(type);
}

function normalizeUrl(input) {
  if (typeof input !== "string") {
    throw createError("A URL is required.", 400);
  }

  const trimmed = input.trim();

  if (!trimmed) {
    throw createError("A URL is required.", 400);
  }

  let parsedUrl;

  try {
    parsedUrl = new URL(trimmed);
  } catch {
    throw createError("Please enter a valid absolute URL.", 400);
  }

  if (!["http:", "https:"].includes(parsedUrl.protocol)) {
    throw createError("Only HTTP and HTTPS URLs are supported.", 400);
  }

  return parsedUrl.toString();
}

function generateShortId(length = 6) {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789";
  let id = "";

  for (let index = 0; index < length; index += 1) {
    const randomIndex = Math.floor(Math.random() * alphabet.length);
    id += alphabet[randomIndex];
  }

  return urlStore[id] ? generateShortId(length) : id;
}

function getBaseUrl(req) {
  return `${req.protocol}://${req.get("host")}`;
}

async function generatePayload(url, type, req) {
  const normalizedUrl = normalizeUrl(url);

  if (!isValidType(type)) {
    throw createError("Type must be short, qr, or both.", 400);
  }

  const payload = {
    type,
    originalUrl: normalizedUrl,
  };

  if (type === "short" || type === "both") {
    const id = generateShortId();
    urlStore[id] = normalizedUrl;
    payload.shortId = id;
    payload.shortUrl = `${getBaseUrl(req)}/${id}`;
  }

  if (type === "qr" || type === "both") {
    payload.qrCodeDataUrl = await QRCode.toDataURL(normalizedUrl, {
      errorCorrectionLevel: "M",
      margin: 1,
      width: 280,
      color: {
        dark: "#14213d",
        light: "#ffffff",
      },
    });
  }

  return payload;
}

function resolveShortUrl(id) {
  return urlStore[id];
}

module.exports = {
  generatePayload,
  resolveShortUrl,
};
