import { Request, Response } from "express";
import jwt from "jsonwebtoken";

export const oauthLoginSuccess = (req: Request, res: Response) => {
    const user = req.user as any;
  
    const token = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET as string,
      { expiresIn: "7d" }
    );
  
    res.cookie("access_token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      path: "/",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
  
    res.redirect("http://localhost:3000/");
  };