import mongoose, { Schema } from "mongoose"
import bcrypt from "bcryptjs"

const userSchema = new Schema({
    userName: {
        type: String,
        required: [true, "User name is required"],
        trim: true,
        unique: [true, "User name most be true"]
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: [true, "Email most be unique"],
        trim: true,
    },
    password: {
        type: String,
        required: [true, "Password  is required"],
    },
    phone: {
        type: String,
        required: true,
        min: [10, "Phone number should be 10 digits"]
    },
    active: {
        type: Boolean,
        required: true,
        default: true
    },
    refreshToken: {
        type: String
    },
    role: {
        type: String,
        enum: ["User", "Admin"],
        required: true
    }

}, { timestamps: true })


//password encrypeted
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();

    this.password = await bcrypt.hash(this.password, 10)
    next()
})

userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password)
}

export const User = mongoose.model("User", userSchema);