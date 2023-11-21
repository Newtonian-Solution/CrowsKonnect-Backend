const { promisify } = require("util");
const User = require("../models/userModel");
const Order = require("../models/orderModel");
const pushController = require("./pushNotificationController");
const fcmController = require("./fcmController");
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
    } else {
      doc = await Order.findById(req.params.id);
    }

    if (!doc) {
        return next(new AppError(401, 'fail', 'No order found with that id'), req, res, next);
    }
    
    const owner = await User.findById(doc.owner);
    const deliveryman = doc.deliveryMan == ""? null : await User.findById(doc.deliveryMan);

    switch(req.body.status) {
      case "1":
        fcmController.sendMessage(owner.deviceToken, 'Order Assigned', `Your Order (${doc.category}) has been assigned`);
        break;
      case "2":
        await sms.sendSMS(doc, owner.firstname, owner.phoneNumber, deliveryman.firstname);
        fcmController.sendMessage(owner.deviceToken, 'Order In-Progress', `Order (${doc.category}) Pick-Up confirmed`);
        break;
      case "3":
        if(doc.verifyCode != req.body.otp){
          return next(new AppError(401, 'fail', 'Incorrect Code!'), req, res, next);
        }
        await User.updateOne({ _id: deliveryman._id }, { $inc: { pendingBalance: Number(doc.amount) } });
        await Order.findByIdAndUpdate(req.params.id, req.body, {
          new: true,
          runValidators: true
      });
        //fcmController.sendMessage(owner.deviceToken, 'Order Completed', `Your Order (${doc.category}) has been delivered successfully`);
        fcmController.sendMessage(deliveryman.deviceToken, 'Order Completed', `You've delivered Order (${doc.category}) successfully`);
        break;
      case "4":
        fcmController.sendMessage(owner.deviceToken, 'Order Deleted', `Your Order (${doc.category}) has been deleted`);
        break;
      case "5":
        fcmController.sendMessage(deliveryman.deviceToken, 'Order Assigned', `Kindly confirm Order (${doc.category}) Pick-Up`);
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
    
    const owner = await User.findById(req.user._id);
    await User.updateOne({ _id: req.user._id }, { $inc: { balance: -Number(req.body.amount) } });
    fcmController.sendMessage(owner.deviceToken, 'Order Created', `Your Order (${req.body.category}) has been created`);
    const closestUsers = await User.find({
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [req.body.pickUp.lat, req.body.pickUp.lng],
          },
          $maxDistance: 1000, 
        },
      },
    }).limit(5);
    if(closestUsers.length > 0){
      for(let users of closestUsers) {
        if(users.deviceToken != owner.deviceToken){
          await fcmController.sendMessage(users.deviceToken, 'New Order Alert', `A new Order is near you. Open the App to pick it up.`);
        }
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
