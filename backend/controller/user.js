const express = require('express');
const User = require('../model/user'); // Replace with your actual user model path
const multer = require('multer'); // For image upload
const jwt = require("jsonwebtoken");
const sendMail = require("../utils/sendMail");
require("dotenv").config({ path: "./backend/.env" });

const router = express.Router();

// Configure storage for uploaded avatars
const storage = multer.diskStorage({
  destination: "uploads/", // Folder to store uploads
  filename: (req, file, cb) => {
    cb(null, Date.now().toString() + "-" + file.originalname); // Generate unique filename
  },
});

const upload = multer({ storage: storage });

// Route for creating user
router.post("/create-user", upload.single("file"), async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const avatar = req.file ? req.file.filename : null; // Get avatar filename

    const userEmail = await User.findOne({ email });

    if (userEmail) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // Create and save new user
    const user = new User({ name, email, password });
    // await user.save();

    const activationToken = createActivationToken(user);
    const activationUrl = `http://localhost:3000/activation/${activationToken}`;

    try {
      await sendMail({
        email: user.email,
        subject: "Account activation link",
        message: `Click on this link to activate your account: ${activationUrl}`,
      });
      res.status(201).json({
        success: true,
        message: `please check your email:- ${user.email} to activate your account!`,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }

    res.status(201).json({ message: "User created successfully!", user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// create activation token
const createActivationToken = (user) => {
  const payload = {
    user, // Assuming you have a unique identifier for the user, like _id
    // Add other necessary properties from the user object
  };
  console.log("payload", payload);

  return jwt.sign(user, process.env.ACTIVATION_SECRET, {
    expiresIn: "5m",
  });
};

module.exports = router;
