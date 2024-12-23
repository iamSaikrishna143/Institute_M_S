const express = require("express");
const router = express.Router();
const checkAuth = require("../middlware/checkAuth");
const Course = require("../model/Courses");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const cloudinary = require("cloudinary").v2;
require("dotenv").config();

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

// Define your routes here
router.post("/add-course", checkAuth, (req, res) => {
  const token = req.headers.authorization.split(" ")[1];
  const verify = jwt.verify(token, "ererersdsvvvcvhg");
  // console.log(verify);

  cloudinary.uploader.upload(req.files.image.tempFilePath, (err, result) => {
    const newCourse = new Course({
      _id: new mongoose.Types.ObjectId(),
      courseName: req.body.courseName,
      price: req.body.price,
      descrption: req.body.descrption,
      startingDate: req.body.startingDate,
      endDate: req.body.endDate,
      uId: verify.uId, // user id
      imageUrl: result.secure_url,
      imageId: result.public_id,
    });
    newCourse
      .save()
      .then((result) => {
        res.status(200).json({
          newCourse: result,
        });
      })
      .catch((err) => {
        res.status(500).json({
          error: err,
        });
      });
  });
});

// Get all course
router.get("/all-course", checkAuth, (req, res) => {
  const token = req.headers.authorization.split(" ")[1];
  const verify = jwt.verify(token, "ererersdsvvvcvhg");
  Course.find({ uId: verify.uId })
    .select(
      "_id uId courseName price startingDate endDate descrption imageUrl imageId"
    )
    .then((result) => {
      res.status(200).json({
        courses: result,
      });
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
});

// Get one course
router.get("/courses-detail/:id", checkAuth, (req, res) => {
  Course.findById(req.params.id)
    .select(
      "_id uId courseName price startingDate endDate descrption imageUrl imageId"
    )
    .then((result) => {
      res.status(200).json({
        courses: result,
      });
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
});

// Delete Course
router.delete("/courses-detail/:id", checkAuth, (req, res) => {
  const token = req.headers.authorization.split(" ")[1];
  const verify = jwt.verify(token, "ererersdsvvvcvhg");

  Course.findById(req.params.id).then((course) => {
    console.log(course);
    if (course.uId == verify.uId) {
      Course.findByIdAndDelete(req.params.id)
        .then((result) => {
          cloudinary.uploader.destroy(course.imageId, (deletedImage) => {
            res.status(200).json({
              result: result,
            });
          });
        })
        .catch((err) => {
          res.status(500).json({
            msg: err,
          });
        });
    } else {
      res.status(500).json({
        msg: "bad request",
      });
    }
  });
});

// update Course
router.put("/courses-detail/:id", checkAuth, (req, res) => {
  const token = req.headers.authorization.split(" ")[1];
  const verify = jwt.verify(token, "ererersdsvvvcvhg");
  Course.findById(req.params.id)
    .then((course) => {
      if (verify.uId != course.uId) {
        return res.status(500).json({
          error: "you are not eligible to update this data",
        });
      }
      if (req.files) {
        
      } else {
      }
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
});

// Export the router
module.exports = router;
