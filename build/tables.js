"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSimpleTable = exports.getMarketTable = void 0;
var tools_1 = require("./tools");
function getMarketTable($, businessTable, skipElements) {
    if (skipElements === void 0) { skipElements = 2; }
    var tableChildren = businessTable.children("tr").toArray();
    var columnNames = $(tableChildren.shift())
        .children("td")
        .toArray()
        //Removing first element because first one is a placeholder
        .slice(1)
        .map(function (e) { return $(e).text(); });
    var res = {};
    tableChildren.map(function (node) {
        var element = $(node);
        //Duplicate Array
        var columnNamesLeft = columnNames.concat([]);
        var childs = element
            .children("td")
            .toArray();
        var row = $(childs.shift());
        var rowName = tools_1.getFirstTextOnly($, row);
        if (!rowName)
            return;
        var rowData = {};
        var toAdd = [];
        childs.map(function (n, i) {
            var child = $(n);
            var shouldAdd = i % skipElements === (skipElements - 1);
            var text = child.text();
            var cleanedUp = tools_1.cleanupString(text);
            toAdd.push(cleanedUp);
            if (shouldAdd) {
                var header = columnNamesLeft.shift();
                if (header)
                    rowData[header] = toAdd;
                toAdd = [];
            }
        });
        if (toAdd.length !== 0) {
            var header = columnNamesLeft.shift();
            if (header)
                rowData[header] = toAdd;
        }
        res[rowName] = rowData;
    });
    return res;
}
exports.getMarketTable = getMarketTable;
function getSimpleTable($, tbody, skipHeaders) {
    if (skipHeaders === void 0) { skipHeaders = 0; }
    var trs = tbody
        .children("tr")
        .toArray();
    var headers = $(trs.shift())
        .children("td")
        .toArray()
        .slice(skipHeaders)
        .map(function (node) { return $(node).text(); })
        .map(function (text) { return tools_1.cleanupString(text); });
    var out = [];
    trs.map(function (node) {
        var el = $(node);
        var currRow = {};
        el.children("td").each(function (i, tdNode) {
            var el = $(tdNode);
            var text = el.text();
            var cleanedUp = tools_1.cleanupString(text);
            currRow[headers[i]] = cleanedUp;
        });
        out.push(currRow);
    });
    return out;
}
exports.getSimpleTable = getSimpleTable;
