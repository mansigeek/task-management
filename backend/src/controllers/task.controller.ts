
import { TaskStatus } from "@prisma/client";
import prisma from "../lib/prisma"
import { Request, Response } from "express";
import { JwtPayload } from "jsonwebtoken";

export const getTasks = async (req: Request, res: Response) => {
    const {status}= req.query;
    const userId = (req.user as unknown as JwtPayload).id;
    try {
        // Get user's project IDs
        const userProjects = await prisma.project.findMany({
            where: {
                userId: userId,
            },
            select: {
                id: true,
            },
        });
        
        const projectIds = userProjects.map(project => project.id);
        
        if(status){
            const tasks = await prisma.task.findMany({
                where: {
                    status: status as TaskStatus,
                    projectId: {
                        in: projectIds,
                    },
                },
            })
            return res.status(200).json({
                success: true,
                data: tasks,
            })
        }
        const tasks = await prisma.task.findMany({
            where: {
                projectId: {
                    in: projectIds,
                },
            },
        })
        return res.status(200).json({
            success: true,
            data: tasks,
        })
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error instanceof Error ? error.message : "Unknown error",
        });
    }
}

export const createTask = async (req: Request, res: Response) => {
    try {
        const { title, description, projectId, status } = req.body;
        const userId = (req.user as unknown as JwtPayload).id;
        
        if(!title || !projectId){
            return res.status(400).json({
                success: false,
                message: "Title and projectId are required",
            });
        }

        // Verify project exists and belongs to the user
        const project = await prisma.project.findUnique({
            where: { id: Number(projectId) },
        });

        if (!project) {
            return res.status(404).json({
                success: false,
                message: "Project not found",
            });
        }

        if (project.userId !== userId) {
            return res.status(403).json({
                success: false,
                message: "You don't have permission to add tasks to this project",
            });
        }

        const task = await prisma.task.create({
            data: {
                title,
                description: description || null,
                projectId: Number(projectId),
                status: status || "TODO",
                isArchived: false,
                
            },
        });

        res.status(201).json({
            success: true,
            message: "Task created successfully",
            data: task,
        });
    } catch (error) {
        console.error("Error creating task:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error instanceof Error ? error.message : "Unknown error",
        });
    }
}

export const getTasksByProjectId = async (req: Request, res: Response) => {
    try{
        const { projectId } = req.params;
        const userId = (req.user as unknown as JwtPayload).id;
        
        // Verify project belongs to the user
        const project = await prisma.project.findUnique({
            where: { id: Number(projectId) },
        });

        if (!project) {
            return res.status(404).json({
                success: false,
                message: "Project not found",
            });
        }

        if (project.userId !== userId) {
            return res.status(403).json({
                success: false,
                message: "You don't have permission to access this project",
            });
        }

        const tasks = await prisma.task.findMany({
            where: {
                projectId: Number(projectId),
            },
        });
        res.status(200).json({
            success: true,
            data: tasks,
        });
    }catch(error){
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error instanceof Error ? error.message : "Unknown error",
        });
    }
}
export const updateTask = async (req:Request, res:Response) => {
    try{
        const {id} = req.params;
        const userId = (req.user as unknown as JwtPayload).id;
        
        // Verify task belongs to user's project
        const task = await prisma.task.findUnique({
            where: { id: Number(id) },
            include: {
                project: true,
            },
        });

        if (!task) {
            return res.status(404).json({
                success: false,
                message: "Task not found",
            });
        }

        if (task.project.userId !== userId) {
            return res.status(403).json({
                success: false,
                message: "You don't have permission to update this task",
            });
        }

        const updatedTask = await prisma.task.update({
            where: {id: Number(id)},
            data: req.body,
        });
        res.status(200).json({
            success: true,
            message: "Task updated successfully",
            data: updatedTask,
        });
    }catch(error){
        res.status(500).json({
            success: false,
            message: "Failed to update task",
        });
    }
}
export const deleteTask = async (req:Request, res:Response) => {
    try{
        const {id} = req.params;
        const userId = (req.user as unknown as JwtPayload).id;
        
        // Verify task belongs to user's project
        const task = await prisma.task.findUnique({
            where: { id: parseInt(id) },
            include: {
                project: true,
            },
        });

        if (!task) {
            return res.status(404).json({
                success: false,
                message: "Task not found",
            });
        }

        if (task.project.userId !== userId) {
            return res.status(403).json({
                success: false,
                message: "You don't have permission to delete this task",
            });
        }

        const deletedTask = await prisma.task.delete({
            where: {id: parseInt(id)},
        });
        res.status(200).json({
            success: true,
            message: "Task deleted successfully",
            data: deletedTask,
        });
    }catch(error){
        res.status(500).json({
            success: false,
            message: "Failed to delete task",
        });
    }
}