const mongoose = require("mongoose");

const feedbackStorySchema = new mongoose.Schema(
  {
    edited: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    commentsCount: { type: Number, default: 0 },
    image: { type: String, required: true },
    link: { type: String, default: "#" },
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model("FeedbackStory", feedbackStorySchema);
