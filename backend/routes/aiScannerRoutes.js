const express = require("express");
const multer = require("multer");
const dotenv = require("dotenv");
const axios = require("axios");
const FormData = require("form-data"); // Ensure FormData is imported

dotenv.config();
const router = express.Router();
const upload = multer(); // Memory storage

router.post("/scan", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No image provided" });
    }

    const formData = new FormData();
    formData.append("image", req.file.buffer, {
      filename: "image.jpg",
      contentType: req.file.mimetype,
    });

    const response = await axios.post("https://api.logmeal.com/v2/image/recognition/dish", formData, {
      headers: {
        "Authorization": `Bearer ${process.env.LOGMEAL_API_KEY}`,
        ...formData.getHeaders(),
      },
    });

    res.json(response.data);
  } catch (error) {
    console.error("Error processing image:", error);
    res.status(500).json({ error: "Failed to process image" });
  }
});

module.exports = router;
