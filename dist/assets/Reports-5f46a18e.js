import{r as c,h as se,j as a,F as g,c as e,ar as ae,U as p,bb as ue,bc as ee,l as L,p as E,m as Q,ai as Ne,bd as j}from"./index-0b0339af.js";/* empty css              */import{P as fe}from"./Page403-a9be83c6.js";import{U as ve}from"./UsersSuggestionInput-007d7b87.js";import{S as ge}from"./SimpleButton-b54f8e70.js";import ye from"./TimeOfServices-911d0d3e.js";import xe from"./CountOfServicesOfDrivers-c3b7d021.js";import ke from"./RestOfDriverBetweenServises-e91386b0.js";import Re from"./DriverList_By_LastServiceAdnDistanse-f81f6be1.js";import"./Chips-65a50fec.js";import"./SuggestionTextInput-599de7a6.js";function De(){const[A,r]=c.useState();return c.useEffect(()=>{se().getReportAgencyCost().then(({data:s})=>{r(s)}).catch(console.log)},[]),{result:A}}function Ce({handleBackClick:A,title:r}){const{result:s}=De(),[d,t]=c.useState(null);c.useEffect(()=>{var i;console.log(5007,s),((i=s==null?void 0:s.data)==null?void 0:i.length)>0&&t(s.data)},[s]),c.useEffect(()=>{console.log(5007,d)},[d]);const u=[{id:1,value:5},{id:2,value:10},{id:3,value:15}],l=[{key:"agency_name",name:"نام آژانس"},{key:"confirmed_by",name:"ثبت کننده"},{key:"bill_number",name:"شماره فاکتور"},{key:"cost_agance",name:"هزینه"},{key:"mission_date",name:"تاریخ سفر",key2:"fromdate",type:"caleadar"},{key:"created_by",name:"مسافر"},{key:"distance",name:"مسافت"},{key:"distance_dasti",name:" مسافت دستی"},{key:"proj_desc",name:"توضیحات"}];return a(g,{children:[!d&&e("p",{children:"Loading"}),d&&a("div",{className:"AgencyReport-component",children:[e("p",{children:r}),a("div",{className:"flex items-center px-4",children:[e("div",{className:"flex-1 px-4 "}),e("div",{})]}),e("div",{className:"row",children:e("div",{className:"col-12",children:d&&e(ae,{clickOnRow:(i,y)=>{console.log(77,i)},pagesize:u[0].value,items:d,options:u,thead:l})})})]})]})}function be({handleBackClick:A,title:r}){var O,F,Y,M,V,B,T,H,X,G,z,J,P,W;const[s,d]=c.useState(!1),[t,u]=c.useState(null),[l,R]=c.useState(!1),[i,y]=c.useState(!1),[v,x]=c.useState([]),[h,b]=c.useState(p(new Date).format("jYYYY/jMM/jDD")),[m,N]=c.useState(p(new Date).format("jYYYY/jMM/jDD")),[te,ce]=c.useState(p(new Date).format("jYYYY/jMM/jDD")),[ne,re]=c.useState(p(new Date).format("jYYYY/jMM/jDD")),{missionList:f,state:D,refreshData:le}=ue("DONE",ee(te),ee(ne),"Daily");let ie="",oe=r;const de=o=>{b(o),ce(o.format("YYYY/MM/DD",{calendar:"persian",locale:"fa"}))},me=o=>{N(o),re(o.format("YYYY/MM/DD",{calendar:"persian",locale:"fa"}))},he=()=>{y(!0),le()},I=[{key:"name",name:"راننده"},{key:"date",name:"تاریخ",type:"caleadar",key2:"fromdate",onlyDate:!0},{key:"countOfServices",name:"تعداد سرویس"},{key:"distance",name:"مسافت طی شده"}];I&&I.map((o,n)=>o.key==="countOfServices"?e("td",{children:ie},n):e("td",{},n));const K=[{id:1,value:10},{id:2,value:30},{id:3,value:50}];c.useEffect(()=>{f&&(console.log(63,f==null?void 0:f.data),f.status===200&&pe(),f.status===403&&R(!0))},[f,l]);const pe=()=>{let o=[];f.data&&f.data.map(n=>{var U,q,Z;let w={};new Date(n.mission_end),new Date(n.mission_start);let k=0;(U=n==null?void 0:n.missions)==null||U.map(C=>{var _,$;k+=(_=C==null?void 0:C.extra)!=null&&_.distance?($=C==null?void 0:C.extra)==null?void 0:$.distance:0});let S="";k<1e3&&(k===0?S="---":S=`${k} متر`),k>1e3&&(S=`${Math.round(k/1e3)} کیلومتر و ${k%1e3} متر`),console.log(79,n),w={item:n,img:"data:image/jpeg;base64,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",name:(n==null?void 0:n.userInfo)===null?(Z=(q=n==null?void 0:n.vehicleInfo)==null?void 0:q.extra)==null?void 0:Z.agency_name:`${n.name}`,date:n.date,countOfServices:n.countOfServices.toString(),distance:S},w!=null&&w.name&&o.push(w)}),x(o)},Ae=(o,n)=>{console.log(66,o),d(!0),u(o)};return a(g,{children:[l===!0&&e(fe,{}),l===!1&&(D==null?void 0:D.in_progress)===!0&&e("p",{children:"Loading..."}),l===!1&&(D==null?void 0:D.in_progress)===!1&&e("div",{className:"report-component",children:e("div",{dir:"rtl",className:"container-fluid",children:a("div",{className:"datagrid",children:[e("div",{className:"row",children:e("div",{className:"col-12",children:e("div",{className:"page-title",children:e("i",{children:oe})})})}),e("div",{className:"filter-items",children:a("div",{className:"row",children:[a("div",{className:"col-12 col-md-3",children:["از تاریخ",e(L,{onChange:o=>de(o!==null?Array.isArray(o)?o[0]:o:null),calendar:E,locale:Q,className:"datetime-picker",inputClass:"datetime-input !text-center !text-lg !p-4",value:h,placeholder:"از تاریخ"})]}),a("div",{className:"col-12 col-md-3",children:["تا تاریخ",e(L,{onChange:me,calendar:E,locale:Q,className:"datetime-picker",inputClass:"datetime-input !text-center !text-lg !p-4",value:m,placeholder:"تا تاریخ"})]}),a("div",{className:"col-12 col-md-3",children:[e("br",{}),a("button",{onClick:()=>he(),className:"btn btn-search",type:"submit",children:[e("i",{className:"fa fa-search"}),"جستجو"]})]})]})}),e("hr",{}),e("div",{className:"row",children:a("div",{className:"col-12 details-divReport",children:[s===!0&&e(g,{children:a("div",{className:"detailsReport",children:[e("i",{onClick:()=>{d(!1),u(null)},className:"fa fa-remove close"}),e("div",{className:"",children:e("div",{className:"row",children:a("div",{className:"col-12",children:[e("p",{children:(t==null?void 0:t.name)||""}),e("p",{children:((F=(O=t==null?void 0:t.item)==null?void 0:O.userInfo)==null?void 0:F.phone)||""}),e("p",{children:((V=(M=(Y=t==null?void 0:t.item)==null?void 0:Y.userInfo)==null?void 0:M.details)==null?void 0:V.nat_num)||""}),e("p",{children:`${((H=(T=(B=t==null?void 0:t.item)==null?void 0:B.vehicleInfo)==null?void 0:T.extra)==null?void 0:H.name)||""} ${((z=(G=(X=t==null?void 0:t.item)==null?void 0:X.vehicleInfo)==null?void 0:G.extra)==null?void 0:z.color)||""} ${((W=(P=(J=t==null?void 0:t.item)==null?void 0:J.vehicleInfo)==null?void 0:P.extra)==null?void 0:W.plaque)||""}`})]})})})]})}),i===!0&&v.length===0&&e("p",{children:" موردی برای نمایش وجود ندارد"}),i===!0&&v.length>0&&e(ae,{clickOnRow:Ae,pagesize:K[0].value,items:v,options:K,thead:I})]})})]})})})]})}function we(A){return Ne({tag:"svg",attr:{viewBox:"0 0 24 24"},child:[{tag:"path",attr:{d:"M2.85858 2.87756L15.4293 1.08175C15.7027 1.0427 15.9559 1.23265 15.995 1.50601C15.9983 1.52943 16 1.55306 16 1.57672V22.4237C16 22.6999 15.7761 22.9237 15.5 22.9237C15.4763 22.9237 15.4527 22.922 15.4293 22.9187L2.85858 21.1229C2.36593 21.0525 2 20.6306 2 20.1329V3.86751C2 3.36986 2.36593 2.94794 2.85858 2.87756ZM4 4.73481V19.2656L14 20.6942V3.30624L4 4.73481ZM17 19.0002H20V5.00022H17V3.00022H21C21.5523 3.00022 22 3.44793 22 4.00022V20.0002C22 20.5525 21.5523 21.0002 21 21.0002H17V19.0002ZM10.2 12.0002L13 16.0002H10.6L9 13.7145L7.39999 16.0002H5L7.8 12.0002L5 8.00022H7.39999L9 10.2859L10.6 8.00022H13L10.2 12.0002Z"}}]})(A)}function Se({driver_id:A,date_filter:r}){const[s,d]=c.useState();return c.useEffect(()=>{se().getReportDriverGeneral(A,r).then(({data:t})=>{d(t)}).catch(console.log)},[A,r==null?void 0:r.gmt_from,r==null?void 0:r.gmt_to]),{state:s}}function Ie({handleBackClick:A,title:r}){var i,y,v,x,h,b;const[s,d]=c.useState([]),[t,u]=c.useState([p().subtract(7,"days").toDate().getTime(),p.now()]),{state:l}=Se({driver_id:(i=s==null?void 0:s[0])==null?void 0:i._id,date_filter:{gmt_from:t[0],gmt_to:t[1]}});function R(m){d((m==null?void 0:m.length)>0?[m[1]||m[0]]:[])}return a("div",{className:"AgencyReport-component",children:[e("p",{children:r}),a("div",{className:"flex items-center px-4",children:[e("div",{className:"flex-1 px-4 ",children:e(ve,{hideChips:!0,showListOnTop:!1,externalState:[s,R],permissions:["DRIVER"]})}),e("div",{children:e(L,{onChange:u,range:!0,calendar:E,locale:Q,className:"datetime-picker",inputClass:"datetime-input !text-center !text-lg !p-4 ",value:t})})]}),a("div",{className:"ml-3 mr-8 flex ",children:[e("div",{className:"w-94",children:(s==null?void 0:s[0])&&a("div",{children:[a("div",{children:[a("div",{className:"p-2",children:[e("label",{children:"نام : "}),e("label",{children:(y=s==null?void 0:s[0])==null?void 0:y.full_name})]}),a("div",{className:"p-2",children:[e("label",{children:"شماره  : "}),e("label",{children:(v=s==null?void 0:s[0])==null?void 0:v.phone})]})]}),e("div",{className:"ml-6 mt-6  rounded bg-white p-2 shadow",children:e("label",{children:"جمع هزینه : "})})]})}),a("div",{className:"flex-1",children:[e("div",{children:e("span",{className:"mb-4 inline-block",children:a(ge,{className:"bg-success",children:[e("span",{className:"ml-4",children:"دانلود فایل اکسل"}),e(we,{className:"cursor-pointer rounded text-white hover:bg-gray-4",size:24})]})})}),a("table",{className:"w-full border border-gray-5 text-right",children:[e("thead",{className:" border-b bg-gray-4",children:a("tr",{children:[e("th",{className:"p-1",children:"تاریخ ساعت"}),e("th",{className:"p-1",children:"زمان در سفر"}),e("th",{className:"p-1",children:"مسیر طی شده"})]})}),a("tbody",{children:[(x=l==null?void 0:l.missions)==null?void 0:x.map(m=>{var N;return a(g,{children:[a("tr",{className:"border-b border-gray-4",children:[e("td",{className:"p-2",children:j((N=m.extra)==null?void 0:N.mission_start)}),e("td",{className:"p-2",children:p.utc(p(m.extra.mission_duration*1e5)).format("HH:mm:ss")}),e("td",{className:"p-2",children:"-"})]}),e("tr",{className:"even:bg-gray-2",children:e("td",{colSpan:4,className:"p-2 text-sm"})})]})}),(h=l==null?void 0:l.missions)==null?void 0:h.map(m=>{var N;return a(g,{children:[a("tr",{className:"border-b border-gray-4",children:[e("td",{className:"p-2",children:j((N=m.extra)==null?void 0:N.mission_start)}),e("td",{className:"p-2",children:p.utc(p(m.extra.mission_duration*1e5)).format("HH:mm:ss")}),e("td",{className:"p-2",children:"-"})]}),e("tr",{className:"even:bg-gray-2",children:e("td",{colSpan:4,className:"p-2 text-sm"})})]})}),(b=l==null?void 0:l.missions)==null?void 0:b.map(m=>{var N;return a(g,{children:[a("tr",{className:"border-b border-gray-4",children:[e("td",{className:"p-2",children:j((N=m.extra)==null?void 0:N.mission_start)}),e("td",{className:"p-2",children:p.utc(p(m.extra.mission_duration*1e5)).format("HH:mm:ss")}),e("td",{className:"p-2",children:"-"})]}),e("tr",{className:"even:bg-gray-2",children:e("td",{colSpan:4,className:"p-2 text-sm"})})]})})]})]})]})]})]})}function Te(){console.log(55);const[A,r]=c.useState(!1),[s,d]=c.useState(""),[t,u]=c.useState(""),l=[{Title:"گزارش هزینه آژانس ها",componentName:"AgencyReport",icon:"fas fa-money-bill-alt"},{Title:"گزارش روزانه رانندگان",componentName:"DriverReport",icon:"fas fa-calendar-alt"},{Title:"گزارش مدت زمان هر سرویس",componentName:"TimeOfServices",icon:"fas fa-hourglass-end"},{Title:"دسترسی به تعداد سرویس های انجام شده توسط رانندگان در بازه زمانی مشخص",componentName:"CountOfServicesOfDrivers",icon:"fas fa-filter"},{Title:"گزارش میزان استراحت هر راننده بین سرویس ها",componentName:"RestOfDriverBetweenServises",icon:"fas fa-hotel"},{Title:"گزارش لیست رانندگان بر اساس آخرین زمان سرویس و مسافت",componentName:"DriverList_By_LastServiceAdnDistanse",icon:"fas fa-sort-amount-down"}],R=h=>{x(!0),r(!0),d(h.Title),u(h.componentName)},i=()=>{r(!1),d(""),u("")},y=()=>{switch(t){case"AgencyReport":return e(Ce,{handleBackClick:i,title:s});case"DriverReport":return e(be,{handleBackClick:i,title:s});case"DriverReportDetails":return e(Ie,{handleBackClick:i,title:s});case"TimeOfServices":return e(ye,{handleBackClick:i,title:s});case"CountOfServicesOfDrivers":return e(xe,{handleBackClick:i,title:s});case"RestOfDriverBetweenServises":return e(ke,{handleBackClick:i,title:s});case"DriverList_By_LastServiceAdnDistanse":return e(Re,{handleBackClick:i,title:s})}};c.useEffect(()=>{console.log(5)});const[v,x]=c.useState(!1);return e(g,{children:a("div",{className:"reports-component",children:[e("div",{className:"row",children:e("div",{className:"col-12",children:v&&a("div",{className:"details-div",children:[e("i",{className:"fa fa-remove close-fa",onClick:()=>x(!1)}),e("div",{className:"datagrid-div",children:y()})]})})}),e("div",{className:"row row-amar",children:e("div",{className:"row",children:e(g,{children:e("div",{className:"row row-amar",children:l.map((h,b)=>e("div",{className:"col-6 col-md-4",children:a("div",{className:"box",onClick:()=>R(h),children:[e("div",{className:"col-2 right-div",children:e("i",{className:`${h.icon}`})}),e("div",{className:"col-10 left-div",children:e("div",{className:"title",children:h==null?void 0:h.Title})})]})}))})})})})]})})}export{Te as default};