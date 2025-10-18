import extractQuizTablesToJson from "../utiles/tableExtract.js";


const fileExtraction = async function (req, res) {
    const { testName, fileName } = req.body;
    console.log(testName, fileName);
    if (
        [testName, fileName].some((field) => field?.trim() === "")
    ) {
        throw new Error(400, "All fields are required")
    }


    // file extract from multer.
    const testFile = req.files?.testFile?.[0]?.path;
    //console.log("testFile name", testFile);

    if (!testFile) {
        throw new Error(400, "Test file is path is missing")
    }


    // file give to extraction or question
    const fileData = await extractQuizTablesToJson(testFile, `C:\Users\SudhirYadav\quiz\public\data${fileName}.json`);
    console.log(fileData);

}

export { fileExtraction }