import{r as s,u as n,a6 as u,c as e,aZ as c}from"./index-4b638fea.js";import{M as f}from"./MissionHistory-15f7f5de.js";import"./useItemSetToggle-3f1f039f.js";import"./renderUi-10abc2ba.js";import"./comments-4f6f4135.js";function d(){const[r,i]=s.useState(null),[o,a]=s.useState(!1),{authInfo:t}=n();return s.useEffect(()=>{t&&(t.auth.roles[0].title===u&&a(!0),i(!0))},[t]),e("div",{className:"DriverMissionHistory-component",children:r&&e(f,{mode:o===!0?c:"",status:"",paging:!1})})}export{d as default};