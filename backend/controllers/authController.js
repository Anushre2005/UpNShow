const User = require("../models/User")
const { validationResult } = require("express-validator")
const bcrypt = require("bcrypt") // changed from "bcryptjs"
const jwt = require("jsonwebtoken")
exports.register = async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() })
  const { name, email, password } = req.body
  let user = await User.findOne({ email })
  if (user) return res.status(400).json({ msg: "User exists" })
  const salt = await bcrypt.genSalt(10)
  const hashed = await bcrypt.hash(password, salt)
  user = new User({ name, email, password: hashed })
  await user.save()
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET)
  res.json({ token, user: { id: user._id, name: user.name, email: user.email } })
}
exports.login = async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() })
  const { email, password } = req.body
  const user = await User.findOne({ email })
  if (!user) return res.status(400).json({ msg: "Invalid credentials" })
  const match = await bcrypt.compare(password, user.password)
  if (!match) return res.status(400).json({ msg: "Invalid credentials" })
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET)
  res.json({ token, user: { id: user._id, name: user.name, email: user.email } })
}
exports.getMe = async (req, res) => {
  const user = await User.findById(req.user).select("-password")
  res.json(user)
}
exports.register = async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() })
  const { name, email, password, username } = req.body
  try {
    // ensure username exists (derive from email if missing)
    const safeUsername = username && username.trim()
      ? username.trim()
      : (email ? email.split("@")[0] + Date.now().toString().slice(-4) : "user" + Date.now());

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    const user = new User({
      name,
      email,
      password: hashedPassword,
      username: safeUsername,
      // ...other fields...
    })

    await user.save()
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET)
    res.json({ token, user: { id: user._id, name: user.name, email: user.email } })
  } catch (err) {
    console.error(err)
    res.status(500).send("Server error")
  }
}
