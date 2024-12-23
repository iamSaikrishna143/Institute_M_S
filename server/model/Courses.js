const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({
  _id: mongoose.Types.ObjectId,
  courseName: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  descrption: {
    type: String,
    required: true,
  },
  startingDate: {
    type: String,
    required: true,
  },
  endDate: {
    type: String,
    required: true,
  },
  imageUrl: { type: String },
  imageId: { type: String },
  uId: {
    type: String,
    required: true,
  },
});
module.exports = mongoose.model("Course", courseSchema);
