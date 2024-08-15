import React from 'react';
import { saveAs } from 'file-saver';
import { Document, Packer, Paragraph, Table, TableCell, TableRow, TextRun, WidthType } from 'docx';



function Word({ content, fileName, hacdleClick }: any) {
    const convertDataToTableRows = (data: any) => {
        if (data.length === 0) return [new TableRow({ children: [new TableCell({ children: [new Paragraph("No data available")] })] })];

        const headers = Object.keys(data[0]);

        const headerRow = new TableRow({
            children: headers.map(header => new TableCell({
                children: [new Paragraph({ children: [new TextRun(header)] })]
            }))
        });

        const dataRows = data.map((item:any) => new TableRow({
            children: headers.map(header => new TableCell({
                children: [new Paragraph({ children: [new TextRun(item[header]?.toString() || "")] })]
            }))
        }));

        return [headerRow, ...dataRows];
    };

    const exportToWord = () => {
        const tableRows = convertDataToTableRows(content);

        const doc = new Document({
            sections: [{
                properties: {},
                children: [
                    new Table({
                        rows: tableRows,
                        width: { size: 100, type: WidthType.PERCENTAGE }
                    })
                ]
            }]
        });

        Packer.toBlob(doc).then(blob => {
            saveAs(blob, fileName || 'output.docx');
        }).catch(error => {
            console.error('Error generating the document:', error);
        });
    };

    return (
        <div className='print-component'>
            <i className='fa fa-file-word my-icon' onClick={exportToWord}></i>
        </div>
    );
};

export default Word;
