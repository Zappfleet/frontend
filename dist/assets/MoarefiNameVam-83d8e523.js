import{r as a,u as y,f as A,U as M,j as d,c as s,F as Y,bG as x,bH as b,bI as P}from"./index-0b0339af.js";import{u as G}from"./useAganceDriver-234fe48a.js";import{H}from"./HTMLProcessor-1d27b86a.js";import"./style-65f980a9.js";const V=({})=>{const[p,C]=a.useState(null),[c,D]=a.useState();a.useEffect(()=>{fetch("/zarghanFiles/vam/vam.htm").then(e=>e.text()).then(e=>{C(e)}).catch(e=>console.error(e))},[]);const w="معرفی نامه وام",{authInfo:h}=y(),[k,g]=a.useState(""),[B,R]=a.useState({CREATE:!1,EDIT:!1,DELETE:!1});a.useEffect(()=>{var m,r;let e={CREATE:!1,EDIT:!1,DELETE:!1},t="";(r=(m=h==null?void 0:h.auth)==null?void 0:m.roles)==null||r.map(n=>{n.permissions.map(i=>{i===x&&(e.CREATE=!0),i===b&&(e.EDIT=!0,t+="- update -"),i===P&&(e.DELETE=!0,t+="- delete -")})}),R(e),g(t)},[h]);const[E,j]=a.useState([]),[o,N]=a.useState({}),[F,_]=a.useState("select"),[u,f]=a.useState(null),{result:l,type:I}=G(F,u);a.useEffect(()=>{var e,t,m;if(l)switch(I){case"select":j((e=l==null?void 0:l.data)==null?void 0:e.data);break;case"update":f(null),_("select"),console.log(41,l),((t=l==null?void 0:l.data)==null?void 0:t.status)==200&&A.showSuccess("اطلاعات ثبت شد"),((m=l==null?void 0:l.data)==null?void 0:m.status)!=200&&A.showError("اطلاعات ثبت نشد");break}},[l]),a.useEffect(()=>{},[o]),a.useState(M(new Date).format("jYYYY/jMM/jDD")),a.useState(M(new Date).format("jYYYY/jMM/jDD")),a.useState(!1),a.useState(""),a.useState(""),a.useState({id:Math.floor(1e4+Math.random()*9e4),title:"",description:"",attachFileName:"",status:"open",createDate:new Date}),a.useEffect(()=>{N({...o,mablagh:(c==null?void 0:c.replace(/\B(?=(\d{3})+(?!\d))/g,","))||"---"})},[c]);const L=e=>{var m,r;const t=E.filter(n=>{var i,S,T;return((i=n==null?void 0:n.details)==null?void 0:i.nat_num)===e.target.value&&((S=n==null?void 0:n.details)==null?void 0:S.nat_num)!==null&&((T=n==null?void 0:n.details)==null?void 0:T.nat_num)!==void 0})[0];t&&f(t),N({full_name:(t==null?void 0:t.full_name)||"---",father_name:((m=t==null?void 0:t.details)==null?void 0:m.fatherName)||"---",nat_num:e.target.value,sadere:((r=t==null?void 0:t.details)==null?void 0:r.sadere)||"---",mablagh:(c==null?void 0:c.replace(/\B(?=(\d{3})+(?!\d))/g,","))||"---"})},v=()=>{var t;const e={...u,details:{...(u==null?void 0:u.details)||{},activityArchive:[...((t=u==null?void 0:u.details)==null?void 0:t.activityArchive)||[],{name:"درخواست وام ",date:new Date().toISOString()}]}};f(e),_("update")};return d("div",{className:"aganceCarteSalahiyat-component",children:[s("div",{className:"row",children:s("div",{className:"col-12",children:s("div",{className:"page-title",children:s("i",{children:w})})})}),d("div",{className:"row",children:[s("div",{className:"col-12",children:d("div",{className:"form-group",children:[d("span",{children:["    ","کد ملی را وارد کنید","   "]}),d("select",{onChange:e=>L(e),className:"form-control",value:(o==null?void 0:o.nat_num)||"1",children:[s("option",{value:"1",children:"---انتخاب کنید---"}),E==null?void 0:E.map(e=>{var t;return s("option",{value:(t=e==null?void 0:e.details)==null?void 0:t.nat_num,children:e==null?void 0:e.full_name})})]})]})}),s("div",{className:"row",children:d("div",{className:"col-12",children:[s("span",{children:"مبلغ وام را وارد کنید (ریال)"}),s("input",{onChange:e=>D(e.target.value.replace(/,/g,"")),value:c==null?void 0:c.replace(/\B(?=(\d{3})+(?!\d))/g,","),type:"text",className:"form-control"})]})}),s("div",{className:"row",children:s("div",{className:"col-12",children:(o==null?void 0:o.nat_num)&&p!==null&&d(Y,{children:[s("br",{}),s("button",{onClick:()=>v(),className:"my-btn",children:"ذخیره در بایگانی "}),s(H,{autoReadFile:!0,HTMLFile:p,fields:o})]})})})]})]})};export{V as default};
