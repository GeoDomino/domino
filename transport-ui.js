(()=>{
  const colors={green:'var(--green)',yellow:'var(--yellow)',orange:'var(--orange)',red:'var(--red)',unknown:'var(--unknown)'};
  const labels={green:'normal',yellow:'auffällig',orange:'stark gestört',red:'kritisch',unknown:'wartet'};
  const fmt=n=>typeof n==='number'?n.toLocaleString('de-DE',{maximumFractionDigits:1}):'–';
  const pct=n=>typeof n==='number'?(n*100).toLocaleString('de-DE',{maximumFractionDigits:0})+' %':'–';

  async function load(){
    let x;
    try{
      const r=await fetch('./transport.json?ts='+Date.now(),{cache:'no-store'});
      if(!r.ok) throw 0;
      x=await r.json();
    }catch(e){return}

    const lamp=document.getElementById('transportLight');
    const date=document.getElementById('transportDate');
    const card=lamp?.closest('.card');
    if(lamp){
      lamp.style.background=colors[x.status]||colors.unknown;
      const w=lamp.querySelector('.statusword');
      if(w) w.textContent=(x.days_in_status??'–');
    }
    if(card){
      const p=card.querySelector('.price');
      if(p) p.textContent=x.summary||labels[x.status]||'wartet';
    }
    if(date) date.textContent=x.days_in_status?`seit ${Math.max(0,x.days_in_status-1)} Tagen`:'–';

    const title=[...document.querySelectorAll('.detailtitle')].find(n=>/^Transport\s*·/i.test(n.textContent.trim()));
    if(!title) return;
    let n=title.nextElementSibling;
    while(n && !n.classList.contains('detailtitle')){
      if(n.classList.contains('subrow') || n.id==='transportLiveNote') n.style.display='none';
      n=n.nextElementSibling;
    }

    let box=document.getElementById('transportLiveRows');
    if(!box){
      box=document.createElement('div');
      box.id='transportLiveRows';
      title.insertAdjacentElement('afterend',box);
    }
    const c=x.components||{};
    const row=(k)=>{
      const d=c[k]||{};
      const right=(typeof d.count==='number')?`${fmt(d.count)} Schiffe · ${pct(d.ratio)} vom Normalwert`:'wartet auf Daten';
      return `<div class="subrow"><div class="subleft"><span class="dot" style="background:${colors[d.status]||colors.unknown}"></span>${d.label||k}</div><div class="subright">${right}</div></div>`;
    };
    box.innerHTML=row('hormuz')+row('bab_el_mandeb')+row('suez')+row('cape')+row('ais_dark')+
      `<div id="transportLiveNote" style="margin-top:8px"><b style="color:var(--text)">Transport Version 2.0:</b> Hormus, Bab el-Mandeb und Suez werden gegen ihren rollierenden Normalwert bewertet. Beim Kap gilt die umgekehrte Logik: deutlich mehr Verkehr kann auf Umleitungen hinweisen. Der Dark-Shipping-Radar vergleicht AIS-Lücken bei Tankern mit seinem 7-Tage-Basiswert. Quelle: IMF PortWatch über den offenen Straits-Datenfeed; AIS-Dark-Overlay: Straits.live. Letzter Datenstand: ${x.source_date||'–'}.</div>`;
  }
  document.readyState==='loading'?document.addEventListener('DOMContentLoaded',load):load();
  setInterval(load,60*60*1000);
})();
