

import React from 'react';
import * as XLSX from 'xlsx';
import '../print/style.scss'

function Excel({ content, fileName, hacdleClick }: any) {
    // نمونه داده
    // const data = [
    //     { name: "Ali", age: 25 },
    //     { name: "Sara", age: 30 },
    //   ];

    const exportToExcel = () => {
        const worksheet = XLSX.utils.json_to_sheet(content);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
        XLSX.writeFile(workbook, `${fileName}.xlsx`);
        hacdleClick();
    };

    return (
        <div className='print-component'>
            <i className='fa fa-file-excel my-icon' onClick={exportToExcel}></i>
        </div>
    );
}

export default Excel;

