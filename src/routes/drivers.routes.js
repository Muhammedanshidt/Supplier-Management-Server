// driversroutes

import { Router } from "express";
import {driver} from "../controllers/driverscontroller.js"


const router = Router()

router.post("/registration",driver.register)


export default router