(()=>{
  const LEVEL_COLORS=['var(--green)','var(--yellow)','var(--orange)','var(--red)'];
  const LABELS=['GRÜN','GELB','ORANGE','ROT'];
  function fmt(v,d=1){return typeof v==='number'?v.toLocaleString('de-DE',{minimumFractionDigits:d,maximumFractionDigits:d}):'–'}
  function findEnergyDetails(){return [...document.querySelectorAll('details')].find(x=>/Energieversorgung/.test(x.querySelector('summary')?.textContent||''));}
  function replaceDetail(data){
    const det=findEnergyDetails(); if(!det)return;
    const body=det.querySelector('.detailbody'); if(!body)return;
    const titles=[...body.querySelectorAll('.detailtitle')];
    const start=titles.find(x=>/^Lagerbestände/.test(x.textContent.trim()));
    const end=titles.find(x=>/^Transportkosten/.test(x.textContent.trim()));
    if(!start||!end)return;
    let n=start.nextSibling; while(n&&n!==end){const z=n.nextSibling;n.remove();n=z;}
    const c=data.components||{};
    const dot=x=>LEVEL_COLORS[x?.level]||'var(--unknown)';
    const row=(x,label,value)=>`<div class="subrow"><div class="subleft"><span class="dot" style="background:${dot(x)}"></span>${label}</div><div class="subright">${value}</div></div>`;
    const html=
      row(c.spr,'Strategische Reserve',`${fmt(c.spr?.value_million_bbl,2)} Mio. bbl`)+
      row(c.spr_trend,'SPR-Trend',`${c.spr_trend?.weekly_change_million_bbl>=0?'+':''}${fmt(c.spr_trend?.weekly_change_million_bbl,2)} Mio./Woche`)+
      row(c.commercial_crude,'Kommerzielles Rohöl',`${fmt(c.commercial_crude?.value_million_bbl,2)} Mio. bbl`)+
      row(c.distillate_stocks,'Diesel/Distillate Bestand',`${fmt(c.distillate_stocks?.value_million_bbl,2)} Mio. bbl · P${fmt(c.distillate_stocks?.percentile,0)}`)+
      row(c.diesel_stress,'Diesel-Stress',`${LABELS[c.diesel_stress?.level]||'OFFEN'} · Score ${fmt(c.diesel_stress?.score,1)}`)+
      `<div style="margin-top:8px"><b style="color:var(--text)">SPR:</b> 🟢 ≥400 · 🟡 350–&lt;400 · 🟠 300–&lt;350 · 🔴 &lt;300 Mio. bbl. Unter 300 Mio. ist eine DOMINO-Warnschwelle, keine offizielle DOE-Grenze.</div>`+
      `<div style="margin-top:8px"><b style="color:var(--text)">Diesel-Stress:</b> aktueller Distillate-Bestand, historisches Bestandsperzentil, Wochenänderung und Days of Supply werden gemeinsam bewertet. Die Perzentile werden aus der EIA-Historie berechnet.</div>`+
      `<div style="margin-top:8px"><b style="color:var(--text)">Quelle:</b> U.S. EIA Weekly Petroleum Status Report / Petroleum & Other Liquids. Datenstand ${data.source_date||'–'}; automatischer täglicher Prüfabruf.</div>`;
    start.insertAdjacentHTML('afterend',html);
  }
  async function init(){
    try{
      const r=await fetch('stocks.json?'+Date.now(),{cache:'no-store'}); if(!r.ok)throw Error(r.status);
      const d=await r.json(); if(typeof d.level!=='number')return;
      const lamp=document.getElementById('stockLight'),date=document.getElementById('stockDate');
      if(lamp)lamp.style.background=LEVEL_COLORS[d.level]||'var(--unknown)';
      if(date){
        const old=date.querySelector('.stock-trend-arrow'); if(old)old.remove();
        date.textContent=d.days_in_status===1?'seit heute':`seit ${Math.max(1,d.days_in_status-1)} Tagen`;
        const arrow=document.createElement('span');
        arrow.className='stock-trend-arrow';
        arrow.textContent=' ↑';
        arrow.title='Ampel eskaliert / Verschlechterung';
        arrow.setAttribute('aria-label','Ampel eskaliert');
        arrow.style.cssText='font-size:17px;font-weight:900;color:var(--red);margin-left:4px;vertical-align:-1px';
        date.appendChild(arrow);
      }
      replaceDetail(d);
    }catch(e){console.warn('stocks-ui',e)}
  }
  document.readyState==='loading'?document.addEventListener('DOMContentLoaded',init):init();
})();
