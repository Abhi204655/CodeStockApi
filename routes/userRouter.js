const express = require("express");
const userController = require("../controllers/userController");
const router = express.Router();

router.get("/", userController.isAuthenticated, userController.getAllUsers);
router.post("/register", userController.registerUser);
router.post("/login", userController.loginUser);

// router.post('/register',(req, res))

module.exports = router;
