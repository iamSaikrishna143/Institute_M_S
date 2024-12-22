const express = require("express");
const router = express.Router();

// Define your routes here
router.post("add-student", (req, res) => {
    res.status(200).json({
        msg:"add new student request"
      })
});

// Export the router
module.exports = router;
