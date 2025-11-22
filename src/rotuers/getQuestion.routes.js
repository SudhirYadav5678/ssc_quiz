import { Router } from "express";
import { getQuestion } from "../controller/getQuestion.js";


const router = Router();

router.route("/testName/:testName").get(getQuestion)

export default router