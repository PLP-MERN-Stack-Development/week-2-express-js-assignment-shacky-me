// middleware/productValidation.js

const validateProduct = (req, res, next) => {
  const { name, description, price, category, inStock } = req.body;

  if (!name || typeof name !== "string" || name.trim() === "") {
    return res.status(400).json({
      message: "Product name is required and must be a non-empty string.",
    });
  }

  if (price === undefined || typeof price !== "number" || price < 0) {
    return res.status(400).json({
      message: "Product price is required and must be a non-negative number.",
    });
  }

  if (description !== undefined && typeof description !== "string") {
    return res
      .status(400)
      .json({ message: "Product description must be a string." });
  }

  if (category !== undefined && typeof category !== "string") {
    return res
      .status(400)
      .json({ message: "Product category must be a string." });
  }

  if (inStock !== undefined && typeof inStock !== "boolean") {
    return res
      .status(400)
      .json({ message: "Product inStock must be a boolean." });
  }

  next(); // Validation passed, proceed
};

module.exports = validateProduct;
