const mongoose = require("mongoose");

const codeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Title is required."],
    trim: true,
  },
  code: {
    type: String,
    required: [true, "Code is required"],
  },
  timeStamp: {
    type: Date,
    default: Date.now,
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

module.exports = Code = mongoose.model("Code", codeSchema);
