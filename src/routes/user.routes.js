import { Router } from "express";
import { logoutUser, loginuser, registerUser, refreshAccessToken } from "../controllers/user.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";
const router = Router();

router.route("/register").post(registerUser)
router.route("/login").post(loginuser)
router.route("/logout").post(verifyJWT, logoutUser)
router.route("refreshToken").post(refreshAccessToken)


export default router;
