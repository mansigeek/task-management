import { Request, Response } from "express";
import prisma from "../lib/prisma";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { sendVerificationEmail } from "../lib/send-verification";

export const loginUser = async (req: Request, res: Response) => {
    try {
      const {email,password} = req.body;
      if(!email || !password){
        return res.status(400).json({
          success: false,
          message: "All fields are required",
        })
      }else{
        const user = await prisma.user.findUnique({
          where: {
            email,
          },
        })
        if(!user){
          return res.status(400).json({
            success: false,
            message: "User not found",
          })
        }else if( !user.isActive ){
          return res.status(400).json({
            success: false,
            message: "Account not active. Please verify your email first.",
          })
        }else{
          const isPasswordCorrect = await bcrypt.compare(password,user.password || "");
          if(!isPasswordCorrect){
            return res.status(400).json({
              success: false,
              message: "Invalid password",
            })
          }else{
            const token = jwt.sign({id:user.id},process.env.JWT_SECRET as string,{expiresIn:"7d"});
            res.cookie("access_token", token, {
              httpOnly: true,
              secure: false,
              sameSite: "lax",
              path: "/", 
              maxAge: 7 * 24 * 60 * 60 * 1000,
            });
            return res.status(200).json({
              success: true,
              message: "Login successful",
              data: {
                user,
              },
            })
          }
        }
      }
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Internal server error",
      })
    }
  }

  export const logoutUser = async (req: Request, res: Response) => {
    try {
      res.clearCookie("access_token", {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
        path: "/", 
        maxAge: 0,
      });
  
      return res.status(200).json({
        success: true,
        message: "Logout successful",
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  };
  

  export const createUser = async (req: Request, res: Response) => {
    try {
      const { name, email, password } = req.body;
      if (!name || !email || !password) {
        return res.status(400).json({
          success: false,
          message: "All fields are required",
        });
      } else {
        const existingUser = await prisma.user.findUnique({
          where: {
            email,
          },
        });
        if (existingUser) {
          return res.status(400).json({
            success: false,
            message: "User already exists",
          });
        } else {
          const hashedPassword = await bcrypt.hash(password, 10);
          const user = await prisma.user.create({
            data: {
              name,
              email,
              password: hashedPassword,
              emailToken: crypto.randomBytes(32).toString("hex"),
              emailTokenExpiry: new Date(Date.now() + 1000 * 60 * 60 * 24),
              isActive: false,
            },
          });
          await sendVerificationEmail(email, user.emailToken || "");
          return res.status(201).json({
            success: true,
            message: "User created successfully",
            data: user,
          });
        }
      }
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  };

  export const verifyEmail = async (req: Request, res: Response) => {
  
      const {token } = req.query

      const user = await prisma.user.findFirst({
        where: {
          emailToken: token as string,
          emailTokenExpiry : {gt: new Date()},
        }
      })

      if(!user){
        return res.redirect("http://localhost:3000/verify-email?status=error&message=Invalid%20or%20expired%20token");
      }

      await prisma.user.update({
        where: { id: user.id },
        data: {
          isActive: true,
          emailVerifiedAt: new Date(),
          emailToken: null,
          emailTokenExpiry: null,
        },
      });
    
      res.redirect("http://localhost:3000/verify-email?status=success");
    
}


