(()=>{
  const COLORS=['var(--green)','var(--yellow)','var(--orange)','var(--red)'];
  const LABELS=['GRÜN','GELB','ORANGE','ROT'];
  const fmt=(v,d=2)=>typeof v==='number'?v.toLocaleString('de-DE',{minimumFractionDigits:d,maximumFractionDigits:d}):'–';
  function ensureTarget(){
    const target=document.getElementById('oilComponents'); if(!target)return null;
    let box=target.querySelector('[data-us-oil-physical]');
    if(!box){box=document.createElement('div');box.className='rule';box.setAttribute('data-us-oil-physical','');target.appendChild(box)}
    return box;
  }
  function render(d){
    const box=ensureTarget(); if(!box)return;
    const c=d.components||{};
    const row=(x)=>{const dir=(x?.deviation_pct>0?'↑':x?.deviation_pct<0?'↓':'→');return `<div class="subrow"><div class="subleft"><span class="dot" style="background:${COLORS[x?.level]||'var(--unknown)'}"></span>${x?.label||'–'} <span style="color:var(--muted)">(${x?.weight||0} %)</span></div><div class="subright">${fmt(x?.value)} ${x?.unit||''} · ${dir} ${fmt(Math.abs(x?.deviation_pct||0))} %</div></div>`};
    box.innerHTML=`<b>Sensor 4 Ölversorgung · US-Ölversorgung physisch <span style="display:inline-block;width:12px;height:12px;border-radius:50%;background:${COLORS[d.level]||'var(--unknown)'};margin-left:5px;vertical-align:1px"></span></b><br><span style="font-weight:700">${LABELS[d.level]||'WARTET'} · Stressscore ${fmt(d.score,2)}</span><br><span style="color:var(--muted)">Wöchentlicher EIA-Realitätscheck. Neuester Wert gegen Mittel der vier vorherigen Wochen.</span>${row(c.canada_imports)}${row(c.commercial_crude_stocks)}${row(c.total_crude_imports)}${row(c.domestic_production)}${row(c.refinery_inputs)}<div style="margin-top:8px"><b>Logik:</b> Kanada 30 % · Lager 30 % · Gesamtimporte 15 % · US-Förderung 15 % · Raffinerieeinsatz 10 %. Gleichzeitiger Importverlust und Lagerabbau können die Ampel zusätzlich eskalieren.</div><div style="margin-top:8px"><b>Quelle:</b> U.S. EIA Weekly Petroleum Data · Datenstand ${d.source_date||'–'}.</div>`;
  }
  fetch('us-oil-physical.json?ts='+Date.now(),{cache:'no-store'}).then(r=>r.json()).then(render).catch(()=>{});
})();
