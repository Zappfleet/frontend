import React from 'react';
import './style.scss'

function Print({ content, fileName, hacdleClick }: any) {

  

function generateTableHTML(data:any) {
    if (data.length === 0) return '';

    // Create table headers
    const headers = Object.keys(data[0]);
    let headerRow = '<tr>';
    headers.forEach(header => {
        headerRow += `<th>${header}</th>`;
    });
    headerRow += '</tr>';

    // Create table rows
    let rows = '';
    data.forEach((item:any) => {
        let row = '<tr>';
        headers.forEach(header => {
            let cellValue = item[header] || ''; // Handle undefined values
            row += `<td>${cellValue}</td>`;
        });
        row += '</tr>';
        rows += row;
    });

    // Combine headers and rows into final HTML table string
    const tableHTML = `<table border="1" style="width: 100%; border-collapse: collapse;">
        <thead>${headerRow}</thead>
        <tbody>${rows}</tbody>
    </table>`;

    return tableHTML;
}

const content1 = generateTableHTML(content);
  
    const handlePrint = () => {
        const printWindow: any = window.open('', '_blank');
        printWindow.document.write(`<html><head><title>Print</title></head><body>${content1}</body></html>`);
        printWindow.document.close();
        printWindow.print();
        hacdleClick();
    };

    return (
        <div className='print-component'>
            <i className='fa fa-print my-icon' onClick={handlePrint}></i>
        </div>
    );
}

export default Print;