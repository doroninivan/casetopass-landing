'use strict';
// The endpoint is public configuration; email never enters browser storage or analytics.
(()=>{
 const form=document.getElementById('pilotForm');if(!form)return;
 const status=document.getElementById('pilotStatus'),button=form.querySelector('button[type=submit]'),email=form.elements.email;
 const endpoint=form.dataset.endpoint;
 function message(text,error=false){status.textContent=text;status.dataset.error=String(error);}
 if(!endpoint){button.disabled=true;message('Приём заявок пока не открыт. Кейс выше уже можно попробовать.');return;}
 let busy=false;
 form.addEventListener('submit',async event=>{
  event.preventDefault();if(busy||!form.reportValidity())return;
  busy=true;button.disabled=true;button.textContent='Отправляем заявку…';email.removeAttribute('aria-invalid');message('');
  const controller=new AbortController(),timeout=setTimeout(()=>controller.abort(),15000);
  try{
   const response=await fetch(endpoint,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email:email.value.trim(),consent:form.elements.consent.checked,website:form.elements.website.value,source:'casetopass-pilot-v1'}),signal:controller.signal,credentials:'omit',referrerPolicy:'no-referrer'});
   const data=await response.json().catch(()=>null);
   if(!response.ok||data?.accepted!==true)throw new Error(response.status===429?'rate':'submit');
   form.reset();message('Заявка сохранена. Мы напишем на указанный email, когда начнётся пилот.');
   if(typeof data.receipt==='string'&&/^[a-f0-9]{64}$/.test(data.receipt)){
    const link=document.createElement('a');link.href='privacy.html#withdraw='+data.receipt;link.textContent='Ссылка для удаления заявки';
    status.append(document.createElement('br'),link,document.createTextNode('. Сохраните её, если захотите удалить заявку позже.'));
   }
  }catch(error){message(error.message==='rate'?'Слишком много попыток. Попробуйте отправить заявку позже.':'Не удалось подтвердить сохранение заявки. Проверьте соединение и попробуйте ещё раз.',true);}
  finally{clearTimeout(timeout);busy=false;button.disabled=false;button.textContent='Хочу пройти пилот';}
 });
})();
