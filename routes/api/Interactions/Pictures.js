const multer = require('multer');
const DIR = '/public/';
const uuid = require('uuid/v4');
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
    storage: storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
            cb(null, true);
        } else {
            cb(null, false);
            return false;
        }
    }
});

async function uploadPhoto(req, res) {
    const user_id = res.locals.id;

    try {
        const pathImg = req.file.path;
        console.log(pathImg);
        const fsize = req.file.size;
        const file = Math.round((fsize / 1024));
        if (file >= 4096) {
            return res.status(400).json({
                warnings: ["File is too big. Max limit is 4Mb"]
            });
        }
        return res.status(200).json({});

    } catch (error) {
        return res.status(400).json({
            warnings: ["Error during file upload"]
        });
    }
}


exports.uploadPhoto = uploadPhoto;
exports.storage = storage;
exports.upload = upload;
