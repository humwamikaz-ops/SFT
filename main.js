document.addEventListener("DOMContentLoaded", function () {
    var form = document.querySelector("#transaction-form");
    updateUI();
    form.addEventListener("submit", function (event) {
        event.preventDefault();

        var descInput = document.querySelector("#dsc");
        var amountInput = document.querySelector("#amount");
        var dateInput = document.querySelector("#date");
        var categoryInput = document.querySelector("#category");
        var descErr =validateDesc(descInput.value);
        var amountErr = validateAmount(amountInput.value);
        var dateErr = validateDate(dateInput.value);
        var catErr = validateCategory(categoryInput.value);

        document.querySelector("#dsc-error").textContent = descErr || "";
        document.querySelector("#amount-error").textContent = amountErr || "";
        document.querySelector("#date-error").textContent = dateErr || "";
        document.querySelector("#category-error").textContent = catErr || "";
        
        if (descErr || amountErr || dateErr || catErr) {
            document.querySelector("#form-message").textContent = " Fix above errors";
            return;
        }
        var data = {
            description: descInput.value,
            amount: amountInput.value,
            category: categoryInput.value,
            date: dateInput.value
        };
        var editId = form.getAttribute("data-editing");
        if (editId) {
            updateRecord(editId, data);
            form.removeAttribute("data-editing");
            form.querySelector("button[type='submit']").textContent = "Add transaction";
            document.querySelector("#form-message").textContent = "record update successfull.";

        }else {
            addRecord(data);
            document.querySelector("#form-message").textContent = "Record saved";

        }
        form.reset();
        updateUI();
       

    });
    ["#search", "#ignore-case", "#sort-by", "#cap"].forEach(function (id) {
        var element = document.querySelector(id)
        if (element) {
            element.addEventListener("input", updateUI);
            element.addEventListener("change", updateUI);
        }
    });
    document.querySelector("#records-body").addEventListener("click", function (event) {
        var id = event.target.dataset.edit || event.target.dataset.delete;
        if(!id) return;
        if (event.target.dataset.delete) {
            if (confirm("Delete this transaction?")) {
                deleteRecord(id);
                updateUI();

            }
        }
        if (event.target.dataset.edit) {
            var record = getAllRecords().find(function (item) {
                return item.id === id;
            });
            var description = prompt("Description:", record.description);
            if (description === null)  return;

            var amount = prompt("amount:", record.amount);
            if (amount === null)  return;
            
            var category = prompt("category:", record.category);
            if (category === null) return;
            var date = prompt("Date (YYY-MM-DD):", record.date);   
            if (date === null) return;
            
            var error = validateDesc(description) ||
            validateAmount(amount) ||
            validateCategory(category) ||
            validateDate(date);

            if (error) {
                alert(error);
                return;
            }
            updateRecord(id, {
                description: description,
                amount: amount,
                category: category,
                date: date
            });
            updateUI();
        }
    });
    document.querySelector("#export-json").addEventListener("click", function () {
        var file = new Blob([JSON.stringify(getAllRecords(), null, 2)], {
            type: "application/json"
        });
        var link = document.createElement("a");
        link.href = URL.createObjectURL(file);
        link.download = "transactions.json";
        link.click();
        URL.revokeObjectURL(link.href);
    });
    document.querySelector("#import-json").addEventListener("change", function (){
        var file = this.files[0];
        if (!file) return;
        var reader = new FileReader();
        reader.onload = function () {
            try {
                var data = JSON.parse(reader.result);
                if (!Array.isArray(data) || !data.every(function (record) {
                    return record.id && typeof record.description === "string" && Number.isFinite(Number(record.amount)) &&
                    record.category && record.date && record.createdAt && record.updatedAt;
                })) {
                    throw new Error("invalid record format");

                }
                if (confirm("replace current records with imported records?")) {
                    records = data;
                    saveTransacts(records);
                    updateUI();
                }
            }
                catch (error) {
                    alert("import failed. check JSON file");

                }
            };
        reader.readAsText(file);
        
    });

});

