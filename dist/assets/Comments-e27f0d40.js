import{r as i,c as e,j as n,F as j}from"./index-4b638fea.js";import{e as S,c as w}from"./comments-4f6f4135.js";const E=r=>{const[d,N]=i.useState("good"),[v,b]=i.useState(-1),[o,x]=i.useState(),[C,f]=i.useState(""),h=r.registerRole,g=(t,a,l)=>{let s={type:a.type,value:l};x(c=>(c==null?void 0:c.some(u=>u.value===l))?c.filter(u=>u.value!==l):c?[...c,s]:[s])},y=()=>{r.saveComment({role:h,registerID:r.registerID,comments:o,emojiID:v,customComment:C})},k=()=>{var l;const t=(l=w)==null?void 0:l.filter(s=>s.role===h&&s.type===d);return t&&t[0].value.map((s,c)=>e("div",{className:`col-6  ${c%2===0?"flex-end":"flex-start"}`,children:e("div",{onClick:m=>g(m,t[0],s),className:`comment-div ${o!=null&&o.some(m=>m.value===s)?"selected-item-div":""}`,children:s})},c))};return e("div",{className:"Comments-component",children:h&&n(j,{children:[e("div",{className:"row flex-center",children:n("div",{className:"col-12 title-div",children:[e("p",{className:"cmd-title",children:"میزان رضایت"}),e("ul",{children:S.map((t,a)=>n("li",{className:`${v===t.key?"selectedEmoji":""}`,onClick:()=>b(t.key),children:[" ",e("i",{className:t.icon})]},a))})]})}),n("div",{className:"row",children:[e("div",{className:"col-6 flex-end",children:e("button",{className:`${d==="good"?"good-btn":""} my-btn  cmd-btn`,onClick:()=>N("good"),children:"نکات مثبت"})}),e("div",{className:"col-6 flex-start",children:e("button",{className:`${d==="bad"?"bad-btn":""} my-btn  cmd-btn`,onClick:()=>N("bad"),children:"نکات منفی"})})]}),e("div",{className:"row",children:k()}),e("div",{className:"row",children:e("div",{className:"col-12",children:e("div",{className:"text",children:e("textarea",{value:C,onChange:t=>f(t.target.value),className:"form-control",rows:5,id:"comment"})})})}),e("div",{className:"row",children:e("div",{className:"col-12 flex-center",children:n("button",{onClick:y,className:"my-btn regist-btn",children:[" ","ثبت نظر"]})})})]})})},I=E;export{I as C};