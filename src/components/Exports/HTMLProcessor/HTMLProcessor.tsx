import React, { useEffect, useState } from 'react';
import mammoth from 'mammoth';
import '../WordProcessor/style.scss';


const HTMLProcessor = ({ autoReadFile, HTMLFile, fileUrl, fields }: any) => {


    const [content, setContent] = useState('');
    const [showPrintContent, setShowPrintContent] = useState<boolean>(false);

    const html = HTMLFile
    useEffect(() => {

        const fetchFile = async () => {
            try {
                // const response = await fetch(HTMLFile);
                // if (!response.ok) throw new Error('Network response was not ok');
                // const arrayBuffer = await response.arrayBuffer();
                // const result = await mammoth.convertToHtml({ arrayBuffer });
                // setContent(result.value);

                setContent(html)
            } catch (error) {
                console.error(156465, 'Error fetching file:', error);
            }

        };

        HTMLFile && fetchFile();
    }, [HTMLFile]);

    // useEffect(() => {
    //     const fetchFile = async () => {
    //         const response = await fetch(fileUrl);
    //         const arrayBuffer = await response.arrayBuffer();
    //         const result = await mammoth.convertToHtml({ arrayBuffer });
    //         setContent(result.value);
    //     };

    //     autoReadFile && autoReadFile === true && fetchFile();
    // }, [fileUrl]);

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
        printWindow.document.write(updatedContent);
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

export default HTMLProcessor;
