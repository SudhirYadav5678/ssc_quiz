import extractQuizTablesToJson from "../utiles/tableExtract.js";


const fileExtraction = async function (req, res) {
    const { testName, subName } = req.body;
    console.log(testName, subName);
    if (
        [testName, subName].some((field) => field?.trim() === "")
    ) {
        throw new Error(400, "All fields are required")
    }


    // file extract from multer.
    const testFile = req.files?.testFile?.[0]?.path;
    if (!testFile) {
        throw new Error(400, "Test file is path is missing")
    }

    // file give to extraction or question
    const fileData = extractQuizTablesToJson(testFile, "quiz_output.json");
    console.log(fileData);

}

export { fileExtraction }