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
