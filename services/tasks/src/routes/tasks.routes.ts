import { Router } from "express";
import { validateBody } from "shared";
import { createTaskSchema, updateTaskSchema } from "../schemas/task.schemas";
import * as taskController from "../controllers/task.controllers";

const router = Router();

router.post("/", validateBody(createTaskSchema), taskController.createTask);
router.get("/", taskController.listTasks);
router.get("/:id", taskController.getTask);
router.delete("/:id", taskController.deleteTask);
router.put("/:id", validateBody(updateTaskSchema), taskController.updateTask);

export default router;
