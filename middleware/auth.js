// middleware/auth.js

const API_KEY = "my-secret-api-key";

const authenticate = (req, res, next) => {
  const apiKey = req.headers["x-api-key"]; // Common header for API keys

  if (!apiKey) {
    return res.status(401).send("Unauthorized: API Key missing");
  }

  if (apiKey !== API_KEY) {
    return res.status(403).send("Forbidden: Invalid API Key");
  }

  next(); // API Key is valid, proceed
};

module.exports = authenticate;
