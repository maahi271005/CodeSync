import express from "express";
import {
  createProblem,
  getAllProblems,
  getProblemBySlug,
  runProblem
} from "../controller/problemController.js";

import { protectRoute } from "../middleware/protectRoute.js";

const router = express.Router();

/* -----------------------
   PUBLIC ROUTES
----------------------- */
router.get("/", protectRoute, getAllProblems);
router.get("/:slug", protectRoute, getProblemBySlug);
router.post("/:slug/run", protectRoute, runProblem);

/* -----------------------
   CREATE - open to all signed-in users for now
   (add requireControlAdmin back to restrict to admins)
----------------------- */
router.post("/", protectRoute, createProblem);

export default router;