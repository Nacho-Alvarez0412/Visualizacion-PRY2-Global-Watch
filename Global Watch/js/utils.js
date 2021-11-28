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

/**
 * Gets the bigegst value in a dataset
 * @param {Array} dataset An array of objects with a value atribute
 * @returns The biggest value in the dataset
 */
function getBiggestValue(dataset) {
    let biggestValue = 0;
    dataset.forEach((entry) => {
        if (entry.value > biggestValue) biggestValue = entry.value;
    });
    return biggestValue;
}

/**
 * Gets the current selected map type
 * @returns The name of the current map selected
 */
function getCurrentMapSelector() {
    const mapSelectors = Array.from(document.querySelectorAll(".map-selector"));
    for (let mapSelector of mapSelectors) {
        if (mapSelector.dataset.selected === "true")
            return mapSelector.dataset.selector;
    }
}
