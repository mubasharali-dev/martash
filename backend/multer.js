const express = require('express');
const path = require('path');
const ErrorHandler = require('../utils/ErrorHandler');
const User = require('../model/user');
const multer = require('multer');
const router = express.Router();

// Multer configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Define the destination directory for your uploads
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

router.post('/create-user', upload.single('avatar'), async (req, res, next) => {
    const { name, email, password } = req.body;

    // Check if the file is uploaded
    if (!req.file) {
        return next(new ErrorHandler('Please upload an avatar', 400));
    }

    const userEmail = await User.findOne({ email });

    if (userEmail) {
        return next(new ErrorHandler('Email already exists', 400));
    }

    const fileUrl = path.join('uploads/', req.file.filename);
    
    const user = await User.create({
        name,
        email,
        password,
        avatar: fileUrl,
    });

    sendToken(user, 201, res);
    console.log(user);
});

module.exports = router;
