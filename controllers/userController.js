const User = require('../models/userModel');
const base = require('./baseController');

exports.deleteMe = async (req, res, next) => {
    try {
        await User.findByIdAndUpdate(req.user.id, {
            active: false
        });

        res.status(204).json({
            status: 'success',
            data: null
        });


    } catch (error) {
        next(error);
    }
};

exports.getAllUsers = base.getAll(User);
exports.getUser = base.getOne(User);

// Don't update password on this 
exports.updateUser = base.updateOne(User);
exports.deleteUser = base.deleteOne(User);

exports.updateUserLocaton = async (req, res, next) => {
    try {
        const user = await User.findByIdAndUpdate(
            req.user._id,
          {
            $set: {
              location: {
                type: 'Point',
                coordinates: [req.body.lng, req.body.lat],
              },
            },
          },
          { new: true }
        );
        console.log('User location updated:', user);
        res.status(201).json({
            status: "success",
            data: {
              user,
            },
          });
      } catch (error) {
        next(error);
      }
}