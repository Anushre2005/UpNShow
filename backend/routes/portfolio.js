const express = require("express")
const router = express.Router()
const { body } = require("express-validator")
const portfolioController = require("../controllers/portfolioController")
const auth = require("../middleware/auth")
const upload = require("../middleware/upload")

// Create Portfolio Item
router.post(
  "/",
  auth,
  // accept both 'file' and 'image' fields (max one each)
  (req, res, next) => {
    upload.fields([{ name: "file", maxCount: 1 }, { name: "image", maxCount: 1 }])(req, res, function (err) {
      if (err) {
        console.error("Upload error:", err)
        return res.status(400).json({ msg: err.message || "File upload error" })
      }
      next()
    })
  },
  [body("title").isLength({ min: 2 })],
  portfolioController.createItem
)

// Get logged-in user's items
router.get("/", auth, portfolioController.getItems)

// Get public portfolio by username
router.get("/user/:username", portfolioController.getPublicItemsByUser)

// Update Portfolio Item
router.put("/:id", auth, upload.single("file"), portfolioController.updateItem)

// Delete Portfolio Item
router.delete("/:id", auth, portfolioController.deleteItem)

module.exports = router
