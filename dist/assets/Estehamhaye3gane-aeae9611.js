import{r as n,j as f,c as a,u as M,U as b,be as P,F as Y,bD as j,bE as F,bF as R}from"./index-0b0339af.js";import{u as L}from"./useAganceDriver-234fe48a.js";import{l as N}from"./style-65f980a9.js";const H=({autoReadFile:u,wordFile:d,fileUrl:h,fields:T})=>{const[_,p]=n.useState(""),[w,i]=n.useState(!1);n.useEffect(()=>{console.log(78878,d),d&&(async()=>{const s=await(await fetch(d)).arrayBuffer(),o=await N.convertToHtml({arrayBuffer:s});p(o.value)})()},[d]),n.useEffect(()=>{u&&u===!0&&(async()=>{const s=await(await fetch(h)).arrayBuffer(),o=await N.convertToHtml({arrayBuffer:s});p(o.value)})()},[h]);const y=async t=>{const s=await t.target.files[0].arrayBuffer(),o=await N.convertToHtml({arrayBuffer:s});p(o.value)},g=((t,e)=>{let s=t;for(const[o,E]of Object.entries(e))if(o.toLowerCase().includes("image")){const c=new RegExp(`{{${o}}}`,"g");s=s.replace(c,`<img class="word-image" src="${E}" alt="${o}" />`)}else{const c=new RegExp(`{{${o}}}`,"g");s=s.replace(c,E)}return s})(_,T),l=()=>{const t=window.open("","_blank");t.document.write(`
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
                    ${g}
                </body>
            </html>
        `),t.document.close(),t.print()};return f("div",{className:"WordProcessor-component",children:[w&&f("div",{className:"myPrint",children:[f("div",{className:"upload-img",children:[a("i",{className:"fa fa-print print-icon",onClick:()=>{l(),i(!1)}}),a("div",{dangerouslySetInnerHTML:{__html:g},style:{direction:"rtl",textAlign:"right"}})]}),a("i",{className:"fa fa-remove close-icon",onClick:()=>{i(!1)}})]}),u&&u!==!0&&a("input",{type:"file",onChange:y}),a("i",{className:"fa fa-print print-icon",onClick:l}),a("i",{className:"fa fa-eye eye-icon",onClick:()=>i(!0)})]})},k="/assets/estelamate3gane-3542137a.docx",G=({handleBackClick:u,title:d})=>{d="استعلام های 3 گانه(تایید گواهینامه ، تشخیص هویت ، مرکز بهداشت)  ";const{authInfo:h}=M(),[T,_]=n.useState(""),[p,w]=n.useState({CREATE:!1,EDIT:!1,DELETE:!1});n.useEffect(()=>{var s,o;let t={CREATE:!1,EDIT:!1,DELETE:!1},e="";(o=(s=h==null?void 0:h.auth)==null?void 0:s.roles)==null||o.map(E=>{E.permissions.map(c=>{c===j&&(t.CREATE=!0),c===F&&(t.EDIT=!0,e+="- update -"),c===R&&(t.DELETE=!0,e+="- delete -")})}),w(t),_(e)},[h]);const[i,y]=n.useState([]),[r,g]=n.useState({}),{result:l}=L("select",null);return n.useEffect(()=>{var t,e;console.log(7),l&&(console.log(8,(t=l==null?void 0:l.data)==null?void 0:t.data),y((e=l==null?void 0:l.data)==null?void 0:e.data))},[l]),n.useEffect(()=>{},[r,i]),n.useState(b(new Date).format("jYYYY/jMM/jDD")),n.useState(b(new Date).format("jYYYY/jMM/jDD")),n.useState(!1),n.useState(""),n.useState(""),n.useState({id:Math.floor(1e4+Math.random()*9e4),title:"",description:"",attachFileName:"",status:"open",createDate:new Date}),f("div",{className:"aganceRegister-component",children:[u&&a("i",{className:"fa fa-arrow-left back-icon",onClick:u}),a("div",{className:"row",children:a("div",{className:"col-12",children:a("div",{className:"page-title",children:a("i",{children:d})})})}),f("div",{className:"row",children:[a("div",{className:"col-12",children:f("div",{className:"form-group",children:[f("span",{children:["    ","کد ملی را وارد کنید","   "]}),f("select",{onChange:async t=>{var s,o,E,c,C,A;const e=i.filter(m=>{var S,D,x;return((S=m==null?void 0:m.details)==null?void 0:S.nat_num)===t.target.value&&((D=m==null?void 0:m.details)==null?void 0:D.nat_num)!==null&&((x=m==null?void 0:m.details)==null?void 0:x.nat_num)!==void 0})[0];console.log(141),g({full_name:e==null?void 0:e.full_name,fatherName:(s=e==null?void 0:e.details)==null?void 0:s.fatherName,nat_num:(o=e==null?void 0:e.details)==null?void 0:o.nat_num,shomare_shenasname:(E=e==null?void 0:e.details)==null?void 0:E.shomare_shenasname,sadere:(c=e==null?void 0:e.details)==null?void 0:c.sadere,image_driverPic:await P((A=(C=e==null?void 0:e.details)==null?void 0:C.attachFile)==null?void 0:A.driverPic)})},className:"form-control",value:(r==null?void 0:r.nat_num)||"1",children:[a("option",{value:"1",children:"---انتخاب کنید---"}),i==null?void 0:i.map(t=>{var e;return a("option",{value:(e=t==null?void 0:t.details)==null?void 0:e.nat_num,children:t==null?void 0:t.full_name})})]})]})}),a("div",{className:"row",children:a("div",{className:"col-12",children:(r==null?void 0:r.nat_num)&&a(Y,{children:a(H,{autoReadFile:!0,wordFile:k,fields:r})})})})]})]})};export{G as default};
