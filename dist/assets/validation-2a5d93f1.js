import{r as f}from"./index-0b0339af.js";function w(r,a){const[h,d]=f.useState({});function c(o,i){return i.split(".").reduce((n,t)=>n&&n[t],o)}function s(){const o={};for(const i in r){const n=[],t=r[i],e=c(a,i);for(const m in t)switch(m){case"required":(e===""||e===void 0||e===null||typeof e=="string"&&e.trim()==="")&&n.push(`فیلد ${(t==null?void 0:t.showName)||i} الزامی می‌باشد`);break;case"min":e!=null&&e!==""&&e.length<(t==null?void 0:t.min)&&n.push(`مقدار ${(t==null?void 0:t.showName)||i} نباید کمتر از ${t==null?void 0:t.min} باشد`);break;case"pattern":e!=null&&e!==""&&t.pattern&&!t.pattern.test(e)&&n.push(`فرمت ${(t==null?void 0:t.showName)||i} صحیح نمی‌باشد`);break;case"match":e!=null&&e!==""&&e!==c(a,t==null?void 0:t.matchField)&&n.push(`فیلد ${(t==null?void 0:t.showName)||i} باید با ${t==null?void 0:t.matchField} مطابقت داشته باشد`);break}n.length>0&&(o[i]=n)}d(o)}return f.useEffect(()=>{s()},[a]),{errors:h,refreshData:s}}export{w as u};
