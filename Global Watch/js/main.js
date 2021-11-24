const API_URL = "http://localhost:3000";
const FILE_NAMES = {
    averageMonthlyPrecipitations: "AverageMonthlyPrecipitations",
    climateChanges: "ClimateChanges",
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
        const workbook = XLSX.read(fileData, {
            type: "binary",
            cellDates: true,
        });
        return XLSX.utils.sheet_to_json(
            workbook.Sheets[workbook.SheetNames[0]],
            { raw: true }
        );
    } catch (error) {
        console.error(error);
    }
}

async function windowIsLoaded() {
    const climateChangeData = await fetchDataFromExcelFile(
        FILE_NAMES.climateChanges
    );
    const globalClimateChanges = climateChangeData.filter(
        (climateChange) => climateChange["Code"] === "OWID_WRL"
    );
    const climateChangesPerYear =
        getClimateChangesPeryYear(globalClimateChanges);
    let tempAnomalyChart = createTemperatureAnomaliesChart(
        {
            title: "Anomalías de temperatura globales por año",
            yAxisTitle: "Temperatura",
            seriesName: "Anomalías de temperatura",
        },
        climateChangesPerYear
    );
}

window.addEventListener("load", windowIsLoaded);
