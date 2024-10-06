import{r as s,y as z,U as d,bh as j,j as a,F as G,c as e,k as g,p as D,l as k,aq as T,bi as E,bj as B}from"./index-4b638fea.js";/* empty css              */import{P as J}from"./Page403-34de9313.js";function P(m,p,u){const[A,h]=s.useState(null),[n,o]=s.useState({in_progress:!1});function c(){o({...n,in_progress:!0}),z().getReportTimeOfServices(m,p,u).then(l=>{h(l.data)}).catch(l=>{console.error(6001,"Error fetching mission list:",l)}).finally(()=>{o({...n,in_progress:!1})})}return s.useEffect(()=>{c()},[]),{missionList:A,state:n,refreshData:c}}function q({handleBackClick:m,title:p}){const u=p,[A,h]=s.useState(!1),[n,o]=s.useState(!1),[c,l]=s.useState([]),[I,y]=s.useState(d(new Date).format("jYYYY/jMM/jDD")),[x,Q]=s.useState(d(new Date).format("jYYYY/jMM/jDD")),[C,R]=s.useState(d(new Date).format("jYYYY/jMM/jDD")),[K,S]=s.useState(d(new Date).format("jYYYY/jMM/jDD")),{missionList:i,state:W,refreshData:Y}=P("DONE",j(C),j(K)),F=t=>{y(t),R(t.format("YYYY/MM/DD",{calendar:"persian",locale:"fa"}))},L=t=>{Q(t),S(t.format("YYYY/MM/DD",{calendar:"persian",locale:"fa"}))},M=()=>{o(!0),Y()},w=()=>{let t=[];i.data&&i.data.map(r=>{let f={};const b=new Date(r.mission_end),X=new Date(r.mission_start),V=Math.round((b-X)/1e3);f={id:r.id,img:"data:image/jpeg;base64,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",name:`${r.name}`,startDate:E(r.mission_start),endDate:E(r.mission_end),time:B(V)},t.push(f)}),l(t)};s.useEffect(()=>{},[c]),s.useEffect(()=>{i&&(i.status===200&&w(),i.status===403&&h(!0))},[i,A]);const v=[{key:"name",name:"راننده",type:""},{key:"startDate",name:"شروع سرویس",type:"caleadar",key2:"fromdate"},{key:"endDate",name:"پایان سرویس",type:"caleadar",key2:"todate"},{key:"time",name:"مدت زمان سرویس",type:""}],N=[{id:1,value:2},{id:2,value:3},{id:3,value:5}];return a(G,{children:[A===!0&&e(J,{}),A===!1&&a("div",{className:"report-component",children:[e("i",{className:"fa fa-arrow-left back-icon",onClick:m}),e("div",{dir:"rtl",className:"container-fluid",children:a("div",{className:"datagrid",children:[e("div",{className:"row",children:e("div",{className:"col-12",children:e("div",{className:"page-title",children:a("i",{children:[" ",u]})})})}),e("div",{className:"filter-items",children:a("div",{className:"row",children:[a("div",{className:"col-12 col-md-3",children:["از تاریخ",e(g,{onChange:t=>F(t!==null?Array.isArray(t)?t[0]:t:null),calendar:D,locale:k,className:"datetime-picker",inputClass:"datetime-input !text-center !text-lg !p-4",value:I,placeholder:"از تاریخ"})]}),a("div",{className:"col-12 col-md-3",children:["تا تاریخ",e(g,{onChange:L,calendar:D,locale:k,className:"datetime-picker",inputClass:"datetime-input !text-center !text-lg !p-4",value:x,placeholder:"تا تاریخ"})]}),a("div",{className:"col-12 col-md-3",children:[e("br",{}),a("button",{onClick:()=>M(),className:"btn btn-search",type:"submit",children:[e("i",{className:"fa fa-search"}),"جستجو"]})]})]})}),e("hr",{}),e("div",{className:"row",children:a("div",{className:"col-12",children:[n===!0&&c.length===0&&e("p",{children:" موردی برای نمایش وجود ندارد"}),n===!0&&c.length>0&&e(T,{pagesize:N[0].value,items:c,options:N,thead:v})]})})]})})]})]})}export{q as default};
