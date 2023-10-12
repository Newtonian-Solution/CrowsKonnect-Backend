const { promisify } = require("util");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const Order = require("../models/orderModel");
const AppError = require("../utils/appError");
const path = require("path");
const fs = require("fs/promises");
const base = require('./baseController');

exports.orders = base.getAll(Order);

exports.getOrder = base.getOne(Order);

exports.applyOrder = base.updateOne(Order);

exports.order = async (req, res, next) => {
  try {
    const order = await Order.create({
      type: req.body.type,
      category: req.body.category,
      amount: req.body.amount,
      weight: req.body.weight,
      pickUpPoint: req.body.pickUp,
      destination: req.body.destination,
      receiverName: req.body.receiver,
      receiverNumber: req.body.receiverNo,
      owner: req.user._id,
    });

    res.status(201).json({
      status: "success",
      data: {
        order,
      },
    });
  } catch (err) {
    next(err);
  }
};
