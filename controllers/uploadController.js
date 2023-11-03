var cloudinary = require('cloudinary').v2;
let streamifier = require('streamifier');
cloudinary.config({ 
    cloud_name: 'dgmi44qlh', 
    api_key: '672574847464239', 
    api_secret: 'fVFV0RrAMYtIJNdM8Rr24pSUAq8',
    secure: true
  });

exports.uploadImage = async (path) => {
    return new Promise((resolve, reject) => {
        try {
            const upload = cloudinary.uploader.upload_stream({ folder: "foo" }, function(error, result) {
                if (error) {
                    reject(error);
                } else {
                    resolve(result.secure_url);
                }
            });
            streamifier.createReadStream(path.buffer).pipe(upload);
        } catch (err) {
            reject(err);
        }
    });
} 