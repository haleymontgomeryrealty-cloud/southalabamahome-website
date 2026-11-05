(()=>{
 'use strict';
 const FORM='263067043487057';
 const KEY='montgomery-home-search-v1';
 const storage={read(){try{return JSON.parse(localStorage.getItem(KEY))||{viewed:[],registered:false}}catch{return{viewed:[],registered:false}}},write(state){try{localStorage.setItem(KEY,JSON.stringify(state))}catch{/* A browser with storage disabled still has call/form access. */}}};
 let state=storage.read();if(!Array.isArray(state.viewed))state.viewed=[];
 const dialog=document.createElement('dialog');dialog.className='stewart-dialog';dialog.setAttribute('aria-labelledby','stewart-title');
 dialog.innerHTML='<button type="button" class="stewart-close" aria-label="Close Stewart">×</button><div class="eyebrow">Montgomery & Co. · Virtual assistant</div><h2 id="stewart-title">Hi, I’m Stewart.</h2><p id="stewart-intro">I can help you take the next step with Haley. What brings you here today?</p><div class="stewart-options"><button type="button" data-intent="buy">Buying a home</button><button type="button" data-intent="sell">Selling a home</button><button type="button" data-intent="property">Property questions</button><button type="button" data-intent="call">Ask Haley to call</button></div><div class="stewart-answer" id="stewart-answer" aria-live="polite"><p>This guided website assistant uses prepared answers. To send Haley a message, use the form or text her.</p><p>Email: <a href="mailto:haleymontgomery.realty@gmail.com">haleymontgomery.realty@gmail.com</a></p><div class="stewart-options"><a class="accent" href="sms:+12513080016">Text (251) 308-0016</a><a href="tel:+12513080016">Call Haley</a></div></div>';
 document.body.append(dialog);
 let returnFocus=null;
 function open(gate=false){returnFocus=document.activeElement;document.getElementById('stewart-title').textContent=gate?'Make your search more personal.':'Hi, I’m Stewart.';document.getElementById('stewart-intro').textContent=gate?'You’ve opened two properties. Please register before opening more, so Haley can help you get the details you want about homes that fit your search.':'I can help you take the next step with Haley. What brings you here today?';if(gate)document.getElementById('stewart-answer').innerHTML='<p>Tell us your budget, areas, and home preferences. This makes it easier to get you useful information about the properties you like.</p><div class="stewart-options"><a class="accent" href="/register.html">Register your home search</a><a href="sms:+12513080016">Ask Haley a question</a></div>';if(!dialog.open)dialog.showModal()}
 function close(){dialog.close();returnFocus?.focus()}
 dialog.querySelector('.stewart-close').onclick=close;
 dialog.addEventListener('cancel',()=>returnFocus?.focus());
 document.addEventListener('click',event=>{
  const chat=event.target.closest('[data-stewart-chat]');if(chat){event.preventDefault();open();return}
  const link=event.target.closest('a[data-property-id]');if(!link)return;
  const id=link.dataset.propertyId;
  if(!state.registered&&!state.viewed.includes(id)&&state.viewed.length>=2){event.preventDefault();open(true);return}
  if(!state.viewed.includes(id)){state.viewed.push(id);storage.write(state)}
  if(!state.registered&&state.viewed.length===2)setTimeout(()=>open(true),0);
 });
 const answers={buy:'Share your budget, preferred areas, bedrooms, and timing in the home-search form. Haley can use those details to help you explore your options.',sell:'Haley works with South Alabama sellers. Text her your property address and what you’d like to discuss, or ask for a call. She can talk through your next steps.',property:'Send Haley the address or property link and your question. She can confirm availability and help with details. Live listings are not connected to this website yet.',call:'Would you like Haley to give you a call? Use the form to share your number and preferred time, or text your request. A time is not booked until Haley confirms it.'};
 dialog.querySelectorAll('[data-intent]').forEach(button=>button.onclick=()=>{const el=document.getElementById('stewart-answer');el.replaceChildren();const p=document.createElement('p');p.textContent=answers[button.dataset.intent];const links=document.createElement('div');links.className='stewart-options';links.innerHTML='<a class="accent" href="/register.html">Share your preferences / request a call</a><a href="sms:+12513080016">Text Stewart & Haley</a><a href="mailto:haleymontgomery.realty@gmail.com">Email haleymontgomery.realty@gmail.com</a>';el.append(p,links)});
 window.addEventListener('message',event=>{
  const frame=document.getElementById('buyer-form');if(!frame||event.source!==frame.contentWindow||event.origin!=='https://form.jotform.com')return;
  let data=event.data;if(typeof data==='string'){try{data=JSON.parse(data)}catch{return}}
  if(data?.action==='submission-completed'&&String(data.formID||data.formId)===FORM){state.registered=true;storage.write(state)}
 });
 const preview=document.getElementById('schedule-state');if(preview)preview.onchange=()=>{document.getElementById('schedule-result').textContent=preview.value==='active'?'Next channel check: every 15 minutes, until the conversation ends or there is no response for 30 minutes. This preview does not change the saved monitor.':'Next channel check: hourly. This preview does not change the saved monitor.'};
})();
