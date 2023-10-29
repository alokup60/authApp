const express = require("express");
const router = express.Router();

//import controller
const { login, signup } = require("../controllers/Auth");
const { auth, isStudent, isAdmin } = require("../middlewares/auth");

router.post("/login", login);
router.post("/signup", signup);

//testing routes using single middleware
router.get("/test", auth, (req, res) => {
  return res.status(200).json({
    success: true,
    message: "Welcome to the Testing protected Route",
  });
});

//protected Routes
router.get("/student", auth, isStudent, (req, res) => {
  return res.status(200).json({
    success: true,
    message: "Welcome to the Student protected Route",
  });
});

router.get("/admin", auth, isAdmin, (req, res) => {
  return res.status(200).json({
    success: true,
    message: "Welcome to the Admin protected Route",
  });
});

module.exports = router;
