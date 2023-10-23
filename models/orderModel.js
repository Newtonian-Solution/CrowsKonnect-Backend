const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const orderSchema = new mongoose.Schema({
  type: {
    type: String,
    required: [true, "Please fill order type"],
  },
  category: {
    type: String,
    required: [true, "Please fill order category"],
  },
  amount: {
    type: String,
    required: [true, "Please fill the amount offered"],
  },
  weight: {
    type: String,
    required: [true, "Please fill the package weight"],
  },
  pickUpPoint: {
    type: Object,
    required: [true, "Please fill your pickup point"],
  },
  destination: {
    type: Object,
    required: [true, "Please fill order Destination"],
  },
  receiverName: {
    type: String,
    required: [true, "Please fill Receiver's Name"],
  },
  receiverNumber: {
    type: String,
    required: [true, "Please fill Receiver's Number"],
  },
  deliveryMan: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false,
  },
  owner: {
    type: String,
    required: [true, "Unknown User"]
  },
  status: {
    type: Number,
    default: 0
  },
  dateAdded: {
    type: Date,
    default: new Date(),
  },
  active: {
    type: Boolean,
    default: true,
    select: false,
  },
});

const Order = mongoose.model("Order", orderSchema);
module.exports = Order;