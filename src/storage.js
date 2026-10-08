export const ld=(k,d)=>{try{const v=JSON.parse(localStorage.getItem(k));return v==null?d:v}catch(e){return d}};
export const sv=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}};
