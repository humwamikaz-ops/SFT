function updateUI() {
    var all = getAllRecords();
    var query = document.querySelector("#search");
    var ignore = document.querySelector("#ignore-case");
    var searchText = query ? query.value : "";
    var ignoreCase = ignore ? ignore.checked : true;

    var filterRes = filterRecords(all, searchText, ignoreCase);
    var searchErrorEl = document.querySelector("#search-error");
    if (searchErrorEl) { searchErrorEl.textContent = filterRes.error || ""; }
    var shown = filterRes.result.slice();


    var sort = document.querySelector("#sort-by");
    if (sort) {
        var type = sort.value;

        shown.sort(function (a, b) {
            if (type === "amount") return a.amount - b.amount;
            if (type === "description") {
                return a.description.localeCompare(b.description);
            }
            return a.date.localeCompare(b.date);
        });
    }
    var body = document.querySelector("#records-body");
    if (body) {
        body.innerHTML = "";
        shown.forEach(function (record) {
            var row = document.createElement("tr");
            
            row.innerHTML =
            "<td>" + highlightText(record.description, searchText, ignoreCase) + "</td>" +
            "<td>" + Number(record.amount).toFixed(2) + "</td>" +
            "<td>" + highlightText(record.category, searchText, ignoreCase) + "</td>" +
            "<td>" + record.date + "</td>" +
            '<td><button data-edit="' + record.id + '">Edit</button> ' +
            '<button data-delete="' + record.id + '">Delete</button></td>';
            body.appendChild(row);

        });
    }
    var total = 0;
    var categories = {};

    all.forEach(function(record) {
        total += Number(record.amount);
        categories[record.category] =
        (categories[record.category] || 0) + Number(record.amount);
    });
    var top = "None";
    Object.keys(categories).forEach(function (category) {
        if (top === "None" || categories[category] > categories[top]) {
            top = category;
        }
    });
    document.querySelector("#records-count").textContent = all.length;
    document.querySelector("#total").textContent = total.toFixed(2);
    document.querySelector("#top-category").textContent = top;

    var lastWeek = new Date();
    lastWeek.setDate(lastWeek.getDate() -6);

    var weekly = all.filter(function (record) {
        var date = new Date(record.date);
        return date >= lastWeek && date <= new Date();
    }).length;
    document.querySelector("#weekly-trend").textContent =  
    weekly + " transactions in the past week";
    var capInput = document.querySelector("#cap");
    var message = document.querySelector("#cap-message");
    if (capInput && message) {
        var cap = Number(capInput.value);
        var remaining = cap - total;

        if (remaining >= 0) {
            message.textContent = remaining.toFixed(2) + " remaining";
            message.setAttribute("aria-live", "polite");

        }
        else{
            message.textContent = "over budget by " +
            Math.abs(remaining).toFixed(2);
            message.setAttribute("aria-live", "assertive");
        }
    }
    renderChart(all);

}
function renderChart(allRecords) {
    var chartEl = document.querySelector("#chart");
    if (!chartEl) return;
    chartEl.innerHTML = "";
    var today = new Date();
    var dailyTotals = [];
    var maxDaily = 1;
    function formatDateStr(d) {
        var m = String(d.getMonth() + 1);
        var day = String(d.getDate());
        return d.getFullYear() + "-" + (m.length < 2 ? "0" + m : m) + "-" + (day.length < 2 ? "0" + day : day);

    }
    for (var i = 6; i>= 0; i--) {
        var d = new Date();
        d.setDate(today.getDate() - i);
        var dStr = formatDateStr(d);

        var sumDay = allRecords
        .filter(function(r) { return r.date === dStr; })
        .reduce(function(acc, r) { return acc + Number(r.amount); }, 0);

        dailyTotals.push({date: dStr, total:sumDay });
        if (sumDay > maxDaily) maxDaily =sumDay;

    }
    dailyTotals.forEach(function (dt) {
        var pct = (dt.total / maxDaily) * 100;
        var container = document.createElement("div");
        container.className = "chart-bar-container";
        container.innerHTML = '<div class="chart-bar" style="height: ' + Math.max(pct, 4) + '%;" title ="' + dt.date + ': ' +dt.total + '"></div>' + '<div class="chart-label">' + dt.date.slice(5) + '</div>';
        chartEl.appendChild(container);
    });
    chartEl.setAttribute("role", "img");
    chartEl.setAttribute("aria-label", "Bar showing daily spendings for past week");
}