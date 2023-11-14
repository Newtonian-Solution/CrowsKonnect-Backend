const { promisify } = require("util");
const User = require("../models/userModel");
const Order = require("../models/orderModel");
const pushController = require("./pushNotificationController");
const AppError = require("../utils/appError");
const sms = require("./smsController");
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
    var doc;
    if(req.body.status != '3'){
      doc = await Order.findByIdAndUpdate(req.params.id, req.body, {
          new: true,
          runValidators: true
      });
  }

    if (!doc) {
        return next(new AppError(404, 'fail', 'No order found with that id'), req, res, next);
    }
    
    const owner = await User.findById(doc.owner);

    switch(req.body.status) {
      case "1":
        pushController.pushNotification(owner.deviceToken, 'Order Assigned', `Your Order (${doc.category}) has been assigned`);
        break;
      case "2":
        await sms.sendSMS(doc, owner.firstname, owner.phoneNumber);
        pushController.pushNotification(owner.deviceToken, 'Order In-Progress', `Order (${doc.category}) Pick-Up confirmed`);
        break;
      case "3":
        if(doc.verifyCode == req.body.otp){
          next(new AppError(404, 'fail', 'Incorrect Code!'), req, res, next);
        }
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
    const closestUsers = await User.find({
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [req.body.pickUp.lng, req.body.pickUp.lat],
          },
          $maxDistance: 1000, 
        },
      },
    }).limit(5);
    if(closestUsers.length > 0){
      for(let users of closestUsers) {
        await pushController.pushNotification(users.deviceToken, 'New Order Alert', `A new Order is near you. Open the App to pick it up.`);
      }
    }
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
