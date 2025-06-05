// Task 1: Express.js Setup
const express = require("express");
const authenticate = require("./middleware/auth");
const validateProduct = require("./middleware/productValidation");
const NotFoundError = require("./errors/notFoundError");
const ValidationError = require("./errors/validationError");
const asyncHandler = require("./middleware/asyncHandler");
const app = express();
const PORT = process.env.PORT || 3000;

// Task 3: Middleware Setup
const logger = require("./middleware/logger");

app.use(logger); // Use the logger middleware for all routes

app.use(express.json());

app.use("/api/products", authenticate); //applies to all routes starting with /api/products
// Task 2: RESTful API Routes
// In-memory data store for products
let products = [
  {
    id: "1",
    name: "Laptop",
    description: "Powerful laptop for work and gaming",
    price: 1200,
    category: "Electronics",
    inStock: true,
  },
  {
    id: "2",
    name: "Mouse",
    description: "Wireless optical mouse",
    price: 25,
    category: "Electronics",
    inStock: true,
  },
  {
    id: "3",
    name: "Keyboard",
    description: "Mechanical gaming keyboard",
    price: 75,
    category: "Electronics",
    inStock: false,
  },
  {
    id: "4",
    name: "Monitor",
    description: "27-inch 4K display",
    price: 300,
    category: "Electronics",
    inStock: true,
  },
];

//   Implement RESTful Routes
// GET all products
app.get("/api/products", (req, res) => {
  res.json(products);
});

// Refactor GET /api/products/:id with asyncHandler
app.get(
  "/api/products/:id",
  authenticate,
  asyncHandler(async (req, res, next) => {
    await new Promise((resolve) => setTimeout(resolve, 50));

    const { id } = req.params;
    const product = products.find((p) => p.id === id);

    if (product) {
      res.json(product);
    } else {
      throw new NotFoundError(`Product with ID ${id} not found`);
    }
  })
);

// Refactor PUT /api/products/:id to use NotFoundError
app.put(
  "/api/products/:id",
  authenticate,
  validateProduct,
  (req, res, next) => {
    const { id } = req.params;
    const { name, description, price, category, inStock } = req.body;

    const productIndex = products.findIndex((p) => p.id === id);

    if (productIndex !== -1) {
      products[productIndex] = {
        ...products[productIndex],
        name: name !== undefined ? name : products[productIndex].name,
        description:
          description !== undefined
            ? description
            : products[productIndex].description,
        price: price !== undefined ? price : products[productIndex].price,
        category:
          category !== undefined ? category : products[productIndex].category,
        inStock:
          inStock !== undefined ? inStock : products[productIndex].inStock,
      };
      res.json(products[productIndex]);
    } else {
      next(new NotFoundError(`Product with ID ${id} not found`)); // Use custom error
    }
  }
);

// Refactor DELETE /api/products/:id to use NotFoundError
app.delete("/api/products/:id", authenticate, (req, res, next) => {
  const { id } = req.params;
  const initialLength = products.length;
  products = products.filter((p) => p.id !== id);

  if (products.length < initialLength) {
    res.status(204).send();
  } else {
    next(new NotFoundError(`Product with ID ${id} not found`)); // Use custom error
  }
});

app.get("/", (req, res) => {
  res.send("Hello, World!");
});

// Global error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.statusCode || 500).json({
    message: err.message || "Something went wrong!",
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Open your browser at http://localhost:${PORT}`);
});
