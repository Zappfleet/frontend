import{r as i,j as p,c as s}from"./index-4b638fea.js";import{l as m}from"./style-3087b5d5.js";const N=({autoReadFile:a,wordFile:o,fileUrl:d,fields:g})=>{const[w,c]=i.useState(""),[x,l]=i.useState(!1);i.useEffect(()=>{console.log(78878,o),o&&(async()=>{const e=await(await fetch(o)).arrayBuffer(),t=await m.convertToHtml({arrayBuffer:e});c(t.value)})()},[o]),i.useEffect(()=>{a&&a===!0&&(async()=>{const e=await(await fetch(d)).arrayBuffer(),t=await m.convertToHtml({arrayBuffer:e});c(t.value)})()},[d]);const v=async n=>{const e=await n.target.files[0].arrayBuffer(),t=await m.convertToHtml({arrayBuffer:e});c(t.value)},h=((n,r)=>{let e=n;for(const[t,y]of Object.entries(r))if(t.toLowerCase().includes("image")){const f=new RegExp(`{{${t}}}`,"g");e=e.replace(f,`<img class="word-image" src="${y}" alt="${t}" />`)}else{const f=new RegExp(`{{${t}}}`,"g");e=e.replace(f,y)}return e})(w,g),u=()=>{const n=window.open("","_blank");n.document.write(`
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
                    ${h}
                </body>
            </html>
        `),n.document.close(),n.print()};return p("div",{className:"WordProcessor-component",children:[x&&p("div",{className:"myPrint",children:[p("div",{className:"upload-img",children:[s("i",{className:"fa fa-print print-icon",onClick:()=>{u(),l(!1)}}),s("div",{dangerouslySetInnerHTML:{__html:h},style:{direction:"rtl",textAlign:"right"}})]}),s("i",{className:"fa fa-remove close-icon",onClick:()=>{l(!1)}})]}),a&&a!==!0&&s("input",{type:"file",onChange:v}),s("i",{className:"fa fa-print print-icon",onClick:u}),s("i",{className:"fa fa-eye eye-icon",onClick:()=>l(!0)})]})};export{N as W};
