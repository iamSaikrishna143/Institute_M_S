const express = require("express");
const router = express.Router();
const cloudinary = require("cloudinary").v2;
require("dotenv").config();
const User = require("../model/User");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

// Sign up
router.post("/signup", (req, res) => {
  User.find({ email: req.body.email }).then((users) => {
    if (users.length > 0) {
      return res.status(500).json({
        error: "email already registered...",
      });
    }
    cloudinary.uploader.upload(req.files.image.tempFilePath, (err, result) => {
      // console.log(result);

      bcrypt.hash(req.body.password, 10, (err, hash) => {
        if (err) {
          return res.status(500).json({
            error: err,
          });
        }
        const newUser = new User({
          _id: new mongoose.Types.ObjectId(), // Create a new ObjectId
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          email: req.body.email,
          password: hash,
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
  });
});

// login
router.post("/login", (req, res) => {
  User.find({ email: req.body.email }).then((users) => {
    if (users.length == 0) {
      return res.status(500).json({
        msg: "email not registered",
      });
    }
    bcrypt.compare(req.body.password, users[0].password, (err, result) => {
      if (!result) {
        return res.status(500).json({
          error: "password matching fail....",
        });
      }
      const token = jwt.sign(
        {
          email: users[0].email,
          firstName: users[0].firstName,
          lastName: users[0].lastName,
          uId: users[0]._id,
        },
        "ererersdsvvvcvhg",
        { expiresIn: "365d" }
      );
      res.status(200).json({
        _id: users[0]._id, // Return the user's ID
        firstName: users[0].firstName,
        lastName: users[0].lastName,
        email: users[0].email,
        imageUrl: users[0].imageUrl,
        imageId: users[0].imageId,
        token: token,// Return the JWT token
      });
    });
  });
});

// Export the router
module.exports = router;
