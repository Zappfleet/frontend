import{c as l,F as d,j as c,r}from"./index-4b638fea.js";const i=e=>l(d,{children:e.open&&l("div",{className:e.className?e.className:"ModalLayout-component",style:{zIndex:e.zIndex},children:l("div",{className:"modal-content modal-content2 ",children:c("div",{children:[l("i",{onClick:e.handle_close,className:"fa fa-close close-icon"}),e.renderContent(e.data)]})})})}),m=()=>{const[e,o]=r.useState({open:!1});return{...e,handle_toggle:()=>o({...e,open:!e.open}),handle_open:s=>o({...e,open:!0,data:s}),handle_close:()=>o({...e,open:!1})}};const u=e=>{const o=m();return{ui:l(i,{...o,mode:"center",className:e,renderContent:n=>n?c("div",{className:"useConfirmModal-component",children:[l("label",{children:n.title}),l("p",{children:n.desc}),c("div",{children:[l("button",{className:"my-btn",onClick:s=>{n.onConfirm(s),o.handle_close()},children:n.label_confirm}),l("button",{className:"my-btn",onClick:o.handle_close,children:n.label_cancel})]})]}):""}),show:n=>{o.handle_open(n)}}};export{i as M,m as a,u};
