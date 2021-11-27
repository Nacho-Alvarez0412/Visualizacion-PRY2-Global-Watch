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

/**
 * Event handler when temperature anomaly region is selected
 * @param {Event} event The event that is triggered when a region is selected
 * @returns void
 */
async function onTemperatureAnomalyClick(event) {
    event.preventDefault();
    const climateChangeData = await fetchDataFromExcelFile(
        FILE_NAMES.climateChanges
    );
    const { selectorName } = event.target.dataset;
    switch (selectorName) {
        case "global": {
            const globalClimateChanges = climateChangeData.filter(
                (climateChange) => climateChange["Code"] === "OWID_WRL"
            );
            const climateChangesPerYear =
                getClimateChangesPeryYear(globalClimateChanges);
            createTemperatureAnomaliesChart(
                {
                    title: "Anomalías de temperatura globales por año",
                    yAxisTitle: "Temperatura",
                    seriesName: "Anomalías de temperatura",
                },
                climateChangesPerYear
            );
            break;
        }
        case "north": {
            const northernClimateChanges = climateChangeData.filter(
                (climateChange) =>
                    climateChange["Entity"] === "Northern Hemisphere"
            );
            const climateChangesPerYear = getClimateChangesPeryYear(
                northernClimateChanges
            );
            createTemperatureAnomaliesChart(
                {
                    title: "Anomalías de temperatura del hemisferio norte por año",
                    yAxisTitle: "Temperatura",
                    seriesName: "Anomalías de temperatura",
                },
                climateChangesPerYear
            );
            break;
        }
        case "south": {
            const southernClimateChanges = climateChangeData.filter(
                (climateChange) =>
                    climateChange["Entity"] === "Southern Hemisphere"
            );
            const climateChangesPerYear = getClimateChangesPeryYear(
                southernClimateChanges
            );
            createTemperatureAnomaliesChart(
                {
                    title: "Anomalías de temperatura del hemisferio sur por año",
                    yAxisTitle: "Temperatura",
                    seriesName: "Anomalías de temperatura",
                },
                climateChangesPerYear
            );
            break;
        }
        default:
            return;
    }
}

function updateYearDropdown(yearsArr) {
    // Clear current years
    document.getElementById("year-dropdown").innerHTML = "";
    // Add new years
    yearsArr.forEach((year) => {
        const newOptionElement = document.createElement("option");
        newOptionElement.innerText = year;
        newOptionElement.attributes.value = year;
        document.getElementById("year-dropdown").appendChild(newOptionElement);
    });
}

/**
 * Initializes data and sets initial charts
 */
async function windowIsLoaded() {
    loadEventListeners();
    // Get initial data for temperature anomaly line chart
    const climateChangeData = await fetchDataFromExcelFile(
        FILE_NAMES.climateChanges
    );
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
    // Get initial data for global map
    const poblationData = await fetchDataFromExcelFile(
        FILE_NAMES.futurePopulationProjections
    );
    // Get unique years for initial dropdown
    const uniqueYears = getUniqueYears(poblationData);
    updateYearDropdown(uniqueYears);
    // Get population from the initial year
    let currentYearPopulationProjection = [];
    poblationData.forEach(
        (entry) =>
            entry["Year"] === uniqueYears[0] &&
            currentYearPopulationProjection.push({
                country: entry["Code"],
                value: entry["Population Estimates"],
            })
    );
    createWorldChoroplethMap(currentYearPopulationProjection, {
        title: "Proyección de la futura población por país",
        seriesName: "Cantidad de personas",
    });
}

window.addEventListener("load", windowIsLoaded);
