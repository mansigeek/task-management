

import express from "express";
import { getMe, updateUser } from "../controllers/user.controller";

const userRouter = express.Router();

userRouter.get("/me", getMe);
userRouter.patch("/me", updateUser);

export default userRouter;