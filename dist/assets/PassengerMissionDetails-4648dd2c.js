import{c as e,F as A,j as r,a2 as I,a3 as T,w as k,r as n,A as U,a4 as _,a5 as j,u as L}from"./index-4b638fea.js";import{N as G,M as q}from"./MapContainer-a1f86b32.js";import{M as O}from"./marker-red-cc8765ae.js";import{U as V}from"./user-03-3459d852.js";import{T as x}from"./TitledSparator-69b1d396.js";import{P as z}from"./PlaqueInput-aecdb007.js";import{u as B}from"./useNeshanApi-69a62daf.js";import{u as K}from"./useVehicleBasicData-dc6e97f6.js";import{g as Z,c as Y}from"./carIcon-ac58272a.js";import"./useSocket-4f91f465.js";import"./useVehicles-4e45c742.js";const H=({mission:t})=>{var g,d;console.log(88,t);const m=c=>{window.location.href=`tel:${c}`};return e(A,{children:t&&r("div",{className:"TripMissionDetails-component",children:[r("div",{className:"flex justify-between",children:[r("div",{className:"flex",children:[e("div",{className:"relative h-12 w-12 rounded-full",children:e("img",{src:V,alt:"User"})}),e("div",{className:"flex flex-col px-2",children:r("label",{children:[t==null?void 0:t._id,e("br",{}),t==null?void 0:t.created_by]})})]}),r("div",{className:"flex flex-col px-2 items-center whitespace-nowrap",children:[e("label",{className:"mb-1 text-sm",children:`${t.vehicleName}  ${t.vehicleColor}`}),e(z,{small:!0,disabled:!0,value:I(t.vehiclePlaque)})]}),r("div",{className:"border-r border-gray-4 flex flex-col",children:[e("i",{className:"fa fa-phone icon-phone",onClick:()=>m(t.driver_phone)}),e(T,{className:"p-2 active:bg-gray-4",size:40})]})]}),e("div",{children:e("table",{className:"w-full",children:r("tbody",{children:[e("tr",{children:r("td",{colSpan:2,children:[" ",e(x,{title:"سفر"})," "]})}),r("tr",{className:"text-sm ",children:[e("td",{className:"px-3 pt-2 bold whitespace-nowrap align-top text-left",children:"حرکت"}),e("td",{className:"pt-2",children:k(t.mission_date)})]}),e("tr",{children:r("td",{colSpan:2,children:[" ",e(x,{title:"مسیر"})," "]})}),r("tr",{className:"text-sm",children:[e("td",{className:"px-3 pt-2 bold whitespace-nowrap align-top text-left",children:"مبدا"}),e("td",{className:"pt-2",children:t.locations&&t.locations.length>0&&((g=t.locations[0].meta)==null?void 0:g.address)})]}),r("tr",{className:"text-sm ",children:[e("td",{className:"px-3 pt-2 bold whitespace-nowrap align-top text-left",children:"مقصد"}),e("td",{className:"pt-2",children:t.locations&&t.locations.length>0&&((d=t.locations[t.locations.length-1].meta)==null?void 0:d.address)})]}),e("tr",{children:r("td",{colSpan:2,children:[" ",e(x,{title:"مشخصات"})," "]})}),r("tr",{className:"text-sm",children:[e("td",{className:"px-3 pt-2 bold whitespace-nowrap align-top text-left",children:"دیسپاچر"}),e("td",{className:"pt-2",children:t.dispature})]}),r("tr",{className:"text-sm",children:[e("td",{className:"px-3 pt-2 bold whitespace-nowrap align-top text-left",children:"مرکز هزینه"}),e("td",{className:"pt-2",children:t.proj_desc})]}),e("tr",{children:e("td",{colSpan:2,children:e("button",{className:"bg-primary text-white rounded-3xl p-2 w-full mt-6",children:t.status==="READY"?"در انتظار حرکت راننده":"در حال سفر"})})})]})})})]})})},pe=t=>{const[m,g]=n.useState(!1);B();const d=n.useRef(null),{missions:c}=U({mode:_,paging:!1}),[b,J]=n.useState(!1),[S,y]=n.useState(!1),[M,C]=n.useState(null),[Q,$]=n.useState(null);Z(S,M,d,Y,.015),n.useEffect(()=>{var o,u,f;if(c&&((o=c.data)==null?void 0:o.length)>0&&d.current)try{$("driver"),C([(u=c.data[0])==null?void 0:u.vehicleID]),y(!0);let i=[];(f=c.data[0].locations)==null||f.forEach(l=>{var h;i.push([l.coordinates[1],l.coordinates[0]]),(h=d.current)==null||h.addMarker(l.coordinates[1],l.coordinates[0],!0,O,.1)}),P(i)}catch(i){console.error("Error adding markers:",i)}},[c]),n.useEffect(()=>{},[b]);function D(o){let u=0;const f=o.length;let i=0,l=0;const h=[];for(;u<f;){let a=0,s=0,p;do p=o.charCodeAt(u++)-63,s|=(p&31)<<a,a+=5;while(p>=32);const N=s&1?~(s>>1):s>>1;i+=N,a=0,s=0;do p=o.charCodeAt(u++)-63,s|=(p&31)<<a,a+=5;while(p>=32);const v=s&1?~(s>>1):s>>1;l+=v,h.push([i*1e-5,l*1e-5])}return h}const E=(o,u)=>{var f,i;try{const l=o.routes;console.log(400,l);let h=[];l&&l.length>0&&((f=l[0].legs)==null||f.map((a,s)=>{var p;(p=a.steps)==null||p.map((N,v)=>{D(N.polyline).map(w=>{h.push([w[1],w[0]])})})}),console.log(4589,h),(i=d.current)==null||i.addRoute(h,!0,"0, 0, 255"))}catch(l){console.error("Error extracting route coordinates:",l)}return null},[W,R]=n.useState([]),P=async o=>{R(o),console.log(52,o);let u,f,i="";const l=o==null?void 0:o.length;o.map((a,s)=>{s===0?u=`${a[1]},${a[0]}`:s===l-1?f=`${a[1]},${a[0]}`:l>2&&s===1?i+=`${a[1]},${a[0]}`:i+=`%7C${a[1]},${a[0]}`});const h=`https://api.neshan.org/v4/direction?type=car&origin=${u}&destination=${f}&waypoints=${i}&avoidTrafficZone=false&avoidOddEvenZone=false&alternative=false&bearing`;console.log(66,h),await j.get(h,{headers:{"Api-Key":G}}).then(a=>{var p;console.log("API response:",a);const s=E(a.data,o[l-1]);console.log(253,s),(p=d==null?void 0:d.current)==null||p.addRoute(s,!0,"255, 0, 0")}).catch(a=>{console.error("Error fetching data:",a)})};K({include_inactive:!1}),L(),n.useRef(),n.useState(t.initialValues||{});const[F,X]=n.useState({locations:[]});return n.useRef({polyline:null}),n.useState({readyForSubmit:!1}),n.useEffect(()=>{},[F]),n.useEffect(()=>{d.current&&d.current.addMarkerToCenter()},[d.current]),e("div",{className:"PassengerMissionDetails-component",children:e("div",{className:"row",children:r("div",{className:"col-12",children:[r("div",{className:"location-div",children:[e(q,{freeze:!1,mapRef:d,onMapInit:()=>{}}),e("i",{className:"fa fa-location"}),e("span",{className:"flex",children:e("i",{className:"fas fa-car car-icon",onClick:()=>g(!0)})})]}),m===!0&&r("div",{className:"div-details",children:[e("i",{onClick:()=>g(!1),className:"fa fa-remove close-icon"}),(c==null?void 0:c.data)&&(c==null?void 0:c.data[0])&&e(H,{mission:c==null?void 0:c.data[0]})]})]})})})};export{pe as default};
