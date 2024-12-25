const express = require("express");
const router = express.Router();
const checkAuth = require("../middlware/checkAuth");
const Fee = require("../model/Fee");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

router.post("/add-fee", checkAuth, (req, res) => {
  const token = req.headers.authorization.split(" ")[1];
  const verify = jwt.verify(token, "ererersdsvvvcvhg");

  const newFee = new Fee({
    _id: new mongoose.Types.ObjectId(),
    fullName: req.body.fullName,
    phone: req.body.phone,
    courseId: req.body.courseId,
    uId: verify.uId,
    amount: req.body.amount,
    remark: req.body.remark,
  });
  newFee
    .save()
    .then((result) => {
      res.status(200).json({
        newFee: result,
      });
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
});

// get all fee collection data fro any user
router.get("/payment-history", checkAuth, (req, res) => {
  const token = req.headers.authorization.split(" ")[1];
  const verify = jwt.verify(token, "ererersdsvvvcvhg");

  Fee.find({ uId: verify.uId })
    .then((result) => {
      res.status(200).json({
        paymentHistory: result,
      });
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
});

// get all payments for any students ina course
router.get("/all-payments", checkAuth, (req, res) => {
  const token = req.headers.authorization.split(" ")[1];
  const verify = jwt.verify(token, "ererersdsvvvcvhg");

  Fee.find({
    uId: verify.uId,
    courseId: req.query.courseId,
    phone: req.query.phone,
  })
    .then((result) => {
      res.status(500).json({
        allPayments: result,
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
