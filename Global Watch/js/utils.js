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
