const mongoose = require("mongoose");
const { Schema } = mongoose;

const productSchema = new Schema(
  {
    productName: String,
    src: String,
    description: String,
    value: Number,
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
