import{r as s,u as sa,U as Q,j as f,c as l,be as X,bj as la,F as na,bG as oa,bH as ca,bI as ma}from"./index-0b0339af.js";import{u as ha}from"./useAganceDriver-234fe48a.js";import{H as ua}from"./HTMLProcessor-1d27b86a.js";import"./style-65f980a9.js";const Aa=({handleBackClick:d,title:A})=>{const[T,Z]=s.useState(null);s.useEffect(()=>{fetch("/zarghanFiles/estelameAmaken/estelameAmaken.htm").then(t=>t.text()).then(t=>{Z(t)}).catch(t=>console.error(t))},[]),A="استعلام اداره اماکن";const{authInfo:E}=sa(),[ia,r]=s.useState(""),[fa,v]=s.useState({CREATE:!1,EDIT:!1,DELETE:!1});s.useEffect(()=>{var o,u;let t={CREATE:!1,EDIT:!1,DELETE:!1},a="";(u=(o=E==null?void 0:E.auth)==null?void 0:o.roles)==null||u.map(c=>{c.permissions.map(m=>{m===oa&&(t.CREATE=!0),m===ca&&(t.EDIT=!0,a+="- update -"),m===ma&&(t.DELETE=!0,a+="- delete -")})}),v(t),r(a)},[E]);const[_,aa]=s.useState([]),[n,ea]=s.useState({}),{result:h}=ha("select",null);return s.useEffect(()=>{var t;h&&(console.log(441,h),aa((t=h==null?void 0:h.data)==null?void 0:t.data))},[h]),s.useEffect(()=>{},[n]),s.useState(Q(new Date).format("jYYYY/jMM/jDD")),s.useState(Q(new Date).format("jYYYY/jMM/jDD")),s.useState(!1),s.useState(""),s.useState(""),s.useState({id:Math.floor(1e4+Math.random()*9e4),title:"",description:"",attachFileName:"",status:"open",createDate:new Date}),f("div",{className:"aganceCarteSalahiyat-component",children:[d&&l("i",{className:"fa fa-arrow-left back-icon",onClick:d}),l("div",{className:"row",children:l("div",{className:"col-12",children:l("div",{className:"page-title",children:l("i",{children:A})})})}),f("div",{className:"row",children:[l("div",{className:"col-12",children:f("div",{className:"form-group",children:[f("span",{children:["    ","کد ملی را وارد کنید","   "]}),f("select",{onChange:async t=>{var N,D,M,g,S,C,F,P,w,j,R,b,L,k,I,Y,x,y,K,$,G,H,z,U,q,J,V;const a=_.filter(e=>{var W,B,O;return((W=e==null?void 0:e.details)==null?void 0:W.nat_num)===t.target.value&&((B=e==null?void 0:e.details)==null?void 0:B.nat_num)!==null&&((O=e==null?void 0:e.details)==null?void 0:O.nat_num)!==void 0})[0],o=((N=a==null?void 0:a.details)==null?void 0:N.nat_num)||" ";let u={};for(let e=0;e<30;e++)e<(o==null?void 0:o.length)?u[`n${e+1}`]=o[e]:u[`n${e+1}`]=" ";const c=((D=a==null?void 0:a.details)==null?void 0:D.name)||" ";let m={};for(let e=0;e<30;e++)e<(c==null?void 0:c.length)?m[`nn${e+1}`]=c[e]:m[`nn${e+1}`]=" ";const i=((M=a==null?void 0:a.details)==null?void 0:M.family)||" ";let p={};for(let e=0;e<30;e++)e<(i==null?void 0:i.length)?p[`ln${e+1}`]=i[e]:p[`ln${e+1}`]=" ";const ta=await X((S=(g=a==null?void 0:a.details)==null?void 0:g.attachFile)==null?void 0:S.driverPic);ea({full_name:(a==null?void 0:a.full_name)||"",name:c||"",familly:i||"",din:((C=a==null?void 0:a.details)==null?void 0:C.din)||"",taahol:((F=a==null?void 0:a.details)==null?void 0:F.taahol)||"",cell_phone:((P=a==null?void 0:a.details)==null?void 0:P.cellPhone)||"",code_posti:((w=a==null?void 0:a.details)==null?void 0:w.postalCode)||"",nic_name:((j=a==null?void 0:a.details)==null?void 0:j.nikName)||"",phone:((R=a==null?void 0:a.details)==null?void 0:R.homePhone)||"",b_d:(b=a==null?void 0:a.details)!=null&&b.birthDate?(k=la((L=a==null?void 0:a.details)==null?void 0:L.birthDate))==null?void 0:k.split(" ")[0]:"",sh_seri:((I=a==null?void 0:a.details)==null?void 0:I.shomare_shenasname)||"",gender:((Y=a==null?void 0:a.details)==null?void 0:Y.gender)||"",madrak:((x=a==null?void 0:a.details)==null?void 0:x.madrakeTahsili)||"",shomare_cart:((y=a==null?void 0:a.details)==null?void 0:y.shomareKartePayanKhedmat)||"",nezame_vazife:(K=a==null?void 0:a.details)!=null&&K.shomareKartePayanKhedmat?"پایان خدمت":"---",father_name:(($=a==null?void 0:a.details)==null?void 0:$.fatherName)||" ",address:((G=a==null?void 0:a.details)==null?void 0:G.address)||" ",mahale_tavallod:"---",pelake_khodro:(H=a==null?void 0:a.vehicles[0])==null?void 0:H.plaque,factor_num:"---",factor_date:"---",isMiss:((z=a==null?void 0:a.details)==null?void 0:z.gender)==="زن"?"خانم":"آقای",nat_num:o||" ",sh_sh:((U=a==null?void 0:a.details)==null?void 0:U.shomare_shenasname)||" ",sadere:((q=a==null?void 0:a.details)==null?void 0:q.sadere)||" ",pic:`<img src='${ta}' width="100px" height='100px'/>`,pic1:await X((V=(J=a==null?void 0:a.details)==null?void 0:J.attachFile)==null?void 0:V.driverPic)||" ",...u,...m,...p})},className:"form-control",value:(n==null?void 0:n.nat_num)||"1",children:[l("option",{value:"1",children:"---انتخاب کنید---"}),_==null?void 0:_.map(t=>{var a;if(t.status==="ACTIVE")return l("option",{value:(a=t==null?void 0:t.details)==null?void 0:a.nat_num,children:t==null?void 0:t.full_name})})]})]})}),l("div",{className:"row",children:l("div",{className:"col-12",children:(n==null?void 0:n.nat_num)&&T!==null&&l(na,{children:l(ua,{autoReadFile:!0,HTMLFile:T,fields:n})})})})]})]})};export{Aa as default};
