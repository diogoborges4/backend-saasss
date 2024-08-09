const mongoose = require("mongoose");
const { Schema } = mongoose;

const pagamentoSchema = new Schema(
  {
    id: String,
    status: String,
    detail: Object,
  },
  {
    timestamps: true,
  }
);

const Payment = mongoose.model("Payment", pagamentoSchema);

module.exports = Payment;
