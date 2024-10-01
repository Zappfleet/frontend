import React, { useEffect, useState } from 'react';
import mammoth from 'mammoth';
import './style.scss';

const WordProcessor = ({ autoReadFile, wordFile, fileUrl, fields }: any) => {
    const [content, setContent] = useState('');
    const [showPrintContent, setShowPrintContent] = useState<boolean>(false);

    useEffect(() => {
        const fetchFile = async () => {
            const response = await fetch(wordFile);
            const arrayBuffer = await response.arrayBuffer();
            const result = await mammoth.convertToHtml({ arrayBuffer });
            setContent(result.value);
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
        const arrayBuffer = await file.arrayBuffer();
        const result = await mammoth.convertToHtml({ arrayBuffer });
        setContent(result.value);
    };

    const replaceFields = (html: any, fields: any) => {
        let updatedHtml = html;
        for (const [key, value] of Object.entries(fields)) {
            if (key.toLowerCase().includes('image')) {
                const regex = new RegExp(`{{${key}}}`, 'g');
                updatedHtml = updatedHtml.replace(regex, `<img class="word-image" src="${value}" alt="${key}" />`);
            } else {
                const regex = new RegExp(`{{${key}}}`, 'g');
                updatedHtml = updatedHtml.replace(regex, value);
            }
        }
        return updatedHtml;
    };

    const updatedContent = replaceFields(content, fields);

    const printContent = () => {
        const printWindow: any = window.open('', '_blank');
        printWindow.document.write(`
            <html>
                <head>
                    <title>Print</title>
                    <style>
                          body {
                                direction: rtl;
                                font-family: 'Tahoma', sans-serif;
                                
                                
                            }
                         h1{
                                font-size:14px !important;
                                }
                                  p{
                                font-size:14px !important;
                                font-weight:bold;
                                }
                                
                                table{
                                 page-break-after: always;
                                }
                            .word-image {
    float: left;
                                width: 150px;
                                height: 150px;
                            }
                            .print-icon, .eye-icon, .close-icon {
                                display: none;
                            }
                        }
                    </style>
                </head>
                <body class='print-word' style="direction: rtl; text-align: right;">
                    ${updatedContent}
                </body>
            </html>
        `);
        printWindow.document.close();
        printWindow.print();
    };

    return (
        <div className='WordProcessor-component'>
            {showPrintContent && (
                <div className="myPrint">
                    <div className="upload-img">
                        <i className='fa fa-print print-icon' onClick={() => { printContent(); setShowPrintContent(false); }}></i>
                        <div dangerouslySetInnerHTML={{ __html: updatedContent }} style={{ direction: 'rtl', textAlign: 'right' }} />
                    </div>
                    <i className='fa fa-remove close-icon' onClick={() => { setShowPrintContent(false); }}></i>
                </div>
            )}

            {autoReadFile && autoReadFile !== true && <input type="file" onChange={handleFileChange} />}
            <i className='fa fa-print print-icon' onClick={printContent}></i>
            <i className='fa fa-eye eye-icon' onClick={() => setShowPrintContent(true)}></i>
        </div>
    );
};

export default WordProcessor;
