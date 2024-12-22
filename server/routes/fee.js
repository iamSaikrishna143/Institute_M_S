const express = require("express");
const router = express.Router();

// Define your routes here
router.post("add-fee", (req, res) => {
    res.status(200).json({
        msg:"Add new fee request"
      })
});

// Export the router
module.exports = router;
