import cloudinary from "../lib/cloudinary.js";
import { generateToken } from "../lib/utils.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs"

export const signup = async (req, res) => {
    const { fullName, email, password } = req.body;

    try {
        if (!fullName || !email || !password || fullName === "" || email === "" || password === "") {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            })
        }

        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                message: "Password must be at least 6 characters"
            })
        }

        const user = await User.findOne({ email });

        if (user) {
            return res.status(400).json({
                success: false,
                message: "Email already exists"
            })
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            fullName,
            email,
            password: hashedPassword
        });
        await newUser.save();

        generateToken(newUser._id, res);

        res.status(201).json({
            success: true,
            message: "User registered successfully",
            _id: newUser._id,
            fullName: newUser.fullName,
            email: newUser.email,
            profilePic: newUser.profilePic
        })


    } catch (error) {
        console.error(`Error in signup controller: ${error}`);
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })
    }

}

export const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Invalid Credentials"
            })
        }

        const isPasswordMatch = await bcrypt.compare(password, user.password);

        if (!isPasswordMatch) {
            return res.status(400).json({
                success: false,
                message: "Invalid Credentials"
            })
        }

        generateToken(user._id, res);

        res.json({
            success: true,
            message: "User logged in successfully",
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
            profilePic: user.profilePic
        })

    } catch (error) {
        console.error(`Error in login controller: ${error}`);
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })
    }

}

export const logout = async (req, res) => {
    try {
        res.cookie("token", "", { maxAge: 0 })

        res.json({
            success: true,
            message: "Logged out successfully"
        })

    } catch (error) {
        console.error(`Error in logout controller: ${error}`);
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })
    }

}

export const updateProfile = async (req, res) => {
    const { profilePic } = req.body;

    const userId = req.user._id;

    try {
        if (!profilePic) {
            return res.status(400).json({
                success: false,
                message: "Profile pic is required"
            })
        }

        const uploadResponse = await cloudinary.uploader.upload(profilePic);

        const updatedUser = await User.findByIdAndUpdate(userId, {
            profilePic: uploadResponse.secure_url
        }, { new: true });

        res.json({
            success: true,
            message: "Profile updated successfully",
            updatedUser
        })

    } catch (error) {
        console.error(`Error in updateProfile controller: ${error}`);
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })
    }

}

export const checkAuth = (req, res) => {
    try {
        res.status(200).json(req.user);
    } catch (error) {
        console.error(`Error in checkAuth middleware: ${error}`);
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })
    }
}