import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies?.access_token;
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }
  
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
      req.user = decoded;
      next();
    } catch {
      return res.status(401).json({
        success: false,
        message: "Token is invalid",
      });
    }
  };
  