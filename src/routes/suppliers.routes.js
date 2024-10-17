import { Router } from "express";
import {supplier}  from "../controllers/suppliers.controller.js";

const router = Router();

router.post("/registration", supplier.registration);
router.post("/login", supplier.login);

export default router;
