import{r as y,j as d,c as t,i as g,S as R}from"./index-4b638fea.js";import{u as v,g as b}from"./useNeshanApi-69a62daf.js";import{r as p}from"./renderUi-10abc2ba.js";const A=o=>{var h;const{searchState:r,searchAddress:f,clearAddressSearch:c}=v(),l=y.useRef(),m=e=>{if(e.target.value.trim().length==0){c();return}const n=o.mapRef.current.getCenterLonLat();f(e.target.value,n[1],n[0])},i=e=>{c(),o.mapRef.current.viewCoordinates(e.location.x,e.location.y,16)},u=r.inProgress||r.searchResult!=null;return d("div",{className:"LocationSearch-component flex-center",children:[t("input",{onChange:m,className:"map-btn",placeholder:"جستجوی نقشه ...",onKeyDown:function(e){e.code=="ArrowDown"&&r.searchResult!=null&&r.searchResult.length>0&&l.current.children[0].focus()}}),d("div",{className:g("loc-search-result duration-300 absolute top-12 left-1 right-1 rounded bg-white p-1",{"opacity-100 -translate-y-0 pointer-events-auto":u,"opacity-0 -translate-y-2 pointer-events-none":!u}),children:[p(t(R,{})).if(r.inProgress),p(t("div",{children:"هیچ مکانی پیدا نشد!"})).if(r.searchResult!=null&&r.searchResult.length==0),t("ul",{ref:l,className:g("duration-300 ",{"opacity-0":r.searchResult==null,"opacity-100":r.searchResult!=null}),children:(h=r.searchResult)==null?void 0:h.map((e,n)=>{if(!(n>10))return t("li",{tabIndex:0,onKeyDown:function(s){const a=s.target;s.code=="Enter"&&i(e),s.code=="ArrowDown"&&a.nextSibling&&a.nextSibling.focus(),s.code=="ArrowUp"&&a.previousSibling&&a.previousSibling.focus()},onClick:()=>i(e),className:"p-2 cursor-pointer outline-none focus:bg-gray-4 hover:bg-gray-4 active:bg-gray-4",children:b(e)},`${e.title}${e.location.x}${e.location.y}`)})})]})]})};export{A as L};
