import{r as t,c as s,j as r,k as m,aD as n}from"./index-0b0339af.js";const p=l=>{const[o,a]=t.useState({show:!1}),e=t.useRef(),i=()=>{a({...o,show:!0})},c=()=>{a({...o,show:!1})},d=()=>{e.current.scrollTop=e.current.scrollHeight};t.useEffect(()=>{e.current.scrollTop=0;const u={show:i,hide:c,scrollToMax:d};l.onCreate&&l.onCreate(u)},[]);const h=()=>{e.current.scrollTop==0&&c()};return t.useEffect(()=>{o.show?e.current.scrollTop=e.current.scrollHeight:e.current.scrollTop=0},[o]),s("div",{children:r("div",{ref:e,onScroll:h,style:{zIndex:1e6,scrollBehavior:"smooth",pointerEvents:o.show?"auto":"none"},className:"fixed left-0 top-0 bottom-0 right-0 overflow-y-scroll scroller hidden-thumb lg:mr-72",children:[s("div",{className:m("fixed left-0 top-0 bottom-0 right-0 bg-boxdark duration-300",{"opacity-70":o.show,"opacity-0":!o.show})}),s("div",{className:"h-full"}),r("div",{className:"relative bg-white dark:bg-boxdark py-1 rounded-tr-2xl rounded-tl-2xl",children:[r("div",{className:"flex justify-between px-2",children:[r("span",{className:"opacity-0 pointer-events-none",children:[s(n,{size:30})," "]}),s("span",{className:"h-1 w-20 bg-gray-4 rounded-lg my-1 lg:hidden"}),s("span",{className:"cursor-pointer",children:s(n,{onClick:c,size:30})})]}),s("div",{className:"m-2",children:l.children})]})]})})};export{p as B};