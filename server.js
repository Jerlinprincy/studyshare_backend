


// import express from "express";
// import dotenv from "dotenv";
// import cors from "cors";
// import path from "path";
// import { fileURLToPath } from "url";

// import connectDB from "./config/db.js";
// import authRoutes from "./routes/authRoutes.js";
// import postRoutes from "./routes/postRoutes.js";
// import userRoutes from "./routes/userRoutes.js";

// dotenv.config();
// const app = express();
// app.use(express.json());
// app.use(cors());

// // Fix dirname
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// // STATIC FOLDER FOR UPLOADS
// app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// // DB
// connectDB();

// // ROUTES
// app.use("/api/auth", authRoutes);
// app.use("/api/posts", postRoutes);
// app.use("/api/users", userRoutes);

// app.get("/", (req, res) => {
//   res.send("API is running...");
// });

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`Server running on ${PORT}`));




import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import postRoutes from "./routes/postRoutes.js";
import userRoutes from "./routes/userRoutes.js";

dotenv.config();
const app = express();

/* =======================
   BODY PARSERS (IMPORTANT)
======================= */
app.use(express.json()); // for JSON
app.use(express.urlencoded({ extended: true })); // for form data

app.use(cors());

/* =======================
   DATABASE
======================= */
connectDB();

/* =======================
   ROUTES
======================= */
app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/users", userRoutes);

app.get("/", (req, res) => {
  res.send("API is running...");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));
