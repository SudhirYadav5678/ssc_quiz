

const fileExtraction = async function (req, res) {
    const { testName, subName } = await req.Body;
    if (
        [testName, subName].some((field) => field?.trim() === "")
    ) {
        throw new Error(400, "All fields are required")
    }
    const testFile = req.files?.testFile?.[0]?.path;
    if (!testFile) {
        throw new Error(400, "Test file is path is missing")
    }


}