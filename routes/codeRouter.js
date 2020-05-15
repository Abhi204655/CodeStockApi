const express = require("express");
const router = express.Router();
const codeController = require("../controllers/codeController");
const userController = require("../controllers/userController");

router.get(
  "/codes",
  userController.isAuthenticated,
  codeController.getAllCodes
);

router.post("/create", userController.isAuthenticated, codeController.saveCode);
router.delete(
  "/delete/:id",
  userController.isAuthenticated,
  codeController.deleteCode
);
router.patch(
  "/update/:id",
  userController.isAuthenticated,
  codeController.updateCode
);

module.exports = router;
