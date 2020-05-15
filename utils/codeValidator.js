const validator = require("validator");
const isEmpty = require("is-empty");

module.exports = function loginValidator(data) {
  let errors = {};
  data.title = !isEmpty(data.title) ? data.title : "";
  data.code = !isEmpty(data.code) ? data.code : "";

  if (validator.isEmpty(data.title)) {
    errors.title = "Title field is required.";
  }

  if (validator.isEmpty(data.code)) {
    errors.code = "Code field is required";
  }

  return {
    errors,
    isValid: isEmpty(errors),
  };
};
