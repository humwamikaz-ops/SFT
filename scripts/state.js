var records = loadTransacts();
function getAllRecords() {
    return records;
}
function addRecord(data) {
    var now = new Date().toISOString();
    var record = {
        id: "rec_" + Date.now(),
        description: data.description,
        amount: Number(data.amount),
        category: data.category,
        date: data.date,
        createdAt: now,
        updatedAt: now

    };
    records.push(record);
    saveTransacts(records);

}
function updateRecord(id, data) {
    var record = records.find(function (item) {
        return item.id == id;
    });
    if (!record) return;
    record.description = data.description;
    record.amount = Number(data.amount);
    record.category = data.category;
    record.date = data.date;
    record.updatedAt = new Date().toISOString();
    saveTransacts(records);

}
function deleteRecord(id) {
    records = records.filter(function (item){
        return item.id !== id;
    });
    saveTransacts(records);
}