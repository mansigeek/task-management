import express from "express";
import { createNote, getNotes, updateNote ,deleteNote} from "../controllers/note.controller";

const noteRouter = express.Router();

noteRouter.get("/", getNotes);
noteRouter.post("/", createNote);
noteRouter.patch("/:id", updateNote);
noteRouter.delete("/:id", deleteNote);

export default noteRouter;