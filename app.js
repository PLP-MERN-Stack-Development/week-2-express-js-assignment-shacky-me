// app.js

const express = require("express");
const app = express();
const port = 3000;

// --- Task 3: Middleware Implementations ---

// 1. Custom Logger Middleware
const loggerMiddleware = (req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.url}`);
  next(); // Call next to pass control to the next middleware or route handler
};

// Use the custom logger middleware for all requests
app.use(loggerMiddleware);

// 2. Middleware to parse JSON request bodies
app.use(express.json());

// 3. Authentication Middleware (checks for an API key in headers)
const authenticateApiKey = (req, res, next) => {
  const apiKey = req.headers["x-api-key"]; // Common header for API keys
  const validApiKey = "YOUR_SECRET_API_KEY"; // to be replaced with a real, secure API key in a production app

  if (!apiKey) {
    return res
      .status(401)
      .json({ message: "Authorization Required: API Key missing" });
  }

  if (apiKey !== validApiKey) {
    return res.status(403).json({ message: "Forbidden: Invalid API Key" });
  }

  next(); // API Key is valid, proceed to the next middleware or route handler
};

// 4. Validation Middleware for Product Creation and Update
const validateProduct = (req, res, next) => {
  const { name, description, price, category, inStock } = req.body;

  if (!name || typeof name !== "string" || name.trim().length === 0) {
    return res.status(400).json({
      message: "Product name is required and must be a non-empty string.",
    });
  }
  if (
    !description ||
    typeof description !== "string" ||
    description.trim().length === 0
  ) {
    return res.status(400).json({
      message:
        "Product description is required and must be a non-empty string.",
    });
  }
  if (typeof price !== "number" || price <= 0) {
    return res.status(400).json({
      message: "Product price is required and must be a positive number.",
    });
  }
  if (
    !category ||
    typeof category !== "string" ||
    category.trim().length === 0
  ) {
    return res.status(400).json({
      message: "Product category is required and must be a non-empty string.",
    });
  }
  if (typeof inStock !== "boolean") {
    return res.status(400).json({
      message: "Product inStock status is required and must be a boolean.",
    });
  }

  next(); // All validations passed, proceed
};

// In-memory "database" for products
let products = [
  {
    id: "1",
    name: "Laptop",
    description: "Powerful laptop for coding and gaming",
    price: 1200,
    category: "Electronics",
    inStock: true,
  },
  {
    id: "2",
    name: "Keyboard",
    description: "Mechanical keyboard with RGB lighting",
    price: 75,
    category: "Peripherals",
    inStock: true,
  },
  {
    id: "3",
    name: "Mouse",
    description: "Ergonomic wireless mouse",
    price: 50,
    category: "Peripherals",
    inStock: false,
  },
];

// Task 1: "Hello World" route
app.get("/", (req, res) => {
  res.send("Hello World! Welcome to the Products API.");
});

// --- Task 2: RESTful API Routes for products (with middleware applied) ---

// Apply authentication middleware to all /api/products routes
// For simplicity, we're applying it globally here. In a real app, you might apply it to specific routes.
app.use("/api/products", authenticateApiKey);

// GET /api/products: List all products
app.get("/api/products", (req, res) => {
  res.json(products);
});

// GET /api/products/:id: Get a specific product by ID
app.get("/api/products/:id", (req, res) => {
  const productId = req.params.id;
  const product = products.find((p) => p.id === productId);

  if (product) {
    res.json(product);
  } else {
    res.status(404).json({ message: "Product not found" });
  }
});

// POST /api/products: Create a new product (with validation middleware)
app.post("/api/products", validateProduct, (req, res) => {
  const newProduct = req.body;
  // Generate a simple unique ID (in a real app, use a proper UUID generator)
  newProduct.id = (products.length + 1).toString();
  products.push(newProduct);
  res.status(201).json(newProduct); // 201 Created
});

// PUT /api/products/:id: Update an existing product (with validation middleware)
app.put("/api/products/:id", validateProduct, (req, res) => {
  const productId = req.params.id;
  const updatedProductData = req.body;
  let productFound = false;

  products = products.map((p) => {
    if (p.id === productId) {
      productFound = true;
      return { ...p, ...updatedProductData, id: productId }; // Ensure ID remains the same
    }
    return p;
  });

  if (productFound) {
    res.json(products.find((p) => p.id === productId));
  } else {
    res.status(404).json({ message: "Product not found" });
  }
});

// DELETE /api/products/:id: Delete a product
app.delete("/api/products/:id", (req, res) => {
  const productId = req.params.id;
  const initialLength = products.length;
  products = products.filter((p) => p.id !== productId);

  if (products.length < initialLength) {
    res.status(204).send(); // 204 No Content
  } else {
    res.status(404).json({ message: "Product not found" });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Express.js server listening at http://localhost:${port}`);
});
