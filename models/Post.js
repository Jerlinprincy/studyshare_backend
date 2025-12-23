







import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    title: String,
    description: String,
    type: {
      type: String,
      enum: ["note", "image", "video", "workshop", "file"], 
      required: true,
    },
    fileUrl: String, 
    link: String,
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    }
  },
  { timestamps: true }
);

export default mongoose.model("Post", postSchema);

