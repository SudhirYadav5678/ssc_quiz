import mongoose, { model, Schema } from "mongoose";

const singleQuestionSchema = new Schema({
    question: { type: String, required: true },
    type: { type: String, enum: ["multiple_choice"], required: true },
    options: { type: [String], required: true },
    answer: { type: Number, required: true },
    solution: { type: String },
    positive_marks: { type: Number, default: 1 },
    negative_marks: { type: Number, default: 0 }
});

const questionSchema = new Schema({
    testName: {
        type: String,
        required: true
    },
    questions: {
        type: Array,
        required: true
    }
}, { timestamps: true });

export const Question = model("Question", questionSchema);
