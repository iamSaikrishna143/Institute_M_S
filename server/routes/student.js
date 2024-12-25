const express = require("express");
const router = express.Router();
const checkAuth = require("../middlware/checkAuth");
const Student = require("../model/Student");
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
router.post("add-student", (req, res) => {
  res.status(200).json({
    msg: "add new student request",
  });
});

// Add new std
router.post("/add-student", checkAuth, (req, res) => {
  const token = req.headers.authorization.split(" ")[1];
  const verify = jwt.verify(token, "ererersdsvvvcvhg");
  // console.log(verify);

  cloudinary.uploader.upload(req.files.image.tempFilePath, (err, result) => {
    const newStudent = new Student({
      _id: new mongoose.Types.ObjectId(),
      fullName: req.body.fullName,
      phone: req.body.phone,
      email: req.body.email,
      courseId: req.body.courseId,
      address: req.body.address,
      uId: verify.uId, // user id
      imageUrl: result?.secure_url,
      imageId: result.public_id,
    });
    newStudent
      .save()
      .then((result) => {
        res.status(200).json({
          newStudent: result,
        });
      })
      .catch((err) => {
        res.status(500).json({
          error: err,
        });
      });
  });
});

// Get all own Students
router.get("/all-students", checkAuth, (req, res) => {
  const token = req.headers.authorization.split(" ")[1];
  const verify = jwt.verify(token, "ererersdsvvvcvhg");

  Student.find({ uId: verify.uId })
    .select("_id uId fullName phone address email courseId imageUrl imageId")
    .then((result) => {
      res.status(200).json({
        students: result,
      });
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
});

// Get own all Students for a course
router.get("/all-students/:courseId", checkAuth, (req, res) => {
  const token = req.headers.authorization.split(" ")[1];
  const verify = jwt.verify(token, "ererersdsvvvcvhg");

  Student.find({ uId: verify.uId, courseId: req.params.courseId })
    .select("_id uId fullName phone address email courseId imageUrl imageId")
    .then((result) => {
      res.status(200).json({
        students: result,
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

  Student.findById(req.params.id).then((student) => {
    console.log(student);
    if (student.uId == verify.uId) {
      Student.findByIdAndDelete(req.params.id)
        .then((result) => {
          cloudinary.uploader.destroy(student.imageId, (deletedImage) => {
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
  Student.findById(req.params.id)
    .then((student) => {
      if (verify.uId != student.uId) {
        return res.status(500).json({
          error: "you are not eligible to update this data",
        });
      }
      if (req.files) {
        cloudinary.uploader.destroy(student.imageId, (deletedImage) => {
          cloudinary.uploader.upload(
            req.files.image.tempFilePath,
            (err, result) => {
              const newUpdatedStudent = {
                fullName: req.body.fullName,
                phone: req.body.phone,
                email: req.body.email,
                courseId: req.body.courseId,
                address: req.body.address,
                uId: verify.uId, // user id
                imageUrl: result?.secure_url,
                imageId: result.public_id,
              };
              Student.findByIdAndUpdate(req.params.id, newUpdatedStudent, {
                new: true,
              })
                .then((data) => {
                  res.status(200).json({
                    updatedStudent: data,
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
          fullName: req.body.fullName,
          phone: req.body.phone,
          email: req.body.email,
          courseId: req.body.courseId,
          address: req.body.address,
          uId: verify.uId, // user id
          imageUrl: student.imageUrl,
          imageId: student.imageId,
        };
        Student.findByIdAndUpdate(req.params.id, updataData, { new: true })
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

//get latest 5 students data
router.get("/latest-students", checkAuth, (req, res) => {
  const token = req.headers.authorization.split(" ")[1];
  const verify = jwt.verify(token, "ererersdsvvvcvhg");
  Student.find({ uId: verify.uId })
    // .select('_id uId fullName phone address email courseId imageUrl imageId')
    .sort({ $natural: -1 })
    .limit(5)
    .then((data) => {
      res.status(200).json({
        students: data,
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
