const express = require("express")
const { body } = require("express-validator")
const router = express.Router()
const authController = require("../controllers/authController")
const auth = require("../middleware/auth")
router.post("/register", [
  body("name").isLength({ min: 2 }),
  body("email").isEmail(),
  body("password").isLength({ min: 6 })
], authController.register)
router.post("/login", [
  body("email").isEmail(),
  body("password").exists()
], authController.login)
router.get("/me", auth, authController.getMe)
// routes/user.js

const User = require("../models/User");

// GET /usernames - returns all usernames for dropdown
router.get("/usernames", async (req, res) => {
  try {
    const users = await User.find({}, "name"); // only return 'name' field
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});

module.exports = router;

