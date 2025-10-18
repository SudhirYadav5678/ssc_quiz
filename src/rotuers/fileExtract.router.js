import { Router } from "express";
import { upload } from "../middleware/multer.js";
import { fileExtraction } from "../controller/fileExtract.controller.js";


const router = Router();
router.route('/testFile').post(upload.fields([{
    name: "testFile",
    maxCount: 1
}]), fileExtraction)

export default router