import{r,h as x,u as la,U as l,f as I,be as ia,bd as M,j as s,c as t,F as _,ar as ha,l as H,p as $,m as L,bf as ma,bg as ua,bh as fa,bc as z}from"./index-0b0339af.js";/* empty css              */import{O as xe,F as da}from"./FileUpload-63cbe117.js";import{u as ga}from"./useAganceRegister-a600f39c.js";import{c as V}from"./dateTools-2ed79b68.js";import{P as pa}from"./Page403-a9be83c6.js";import{H as Re}from"./HTMLProcessor-1d27b86a.js";import{u as Da}from"./validation-2a5d93f1.js";import"./style-65f980a9.js";function Ya(N,Y){const[P,S]=r.useState(null),[b,j]=r.useState(null),[i,p]=r.useState({in_progress:!1});function k(){switch(N){case"select":console.log(12548,N),p({...i,in_progress:!0}),x().select_sodureParvane().then(o=>{S(o),j("select")}).catch(o=>{console.error(6001,"Error fetching list:",o)}).finally(()=>{p({...i,in_progress:!1})});break;case"insert":Y!==null&&(p({...i,in_progress:!0}),x().insert_sodureParvane(Y).then(o=>{S(o),j("insert")}).catch(o=>{console.error(6001,"Error fetching list:",o)}).finally(()=>{p({...i,in_progress:!1})}));break;case"update":Y!==null&&(p({...i,in_progress:!0}),x().update_sodureParvane(Y).then(o=>{S(o),j("update")}).catch(o=>{console.error(6001,"Error fetching list:",o)}).finally(()=>{p({...i,in_progress:!1})}));break;case"delete":p({...i,in_progress:!0}),x().delete_sodureParvane(Y._id).then(o=>{S(o),j("delete")}).catch(o=>{console.error(6001,"Error fetching list:",o)}).finally(()=>{p({...i,in_progress:!1})});break}}return r.useEffect(()=>{N&&k()},[N]),{result:P,type:b,state:i,refreshData:k}}const va={fishNumber:{required:!0,showName:""},fishPrice:{required:!0,showName:""},fishDate:{required:!0,showName:""}},Aa=({handleBackClick:N,title:Y})=>{var ie,he,me,ue,fe,de,ge,pe,De,Ye,ve,Ne,Ee,ye;const[P,S]=r.useState(null);r.useEffect(()=>{fetch("/zarghanFiles/parvaneBarAgance/parvaneAgance.htm").then(a=>a.text()).then(a=>{S(a)}).catch(a=>console.error(a))},[]);const[b,j]=r.useState(null);r.useEffect(()=>{fetch("/zarghanFiles/parvaneBarAgance/parvaneBar.htm").then(a=>a.text()).then(a=>{j(a.replace("{{<span class=SpellE>","{{").replace("</span>}}","}}"))}).catch(a=>console.error(a))},[]),Y="صدور و تمدید پروانه آژانس";const{authInfo:i}=la(),[p,k]=r.useState(""),[o,Te]=r.useState(!1);r.useState(!1);const[q,Oe]=r.useState({CREATE:!1,EDIT:!1,DELETE:!1});r.useEffect(()=>{var m,g;let a={CREATE:!1,EDIT:!1,DELETE:!1},n="";(g=(m=i==null?void 0:i.auth)==null?void 0:m.roles)==null||g.map(v=>{v.permissions.map(h=>{h===ma&&(a.CREATE=!0),h===ua&&(a.EDIT=!0,n+="- update -"),h===fa&&(a.DELETE=!0,n+="- delete -")})}),Oe(a),k(n)},[i]);const w=r.useRef(null),J=()=>{w.current&&w.current.clearFileInput()},W=r.useRef(new xe),C=W.current,[Ue,R]=r.useState(!1),[Be,K]=r.useState(""),[Ge,E]=r.useState("select"),[D,T]=r.useState("insert"),[O,He]=r.useState("insert"),[$e,U]=r.useState(l(new Date).format("jYYYY/jMM/jDD")),[Q,X]=r.useState(l(new Date).format("jYYYY/jMM/jDD")),[Le,B]=r.useState(l(new Date).format("jYYYY/jMM/jDD")),[Z,ee]=r.useState(l(new Date).format("jYYYY/jMM/jDD")),[ze,G]=r.useState(l(new Date).format("jYYYY/jMM/jDD")),[ae,te]=r.useState(l(new Date).format("jYYYY/jMM/jDD")),[Na,re]=r.useState(!1),[Ve,ne]=r.useState({}),[e,u]=r.useState({fishDate:Q,fromDate:Z,toDate:ae}),{errors:f,refreshData:Ea}=Da(va,e);r.useEffect(()=>{console.log(100,Object.keys(f))},[f]);const[A,se]=r.useState(e);r.useEffect(()=>{u({...e,_id:D==="insert"?C==null?void 0:C.toString():e==null?void 0:e._id})},[C,D]),r.useEffect(()=>{console.log(45,e),e!=null&&e.aganceInfo&&ea()},[e]),r.useEffect(()=>{console.log(455,A)},[e,A]);const ce=[{id:1,value:10},{id:2,value:30},{id:3,value:50}],qe=[{key:"",name:p},{key:"fishNumber",name:"شماره فیش ",img:!1},{key:"fishPrice",name:"مبلغ "},{key:"fishDate",name:"تاریخ",type:"caleadar",key2:"fromdate"},{key:"aganceName",name:"نام آژانس"},{key:"fromDate",name:" تاریخ شروع "},{key:"toDate",name:"تاریخ پایان"}],[Je,We]=r.useState([]),[Ke,Qe]=r.useState([]),[d,Xe]=r.useState([]),{result:y}=ga("select",{}),{result:c,type:Ze,state:ya,refreshData:Sa}=Ya(Ge,e);r.useEffect(()=>{console.log(21,d)},[d]),r.useEffect(()=>{var a;y!=null&&y.status&&Xe((a=y==null?void 0:y.data)==null?void 0:a.data)},[y]),r.useEffect(()=>{var a,n;if(c)switch(Ze){case"insert":(c==null?void 0:c.status)===200?(I.showSuccess(" صدور پروانه ثبت شد"),E("select"),Te(!0)):I.showError("صدور پروانه ثبت نشد");break;case"update":(c==null?void 0:c.status)===200?(I.showSuccess("صدور پروانه ویرایش شد"),E("select")):I.showError("صدور پروانه ویرایش نشد");break;case"delete":(c==null?void 0:c.status)===200?(I.showSuccess("صدور پروانه حذف شد"),E("select")):I.showError("صدور پروانه حذف نشد");break;case"select":Qe((a=c==null?void 0:c.data)==null?void 0:a.data),aa((n=c==null?void 0:c.data)==null?void 0:n.data);break}},[c]);const ea=async()=>{var n,m,g,v,h,F,Se,je,Ie,_e,Me,Pe,be,ke,we,Ce,Ae,Fe;const a=((m=(n=e==null?void 0:e.aganceInfo)==null?void 0:n.attachFile)==null?void 0:m.modirOrmobasherPic)&&await ia((v=(g=e==null?void 0:e.aganceInfo)==null?void 0:g.attachFile)==null?void 0:v.modirOrmobasherPic)||"";console.log(4511,a),e!=null&&e.aganceInfo&&((h=e==null?void 0:e.aganceInfo)==null?void 0:h.activityContext)==="مسافر"&&se({name:((F=e==null?void 0:e.aganceInfo)==null?void 0:F.name)||"---",gender:"---",fatherName:"---",b_d:"---",sh_sh:"---",sadere:"---",nat_num:((Se=e==null?void 0:e.aganceInfo)==null?void 0:Se.managerCodeMelli)||"---",year:(e==null?void 0:e.year)||"---",factor_num:((je=e==null?void 0:e.aganceInfo)==null?void 0:je.gharardad_num)||"---",factor_date:((Ie=e==null?void 0:e.aganceInfo)==null?void 0:Ie.gharardad_date)&&M((_e=e==null?void 0:e.aganceInfo)==null?void 0:_e.gharardad_date)||"---",pic:`<img src='${a}' width="100px" height='100px'/>`||"---"}),e!=null&&e.aganceInfo&&((Me=e==null?void 0:e.aganceInfo)==null?void 0:Me.activityContext)==="بار"&&se({name:((Pe=e==null?void 0:e.aganceInfo)==null?void 0:Pe.name)||"---",gender:"---",fatherName:"---",b_d:"---",sh_sh:"---",sadere:"---",address:(ke=(be=e==null?void 0:e.aganceInfo)==null?void 0:be.address)==null?void 0:ke.address,nat_num:((we=e==null?void 0:e.aganceInfo)==null?void 0:we.managerCodeMelli)||"---",year:(e==null?void 0:e.year)||"---",factor_num:((Ce=e==null?void 0:e.aganceInfo)==null?void 0:Ce.gharardad_num)||"---",factor_date:((Ae=e==null?void 0:e.aganceInfo)==null?void 0:Ae.gharardad_date)&&M((Fe=e==null?void 0:e.aganceInfo)==null?void 0:Fe.gharardad_date)||"---",pic:`<img src='${a}' width="100px" height='100px'/>`||"---"})};r.useEffect(()=>{},[Q,Z,ae]);const aa=a=>{console.log(23,a,d),We(()=>a.map(n=>{var m;return{...n,aganceName:(m=(d==null?void 0:d.filter(g=>g._id===(n==null?void 0:n.aganceID)))[0])==null?void 0:m.name,fishDate:M(n.fishDate),fromDate:M(n.fromDate),toDate:M(n.toDate)}}))},oe=()=>{U(l(new Date).format("jYYYY/jMM/jDD")),X(l(new Date).format("jYYYY/jMM/jDD")),B(l(new Date).format("jYYYY/jMM/jDD")),ee(l(new Date).format("jYYYY/jMM/jDD")),G(l(new Date).format("jYYYY/jMM/jDD")),te(l(new Date).format("jYYYY/jMM/jDD")),J(),R(!1),K(""),W.current=new xe,u({}),ne({}),E(null),T("insert")},ta=a=>{U(a),X(a.format("YYYY/MM/DD",{calendar:"persian",locale:"fa"})),u({...e,fishDate:V(z(a.format("YYYY/MM/DD",{calendar:"persian",locale:"fa"})))})},ra=a=>{B(a),ee(a.format("YYYY/MM/DD",{calendar:"persian",locale:"fa"})),u({...e,fromDate:V(z(a.format("YYYY/MM/DD",{calendar:"persian",locale:"fa"})))})},na=a=>{G(a),te(a.format("YYYY/MM/DD",{calendar:"persian",locale:"fa"})),u({...e,toDate:V(z(a.format("YYYY/MM/DD",{calendar:"persian",locale:"fa"})))})},sa=(a,n,m,g)=>{ne(v=>({...v,[n]:a})),g===!1&&u({...e,attachFile:{...e.attachFile,[n]:m}})},le=a=>{switch(a){case"insert":E("insert");break;case"update":E("update");break}},ca=(a,n)=>{var m,g,v;if(n==="delete"&&(u(a),E("delete")),n==="update"){J();const h=Ke.filter(F=>F._id===a._id)[0];(m=h==null?void 0:h.attachFile)!=null&&m.fishPic&&((v=w.current)==null||v.setFileInput((g=a==null?void 0:a.attachFile)==null?void 0:g.fishPic)),U(l(h.fishDate).format("jYYYY/jMM/jDD")),B(l(h.fromDate).format("jYYYY/jMM/jDD")),G(l(h.toDate).format("jYYYY/jMM/jDD")),u(h),T("update")}};r.useEffect(()=>{},[e]);const oa=a=>{K(Ve[a]),R(!0)};return s("div",{className:"agance-component SodureParvane-component",children:[N&&t("i",{className:"fa fa-arrow-left back-icon",onClick:N}),Ue&&s("div",{className:"myAttachImage",children:[t("img",{className:"upload-img",src:Be}),t("i",{className:"fa fa-remove close-icon",onClick:()=>R(!1)})]}),t("div",{className:"row",children:t("div",{className:"col-12",children:t("div",{className:"page-title",children:t("i",{onClick:()=>{He("insert"),re(D==="insert")},className:O==="insert"?"active":"",children:D==="insert"?Y:"بروزرسانی آژانس"})})})}),t("div",{className:"row",children:s("div",{className:"col-12",children:[t("button",{disabled:!(((ie=e==null?void 0:e.aganceInfo)==null?void 0:ie.activityContext)==="مسافر"&&Object.keys(f).length===0),onClick:()=>le(D==="insert"?"insert":"update"),className:`my-btn ${((he=e==null?void 0:e.aganceInfo)==null?void 0:he.activityContext)==="مسافر"&&Object.keys(f).length===0?"":"my-btn-inactive"}`,children:"صدور پروانه آژانس"}),(e==null?void 0:e.aganceID)&&((me=e==null?void 0:e.aganceInfo)==null?void 0:me.activityContext)==="مسافر"&&P!==null&&t(_,{children:t(Re,{autoReadFile:!0,HTMLFile:P,fields:A})}),t("button",{disabled:!(((ue=e==null?void 0:e.aganceInfo)==null?void 0:ue.activityContext)==="بار"&&Object.keys(f).length===0),onClick:()=>le(D==="insert"?"insert":"update"),className:`my-btn ${((fe=e==null?void 0:e.aganceInfo)==null?void 0:fe.activityContext)==="بار"&&Object.keys(f).length===0?"":"my-btn-inactive"}`,children:"صدور پروانه بار"}),(e==null?void 0:e.aganceID)&&((de=e==null?void 0:e.aganceInfo)==null?void 0:de.activityContext)==="بار"&&b!==null&&t(_,{children:t(Re,{autoReadFile:!0,HTMLFile:b,fields:A})}),t("button",{onClick:()=>oe(),className:"my-btn",children:"خالی کردن فرم"})]})}),t("div",{style:{display:`${O==="list"?"":"none"}`},className:"row",children:t("div",{className:"col-12",children:t(ha,{clickOnRow:ca,pagesize:ce[0].value,items:Je,options:ce,thead:qe})})}),s("div",{style:{display:`${O==="insert"?"":"none"}`},className:"aganceRegister-component",children:[D==="insert"&&q.CREATE===!1&&s("p",{children:[" ",t(pa,{})]}),(D==="insert"&&q.CREATE===!0||D==="update")&&s(_,{children:[D==="update"&&t("button",{onClick:()=>{oe(),T("insert")},className:"my-btn",children:Y}),s("div",{className:"row",children:[t("div",{className:"col-6",children:s("div",{className:"form-group",children:[t("p",{children:"شماره فیش واریزی "}),t("input",{onChange:a=>u({...e,fishNumber:a.target.value}),value:(e==null?void 0:e.fishNumber)||"",type:"text",className:"form-control"}),((ge=f.fishNumber)==null?void 0:ge.length)>0&&t(_,{children:s("div",{className:"validate",children:[t("i",{className:"fa fa-exclamation-triangle"}),s("div",{className:"error-msg",children:[" ",(pe=f.fishNumber)==null?void 0:pe.map(a=>t("p",{children:a}))," "]})]})})]})}),t("div",{className:"col-6",children:s("div",{className:"form-group",children:[t("p",{children:" مبلغ (ریال)"}),t("input",{onChange:a=>u({...e,fishPrice:a.target.value.replace(/,/g,"")}),value:((De=e==null?void 0:e.fishPrice)==null?void 0:De.replace(/\B(?=(\d{3})+(?!\d))/g,","))||"",type:"text",className:"form-control"}),((Ye=f.fishPrice)==null?void 0:Ye.length)>0&&t(_,{children:s("div",{className:"validate",children:[t("i",{className:"fa fa-exclamation-triangle"}),s("div",{className:"error-msg",children:[" ",(ve=f.fishPrice)==null?void 0:ve.map(a=>t("p",{children:a}))," "]})]})})]})}),t("div",{className:"col-6",children:s("div",{className:"form-group",children:[t("p",{children:"تاریخ   "}),t(H,{onChange:a=>ta(a!==null?Array.isArray(a)?a[0]:a:null),calendar:$,locale:L,className:"datetime-picker",inputClass:"datetime-input !text-center !text-lg !p-4",value:$e,placeholder:"از تاریخ"}),((Ne=f.fishDateDatePicker)==null?void 0:Ne.length)>0&&t(_,{children:s("div",{className:"validate",children:[t("i",{className:"fa fa-exclamation-triangle"}),s("div",{className:"error-msg",children:[" ",(Ee=f.fishDateDatePicker)==null?void 0:Ee.map(a=>t("p",{children:a}))," "]})]})})]})}),t("div",{className:"col-6",children:s("div",{className:"form-group",children:[t("p",{children:" تصویر فیش   "}),s("div",{className:"file-upload-div",children:[t(da,{ref:w,name:"fishPic",id:(e==null?void 0:e._id)||"",handleGetBase64:sa}),((ye=e==null?void 0:e.attachFile)==null?void 0:ye.fishPic)&&t("i",{className:"fa fa-eye my-eye-icon",onClick:()=>oa("fishPic")})]})]})}),t("div",{className:"col-12",children:s("div",{className:"form-group",children:[t("span",{children:"صدور پروانه نمایندگی آژانس   "}),t("select",{onChange:a=>{u({...e,aganceID:a.target.value,aganceInfo:d==null?void 0:d.filter(n=>n._id===a.target.value)[0]})},className:"form-control",value:(e==null?void 0:e.aganceID)||"-1",children:d==null?void 0:d.filter(a=>a.status==="1").map(a=>t("option",{value:a._id,children:a.name}))}),"با اعتبار",t("input",{onChange:a=>u({...e,year:a.target.value}),value:(e==null?void 0:e.year)||"",type:"text",className:"form-control"}),"از تاریخ",t(H,{onChange:a=>ra(a!==null?Array.isArray(a)?a[0]:a:null),calendar:$,locale:L,className:"datetime-picker",inputClass:"datetime-input !text-center !text-lg !p-4",value:Le,placeholder:"از تاریخ"}),"الی",t(H,{onChange:a=>na(a!==null?Array.isArray(a)?a[0]:a:null),calendar:$,locale:L,className:"datetime-picker",inputClass:"datetime-input !text-center !text-lg !p-4",value:ze,placeholder:"تا تاریخ"}),"بلامانع است."]})})]})]})]})]})};export{Aa as default};