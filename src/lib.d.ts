declare module '*.svg' {
  const content: any;
  export default content;
}

declare module '*.docx' {
  const content: string;
  export default content;
}

declare module 'html-docx-js/dist/html-docx' {
  const htmlDocx: {
    asBlob: (html: string) => Blob;
  };
  export default htmlDocx;
}


