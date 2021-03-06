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
    const choroplethMapSelectors = Array.from(
        document.querySelectorAll(".map-selector")
    );
    choroplethMapSelectors.map((selector) => {
        selector.addEventListener("click", onMapSelectorClick);
    });
    // Event listener for year dropdown
    document
        .getElementById("year-dropdown")
        .addEventListener("change", onYearDropdownChange);
    // Event listener for play button
    document
        .querySelector(".btn-play")
        .addEventListener("click", onPlayButtonClick);
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
                    title: "Anomal??as de temperatura globales por a??o",
                    yAxisTitle: "Temperatura",
                    seriesName: "Anomal??as de temperatura",
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
                    title: "Anomal??as de temperatura del hemisferio norte por a??o",
                    yAxisTitle: "Temperatura",
                    seriesName: "Anomal??as de temperatura",
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
                    title: "Anomal??as de temperatura del hemisferio sur por a??o",
                    yAxisTitle: "Temperatura",
                    seriesName: "Anomal??as de temperatura",
                },
                climateChangesPerYear
            );
            break;
        }
        default:
            return;
    }
}

/**
 * Updates the map data
 * @param {Event} event Click event object
 */
async function onMapSelectorClick(event) {
    event.preventDefault();
    // Set all selectors to false
    const mapSelectors = Array.from(document.querySelectorAll(".map-selector"));
    mapSelectors.forEach((selector) => {
        selector.dataset.selected = "false";
    });
    // Set current selector to selected
    event.target.dataset.selected = "true";
    // Update map data and dropdown
    const { selector } = event.target.dataset;
    switch (selector) {
        case "population": {
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
                title: "Proyecci??n de la futura poblaci??n por pa??s",
                seriesName: "Cantidad de personas",
                minColor: "#e3dd2b",
                maxColor: "#348c41",
            });
            break;
        }
        case "precipitations": {
            // Get initial data for global map
            const precipiationData = await fetchDataFromExcelFile(
                FILE_NAMES.averageMonthlyPrecipitations
            );
            // Get unique years for initial dropdown
            const uniqueYears = getUniqueYears(precipiationData);
            updateYearDropdown(uniqueYears);
            // Get population from the initial year
            let currentYearPrecipitations = [];
            precipiationData.forEach(
                (entry) =>
                    entry["Year"] === uniqueYears[0] &&
                    currentYearPrecipitations.push({
                        country: entry["Code"],
                        value: entry["Average monthly precipitation"],
                    })
            );
            createWorldChoroplethMap(currentYearPrecipitations, {
                title: "Promedio de precipitaciones mensuales por pais",
                seriesName: "N??mero de precipitaciones promedio por mes",
                minColor: "#CCCFFF",
                maxColor: "#000F36",
            });
            break;
        }
        case "co2": {
            // Get initial data for global map
            const co2Data = await fetchDataFromExcelFile(
                FILE_NAMES.coEmissions
            );
            // Get unique years for initial dropdown
            const uniqueYears = getUniqueYears(co2Data);
            updateYearDropdown(uniqueYears);
            // Get population from the initial year
            let currentYearCO2Emissions = [];
            co2Data.forEach(
                (entry) =>
                    entry["Year"] === uniqueYears[0] &&
                    currentYearCO2Emissions.push({
                        country: entry["Code"],
                        value: entry["Annual CO2 emissions (per capita)"],
                    })
            );
            createWorldChoroplethMap(currentYearCO2Emissions, {
                title: "Emisiones de CO2 per capita por pa??s",
                seriesName: "Emisiones de CO2 per capita",
                minColor: "#47e022",
                maxColor: "#f51101",
            });
            break;
        }
        case "ghg": {
            // Get initial data for global map
            const ghgData = await fetchDataFromExcelFile(
                FILE_NAMES.totalGHGEmissions
            );
            // Get unique years for initial dropdown
            const uniqueYears = getUniqueYears(ghgData);
            updateYearDropdown(uniqueYears);
            // Get population from the initial year
            let currentYearGHGEmissions = [];
            ghgData.forEach(
                (entry) =>
                    entry["Year"] === uniqueYears[0] &&
                    currentYearGHGEmissions.push({
                        country: entry["Code"],
                        value: entry[
                            "Total GHG emissions excluding LUCF (CAIT)"
                        ],
                    })
            );
            createWorldChoroplethMap(currentYearGHGEmissions, {
                title: "Total de emisiones de gases de efecto invernadero por pa??s",
                seriesName: "Total de emisiones",
                minColor: "#47e022",
                maxColor: "#f51101",
            });
            break;
        }
        default:
            break;
    }
}

/**
 * Updates the choropleth map with the data from the year
 * @param {Event} event Event object triggered when dropdown changes
 */
async function onYearDropdownChange(event) {
    const selector = getCurrentMapSelector();

    let datasetName, datasetValueName;
    switch (selector) {
        case "population": {
            datasetName = FILE_NAMES.futurePopulationProjections;
            datasetValueName = "Population Estimates";
            break;
        }
        case "precipitations": {
            datasetName = FILE_NAMES.averageMonthlyPrecipitations;
            datasetValueName = "Average monthly precipitation";
            break;
        }
        case "co2": {
            datasetName = FILE_NAMES.coEmissions;
            datasetValueName = "Annual CO2 emissions (per capita)";
            break;
        }
        case "ghg": {
            datasetName = FILE_NAMES.totalGHGEmissions;
            datasetValueName = "Total GHG emissions excluding LUCF (CAIT)";
            break;
        }
        default:
            break;
    }
    const dataset = await fetchDataFromExcelFile(datasetName);
    // Get data from the year
    const currentYear = parseInt(event.target.value);
    let currentYearData = [];
    dataset.forEach(
        (entry) =>
            entry["Year"] === currentYear &&
            currentYearData.push({
                country: entry["Code"],
                value: entry[datasetValueName],
            })
    );
    // Create choropleth map
    switch (selector) {
        case "population": {
            createWorldChoroplethMap(currentYearData, {
                title: "Proyecci??n de la futura poblaci??n por pa??s",
                seriesName: "Cantidad de personas",
                minColor: "#e3dd2b",
                maxColor: "#348c41",
            });
            break;
        }
        case "precipitations": {
            createWorldChoroplethMap(currentYearData, {
                title: "Promedio de precipitaciones mensuales por pais",
                seriesName: "N??mero de precipitaciones promedio por mes",
                minColor: "#CCCFFF",
                maxColor: "#000F36",
            });
            break;
        }
        case "co2": {
            createWorldChoroplethMap(currentYearData, {
                title: "Emisiones de CO2 per capita por pa??s",
                seriesName: "Emisiones de CO2 per capita",
                minColor: "#47e022",
                maxColor: "#f51101",
            });
            break;
        }
        case "ghg": {
            createWorldChoroplethMap(currentYearData, {
                title: "Total de emisiones de gases de efecto invernadero por pa??s",
                seriesName: "Total de emisiones",
                minColor: "#47e022",
                maxColor: "#f51101",
            });
            break;
        }
        default:
            break;
    }
}

/**
 * Updates the year dropdown
 * @param {Array} yearsArr An array with the new years
 */
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

async function onPlayButtonClick() {
    const selector = getCurrentMapSelector();
    let dataset, valueName;
    switch (selector) {
        case "population": {
            dataset = await fetchDataFromExcelFile(
                FILE_NAMES.futurePopulationProjections
            );
            valueName = "Population Estimates";
            break;
        }
        case "precipitations": {
            dataset = await fetchDataFromExcelFile(
                FILE_NAMES.averageMonthlyPrecipitations
            );
            valueName = "Average monthly precipitation";
            break;
        }
        case "co2": {
            dataset = await fetchDataFromExcelFile(FILE_NAMES.coEmissions);
            valueName = "Annual CO2 emissions (per capita)";
            break;
        }
        case "ghg": {
            dataset = await fetchDataFromExcelFile(
                FILE_NAMES.totalGHGEmissions
            );
            valueName = "Total GHG emissions excluding LUCF (CAIT)";
            break;
        }
        default:
            break;
    }
    const years = getUniqueYears(dataset);
    let currentYearIdx = 0;
    let intervalId = null;
    clearInterval(intervalId);
    intervalId = setInterval(frame, 10);

    function frame() {
        if (currentYearIdx === years.length) {
            clearInterval(intervalId);
            // Return button to normal state
            document.querySelector(".btn-play").innerHTML = "";
            const playIcon = document.createElement("i");
            playIcon.className = "fas fa-play";
            document.querySelector(".btn-play").appendChild(playIcon);
            return;
        }
        let currentYearData = [];
        dataset.forEach(
            (entry) =>
                entry["Year"] === years[currentYearIdx] &&
                currentYearData.push({
                    country: entry["Code"],
                    value: entry[valueName],
                })
        );
        // Create choropleth map
        switch (selector) {
            case "population": {
                createWorldChoroplethMap(currentYearData, {
                    title: "Proyecci??n de la futura poblaci??n por pa??s",
                    seriesName: "Cantidad de personas",
                    minColor: "#e3dd2b",
                    maxColor: "#348c41",
                });
                break;
            }
            case "precipitations": {
                createWorldChoroplethMap(currentYearData, {
                    title: "Promedio de precipitaciones mensuales por pais",
                    seriesName: "N??mero de precipitaciones promedio por mes",
                    minColor: "#CCCFFF",
                    maxColor: "#000F36",
                });
                break;
            }
            case "co2": {
                createWorldChoroplethMap(currentYearData, {
                    title: "Emisiones de CO2 per capita por pa??s",
                    seriesName: "Emisiones de CO2 per capita",
                    minColor: "#47e022",
                    maxColor: "#f51101",
                });
                break;
            }
            case "ghg": {
                createWorldChoroplethMap(currentYearData, {
                    title: "Total de emisiones de gases de efecto invernadero por pa??s",
                    seriesName: "Total de emisiones",
                    minColor: "#47e022",
                    maxColor: "#f51101",
                });
                break;
            }
            default:
                break;
        }
        document.querySelector(".btn-play").innerHTML = years[currentYearIdx];
        currentYearIdx++;
    }
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
            title: "Anomal??as de temperatura globales por a??o",
            yAxisTitle: "Temperatura",
            seriesName: "Anomal??as de temperatura",
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
        title: "Proyecci??n de la futura poblaci??n por pa??s",
        seriesName: "Cantidad de personas",
        minColor: "#e3dd2b",
        maxColor: "#348c41",
    });
}

window.addEventListener("load", windowIsLoaded);
