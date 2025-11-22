const multer = require("multer");
const path = require("path");
const fs = require("fs");

const uploadDir = path.join(__dirname, "..", "uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, uploadDir);
  },
  filename(req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + "-" + file.fieldname + ext);
  },
});

const limits = { fileSize: 10 * 1024 * 1024 }; // 10MB

const fileFilter = (req, file, cb) => {
  // optional: restrict types
  cb(null, true);
};

module.exports = multer({ storage, limits, fileFilter });
