import{u as R,r as s,T as p,j as E,b as t,bA as w,F as j,bE as F,bF as L,bG as P}from"./index-a6150745.js";import{u as Y}from"./useAganceDriver-6f189531.js";import{W as I}from"./WordProcessor-d5d739a2.js";const b="/assets/estelameAmaken-258f529c.docx",y=({handleBackClick:r,title:d})=>{d="استعلام اداره اماکن";const{authInfo:i}=R(),[x,M]=s.useState(""),[G,S]=s.useState({CREATE:!1,EDIT:!1,DELETE:!1});s.useEffect(()=>{var m,u;let e={CREATE:!1,EDIT:!1,DELETE:!1},a="";(u=(m=i==null?void 0:i.auth)==null?void 0:m.roles)==null||u.map(f=>{f.permissions.map(c=>{c===F&&(e.CREATE=!0),c===L&&(e.EDIT=!0,a+="- update -"),c===P&&(e.DELETE=!0,a+="- delete -")})}),S(e),M(a)},[i]);const[h,g]=s.useState([]),[n,C]=s.useState({}),{result:o}=Y("select",null);return s.useEffect(()=>{var e;o&&g((e=o==null?void 0:o.data)==null?void 0:e.data)},[o]),s.useEffect(()=>{},[n]),s.useState(p(new Date).format("jYYYY/jMM/jDD")),s.useState(p(new Date).format("jYYYY/jMM/jDD")),s.useState(!1),s.useState(""),s.useState(""),s.useState({id:Math.floor(1e4+Math.random()*9e4),title:"",description:"",attachFileName:"",status:"open",createDate:new Date}),E("div",{className:"aganceRegister-component",children:[r&&t("i",{className:"fa fa-arrow-left back-icon",onClick:r}),t("div",{className:"row",children:t("div",{className:"col-12",children:t("div",{className:"page-title",children:t("i",{children:d})})})}),E("div",{className:"row",children:[t("div",{className:"col-12",children:E("div",{className:"form-group",children:[E("span",{children:["    ","کد ملی را وارد کنید","   "]}),E("select",{onChange:async e=>{var m,u,f,c,_,A;const a=h.filter(l=>{var N,T,D;return((N=l==null?void 0:l.details)==null?void 0:N.nat_num)===e.target.value&&((T=l==null?void 0:l.details)==null?void 0:T.nat_num)!==null&&((D=l==null?void 0:l.details)==null?void 0:D.nat_num)!==void 0})[0];console.log(141),C({full_name:a==null?void 0:a.full_name,fatherName:(m=a==null?void 0:a.details)==null?void 0:m.fatherName,nat_num:(u=a==null?void 0:a.details)==null?void 0:u.nat_num,shomare_shenasname:(f=a==null?void 0:a.details)==null?void 0:f.shomare_shenasname,sadere:(c=a==null?void 0:a.details)==null?void 0:c.sadere,image_driverPic:await w((A=(_=a==null?void 0:a.details)==null?void 0:_.attachFile)==null?void 0:A.driverPic)})},className:"form-control",value:(n==null?void 0:n.nat_num)||"1",children:[t("option",{value:"1",children:"---انتخاب کنید---"}),h.map(e=>{var a;if(e.status==="ACTIVE")return t("option",{value:(a=e==null?void 0:e.details)==null?void 0:a.nat_num,children:e==null?void 0:e.full_name})})]})]})}),t("div",{className:"row",children:t("div",{className:"col-12",children:(n==null?void 0:n.nat_num)&&t(j,{children:t(I,{autoReadFile:!0,wordFile:b,fields:n})})})})]})]})};export{y as default};
