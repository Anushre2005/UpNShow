const User = require("../models/User")
const PortfolioItem = require("../models/PortfolioItem")
const { validationResult } = require("express-validator")

// Create Portfolio Item
exports.createItem = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  // multer.fields puts files in req.files as arrays
  const fileFile = req.files && req.files.file && req.files.file[0];
  const imageFile = req.files && req.files.image && req.files.image[0];

  const data = {
    user: req.user,
    title: req.body.title,
    description: req.body.description,
    type: req.body.type,
    link: req.body.link,
    videoUrl: req.body.videoUrl,
    imageUrl: imageFile ? "/uploads/" + imageFile.filename : (req.body.imageUrl || undefined),
    fileUrl: fileFile ? "/uploads/" + fileFile.filename : undefined,
    visible: req.body.visible !== "false",
  };

  const item = new PortfolioItem(data);
  await item.save();
  res.status(201).json(item);
}

// Get logged-in user's items
exports.getItems = async (req, res) => {
  const items = await PortfolioItem.find({ user: req.user }).sort({ createdAt: -1 })
  res.json(items)
}

// Get public portfolio by username
exports.getPublicItemsByUser = async (req, res) => {
  try {
    const { username } = req.params
    const user = await User.findOne({ username })
    if (!user) return res.status(404).json({ msg: "User not found" })

    const items = await PortfolioItem.find({
      user: user._id,
      visible: true
    }).sort({ createdAt: -1 })

    res.json(items)
  } catch (err) {
    console.error(err)
    res.status(500).json({ msg: "Server error" })
  }
}

// Update Portfolio Item
exports.updateItem = async (req, res) => {
  const id = req.params.id
  const item = await PortfolioItem.findById(id)
  if (!item) return res.status(404).json({ msg: "Not found" })
  if (item.user.toString() !== req.user) return res.status(401).json({ msg: "Unauthorized" })

  item.title = req.body.title || item.title
  item.description = req.body.description || item.description
  item.type = req.body.type || item.type
  item.link = req.body.link || item.link
  item.videoUrl = req.body.videoUrl || item.videoUrl

  if (req.body.imageUrl) item.imageUrl = req.body.imageUrl
  if (req.file) item.fileUrl = "/uploads/" + req.file.filename
  if (req.body.visible !== undefined) item.visible = req.body.visible !== "false"

  await item.save()
  res.json(item)
}

// Delete Portfolio Item
exports.deleteItem = async (req, res) => {
  const id = req.params.id
  const item = await PortfolioItem.findById(id)
  if (!item) return res.status(404).json({ msg: "Not found" })
  if (item.user.toString() !== req.user) return res.status(401).json({ msg: "Unauthorized" })

  await item.deleteOne()
  res.json({ msg: "Deleted" })
}
