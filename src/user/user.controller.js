import { response } from "express";
import { hash } from "argon2";
import User from "./user.model.js";

export const getUsers = async (req, res) => {
  try {
    const users = await User.find({ status: true });

    res.status(200).json({  
      success: true,
      msg: "Get users successfully",
      users
    });
  } catch (error) {
    console.error('Error en getUsers:', error);
    res.status(500).json({
      success: false,
      msg: "Error getting users",
      error: error.message
    });
  }
}

export const getUserById = async (req, res = response) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        msg: "User not found"
      });
    }

    res.status(200).json({
      success: true,
      msg: "User found",
      user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      msg: "Error fetching user",
      error: error.message
    });
  }
};

export const updateUser = async (req, res = response) => {
  try {
    const { id } = req.params;
    const { _id, password, email, ...data } = req.body;

    const user = await User.findByIdAndUpdate(id, data, { new: true });
    res.status(200).json({
      success: true,
      msg: "User updated successfully",
      user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      msg: 'Error updating user',
      error: error.message
    });
  }
}

export const deleteUser = async (req, res = response) => {
  try {
    const { id } = req.params;
    const user = await User.findByIdAndUpdate(id, { status: false }, { new: true });

    res.status(200).json({
      success: true,
      msg: 'Deleted User',
      user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      msg: "Error deleting user",
      error: error.message
    });
  }
}

export const updatedPassword = async (req, res = response) => {
  try {
    const { id } = req.params;
    const { password } = req.body;

    if (password) {
      const hashedPassword = await hash(password);
      const updatedUser = await User.findByIdAndUpdate(id, { password: hashedPassword }, { new: true });

      return res.status(200).json({
        success: true,
        msg: "Password updated successfully",
        updatedUser
      });
    } else {
      return res.status(400).json({
        success: false,
        msg: "Password is required"
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      msg: "Error updating the password",
      error: error.message
    });
  }
}

export const crateAdmin = async () => {
  try {
    const adminD = await User.findOne({ email: "admin@gmail.com" });
    if (!adminD) {
      const passwordEncrypted = await hash("Admin123");
      const admin = new User({
        name: "Admin",
        surname: "Administrator",
        email: "admin@gmail.com",
        password: passwordEncrypted,
        role: "ADMIN_ROLE",
      });
      await admin.save();
      console.log("Administrador iniciado");
    } else {
      console.log("Administrador ya activo");
    }
  } catch (error) {
    console.error("Error creando administrador:", error);
  }
};

export const getProfile = async (req, res = response) => {
  try {
    const userId = req.user._id || req.user.id; // viene del validateJWT (req.user)

    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(404).json({
        success: false,
        msg: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      msg: "User profile retrieved successfully",
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      msg: "Error fetching user profile",
      error: error.message,
    });
  }
};
