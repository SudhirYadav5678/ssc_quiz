import fs from "fs";
import mammoth from "mammoth";
import { JSDOM } from "jsdom";

/**
 * Convert all quiz-style tables from a Word .docx file into structured JSON
 * @param {string} docxPath - Input Word file path
 * @param {string} outputPath - Output JSON file path
 */
export default async function extractQuizTablesToJson(docxPath, outputPath) {
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
                question_en: "",
                question_hi: "",
                type: "",
                options: [],
                answer: null,
                solution_en: "",
                solution_hi: "",
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
                    quizData.question_en = value || "";
                    lastKey = "question_en";
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
                    quizData.solution_en = value || "";
                    lastKey = "solution_en";
                }
                else if (/Positive Marks/i.test(key)) {
                    quizData.positive_marks = parseInt(value, 10);
                }
                else if (/Negative Marks/i.test(key)) {
                    quizData.negative_marks = parseInt(value, 10);
                }
                else if (isHindi) {
                    // Hindi text that follows English part
                    if (lastKey === "question_en") quizData.question_hi = value || key;
                    else if (lastKey === "solution_en") quizData.solution_hi = value || key;
                }
            });

            if (quizData.question_en && quizData.options.length > 0) {
                allQuizzes.push(quizData);
            }
        });

        // Step 4: Write output JSON
        fs.writeFileSync(outputPath, JSON.stringify(allQuizzes, null, 2), "utf-8");
        console.log(`✅ Extracted ${allQuizzes.length} question(s) → ${outputPath}`);
    } catch (error) {
        console.error("❌ Error extracting tables:", error);
    }
}




// Example usage
// extractQuizTablesToJson("quiz.docx", "quiz_output.json");
