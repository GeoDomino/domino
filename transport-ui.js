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

    const b=c.bab_el_mandeb||{},t=b.tanker||{},g=b.goods||{},s=b.security_news||{};
    const goodsRight=g.display|| (typeof g.count==='number'?`${fmt(g.count)} Schiffe · ${pct(g.ratio)} vom Normalwert`:'wartet auf Daten');
    const tankerRight=t.display|| (typeof t.count==='number'?`${fmt(t.count)} Tanker · ${pct(t.ratio)} vom Normalwert`:'wartet auf Daten');
    const events=Array.isArray(s.events)?s.events:[];
    const securityRight=typeof s.event_count_72h==='number'?`${s.event_count_72h} bestätigte Ereignisse / 72 h`:'wartet auf Nachrichtenabfrage';
    const eventHtml=events.length?`<div style="margin:2px 0 7px 18px;color:var(--muted);font-size:.82em">${events.slice(0,3).map(e=>`${e.source||'Quelle'}: ${e.title||''}`).join('<br>')}</div>`:'';
    const bab=`<div style="margin-top:7px;margin-bottom:2px;font-weight:700">Bab el-Mandeb</div>`+
      `<div class="subrow"><div class="subleft"><span class="dot" style="background:${colors[g.status]||colors.unknown}"></span>Transportgüter</div><div class="subright">${goodsRight}</div></div>`+
      `<div class="subrow"><div class="subleft"><span class="dot" style="background:${colors[t.status]||colors.unknown}"></span>Sensor 1 · Öltransport</div><div class="subright">${tankerRight}</div></div>`+
      `<div class="subrow"><div class="subleft"><span class="dot" style="background:${colors[s.status]||colors.unknown}"></span>Sensor 2 · Sicherheitslage Öltanker</div><div class="subright">${securityRight}</div></div>`+
      eventHtml+
      `<div style="margin:2px 0 8px 18px;color:var(--muted);font-size:.86em">Sensor 2: 0 Angriffe = Grün · 1 bestätigtes Ereignis = Orange · ab 2 unterschiedlichen Ereignissen = Rot. Mehrfachmeldungen zum selben Angriff werden zusammengefasst. Transportgüter sind nur Kontext.</div>`;

    const z=c.suez||{},zt=z.traffic||{},zw=z.waiting||{};
    const waitRight=typeof zw.hours==='number'?`${fmt(zw.hours)} h Wartezeit`:'wartet auf Wartezeitdaten';
    const suez=`<div style="margin-top:7px;margin-bottom:2px;font-weight:700">Suez / SUMED</div>`+
      `<div class="subrow"><div class="subleft"><span class="dot" style="background:${colors[zt.status]||colors.unknown}"></span>Sensor 1 · Verkehrsmenge</div><div class="subright">${typeof zt.count==='number'?`${fmt(zt.count)} Schiffe/Tag`:'wartet auf Daten'}</div></div>`+
      `<div class="subrow"><div class="subleft"><span class="dot" style="background:${colors[zw.status]||colors.unknown}"></span>Sensor 2 · Wartezeit</div><div class="subright">${waitRight}</div></div>`+
      `<div style="margin:2px 0 8px 18px;color:var(--muted);font-size:.86em">Verkehr: bis 80 Grün · 81–99 Gelb · ab 100 Orange. Rot gibt es hier nicht allein wegen der Schiffsanzahl. Wartezeit: unter 24 h Grün · 24–&lt;48 h Gelb · 48–&lt;72 h Orange · ab 72 h Rot. Für Suez zählt die schlechtere der beiden Farben.</div>`;

    box.innerHTML=row('hormuz')+bab+suez+row('cape')+row('ais_dark')+`<div id="transportLiveNote" style="margin-top:8px"><b style="color:var(--text)">Transport Version 2.7:</b> Bab el-Mandeb kombiniert Ölfluss und Sicherheitslage; Suez trennt Verkehrsmenge und tatsächliche Wartezeit. Datenstand: ${x.source_date||'–'}.</div>`;
  }
  document.readyState==='loading'?document.addEventListener('DOMContentLoaded',load):load();setInterval(load,15*60*1000);
})();
