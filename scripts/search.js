function safeRegex(query, ignoreCase) {
    if (!query) return null;
    try {
        return { pattern: new RegExp(query, ignoreCase ? "i" : ""), error: null};
    }
    catch (error) {
        return { pattern: null, error: "invalid pattern"};
    }

}
function filterRecords(records, query, ignoreCase) {
    if (!query) return { result: records, error: null };
    var res = safeRegex(query, ignoreCase);
    if (res.error) return { result: [], error: res.error };
    var pattern = res.pattern;
    var filtered = records.filter(function (record) {
        return pattern.test(record.description) ||
        pattern.test(record.category) ||
        pattern.test(String(record.amount));
    });
    return { result: filtered, error: null };

    
}
function escapeHtml(str) {
    return String(str).replace(/[&<>"]/g, function (char) {
        return {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;"
        }[char];
    });
}
function highlightText(text, query, ignoreCase) {
    if (!query) return escapeHtml(text);
    try {
        var escapedQuery = query.replace(/[-\/\\^$*+?.()|[\]{}]/g,  '\\$&');
        var pattern = new RegExp("(" + escapedQuery + ")", ignoreCase ? "gi" : "g");
        var parts = String(text).split(pattern);
        return parts.map(function (part, i) {
            if (i % 2 === 1){
                return "<mark>" + escapeHtml(part) + "</mark>";
            }
            return escapeHtml(part);
        }).join("");
    }
    catch (error) {
        return escapeHtml(text);
    }
}