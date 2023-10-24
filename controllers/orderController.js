const { promisify } = require("util");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const Order = require("../models/orderModel");
const pushController = require("./pushNotificationController");
const AppError = require("../utils/appError");
const path = require("path");
const fs = require("fs/promises");
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
exports.applyOrder = async (req, res, next) => {
  try {
    const doc = await Order.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    if (!doc) {
        return next(new AppError(404, 'fail', 'No user found with that id'), req, res, next);
    }
    
    const owner = await User.findById(doc.owner);

    switch(req.body.status) {
      case "1":
        pushController.pushNotification(owner.deviceToken, 'Order Assigned', `Your Order (${doc.category}) has been assigned`);
        break;
      case "2":
        pushController.pushNotification(owner.deviceToken, 'Order In-Progress', `Order (${doc.category}) Pick-Up confirmed`);
        break;
      case "3":
        await User.updateOne({ _id: doc.deliveryMan._id }, { $inc: { pendingBalance: Number(doc.amount) } });
        pushController.pushNotification(owner.deviceToken, 'Order Completed', `Your Order (${doc.category}) has been delivered successfully`);
        pushController.pushNotification(doc.deliveryMan.deviceToken, 'Order Completed', `You've delivered Order (${doc.category}) successfully`);
        break;
      case "4":
        pushController.pushNotification(owner.deviceToken, 'Order Deleted', `Your Order (${doc.category}) has been deleted`);
        break;
      case "5":
        pushController.pushNotification(doc.deliveryMan.deviceToken, 'Order Assigned', `Kindly confirm Order (${doc.category}) Pick-Up`);
        break;
      default:

    }
    if(req.body.status == "1") {
      
    }
    res.status(200).json({
        status: 'success',
        data: {
            doc
        }
    });

} catch (error) {
    next(error);
}
}

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
    await User.updateOne({ _id: req.user._id }, { $inc: { balance: -Number(req.body.amount) } });

    const owner = await User.findById(req.user._id);
    pushController.pushNotification(owner.deviceToken, 'Order Created', `Your Order (${order.category}) has been created`);

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
