const express = require("express")
const router = express.Router()
const User = require("../models/User")

// Get all usernames (for dropdowns, autocomplete, etc.)
router.get("/usernames", async (req, res) => {
  try {
    const users = await User.find({}, "username")
    const usernames = users.map(u => u.username)
    res.json(usernames)
  } catch (err) {
    res.status(500).json({ error: "Server error" })
  }
})

module.exports = router
