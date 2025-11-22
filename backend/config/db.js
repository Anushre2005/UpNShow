const mongoose = require("mongoose")

const uri = process.env.MONGO_URI
if (!uri) {
  console.error("MONGO_URI is not set in .env")
  process.exit(1)
}

async function connectDB() {
  try {
    await mongoose.connect(uri, {
      // optional, mongoose defaults are fine but explicit options help clarity
      // useNewUrlParser: true,
      // useUnifiedTopology: true,
      // serverSelectionTimeoutMS: 10000
    })
    console.log("MongoDB connected")
  } catch (err) {
    console.error("MongoDB connection error:", err.message || err)
    process.exit(1)
  }
}

module.exports = connectDB
