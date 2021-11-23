const API_URL = "http://localhost:3000";
const FILE_NAMES = {
    averageMonthlyPrecipitations: "AverageMonthlyPrecipitations",
    climateChanges: "ClimateChange",
    coEmissions: "COEmissions",
    futurePopulationProjections: "FuturePopulationProjections",
    totalGHGEmissions: "TotalGHGEmissions",
};

/**
 * Reads the data from an excel file
 * @param {string} datasetName The name of the data set to read
 * @returns An array of objects
 */
async function fetchDataFromExcelFile(datasetName) {
    try {
        const response = await fetch(`${API_URL}/${datasetName}.xlsx`);
        const fileData = await response.arrayBuffer();
        // Read data as excel file
        const workbook = XLSX.read(fileData, { type: "binary" });
        return XLSX.utils.sheet_to_json(
            workbook.Sheets[workbook.SheetNames[0]]
        );
    } catch (error) {
        console.error(error);
    }
}

async function windowIsLoaded() {
    const climateChangeData = await fetchDataFromExcelFile(
        FILE_NAMES.climateChanges
    );
    console.table(climateChangeData);
}

window.addEventListener("load", windowIsLoaded);
