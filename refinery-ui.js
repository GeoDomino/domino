(()=>{
  const colors={green:'var(--green)',yellow:'var(--yellow)',orange:'var(--orange)',red:'var(--red)',unknown:'var(--unknown)'};
  const fmt=(v,d=1)=>typeof v==='number'?v.toLocaleString('de-DE',{minimumFractionDigits:d,maximumFractionDigits:d}):'–';
  async function load(){
    try{
      const r=await fetch('refinery.json?ts='+Date.now(),{cache:'no-store'}); if(!r.ok) throw 0;
      const x=await r.json();
      const light=document.getElementById('refLight');
      const date=document.getElementById('refDate');
      if(light){ light.style.background=colors[x.status]||colors.unknown; const s=light.querySelector('.statusword'); if(s) s.textContent=x.days_in_status??'–'; }
      if(date) date.style.display='none';
      const card=light?.closest('.card');
      const price=card?.querySelector('.price');
      if(price) price.textContent=x.status==='unknown'?'wartet auf Daten':(x.capacity_buffer_kbd!=null?fmt(x.capacity_buffer_kbd/1000,3)+' mb/d Puffer':'–');

      const details=[...document.querySelectorAll('.detailtitle')].find(n=>/Raffineriekapazität/.test(n.textContent||''));
      if(details){
        let node=details.nextElementSibling;
        while(node && !node.classList.contains('detailtitle')){ const next=node.nextElementSibling; node.remove(); node=next; }
        details.textContent='Raffineriekapazität · Version 2.0';
        const html=x.status==='unknown'
          ? '<div class="subrow"><div class="subleft"><span class="dot" style="background:var(--unknown)"></span>US-Raffineriedaten</div><div class="subright">wartet auf ersten Abruf</div></div><div style="margin-top:8px"><b style="color:var(--text)">Aktualisierung:</b> Die EIA veröffentlicht diese Raffineriedaten nur einmal wöchentlich. DOMINO prüft täglich, ob ein neuer Wochenwert vorliegt.</div>'
          : `<div class="subrow"><div class="subleft"><span class="dot" style="background:${colors[x.status]}"></span>US-Auslastung</div><div class="subright">${fmt(x.utilization_pct,1)} %</div></div><div class="subrow"><div class="subleft"><span class="dot" style="background:var(--green)"></span>Operable Kapazität</div><div class="subright">${fmt(x.operable_capacity_kbd/1000,3)} mb/d</div></div><div class="subrow"><div class="subleft"><span class="dot" style="background:${colors[x.status]}"></span>Kapazitätspuffer</div><div class="subright">${fmt(x.capacity_buffer_kbd/1000,3)} mb/d</div></div><div style="margin-top:8px"><b style="color:var(--text)">Datenstand:</b> ${x.source_date||'–'} · Quelle: U.S. EIA Weekly Inputs & Utilization.</div><div style="margin-top:8px"><b style="color:var(--text)">Aktualisierung:</b> Die EIA veröffentlicht diese Raffineriedaten nur einmal wöchentlich. DOMINO prüft täglich, ob ein neuer Wochenwert vorliegt.</div><div style="margin-top:8px">Raffineriekapazität misst Produktionsspielraum, nicht Produktknappheit. Hohe Auslastung bedeutet wenig Reserve zum Nachproduzieren.</div>`;
        details.insertAdjacentHTML('afterend',html);
      }
    }catch(e){}
  }
  document.readyState==='loading'?document.addEventListener('DOMContentLoaded',load):load();
})();
