import{o as le,r as i,ay as ce,az as de,aA as ue,aB as me,aC as he,u as pe,c as t,j as c,aD as j,F as fe,aE as z,k as d,aF as U,aG as F,aH as ge,V as ye,X as be,a1 as we,au as ke,h as G,f as g,at as X}from"./index-0b0339af.js";import{M as Ne}from"./MapContainer-3ed43c51.js";import{M as xe}from"./marker-red-cc8765ae.js";import{B as _e}from"./BottomSheetModal-f5116632.js";import{u as Se,S as ve}from"./SuggestionTextInput-599de7a6.js";import{r as y}from"./renderUi-49d0f127.js";import{C as Pe}from"./Chips-65a50fec.js";import{u as Te}from"./useConfirmModal-14905c63.js";import{L as Ee}from"./LocationSearch-3b785f69.js";import"./useNeshanApi-2b6ec5ba.js";const He=()=>{var A,R,M;const{hasPermitGroup:Ce,hasPermitFor:u,hasAdminRank:Ie,permits:Le}=le();i.useState(!1);const[v,H]=i.useState(!1),[P,O]=i.useState(!1),[T,V]=i.useState(!1),[Ae,Y]=i.useState(!1);i.useEffect(()=>{H(u([ce])),O(u([de])),V(u([ue])),Y(u([me]))},[u]);const h=i.useRef(),{regions:b,refreshRegions:E}=he(),{show:q,ui:J}=Te(null),[n,p]=i.useState({readyToSubmit:!1,markerIsPlaced:!1,displayAreaList:!1}),[l,w]=i.useState({dispatcher:null}),{authInfo:k}=pe(),N=i.useRef(),{refreshData:K}=Se({permissions:["SERVICE.ORG.DISPATCH"],include_external_base:!0,search_all:!0}),o=i.useRef(),a=i.useRef({markers:[],polygonLayer:null}),f=i.useRef([]);i.useEffect(()=>{const e=setTimeout(()=>{f.current.map(({geo:r})=>{o.current.remove(r.polygon)}),f.current=[],b.map(r=>{const s=o.current.addPolygon(r.geometry.coordinates[0],!0);f.current.push({geo:s,region:r})})},300);return()=>clearTimeout(e)},[b]);const Q=e=>{N.current=e},W=()=>{N.current.show()},C=()=>{N.current.hide()},I=()=>{p({...n,displayAreaList:!n.displayAreaList})},Z=e=>{var D,B;e.preventDefault();const r=l.region!=null,s=ke(h),m=s.title;delete s.title,delete s[""];const S={type:"Polygon",coordinates:[a.current.polygonLayer.coordinates]},ne={name:m,properties:s,geometry:S,dispatcher:(D=l.dispatcher)==null?void 0:D._id},ie=r?"updateRegion":"createRegion";G()[ie](ne,(B=l.region)==null?void 0:B._id).then(()=>{C(),x(),g.showSuccess("اطلاعات با موفقیت ذخیره شد"),E()}).catch(oe=>{g.showError(oe.message)})},$=e=>{L(),p({...n,displayAreaList:!1}),X(h,{title:e.name,...e.properties}),w({dispatcher:e.dispatcher,region:e});const r=f.current.find(s=>s.region._id==e._id);r.geo.coordinates.map((s,m)=>{if(m<r.geo.coordinates.length-1){const S=o.current.addMarker(s[0],s[1],!0);a.current.markers.push(S)}}),_()},L=()=>{var e,r;a.current.markers.map(s=>{o.current.remove(s.marker)}),(r=(e=a.current)==null?void 0:e.polygonLayer)!=null&&r.polygon&&o.current.remove(a.current.polygonLayer.polygon),a.current.markers=[],a.current.polygonLayer=null},ee=()=>{q({title:"حذف محدوده",desc:"آیا از حذف محدوده اطمینان دارید?",label_confirm:"حذف کن!",label_cancel:"خیر",onConfirm:()=>{var e;G().deleteRegion((e=l.region)==null?void 0:e._id).then(()=>{C(),x(),g.showSuccess("اطلاعات با موفقیت حذف شد"),E()}).catch(r=>{g.showError(r.message)})}})},x=()=>{w({}),X(h,{name:""}),L(),p({...n,readyToSubmit:!1,markerIsPlaced:!1})},te=()=>{const e=a.current.markers.pop();e!=null&&(o.current.remove(e.marker),_())},re=()=>{if(o.current==null)return;const e=o.current.addMarkerToCenter();a.current.markers.push(e),_()};function _(){if(a.current.polygonLayer!=null&&(o.current.remove(a.current.polygonLayer.polygon),a.current.polygonLayer=null),a.current.markers.length>=2){const r=o.current.addPolygon(a.current.markers.map(s=>s.coordinates),!0,"3, 252, 115");a.current.polygonLayer=r}const e={readyToSubmit:a.current.markers.length>=3,markerIsPlaced:a.current.markers.length>0};p({...n,...e})}const se=e=>{w({...l,dispatcher:e})},ae=async function(r){return new Promise((s,m)=>K(r).then(s).catch(m))};return t("div",{className:"AreaManager-component",children:c("div",{className:"main-div",children:[t(Ne,{mapRef:o}),t("img",{className:"absolute bottom-2/4 left-2/4 w-8 -translate-x-2/4",src:xe}),t(Ee,{mapRef:o,className:"absolute left-0 right-0 top-0 z-50 m-2 flex "}),t("i",{onClick:I,className:"fa fa-bars btn-bars"}),y(t("button",{onClick:x,className:"fixed right-2 lg:right-75 top-40 shadow bg-white active:saturate-50 w-14 h-14 p-3 flex justify-center items-center text-white p-3 rounded-full",children:t(j,{className:"text-graydark ",size:40})})).if(l.region!=null),y(c(fe,{children:[T===!0&&t("button",{onClick:ee,className:"fixed right-2 lg:right-75 top-60 shadow bg-white active:saturate-50 w-14 h-14 p-3 flex justify-center items-center text-white p-3 rounded-full",children:t(z,{className:"text-danger ",size:40})}),T===!1&&t("button",{disabled:!0,className:"NoPermission fixed right-2 lg:right-75 top-60 shadow bg-white active:saturate-50 w-14 h-14 p-3 flex justify-center items-center text-white p-3 rounded-full",children:t(z,{className:"text-danger ",size:40})})]})).if(l.region!=null),c("div",{className:d("areas-list-div",{"-translate-x-full":!n.displayAreaList}),children:[t("div",{className:"border-b border-gray-4",children:t(j,{onClick:I,size:40,className:"p-2 cursor-pointer"})}),t("div",{className:"p-2 scroller",children:b.map(e=>{var r;return t("div",{onClick:()=>$(e),className:d("px-1 py-3 text-xs border-b border-gray-4 cursor-pointer active:bg-gray-2 hover:bg-gray-2",{"!bg-gray-4":((r=l.region)==null?void 0:r._id)==e._id}),children:e.name})})})]}),c("div",{className:"fixed bottom-0 right-0 flex flex-col p-4 justify-between items-center lg:mr-72",children:[v===!0&&t("button",{onClick:W,className:d("shadow duration-100 overflow-hidden bg-success active:saturate-50 flex justify-center items-center text-white rounded-full",{"w-0 h-0 p-0":!n.readyToSubmit,"w-14 h-14 p-3":n.readyToSubmit}),children:t(U,{className:"p-0.5",size:34})}),v===!1&&t("button",{disabled:!0,className:d(" NoPermission shadow duration-100 overflow-hidden bg-success active:saturate-50 flex justify-center items-center text-white rounded-full",{"w-0 h-0 p-0":!n.readyToSubmit,"w-14 h-14 p-3":n.readyToSubmit}),children:t(U,{className:"p-0.5",size:34})}),P===!0&&t("button",{onClick:te,className:d("shadow duration-100 bg-white active:saturate-50 flex justify-center items-center text-white rounded-full",{"w-0 h-0 p-0 my-0":!n.markerIsPlaced,"w-14 h-14 p-3 my-2":n.markerIsPlaced}),children:t(F,{className:"p-0.5 text-primary",size:30})}),P===!1&&t("button",{disabled:!0,className:d("NoPermission shadow duration-100 bg-white active:saturate-50 flex justify-center items-center text-white rounded-full",{"w-0 h-0 p-0 my-0":!n.markerIsPlaced,"w-14 h-14 p-3 my-2":n.markerIsPlaced}),children:t(F,{className:"p-0.5 text-primary",size:30})}),t("button",{onClick:re,className:"shadow  bg-primary active:saturate-50 w-14 h-14 flex justify-center items-center text-white p-3 rounded-full",children:t(ge,{className:"p-0.5",size:30})})]}),t(_e,{onCreate:Q,children:t("div",{className:"px-2",children:c("form",{className:"py-6",ref:h,children:[c("div",{className:"w-full",children:[t("label",{className:"py-2 inline-block",children:"عنوان محدوده"}),t("input",{name:"title",placeholder:"عنوان",className:"p-2 rounded w-full outline-none border border-gray-4 focus:border-primary"})]}),c("div",{children:[c("div",{className:"flex items-center",children:[t("label",{className:"pt-6 inline-block",children:"توزیع کننده ی محدوده"}),t("span",{className:"pt-6 mx-2 flex items-center",children:t(Pe,{className:"!text-lg !py-0",children:t("span",{className:"flex items-center",children:(A=l.dispatcher)==null?void 0:A.full_name})})})]}),t(ve,{showListOnTop:!0,onSuggestionSelected:se,placeholder:"جستجوی توزیع کننده ها ...",readFromDataSource:ae,suggestionRenderer:e=>t("div",{className:"px-4 py-1",children:e.full_name})})]}),(M=(R=k==null?void 0:k.org)==null?void 0:R.regionAdditionalProperties)==null?void 0:M.map(e=>{var r;return c("div",{children:[t("label",{className:"py-2 inline-block",children:e.title}),y(t("input",{className:"w-full",name:e.key})).if(e.type==ye),y(t("select",{className:"w-full select-box",name:e.key,children:(r=e.options)==null?void 0:r.map(s=>t("option",{value:s.key,children:s.title},s.key))})).if(e.type==be)]},e.key)}),t(we,{onClick:Z,className:"mt-6 w-full",children:"ثبت اطلاعات"})]})})}),J]})})};export{He as default};