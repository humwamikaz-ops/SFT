function validateDesc(desc) {
    if (!desc || !/^\S(?:.*\S)?$/.test(desc)) {
        return "Enter a description (!no empty spaces aloowed!)";
    }
    if (/\b(\w+)\s+\1\b/i.test(desc)) {
        return "You repeated a word.";
    }

    return null;
}
function validateAmount(amount) {
    if (!/^(0|[1-9]\d*)(\.\d{1,2})?$/.test(amount)) {
        return "enter valid amount any whole number up to 2 decimal places";
    }
    return null;

}
function validateDate(date) {
    var pattern = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/;
    if (!pattern.test(date)) {
        return "Use format YEAR-MONTH-DAY";

    }
    var parts = date.split("-");
    var check = new Date(parts[0], parts[1] -1, parts[2]);
    if (check.getFullYear() !=parts[0] || check.getMonth() != parts[1] -1 || check.getDate() != parts[2]) {
        return "That date is invalid";
    }
    return null;

}
function validateCategory(category) {
    var pattern = /^[A-Za-z]+(?:[ -][A-Za-z]+)*$/;
    if (!pattern.test(category)) {
        return "lettters, spaces or hyohens can be used to fill in the category";
    }
    return null;
}