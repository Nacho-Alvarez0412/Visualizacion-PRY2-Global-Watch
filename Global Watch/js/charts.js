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

async function displayCountryData(event) {
    console.log(event);
    // TODO: Fix the fetching to be dynamic
    const poblationData = await fetchDataFromExcelFile(
        "FuturePopulationProjections"
    );
    const countryData = poblationData.filter(
        (entry) => entry["Code"] === event.point["iso-a3"]
    );
    const xAxisData = countryData.map((entry) => entry["Year"].toString());
    Highcharts.chart("country-data-container", {
        title: {
            text: `Proyección de población futura por año de ${event.point.name}`,
        },
        yAxis: {
            title: {
                text: "Cantidad de personas",
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
                name: "Cantidad de personas por año",
                data: countryData.map((entry) => entry["Population Estimates"]),
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
