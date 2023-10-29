//auth, isStudent,isAdmin
const jwt = require("jsonwebtoken");
require("dotenv").config(); //secret key

//Authentication
exports.auth = (req, res, next) => {
  try {
    console.log("cookies->", req.cookies.token);
    console.log("body->", req.body.token);
    console.log("header=>", req.header("Authorization"));

    //extract JWT token ->|| req.cookies;
    const { token } =
      req.cookies ||
      req.body ||
      req.header("Authorization").replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Token Not found",
      });
    }

    //verify token
    try {
      const decode = jwt.verify(token, process.env.JWT_SECRET);
      console.log(decode);
      //why this -> coz we need the role for authorization
      req.user = decode;
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: "Token is Invalid",
      });
    }
    next(); //next middleware
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "something went wrong",
    });
  }
};

//Authorization for Student
exports.isStudent = (req, res, next) => {
  try {
    if (req.user.role !== "Student") {
      return res.status(401).json({
        success: false,
        message: "something went wrong, while verifying token",
      });
    }
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "User role cannot be verified",
    });
  }
};

//Authorization for Admin
exports.isAdmin = (req, res, next) => {
  try {
    if (req.user.role !== "Admin") {
      return res.status(401).json({
        success: false,
        message: "something went wrong, while verifying token",
      });
    }
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "User role cannot be verified",
    });
  }
};
