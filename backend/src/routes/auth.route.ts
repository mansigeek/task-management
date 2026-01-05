import { createUser, loginUser, logoutUser } from "../controllers/auth.controller";
import express from "express";

const authRouter = express.Router();

authRouter.post("/login", loginUser);
authRouter.post("/logout", logoutUser);
authRouter.post("/register", createUser);

export default authRouter;