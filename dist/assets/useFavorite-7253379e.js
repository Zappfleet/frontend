import{r as n,y as i}from"./index-4b638fea.js";function h(c,u,s){const[f,o]=n.useState(null),[p,a]=n.useState(null),[r,t]=n.useState({in_progress:!1});async function l(){switch(u){case"select":t({...r,in_progress:!0}),i().select_FavoriteLocation().then(e=>{o(e),a("select")}).catch(e=>{console.error(6001,"Error fetching Favorite list:",e)}).finally(()=>{t({...r,in_progress:!1})});break;case"insert":s!==null&&(t({...r,in_progress:!0}),i().insert_FavoriteLocation(s).then(e=>{o(e),a("insert")}).catch(e=>{console.error(6001,"Error fetching Favorite list:",e)}).finally(()=>{t({...r,in_progress:!1})}));break;case"update":console.log(41,s),s!==null&&(t({...r,in_progress:!0}),i().update_FavoriteLocation(s).then(e=>{o(e),a("update")}).catch(e=>{console.error(6001,"Error fetching Favorite list:",e)}).finally(()=>{t({...r,in_progress:!1})}));break;case"delete":t({...r,in_progress:!0}),i().delete_FavoriteLocation(s._id).then(e=>{o(e),a("delete")}).catch(e=>{console.error(6001,"Error fetching Favorite list:",e)}).finally(()=>{t({...r,in_progress:!1})});break}}return n.useEffect(()=>{l()},[c]),{result:f,state:r,type:p,refreshData:l}}export{h as u};
