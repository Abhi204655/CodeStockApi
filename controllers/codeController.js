const HackerEarth = require("hackerearth-node");
const Code = require("../models/codeModel");
const codeValidator = require("../utils/codeValidator");
require("dotenv").config();

const hackerEarth = new HackerEarth(process.env.HACKEREARTH_SECRET);

exports.getAllCodes = async (req, res) => {
  try {
    const codes = await Code.find({ authorId: req.user.id }).sort({
      timeStamp: "desc",
    });
    res.status(200).json({
      status: "success",
      codes,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      status: "error",
      err,
    });
  }
};

exports.saveCode = async (req, res) => {
  const { errors, isValid } = codeValidator(req.body);

  if (!isValid) {
    return res.status(400).json({
      status: "fail",
      errors,
    });
  }
  try {
    const code = await Code.create({
      title: req.body.title,
      code: req.body.code,
      authorId: req.user.id,
      authorName: req.user.name,
      tags: req.body.tags,
    });
    if (code) {
      res.status(201).json({
        status: "success",
        code,
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

exports.deleteCode = async (req, res) => {
  try {
    const code = await Code.find({ _id: req.params.id });
    if (code[0]) {
      if (code[0].authorId == req.user.id) {
        const isDeleted = await Code.deleteOne({ _id: code[0].id });
        return res.status(204).json({
          status: "success",
          msg: "Code deleted succesfully",
        });
      } else {
        return res.status(401).json({
          status: "fail",
          msg: "Unauthorised",
        });
      }
    } else {
      return res.status(404).json({
        status: "fail",
        msg: "Not found",
      });
    }
  } catch (err) {
    console.log(err);
    return res.status(404).json({
      status: "fail",
      msg: "Not found",
    });
  }
};

exports.updateCode = async (req, res) => {
  try {
    const code = await Code.findByIdAndUpdate(req.params.id, req.body);
    if (code) {
      res.status(204).json({
        status: "success",
        msg: "Updated succesfully.",
      });
    } else {
      res.status(404).json({
        status: "fail",
        msg: "Not found.",
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({
      status: "fail",
      msg: "Server error",
    });
  }
};

exports.compileCode = async (req, res) => {
  if (!req.body.code) {
    return res.status(400).json({
      status: "fail",
      msg: "Code is required.",
    });
  }
  try {
    const config = {
      time_limit: 1,
      memory_limit: 323244,
      source: req.body.code,
      input: "" || req.body.input,
      language: "Py",
    };
    const output = await hackerEarth.run(config);
    res.status(200).json({
      status: "success",
      result: JSON.parse(output),
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      status: "fail",
      msg: err,
    });
  }
};
