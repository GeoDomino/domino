(()=>{
  const css=`
  .wdk{display:grid;grid-template-columns:100px 48px;align-items:center;justify-content:start;column-gap:0;margin-top:2px;margin-left:-2px}
  .wdk-rows{display:grid;gap:7px;width:100px}
  .wdk-row{display:grid;grid-template-columns:57px 38px;gap:5px;align-items:center;text-align:left;font-size:11px}
  .wdk-row b{display:block;text-align:left}
  .wdk-dot{width:38px;height:38px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:900;color:#07120a;font-size:14px}
  .wdk-spread{width:48px;display:flex;flex-direction:column;align-items:center;justify-content:center}
  .wdk-arrow{width:46px;height:46px;display:flex;align-items:center;justify-content:center;font-size:44px;line-height:46px;color:#cbd5e1;opacity:.95;transform-origin:50% 50%}
  .wdk-arrow.slow{animation:wdkspin 7s linear infinite}
  .wdk-arrow.fast{animation:wdkspin 2s linear infinite}
  .wdk-arrow.ccw{animation-direction:reverse}
  .wdk-spread-label{width:48px;font-size:8px;line-height:9px;color:var(--muted);text-align:center;margin-top:2px;white-space:normal}
  @keyframes wdkspin{to{transform:rotate(360deg)}}`;
  const style=document.createElement('style');style.textContent=css;document.head.appendChild(style);

  const levelColor=l=>['var(--green)','var(--yellow)','var(--orange)','var(--red)'][l]||'var(--unknown)';
  const row=(name,level,days)=>`<div class="wdk-row"><b>${name}</b><span class="wdk-dot" style="background:${levelColor(level)}">${days??'–'}</span></div>`;
  const fmt=(x,d=3)=>typeof x==='number'?x.toLocaleString('de-DE',{minimumFractionDigits:d,maximumFractionDigits:d}):'–';
  async function get(file){try{const r=await fetch(file+'?ts='+Date.now(),{cache:'no-store'});if(!r.ok)throw new Error(r.status);return await r.json()}catch(e){return null}}
  function card(){for(const n of document.querySelectorAll('.name'))if(/Kraftstoff-Großhandel|Großhandel DK/.test(n.textContent||''))return n.closest('.card');return null}
  function detailBody(){return [...document.querySelectorAll('details')].find(x=>/Wirtschaft/.test(x.querySelector('summary')?.textContent||''))?.querySelector('.detailbody')||null}

  async function init(){
    const c=card();if(!c)return;
    c.classList.remove('placeholder');
    c.innerHTML=`<div class="name">Großhandel DK</div><div class="wdk"><div class="wdk-rows" id="wdkrows">${row('Amerika',null,null)}${row('Europa',null,null)}${row('Asien',null,null)}</div><div class="wdk-spread"><div class="wdk-arrow" id="wdkArrow" title="Ost-West Spread">⟳</div><div class="wdk-spread-label">Ost-West<br>Spread</div></div></div>`;

    const [us,eu,asia,spread]=await Promise.all([
      get('wholesale-dk-us.json'),get('wholesale-dk-eu.json'),get('wholesale-dk-asia.json'),get('wholesale-dk-spread.json')
    ]);

    document.getElementById('wdkrows').innerHTML=
      row('Amerika',us?.level,us?.days_in_status)+row('Europa',eu?.level,eu?.days_in_status)+row('Asien',asia?.level,asia?.days_in_status);

    const arrow=document.getElementById('wdkArrow');
    if(spread){
      const state=['still','slow','fast'].includes(spread.state)?spread.state:'still';
      const dir=spread.direction==='ccw'?'ccw':'cw';
      arrow.className='wdk-arrow '+state+' '+dir;
      arrow.title=`Ost-West Spread · ${state} · Stress ${fmt(spread.stress_score,1)} %`;
    }

    const b=detailBody();
    if(b){
      document.getElementById('wdkDetails')?.remove();
      const market=(d,label)=>d&&typeof d.value==='number'
        ?`<b>${label}:</b> ${fmt(d.value)} ${d.unit} · ${['grün','gelb','orange','rot'][d.level]||'offen'} · ${d.days_in_status??'–'} Tage`
        :`<b>${label}:</b> noch kein belastbarer Abruf`;
      const sp=spread&&typeof spread.value_usd_bbl==='number'
        ?`<b>Ost-West-Spread:</b> ${fmt(spread.value_usd_bbl)} $/bbl · ${spread.state} · Niveau/Abweichung ${fmt(spread.deviation_percentile,1)}. Perzentil · Geschwindigkeit ${fmt(spread.speed_percentile,1)}. Perzentil · ${spread.days_in_state??'–'} Tage im Zustand.`
        :`<b>Ost-West-Spread:</b> wartet auf belastbare Europa- und Asienwerte.`;
      b.insertAdjacentHTML('beforeend',`<div id="wdkDetails" class="rule"><b>Großhandel DK · Regionalmärkte</b><br>${market(us,'Amerika / USGC ULSD')}<br>${market(eu,'Europa / ICE Low Sulphur Gasoil')}<br>${market(asia,'Asien / Singapore Gasoil (Platts)')}<br><br><b>Ampelgrenzen:</b><br>Amerika: 🟢 &lt;2,50 · 🟡 2,50–&lt;3,50 · 🟠 3,50–&lt;4,20 · 🔴 ≥4,20 $/gal.<br>Europa: 🟢 &lt;900 · 🟡 900–&lt;1.200 · 🟠 1.200–&lt;1.500 · 🔴 ≥1.500 $/t.<br>Asien: 🟢 &lt;100 · 🟡 100–&lt;125 · 🟠 125–&lt;150 · 🔴 ≥150 $/bbl.<br><br>${sp}<br><br><b>Pfeil-Logik:</b> Der Pfeil bewertet drei Faktoren gemeinsam: (1) Höhe bzw. Abweichung des Spreads von seiner historischen Normalzone, (2) Geschwindigkeit der Veränderung und (3) Dauer/Persistenz des Zustands. Unter dem 90. historischen Perzentil steht er; 90.–&lt;97,5 = langsame Rotation; ab 97,5 = schnelle Rotation. Die Drehrichtung folgt der jüngsten Spread-Veränderung.<br><br><b>Spread-Modell:</b> Europa wird mit 7,45 bbl/t in $/bbl umgerechnet; DOMINO berechnet Singapore minus Europa. Das ist ein transparentes DOMINO-Modell und keine proprietäre Platts-/ICE-EFS-Reihe.<br><br><b>Abrufziel:</b> Europa und Asien möglichst um 10:00 und 15:00 Uhr jeweiliger Ortszeit an Handelstagen; Amerika über den separaten US-Abruf. Quellen: USA U.S. EIA/FRED; Europa ICE Low Sulphur Gasoil via verzögertem Yahoo-Futures-Feed; Asien Singapore Gasoil (Platts) via verzögertem Yahoo-Futures-Feed.</div>`);
    }
  }
  document.readyState==='loading'?document.addEventListener('DOMContentLoaded',init):init();
})();
