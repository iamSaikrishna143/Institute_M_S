const express = require("express");
const router = express.Router();
const checkAuth = require("../middlware/checkAuth");
const Course = require("../model/Courses");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const cloudinary = require("cloudinary").v2;
require("dotenv").config();
const Student = require("../routes/student");

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

// Define your routes here
router.post("/:id", checkAuth, (req, res) => {
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
router.get("/course-detail/:id", checkAuth, (req, res) => {
  Course.findById(req.params.id)
    .select(
      "_id uId courseName price startingDate endDate descrption imageUrl imageId"
    )
    .then((result) => {
      Student.find({ courseId: req.params.id }).then((student) => {
        res.status(200).json({
          courses: result,
          studentList: students,
        });
      });
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
});

// Delete Course
router.delete("/:id", checkAuth, (req, res) => {
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
router.put("/:id", checkAuth, (req, res) => {
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
        cloudinary.uploader.destroy(course.imageId, (deletedImage) => {
          cloudinary.uploader.upload(
            req.files.image.tempFilePath,
            (err, result) => {
              const newUpdatedCourse = {
                courseName: req.body.courseName,
                price: req.body.price,
                descrption: req.body.descrption,
                startingDate: req.body.startingDate,
                endDate: req.body.endDate,
                uId: verify.uId, // user id
                imageUrl: result.secure_url,
                imageId: result.public_id,
              };
              Course.findByIdAndUpdate(req.params.id, newUpdatedCourse, {
                new: true,
              })
                .then((data) => {
                  res.status(200).json({
                    updatedCourse: data,
                  });
                })
                .catch((err) => {
                  console.log(err);
                  res.status(500).json({
                    error: err,
                  });
                });
            }
          );
        });
      } else {
        const updataData = {
          courseName: req.body.courseName,
          price: req.body.price,
          descrption: req.body.descrption,
          startingDate: req.body.startingDate,
          endDate: req.body.endDate,
          uId: verify.uId, // user id
          imageUrl: course.imageUrl,
          imageId: course.imageId,
        };
        Course.findByIdAndUpdate(req.params.id, updataData, { new: true })
          .then((data) => {
            res.status(200).json({
              updataData: data,
            });
          })
          .catch((err) => {
            res.status(500).json({
              error: err,
            });
          });
      }
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
});

//get latest 5 courses data
router.get("/latest-courses", checkAuth, (req, res) => {
  const token = req.headers.authorization.split(" ")[1];
  const verify = jwt.verify(token, "ererersdsvvvcvhg");
  Course.find({ uId: verify.uId })
    // .select('_id uId fullName phone address email courseId imageUrl imageId')
    .sort({ $natural: -1 })
    .limit(5)
    .then((data) => {
      res.status(200).json({
        courses: data,
      });
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
});

// Export the router
module.exports = router;
