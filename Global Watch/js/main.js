const API_URL = "http://localhost:3000";

async function getCountryClimateChanges() {
    const response = await fetch(`${API_URL}/1_climate-change.xlsx`);
    const fileData = await response.arrayBuffer();
    const workbook = XLSX.read(fileData, { type: "binary" });
    return XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]);
}

async function windowIsLoaded() {
    await getCountryClimateChanges();
}

window.addEventListener("load", windowIsLoaded);
