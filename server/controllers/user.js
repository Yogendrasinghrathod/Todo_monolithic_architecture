import { User } from "../model/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
export const register = async (req, res) => {
  try {
    const { fullName, email, password } = req.body;

    if (!fullName || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All field are required",
      });
    }

    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({
        success: false,
        message: "This email id is already Registered.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      fullName,
      email,
      password: hashedPassword,
    });

    return res.status(201).json({
      success: true,
      message: "Account Created Successfully",
    });
  } catch (error) {
    console.log(error);
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    // const ans=await req.get('pehli')   // for single header this is fine
    // const {pehli,raat}=req.headers             // for multiple headers this will work
    if (!email || !password) {
      return res.status(401).json({
        status: false,
        message: "All Fields are Required",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        status: false,
        message: "Incorrect email or password",
      });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);

    const token = await jwt.sign({ userId: user._id }, process.env.SECRET_KEY, {
      expiresIn: "1d",
    });

    if (!isPasswordMatch) {
      return res.status(401).json({
        status: false,
        message: "Incorrect email or password",
      });
    }

    // res.set({
    //     pehli:ans   //send soemthing as header in response from server side , can be used to share token
    // })

    return res
      .status(200)
      .cookie("token", token, {
        httpOnly: true,
        sameSite: "strict",
        maxAge: 24 * 60 * 60 * 1000,
      })
      .json({
        status: true,
        message: `Welcome back ${user.fullName}`,
        // pehli,
        // raat
      });
  } catch (error) {
    console.log(error);
  }
};

export const logout = async (req, res) => {
  try {
    await res.clearCookie("token", {
      httpOnly: true,
      sameSite: "strict",
      path: "/", 
      expires: new Date(0),
    });
    res.status(200).json({
      success: true,
      message: "Logout successful!",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Logout failed",
    });
  }
};
