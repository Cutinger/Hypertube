const multer = require('multer');
const DIR = './public/';
const uuid = require('uuid/v4');
const mongoose          = require('mongoose').connection
const db                = mongoose.connection;
const User              = require('../../../models/User.js');

require('dotenv').config();


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, DIR);
    },
    filename: (req, file, cb) => {
        const fileName = file.originalname.toLowerCase().split(' ').join('-');
        cb(null, uuid() + '-' + fileName)
    }
});

const upload = multer({
    fileFilter: (req, file, cb) => {
        if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
            cb(null, true);
        } else {
            cb(null, false);
            return false;
        }
    },
    storage: storage
});

async function uploadPhoto(req, res) {
    const userID = res.locals.id;
    const pathImg = `http://localhost:5000/${req.file.path}`;
    const fsize = req.file.size;

    const file = Math.round((fsize / 1024));
    if (file >= 2048) {
        return res.status(400).json({});
    } else {
        try {
            let data = await User.findOne({_id: userID});
            i


        } catch (err){
            console.log(err);
            return res.status(400).json({})
        }
    }
}


exports.uploadPhoto = uploadPhoto;
exports.storage = storage;
exports.upload = upload;
