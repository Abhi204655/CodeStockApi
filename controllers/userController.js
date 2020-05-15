const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const registerValidator = require("../utils/registerValidator");
const loginValidator = require("../utils/loginValidator");

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).json({
      status: "success",
      users,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      status: "error",
      err,
    });
  }
};

exports.registerUser = async (req, res) => {
  const { errors, isValid } = registerValidator(req.body);

  if (!isValid) {
    return res.status(400).json({
      status: "fail",
      errors,
    });
  }
  try {
    const found = await User.findOne({ email: req.body.email });
    if (found) {
      return res.status(400).json({
        status: "fail",
        email: "User already exists.",
      });
    }

    const user = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: await bcrypt.hash(req.body.password, 12),
    });

    if (user) {
      res.status(201).json({
        status: "success",
        user,
      });
    } else {
      res.status(500).json({
        status: "fail",
        message: "Server error",
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({
      status: "fail",
      message: err,
    });
  }
};

exports.loginUser = async (req, res) => {
  const { errors, isValid } = loginValidator(req.body);

  if (!isValid) {
    return res.status(400).json({
      status: "fail",
      errors,
    });
  }

  const email = req.body.email;
  const password = req.body.password;
  try {
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(404).json({
        status: "fail",
        msg: "Email does not exist.",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        status: "fail",
        msg: "Invalid credentials",
      });
    }
    const payload = { id: user._id, name: user.name };
    const token = await jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: 31556926,
    });
    res.status(200).json({
      status: "success",
      token: "Bearer " + token,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      status: "fail",
      msg: "Server error",
    });
  }
};

exports.isAuthenticated = async (req, res, next) => {
  const authHeader = req.headers["x-auth-token"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({
      status: "fail",
      msg: "Unauthorized",
    });
  }
  try {
    const user = await jwt.verify(token, process.env.JWT_SECRET);
    req.user = user;
    next();
  } catch (err) {
    return res.sendStatus(403);
  }
};
