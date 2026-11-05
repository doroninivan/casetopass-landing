'use strict';
(()=>{
 const id=new URLSearchParams(location.hash.slice(1)).get('withdraw');
 if(!/^[a-f0-9]{64}$/.test(id||''))return;
 const section=document.getElementById('withdrawSection'),button=document.getElementById('withdrawButton'),status=document.getElementById('withdrawStatus');
 section.hidden=false;const endpoint=section.dataset.endpoint;
 if(!endpoint){button.disabled=true;status.textContent='Приёмник заявок пока не опубликован.';return;}
 button.onclick=async()=>{
  button.disabled=true;status.textContent='Удаляем заявку…';
  const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),15000);
  try{const response=await fetch(endpoint,{method:'DELETE',headers:{'Content-Type':'application/json'},body:JSON.stringify({receipt:id}),credentials:'omit',referrerPolicy:'no-referrer',signal:controller.signal}),data=await response.json();if(!response.ok||data.deleted!==true)throw Error();status.textContent='Заявка удалена.';history.replaceState(null,'',location.pathname);}
  catch{status.textContent='Не удалось подтвердить удаление. Проверьте соединение и попробуйте ещё раз.';button.disabled=false;}
  finally{clearTimeout(timer);}
 };
})();
