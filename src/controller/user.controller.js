import { User } from "../model/user.model.js"
import jwt from 'jsonwebtoken'


const registerUser = async function (req, res) {
    const { userName, email, password, role, phone } = await req.body
    if (
        [email, userName, password, role, phone].some((field) => field?.trim() === "")
    ) {
        throw new Error(400, "All fields are required")
    }

    //existing check
    const existedUser = await User.findOne({ email });
    if (existedUser) {
        throw new Error(409, "User with email already exists")
    }

    const user = await User.create({
        userName,
        email,
        password,
        phone,
        role
    })
    return res.status(201).json(
        {
            success: true,
            message: "User Register"
        }
    )
}

const logInUser = async function (req, res) {
    try {
        const { email, password } = req.body
        const user = await User.findOne({ email })
        if (!user) {
            return res.status(201).json(
                {
                    success: false,
                    message: "User does not exist"
                }
            )
        }
        const correctPassword = await user.isPasswordCorrect(password)
        if (!correctPassword) {
            return res.status(201).json(
                {
                    success: false,
                    message: "Password is incorrect"
                }
            )
        }

        const tokens = jwt.sign({
            _id: user._id,
            email: user.email,
        }, process.env.SECRET_KEY, { expiresIn: "3d" })
        await user.updateOne({ refreshToken: tokens });

        const options = {
            httpOnly: true,
            secure: true
        }
        return res.status(201).cookie("tokens", tokens, options).json(
            {
                user,
                success: true,
                message: "User login"
            }
        )

    } catch (error) {
        res.status(409).json(
            {
                success: false,
                message: "User login fail"
            }
        )
    }

}

const logoutUser = async (req, res) => {

    try {
        // const user = req.user._id;
        // const userId = await User.findById(user)
        const options = {
            httpOnly: true,
            secure: true
        }
        return res.status(200).clearCookie("tokens", "", options).json({
            success: true,
            message: "User Logout"
        })
    } catch (error) {
        return res.status(200).json({
            success: false,
            message: "User not Logout"
        })
    }
}

const updateUser = async function (req, res) {
    const { userName, email, password, phone } = await req.body
    const userId = req.user; // middleware authentication

    let user = await User.findById(userId);
    if (!user) {
        return res.status(400).json({
            success: false,
            message: "User does not found"
        })
    }
    if (userName) { user.userName = userName }
    if (email) { user.email = email }
    if (password) { user.password = password }
    if (phone) { user.phone = phone }
    await user.updateOne({
        userName: user.userName,
        email: user.email,
        password: user.password,
        phone: user.phone,
        role: user.role
    })
    return res.status(200).cookie("tokens", user.refreshToken).json({
        user: user.refreshToken,
        success: true,
        message: "Update successfully"
    })
}

const deleteUser = async function (req, res) {
    const user = await User.findById(req.user._id)
    //console.log(user);
    if (!user) {
        console.log("user do not found");
    }

    const deleteUser = await user.updateOne({ activ: false })
    //console.log(deleteUser);

    return res.status(200).cookie("token", "").json({
        success: true,
        message: "User deleted"
    })
}

export { registerUser, logInUser, logoutUser, updateUser, deleteUser }