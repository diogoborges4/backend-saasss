const mongoose = require("mongoose");
const productSchema = require("./Products");
const { Schema } = mongoose;

const userSchema = new Schema(
  {
    name: String,
    email: String,
    password: String,
    products: [{ type: Schema.Types.ObjectId, ref: "Product" }],
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
