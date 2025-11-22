const mongoose = require("mongoose")

const PortfolioItemSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  title: { type: String, required: true },
  description: { type: String },
  type: { type: String },
  link: { type: String },
  videoUrl: { type: String },

  imageUrl: {
    type: String,
    default: () => "https://picsum.photos/400?random=" + Math.floor(Math.random() * 5000)
  },

  fileUrl: { type: String },
  visible: { type: Boolean, default: true }
}, { timestamps: true })

module.exports = mongoose.model("PortfolioItem", PortfolioItemSchema)
