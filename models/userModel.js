const mongoose = require("mongoose");
const validator = require("validator");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: {
    type: String,
    required: [true, "A user must have a name."],
  },
  email: {
    type: String,
    required: [true, "Email field is required."],
    unique: true,
    validata: {
      validator: (e) => {
        return e.isEmail();
      },
      message: "Please enter a valid email",
    },
  },
  password: {
    type: String,
    required: [true, "Password filed is required."],
    minlength: [8, "Password should have more than 8 characters."],
  },
});

module.exports = User = mongoose.model("User", userSchema);
