import{r as d,c as e,j as l,i as _e,k as fe,p as ve,l as be,m as Ne,B as Pe,u as Se,n as re,P as ge,o as Ce,q as Le,F as q,t as Ve,v as Oe,w as Be,x as $e,y as M,f as w,z as Ee,A as Ge,M as ae,C as He,G as Ye,S as je,H as de,I as ze,J as ue,K as ye,Q as Qe}from"./index-4b638fea.js";import{B as We}from"./Breadcrumb-e4475f51.js";import{a as Re,M as we,u as Ie}from"./useConfirmModal-a114480e.js";import{P as Te,M as Je,_ as Ke,a as Xe,b as Ze,c as et}from"./PassengerServiceRequest-57f670d5.js";import{u as tt}from"./useRestrictionShowRequests-298147b4.js";import{r as I}from"./renderUi-10abc2ba.js";import{F as st}from"./index.esm-f82767a5.js";import{u as ne}from"./useVehicleBasicData-dc6e97f6.js";import{S as ie}from"./SimpleButton-b66aa1df.js";import{M as at}from"./MapContainer-a1f86b32.js";import{g as nt,c as lt}from"./carIcon-ac58272a.js";import{u as it}from"./useSocket-4f91f465.js";import{M as ct}from"./MissionHistory-15f7f5de.js";import{R as rt}from"./RequestHistory-82d85458.js";import{U as ot,a as dt}from"./UsersSuggestionInput-a4d8adf9.js";import{T as ut}from"./TitledSparator-69b1d396.js";import"./marker-red-cc8765ae.js";import"./BottomSheetModal-a3284b58.js";import"./LocationSearch-0c7343c4.js";import"./useNeshanApi-69a62daf.js";import"./useFavorite-7253379e.js";import"./useVehicles-4e45c742.js";import"./useItemSetToggle-3f1f039f.js";import"./comments-4f6f4135.js";import"./Comments-e27f0d40.js";import"./useComments-8eb5e44a.js";import"./Chips-0adb3513.js";import"./SuggestionTextInput-de8ae0dd.js";const mt=s=>{const[t,r]=d.useState(s.defaultActiveTab),i=c=>{r(c),s.onTabChange(c)};return e("div",{className:"TabLayout-component",children:e("select",{className:"form-select",onChange:c=>i(c.target.value),children:s.tabs.map(c=>e("option",{value:c.key,selected:t===c.key,children:c.label},c.key))})})};const xe="request.admin",ht="request.dispatch",Me="request.history",ke="mission.history";const pt=s=>{const[t,r]=d.useState(!1),i=()=>{r(!t)};return l("div",{className:"FloatingButtonWithModal-component",children:[e("i",{className:"fa fa-plus icon",style:{display:t?"none":"block"},onClick:i}),e("i",{className:"fa fa-remove icon",style:{display:t?"block":"none"},onClick:i}),e("div",{style:{display:t?"block":"none"},className:"pishkhan-div",children:s.children})]})},ce=s=>{const t=Re();return{ui:e(we,{...t,...s,renderContent:u=>u?l("div",{className:_e({"lg:w-90":!s.ignoreFixedWidth}),children:[e("label",{className:"inline-block px-1 pt-2 text-sm",children:s.title||"<title>"}),e("div",{children:s.renderContent})]}):""}),show:u=>{t.handle_open(u)},hide:()=>{t.handle_close()}}},_t=s=>{const{ui:t,show:r}=ce({renderContent:l("div",{children:[l("div",{className:"m-2",children:[e("label",{className:"inline-block p-2  text-primary",children:"بازه تاریخی"}),e(fe,{range:!0,dateSeparator:" , ",calendar:ve,locale:be,format:"DD MMMM YYYY",className:"datetime-picker",inputClass:"datetime-input"})]}),l("div",{className:"m-2",children:[e("label",{className:"inline-block w-full p-2 text-primary",children:"وضعیت"}),e("div",{className:"flex flex-col",children:Ne.map(([c,u])=>l("span",{className:"inline-flex pl-4",children:[e("label",{htmlFor:c,className:"w-32 cursor-pointer p-1 px-2",children:u}),e("input",{name:`${c}`,id:`${c}`,type:"checkbox",className:"cursor-pointer"})]},c))})]}),e("button",{className:"mt-2 w-full rounded bg-primary p-2 text-white",children:"اعمال"})]})}),i=()=>{r({})};return l("div",{className:_e("relative w-full rounded-lg shadow",s.className),children:[t,e("input",{type:"text",placeholder:"جستجو...",className:"w-full bg-transparent p-2 pl-9 pr-4 focus:outline-none"}),e(Pe,{onClick:i,className:"absolute left-3 top-1/2 -translate-y-1/2 cursor-pointer",size:24})]})};const De=s=>{const t=Re();return{ui:e(we,{...t,...s,mode:"fullscreen",renderContent:s.renderContent,zIndex:s.zIndex}),show:u=>{t.handle_open(u)},close:()=>{t.handle_close()}}};function Fe(){const{show:s,ui:t,close:r}=De({renderContent:({data:i,submitCallback:c})=>{if(i==null)return"";const u={_id:i._id,service:i.service,datetime:[i.gmt_for_date],...i.details},N=i.locations.map(_=>({lat:_.coordinates[0],lng:_.coordinates[1],..._.meta}));return l("div",{children:[e("h2",{className:"p-2 text-primary",children:"ویرایش درخواست کاربر"}),e(Te,{mode:Je,submitCallback:c,initialLocations:N,initialValues:u,className:"!top-12"})]})}});return{showFullScreenModal:s,FullScreenModalUi:t,closeFullScreenModal:r}}const ee="confirm",ft="reject",vt=s=>{var L;const{requests:t,triggerRemoveFromList:r,update:i}=s.requests,{authInfo:c}=Se(),{result:u,state:N,refreshData:_}=tt("select",6,0),[m,v]=d.useState(100);d.useEffect(()=>{u&&u.data&&u.data[0]&&v(parseInt(u.data[0].value))},[u]),d.useEffect(()=>{},[m]);const f=new Date,S=new Date;S.setDate(f.getDate()+m);const{hasPermitGroup:a,hasPermitFor:y,hasAdminRank:b,permits:g}=re(),[C,k]=d.useState(!1),[$,U]=d.useState(!1),{showFullScreenModal:A,FullScreenModalUi:X,closeFullScreenModal:Z}=Fe(),{show:Q,ui:W}=Ie(null);d.useEffect(()=>{k(y([ge,Ce])),U(y([Le]))},[y]);const G=p=>{A({data:p,submitCallback:E=>{Z(),s.editCallback(E)}})},J=p=>{Q({title:"افزودن درخواست به پیش نویس",desc:"از افزودن درخواست به پیشنویس اطمینان دارید؟",label_confirm:"بله، اضافه کن",label_cancel:"خیر",onConfirm:()=>{var E;(E=s.handle_assignRequestToDraft)==null||E.call(s,p)}})},P=(p,E)=>{console.log(13,p.id,E),Q({title:"تغییر وضعیت درخواست",desc:`از ${E==ee?"تایید":"رد"} درخواست اطمینان دارید؟`,label_confirm:`${E==ee?"تایید کن":"رد کن"}`,label_cancel:"خیر",onConfirm:()=>{M().updateRequestStatus(p._id,E).then(({data:T})=>{E!=ee?r(p._id):i(T)}).catch(T=>{w.showError(T.message)})}})};return l(q,{children:[W,X,(L=t==null?void 0:t.docs)==null?void 0:L.map(p=>{var V,O,B,H,Y;let E=new Date(p.gmt_for_date);if(!(E>=Ve(f)&&E<=Oe(S)))return null;const T=(V=s.draftMission)==null?void 0:V.contains(p);return l("div",{className:`ServiceRequestCard-component ${p.removed?"!pointer-events-none":""} ${T?"selected-border":""} `,children:[l("div",{className:"row",children:[l("div",{className:"col-3",children:[e("p",{className:"title1",children:"درخواست دهنده"}),e("p",{children:(O=p.submitted_by)==null?void 0:O.full_name})]}),l("div",{className:"col-3",children:[e("p",{className:"title1",children:"زمان مورد درخواست "}),e("p",{children:Be(p.gmt_for_date)})]}),(H=(B=c==null?void 0:c.org)==null?void 0:B.requestsDetailsDisplayColumns)==null?void 0:H.map(({key:D,title:F})=>l("div",{className:"col-3",children:[l("p",{className:"title1",children:[" ",F,"  "]}),e("p",{children:p.details[D]})]},D))]}),e("div",{className:"row",children:e("div",{className:"col-12",children:e("div",{className:"location-div",children:(Y=p.locations)==null?void 0:Y.map((D,F)=>l("div",{className:"loc",children:[e("span",{className:"loc-title",children:`ایستگاه ${$e(p.locations.length,F)}`}),e("p",{children:D.meta.address})]}))})})}),e("div",{className:"row",children:e("div",{className:"col-12",children:l("div",{className:"buttons",children:[p.status!="PENDING"&&e("span",{children:Ne[p.status]}),C===!0&&e("button",{onClick:()=>G(p),className:"my-btn",children:"ویرایش"}),C===!1&&e("button",{disabled:!0,className:"my-btn NoPermission",children:"ویرایش"}),!T&&p.status=="CONFIRM"&&e("button",{onClick:()=>J(p),className:"my-btn",children:"افزودن به پیش نویس"}),p.status=="PENDING"&&l(q,{children:[C===!0&&l(q,{children:[e("button",{onClick:()=>P(p,ee),className:"my-btn",children:"تایید درخواست"}),e("button",{onClick:()=>P(p,ft),className:"my-btn",children:"رد درخواست"})]}),C===!1&&l(q,{children:[e("button",{disabled:!0,className:"my-btn NoPermission",children:"تایید درخواست"}),e("button",{disabled:!0,className:"my-btn NoPermission",children:"رد درخواست"})]})]})]})})})]},p._id)})]})},z="tab-requests",se="tab-services",te="tab-fleet",bt="publish",me="ready",qe="PUBLISHED";function le(s){var c,u,N,_;const{vehicle:t,basicData:r}=s;if(t==null||r==null)return"";const i=((c=t==null?void 0:t.extra)==null?void 0:c.agency_name)==null;return l("div",{className:"VehicleItem-component",children:[e("div",{children:i?e("span",{className:"name",children:((u=t==null?void 0:t.driver_user)==null?void 0:u.full_name)||"بدون راننده"}):l("span",{children:[e("span",{className:"name",children:"آژانس : "}),e("span",{children:(N=t==null?void 0:t.extra)==null?void 0:N.agency_name})]})}),i&&l(q,{children:[Object.entries(t.extra).map(([m,v])=>e("span",{children:Ee(v,r[`${m}s`])})),"(",(_=t.services)==null?void 0:_.map((m,v)=>{var f,S,a;return l("span",{children:[(S=(f=r==null?void 0:r.services)==null?void 0:f.find)==null?void 0:S.call(f,y=>y.key==m.service).title,v!=((a=t.services)==null?void 0:a.length)-1?" , ":""]})}),")"]})]})}const Nt=s=>{var i,c;const{missions:t}=Ge({mode:ae,status:qe}),{data:r}=ne();return(c=(i=t==null?void 0:t.data)==null?void 0:i.docs)==null?void 0:c.map(u=>e(q,{children:e(St,{vehicleBasicData:r,prompt_onMissionReady:s.prompt_onMissionReady,triggerVehicleAssignment:s.triggerVehicleAssignment,mission:u},u._id)}))};function St(s){const{mission:t,vehicleBasicData:r}=s;return e("div",{className:"bg-white dark:bg-boxdark shadow p-4 rounded-md",children:l("div",{className:"flex flex-col lg:flex-row",children:[e("div",{className:"flex-1 whitespace-nowrap overflow-hidden ",children:t.service_requests.map(i=>{})}),l("div",{className:"lg:w-64",children:[l("div",{onClick:()=>{var i;return(i=s.triggerVehicleAssignment)==null?void 0:i.call(s,s.mission,se)},className:"p-2 mx-1 h-32 relative",children:[I(e("div",{className:"rounded border border-dashed hover:text-primary hover:border-primary absolute top-2 left-0 right-0 bottom-2 cursor-pointer flex items-center justify-center",children:e(st,{className:"duration-300",size:32})})).if(t.vehicle_id==null),I(e("div",{className:"rounded border border-dashed hover:text-primary hover:border-primary absolute top-2 left-0 right-0 bottom-2 cursor-pointer flex-col flex items-center justify-center",children:e(le,{vehicle:t.vehicle_id,basicData:r})})).if(t.vehicle_id!=null)]}),I(e("div",{className:"px-1",children:e(ie,{onClick:()=>{var i;return(i=s.prompt_onMissionReady)==null?void 0:i.call(s,s.mission)},className:"mt-4 mb-2 w-full",children:"تایید نهایی"})})).if(t.status==qe&&t.vehicle_id!=null)]})]})})}const Ue=s=>{var y,b;const{fleetData:t}=s,{data:r}=ne(),i=d.useRef(),[c,u]=d.useState(!1),[N,_]=d.useState(null),[m,v]=d.useState(null);nt(c,N,i,lt,.015),d.useEffect(()=>{var g,C,k,$;if(console.log(7820,(C=(g=t==null?void 0:t.data)==null?void 0:g.vehicles)==null?void 0:C.docs),i){v("driver");const U=[];($=(k=t==null?void 0:t.data)==null?void 0:k.vehicles)==null||$.docs.map(A=>{(f===null||f===A._id)&&U.push(A._id)}),_(U),u(!0)}},[t,i]);const[f,S]=d.useState(null),a=g=>{S(g),console.log(55,g)};return e("div",{className:"TransportFleet-component",children:l("div",{className:"row",children:[e("div",{className:"col-12 col-md-3",children:l("div",{className:"search-div",children:[f!==null&&e("button",{className:"my-btn",onClick:()=>S(null),children:"نمایش همه"}),e("input",{className:"search",placeholder:"جستجوی رانندگان ..."}),e("div",{className:"driver-list",children:(b=(y=t==null?void 0:t.data)==null?void 0:y.vehicles)==null?void 0:b.docs.map(g=>l("div",{className:"vehicle-list",onClick:()=>{var C;return(C=s.handle_onVehicleClick)==null?void 0:C.call(s,g)},children:[e("i",{className:"fa fa-eye icon-eye",onClick:()=>a(g._id)}),e(le,{vehicle:g,basicData:r})]},g._id))})]})}),e("div",{className:"col-12 col-md-8",children:e("div",{className:"map-div",children:e("div",{className:"location-div",children:e(at,{mapRef:i})})})})]})})};function gt(){const[s,t]=d.useState({data:null}),r=_=>{var m,v;return((v=(m=s.data)==null?void 0:m.service_requests)==null?void 0:v.find(({request:f})=>f._id==_._id))!=null},i=_=>{const m={...s.data},v=_._id;m.service_requests=m.service_requests.map(({request:f})=>f._id==v?{request:{..._,submitted_by:f.submitted_by}}:{request:f}),t({...s,data:m})},c=_=>{if(s.data==null)return;const m={...s.data};return m.service_requests.push({request:_}),t({...s,data:m}),M().assignRequestToMission(s.data._id,_._id)},u=_=>{if(s.data==null)return;const m={...s.data};return m.service_requests=m.service_requests.filter(({request:v})=>v._id!=_._id),t({...s,data:m}),M().removeRequestFromMission(s.data._id,_._id)},N=()=>{M().getDraftMission().then(({data:_})=>t({data:_})).catch(console.log)};return d.useEffect(()=>{N()},[]),{data:s.data,assignRequestToDraft:c,removeRequestFromDraft:u,contains:r,update:i,reloadDraft:N}}function Ae(){const[s,t]=d.useState({vehicles:null});function r(i){M().getSortedVehicles(i).then(({data:c})=>{t({...s,vehicles:c})}).catch(console.log)}return d.useEffect(()=>{r()},[]),{data:s}}const he="select-vehicle-for-mission",Ct={status:"PENDING,CONFIRM"},Et=()=>{var J,P,L,p,E,T,V,O,B,H,Y,D,F;const[s,t]=d.useState({}),r=Ae(),[i,c]=d.useState({}),{show:u,ui:N}=Ie(""),_=o=>{var h,R,x,j,oe;if(((R=(h=r==null?void 0:r.data)==null?void 0:h.vehicles)==null?void 0:R.docs)==null)return;const n={};(oe=(j=(x=r==null?void 0:r.data)==null?void 0:x.vehicles)==null?void 0:j.docs)==null||oe.map(K=>{n[K._id]={vehicle_gps:o[K._id],user_gps:(K==null?void 0:K.driver_user)&&o[K.driver_user._id]}}),t(n)};it({listeners:{[He]:_}});const{data:m}=ne(),{showFullScreenModal:v,FullScreenModalUi:f,closeFullScreenModal:S}=Fe(),a=gt(),y=Ye({initialParams:Ct,mode:ae}),[b,g]=d.useState({visible_tab:z});function C(o,n=!0){g({...b,visible_tab:o}),n&&c({})}function k(o){a.contains(o)&&a.update(o),y.update(o)}async function $(o){v({data:o,submitCallback:n=>{S(),k(n)}})}async function U(o){try{const{data:n}=await a.removeRequestFromDraft(o);y.update(n.serviceRequest,!0),w.showSuccess("درخواست از پیش نویس حذف شد")}catch(n){w.showError(ue(n))}}async function A(o){try{const{data:n}=await a.assignRequestToDraft(o);y.update(n.serviceRequest),w.showSuccess("درخواست به پیش نویس اضافه شد")}catch(n){w.showError(ue(n))}}function X(o){i.current==he&&M().assignVehicleToMission(i.mission._id,o._id).then(()=>{i.callback_tab==z&&a.reloadDraft(),w.showSuccess("خودرو به سرویس اختصاص یافت"),C(i.callback_tab),c({})}).catch(n=>{w.showError(n.message)})}function Z(o){M().removeVehicleFromMission(o._id).then(()=>{a.reloadDraft(),w.showSuccess("خودرو از سرویس حذف شد")}).catch(n=>{w.showError(n.message)})}function Q(o){u({title:"تایید نهایی سرویس",desc:"به تایید نهایی سرویس اطمینان دارید؟",label_confirm:"تایید شود!",label_cancel:"خیر",onConfirm:()=>{M().updateMissionStatus(o==null?void 0:o._id,me).then(()=>{w.showSuccess("سرویس ما موفقیت تایید شد."),a.reloadDraft()}).catch(n=>{w.showError(n.message)})}})}function W({setAsReady:o}){u({title:o?"تایید سرویس":"انتشار سرویس",desc:o?"آیا از تایید نهایی سرویس اطمینان دارید؟":"آیا از انتشار سرویس اطمینان دارید؟",label_confirm:o?"تایید شود!":"منتشر شود!",label_cancel:"خیر",onConfirm:()=>{var n;M().updateMissionStatus((n=a==null?void 0:a.data)==null?void 0:n._id,o?me:bt).then(()=>{w.showSuccess("اطلاعات با موفقیت ثبت شد"),a.reloadDraft()}).catch(h=>{w.showError(h.message)})}})}function G(o,n){C(te,!1),c({current:he,mission:o,callback_tab:n})}return l("div",{className:"RequestManagment-component",children:[N,f,l("div",{className:"row",children:[e("div",{className:"col-12 col-md-8",children:e(_t,{})}),l("div",{className:"col-12 col-md-4",children:[e("button",{onClick:()=>C(z),className:`link ${b.visible_tab==z?"active-tab":"no-active"}`,children:e("span",{children:"درخواست"})}),e("button",{onClick:()=>C(se),className:` link ${b.visible_tab==se?"active-tab":"no-active"}`,children:e("span",{children:"سرویس"})}),e("button",{onClick:()=>C(te),className:` link ${b.visible_tab==te?"active-tab":"no-active"}`,children:e("span",{children:"ناوگان"})})]})]}),e("div",{className:"row",children:l("div",{className:"col-12",children:[I(e(vt,{editCallback:k,requests:y,draftMission:a,handle_assignRequestToDraft:A})).if(b.visible_tab==z),I(e(Nt,{prompt_onMissionReady:Q,triggerVehicleAssignment:G})).if(b.visible_tab==se),I(e(Ue,{handle_onVehicleClick:X,fleetData:r})).if(b.visible_tab==te)]})}),l(pt,{children:[I(e(je,{})).if((a==null?void 0:a.data)==null),I(e("label",{className:"lbl-text",children:"هیچ درخواستی در پیش نویس وجود ندارد"})).if(((P=(J=a==null?void 0:a.data)==null?void 0:J.service_requests)==null?void 0:P.length)===0),I(e("div",{children:(p=(L=a==null?void 0:a.data)==null?void 0:L.service_requests)==null?void 0:p.map(({request:o})=>{var n,h;return l("div",{className:"relative mx-2 my-4 rounded py-2 pl-6 pr-10 shadow duration-200",children:[e(de,{onClick:R=>U(o),className:"absolute right-0 top-0 h-10 w-10 cursor-pointer p-2 hover:text-danger"}),l("div",{className:"relative flex items-center border-b border-gray-2",children:[l("div",{className:"flex flex-col",children:[e("span",{className:"text-primary",children:(n=o.submitted_by)==null?void 0:n.full_name}),e("span",{className:"text-xs",children:Ee(o.service,m.services)})]}),e("div",{className:"py-2 pr-6 text-xs",children:e(fe,{onChange:R=>{},disableDayPicker:!0,calendar:ve,locale:be,format:"HH:mm",className:"datetime-picker",inputClass:"datetime-input !w-24 !text-center !text-lg !p-4",plugins:[e(Ke,{hideSeconds:!0})],value:o.gmt_for_date})}),e(ze,{onClick:()=>$(o),className:"absolute left-0 top-0 h-10 w-10 cursor-pointer p-2 hover:text-secondary"})]}),l("div",{children:[e("span",{className:"text-primary",children:"مبدا : "}),e("span",{className:"inline-block pt-2",children:(h=o.locations[0].meta)==null?void 0:h.address})]})]})})})).if((a==null?void 0:a.data)!=null),I(e("div",{onClick:()=>G(a==null?void 0:a.data,z),className:"h-28 px-4 pb-4",children:e("div",{className:"relative mx-1 h-full p-2",children:l("div",{className:"absolute bottom-2 left-0 right-0 top-2 flex cursor-pointer items-center justify-center rounded border border-dashed hover:border-primary hover:text-primary",children:[e(de,{onClick:o=>{o.stopPropagation(),Z(a==null?void 0:a.data)},className:"absolute right-2 top-2 cursor-pointer hover:text-danger"}),e(le,{vehicle:(E=a==null?void 0:a.data)==null?void 0:E.vehicle,basicData:m})]})})})).if(((V=(T=a==null?void 0:a.data)==null?void 0:T.service_requests)==null?void 0:V.length)>0&&((O=a==null?void 0:a.data)==null?void 0:O.vehicle)!=null),I(e(q,{children:l("button",{className:"my-btn",onClick:()=>G(a==null?void 0:a.data,z),children:[e("i",{className:"fas fa-car car-icon"})," انتخاب راننده"]})})).if(((H=(B=a==null?void 0:a.data)==null?void 0:B.service_requests)==null?void 0:H.length)>0&&((Y=a==null?void 0:a.data)==null?void 0:Y.vehicle)==null),I(l("div",{className:"flex px-4",children:[e(ie,{onClick:()=>W({setAsReady:!0}),className:"m-1 w-full bg-secondary",children:"انتشار"}),e(ie,{onClick:()=>W({setAsReady:!0}),className:"m-1 w-full",children:"تایید نهایی"})]})).if(((F=(D=a==null?void 0:a.data)==null?void 0:D.service_requests)==null?void 0:F.length)>0)]})]})};function yt(){var o;const[s,t]=d.useState(!1),{hasPermitFor:r}=re();d.useEffect(()=>{t(r([ye]))},[r]),d.useEffect(()=>{},[s]);const[i,c]=d.useState({activeUser:null}),{authInfo:u}=Se(),[N,_]=d.useState({}),[m,v]=d.useState({}),[f,S]=d.useState({}),[a,y]=d.useState(null),[b,g]=d.useState([]),C=Ae(),{data:k}=ne(),$=n=>{_({...N,[n.target.name]:n.target.value}),console.log(51,N)},U=()=>{_({}),v({}),S({}),y(null),g([]),c({...i,activeUser:null})},A=()=>{console.log(3e3,b);const n=b.map((R,x)=>{const j=Ze(N,f[b[x]._id],"","");return j.submitted_for=R,j});console.log(441,n);const h={extra:{...N},data:n,vehicle_id:a==null?void 0:a._id};console.log(71,h),M().submitFullMission(h).then(({data:R})=>{console.log(8),w.showSuccess("سرویس با موفقیت ثبت شد"),U(),L(),F()}).catch(R=>{console.log(7),w.showError(R.message)})},X=n=>{y(n),W(),P({})},{ui:Z,show:Q,hide:W}=ce({title:"انتخاب خودرو",zIndex:9000001,ignoreFixedWidth:!0,renderContent:e("div",{children:e("div",{children:e(Ue,{handle_onVehicleClick:X,fleetData:C})})})}),G=()=>{Q({}),L()},{ui:J,show:P,hide:L}=ce({title:"اطلاعات تکمیلی",zIndex:4,renderContent:l("div",{children:[e(Xe,{formState:N,fields:(o=u==null?void 0:u.org)==null?void 0:o.additionalTripFields,onInputChange:$}),e(ut,{title:"انتخاب خودرو"}),l("div",{onClick:G,children:[I(e("i",{className:" fa fa-car"})).if(a==null),e("div",{children:e(le,{vehicle:a,basicData:k})})]}),e("button",{className:"my-btn",onClick:A,children:"ثبت سفر"})]})}),p=()=>{P({})},E=n=>{const h=b.filter(j=>j._id!=n._id);g(h);const R={...m};delete R[n._id],v(R);const x={...f};delete x[n._id],S(x),h.length==0&&c({...i,activeUser:null})},T=n=>{const h=n.target.value;Object.keys(m).length<(h==null?void 0:h.length)&&(h==null||h.map(x=>{m[x._id]==null&&(V(x,{}),O(x,{locations:[]}))})),i.activeUser==null&&B(h==null?void 0:h[0])},V=(n,h)=>{v({...m,[n._id]:h})},O=(n,h)=>{S({...f,[n._id]:h})},B=n=>{c({...i,activeUser:n})},H=(n,h)=>{console.log(5)},{show:Y,ui:D,close:F}=De({renderContent:({})=>l("div",{className:"useCreateTripModal-component",children:[e("div",{children:e("div",{children:e(ot,{freeInput:s===!0,hideChips:!0,showListOnTop:!1,externalState:[b,g],permissions:["SERVICE.PERSONAL.SUBMIT"],include_external_base:!0,onChange:T})})}),l("div",{children:[e("div",{children:e(dt,{highlights:i.activeUser?[i.activeUser]:[],smallChips:!0,list:b,onChipsItemClick:B,handleRemove:E})}),l("div",{children:[I(e("div",{className:"search-default-text",children:"مسافر مورد نظر را جستجو کنید ..."})).if((b==null?void 0:b.length)==0),b.map(n=>{var h;if(n._id==((h=i.activeUser)==null?void 0:h._id))return e(Te,{mode:et,externalState:[m[n._id],R=>V(n,R)],externalUserInput:[f[n._id],R=>O(n,R)],overrideOnSubmit:H},n._id)})]})]}),l("div",{children:[J,e("button",{className:"my-btn regist-btn",onClick:p,children:"ثبت درخواست"})]}),Z]})});return{showFullScreenModal:Y,FullScreenModalUi:D,closeFullScreenModal:F}}const pe=[{key:xe,label:"مدیریت درخواست ها"},{key:Me,label:"تاریخچه درخواست ها"},{key:ke,label:"تاریخچه سرویس ها"}];function Zt(){const[s,t]=d.useState(pe[0].key),r=yt(),{hasPermitGroup:i,hasPermitFor:c,hasAdminRank:u,permits:N,authInfo:_,type:m}=re(),[v,f]=d.useState(!1),[S,a]=d.useState(!1),[y,b]=d.useState(!1);return d.useEffect(()=>{},[S]),d.useEffect(()=>{a(c([ye,Qe])),b(c([ge,Ce])),f(!0)},[c]),d.useEffect(()=>{},[v]),l(q,{children:[v===!1&&e("p",{children:"در حال لود شدن ...."}),v===!0&&l("div",{className:"tripmission-component",children:[e("div",{className:"row",children:e("div",{className:"col-12",children:e(We,{pageName:"مدیریت سفر ها"})})}),e("div",{className:"row",children:e("div",{className:"col-12",children:l("div",{className:"NoPermission-div ",children:[S===!0&&l("button",{className:"my-btn flex-center",onClick:()=>{r.showFullScreenModal({data:{}})},children:[e("span",{children:"ایجاد سفر"}),e("i",{className:"fa fa-plus plus flex-center"})]}),S===!1&&e(q,{children:l("button",{disabled:!0,className:"my-btn NoPermission",children:[e("span",{children:"ایجاد سفر"}),e("i",{className:"fa fa-warning info-icon"}),e("div",{className:"info-message alert alert-warning",children:m==="SystemInActive"?"سیستم غیر فعال است":m==="No_WorkingWeek"?"امروز روز کاری نیست":""})]})})]})})}),e("div",{className:"row",children:e("div",{className:"col-12",children:e(mt,{tabs:pe,defaultActiveTab:s,onTabChange:t})})}),e("div",{className:"row",children:l("div",{className:"col-12",children:[function(){switch(s){case xe:return e(Et,{});case ht:return"2";case Me:return e(rt,{mode:ae});case ke:return e(ct,{mode:ae,paging:!1,status:"DONE"})}}(),r.FullScreenModalUi]})})]})]})}export{Zt as default};