const express = require("express");
const router = express.Router();
const cloudinary = require("cloudinary").v2;
require("dotenv").config();
const User = require("../model/User");
const mongoose = require("mongoose");

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

// Define your routes here
router.post("/signup", (req, res) => {
  cloudinary.uploader.upload(req.files.image.tempFilePath, (err, result) => {
    // console.log(result);
    const newUser = new User({
      _id: new mongoose.Types.ObjectId, // Create a new ObjectId
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.lastName,
      password: req.body.password,
      imageUrl: result.secure_url,
      imageId: result.public_id, // Store the public ID of the uploaded image
    });
    // Save the new user to the database
    newUser
      .save()
      .then((result) => {
        res.status(200).json({
          newStudent: result,
        });
      })
      .catch((err) => {
        res.status(500).json({ error: err });
      });
  });
});

// Export the router
module.exports = router;
