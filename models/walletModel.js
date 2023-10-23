const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const walletSchema = new mongoose.Schema({
  user: {
    type: String,
    required: [true, "Please fill User"]
  },
  type: {
    type: String,
    required: [true, "Please fill tx type"],
  },
  tx_ref: {
    type: String,
    required: [true, "Please fill tx ref"],
  },
  tx_id: {
    type: String,
    required: [true, "Please fill the tx id"],
  },
  amount: {
    type: String,
    required: [true, "Please fill the tx amount"],
  },
  details: {
    type: Object,
    default: {}
  },
  dateAdded: {
    type: Date,
    default: new Date(),
  },
});

const Wallet = mongoose.model("Wallet", walletSchema);
module.exports = Wallet;