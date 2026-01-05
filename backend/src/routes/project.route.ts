import express from "express";
import { getProjects, createProject, updateProject, deleteProject } from "../controllers/project.controller";

const projectRouter = express.Router();

projectRouter.get("/", getProjects);
projectRouter.post("/", createProject);
projectRouter.patch("/:id", updateProject);
projectRouter.delete("/:id", deleteProject);

export default projectRouter;