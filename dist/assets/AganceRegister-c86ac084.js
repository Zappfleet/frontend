import{u as ea,r as n,f,bd as aa,j as c,c as e,aq as ta,F as m,k as la,p as ca,l as sa,bq as na,br as ia,bs as ra,bh as oa,U as ma}from"./index-4b638fea.js";/* empty css              */import{O as Ge,F as x}from"./FileUpload-a1b75713.js";import{u as da}from"./useAganceRegister-325531e9.js";import{c as ha}from"./dateTools-587f68dc.js";import{u as ua}from"./validation-753ab0c5.js";import{P as pa}from"./Page403-34de9313.js";const Na={name:{required:!0,showName:""},StartActivityDate:{required:!0,showName:""},activityContext:{required:!0,showName:""},managerFullName:{required:!0,showName:""},managerCodeMelli:{required:!0,pattern:/^[0-9]{10}$/,showName:""},mobasherCodeMelli:{pattern:/^[0-9]{10}$/,showName:""},"address.postalCode":{required:!0,pattern:/^[0-9]{10}$/,showName:""},"address.address":{required:!0,showName:""},phone:{required:!0,pattern:/^[0-9]{11}$/,showName:""},managerPhone:{required:!0,pattern:/^[0-9]{11}$/,showName:""},"attachFile.modirOrmobasherPic":{required:!0,showName:""},"attachFile.amaken":{required:!0,showName:""},"attachFile.estelamat3Gane":{required:!0,showName:""},status:{required:!0,showName:""}},Oe={status:"1",activityContext:"بار",StartActivityDate:"",name:"",managerFullName:"",managerCodeMelli:"",address:{address:"",postalCode:""},managerPhone:"",phone:"",attachFile:{modirOrmobasherPic:"",amaken:"",estelamat3Gane:""}},wa=({handleBackClick:E,title:R})=>{var J,H,K,Q,W,X,Z,ee,ae,te,le,ce,se,ne,ie,re,oe,me,de,he,ue,pe,Ne,ge,ve,fe,ye,Ce,Fe,Ae,be,ke;R="ثبت آژانس";const{authInfo:y}=ea(),[Ee,Ie]=n.useState(""),[P,Me]=n.useState({CREATE:!1,EDIT:!1,DELETE:!1});n.useEffect(()=>{var p,N;let a={CREATE:!1,EDIT:!1,DELETE:!1},o="";(N=(p=y==null?void 0:y.auth)==null?void 0:p.roles)==null||N.map(d=>{d.permissions.map(v=>{v===na&&(a.CREATE=!0),v===ia&&(a.EDIT=!0,o+="- update -"),v===ra&&(a.DELETE=!0,o+="- delete -")})}),Me(a),Ie(o)},[y]);const C=n.useRef(null),F=n.useRef(null),A=n.useRef(null),b=n.useRef(null),I=()=>{C.current&&C.current.clearFileInput()},M=()=>{F.current&&F.current.clearFileInput()},q=()=>{A.current&&A.current.clearFileInput()},U=()=>{b.current&&b.current.clearFileInput()},j=n.useRef(new Ge),g=j.current;n.useEffect(()=>{i({...t,_id:g.toString()})},[g]);const[qe,T]=n.useState(!1),[Ue,Y]=n.useState(""),[je,u]=n.useState("select"),[h,_]=n.useState("insert"),[k,$]=n.useState("list"),[Ye,G]=n.useState(null),[ga,L]=n.useState(null),[$e,S]=n.useState(!1),[z,B]=n.useState({}),[t,i]=n.useState(Oe),{errors:l,refreshData:va}=ua(Na,t);n.useEffect(()=>{console.log(100,Object.keys(l).length)},[l]);const V=[{id:1,value:10},{id:2,value:30},{id:3,value:50}],Le=[{key:"",name:Ee},{key:"name",name:"نام آژانس",img:!1},{key:"activityContext",name:"زمینه فعالیت"},{key:"StartActivityDate",name:" تاریخ شروع  فعالیت",type:"caleadar",key2:"fromdate"},{key:"managerFullName",name:"مدیر"}],[ze,Be]=n.useState([]),[Ve,Je]=n.useState([]),{result:r,type:He,state:fa,refreshData:ya}=da(je,t);n.useEffect(()=>{var a,o;if(r)switch(He){case"insert":(r==null?void 0:r.status)===200?(f.showSuccess("آژانس ثبت شد"),u("select")):f.showError("آژانس ثبت نشد");break;case"update":(r==null?void 0:r.status)===200?(f.showSuccess("آژانس ویرایش شد"),u("select")):f.showError("آژانس ویرایش نشد");break;case"delete":(r==null?void 0:r.status)===200?(f.showSuccess("آژانس حذف شد"),u("select")):f.showError("آژانس حذف نشد");break;case"select":Je((a=r==null?void 0:r.data)==null?void 0:a.data),Ke((o=r==null?void 0:r.data)==null?void 0:o.data),O();break}},[r]);const Ke=a=>{Be(()=>a.map(o=>({...o,StartActivityDate:aa(o.StartActivityDate)})))},O=()=>{G(null),L(null),q(),U(),I(),M(),T(!1),Y(""),j.current=new Ge,i(Oe),B({}),u(null),_("insert")},Qe=a=>{console.log(4),G(a),L(a.format("YYYY/MM/DD",{calendar:"persian",locale:"fa"})),console.log(88,a),i({...t,StartActivityDate:ha(oa(a.format("YYYY/MM/DD",{calendar:"persian",locale:"fa"})))})};n.useEffect(()=>{},[z]);const D=(a,o,p,N)=>{B(d=>({...d,[o]:a})),N===!1&&i(d=>({...d,attachFile:{...d.attachFile,[o]:p}}))},We=a=>{switch(a){case"insert":u("insert");break;case"update":u("update");break}},Xe=(a,o)=>{var p,N,d,v,Se,De,we,xe,Re,Pe,Te,_e;if(o==="delete"&&(i(a),u("delete")),o==="update"){q(),U(),I(),M();const s=Ve.filter(Ze=>Ze._id===a._id)[0];(p=s==null?void 0:s.attachFile)!=null&&p.modirOrmobasherPic&&((d=C.current)==null||d.setFileInput((N=s==null?void 0:s.attachFile)==null?void 0:N.modirOrmobasherPic)),(v=s==null?void 0:s.attachFile)!=null&&v.amaken&&((De=A.current)==null||De.setFileInput((Se=s==null?void 0:s.attachFile)==null?void 0:Se.amaken)),(we=s==null?void 0:s.attachFile)!=null&&we.estelamat3Gane&&((Re=b.current)==null||Re.setFileInput((xe=s==null?void 0:s.attachFile)==null?void 0:xe.estelamat3Gane)),(Pe=s==null?void 0:s.attachFile)!=null&&Pe.parvaneNamayandegi&&((_e=F.current)==null||_e.setFileInput((Te=s==null?void 0:s.attachFile)==null?void 0:Te.parvaneNamayandegi)),console.log(65689,s.StartActivityDate),G(ma(s.StartActivityDate).format("jYYYY/jMM/jDD")),i(s),_("update")}};n.useEffect(()=>{},[t]);const w=a=>{console.log(200,a),Y(z[a]),T(!0)};return c("div",{className:"agance-component",children:[E&&e("i",{className:"fa fa-arrow-left back-icon",onClick:E}),$e&&P.CREATE===!0&&e("div",{className:"myalert",children:c("div",{className:"alert alert-info alert-dismissible",children:[c("p",{children:["کاربر محترم ، افراد متقاضی دریافت پروانه آژانس باید حائز شرایط زیر باشند",e("i",{className:"far fa-grin-beam eimoji-icon"})]}),c("p",{children:[" ","متاهل یا دارای فرم کفالت و سرپرستی خانواده، بدون شغل و پروانه کسب"]}),e("button",{className:"my-btn",onClick:()=>S(!1),children:"متوجه شدم "})]})}),qe&&c("div",{className:"myAttachImage",children:[e("img",{className:"upload-img",src:Ue}),e("i",{className:"fa fa-remove close-icon",onClick:()=>T(!1)})]}),e("div",{className:"row",children:c("div",{className:"col-12",children:[e("div",{className:"page-title",children:e("i",{onClick:()=>{$("list"),S(!1)},className:k==="list"?"active":"",children:"لیست آژانس ها"})}),e("div",{className:"page-title",children:e("i",{onClick:()=>{$("insert"),S(h==="insert")},className:k==="insert"?"active":"",children:h==="insert"?R:"بروزرسانی آژانس"})})]})}),e("div",{style:{display:`${k==="list"?"":"none"}`},className:"row",children:e("div",{className:"col-12",children:e(ta,{clickOnRow:Xe,pagesize:V[0].value,items:ze,options:V,thead:Le})})}),c("div",{style:{display:`${k==="insert"?"":"none"}`},className:"aganceRegister-component",children:[h==="insert"&&P.CREATE===!1&&c("p",{children:[" ",e(pa,{})]}),(h==="insert"&&P.CREATE===!0||h==="update")&&c(m,{children:[h==="update"&&e("button",{onClick:()=>{O(),_("insert")},className:"my-btn",children:R}),c("div",{className:"row",children:[e("div",{className:"col-6",children:c("div",{className:"form-group",children:[e("p",{children:"نام آژانس"}),e("input",{onChange:a=>i({...t,name:a.target.value}),value:(t==null?void 0:t.name)||"",type:"text",className:"form-control"}),((J=l==null?void 0:l.name)==null?void 0:J.length)>0&&e(m,{children:c("div",{className:"validate",children:[e("i",{className:"fa fa-exclamation-triangle"}),c("div",{className:"error-msg",children:[" ",(H=l==null?void 0:l.name)==null?void 0:H.map(a=>e("p",{children:a}))," "]})]})})]})}),e("div",{className:"col-6",children:c("div",{className:"form-group",children:[e("p",{children:"تاریخ شروع فعالیت "}),e(la,{onChange:a=>Qe(a!==null?Array.isArray(a)?a[0]:a:null),calendar:ca,locale:sa,className:"datetime-picker",inputClass:"datetime-input !text-center !text-lg !p-4",value:Ye,placeholder:"از تاریخ"}),((K=l==null?void 0:l.StartActivityDate)==null?void 0:K.length)>0&&e(m,{children:c("div",{className:"validate",children:[e("i",{className:"fa fa-exclamation-triangle"}),c("div",{className:"error-msg",children:[" ",(Q=l==null?void 0:l.StartActivityDate)==null?void 0:Q.map(a=>e("p",{children:a}))," "]})]})})]})}),e("div",{className:"col-6",children:c("div",{className:"form-group",children:[e("p",{children:" زمینه فعالیت (بار ، مسافر)  "}),c("select",{onChange:a=>i({...t,activityContext:a.target.value}),className:"form-control",value:(t==null?void 0:t.activityContext)||"بار",children:[e("option",{value:"بار",children:"بار"}),e("option",{value:"مسافر",children:"مسافر"})]}),((W=l==null?void 0:l.activityContext)==null?void 0:W.length)>0&&e(m,{children:c("div",{className:"validate",children:[e("i",{className:"fa fa-exclamation-triangle"}),c("div",{className:"error-msg",children:[" ",(X=l==null?void 0:l.activityContext)==null?void 0:X.map(a=>e("p",{children:a}))," "]})]})})]})}),e("div",{className:"col-6",children:c("div",{className:"form-group",children:[e("p",{children:"نام و نام خانوادگی مدیر  "}),e("input",{onChange:a=>i({...t,managerFullName:a.target.value}),value:(t==null?void 0:t.managerFullName)||"",type:"text",className:"form-control"}),((Z=l==null?void 0:l.managerFullName)==null?void 0:Z.length)>0&&e(m,{children:c("div",{className:"validate",children:[e("i",{className:"fa fa-exclamation-triangle"}),c("div",{className:"error-msg",children:[" ",(ee=l==null?void 0:l.managerFullName)==null?void 0:ee.map(a=>e("p",{children:a}))," "]})]})})]})}),e("div",{className:"col-6",children:c("div",{className:"form-group",children:[e("p",{children:" کد ملی مدیر "}),e("input",{onChange:a=>i({...t,managerCodeMelli:a.target.value}),value:(t==null?void 0:t.managerCodeMelli)||"",type:"text",className:"form-control"}),((ae=l==null?void 0:l.managerCodeMelli)==null?void 0:ae.length)>0&&e(m,{children:c("div",{className:"validate",children:[e("i",{className:"fa fa-exclamation-triangle"}),c("div",{className:"error-msg",children:[" ",(te=l==null?void 0:l.managerCodeMelli)==null?void 0:te.map(a=>e("p",{children:a}))," "]})]})})]})}),e("div",{className:"col-6",children:c("div",{className:"form-group",children:[e("p",{children:" نام و نام خانوادگی مباشر "}),e("input",{onChange:a=>i({...t,mobasherFullName:a.target.value}),value:(t==null?void 0:t.mobasherFullName)||"",type:"text",className:"form-control"})]})}),e("div",{className:"col-6",children:c("div",{className:"form-group",children:[e("p",{children:" کد ملی مباشر "}),e("input",{onChange:a=>i({...t,mobasherCodeMelli:a.target.value}),value:(t==null?void 0:t.mobasherCodeMelli)||"",type:"text",className:"form-control"})]})}),e("div",{className:"col-6",children:c("div",{className:"form-group",children:[e("p",{children:" آدرس و موقعیت مکانی "}),e("input",{onChange:a=>i({...t,address:{...t.address,address:a.target.value}}),value:((le=t==null?void 0:t.address)==null?void 0:le.address)||"",type:"text",className:"form-control"}),((ce=l["address.address"])==null?void 0:ce.length)>0&&e(m,{children:c("div",{className:"validate",children:[e("i",{className:"fa fa-exclamation-triangle"}),c("div",{className:"error-msg",children:[" ",(se=l["address.address"])==null?void 0:se.map(a=>e("p",{children:a}))," "]})]})})]})}),e("div",{className:"col-6",children:c("div",{className:"form-group",children:[e("p",{children:" کد پستی "}),e("input",{onChange:a=>i({...t,address:{...t.address,postalCode:a.target.value}}),value:((ne=t==null?void 0:t.address)==null?void 0:ne.postalCode)||"",type:"text",className:"form-control"}),((ie=l["address.postalCode"])==null?void 0:ie.length)>0&&e(m,{children:c("div",{className:"validate",children:[e("i",{className:"fa fa-exclamation-triangle"}),c("div",{className:"error-msg",children:[" ",(re=l["address.postalCode"])==null?void 0:re.map(a=>e("p",{children:a}))," "]})]})})]})}),e("div",{className:"col-6",children:c("div",{className:"form-group",children:[e("p",{children:" تلفن ثابت "}),e("input",{onChange:a=>i({...t,phone:a.target.value}),value:(t==null?void 0:t.phone)||"",type:"text",className:"form-control"}),((oe=l==null?void 0:l.phone)==null?void 0:oe.length)>0&&e(m,{children:c("div",{className:"validate",children:[e("i",{className:"fa fa-exclamation-triangle"}),c("div",{className:"error-msg",children:[" ",(me=l==null?void 0:l.phone)==null?void 0:me.map(a=>e("p",{children:a}))," "]})]})})]})}),e("div",{className:"col-6",children:c("div",{className:"form-group",children:[e("p",{children:" تلفن همراه مدیر "}),e("input",{onChange:a=>i({...t,managerPhone:a.target.value}),value:(t==null?void 0:t.managerPhone)||"",type:"text",className:"form-control"}),((de=l==null?void 0:l.managerPhone)==null?void 0:de.length)>0&&e(m,{children:c("div",{className:"validate",children:[e("i",{className:"fa fa-exclamation-triangle"}),c("div",{className:"error-msg",children:[" ",(he=l==null?void 0:l.managerPhone)==null?void 0:he.map(a=>e("p",{children:a}))," "]})]})})]})}),e("div",{className:"col-6",children:c("div",{className:"form-group",children:[e("p",{children:"بارگزاری تصویر پروانه نمایندگی  "}),c("div",{className:"file-upload-div",children:[e(x,{ref:F,name:"parvaneNamayandegi",id:g.toString(),handleGetBase64:D}),((ue=t==null?void 0:t.attachFile)==null?void 0:ue.parvaneNamayandegi)&&e("i",{className:"fa fa-eye my-eye-icon",onClick:()=>w("parvaneNamayandegi")})]})]})}),e("div",{className:"col-6",children:c("div",{className:"form-group",children:[e("p",{children:" تصویر مدیر یا مباشر آژانس "}),c("div",{className:"file-upload-div",children:[e(x,{ref:C,name:"modirOrmobasherPic",id:g.toString(),handleGetBase64:D}),((pe=t==null?void 0:t.attachFile)==null?void 0:pe.modirOrmobasherPic)&&e("i",{className:"fa fa-eye my-eye-icon",onClick:()=>w("modirOrmobasherPic")})]}),((Ne=l["attachFile.modirOrmobasherPic"])==null?void 0:Ne.length)>0&&e(m,{children:c("div",{className:"validate",children:[e("i",{className:"fa fa-exclamation-triangle"}),c("div",{className:"error-msg",children:[" ",(ge=l["attachFile.modirOrmobasherPic"])==null?void 0:ge.map(a=>e("p",{children:a}))," "]})]})})]})}),e("div",{className:"col-6",children:c("div",{className:"form-group",children:[e("p",{children:" تصویر مجوز اداره اماکن "}),c("div",{className:"file-upload-div",children:[e(x,{ref:A,name:"amaken",id:g.toString(),handleGetBase64:D}),((ve=t==null?void 0:t.attachFile)==null?void 0:ve.amaken)&&e("i",{className:"fa fa-eye my-eye-icon",onClick:()=>w("amaken")})]}),((fe=l["attachFile.amaken"])==null?void 0:fe.length)>0&&e(m,{children:c("div",{className:"validate",children:[e("i",{className:"fa fa-exclamation-triangle"}),c("div",{className:"error-msg",children:[" ",(ye=l["attachFile.amaken"])==null?void 0:ye.map(a=>e("p",{children:a}))," "]})]})})]})}),e("div",{className:"col-6",children:c("div",{className:"form-group",children:[e("p",{children:" بارگزاری استعلامات 3 گانه و فرم تعهد قوانین حمل و نقل "}),c("div",{className:"file-upload-div",children:[e(x,{ref:b,name:"estelamat3Gane",id:g.toString(),handleGetBase64:D}),((Ce=t==null?void 0:t.attachFile)==null?void 0:Ce.estelamat3Gane)&&e("i",{className:"fa fa-eye my-eye-icon",onClick:()=>w("estelamat3Gane")})]}),((Fe=l["attachFile.estelamat3Gane"])==null?void 0:Fe.length)>0&&e(m,{children:c("div",{className:"validate",children:[e("i",{className:"fa fa-exclamation-triangle"}),c("div",{className:"error-msg",children:[" ",(Ae=l["attachFile.estelamat3Gane"])==null?void 0:Ae.map(a=>e("p",{children:a}))," "]})]})})]})}),e("div",{className:"col-6",children:c("div",{className:"form-group",children:[e("p",{children:" وضعیت "}),c("select",{onChange:a=>i({...t,status:a.target.value}),className:"form-control",value:t.status||"1",children:[e("option",{value:"1",children:"فعال"}),e("option",{value:"2",children:"غیر فعال"})]}),((be=l==null?void 0:l.status)==null?void 0:be.length)>0&&e(m,{children:c("div",{className:"validate",children:[e("i",{className:"fa fa-exclamation-triangle"}),c("div",{className:"error-msg",children:[" ",(ke=l==null?void 0:l.status)==null?void 0:ke.map(a=>e("p",{children:a}))," "]})]})})]})}),e("div",{className:"col-12",children:c("div",{className:"form-group",children:[e("p",{children:" توضیحات "}),e("textarea",{onChange:a=>i({...t,desc:a.target.value}),value:(t==null?void 0:t.desc)||"",rows:5,className:"form-control"})]})}),e("div",{className:"col-12",children:c("div",{className:"form-group",children:[e("button",{onClick:()=>We(h==="insert"?"insert":"update"),className:`my-btn ${Object.keys(l).length===0?"":"my-btn-inactive"}`,children:h==="insert"?"ثبت":"بروز رسانی"}),e("button",{onClick:()=>O(),className:"my-btn",children:"انصراف"})]})})]})]})]})]})};export{wa as default};