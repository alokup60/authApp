const bcrypt = require("bcrypt");
const User = require("../models/user");
const user = require("../models/user");
const jwt = require("jsonwebtoken");

require("dotenv").config();

//signup route handler
exports.signup = async (req, res) => {
  try {
    //get Data
    const { name, email, password, role } = req.body;
    //if user already exist
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    //secure password
    let hashPassword;
    try {
      hashPassword = await bcrypt.hash(password, 10); //10 is encrypt password round
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: "Error while hashing password",
      });
    }

    //create entry for user in DB -> 2way using create || using object and save to DB
    const user = await User.create({
      name,
      email,
      password: hashPassword,
      role,
    });

    return res.status(200).json({
      success: true,
      message: "User created successfully!",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "User cannot be registered. Please try again later",
    });
  }
};

//login router
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    //validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please fill all the input data",
      });
    }

    let user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Please register yourself first",
      });
    }

    const payload = {
      email: user.email,
      id: user._id,
      role: user.role,
    };
    //verify password and generate JWT token
    if (await bcrypt.compare(password, user.password)) {
      //create token
      let token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: "2h",
      });
      //insert token in user Object
      user = user.toObject();
      user.token = token; //send token to body
      user.password = undefined; //remove password from object not from DB

      //send cookie
      const options = {
        expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        httpOnly: true, //u can't access on client side
      };
      //pass token through cookie
      //   res.cookie("token", token, options).status(200).json({
      //     success: true,
      //     token,
      //     user,
      //     message: "User Logged In successfully!",
      //   });
      //pass token to the body
      res.status(200).json({
        success: true,
        token,
        user,
        message: "User Logged In successfully!",
      });
    } else {
      return res.status(403).json({
        success: false,
        message: "Password doesn't match",
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Login Failed",
    });
  }
};
