import { DocumentData } from "./models/global";
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';

pdfMake.vfs = pdfFonts.vfs;

export function generatePdf(documentData: DocumentData, withDownload = false) {
  console.log("test 5");
  const { Title, Sections } = documentData
  const content = [{ text: Title, style: 'header' },
  ...Sections.map(section => {
    if (section.Type.toString() === '0') {
      return { text: section.Text, margin: [0, 5] }
    }
    if (section.Type.toString() === '1') {
      return {
        table: {
          headerRows: 1, widths: Array(section.Headers?.length).fill('*'),
          body: [
            section.Headers,
            ...(section.Rows ?? [])
          ]
        },
        layout: 'lightHorizontalLines',
        margin: [0, 10]
      }
    }
    if (section.Type.toString() === '2') {
      return { columns: [{ text: section.Left, alignment: 'left' }, { text: section.Right, alignment: 'right' }], margin: [0, 30] }
    }
    return {}
  })];

  // const fonts = {
  //   NotoSans: {
  //     normal: 'https://fonts-07cc13.gitlab.io/fonts/NotoSans-Regular.ttf',
  //     bold: 'https://fonts-07cc13.gitlab.io/fonts/NotoSans-Bold.ttf',
  //     italics: 'https://fonts-07cc13.gitlab.io/fonts/NotoSans-Italic.ttf',
  //     bolditalics: 'https://fonts-07cc13.gitlab.io/fonts/NotoSans-BoldItalic.ttf'
  //   }
  // };
  const docDefinition: any = {
    content,
    styles: { header: { fontSize: 18, bold: true, margin: [0, 0, 0, 10] } },
    // defaultStyle: {
    //   font: 'NotoSans'
    // },
  };
  return new Promise((resolve, reject) => {
    // const pdf = pdfMake.createPdf(docDefinition, undefined, fonts);
    const pdf = pdfMake.createPdf(docDefinition, undefined);


    if (withDownload) pdf.download('document.pdf');

    pdf.getBlob(blob => {
      if (blob) {
        resolve(blob);
      } else {
        console.error('PdfMake повернув порожній Blob. Можливі причини: проблеми з контентом, шрифтами або внутрішня помилка pdfMake.');
        reject(new Error('Не вдалося згенерувати PDF Blob'));
      }
    });

  });
}