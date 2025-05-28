import { Router } from "express";
import { getSession } from "../controllers/sessionController.js";


const sessionRouter = Router();

// Route pour récupérer tous les rôles
sessionRouter.get("/session", getSession);

export default sessionRouter;