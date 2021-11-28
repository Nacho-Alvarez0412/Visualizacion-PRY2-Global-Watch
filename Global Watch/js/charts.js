/**
 * Creates a line chart with temperature anomalies data
 * @param {Object} chartOptions The options and config of the chart
 * @param {Array} chartData The data that will be displayed in the chart
 * @returns A reference to the chart
 */
function createTemperatureAnomaliesChart(chartOptions, chartData) {
    const { title, yAxisTitle, seriesName } = chartOptions;
    let temperatureAnomalyChart = Highcharts.chart(
        "temperature-anomaly-container",
        {
            title: {
                text: title,
            },
            yAxis: {
                title: {
                    text: yAxisTitle,
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
                    pointStart: parseInt(chartData[0].year),
                },
            },
            series: [
                {
                    name: seriesName,
                    data: chartData.map(
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
        }
    );
    return temperatureAnomalyChart;
}

/**
 * Displays the country data in a line chart
 * @param {Event} event Event object
 */
async function displayCountryData(event) {
    const fileNames = {
        precipitations: {
            fileName: "AverageMonthlyPrecipitations",
            title: `Precipitaciones promedio mensuales de ${event.point.name}`,
            yAxisTitle: "Precipitaciones mensuales",
            seriesName: "Cantidad de precipitaciones promedio al año",
            valueName: "Average monthly precipitation",
        },
        co2: {
            fileName: "COEmissions",
            title: `Emisiones de CO2 por año de ${event.point.name} per cápita`,
            yAxisTitle: "Emisiones de CO2 anuales per capita",
            seriesName: "Emisiones de CO2",
            valueName: "Annual CO2 emissions (per capita)",
        },
        population: {
            fileName: "FuturePopulationProjections",
            title: `Proyección de población futura por año de ${event.point.name}`,
            yAxisTitle: "Cantidad de personas",
            seriesName: "Cantidad de personas por año",
            valueName: "Population Estimates",
        },
        ghg: {
            fileName: "TotalGHGEmissions",
            title: `Total de gases de efecto invernadero por año de ${event.point.name}`,
            yAxisTitle: "Cantidad de emisiones",
            seriesName: "Cantidad de emisiones por año",
            valueName: "Total GHG emissions excluding LUCF (CAIT)",
        },
    };
    const selector = getCurrentMapSelector();
    const dataset = await fetchDataFromExcelFile(fileNames[selector].fileName);
    const countryData = dataset.filter(
        (entry) => entry["Code"] === event.point["iso-a3"]
    );
    const xAxisData = countryData.map((entry) => entry["Year"].toString());
    Highcharts.chart("country-data-container", {
        title: {
            text: fileNames[selector].title,
        },
        yAxis: {
            title: {
                text: fileNames[selector].yAxisTitle,
            },
        },
        xAxis: [
            {
                categories: xAxisData,
            },
        ],
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
            },
        },
        series: [
            {
                name: fileNames[selector].seriesName,
                data: countryData.map(
                    (entry) => entry[fileNames[selector].valueName]
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

/**
 * Creates a world choropleth map with a given dataset
 * @param {Array} dataset The dataset used to display in the map
 * @param {Object} mapOptions The options of the map
 */
function createWorldChoroplethMap(dataset, mapOptions) {
    const { title, seriesName } = mapOptions;

    Highcharts.mapChart("global-map-container", {
        title: {
            text: title,
        },
        mapNavigation: {
            enabled: true,
            buttonOptions: {
                verticalAlign: "bottom",
            },
        },
        colorAxis: {
            min: 1,
            max: getBiggestValue(dataset),
            type: "logarithmic",
        },
        series: [
            {
                data: dataset,
                mapData: Highcharts.maps["custom/world"],
                joinBy: ["iso-a3", "country"],
                name: seriesName,
                borderColor: "black",
                borderWidth: 0.2,
                states: {
                    hover: {
                        borderWidth: 1,
                    },
                },
                events: {
                    click: displayCountryData,
                },
            },
        ],
    });
}
