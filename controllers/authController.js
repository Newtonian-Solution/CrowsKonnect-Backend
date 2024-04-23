const { promisify } = require("util");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const AppError = require("../utils/appError");
const path = require("path");
const fs = require("fs/promises");
const emailController = require("./emailController");
const uploadController = require("./uploadController");
const crypto = require("crypto");

const createToken = (id) => {
  return jwt.sign(
    {
      id,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN,
    }
  );
};

exports.login = async (req, res, next) => {
  try {
    const { email, password, deviceID } = req.body;

    // check if email and password exist
    if (!email || !password) {
      return next(
        new AppError(404, "fail", "Please provide email or password"),
        req,
        res,
        next
      );
    }

    // check if user exist and password is correct
    const user = await User.findOne({
      email,
    }).select("+password");

    if (!user || !(await user.correctPassword(password, user.password))) {
      return next(
        new AppError(401, "fail", "Email or Password is wrong"),
        req,
        res,
        next
      );
    }

    const data = await User.findByIdAndUpdate(
      user._id,
      { deviceToken: deviceID },
      {
        new: true,
        runValidators: true,
      }
    );

    // All correct, send jwt to client
    const token = createToken(user.id);

    // Remove the password from the output
    user.password = undefined;

    res.status(200).json({
      status: "success",
      token,
      data: {
        data,
      },
    });
  } catch (err) {
    next(err);
  }
};

exports.signup = async (req, res, next) => {
  try {
    const checkUser = await User.findOne({
      email: req.body.email,
    });
    if (checkUser) {
      next(
        new AppError(401, "fail", "Email Address Does Not Exists!"),
        req,
        res,
        next
      );
    }

    await User.findByIdAndUpdate(
      checkUser.id,
      { password: req.body.password, status: 1 },
      {
        new: true,
        runValidators: true,
      }
    );
    await emailController.sendWelcome(req.body.email, req.body.firstname);
    checkUser.password = undefined;
    const token = createToken(checkUser.id);
    res.status(201).json({
      status: "success",
      token,
      data: {
        checkUser,
      },
    });
  } catch (err) {
    next(err);
  }
};

exports.webhook = async (req, res, next) => {
  if (true) {
    const { webhookData } = req.body;
    if (webhookData.verificationStatus == "Completed") {
      const checkUser = await User.findOne({
        email: webhookData.data.email.data.email,
      });
      if (checkUser) {
        next(
          new AppError(401, "fail", "Email Address Exists!"),
          req,
          res,
          next
        );
      }
      await User.create({
        firstname: webhookData.userDetails.first_name,
        lastname: webhookData.userDetails.last_ame,
        email: webhookData.data.email.data.email,
        phoneNumber: webhookData.userDetails.phone_number1,
        image: webhookData.userDetails.image_url,
        location: {
          type: "Point",
          coordinates: [0, 0],
        },
        /*passwordConfirm: req.body.passwordConfirm,*/
      });
      res.status(200).json({
        firstname: webhookData.userDetails.first_name,
        lastname: webhookData.userDetails.last_ame,
        email: webhookData.data.email.data.email,
        phoneNumber: webhookData.userDetails.phone_number1,
        image: webhookData.userDetails.image_url,
        location: {
          type: "Point",
          coordinates: [0, 0],
        },
        /*passwordConfirm: req.body.passwordConfirm,*/
      });
    }
  }
  res.sendStatus(401);
};

exports.verifyImage = async (req, res, next) => {
  try {
    const image = req.body.picture;

    const buffer = Buffer.from(image, "base64");
    let token = req.headers.authorization.split(" ")[1];
    const decode = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
    const targetPath = path.join(__dirname, `../upload/${decode.id}.png`);

    const uploadImage = await uploadController.uploadImage(buffer);
    const user = await User.findOne({ _id: decode.id });
    if (!user) {
    }
    var updateData = {
      image: uploadImage,
    };
    if (user.status == 1) {
      updateData = {
        active: true,
        image: uploadImage,
      };
    }
    const updateUser = await User.findByIdAndUpdate(user.id, updateData, {
      new: true,
      runValidators: true,
    });
    if (!user) {
      return next(
        new AppError(404, "fail", "No document found with that id"),
        req,
        res,
        next
      );
    }

    res.status(201).json({
      status: "success",
      token,
      data: {
        updateUser,
      },
    });
  } catch (err) {
    next(err);
  }
};

exports.verifyOtp = async (req, res, next) => {
  try {
    let token = req.headers.authorization.split(" ")[1];
    const decode = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

    const user = await User.findOne({ _id: decode.id });

    if (!user) {
      return next(
        new AppError(
          401,
          "fail",
          "You are not logged in! Please login in to continue"
        ),
        req,
        res,
        next
      );
    } else {
      // User found, check if OTP matches
      var otp = req.body.otp;
      if (user.verifyCode == otp.trim()) {
        var updateData = {
          status: 1,
        };
        if (user.image != "") {
          updateData = {
            active: true,
            status: 1,
          };
        }
        const userUpdate = await User.findByIdAndUpdate(decode.id, updateData, {
          new: true,
          runValidators: true,
        });
        res.status(200).json({
          status: "success",
          token,
          data: {
            userUpdate,
          },
        });
      } else {
        console.log(user);
        return next(new AppError(401, "fail", "Invalid OTP"), req, res, next);
      }
    }

    res.status(201).json({
      status: "success",
      token,
      data: {
        user,
      },
    });
  } catch (err) {
    next(err);
  }
};

exports.protect = async (req, res, next) => {
  try {
    // 1) check if the token is there
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }
    if (!token) {
      return next(
        new AppError(
          401,
          "fail",
          "You are not logged in! Please login in to continue"
        ),
        req,
        res,
        next
      );
    }

    // Verify token
    const decode = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

    // check if the user is exist (not deleted)
    const user = await User.findById(decode.id);
    if (!user) {
      return next(
        new AppError(401, "fail", "This user is no longer exist"),
        req,
        res,
        next
      );
    }

    // if(user.active == false) {
    //   return next(
    //     new AppError(401, "fail", "Kindly verify your account"),
    //     req,
    //     res,
    //     next,
    //   );
    // }

    req.user = user;
    next();
  } catch (err) {
    next(err);
  }
};

// Authorization check if the user have rights to do this action
exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError(403, "fail", "You are not allowed to do this action"),
        req,
        res,
        next
      );
    }
    next();
  };
};
