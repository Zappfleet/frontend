import React, { useEffect, useState } from 'react';
import mammoth from 'mammoth';
import './style.scss';

const WordProcessor = ({ autoReadFile, wordFile, fileUrl, fields }: any) => {
    const [content, setContent] = useState('');
    const [showPrintContent, setShowPrintContent] = useState<boolean>(false);
    //console.log(300, wordFile);


    // const fileUrl = 'your-file-url-here.docx'; // آدرس فایل Word خود را اینجا وارد کنید

    useEffect(() => {
        const fetchFile = async () => {


            const response = await fetch(wordFile);
            const arrayBuffer = await response.arrayBuffer();
            const result = await mammoth.convertToHtml({ arrayBuffer });
            setContent(result.value);
            replaceFields(content, fields);
        };

        wordFile && fetchFile();
    }, [wordFile]);


    useEffect(() => {
        const fetchFile = async () => {
            const response = await fetch(fileUrl);
            const arrayBuffer = await response.arrayBuffer();
            const result = await mammoth.convertToHtml({ arrayBuffer });
            setContent(result.value);
        };

        autoReadFile && autoReadFile === true && fetchFile();
    }, [fileUrl]);


    const handleFileChange = async (event: any) => {
        const file = event.target.files[0];
        console.log(741, file);

        const arrayBuffer = await file.arrayBuffer();
        const result = await mammoth.convertToHtml({ arrayBuffer });
        setContent(result.value);
    };

    const replaceFields = (html: any, fields: any) => {
        let updatedHtml = html;
        for (const [key, value] of Object.entries(fields)) {
            // بررسی اگر کلید شامل "image" است، فرض می کنیم که یک محل‌نگهدار تصویر است
            if (key.toLowerCase().includes('image')) {
                const regex = new RegExp(`{{${key}}}`, 'g');
                updatedHtml = updatedHtml.replace(regex, `<img class="word-image"  width="100px" height="100px" src="${value}" alt="${key}" />`);
            } else {
                const regex = new RegExp(`{{${key}}}`, 'g');
                updatedHtml = updatedHtml.replace(regex, value);
            }
        }
        return updatedHtml;
    };


    // const fields = { name: 'John Doe', date: '2024-08-01' };
    const updatedContent = replaceFields(content, fields);

    const printContent = () => {
        const printWindow: any = window.open('', '_blank');
        printWindow.document.write(`<html><head><title>Print</title></head><body>${updatedContent}</body></html>`);
        printWindow.document.close();
        printWindow.print();
    };

    return (
        <div className='WordProcessor-component'>

            {showPrintContent && <div className="myPrint">
                <div className="upload-img">
                    <i className='fa fa-print print-icon' onClick={() => { printContent(); setShowPrintContent(false); }}></i>
                    <div dangerouslySetInnerHTML={{ __html: updatedContent }} />
                </div>

                <i className='fa fa-remove close-icon' onClick={() => { setShowPrintContent(false); }}></i>
            </div>}


            {autoReadFile && autoReadFile !== true && <input type="file" onChange={handleFileChange} />}
            <i className='fa fa-print print-icon' onClick={printContent}></i>
            <i className='fa fa-eye eye-icon' onClick={() => setShowPrintContent(true)}></i>

        </div>
    );
};

export default WordProcessor;
