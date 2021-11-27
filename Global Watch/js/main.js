const API_URL = "http://localhost:3000";
const FILE_NAMES = {
    averageMonthlyPrecipitations: "AverageMonthlyPrecipitations",
    climateChanges: "ClimateChanges",
    coEmissions: "COEmissions",
    futurePopulationProjections: "FuturePopulationProjections",
    totalGHGEmissions: "TotalGHGEmissions",
};

/**
 * Loads the event listeners for the page
 */
function loadEventListeners() {
    // Add event listener to temperature anomaly selectors
    const temperatureAnomalySelectors = Array.from(
        document.querySelectorAll(".temperature-anomaly-selector")
    );
    temperatureAnomalySelectors.map((selector) => {
        selector.addEventListener("click", onTemperatureAnomalyClick);
    });
}

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

async function onTemperatureAnomalyClick(event) {
    event.preventDefault();

    const climateChangeData = await fetchDataFromExcelFile(
        FILE_NAMES.climateChanges
    );

    const { selectorName } = event.target.dataset;
    switch (selectorName) {
        case "global":
            console.log("its global");
            break;
        case "north":
            console.log("its north");
            break;
        case "south":
            console.log("its south");
            break;
        default:
            return;
    }
}

async function windowIsLoaded() {
    loadEventListeners();
    // Get initial data for temperature anomaly line chart
    const climateChangeData = await fetchDataFromExcelFile(
        FILE_NAMES.climateChanges
    );
    console.log(climateChangeData);
    const globalClimateChanges = climateChangeData.filter(
        (climateChange) => climateChange["Code"] === "OWID_WRL"
    );
    const climateChangesPerYear =
        getClimateChangesPeryYear(globalClimateChanges);
    // Create line chart
    createTemperatureAnomaliesChart(
        {
            title: "Anomalías de temperatura globales por año",
            yAxisTitle: "Temperatura",
            seriesName: "Anomalías de temperatura",
        },
        climateChangesPerYear
    );
}

window.addEventListener("load", windowIsLoaded);
