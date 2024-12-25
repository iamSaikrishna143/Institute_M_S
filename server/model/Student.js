const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema(
  {
    _id: mongoose.Types.ObjectId,
    fullName: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    address: { type: String, required: true },
    courseId: { type: String, required: true },
    imageUrl: { type: String },
    imageId: { type: String },
    uId: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model("Student", studentSchema);
