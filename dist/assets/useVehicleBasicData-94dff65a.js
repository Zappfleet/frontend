import{r as a,h as u}from"./index-0b0339af.js";function f(t){const c=t==null?void 0:t.include_inactive,[i,n]=a.useState({});function e(){u().getBasicEntities(c).then(({data:s})=>{n(s)}).catch(console.log)}return a.useEffect(()=>{e()},[]),{data:i,refreshData:e}}export{f as u};