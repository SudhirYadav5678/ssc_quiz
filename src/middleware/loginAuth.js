
import jwt from 'jsonwebtoken'
import { User } from "../models/user.model.js";

export const auth = async function (req, res, next) {
    try {
        // after close site without logout user did not get token for logout.  //solved
        const token = await req.cookies?.tokens || req.header("Authorization")?.replace("Bearer ", "")
        //console.log("token", token);

        if (!token) {
            return res.status(400).json({
                success: false,
                message: "Login Token is not get"
            })
        }
        const verify = jwt.verify(token, process.env.SECRET_KEY)
        //console.log("verify", verify);

        if (!verify) {
            return res.status(400).json({
                success: false,
                message: "Login Token is not matched"
            })
        }
        const user = await User.findById(verify?._id).select("-password -refreshToken")
        //console.log("user", user);

        if (!user) {
            throw new ApiError(401, "Invalid Login Access Token")
        }

        req.user = user;
        next()
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: "Login Token is not get"
        })
    }
}