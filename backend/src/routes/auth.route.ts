import passport from "passport";
import { createUser, loginUser, logoutUser, verifyEmail     } from "../controllers/auth.controller";
import express from "express";

const authRouter = express.Router();

authRouter.post("/login", loginUser);
authRouter.post("/logout", logoutUser);
authRouter.post("/register", createUser);
authRouter.get("/verify-email", verifyEmail);


export default authRouter;