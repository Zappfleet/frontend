import{r,y as c}from"./index-4b638fea.js";function h(l,i,n){const[u,o]=r.useState(null),[s,t]=r.useState({in_progress:!1});function a(){switch(l){case"insert":t({...s,in_progress:!0}),c().insertRestrictionShowRequests(i,n).then(e=>{o(e.data)}).catch(e=>{console.error(6001,"Error fetching mission list:",e)}).finally(()=>{t({...s,in_progress:!1})});break;case"select":t({...s,in_progress:!0}),c().selectRestrictionShowRequests(i,n).then(e=>{o(e.data)}).catch(e=>{console.error(6001,"Error fetching mission list:",e)}).finally(()=>{t({...s,in_progress:!1})});break}}return r.useEffect(()=>{a()},[]),{result:u,state:s,refreshData:a}}export{h as u};