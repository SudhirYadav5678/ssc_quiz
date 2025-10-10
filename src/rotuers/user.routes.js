import { Router } from "express";
import { deleteUser, logInUser, logoutUser, registerUser, updateUser } from "../controller/user.controller.js";
import { auth } from "../middleware/loginauth.js";

const router = Router();
router.route('/register').post(registerUser)

router.route('/login').post(logInUser)
router.route('/logout').get(auth, logoutUser)
router.route('/update').post(auth, updateUser)
router.route('/delete').get(auth, deleteUser)

export default router