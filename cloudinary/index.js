const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
    cloud_name: 'dli5madxn',
    api_key: '781588924388791',
    api_secret: 'cYTCKw6h04FBsttpBNH_bhr1wZk' 
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'yelpCamp',
        allowedFormats: ['jpeg', 'png', 'jpg']
    }
    
});

module.exports = { cloudinary, storage };   