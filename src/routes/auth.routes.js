import { Router } from "express";
import User from "../models/User.models";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const router = Router();

router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username && !email && !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password should be atleast 6 characters long" });
    }

    const emailExists = await User.findOne({ email });
    const usernameExists = await User.findOne({ username });

    if (emailExists || usernameExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const user = new User({
      email,
      username,
      password,
    });

    const info = await user.save();
    return res.status(201).json({
      message: "register successful",
      data: { username: info.username, email: info.email },
    });
  } catch (error) {
    console.log("error while registering :", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});
router.post("/login", async (req, res) => {
  try {
    const { identifier, password } = req.body;
    if (!identifier && !password) {
      return res.status(400).json({ message: "All fields required" });
    }
    const findUser = await User.findOne({
      $or: [{ email: identifier }, { username: identifier }],
    });
    if (!findUser) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const isMatch = await bcrypt.compare(password, findUser.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: findUser._id }, config.jwtToken, {
      expiresIn: "1d",
    });

    return res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: findUser._id,
        username: findUser.username,
        email: findUser.email,
      },
    });
  } catch (error) {
    console.log("error while login :", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
