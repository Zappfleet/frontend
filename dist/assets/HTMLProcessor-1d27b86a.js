import{r as i,j as l,c as s}from"./index-0b0339af.js";import{l as x}from"./style-65f980a9.js";const P=({autoReadFile:f,HTMLFile:o,fileUrl:v,fields:p})=>{console.log(100,p);const[h,m]=i.useState(""),[w,a]=i.useState(!1),y=o.replace(/{{<span[\s\S]*?>/g,"{{").replace(/<\/span>}}/g,"}}");i.useEffect(()=>{o&&(async()=>{try{m(y)}catch(r){console.error(156465,"Error fetching file:",r)}})()},[o]);const C=async e=>{const t=await e.target.files[0].arrayBuffer(),n=await x.convertToHtml({arrayBuffer:t});m(n.value)},d=((e,r)=>{let t=e;for(const[n,u]of Object.entries(r))if(n.toLowerCase().includes("image")){const c=new RegExp(`{{${n}}}`,"g");t=t.replace(c,`<img class="word-image" src="${u}" alt="${n}" />`)}else{const c=new RegExp(`{{${n}}}`,"g");t=t.replace(c,u)}return t})(h,p),g=()=>{const e=window.open("","_blank");e.document.write(d),e.document.close(),e.print()};return l("div",{className:"WordProcessor-component",children:[w&&l("div",{className:"myPrint",children:[l("div",{className:"upload-img",children:[s("i",{className:"fa fa-print print-icon",onClick:()=>{g(),a(!1)}}),s("div",{dangerouslySetInnerHTML:{__html:d},style:{direction:"rtl",textAlign:"right"}})]}),s("i",{className:"fa fa-remove close-icon",onClick:()=>{a(!1)}})]}),f&&f!==!0&&s("input",{type:"file",onChange:C}),s("i",{className:"fa fa-print print-icon",onClick:g}),s("i",{className:"fa fa-eye eye-icon",onClick:()=>a(!0)})]})};export{P as H};
