import { Router } from 'express';
import adminController from '../controllers/admin.controller.js';

const router = Router()

// supplier controller by admin

router.post("/login", adminController.admin_login);
router.get("/suppliers", adminController.supplier_listing);
router.get("/supplier/:id", adminController.supplier_find);
router.post("/supplier/latex", adminController.daily_latex_add);
router.get("/supplier/profile/:id", adminController.supplier_find);
router.put("/supplier/update/:id", adminController.upadteSupplierProfile);
router.delete("/supplier/delete/:id", adminController.deleteSupplier);
router.get("/suppliers/latexdata",adminController.supplier_latexdata)
router.post("/suppliers/drcupdation",adminController.drc_updation)


// tapper controller by admin

router.get("/tappers", adminController.tappersFind);
router.get("/tappers/:id", adminController.tapperFind);
router.put("/tappers/updates", adminController.tapperUpdate);


// driver controller by admin
router.get("/drivers", adminController.driver_listing);
router.put("/driver/area", adminController.add_driver_area);
router.get("/driver/supplier", adminController.driver_supplier);



export default router;
