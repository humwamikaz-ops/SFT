var key = "student_finaance_records";
function saveTransacts(records) {
    localStorage.setItem(key, JSON.stringify(records));

}
function loadTransacts() {
    try {
        return JSON.parse(localStorage.getItem(key) || "[]");
    }
    catch (error) {
        return [];
    }
}