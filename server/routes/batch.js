const express = require("express");
const router = express.Router();

// Define your routes here
router.post("/add-batch", (req, res) => {
    res.status(200).json({
        msg:"add-new batch request"
      })
});
router.get("/", (req, res) => {
    res.status(200).json({
        msg:"get batch request"
      })
});

// Export the router
module.exports = router;
