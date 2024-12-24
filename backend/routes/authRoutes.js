import express from "express";
import { check } from "express-validator";
import {
  registerUser,
  loginUser,
  googleLogin,
  getUserProfile,
} from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Регистрация нового пользователя с валидацией
router.post(
  "/register",
  [
    check("name", "Name is required").notEmpty(),
    check("email", "Please include a valid email").isEmail(),
    check("password", "Password must be at least 6 characters long").isLength({
      min: 6,
    }),
  ],
  registerUser
);

// Логин пользователя с валидацией
router.post(
  "/login",
  [
    check("email", "Please include a valid email").isEmail(),
    check("password", "Password is required").exists(),
  ],
  loginUser
);
// ======
router.post("/google", googleLogin);
// ======
router.get("/profile", protect, getUserProfile);

export default router;
