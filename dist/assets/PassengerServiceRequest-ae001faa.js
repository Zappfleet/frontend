import{r as v,T as ve,u as de,D as ye,U as xe,j as D,c as d,V as be,W as ke,X as Se,l as we,p as Ee,m as _e,Y as Ne,Z as je,F as Ce,e as Oe,_ as De,k as re,$ as Me,a0 as G,a1 as Pe,h as Ae,f as ne}from"./index-0b0339af.js";import{M as Te}from"./MapContainer-3ed43c51.js";import{M as Ie}from"./marker-red-cc8765ae.js";import{B as Ye}from"./BottomSheetModal-f5116632.js";import{L as Re}from"./LocationSearch-3b785f69.js";import{u as Ue}from"./useNeshanApi-2b6ec5ba.js";import{u as Fe}from"./useVehicleBasicData-94dff65a.js";import{r as L}from"./renderUi-49d0f127.js";import{U as Le}from"./UsersSuggestionInput-007d7b87.js";import{u as ze}from"./useFavorite-a4f00f3c.js";var ue={};Object.defineProperty(ue,"__esModule",{value:!0});var ee=v,Be=ve;function me(e){return e&&typeof e=="object"&&"default"in e?e:{default:e}}var u=me(ee),J=me(Be);function ae(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var l=Object.getOwnPropertySymbols(e);t&&(l=l.filter(function(o){return Object.getOwnPropertyDescriptor(e,o).enumerable})),r.push.apply(r,l)}return r}function q(e){for(var t=1;t<arguments.length;t++){var r=arguments[t]!=null?arguments[t]:{};t%2?ae(Object(r),!0).forEach(function(l){qe(e,l,r[l])}):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):ae(Object(r)).forEach(function(l){Object.defineProperty(e,l,Object.getOwnPropertyDescriptor(r,l))})}return e}function qe(e,t,r){return(t=function(l){var o=function(i,c){if(typeof i!="object"||i===null)return i;var s=i[Symbol.toPrimitive];if(s!==void 0){var a=s.call(i,c||"default");if(typeof a!="object")return a;throw new TypeError("@@toPrimitive must return a primitive value.")}return(c==="string"?String:Number)(i)}(l,"string");return typeof o=="symbol"?o:String(o)}(t))in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function Q(e,t){return function(r){if(Array.isArray(r))return r}(e)||function(r,l){var o=r==null?null:typeof Symbol<"u"&&r[Symbol.iterator]||r["@@iterator"];if(o!=null){var i,c,s,a,g=[],E=!0,m=!1;try{if(s=(o=o.call(r)).next,l===0){if(Object(o)!==o)return;E=!1}else for(;!(E=(i=s.call(o)).done)&&(g.push(i.value),g.length!==l);E=!0);}catch(A){m=!0,c=A}finally{try{if(!E&&o.return!=null&&(a=o.return(),Object(a)!==a))return}finally{if(m)throw c}}return g}}(e,t)||pe(e,t)||function(){throw new TypeError(`Invalid attempt to destructure non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`)}()}function pe(e,t){if(e){if(typeof e=="string")return oe(e,t);var r=Object.prototype.toString.call(e).slice(8,-1);return r==="Object"&&e.constructor&&(r=e.constructor.name),r==="Map"||r==="Set"?Array.from(e):r==="Arguments"||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r)?oe(e,t):void 0}}function oe(e,t){(t==null||t>e.length)&&(t=e.length);for(var r=0,l=new Array(t);r<t;r++)l[r]=e[r];return l}function ie(e){var t=e.direction,r=e.onClick,l=e.disabled;return u.default.createElement("button",{type:"button",className:"rmdp-arrow-container ".concat(t," ").concat(l?"disabled":""),onClick:r,"aria-roledescription":"button to navigate ".concat(t.replace("rmdp-",""))},u.default.createElement("i",{className:"rmdp-arrow"}))}function $e(e){var t=e.max,r=e.name,l=e.value,o=e.onChange,i=e.digits;return u.default.createElement("input",{type:"text",name:r,value:l,onChange:function(s){var a=c(s.target.value);isNaN(a)||t&&Number(a)>t||o(r,a)},onKeyDown:function(s){var a;if(s.key==="ArrowUp")a=1;else{if(s.key!=="ArrowDown")return;a=-1}o(r,c(l)+a)}});function c(s){var a,g=function(m,A){var _=typeof Symbol<"u"&&m[Symbol.iterator]||m["@@iterator"];if(!_){if(Array.isArray(m)||(_=pe(m))||A&&m&&typeof m.length=="number"){_&&(m=_);var y=0,M=function(){};return{s:M,n:function(){return y>=m.length?{done:!0}:{done:!1,value:m[y++]}},e:function(k){throw k},f:M}}throw new TypeError(`Invalid attempt to iterate non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`)}var O,p=!0,C=!1;return{s:function(){_=_.call(m)},n:function(){var k=_.next();return p=k.done,k},e:function(k){C=!0,O=k},f:function(){try{p||_.return==null||_.return()}finally{if(C)throw O}}}}(i);try{for(g.s();!(a=g.n()).done;){var E=a.value;s=s.replace(E,i.indexOf(E))}}catch(m){g.e(m)}finally{g.f()}return Number(s)}}function Z(e){return Array.isArray(e)}function He(e){var t=e.selectedDate,r=e.focused,l=e.handleFocusedDate,o=e.state,i=e.setState,c=e.format;return ee.useEffect(function(){Z(t)&&t.length!==0&&(r||s(Z(t[0])?t[0][0]:t[0]))},[r,t,s]),Z(t)&&u.default.createElement("div",{style:{display:"flex",padding:"5px 0"}},u.default.createElement("select",{className:"rmdp-input",style:{height:"26px",width:"90%",margin:"auto"},value:(r==null?void 0:r.day)||"",onChange:function(a){return s(t.flat().find(function(g){return g.day.toString()===a.target.value}))}},t.flat().map(function(a){return u.default.createElement("option",{key:a.day,value:a.day},a.format(c))})));function s(a){i(q(q({},o),{},{focused:a})),l(a)}}function le(e,t){var r=arguments.length>2&&arguments[2]!==void 0?arguments[2]:"YYYY/MM/DD";return e instanceof J.default?e.set({calendar:t,format:r}):e=new J.default({date:e,calendar:t,format:r}),e}function fe(e,t){t===void 0&&(t={});var r=t.insertAt;if(e&&typeof document<"u"){var l=document.head||document.getElementsByTagName("head")[0],o=document.createElement("style");o.type="text/css",r==="top"&&l.firstChild?l.insertBefore(o,l.firstChild):l.appendChild(o),o.styleSheet?o.styleSheet.cssText=e:o.appendChild(document.createTextNode(e))}}fe(".rmdp-analog-clock{background-color:#83cbe7;border:5px solid #09589e;border-radius:50%;height:130px;margin:auto 20px;position:relative;width:130px}.bottom .rmdp-analog-clock,.top .rmdp-analog-clock{margin:20px auto}.rmdp-analog-clock .dot{background-color:#ccc;border-radius:50%;bottom:0;box-shadow:0 2px 4px -1px #000;height:8px;left:0;margin:auto;position:absolute;right:0;top:0;width:8px;z-index:10}.rmdp-analog-clock .rmdp-hour{background-color:#333;height:30px;top:35px;transform-origin:50% 30px;z-index:5}.rmdp-analog-clock .rmdp-hour,.rmdp-analog-clock .rmdp-minute{border-top-left-radius:50%;border-top-right-radius:50%;left:50%;margin-left:-2px;position:absolute;width:4px}.rmdp-analog-clock .rmdp-minute{background-color:#666;height:55px;top:14px;transform-origin:50% 52px;z-index:6}.rmdp-analog-clock .rmdp-second{background-color:#0074d9;border-top-left-radius:50%;border-top-right-radius:50%;height:60px;left:50%;margin-left:-1px;position:absolute;top:10px;transform-origin:50% 55px;width:2px;z-index:7}.rmdp-analog-clock span{color:#333;display:inline-block;font-family:Arial;font-size:16px;font-weight:700;position:absolute;z-index:4}.rmdp-analog-clock .rmdp-h12{left:50%;margin-left:-9px;top:10px}.rmdp-analog-clock .rmdp-h3{right:10px;top:58px}.rmdp-analog-clock .rmdp-h6{bottom:7px;left:50%;margin-left:-4px}.rmdp-analog-clock .rmdp-h9{left:10px;top:58px}.rmdp-analog-clock .dial-lines{background-color:#4ca6f5;height:5px;left:50%;margin-left:-1px;position:absolute;transform-origin:50% 65px;width:2px;z-index:2}.rmdp-analog-clock .dial-lines:nth-of-type(5n){background-color:#0074d9;height:8px;width:3px}@media (max-height:400px),(max-width:400px){.rmdp-analog-clock{height:100px;margin:20px 10px;width:100px}.rmdp-analog-clock .dial-lines{height:3px;transform-origin:50% 50px;width:1px}.rmdp-analog-clock .dial-lines:nth-of-type(5n){background-color:#0074d9;height:5px;width:2px}.rmdp-analog-clock span{font-size:12px;font-weight:400}.rmdp-analog-clock .rmdp-h12{top:6px}.rmdp-analog-clock .rmdp-h3{right:7px;top:41px}.rmdp-analog-clock .rmdp-h6{bottom:6px}.rmdp-analog-clock .rmdp-h9{left:7px;top:41px}.rmdp-analog-clock .rmdp-hour{height:20px;top:30px;transform-origin:50% 20px}.rmdp-analog-clock .rmdp-minute{height:28px;top:19px;transform-origin:50% 31px}.rmdp-analog-clock .rmdp-second{height:33px;top:16px;transform-origin:50% 35px}.rmdp-analog-clock .dot{box-shadow:0 2px 4px -1px #000;height:7px;width:7px}}");fe(".rmdp-time-picker.left div,.rmdp-time-picker.right div{margin:auto}.rmdp-time-picker{display:flex;padding:3px 0}.rmdp-time-picker.active{display:flex}.rmdp-time-picker div{align-items:center;display:flex;flex:1;flex-direction:column;margin-top:1px}.rmdp-time-picker div input{border:none;flex-grow:1;font-size:14px;padding:5px 2px;text-align:center;width:20px}.rmdp-time-picker div input::-webkit-inner-spin-button,.rmdp-time-picker div input::-webkit-outer-spin-button{-webkit-appearance:none}.rmdp-time-picker div input[type=number]{-moz-appearance:textfield}.rmdp-time-picker .dvdr{display:flex;flex-direction:column;justify-content:center;margin-top:-5px}.rmdp-time-picker div .rmdp-am{color:#000;font-size:13px;line-height:22px;margin-top:2px}.rmdp-only-time-picker{margin-bottom:0;width:220px}.rmdp-up i{margin-top:7px;transform:rotate(-135deg);-webkit-transform:rotate(-135deg)}.rmdp-down i{margin-top:3px;transform:rotate(45deg);-webkit-transform:rotate(45deg)}@media (max-height:400px),(max-width:400px){.rmdp-time-picker div input{font-size:12px}.rmdp-time-picker div .rmdp-am{font-size:12px;line-height:22px}}");var ce=function(e){return"rotate(".concat(e,"deg)")},se=[["hour","HH",24],["minute","mm",60],["second","ss",60]];function Ke(e){var t=e.max,r=e.name,l=Q(e.values,2),o=l[0],i=l[1],c=e.update,s=e.digits,a=e.hideDivider,g=e.step;return u.default.createElement(u.default.Fragment,null,u.default.createElement("div",null,u.default.createElement(ie,{direction:"rmdp-up",onClick:function(){return c(r,o+g)}}),u.default.createElement($e,{max:t,value:i,onChange:c,digits:s,name:r}),u.default.createElement(ie,{direction:"rmdp-down",onClick:function(){return c(r,o-g)}})),!a&&u.default.createElement("span",{className:"dvdr"},":"))}var Ve=ue.default=function(e){var t=e.state,r=e.setState,l=e.handleChange,o=e.handleFocusedDate,i=e.format,c=i===void 0?"YYYY/MM/DD":i,s=e.position,a=e.calendarProps.disableDayPicker,g=e.hideSeconds,E=e.hStep,m=E===void 0?1:E,A=e.mStep,_=A===void 0?1:A,y=e.sStep,M=y===void 0?1:y,O=e.minDate,p=e.maxDate,C=t.date,k=t.selectedDate,$=t.multiple,U=t.range,x=t.focused,N=($||U?x:k)||C,R=N.hour,I=N.minute,F=N.second,z={hour:30*R+.5*I,minute:6*I+.1*F,second:6*F},H=ee.useMemo(function(){return Array.from(Array(60).keys()).map(function(h){return u.default.createElement("div",{key:h,className:"dial-lines",style:{transform:ce(6*(h+1))}})})},[]),K=["3","6","9","12"].map(function(h,j){return u.default.createElement("span",{key:j,className:"rmdp-h"+h},h.replace(/[0-9]/g,function(S){return C.digits[S]}))});return u.default.createElement("div",{className:s,style:{display:"grid",minWidth:a?"180px":""}},u.default.createElement("div",{className:"rmdp-analog-clock"},u.default.createElement("div",{className:"dot"}),u.default.createElement("div",null,se.map(function(h,j){var S=Q(h,1)[0];return S==="second"&&g?null:u.default.createElement("div",{key:j,style:{transform:ce(z[S])},className:"rmdp-".concat(S)})})),u.default.createElement("div",null,K),u.default.createElement("div",null,H)),Array.isArray(k)&&u.default.createElement(He,{selectedDate:k,focused:x,handleFocusedDate:o,state:t,setState:r,format:c}),u.default.createElement("div",{style:{margin:"auto 0"}},u.default.createElement("div",{className:"rmdp-time-picker"},se.map(function(h,j){var S=Q(h,3),P=S[0],X=S[1],B=S[2];if(P==="second"&&g)return null;var Y=1;switch(P){case"hour":Y=m;break;case"minute":Y=_;break;case"second":Y=M}return u.default.createElement(Ke,{max:B,key:j,name:P,step:Y,values:V(P,X),update:W,digits:C.digits,hideDivider:P==="second"||P==="minute"&&g})}))));function V(h,j){return N[h]||(N[h]=0),[N[h],N.format(j)]}function W(h,j){var S=new J.default(N).set(h,j);O&&S<le(O,t.calendar,t.format)||p&&S>le(p,t.calendar,t.format)||(N[h]=j,l(k,q(q({},t),{},{selectedDate:k,focused:x})))}};function We(e){var o;const{authInfo:t}=de(),[r,l]=v.useState(null);return v.useEffect(()=>{var i,c,s;((s=(c=(i=t==null?void 0:t.auth)==null?void 0:i.roles)==null?void 0:c.filter(a=>a.title===ye))==null?void 0:s.length)===1&&l(xe(new Date).format("jYYYY/jMM/jDD - HH:mm"))},[t]),D("div",{children:[d("label",{children:e.title}),L(d("input",{className:"form-control sgh",disabled:e.className1,...e,name:e.inputKey})).if(e.type==be||e.type==ke),L(d("select",{...e,name:e.inputKey,children:(o=e.options)==null?void 0:o.map(i=>d("option",{value:i.key,children:i.title},i.key))})).if(e.type==Se),L(d("div",{children:d(we,{...e,onChange:i=>{e.onChange({target:{name:e.inputKey,value:i}})},dateSeparator:" , ",calendar:Ee,locale:_e,format:e.format||"YYYY/MM/DD - HH:mm",className:"datetime-picker",inputClass:"datetime-input",minDate:r,plugins:e.hideTime?[]:[d(Ve,{hideSeconds:!0})]})})).if(e.type==Ne),L(d("div",{children:d(Le,{...e,name:e.inputKey,freeInput:!1,permissions:["SERVICE.PERSONAL.SUBMIT"],include_external_base:!0})})).if(e.type==je)]})}function Xe({fields:e,onInputChange:t,mode:r,formState:l,clsssName1:o}){return d(Ce,{children:e==null?void 0:e.map(i=>L(v.createElement(We,{...i,className1:!!(o&&o[i.key]&&o[i.key]===!1),value:l[i.key],onChange:t,key:i.key,inputKey:i.key})).if(i.mode==null||i.mode==r))})}const ge="user-only",Ge="admin-only",Ze=(e={})=>{var B,Y,te;console.log(5);const{result:t}=ze(!0,"select",null),{mode:r=ge}=e,l=v.useState(e.initialValues||{}),o=v.useState({locations:[]}),[i,c]=v.useState({proj_code:!0,cost_center:!0}),s=Oe(),{type:a,submitted_by:g,mode:E,initialLocations:m,initialValues:A,className:_}=s.state||{},[y,M]=(e==null?void 0:e.externalState)!=null?e.externalState:l,{authInfo:O}=de();v.useEffect(()=>{M({...y,service:"taksisroys"})},[O]),v.useEffect(()=>{a==="update"&&M(A)},[a]),v.useEffect(()=>{},[y]);const[p,C]=(e==null?void 0:e.externalUserInput)!=null?e.externalUserInput:o;v.useEffect(()=>{},[p]);const{searchState:k,reverseGeocoding:$}=Ue(),{data:U}=Fe({include_inactive:!1}),x=v.useRef(),N=v.useRef(),R=v.useRef({polyline:null}),[I,F]=v.useState({readyForSubmit:!1});v.useEffect(()=>{z(p.locations)},[p]),v.useEffect(()=>{if(a===void 0&&e.initialLocations==null)return;const n=a&&a==="update"?m:e.initialLocations.map(({address:f,lat:w,lng:b})=>{var T;return{address:f,lat:w,lng:b,marker:(T=x.current)==null?void 0:T.addMarker(b,w,!0)}});C({...p,locations:n}),F({...I,readyForSubmit:n.length>1})},[]);const z=n=>{if(!(k.inProgress||x.current==null)){if(R.current.polyline!=null&&(x.current.remove(R.current.polyline.polyline),R.current.polyline=null),(n||p.locations).length>1){const f=x.current.addPolyline((n||p.locations).map(w=>[w.lng,w.lat]),!0,De);if(f==null)return;R.current.polyline=f}F({...I,readyForSubmit:n.length>1})}},H=()=>{if(k.inProgress||x.current==null)return;const n=x.current.addMarkerToCenter();if(n==null)return;const[f,w]=n.coordinates;$(w,f).then(b=>{C({...p,locations:[{address:b.formatted_address,lng:f,lat:w,marker:n.marker},...p.locations]})}).catch(b=>{var T;(T=x.current)==null||T.remove(n.marker)})},K=n=>{var b;const f=p.locations[n];(b=x.current)==null||b.remove(f.marker),p.locations.splice(n,1);const w=[...p.locations];C({...p,locations:w})},V=n=>{N.current=n},W=()=>{N.current.show()},h=()=>{N.current.hide()},j=()=>{p.locations.map(({marker:n})=>{var f;(f=x.current)==null||f.remove(n)}),C({...p,locations:[]}),z([])},S=n=>{console.log(1),n.preventDefault();const f=he(y,p,a,g);console.log(2,e.overrideOnSubmit,f,y._id),e.overrideOnSubmit!=null&&(e.overrideOnSubmit(f,y._id),h());const w=y._id==null?"submitRequest":"updateRequest";Ae()[w](f,y._id).then(({data:b})=>{console.log(320,b),ne.showSuccess("اطلاعات با موفقیت ذخیره شد"),M({}),j(),h(),e.submitCallback!=null&&e.submitCallback(b)}).catch(b=>{ne.showError(b.response.data.error)})},P=n=>{console.log(200,[n.target.name],n.target.value),n.target.name==="cost_center"&&(n.target.value!==void 0||n.target.value!=="")&&c({proj_code:!1,cost_center:!0}),n.target.name==="proj_code"&&(n.target.value!==void 0||n.target.value!=="")&&c({proj_code:!0,cost_center:!1}),n.target.name==="cost_center"&&(n.target.value===void 0||n.target.value==="")&&c({proj_code:!0,cost_center:!0}),n.target.name==="proj_code"&&(n.target.value===void 0||n.target.value==="")&&c({proj_code:!0,cost_center:!0}),M({...y,[n.target.name]:n.target.value})},X=n=>{var b,T;const[f,w]=(b=n==null?void 0:n.location)==null?void 0:b.coordinates;(T=x.current)==null||T.viewCoordinates(f,w,16)};return d("div",{className:"PassengerServiceRequest-page",children:D("div",{className:`main-div ${a==="update"?_:""}`,children:[d(Te,{mapRef:x}),d("img",{className:"absolute bottom-2/4 left-2/4 w-8 -translate-x-2/4",src:Ie}),d(Re,{mapRef:x,className:"absolute left-0 right-0 top-0 z-50 m-2 flex "}),d("div",{className:"showFavoriteLocation",children:(B=t==null?void 0:t.data)==null?void 0:B.map((n,f)=>d("div",{onClick:()=>X(n),className:"favorite-name",children:n.name},f))}),D("div",{className:"loc-name-div",children:[p.locations.map((n,f)=>d("div",{className:"loc-name",children:D("span",{children:[d("i",{className:"fa fa-remove loc-remove",onClick:()=>K(f)}),d("span",{children:n.address})]},`${n.lat}${n.lng}`)})),D("span",{className:"flex-center",children:[D("button",{onClick:H,className:"my-btn",children:[d("i",{className:"fas fa-thumbtack"})," انتخاب ایستگاه"]}),d("button",{onClick:W,className:re("m-2 flex h-14 w-14 cursor-pointer items-center justify-center rounded-full bg-success p-3 text-primary text-white shadow duration-300 active:saturate-50",{"scale-100":I.readyForSubmit,"scale-0":!I.readyForSubmit}),children:d(Me,{className:re("absolute p-0.5 text-white duration-200"),size:40})})]})]}),d(Ye,{onCreate:V,children:D("div",{children:[D("form",{children:[D("div",{className:"mb-2 disable-select",children:[d("label",{className:"inline-block py-2",children:"سرویس"}),D("select",{value:y.service||G,onChange:P,name:"service",className:"select-box w-full flex-1",children:[d("option",{disabled:!0,value:G,children:"--- سرویس مورد نظر را انتخاب کنید ---"},G),(Y=U==null?void 0:U.services)==null?void 0:Y.map(n=>d("option",{value:n.key,children:`${n.title}`},n.key))]})]}),i&&d(Xe,{formState:y,fields:(te=O==null?void 0:O.org)==null?void 0:te.additionalRequestFields,clsssName1:i,onInputChange:P,mode:r})]}),d(Pe,{onClick:S,className:"my-3 w-full",children:e.overrideOnSubmit!=null?"تایید":a&&a==="update"?"بروزرسانی":"ثبت درخواست"})]})})]})})};function he(e,t,r,l){const o={},{service:i,datetime:c,...s}=e;return console.log(414141,i,e),c!=null&&(o.gmt_for_date=Array.isArray(c)?c.map(a=>typeof a=="string"||a instanceof String?a:a.toDate().toISOString()):[c]),o.details=s,o.service=i,o.locations=t.locations.map(a=>{const{lng:g,lat:E,...m}=a;return delete m.marker,{coordinates:[E,g],wait:0,meta:m}}),o.type=r&&r==="update"?r:"",o.submitted_by=r&&r==="update"?l:"",o}const ct=Object.freeze(Object.defineProperty({__proto__:null,MODE_ADMIN_ONLY:Ge,MODE_USER_ONLY:ge,buildRequestBody:he,default:Ze},Symbol.toStringTag,{value:"Module"}));export{ge as M,Ze as P,Ve as _,Xe as a,he as b,Ge as c,ct as d};
