import { User } from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
const generateAccessTokenAndrefreshtoken = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshAccessToken();
    user.refreshToken = refreshToken;
    await user.save({ validationBeforeSave: false });
    return { accessToken, refreshToken };
  } catch (error) {
    return res.status(500).json({
      message:
        "somthing went wrong while generating access and the refresh token",
    });
  }
};

const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    // console.log("emia",email)
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already registed" });
    }
    // const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      name,
      email,
      password,
    });
    const createdUser = await User.findById(newUser._id).select("-password");
    if (!createdUser) {
      return res.status(400).json({
        message: "something went wrong while registering the user",
      });
    }

    return res.status(201).json({
      createdUser,
      success: true,
      message: "user registered successfully",
    });
  } catch (error) {
    res.status(500).json({ message: "error while register" });
  }
};

const loginuser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "email or password is required" });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "user doesnot exist" });
    }

    // console.log("Entered password:", password);
    // console.log("Hashed from DB:", user.password);

    const isPasswordValid = await user.ispasswordCorrect(password);
    // console.log("ispassval",isPasswordValid)
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Wrong password" });
    }
    const { refreshToken, accessToken } =
      await generateAccessTokenAndrefreshtoken(user._id);

    const options = {
      httpOnly: true,
      secure: true,
    };

    const userInfo = {
      id: user._id,
      name: user.name,
      email: user.email,
    };
    return res
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .status(200)
      .json({
        message: "User logged in successfully",
        success:true,
        user: userInfo,
        accessToken,
        refreshToken,
      });
  } catch (error) {
    return res.status(500).json({ message: "Error while login" });
  }
};

const logoutUser = async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        refreshToken: undefined,
      },
    },
    {
      new: true,
    }
  );
  const options = {
    httpOnly: true,
    secure: true,
  };
  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json({ message: "User logged out successfully" });
};

const refreshAccessToken = async (req, res) => {
  try {
    const incomingRefreshToken = req.cookies.refreshToken || req.body;
    if (!incomingRefreshToken) {
      return res.status(401).json({ message: "unauthorized request" });
    }
    const decodedeToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );
    const user = await User.findById(incomingRefreshToken?._id);
    if (!user) {
      return res.status(401).json({ message: "Invalid refresh token" });
    }
    if (incomingRefreshToken !== user?.refreshToken) {
      return res.status(401).json({ message: "Invalid refresh token" });
    }

    const options = {
      httpOnly: true,
      secure: true,
    };

    const { newrefreshToken, accessToken } =
      await generateAccessTokenAndrefreshtoken(user._id);
    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", newrefreshToken, options)
      .json(
        {
          accessToken,
          refreshToken: newrefreshToken,
        },
        { message: "Accessed Token refreshed" }
      );
  } catch (error) {
    return res.status(400).json({ message: "erroe while in refreshing token" });
  }
};

export { registerUser, loginuser, logoutUser, refreshAccessToken };
 