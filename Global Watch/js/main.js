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

function getYearFromDate(date) {
    if (date instanceof Date) {
        return date.getFullYear().toString();
    }
    let dateArr = date.split("-");
    return dateArr[0];
}

function getClimateChangesPeryYear(globalClimateChanges) {
    // Get average temperature anomaly per year
    let yearlyClimateChanges = [];
    yearlyClimateChanges.push({
        year: getYearFromDate(globalClimateChanges[0]["Day"]),
        temperatureAnomaly: 0,
    });
    let amountOfChangesPerYear = 0;
    globalClimateChanges.forEach((climateChange, index) => {
        // Check if year has not been registered
        const currentYear = getYearFromDate(climateChange["Day"]);
        if (
            index !== 0 &&
            currentYear !==
                yearlyClimateChanges[yearlyClimateChanges.length - 1].year
        ) {
            // Calcualte yearly climate change
            yearlyClimateChanges[
                yearlyClimateChanges.length - 1
            ].temperatureAnomaly /= amountOfChangesPerYear;
            yearlyClimateChanges.push({
                year: getYearFromDate(climateChange["Day"]),
                temperatureAnomaly: 0,
            });
            amountOfChangesPerYear = 0;
        }
        // Add temperature anomaly to current year
        yearlyClimateChanges[
            yearlyClimateChanges.length - 1
        ].temperatureAnomaly += parseFloat(
            climateChange["temperature_anomaly"]
        );
        amountOfChangesPerYear++;
    });
    yearlyClimateChanges[yearlyClimateChanges.length - 1].temperatureAnomaly /=
        amountOfChangesPerYear;
    return yearlyClimateChanges;
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
    Highcharts.chart("temperature-anomaly-container", {
        title: {
            text: "Anomalías de temperatura en el planeta",
        },
        yAxis: {
            title: {
                text: "Anomalía de temperatura",
            },
        },
        legend: {
            layout: "vertical",
            align: "right",
            verticalAlign: "middle",
        },

        plotOptions: {
            series: {
                label: {
                    connectorAllowed: false,
                },
                pointStart: parseInt(climateChangesPerYear[0].year),
            },
        },

        series: [
            {
                name: "Temperature anomalies",
                data: climateChangesPerYear.map(
                    (climateChange) => climateChange.temperatureAnomaly
                ),
            },
        ],

        responsive: {
            rules: [
                {
                    condition: {
                        maxWidth: 500,
                    },
                    chartOptions: {
                        legend: {
                            layout: "horizontal",
                            align: "center",
                            verticalAlign: "bottom",
                        },
                    },
                },
            ],
        },
    });
}

window.addEventListener("load", windowIsLoaded);
