


import express from "express";
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";
import User from "../models/User.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

/* ---------------- CLOUDINARY STORAGE FOR PROFILE PIC ---------------- */
const profileStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "user_profiles",
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
  },
});

const uploadProfile = multer({ storage: profileStorage });

/* ---------------- GET LOGGED-IN USER ---------------- */
router.get("/me", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* ---------------- UPDATE PROFILE (WITH PIC) ---------------- */
router.put(
  "/update",
  authMiddleware,
  uploadProfile.single("profilePic"), // file upload FROM FRONTEND
  async (req, res) => {
    try {
      const { bio } = req.body;
      let profilePicUrl = null;

      // If file exists → get Cloudinary URL
      if (req.file && req.file.path) {
        profilePicUrl = req.file.path; // Cloudinary provides URL in .path
      }

      const updateFields = {
        bio,
      };

      if (profilePicUrl) {
        updateFields.profilePic = profilePicUrl;
      }

      const updatedUser = await User.findByIdAndUpdate(
        req.user.id,
        updateFields,
        { new: true }
      ).select("-password");

      res.json(updatedUser);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
);

export default router;
