"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generatePdf = generatePdf;
var pdfMake = require("pdfmake/build/pdfmake");
function generatePdf(documentData, withDownload) {
    if (withDownload === void 0) { withDownload = false; }
    console.log('test 2');
    console.log("test 3");
    var Title = documentData.Title, Sections = documentData.Sections;
    var content = __spreadArray([{ text: Title, style: 'header' }], Sections.map(function (section) {
        var _a, _b;
        if (section.Type.toString() === '0') {
            return { text: section.Text, margin: [0, 5] };
        }
        if (section.Type.toString() === '1') {
            return {
                table: {
                    headerRows: 1, widths: Array((_a = section.Headers) === null || _a === void 0 ? void 0 : _a.length).fill('*'),
                    body: __spreadArray([
                        section.Headers
                    ], ((_b = section.Rows) !== null && _b !== void 0 ? _b : []), true)
                },
                layout: 'lightHorizontalLines',
                margin: [0, 10]
            };
        }
        if (section.Type.toString() === '2') {
            return { columns: [{ text: section.Left, alignment: 'left' }, { text: section.Right, alignment: 'right' }], margin: [0, 30] };
        }
        return {};
    }), true);
    var fonts = {
        NotoSans: {
            normal: 'https://fonts-07cc13.gitlab.io/fonts/NotoSans-Regular.ttf',
            bold: 'https://fonts-07cc13.gitlab.io/fonts/NotoSans-Bold.ttf',
            italics: 'https://fonts-07cc13.gitlab.io/fonts/NotoSans-Italic.ttf',
            bolditalics: 'https://fonts-07cc13.gitlab.io/fonts/NotoSans-BoldItalic.ttf'
        }
    };
    var docDefinition = {
        content: content,
        styles: { header: { fontSize: 18, bold: true, margin: [0, 0, 0, 10] } },
        defaultStyle: {
            font: 'NotoSans'
        },
    };
    return new Promise(function (resolve, reject) {
        var pdf = pdfMake.createPdf(docDefinition, undefined, fonts);
        if (withDownload)
            pdf.download('document.pdf');
        pdf.getBlob(function (blob) {
            if (blob) {
                resolve(blob);
            }
            else {
                reject(new Error('Не вдалося згенерувати PDF Blob'));
            }
        });
        pdf.open();
    });
}
