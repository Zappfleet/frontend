import{r as F,b as n,h as I,j as u,_ as q,F as P,H as G,ae as J,af as Q,x as A,f as y}from"./index-a6150745.js";import{a as X,b as Y}from"./index.esm-e143600b.js";import{u as Z}from"./useRoles-638b8077.js";import{u as ee}from"./useConfirmModal-06992f97.js";const te=s=>{const[h,N]=F.useState({}),o=r=>{if(h[r.id]!=!0)N({...h,[r.id]:!0});else{const c={...h};delete c[r.id],N(c)}};function a(r,c,g){var b;return n("ul",{className:I("overflow-hidden",{"pr-6":!c,"max-h-0":!g,"max-h-screen":g}),children:(b=r.children)==null?void 0:b.map(i=>{var E;const x=((E=i.children)==null?void 0:E.length)>=1,k=h[i.id]==!0,S=x===!0,p=k?n(X,{onClick:()=>o(i),size:30,className:"px-2 cursor-pointer"}):n(Y,{onClick:()=>o(i),size:30,className:"px-2 cursor-pointer"});return u("li",{children:[u("div",{className:I("flex items-center",{"mr-7.5":!x}),children:[x&&p,n("input",{id:s.checkboxId(i.id),onChange:_=>s.handle_checkChange(_,i),type:"checkbox","aria-expanded":S,className:"ml-2"}),n("label",{className:"inline-block p-1",children:i.title})]}),i.children&&a(i,!1,k)]},i.id)})})}return s.data&&a(s.data,!0,!0)},R={inputActive:!1,inputValue:"",activeEditModeFor:null},ae=()=>{var M;const{data:s,refreshRoles:h}=Z(),N=z("",s.permissions),[o,a]=F.useState(R),[r,c]=F.useState(null),{show:g,ui:b}=ee(null);function i(){if(r==null)return;const e=r.id;c(null),k(e,null)}function x(){const e=o.inputValue,t=o.activeEditModeFor;a(R),e.trim().length!=0&&k(t,e)}function k(e,t){const l={permissions:$(),auto_assign_rules:[]};t!=null&&(l.title=t.trim()),A().editRole(e,l).then(({data:m})=>{y.showSuccess("نقش با موفقیت ویرایش شد"),h()}).catch(m=>{y.showError(m.message)})}function S(){const e=o.inputValue;if(a(R),e.trim().length==0)return;const t={title:e.trim(),permissions:$(),auto_assign_rules:[]};A().createRole(t).then(({data:l})=>{y.showSuccess("نقش جدید ایجاد شد"),h()}).catch(l=>{y.showError(l.message)})}function p(e){return`roles_${e}`}function E(e){D(e),a({...o,inputValue:e.title,activeEditModeFor:e.id})}function _(e){A().deactiveRole(e.id).then(({data:t})=>{y.showSuccess("نقش مورد نظر حذف گردید"),h()}).catch(t=>{y.showError(t.message)})}function L(e){g({title:"حذف نقش",desc:`آیا از حذف نقش ${e.title} اطمینان دارید?`,label_confirm:"حذف کن!",label_cancel:"خیر",onConfirm:()=>_(e)})}function W(){B(),a({...o,inputActive:!0})}function V(e,t){const l=document.getElementById(p(t.id)),m=l==null?void 0:l.checked,T=document.querySelectorAll(`[id^="${p(t.id)}."]`);for(let v=0;v<T.length;v++){const f=T[v];f.indeterminate=!1,f.checked=m}const C=t.id.split(".");C.pop();do{const v=document.querySelectorAll(`[id^="${p(C.join("."))}."]`),f=[];for(let d=0;d<v.length;d++){const H=v[d];f.push(H.checked)}const j=f.some(d=>d==!1),K=f.some(d=>d==!0),O=f.every(d=>d==!1),U=f.every(d=>d==!0),w=document.getElementById(`${p(C.join("."))}`);w!=null&&(j&&K?w.indeterminate=j:w.indeterminate=!1,U&&(w.checked=!0),O&&(w.checked=!1)),C.pop()}while(C.length>0)}function $(){const e=[],t=document.querySelectorAll(`[id^="${p("")}"]`);for(let l=0;l<t.length;l++){const m=t[l];m.checked&&e.push(m.id.split("roles_")[1])}return e}function B(){const e=document.querySelectorAll(`[id^="${p("")}"]`);for(let t=0;t<e.length;t++){const l=e[t];l.checked=!1}}function D(e){B(),c(e),e.permissions.map(t=>{const l=document.getElementById(`${p(t)}`);l.getAttribute("aria-expanded")!=="true"&&(l.checked=!0),V(null,{id:t})})}return u("div",{className:"RoleActions-component",children:[u("div",{className:"row",children:[n("div",{className:"col-12 col-md-4",children:u("div",{className:"right",children:[u("table",{className:"w-full border-l border-gray-4",children:[n("thead",{className:"border-b border-gray-4",children:n("tr",{children:n("th",{colSpan:2,className:"px-2 pb-2 pt-4 text-center text-sm",children:n("button",{onClick:W,className:" border-px mx-6 rounded-md border-primary bg-primary px-6 py-1 text-white dark:border-boxdark",children:"ایجاد نقش جدید"})})})}),n("tbody",{children:(M=s==null?void 0:s.roles)==null?void 0:M.map(e=>o.activeEditModeFor==e.id?n("tr",{children:n("td",{colSpan:2,children:u("div",{className:"relative",children:[n("input",{onKeyDown:t=>{t.key==="Enter"&&(t.preventDefault(),x())},autoFocus:!0,onChange:t=>a({...o,inputValue:t.target.value}),value:o.inputValue,className:"w-full border-2 border-primary py-3 pl-14 pr-3 outline-none"}),n(q,{onClick:x,className:"absolute left-3 top-1/2 -translate-y-1/2 cursor-pointer text-4xl hover:text-success"})]})})}):u("tr",{onClick:()=>D(e),className:I({"cursor-pointer hover:bg-gray-2":(r==null?void 0:r.id)!=e.id,"cursor-pointer bg-gray-4":(r==null?void 0:r.id)==e.id}),children:[n("td",{className:"text-md p-3",children:e.title}),n("td",{className:"flex justify-end p-3 text-left",children:e.is_static==!1&&u(P,{children:[n(G,{onClick:()=>E(e),size:30,className:"mx-1 cursor-pointer rounded-full p-1.5 hover:bg-gray-4"}),n(J,{onClick:()=>L(e),size:30,className:"mx-1 cursor-pointer rounded-full p-1.5 hover:bg-gray-4 hover:text-danger"})]})})]},e._id))})]}),o.inputActive&&u("div",{className:"relative",children:[n("input",{onBlur:()=>{S(),a(R)},onKeyDown:e=>{e.key==="Enter"&&(e.preventDefault(),S())},autoFocus:!0,onChange:e=>a({...o,inputValue:e.target.value}),value:o.inputValue,className:"w-full border-2 border-primary py-3 pl-14 pr-3 outline-none"}),n(q,{className:"absolute left-3 top-1/2 -translate-y-1/2 cursor-pointer text-4xl hover:text-success"})]})]})}),n("div",{className:"col-12 col-md-8",children:u("div",{className:"left",children:[n("div",{className:"border-b border-gray-4 px-2 pb-2 pt-4 text-right text-sm",children:n("button",{onClick:i,className:"border-px rounded-md border-primary bg-white px-6 py-1 text-primary hover:bg-gray dark:border-boxdark",children:"ذخیره"})}),n("div",{className:"p-3",children:n(te,{checkboxId:p,handle_checkChange:V,data:{children:N}})})]})})]}),b]})};function z(s,h){return Object.entries(h).map(a=>{const[r,c]=a,g=typeof c=="string"||c instanceof String,b=s==""?r:`${s}.${r}`;return{id:b,title:Q(r),children:g?null:z(b,c)}})}export{ae as default};
