import extractQuizTablesToJson from "../utiles/tableExtract.js";

const fileExtraction = async function (req, res) {
    try {
        const { testName, fileName } = req.body;

        // Validate fields
        if (!testName?.trim() || !fileName?.trim()) {
            return res.status(400).json({ message: "All fields are required" });
        }

        //  Extract uploaded file path from multer
        const testFile = req.files?.testFile?.[0]?.path;
        if (!testFile) {
            return res.status(400).json({ message: "Test file path is missing" });
        }

        console.log("Extracting:", { testName, fileName, testFile });

        //  Call extraction function (save both to DB and public/data)
        const outputFilePath = await extractQuizTablesToJson(testFile, testName);

        console.log(" File extracted successfully:", outputFilePath);

        //  Return JSON response to frontend
        return res.status(200).json({
            message: "File extracted and saved successfully",
            outputFile: `/data/${testName.replace(/\s+/g, "_").toLowerCase()}.json`
        });

    } catch (error) {
        console.error(" Error in fileExtraction:", error);
        return res.status(500).json({
            message: "Internal Server Error",
            error: error.message
        });
    }
};

export { fileExtraction };
