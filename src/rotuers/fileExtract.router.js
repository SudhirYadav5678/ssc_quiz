import { Router } from "express";
import { upload } from "../middleware/multer.js";

const router = Router();
router.route('/fileExtract').post(upload.fields([{
    name: "question_file",
    maxCount: 1
}]),)