// tappersroutes
import { Router } from "express";
import tappers from "../controllers/tappers.controller.js"


const router = Router()

router.post("/registration", tappers.register);
router.post("/tappingdata/:id", tappers.updateTapping);
router.get("/tappingdata/:id", tappers.getTappingActivity);

export default router