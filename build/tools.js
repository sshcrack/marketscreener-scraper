"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFirstTextOnly = exports.cleanupString = void 0;
function cleanupString(str) {
    str = str.split("\t").join("");
    str = str.split("\n").join("");
    str = str.split("\r").join("");
    str = str.split("  ").join("");
    return str.trim();
}
exports.cleanupString = cleanupString;
function getFirstTextOnly($, element) {
    var text = element.text();
    var nonTextChildren = element
        .children()
        .toArray();
    var textToRemove = nonTextChildren.map(function (node) {
        var childText = $(node).text();
        return childText;
    });
    textToRemove.forEach(function (removal) {
        return text = text.replace(removal, "");
    });
    return text;
}
exports.getFirstTextOnly = getFirstTextOnly;
