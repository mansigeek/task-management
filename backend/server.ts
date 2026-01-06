import express from "express";
import userRouter from "./src/routes/user.route";
import dotenv from "dotenv";
import authRouter from "./src/routes/auth.route";
import cookieParser from "cookie-parser";
import cors from "cors";
import { verifyToken } from "./src/middlewares/middleware";
import projectRouter from "./src/routes/project.route";
import taskRouter from "./src/routes/task.route";
import noteRouter from "./src/routes/note.route";
// import session from "express-session";
import passport from "passport";
import "./src/lib/passport";
import auth0Router from "./src/routes/auth0.route";

const app = express();

// app.use(
//   session({
//     secret: process.env.SESSION_SECRET as string,
//     resave: false,
//     saveUninitialized: false,
//   })
// );

app.use(passport.initialize());
dotenv.config();

// CORS configuration to allow credentials (cookies)
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:3000",
  credentials: true,
}));

app.use(express.json());
app.use(cookieParser());

app.use("/api/user", verifyToken,userRouter);
app.use("/api/auth", authRouter);
app.use("/api/project", verifyToken, projectRouter);
app.use("/api/task", verifyToken, taskRouter);
app.use("/api/note", verifyToken, noteRouter);
app.use("/auth", auth0Router);

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});