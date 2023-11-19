const flutterwave = require('../utils/flwFeatures');
const Wallet = require('../models/walletModel');
const User = require('../models/userModel');
const pushController = require("./pushNotificationController");
const fcmController = require("./fcmController");

exports.history = async (req, res, next) => {
    try {
        const history = await Wallet.find({ user: req.user._id });
        res.status(200).json({
            status: 'success',
            history
        });
      } catch (error) {
        next(error);
      }
}
exports.getBanks = async (req, res, next) => {
    try {
        const banks = await flutterwave.getBanks();
        if (banks.status == "success") {
            const list = banks.data;
            res.status(200).json({
                status: 'success',
                banks
            })
        }
    } catch (err) {
        next(err)
    }
}

exports.getAccountDetails = async (req, res, next) => {
    try {
        const data = {
            "account_number": req.body.account_number,
            "account_bank": req.body.account_bank
        };
        const details = await flutterwave.resolveAcct(data);
        res.status(200).json({
            status: 'success',
            details
        })
    } catch (err) {
        next(err)
    }
}

exports.verifyDeposit = async (req, res, next) => {
    try {
        const result = await Wallet.findOne({ tx_id: req.params.id });
        if(result) {
            throw new Error("Transaction has been verified");
        }
        const deposit = await flutterwave.verifyTrx(req.params.id);
        if (deposit.status == "success") {
            const data = deposit.data;
            const wallet = await Wallet.create({
                user: req.user._id,
                type: "credit",
                tx_ref: data.tx_ref,
                tx_id: data.id,
                amount: data.charged_amount,
                details: data,
              });
            await User.updateOne({ _id: req.user._id }, { $inc: { balance: Number(data.charged_amount) } });
            const user = await User.findById(req.user._id);
            fcmController.sendMessage(user.deviceToken, 'Deposit Completed', `Your ₦${data.amount} deposit has been completed`);
            res.status(200).json({
                status: 'success',
                wallet
            })
        }else {
            throw new Error("Unable to verify Deposit.");
        }
    } catch (err) {
        next(err)
    }
}

exports.verifyBVN = async (req, res, next) => {
    try {
        const deposit = await flutterwave.checkBVN(req.body.bvn);
        //if (deposit.status == "success") {
            res.status(200).json({
                status: 'success',
                data: {
                    deposit
                }
            })
        //}
    } catch (err) {
        next(err)
    }
}

exports.otp = async (req, res, next) => {
    const ot = await flutterwave.createOTP();
    res.send(ot)
}

exports.withdrawal = async (req, res, next) => {
    try {
        const data = {
            "amount": req.body.amount,
            "account_number": req.body.account_number,
            "bank_id": req.body.bank_id
        }
        const withdraw = await flutterwave.initTransfer(data);
        await User.updateOne({ _id: req.user._id }, { $inc: { balance: -Number(req.body.amount) } });
        const user = await User.findById(req.user._id);
        fcmController.sendMessage(user.deviceToken, 'Withdrawal Completed', `Your ₦${req.body.amount} withdrawal has been completed`);
        
        //if (deposit.status == "success") {
            res.status(200).json({
                status: 'success',
                data: {
                    withdraw
                }
            })
        //}
    } catch (err) {
        next(err)
    }
}