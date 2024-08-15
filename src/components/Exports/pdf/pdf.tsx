import React from 'react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

// Add your custom font
import robotoRegular from './IranSance'; // Base64 string of Roboto-Regular.ttf
import robotoBold from './IranSance'; // Base64 string of Roboto-Bold.ttf


function Pdf({ content, fileName }: any) {
    const exportToPdf = () => {
        const doc: any = new jsPDF();

        // Add custom font
        doc.addFileToVFS('Roboto-Regular.ttf', robotoRegular);
        doc.addFileToVFS('Roboto-Bold.ttf', robotoBold);
        doc.addFont('Roboto-Regular.ttf', 'Roboto', 'normal');
        doc.addFont('Roboto-Bold.ttf', 'Roboto', 'bold');

        // Convert data to headers and rows
        const headers = Object.keys(content[0]);
        const rows = content.map((item: any) => headers.map(header => item[header]?.toString() || ''));

        doc.autoTable({
            head: [headers],
            body: rows,
            startY: 10,
            margin: { horizontal: 10 },
            theme: 'grid',
            styles: { overflow: 'linebreak', font: 'Roboto' }, // Use custom font
            columnStyles: {
                0: { cellWidth: 'auto' },
                1: { cellWidth: 'auto' },
            },
        });

        doc.save(fileName || 'output.pdf');
    };

    return (
        <div className='print-component'>
            <i className='fa fa-file-pdf my-icon' onClick={exportToPdf}></i>
        </div>
    );
};

export default Pdf;
