import express, { json, urlencoded } from "express"
import dotenv from "dotenv"
import cors from 'cors'
import userRoutes from "./rotuers/user.routes.js";



dotenv.config({
    path: './.env'
})

const app = express();

const allowedOrigins = process.env.CORS_ORIGIN?.split(',') || ['*'];

app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// app.use(cors({
//     origin: process.env.CORS_ORIGIN || '*',
//     credentials: true,
//     methods: ['GET', 'POST', 'PUT', 'DELETE'],
//     allowedHeaders: ['Content-Type', 'Authorization']
// }))
app.use(json({ limit: "100kb" }))
app.use(urlencoded({ extended: true, limit: "16kb" }))
app.use(express.static('data'))


//router
app.get("/health", (req, res) => {
    res.send({
        "active": "True",
        "health": "Live"
    });
})
app.use("/api/v1/users", userRoutes)


export { app }