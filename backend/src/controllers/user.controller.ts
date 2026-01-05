import { Request, Response } from "express";
import prisma from "../lib/prisma";
import { JwtPayload } from "jsonwebtoken";
import bcrypt from "bcrypt";


export const getMe = async (req: Request, res: Response) => {

  try {
    const user = await prisma.user.findUnique({
      where: {
        id: (req.user as unknown as JwtPayload).id,
      },
    });

    res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch user",
    });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;
    const userId = (req.user as unknown as JwtPayload).id;

    // Check if email is being changed and if it's already taken
    if (email) {
      const existingUser = await prisma.user.findUnique({
        where: { email },
      });
      
      if (existingUser && existingUser.id !== userId) {
        return res.status(400).json({
          success: false,
          message: "Email already in use",
        });
      }
    }

    // Prepare update data
    const updateData: { name?: string; email?: string; password?: string } = {};
    
    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (password) {
      // Hash the new password
      const hashedPassword = await bcrypt.hash(password, 10);
      updateData.password = hashedPassword;
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
      },
    });

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: updatedUser,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update user",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};




