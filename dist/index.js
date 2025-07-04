import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.vfs;
export function generatePdf(documentData, withDownload = false) {
    console.log("test 6");
    const { Title, Sections } = documentData;
    const content = [{ text: Title, style: 'header' },
        ...Sections.map(section => {
            var _a, _b;
            if (section.Type.toString() === '0') {
                return { text: section.Text, margin: [0, 5] };
            }
            if (section.Type.toString() === '1') {
                return {
                    table: {
                        headerRows: 1, widths: Array((_a = section.Headers) === null || _a === void 0 ? void 0 : _a.length).fill('*'),
                        body: [
                            section.Headers,
                            ...((_b = section.Rows) !== null && _b !== void 0 ? _b : [])
                        ]
                    },
                    layout: 'lightHorizontalLines',
                    margin: [0, 10]
                };
            }
            if (section.Type.toString() === '2') {
                return { columns: [{ text: section.Left, alignment: 'left' }, { text: section.Right, alignment: 'right' }], margin: [0, 30] };
            }
            return {};
        })];
    const docDefinition = {
        content,
        styles: { header: { fontSize: 18, bold: true, margin: [0, 0, 0, 10] } },
    };
    return new Promise((resolve, reject) => {
        const pdf = pdfMake.createPdf(docDefinition, undefined);
        if (withDownload)
            pdf.download('document.pdf');
        pdf.getBlob(blob => {
            if (blob) {
                resolve(blob);
            }
            else {
                console.error('PdfMake повернув порожній Blob. Можливі причини: проблеми з контентом, шрифтами або внутрішня помилка pdfMake.');
                reject(new Error('Не вдалося згенерувати PDF Blob'));
            }
        });
    });
}
