# Express.js Products API

A simple RESTful API built with Express.js for managing product data, including features like authentication, validation, error handling, filtering, pagination, and search.

## Features

- **RESTful API:** Standard HTTP methods (GET, POST, PUT, DELETE) for product management.
- **In-Memory Data Store:** Simple product data managed in an array (can be easily swapped for a database).
- **Custom Logger Middleware:** Logs incoming request details to the console.
- **JSON Body Parsing:** Handles JSON payloads in request bodies.
- **API Key Authentication:** Secures API endpoints using an `X-API-Key` header.
- **Product Validation:** Ensures data integrity for product creation and updates.
- **Global Error Handling:** Centralized error management with custom error classes (e.g., `NotFoundError`, `ValidationError`).
- **Query Parameters:** Filter products by `category`.
- **Pagination:** Limit and offset product listings using `page` and `limit` parameters.
- **Search:** Search products by `name` or `description` using a `searchTerm` parameter.
- **Product Statistics:** Endpoint to get aggregated data like category counts and average price.

**Install Node.js dependencies:**
`bash
    npm install
    `

## Usage

To start the API server:

```bash
node app.js
```
