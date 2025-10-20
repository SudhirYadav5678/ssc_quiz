import fs from "fs";
import mammoth from "mammoth";
import { JSDOM } from "jsdom";
import { Question } from "../model/question.model.js";
import path from "path";

/**
 * Convert all quiz-style tables from a Word .docx file into structured JSON
 * @param {string} docxPath - Input Word file path
 * @param {string} outputPath - Output JSON file path
 */

export default async function extractQuizTablesToJson(docxPath, testName) {
    try {
        // Step 1: Convert Word -> HTML using mammoth
        const { value: html } = await mammoth.convertToHtml({ path: docxPath });

        // Step 2: Parse HTML using jsdom
        const dom = new JSDOM(html);
        const tables = dom.window.document.querySelectorAll("table");

        const allQuizzes = [];

        // Step 3: Loop through each table (each question)
        tables.forEach((table, index) => {
            const rows = table.querySelectorAll("tr");
            const quizData = {
                question: "",
                type: "",
                options: [],
                answer: null,
                solution: "",
                positive_marks: 0,
                negative_marks: 0
            };

            let lastKey = "";

            rows.forEach((row) => {
                const cells = row.querySelectorAll("td, th");
                if (cells.length === 0) return;

                const key = cells[0]?.textContent.trim();
                const value = cells[1]?.textContent.trim();

                // If Hindi (detected by Unicode)
                const isHindi = /^[\u0900-\u097F]/.test(value || key);

                if (/^Question/i.test(key)) {
                    quizData.question = value || "";
                    lastKey = "question";
                }
                else if (/^Type/i.test(key)) {
                    quizData.type = value || "";
                }
                else if (/^Option/i.test(key)) {
                    if (value) quizData.options.push(value);
                }
                else if (/^Answer/i.test(key)) {
                    quizData.answer = parseInt(value, 10);
                }
                else if (/^Solution/i.test(key)) {
                    quizData.solution = value || "";
                    lastKey = "solution_en";
                }
                else if (/Positive Marks/i.test(key)) {
                    quizData.positive_marks = parseInt(value, 10);
                }
                else if (/Negative Marks/i.test(key)) {
                    quizData.negative_marks = parseInt(value, 10);
                }
            });

            if (quizData.question && quizData.options.length > 0) {
                allQuizzes.push(quizData);
            }
        });

        if (allQuizzes.length === 0) {
            console.warn("⚠️ No valid questions found in document.");
            return;
        }
        //console.log("all Quizes", allQuizzes);


        //Store in MongoDB correctly
        const question_db = await Question.create({
            testName,
            questions: allQuizzes
        });

        console.log(`Stored ${allQuizzes.length} questions for test "${testName}"`);


        // //Step: Save JSON file to public/data
        // const dataDir = path.join(process.cwd(), "public", "data");
        // if (!fs.existsSync(dataDir)) {
        //     fs.mkdirSync(dataDir, { recursive: true }); // ensure folder exists
        // }

        // const outputPath = path.join(dataDir, `${testName.replace(/\s+/g, "_").toLowerCase()}.json`);
        // fs.writeFileSync(outputPath, JSON.stringify(allQuizzes, null, 2), "utf-8");

        // console.log(`Data saved successfully → ${outputPath}`);
        // return outputPath;

        // Step: Save JS file (ESM export) to public/data
        const dataDir = path.join(process.cwd(), "public", "data");
        if (!fs.existsSync(dataDir)) {
            fs.mkdirSync(dataDir, { recursive: true });
        }

        const outputPath = path.join(
            dataDir,
            `${testName.replace(/\s+/g, "_").toLowerCase()}.js`
        );

        // Format as ESM export
        const jsContent = `export const data = ${JSON.stringify(allQuizzes, null, 2)};\n`;

        fs.writeFileSync(outputPath, jsContent, "utf-8");

        console.log(`✅ Data saved successfully → ${outputPath}`);
        return outputPath;


    } catch (error) {
        console.error("Error extracting tables:", error);
        process.exit(1);
    }
}
