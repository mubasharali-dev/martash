const express = require('express');
const User = require('../model/user'); // Replace with your actual user model path
const multer = require('multer'); // For image upload

const router = express.Router();

// Configure storage for uploaded avatars
const storage = multer.diskStorage({
  destination: 'uploads/', // Folder to store uploads
  filename: (req, file, cb) => {
    cb(null, Date.now().toString() + '-' + file.originalname); // Generate unique filename
  },
});

const upload = multer({ storage: storage });

// Route for creating user
router.post('/create-user', upload.single('file'), async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const avatar = req.file ? req.file.filename : null; // Get avatar filename

    // Validate user data (implement your validation logic)
    // ...

    // Create and save new user
    const user = new User({ name, email, password, avatar });
    await user.save();

    res.status(201).json({ message: 'User created successfully!', user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
