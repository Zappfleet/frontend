import{r as s,u as L,U as N,j as f,c as n,F as Y,bG as b,bH as w,bI as I,bd as D}from"./index-0b0339af.js";import{u as P}from"./useAganceDriver-234fe48a.js";import{H as x}from"./HTMLProcessor-1d27b86a.js";import{u as y}from"./useCarteSalahiyat-c616d860.js";import"./style-65f980a9.js";const B=({})=>{const[_,T]=s.useState(null);s.useEffect(()=>{fetch("/zarghanFiles/bime_name_tamin_ejtemaei/bime_name_tamin_ejtemaei.htm").then(a=>a.text()).then(a=>{T(a)}).catch(a=>console.error(a))},[]);const A="معرفی نامه اداره تامین اجتماعی",{authInfo:r}=L(),[C,p]=s.useState(""),[G,S]=s.useState({CREATE:!1,EDIT:!1,DELETE:!1});s.useEffect(()=>{var t,h;let a={CREATE:!1,EDIT:!1,DELETE:!1},l="";(h=(t=r==null?void 0:r.auth)==null?void 0:t.roles)==null||h.map(e=>{e.permissions.map(m=>{m===b&&(a.CREATE=!0),m===w&&(a.EDIT=!0,l+="- update -"),m===I&&(a.DELETE=!0,l+="- delete -")})}),S(a),p(l)},[r]);const[u,g]=s.useState([]),[M,j]=s.useState([]),[o,R]=s.useState({}),{result:E}=P("select",null),{result:c}=y("select",null);s.useEffect(()=>{var a;E&&g((a=E==null?void 0:E.data)==null?void 0:a.data)},[E]),s.useEffect(()=>{var a;c&&(console.log(2e3,c),j((a=c==null?void 0:c.data)==null?void 0:a.data))},[c]),s.useEffect(()=>{},[o]),s.useState(N(new Date).format("jYYYY/jMM/jDD")),s.useState(N(new Date).format("jYYYY/jMM/jDD")),s.useState(!1),s.useState(""),s.useState(""),s.useState({id:Math.floor(1e4+Math.random()*9e4),title:"",description:"",attachFileName:"",status:"open",createDate:new Date});const F=a=>{var h;console.log(200,a.target.value,u);const l=u.filter(e=>{var m,d,i;return((m=e==null?void 0:e.details)==null?void 0:m.nat_num)===a.target.value&&((d=e==null?void 0:e.details)==null?void 0:d.nat_num)!==null&&((i=e==null?void 0:e.details)==null?void 0:i.nat_num)!==void 0})[0],t=M.filter(e=>(e==null?void 0:e.driverNatNum)===a.target.value&&(e==null?void 0:e.driverNatNum)!==null&&(e==null?void 0:e.driverNatNum)!==void 0)[0];console.log(301,t),R({name:(l==null?void 0:l.full_name)||"---",father_name:((h=l==null?void 0:l.details)==null?void 0:h.fatherName)||"---",carteSalahiyat_num:(t==null?void 0:t.fishNumber)||"---",from_date:(t==null?void 0:t.fromDate)&&D(t==null?void 0:t.fromDate)||"---",to_date:(t==null?void 0:t.toDate)&&D(t==null?void 0:t.toDate)||"---",nat_num:a.target.value})};return f("div",{className:"aganceCarteSalahiyat-component",children:[n("div",{className:"row",children:n("div",{className:"col-12",children:n("div",{className:"page-title",children:n("i",{children:A})})})}),f("div",{className:"row",children:[n("div",{className:"col-12",children:f("div",{className:"form-group",children:[f("span",{children:["    ","کد ملی را وارد کنید","   "]}),f("select",{onChange:a=>F(a),className:"form-control",value:(o==null?void 0:o.nat_num)||"1",children:[n("option",{value:"1",children:"---انتخاب کنید---"}),u==null?void 0:u.map(a=>{var l;return n("option",{value:(l=a==null?void 0:a.details)==null?void 0:l.nat_num,children:a==null?void 0:a.full_name})})]})]})}),n("div",{className:"row",children:n("div",{className:"col-12",children:(o==null?void 0:o.nat_num)&&_!==null&&n(Y,{children:n(x,{autoReadFile:!0,HTMLFile:_,fields:o})})})})]})]})};export{B as default};