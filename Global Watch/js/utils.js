/**
 * Gets the year from input date
 * @param {Date | string} date The date that contains the year
 * @returns The year of the string
 */
function getYearFromDate(date) {
    if (date instanceof Date) {
        return date.getFullYear().toString();
    }
    let dateArr = date.split("-");
    return dateArr[0];
}

/**
 * Gets all the unique years in a dataset
 * @param {Array} dataset An array of objects with a Year atribute
 * @returns An array with all of the unique years in a dataset
 */
function getUniqueYears(dataset) {
    let uniqueYears = [];
    dataset.forEach(
        (entry) =>
            !uniqueYears.includes(entry["Year"]) &&
            uniqueYears.push(entry["Year"])
    );
    return uniqueYears;
}
