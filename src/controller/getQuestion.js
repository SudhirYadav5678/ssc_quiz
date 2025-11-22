import { Question } from "../model/question.model.js";

export const getQuestion = async (req, res) => {
    try {
        const { testName } = req.params;
        const questionData = await Question.findOne({ testName: testName });

        if (!questionData) {
            return res.status(404).json({ message: "Test not found" });
        }
        return res.status(200).json({ questions: questionData.questions });
    } catch (error) {
        return res.status(500).json({ message: "Server Error", error: error.message });
    }
}