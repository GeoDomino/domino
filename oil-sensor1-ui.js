(()=>{
  const target=document.getElementById('oilComponents');
  if(!target)return;
  const COLORS={green:'#31d158',yellow:'#ffd60a',orange:'#ff9f0a',red:'#ff453a',unknown:'#6b7280'};
  const LABELS={green:'GRÜN',yellow:'GELB',orange:'ORANGE',red:'ROT',unknown:'WARTET'};
  function shell(){
    if(target.querySelector('[data-oil-sensor1-note]'))return target.querySelector('[data-oil-sensor1-note]');
    const el=document.createElement('div'); el.className='rule'; el.setAttribute('data-oil-sensor1-note','');
    el.innerHTML='<b>Sensor 1 Ölversorgung · Angebot/Nachfrage-Balance <span id="oilSensor1Light" aria-label="Sensorstatus" style="display:inline-block;width:12px;height:12px;border-radius:50%;background:#6b7280;box-shadow:0 0 7px rgba(107,114,128,.55);margin-left:5px;vertical-align:1px"></span></b><br><span style="color:var(--muted)">(Global Supply–Demand Balance)</span><br><span id="oilSensor1Result" style="font-weight:700">WARTET</span><br>Misst, ob die weltweite Ölproduktion den weltweiten Verbrauch deckt oder ob ein Defizit bzw. Überschuss in Mio. Barrel pro Tag entsteht.<br><span style="color:var(--muted)">Quelle: U.S. EIA Short-Term Energy Outlook (STEO). Der STEO wird monatlich veröffentlicht; der angezeigte Wert ist daher kein Tagesmesswert.</span><br><br><b>DOMINO-Schwellen:</b> 🟢 Defizit &lt;0,5 mb/d · 🟡 0,5–&lt;1,5 · 🟠 1,5–&lt;5,0 · 🔴 ab 5,0 mb/d.';
    target.insertAdjacentElement('afterbegin',el); return el;
  }
  function paint(data){
    const c=data&&data.components&&data.components.supply_demand_balance||{};
    const s=COLORS[c.status]?c.status:'unknown';
    const light=document.getElementById('oilSensor1Light'), result=document.getElementById('oilSensor1Result');
    if(light){light.style.background=COLORS[s];light.style.boxShadow=`0 0 8px ${COLORS[s]}aa`;light.title=LABELS[s];}
    if(result){const v=Number(c.value);result.textContent=Number.isFinite(v)?`${LABELS[s]} · ${v>0?'+':''}${v.toFixed(2)} mb/d · ${c.period||c.date||''}`:LABELS[s];}
  }
  shell();
  fetch('oil-supply.json?ts='+Date.now(),{cache:'no-store'}).then(r=>r.json()).then(paint).catch(()=>paint(null));
  new MutationObserver(()=>requestAnimationFrame(shell)).observe(target,{childList:true,subtree:true});
})();
