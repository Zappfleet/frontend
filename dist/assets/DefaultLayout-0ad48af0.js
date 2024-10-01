import{r as s,u as _,a as w,j as o,L,b as e,s as O,c as x,N as g,d as R,e as T,R as F,O as G,F as C,D as M,f as P,g as A}from"./index-a6150745.js";import{u as H}from"./useConfirmModal-06992f97.js";import{l as U,u as j}from"./useSocket-8b3223ec.js";import{u as V}from"./useVehicles-13ecc312.js";const q=()=>{var p;const[t,a]=s.useState(!1),{authInfo:n}=_(),{show:u,ui:i}=H("ModalLayout-component-login"),c=w(),h=s.useRef(null),r=s.useRef(null);s.useEffect(()=>{const d=({target:m})=>{r.current&&(!t||r.current.contains(m)||h.current.contains(m)||a(!1))};return document.addEventListener("click",d),()=>document.removeEventListener("click",d)}),s.useEffect(()=>{const d=({keyCode:m})=>{!t||m!==27||a(!1)};return document.addEventListener("keydown",d),()=>document.removeEventListener("keydown",d)});const l=()=>{O({}),c(x)},f=()=>{u({title:"خروج از حساب",desc:"آیا قصد خروج از حساب کاربری خود را دارید؟",label_confirm:"بله, خارج شو!",label_cancel:"خیر",onConfirm:()=>l()})};return o("div",{className:"DropdownUser-component",children:[i,o(L,{ref:h,onClick:()=>a(!t),to:"#",children:[e("span",{className:"userTitle",children:(p=n==null?void 0:n.auth)==null?void 0:p.username}),e("i",{className:"fa fa-user user-img"}),e("i",{className:" fa fa-angle-down "})]}),e("div",{ref:r,onFocus:()=>a(!0),onBlur:()=>a(!1),className:"profile-div",style:{display:t===!0?"block":"none"},children:o("ul",{children:[e("li",{children:o(L,{to:"/profile",children:[e("i",{className:"fa fa-user"}),e("span",{children:"پروفایل"})]})}),e("li",{children:o("button",{onClick:f,children:[e("i",{className:"fa fa-sign-out"}),e("span",{children:"خروج"})]})})]})})]})};const B=()=>e("header",{className:"bg-primary header-component",children:o("div",{className:"row header-div",children:[e("div",{className:"col-12 col-md-2 flex-center",children:e(g,{to:"/",children:e("span",{className:"titlepage",children:"سامانه ی جامع حمل و نقل زپ "})})}),e("div",{className:"col-12 col-md-8 flex-center",children:o("div",{className:"search flex-center",children:[e("input",{type:"text",placeholder:"جستجو ...",className:"form-control"}),e("i",{className:"fa fa-search flex-center"})]})}),e("div",{className:"col-2 d-block d-md-none"}),e("div",{className:"col-10 col-md-2 flex-end",children:e(q,{})})]})});const J=({children:t,activeCondition:a})=>{const[n,u]=s.useState(a);return e("li",{children:t(()=>{u(!n)},n)})},E=()=>{const t=R(),a=T(),{pathname:n}=a;s.useRef(null);const u=s.useRef(null),i=localStorage.getItem("sidebar-expanded"),[c,h]=s.useState(i===null?!1:i==="true");return s.useEffect(()=>{var r,l;localStorage.setItem("sidebar-expanded",c.toString()),c?(r=document.querySelector("body"))==null||r.classList.add("sidebar-expanded"):(l=document.querySelector("body"))==null||l.classList.remove("sidebar-expanded")},[c]),e("div",{className:"sidebar-component",children:e("aside",{ref:u,children:e("ul",{children:t==null?void 0:t.map(r=>r.is_title?e("h3",{children:r.label},r.key):r.sub_menu==null?e("li",{children:o(g,{to:r.href,children:[o("i",{children:[r.icon," "]}),o("span",{children:[" ",r.label," "]})]})},r.key):e("ul",{children:e(J,{activeCondition:n==="/"||n.includes("dashboard"),children:(l,f)=>{var p;return o(F.Fragment,{children:[o(g,{to:"#",onClick:d=>{d.preventDefault(),c?l():h(!0)},children:[r.icon,r.label]}),e("div",{children:e("ul",{children:(p=r.sub_menu)==null?void 0:p.map(d=>e("li",{children:o(g,{to:d.href,children:[d.icon,d.label]})},d.key))})})]})}})},r.key))})})})};const $=()=>e("main",{className:"main-component",children:e(G,{})});function z(){return e(C,{})}function K({vehicleID:t}){s.useState({latitude:null,longitude:null});const a=s.useRef(null),n=i=>{navigator.geolocation?navigator.geolocation.getCurrentPosition(c=>{const{latitude:h,longitude:r}=c.coords;u(h,r,null,t)},c=>{console.error("Error getting location: ",c)}):console.error("Geolocation is not supported by this browser.")};function u(i,c,h,r){try{const l=U("http://127.0.0.1:4000",{reconnectionDelayMax:1e4,autoConnect:!0,path:"/api/v2/socket",auth:{token:localStorage.getItem("bearer_token")}});l.on("connect",()=>{let f=[];f.push({lat:i,lng:c,ownerID:r});const p="event-gps-update";l.emit(p,JSON.stringify(f))}),l.on("disconnect",()=>{console.log("Disconnected from server")})}catch(l){console.error("Error in sendFakeLocations:",l)}}return s.useEffect(()=>(a.current=setInterval(()=>{try{n([t])}catch(i){console.error("Error in sendCurrentLocationToServer:",i)}},15e3),()=>{a.current&&(clearInterval(a.current),a.current=null)}),[]),null}const Z=()=>{var m;const[t,a]=s.useState(!1),{authInfo:n}=_(),{vehicles:u}=V(),i=w();s.useState(!1);const[c,h]=s.useState(void 0),[r,l]=s.useState(void 0);s.useEffect(()=>{var v,b,y;if(n!=null&&n.auth==null)i(x);else{try{l((b=(v=n==null?void 0:n.auth)==null?void 0:v.roles)==null?void 0:b.some(N=>N.title===M))}catch{l(void 0)}try{const N=(y=u==null?void 0:u.docs)==null?void 0:y.find(D=>{var S,k;return((S=D.driver_user)==null?void 0:S.id)===((k=n==null?void 0:n.auth)==null?void 0:k._id)});h(N?N._id:void 0)}catch{h(void 0)}}},[n,u,i]);const[f,p]=s.useState(null);return s.useEffect(()=>{var v,b;f&&((v=n==null?void 0:n.auth)!=null&&v._id)&&f.userIDs===((b=n==null?void 0:n.auth)==null?void 0:b._id)&&P.showSuccess(f.massage)},[f,(m=n==null?void 0:n.auth)==null?void 0:m._id]),j({listeners:{sendNotification:v=>{p(v)}}}),(n==null?void 0:n.auth)==null?e(A,{}):e(C,{children:o("div",{className:"container-fluid DefaultLayout-component",children:[e("div",{className:"row row-header",children:o("div",{className:"col-12",children:[e("i",{onClick:()=>a(!t),className:"button-bars fa fa-bars d-block d-sm-none"}),e(B,{})]})}),o("div",{className:"row have-sidebar",children:[e("div",{className:"col-8 handleShowSidebar",style:{display:t===!0?"block":"none"},children:e(E,{})}),e("div",{className:"col-3 d-none d-sm-block",children:e(E,{})}),o("div",{className:"col-12 col-md-9",children:[c&&e(K,{vehicleID:c}),e($,{})]})]}),e("div",{className:"row",children:e("div",{className:"col-12",children:e(z,{})})})]})})};export{Z as default};
