/**
 * Gets the average climate changes per year
 * @param {Array} globalClimateChanges An array of objects with temperature anomalies
 * @returns An array of objects with the average climate changes per year
 */
function getClimateChangesPeryYear(climateChanges) {
    // Get average temperature anomaly per year
    let yearlyClimateChanges = [];
    yearlyClimateChanges.push({
        year: getYearFromDate(climateChanges[0]["Day"]),
        temperatureAnomaly: 0,
    });
    let amountOfChangesPerYear = 0;
    climateChanges.forEach((climateChange, index) => {
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
