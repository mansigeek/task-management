import express from "express";
import { createTask, deleteTask, getTasks, getTasksByProjectId, updateTask } from "../controllers/task.controller";

const taskRouter = express.Router();

taskRouter.get("/", getTasks);
taskRouter.get("/:projectId", getTasksByProjectId);
taskRouter.post("/", createTask);
taskRouter.patch("/:id",  updateTask);
taskRouter.delete("/:id", deleteTask);

export default taskRouter;