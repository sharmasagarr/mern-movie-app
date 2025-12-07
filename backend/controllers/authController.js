import jwt from "jsonwebtoken";
import User from "../models/User.js";

const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      role: user.role
    },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );
};

export const register = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;

    // ========== VALIDATION CHECKS ==========

    const errors = [];

    // 1. Check for required fields
    if (!name) errors.push("Name is required");
    if (!email) errors.push("Email is required");
    if (!password) errors.push("Password is required");

    // If any required field is missing, return early
    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors
      });
    }

    // 2. Validate Name
    const trimmedName = name.trim();
    
    if (trimmedName.length < 2) {
      errors.push("Name must be at least 2 characters long");
    }
    
    if (trimmedName.length > 50) {
      errors.push("Name must not exceed 50 characters");
    }

    if (!/^[a-zA-Z\s]+$/.test(trimmedName)) {
      errors.push("Name can only contain letters and spaces");
    }

    // 3. Validate Email
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const trimmedEmail = email.trim().toLowerCase();

    if (!emailRegex.test(trimmedEmail)) {
      errors.push("Please provide a valid email address");
    }

    if (trimmedEmail.length > 100) {
      errors.push("Email must not exceed 100 characters");
    }

    // 4. Validate Password
    const passwordErrors = [];

    if (password.length < 8) {
      passwordErrors.push("Password must be at least 8 characters long");
    }

    if (password.length > 128) {
      passwordErrors.push("Password must not exceed 128 characters");
    }

    if (!/[a-zA-Z]/.test(password)) {
      passwordErrors.push("Password must contain at least one letter (a-z, A-Z)");
    }

    if (!/\d/.test(password)) {
      passwordErrors.push("Password must contain at least one number (0-9)");
    }

    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
      passwordErrors.push("Password must contain at least one special character (!@#$%^&* etc.)");
    }

    // Check for common weak passwords
    const weakPasswords = [
      "password", "12345678", "password123", "admin123", 
      "qwerty123", "abc123456", "password1"
    ];
    if (weakPasswords.includes(password.toLowerCase())) {
      passwordErrors.push("Password is too common. Please choose a stronger password");
    }

    // Add password errors to main errors array
    errors.push(...passwordErrors);

    // 5. Validate Role (optional field)
    if (role && !["user", "admin"].includes(role)) {
      errors.push("Role must be either 'user' or 'admin'");
    }

    // If there are any validation errors, return them
    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors
      });
    }

    // ========== CHECK IF EMAIL EXISTS ==========
    const exists = await User.findOne({ email: trimmedEmail });
    if (exists) {
      return res.status(409).json({
        success: false,
        message: "Registration failed",
        errors: ["This email is already registered. Please login or use a different email."]
      });
    }

    // ========== CREATE USER ==========
    const user = await User.create({
      name: trimmedName,
      email: trimmedEmail,
      password, // Will be hashed by mongoose pre-save hook
      role: role === "admin" ? "admin" : "user"
    });

    // ========== GENERATE TOKEN ==========
    const token = generateToken(user);

    // ========== SUCCESS RESPONSE ==========
    res.status(201).json({
      success: true,
      message: "Registration successful",
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role
        },
        token
      }
    });

  } catch (err) {
    // Handle Mongoose validation errors
    if (err.name === 'ValidationError') {
      const errors = Object.values(err.errors).map(e => e.message);
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors
      });
    }

    // Handle duplicate key errors (should be caught above, but just in case)
    if (err.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "Registration failed",
        errors: ["This email is already registered"]
      });
    }

    // Pass to error handler middleware
    next(err);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = generateToken(user);
    res.status(200).json({
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
      token
    });
  } catch (err) {
    next(err);
  }
};
