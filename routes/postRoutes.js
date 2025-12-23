


// import express from "express";
// import multer from "multer";
// import Post from "../models/Post.js";
// import authMiddleware from "../middleware/authMiddleware.js";
// import cloudinary from "../config/cloudinary.js";

// const router = express.Router();

// // Temporary local upload for Multer
// const upload = multer({ dest: "uploads/" });

// // Allowed file types
// const allowedImage = ["image/png", "image/jpeg", "image/jpg"];
// const allowedVideo = ["video/mp4"];
// const allowedDocs = [
//   "application/pdf",
//   "application/msword",
//   "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
// ];

// // CREATE POST
// router.post("/", authMiddleware, upload.single("file"), async (req, res) => {
//   try {
//     const { title, description, type, link } = req.body;
//     let fileUrl = null;
//     let finalLink = null;

//     // FILE UPLOAD TYPES
//     if (type === "note" || type === "image" || type === "videoFile") {
//       if (!req.file)
//         return res.status(400).json({ message: "File required" });

//       const mime = req.file.mimetype;

//       // Validate file types
//       if (
//         !allowedImage.includes(mime) &&
//         !allowedVideo.includes(mime) &&
//         !allowedDocs.includes(mime)
//       ) {
//         return res.status(400).json({ message: "Invalid file type" });
//       }

//       // Upload to Cloudinary
//       const uploaded = await cloudinary.uploader.upload(req.file.path, {
//         resource_type: "auto",
//         folder: "myposts",
//       });

//       fileUrl = uploaded.secure_url;
//     }

//     // LINK TYPES
//     if (type === "video" || type === "workshop") {
//       if (!link)
//         return res.status(400).json({ message: "Link required" });

//       finalLink = link;
//     }

//     // Save Post
//     const newPost = new Post({
//       title,
//       description,
//       type,
//       link: finalLink,
//       fileUrl,
//       postedBy: req.user.id,
//     });

//     await newPost.save();
//     res.status(201).json({ message: "Post created successfully!" });
//   } catch (err) {
//     console.error("POST ERROR:", err);
//     res.status(500).json({
//       message: "Error creating post",
//       error: err.message,
//     });
//   }
// });

// // GET ALL POSTS
// router.get("/", authMiddleware, async (req, res) => {
//   try {
//     const posts = await Post.find()
//       .populate("postedBy", "name email")
//       .sort({ createdAt: -1 });

//     res.json(posts);
//   } catch {
//     res.status(500).json({ message: "Error fetching posts" });
//   }
// });

// // GET CURRENT USER POSTS
// router.get("/mine", authMiddleware, async (req, res) => {
//   try {
//     const posts = await Post.find({ postedBy: req.user.id })
//       .sort({ createdAt: -1 });

//     res.json(posts);
//   } catch {
//     res.status(500).json({ message: "Error fetching your posts" });
//   }
// });

// // DELETE POST
// router.delete("/:id", authMiddleware, async (req, res) => {
//   try {
//     const post = await Post.findById(req.params.id);
//     if (!post) return res.status(404).json({ message: "Post not found" });

//     if (post.postedBy.toString() !== req.user.id)
//       return res.status(403).json({ message: "Not allowed" });

//     await post.deleteOne();
//     res.json({ message: "Post deleted" });
//   } catch {
//     res.status(500).json({ message: "Error deleting post" });
//   }
// });

// // UPDATE POST
// router.put("/:id", authMiddleware, async (req, res) => {
//   try {
//     const post = await Post.findById(req.params.id);
//     if (!post) return res.status(404).json({ message: "Post not found" });

//     if (post.postedBy.toString() !== req.user.id)
//       return res.status(403).json({ message: "Not allowed" });

//     post.title = req.body.title || post.title;
//     post.description = req.body.description || post.description;

//     await post.save();
//     res.json({ message: "Post updated" });
//   } catch {
//     res.status(500).json({ message: "Error updating post" });
//   }
// });

// export default router;




// import express from "express";
// import Post from "../models/Post.js";
// import authMiddleware from "../middleware/authMiddleware.js";

// const router = express.Router();

// /* =======================
//    CREATE POST (NO FILES)
// ======================= */
// router.post("/", authMiddleware, async (req, res) => {
//   try {
//     const { title, description, type, link } = req.body;
//     let finalLink = null;

//     // LINK-BASED POSTS ONLY
//     if (type === "video" || type === "workshop") {
//       if (!link) {
//         return res.status(400).json({ message: "Link required" });
//       }
//       finalLink = link;
//     }

//     const newPost = new Post({
//       title,
//       description,
//       type,
//       link: finalLink,
//       postedBy: req.user.id,
//     });

//     await newPost.save();
//     res.status(201).json({ message: "Post created successfully!" });
//   } catch (err) {
//     console.error("POST ERROR:", err);
//     res.status(500).json({
//       message: "Error creating post",
//       error: err.message,
//     });
//   }
// });

// /* =======================
//    GET ALL POSTS
// ======================= */
// router.get("/", authMiddleware, async (req, res) => {
//   try {
//     const posts = await Post.find()
//       .populate("postedBy", "name email")
//       .sort({ createdAt: -1 });

//     res.json(posts);
//   } catch (err) {
//     res.status(500).json({ message: "Error fetching posts" });
//   }
// });









import express from "express";
import multer from "multer";
import Post from "../models/Post.js";
import authMiddleware from "../middleware/authMiddleware.js";
import cloudinary from "../config/cloudinary.js";

const router = express.Router();

// Multer (memory storage for Cloudinary)
const upload = multer({ storage: multer.memoryStorage() });

router.post(
  "/",
  authMiddleware,
  upload.single("file"), // 🔥 THIS IS THE FIX
  async (req, res) => {
    try {
      const { title, description, type, link } = req.body;

      let fileUrl = null;
      let finalLink = null;

      // IMAGE → CLOUDINARY
      if (type === "image") {
        if (!req.file)
          return res.status(400).json({ message: "Image required" });

        const result = await cloudinary.uploader.upload_stream(
          { folder: "posts" },
          async (error, result) => {
            if (error) throw error;

            fileUrl = result.secure_url;

            const newPost = new Post({
              title,
              description,
              type,
              fileUrl,
              postedBy: req.user.id,
            });

            await newPost.save();
            return res
              .status(201)
              .json({ message: "Post created successfully" });
          }
        );

        result.end(req.file.buffer);
        return;
      }

      // VIDEO / WORKSHOP → LINK
      if (type === "video" || type === "workshop") {
        if (!link)
          return res.status(400).json({ message: "Link required" });
        finalLink = link;
      }

      // NOTE / OTHER
      const newPost = new Post({
        title,
        description,
        type,
        link: finalLink,
        postedBy: req.user.id,
      });

      await newPost.save();
      res.status(201).json({ message: "Post created successfully" });
    } catch (err) {
      console.error("POST ERROR:", err);
      res.status(500).json({
        message: "Error creating post",
        error: err.message,
      });
    }
  }
);




/* =========================
   GET POSTS
========================= */
router.get("/", authMiddleware, async (req, res) => {
  const posts = await Post.find()
    .populate("postedBy", "name email")
    .sort({ createdAt: -1 });

  res.json(posts);
});




/* =======================
   GET CURRENT USER POSTS
======================= */
router.get("/mine", authMiddleware, async (req, res) => {
  try {
    const posts = await Post.find({ postedBy: req.user.id })
      .sort({ createdAt: -1 });

    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: "Error fetching your posts" });
  }
});

/* =======================
   DELETE POST
======================= */
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post)
      return res.status(404).json({ message: "Post not found" });

    if (post.postedBy.toString() !== req.user.id)
      return res.status(403).json({ message: "Not allowed" });

    await post.deleteOne();
    res.json({ message: "Post deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting post" });
  }
});

/* =======================
   UPDATE POST
======================= */
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post)
      return res.status(404).json({ message: "Post not found" });

    if (post.postedBy.toString() !== req.user.id)
      return res.status(403).json({ message: "Not allowed" });

    post.title = req.body.title || post.title;
    post.description = req.body.description || post.description;
    post.link = req.body.link || post.link;

    await post.save();
    res.json({ message: "Post updated successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error updating post" });
  }
});

export default router;
