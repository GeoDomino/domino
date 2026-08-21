(()=>{
  const colors={green:'var(--green)',yellow:'var(--yellow)',orange:'var(--orange)',red:'var(--red)',unknown:'var(--unknown)'};
  const labels={green:'normal',yellow:'auffällig',orange:'stark gestört',red:'kritisch',unknown:'wartet'};
  const fmt=n=>typeof n==='number'?n.toLocaleString('de-DE',{maximumFractionDigits:1}):'–';
  const pct=n=>typeof n==='number'?(n*100).toLocaleString('de-DE',{maximumFractionDigits:0})+' %':'–';
  async function load(){
    let x; try{const r=await fetch('./transport.json?ts='+Date.now(),{cache:'no-store'});if(!r.ok)throw 0;x=await r.json()}catch(e){return}
    const lamp=document.getElementById('transportLight'),date=document.getElementById('transportDate'),card=lamp?.closest('.card');
    if(lamp){lamp.style.background=colors[x.status]||colors.unknown;const w=lamp.querySelector('.statusword');if(w)w.textContent=(x.days_in_status??'–')}
    if(card){const p=card.querySelector('.price');if(p)p.textContent=x.summary||labels[x.status]||'wartet'}
    if(date)date.textContent=x.days_in_status?`seit ${Math.max(0,x.days_in_status-1)} Tagen`:'–';
    const title=[...document.querySelectorAll('.detailtitle')].find(n=>/^Transport\s*·/i.test(n.textContent.trim()));if(!title)return;
    let n=title.nextElementSibling;while(n&&!n.classList.contains('detailtitle')){if(n.classList.contains('subrow')||n.id==='transportLiveNote')n.style.display='none';n=n.nextElementSibling}
    let box=document.getElementById('transportLiveRows');if(!box){box=document.createElement('div');box.id='transportLiveRows';title.insertAdjacentElement('afterend',box)}
    const c=x.components||{};
    const row=(k)=>{const d=c[k]||{};const right=typeof d.count==='number'?`${fmt(d.count)} Schiffe · ${pct(d.ratio)} vom Normalwert`:'wartet auf Daten';return `<div class="subrow"><div class="subleft"><span class="dot" style="background:${colors[d.status]||colors.unknown}"></span>${d.label||k}</div><div class="subright">${right}</div></div>`};
    const b=c.bab_el_mandeb||{},t=b.tanker||{},g=b.goods||{};
    const bab=`<div style="margin-top:7px;margin-bottom:2px;font-weight:700">Bab el-Mandeb</div>`+
      `<div class="subrow"><div class="subleft"><span class="dot" style="background:${colors[g.status]||colors.unknown}"></span>Transportgüter</div><div class="subright">${typeof g.count==='number'?`${fmt(g.count)} Schiffe · ${pct(g.ratio)} vom Normalwert`:'wartet auf Daten'}</div></div>`+
      `<div class="subrow"><div class="subleft"><span class="dot" style="background:${colors[t.status]||colors.unknown}"></span>Öltanker</div><div class="subright">${typeof t.count==='number'?`${fmt(t.count)} Tanker · ${pct(t.ratio)} vom Normalwert`:'wartet auf Daten'}</div></div>`+
      `<div style="margin:2px 0 8px 18px;color:var(--muted);font-size:.86em">Für die Transport-Gesamtampel zählt bei Bab el-Mandeb ausschließlich der Öltanker-Wert. Transportgüter werden nur als Kontext angezeigt.</div>`;
    box.innerHTML=row('hormuz')+bab+row('suez')+row('cape')+row('ais_dark')+`<div id="transportLiveNote" style="margin-top:8px"><b style="color:var(--text)">Transport Version 2.2:</b> Bab el-Mandeb wird getrennt nach Transportgütern und Öltankern dargestellt. Nur die Öltanker fließen in die Transport-Gesamtampel ein. Quelle: IMF PortWatch über Straits.live. Letzter Datenstand: ${x.source_date||'–'}.</div>`;
  }
  document.readyState==='loading'?document.addEventListener('DOMContentLoaded',load):load();setInterval(load,60*60*1000);
})();
