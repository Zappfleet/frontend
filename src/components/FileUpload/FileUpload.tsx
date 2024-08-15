import React, { ForwardRefRenderFunction, useImperativeHandle, useRef, useState } from 'react';
import './FileUploadStyle.scss';
import axios from 'axios';

interface FileUploadProps {
  handleGetBase64: (base64: string, fileName: string, name: string, isRef: boolean) => void;
  id: string;
  name: string;
  disabled?: boolean;
}

// تعریف نوع برای ref
export interface FileUploadHandles {
  clearFileInput: () => void;
  setFileInput: (picName: any) => void;
}

//const FileUpload: React.FC<FileUploadProps> = ({ handleGetBase64, id, name }) => {
const FileUpload: ForwardRefRenderFunction<FileUploadHandles, FileUploadProps> = ({ handleGetBase64, id, name, disabled }, ref) => {

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fileNameSave, setFileNameSave] = useState<any>(null)

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      console.log(400, selectedFile.name);

      const newFileName = `${id}_${name}_${selectedFile.name}`;
      setFileNameSave(newFileName)
      const newFile = new File([selectedFile], newFileName, {
        type: selectedFile.type,
        lastModified: selectedFile.lastModified,
      });

      console.log(700, newFile.name);
      uploadFile(newFile);
    }
  };

  const uploadFile = async (file: File) => {
    console.log(47, id, name);

    const formData = new FormData();
    formData.append('uploadedFile', file);
    formData.append('id', id);
    formData.append('name', name);

    try {
      const url = import.meta.env.VITE_ENVIRONMENT_NAME === 'local'
        ? import.meta.env.VITE_BASE_URL
        : import.meta.env.VITE_BASE_URL_SERVER;
      const response = await axios.post(`${url}/upload`, formData);
      console.log(600, response.data);

      const fileName = response.data.data;
      console.log('File uploaded successfully:', response.data.data);
      fetchFile(fileName, false);
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  const fetchFile = async (fileName: string, isRef: boolean) => {
    if (fileName) {
      const url = import.meta.env.VITE_ENVIRONMENT_NAME === 'local'
        ? import.meta.env.VITE_BASE_URL
        : import.meta.env.VITE_BASE_URL_SERVER;

      // console.log(1000, fileName);


      //console.log(700, `${url}/uploads/${fileName}`);

      const response = await axios.get(`${url}/uploads/${fileName}`, {
        responseType: 'arraybuffer',
      });


      const base64String = btoa(
        new Uint8Array(response.data).reduce((data, byte) => data + String.fromCharCode(byte), '')
      );

      handleGetBase64(`data:image/jpeg;base64,${base64String}`, name, fileName, isRef);
    }
  };

  // استفاده از useImperativeHandle برای اضافه کردن متد به ref
  useImperativeHandle(ref, () => ({
    clearFileInput: () => {
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
        setFileNameSave(null);
      }
    },
    setFileInput: (picName: any) => {
     //console.log(422,picName);
      
      if (picName) {
        fetchFile(picName, true);
      }
    }
  }));

  return (
    <div>
      <input disabled={disabled} type="file" ref={fileInputRef} onChange={handleFileChange} />
    </div>
  );
};

export default React.forwardRef(FileUpload);
