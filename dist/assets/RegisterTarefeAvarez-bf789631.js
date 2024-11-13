import{r as s,h as R,u as ce,f as _,j as c,c as e,ar as le,F as ne,bM as ie,bN as oe,bO as de}from"./index-0b0339af.js";/* empty css              */import{O as $,F as ue}from"./FileUpload-63cbe117.js";import{P as he}from"./Page403-a9be83c6.js";function me(N,h){const[A,y]=s.useState(null),[b,p]=s.useState(null),[i,o]=s.useState({in_progress:!1});function k(){switch(N){case"select":o({...i,in_progress:!0}),R().select_TarefeAvarez().then(r=>{y(r),p("select")}).catch(r=>{console.error(6001,"Error fetching list:",r)}).finally(()=>{o({...i,in_progress:!1})});break;case"insert":h!==null&&(o({...i,in_progress:!0}),R().insert_TarefeAvarez(h).then(r=>{y(r),p("insert")}).catch(r=>{console.error(6001,"Error fetching list:",r)}).finally(()=>{o({...i,in_progress:!1})}));break;case"update":h!==null&&(o({...i,in_progress:!0}),R().update_TarefeAvarez(h).then(r=>{y(r),p("update")}).catch(r=>{console.error(6001,"Error fetching list:",r)}).finally(()=>{o({...i,in_progress:!1})}));break;case"delete":o({...i,in_progress:!0}),R().delete_TarefeAvarez(h._id).then(r=>{y(r),p("delete")}).catch(r=>{console.error(6001,"Error fetching list:",r)}).finally(()=>{o({...i,in_progress:!1})});break}}return s.useEffect(()=>{N&&k()},[N]),{result:A,type:b,state:i,refreshData:k}}const Ae=({handleBackClick:N,title:h})=>{var G,j,M,V,Z,L;h="ثبت تعرفه عوارض";const{authInfo:A}=ce(),[y,b]=s.useState(""),[p,i]=s.useState({CREATE:!1,EDIT:!1,DELETE:!1});s.useEffect(()=>{var v,E;let t={CREATE:!1,EDIT:!1,DELETE:!1},n="";(E=(v=A==null?void 0:A.auth)==null?void 0:v.roles)==null||E.map(T=>{T.permissions.map(u=>{u===ie&&(t.CREATE=!0),u===oe&&(t.EDIT=!0,n+="- update -"),u===de&&(t.DELETE=!0,n+="- delete -")})}),i(t),b(n)},[A]);const o=s.useRef(null),k=t=>{t.current&&t.current.clearFileInput()},r=s.useRef(new $),C=r.current,[q,w]=s.useState(!1),[P,F]=s.useState(""),[H,f]=s.useState("select"),[m,I]=s.useState("insert"),[S,x]=s.useState("list"),[D,O]=s.useState({}),[a,d]=s.useState({});s.useEffect(()=>{d({...a,_id:m==="insert"?C==null?void 0:C.toString():a==null?void 0:a._id})},[C,m]);const U=[{id:1,value:10},{id:2,value:30},{id:3,value:50}],J=[{key:"",name:y},{key:"year",name:"سال",img:!1}],[g,K]=s.useState([]),[Q,W]=s.useState([]),{result:l,type:X,state:pe,refreshData:fe}=me(H,a);s.useEffect(()=>{var t,n;if(l)switch(X){case"insert":(l==null?void 0:l.status)===200?(_.showSuccess("تعرفه عوارض ثبت شد"),f("select")):_.showError("  تعرفه عوارض ثبت نشد");break;case"update":(l==null?void 0:l.status)===200?(_.showSuccess("تعرفه عوارض ویرایش شد"),f("select")):_.showError("تعرفه عوارض ویرایش نشد");break;case"delete":(l==null?void 0:l.status)===200?(_.showSuccess("تعرفه عوارض حذف شد"),f("select")):_.showError("تعرفه عوارض حذف نشد");break;case"select":W((t=l==null?void 0:l.data)==null?void 0:t.data),Y((n=l==null?void 0:l.data)==null?void 0:n.data),z();break}},[l]);const Y=t=>{K(()=>t.map(n=>({...n})))},z=()=>{B(),w(!1),F(""),r.current=new $,d({}),O({}),f(null),I("insert")},B=()=>{k("madarek")},ee=(t,n,v,E)=>{O(T=>({...T,[n]:t})),E===!1&&d({...a,attachFile:{...a.attachFile,[n]:v}})};s.useEffect(()=>{console.log(741,D)},[D]);const ae=t=>{switch(t){case"insert":f("insert");break;case"update":f("update");break}},te=(t,n)=>{var v,E,T;if(n==="delete"&&(d(t),f("delete")),n==="update"){B();const u=Q.filter(re=>re._id===t._id)[0];(v=u==null?void 0:u.attachFile)!=null&&v.madarek&&((T=o.current)==null||T.setFileInput((E=u==null?void 0:u.attachFile)==null?void 0:E.madarek)),d(u),I("update")}};s.useEffect(()=>{},[a]),s.useEffect(()=>{},[P]);const se=t=>{F(D[t]),w(!0)};return c("div",{className:"RegisterTarefeAvarez-component agance-component",children:[N&&e("i",{className:"fa fa-arrow-left back-icon",onClick:N}),q&&c("div",{className:"myAttachImage",children:[e("img",{className:"upload-img",src:P}),e("i",{className:"fa fa-remove close-icon",onClick:()=>{w(!1),F("")}})]}),e("div",{className:"row",children:c("div",{className:"col-12",children:[e("div",{className:"page-title",children:e("i",{onClick:()=>{x("list")},className:S==="list"?"active":"",children:"لیست تعرفه عوارض "})}),e("div",{className:"page-title",children:e("i",{onClick:()=>{x("insert")},className:S==="insert"?"active":"",children:m==="insert"?h:"بروزرسانی تعرفه عوارض "})})]})}),e("div",{style:{display:`${S==="list"?"":"none"}`},className:"row",children:c("div",{className:"col-12",children:[(g==null?void 0:g.length)>0&&e(le,{clickOnRow:te,pagesize:U[0].value,items:g,options:U,thead:J}),(g==null?void 0:g.length)<=0&&c("p",{style:{marginTop:"40px"},children:[" ","موردی برای نمایش وجود ندارد"]})]})}),c("div",{style:{display:`${S==="insert"?"":"none"}`},className:"aganceRegister-component",children:[m==="insert"&&p.CREATE===!1&&c("p",{children:[" ",e(he,{})]}),(m==="insert"&&p.CREATE===!0||m==="update")&&e(ne,{children:c("div",{className:"row",children:[e("div",{className:"col-12",children:m==="update"&&e("button",{onClick:()=>{z(),I("insert")},className:"my-btn",children:h})}),e("div",{className:"col-6",children:c("div",{className:"form-group",children:[e("p",{children:" سال  "}),c("select",{onChange:t=>d({...a,year:t.target.value}),className:"form-control",value:(a==null?void 0:a.year)||"1",children:[e("option",{value:"1",children:"---انتخاب کنید---"}),e("option",{value:"1400",children:"1400"}),e("option",{value:"1401",children:"1401"}),e("option",{value:"1402",children:"1402"}),e("option",{value:"1403",children:"1403"}),e("option",{value:"1404",children:"1404"})]})]})}),e("div",{className:"col-6",children:c("div",{className:"form-group",children:[e("p",{children:" صدور کارت صلاحیت (ریال)"}),e("input",{onChange:t=>d({...a,sodureCaretSalahiyat:t.target.value.replace(/,/g,"")}),value:((G=a==null?void 0:a.sodureCaretSalahiyat)==null?void 0:G.replace(/\B(?=(\d{3})+(?!\d))/g,","))||"",type:"text",className:"form-control"})]})}),e("div",{className:"col-6",children:c("div",{className:"form-group",children:[e("p",{children:" تمدید کارت صلاحیت (ریال)"}),e("input",{onChange:t=>d({...a,tamdidCaretSalahiyat:t.target.value.replace(/,/g,"")}),value:((j=a==null?void 0:a.tamdidCaretSalahiyat)==null?void 0:j.replace(/\B(?=(\d{3})+(?!\d))/g,","))||"",type:"text",className:"form-control"})]})}),e("div",{className:"col-6",children:c("div",{className:"form-group",children:[e("p",{children:"صدور پروانه آژانس (ریال)"}),e("input",{onChange:t=>d({...a,sodureParvaneAgance:t.target.value.replace(/,/g,"")}),value:((M=a==null?void 0:a.sodureParvaneAgance)==null?void 0:M.replace(/\B(?=(\d{3})+(?!\d))/g,","))||"",type:"text",className:"form-control"})]})}),e("div",{className:"col-6",children:c("div",{className:"form-group",children:[e("p",{children:"عوارض سالیانه آژانس (ریال)"}),e("input",{onChange:t=>d({...a,AvarezaSaliyaneAgance:t.target.value.replace(/,/g,"")}),value:((V=a==null?void 0:a.AvarezaSaliyaneAgance)==null?void 0:V.replace(/\B(?=(\d{3})+(?!\d))/g,","))||"",type:"text",className:"form-control"})]})}),e("div",{className:"col-6",children:c("div",{className:"form-group",children:[e("p",{children:" کارشناسی پرونده (ریال)"}),e("input",{onChange:t=>d({...a,karshenasiParvande:t.target.value.replace(/,/g,"")}),value:((Z=a==null?void 0:a.karshenasiParvande)==null?void 0:Z.replace(/\B(?=(\d{3})+(?!\d))/g,","))||"",type:"text",className:"form-control"})]})}),e("div",{className:"col-6",children:c("div",{className:"form-group",children:[e("p",{children:" بارگزاری مدارک مصوب نرخ"}),c("div",{className:"file-upload-div",children:[e(ue,{ref:o,name:"madarek",id:(a==null?void 0:a._id)||"",handleGetBase64:ee}),((L=a==null?void 0:a.attachFile)==null?void 0:L.madarek)&&e("i",{className:"fa fa-eye my-eye-icon",onClick:()=>se("madarek")})]})]})}),e("div",{className:"col-12",children:c("div",{className:"form-group",children:[e("button",{onClick:()=>ae(m==="insert"?"insert":"update"),className:"my-btn",children:m==="insert"?"ثبت":"بروز رسانی"}),e("button",{onClick:()=>z(),className:"my-btn",children:"انصراف"})]})})]})})]})]})};export{Ae as default};
