import prisma from "../lib/prisma"
import { Request, Response } from "express";
import { JwtPayload } from "jsonwebtoken";
export const getProjects= async (req: Request, res: Response) => {
    try{
            const projects = await prisma.project.findMany({
            where: {
                userId: (req.user as unknown as JwtPayload).id,
            },  
            include: {
                user: true,
                tasks: true,
            },
        })
        res.status(200).json({
            success: true,
            data: projects,
        })
    }
    catch(error){
        res.status(500).json({
            success: false,
            message: "Failed to fetch projects",
        })
    }
}
export const createProject = async (req: Request, res: Response) => {
    try {
      const { name, description } = req.body;
  
      if (!name) {
        return res.status(400).json({ message: "Name is required" });
      }
      const project = await prisma.project.create({
        data: {
          name,
          description,
          isArchived: false as boolean,
          userId: (req.user as unknown as JwtPayload).id,
        },
      });
  
      res.status(201).json({
        success: true,
        data: project,
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to create project" });
    }
  };

  export const updateProject = async(req:Request, res:Response) => {
    try{
        const {id} = req.params;
        
            const project = await prisma.project.update({
                where: {
                    id: parseInt(id),
                },
                data:req.body,
            })
            return res.status(200).json({
                success: true,
                message: "Project updated successfully",
                data: project,
            })
        

    }catch(error){
        res.status(500).json({
            success: false,
            message: "Failed to update project",
        })
    }
  }  

  export const  deleteProject = async(req:Request, res:Response) => {
try{
    const {id} = req.params;
    const project = await prisma.project.delete({
        where: {
            id: parseInt(id),
        },
    })
    return res.status(200).json({
        success: true,
        message: "Project deleted successfully",
        data: project,
    })
}catch(error){
    res.status(500).json({
        success: false,
        message: "Failed to delete project",
    })
}
  }