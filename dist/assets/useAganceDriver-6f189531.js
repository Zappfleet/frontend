import{r as a,x as c}from"./index-a6150745.js";function p(o,t){const[u,n]=a.useState(null),[f,l]=a.useState(null),[r,s]=a.useState({in_progress:!1});function i(){switch(o){case"select":s({...r,in_progress:!0}),c().select_AganceDriver().then(e=>{n(e),l("select")}).catch(e=>{console.error(6001,"Error fetching list:",e)}).finally(()=>{s({...r,in_progress:!1})});break;case"insert":t!==null&&(console.log(78588888,t),s({...r,in_progress:!0}),c().insert_AganceDriver(t).then(e=>{n(e),l("insert")}).catch(e=>{console.error(6001,"Error fetching list:",e)}).finally(()=>{s({...r,in_progress:!1})}));break;case"update":t!==null&&(s({...r,in_progress:!0}),c().update_AganceDriver(t).then(e=>{n(e),l("update")}).catch(e=>{console.error(6001,"Error fetching list:",e)}).finally(()=>{s({...r,in_progress:!1})}));break;case"delete":s({...r,in_progress:!0}),c().delete_AganceDriver(t._id).then(e=>{n(e),l("delete")}).catch(e=>{console.error(6001,"Error fetching list:",e)}).finally(()=>{s({...r,in_progress:!1})});break}}return a.useEffect(()=>{o&&i()},[o]),{result:u,type:f,state:r,refreshData:i}}export{p as u};
