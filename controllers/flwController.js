const { promisify } = require("util");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const Order = require("../models/orderModel");
const pushController = require("./pushNotificationController")
const AppError = require("../utils/appError");
const path = require("path");
const Flutterwave = require('flutterwave-node-v3');
const base = require('./baseController');

exports.orders = base.getAll(Order);

exports.getOrder = base.getOne(Order);
exports.deleteAll = async (req, res, next) => {
  try {
    await Order.deleteMany({}).then(function(){
      res.send('Deleted')
    })
  } catch(e) {
    res.send('45')
  }
}
exports.createOTP = async (req, res, next) => {
  try {
    const flw = new Flutterwave(process.env.FLW_PUBLIC_KEY, process.env.FLW_SECRET_KEY);
    const payload = {
        "length": 7,
        "customer": { "name": "Nurudeen", "email": "eminentnewtonian@gmail.com", "phone": "2348122647016" },
        "sender": "CrowsKonnect",
        "send": true,
        "medium": ["whatsapp", "sms"],
        "expiry": 5
    }

    const response = await flw.Otp.create(payload)
    res.status(201).json({
      status: "success",
      data: {
        response,
      },
    });
  } catch (err) {
    next(err);
  }
};
