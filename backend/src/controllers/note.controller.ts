import { JwtPayload } from "jsonwebtoken";
import prisma from "../lib/prisma";
import { Request, Response } from "express";

export const getNotes = async (req: Request, res: Response) => {
    try{
        const notes = await prisma.note.findMany({
            where: {
                userId: (req.user as unknown as JwtPayload).id,
            },
        });
        res.status(200).json({
            success: true,
            data: notes,
        });
    }catch(error){
        res.status(500).json({
            success: false,
            message: "Failed to fetch notes",
        });
    }
}

export const createNote = async(req: Request, res: Response) => {
    try{
        const {title, content} = req.body;
        if(!title || !content){
            return res.status(400).json({
                success: false,
                message: "Title and content are required",
            });
        }
        const note = await prisma.note.create({
            data: {...req.body, userId: (req.user as unknown as JwtPayload).id as number},
        });
        res.status(201).json({
            success: true,
            message: "Note created successfully",
            data: note,
        });
    } catch(error){
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error instanceof Error ? error.message : "Unknown error",
        });
    }
}

export const updateNote = async (req: Request, res: Response) => {
    try{
        const {id} = req.params;
        const note = await prisma.note.update({
            where: {id: parseInt(id)},
            data: req.body,
        });
        res.status(200).json({
            success: true,
            message: "Note updated successfully",
            data: note,
        });
    }
    catch(error){
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error instanceof Error ? error.message : "Unknown error",
        });
    }
}
export const deleteNote = async (req: Request, res: Response) => {
    try{
        const {id} = req.params;
        const note = await prisma.note.delete({
            where: {id: parseInt(id)},
        });
        res.status(200).json({
            success: true,
            message: "Note deleted successfully",
            data: note,
        });
    }catch(error){
        res.status(500).json({
            success: false,
            message: "Failed to delete note",
        });
    }
}