var cloudinary = require('cloudinary').v2;
cloudinary.config({ 
    cloud_name: 'dgmi44qlh', 
    api_key: '672574847464239', 
    api_secret: 'fVFV0RrAMYtIJNdM8Rr24pSUAq8',
    secure: true
  });

exports.uploadImage = async (path) => {
    try {
        const upload = await cloudinary.uploader.upload(path);
        return upload;
    } catch (err) {

    }
} 