const express = require("express");
const app = express();
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/usersRoutes");
const postRoutes = require("./routes/postsRoutes");
const commentRoutes = require("./routes/commentsRoutes");
const likeRoutes = require("./routes/likesRoutes");
const followerRoutes = require("./routes/followersRoutes");
const cors = require("cors");
const multer = require("multer");
const cookieParser = require("cookie-parser");
const sequelize = require('./config/db');
const path = require("path");  // For safe file handling

// Models
const User = require('./models/User');
const Post = require('./models/Post');
const Follower = require('./models/Follower');
const Like = require('./models/Like');
const Comment = require('./models/Comment');

// Sync models with the database
sequelize.sync({ force: false })  // Set `force: true` if you want to drop and recreate tables
    .then(() => console.log("Database & tables synced"))
    .catch(error => console.error("Error syncing database:", error));

// Middlewares
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Credentials", true);
    next();
});
app.use(express.json());
app.use(cookieParser());

// CORS middleware
app.use(cors({
    origin: "http://localhost:1234", // Ensure that only trusted origins are allowed
    credentials: true,
}));

// Static file serving - for images and other static files
app.use("/upload", express.static(path.join(__dirname, "../client/public/upload")));

// Configure Multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, "./uploads")); // Secure path handling
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + path.extname(file.originalname);  // Ensure unique filenames
        cb(null, uniqueSuffix);
    }
});

const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 },  // Limit file size to 5MB for security
    fileFilter: (req, file, cb) => {
        // Optional: Filter file types, e.g., only images
        const filetypes = /jpeg|jpg|png|gif/;
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = filetypes.test(file.mimetype);
        
        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb(new Error('Only images are allowed!'));
        }
    }
});

// File upload endpoint
app.post("/api/upload", upload.single("file"), (req, res) => {
    const file = req.file;
    if (!file) {
        return res.status(400).json({ error: "No file uploaded or invalid file type." });
    }
    res.status(200).json({ filename: file.filename });
});

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/likes", likeRoutes);
app.use("/api/followers", followerRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: err.message });
});

// Start the server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`);
});
