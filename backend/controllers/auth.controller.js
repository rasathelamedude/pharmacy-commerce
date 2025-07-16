import User from "../models/user.model.js";

export const signUp = async (req, res) => {
    try {
        const {email, password, name} = req.body;

        const existingUser = await User.findOne({email});

        if (existingUser) {
            throw new Error("User already exists.");
        }

        const user = await User.create({email, password, name});

        const {refreshToken, accessToken} = generateTokens(user._id);

        res.status(201).json({
            success: true,
            message: "User created successfully",
            data: user,
        });
    } catch (error) {
        
    }
};

export const login = async (req, res) => {};

export const logout = async (req, res) => {};

export const refreshToken = async (req, res) => {};

export const getProfile = async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      message: "Profile fetched successfully",
      data: {
        user: req.user,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch profile",
      error: error.message,
    });
  }
};


// helper function to generate user tokens;
const generateTokens = (userId) => {
  // TODO: Add JWT token generation logic here;
};