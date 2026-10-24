(()=>{
 const css=document.createElement('style');
 css.textContent=`.gsr-card .name{font-size:16px}.gsr-line{display:flex;align-items:center;justify-content:center;gap:7px;min-width:0}.gsr-card .light{width:72px;height:72px;margin:0;flex:none;flex-direction:column}.gsr-value{font-size:21px;font-weight:850;color:#10151b}.gsr-unit{font-size:9px;font-weight:800;color:#10151b}.gsr-spark{display:block;width:100%;height:96px;margin:10px 0 2px;overflow:visible}.gsr-chart-labels{display:flex;justify-content:space-between;font-size:10px;color:var(--muted);font-weight:700}.gsr-arrow{font-size:32px;font-weight:900;line-height:1}.gsr-caption{font-size:10px;color:var(--muted);margin-top:8px}.gsr-card .small{font-size:10px}`;
 document.head.appendChild(css);
 const fmt=v=>Number(v).toLocaleString('de-DE',{minimumFractionDigits:1,maximumFractionDigits:1});
 const esc=s=>String(s??'–').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
 function draw(history){
  const svg=document.getElementById('gsrSpark');if(!svg)return;
  const a=history.filter(p=>Number.isFinite(+p.ratio)&&p.ratio>0);
  if(a.length<2){svg.innerHTML='<text x="45" y="24" text-anchor="middle" fill="#8b929e" font-size="11">keine Kurve</text>';return;}
  const vals=a.map(p=>+p.ratio),lo=Math.min(...vals),hi=Math.max(...vals),span=hi-lo||1;
  // Inverted y-axis: a smaller numerical ratio must appear HIGHER on screen.
  const pts=vals.map((v,i)=>[7+i*306/(vals.length-1),12+(v-lo)/span*70]);
  const path=pts.map((p,i)=>(i?'L':'M')+p[0].toFixed(2)+' '+p[1].toFixed(2)).join(' ');
  const dots=pts.map((p,i)=>'<circle cx="'+p[0].toFixed(2)+'" cy="'+p[1].toFixed(2)+'" r="'+(i===pts.length-1?4:2.2)+'" fill="#2563eb"/>').join('');
  svg.innerHTML='<path d="M7 82 H313" stroke="#64748b" stroke-width="0.8" stroke-dasharray="3 4" opacity=".6"/><path d="'+path+'" fill="none" stroke="#2563eb" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>'+dots+'<text x="7" y="9" font-size="9" font-weight="700" fill="#64748b">'+lo.toFixed(0)+'</text><text x="313" y="92" text-anchor="end" font-size="9" font-weight="700" fill="#64748b">'+hi.toFixed(0)+'</text>';
 }
 function install(){
  const g=document.getElementById('financeGrid');if(!g||g.children.length<2)return false;
  g.children[1].outerHTML=`<div class="card gsr-card" id="gsrCard"><div class="name">Gold-Silber-Ratio · Silber-Sicht ↑</div><div class="gsr-line"><div class="light" id="gsrLight"><span class="gsr-value" id="gsrValue">–</span><span class="gsr-unit">GSR</span></div><div class="gsr-arrow" id="gsrArrow" title="30-Tage-Trend aus Silber-Sicht">→</div></div><svg class="gsr-spark" id="gsrSpark" viewBox="0 0 320 96" preserveAspectRatio="none" role="img" aria-label="Silberperspektive der Gold-Silber-Ratio der letzten zwölf Monate: nach oben ist besser für Silber"></svg><div class="gsr-chart-labels"><span>Okt 2025</span><span>↑ besser für Silber · ↓ schlechter</span><span>Okt 2026</span></div><div class="gsr-caption"><span id="gsrPeriod">12 Monate</span> · Silber-Trend <span id="gsrTrend">–</span></div><div class="small" id="gsrQuote">Händlerankauf: nicht bestätigt</div></div>`;
  const body=document.querySelector('.page:nth-child(3) .detailbody');
  if(body){const d=document.createElement('div');d.id='gsrDetails';d.innerHTML=`<div class="detailtitle">Gold-Silber-Ratio · Version 1.0</div><div class="rule">Die Zahl ist Goldpreis je Feinunze geteilt durch Silberpreis je Feinunze, jeweils in derselben Währung. Die Mini-Kurve ist bewusst aus Sicht des Silberbesitzers gespiegelt: steigende Kurve = fallende Ratio = Silber gewinnt relativ zu Gold; fallende Kurve = steigende Ratio = Silber verliert relativ zu Gold. Sie zeigt zwölf Monate reale Beobachtungen. Bei Monatsdaten werden Monatsdurchschnitte der Weltbank und der jüngste aktuelle Kursstand kombiniert; diese Werte sind nicht direkt identisch mit täglichen Schlusskursen. Steigende Kurve = niedrigere Ratio (Silberperspektive).</div><div class="rule"><b>Pfeil aus Sicht des Silberbesitzers:</b> Grün ↗, wenn die Ratio über 30 Tage fällt (Silber gewinnt relativ); Rot ↘, wenn sie steigt (Silber verliert relativ); → bei weniger als 0,5 % Änderung. Der Pfeil ist bewusst umgekehrt zur mathematischen Ratio-Richtung.</div><div class="rule"><b>Persönliche Ampelfarbe:</b> 🔴 Händlerankauf unter 107,93 € je Feinunze · 🟡 ab 107,93 € bis unter 189,54 € · 🟢 ab 189,54 € bis unter 326,80 € je Feinunze · 🔵 ab 326,80 € je Feinunze (153 oz × Ankaufspreis ≥ 50.000 €). ⚪ Grau, wenn kein frisches, nachprüfbares Ankaufangebot für eine vergleichbare 1-oz-Anlagemünze vorliegt. Der Spotpreis darf niemals die Händlerankaufampel ersetzen. Die Grün-Schwelle basiert auf dem Modell: 25.000 € Darlehen, 6 % p.a., 60 Monatsraten à 483,32 €, insgesamt 28.999,20 € inklusive ca. 3.999,20 € Zinsen; geteilt durch 153 oz = 189,5373 €/oz. Grün gilt ab 189,54 €/oz, also sobald die gesamte modellierte Rückzahlung durch den Verkauf der 153 oz gedeckt wäre. Das Darlehen enthält auch Altschulden; Grün ist deshalb eine persönliche Zukunftswette, keine Silberrendite. Die Schwellen sind nominal und nicht inflationsbereinigt.</div><div class="rule" id="gsrLiveDetails">Wartet auf Daten.</div>`;body.appendChild(d);}
  load();return true;
 }
 async function load(){
  const lamp=document.getElementById('gsrLight');if(!lamp)return;
  try{
   const r=await fetch('./gold-silver-ratio.json?ts='+Date.now(),{cache:'no-store'});if(!r.ok)throw Error('missing');
   const x=await r.json(),h=Array.isArray(x.history)?x.history:[],last=h.at(-1);
   const q=x.dealer_quote||{},fresh=Number.isFinite(+q.buyback_eur_per_oz)&&+q.buyback_eur_per_oz>0&&q.date&&Math.abs((Date.now()-Date.parse(q.date+'T12:00:00Z'))/86400000)<=7&&q.source_url&&q.coin;
   lamp.style.background=fresh?(+q.buyback_eur_per_oz*153>=50000?'#3b82f6':+q.buyback_eur_per_oz>=189.54?'var(--green)':+q.buyback_eur_per_oz>=107.93?'var(--yellow)':'var(--red)'):'var(--unknown)';
   document.getElementById('gsrQuote').textContent=fresh?'Ankauf '+Number(q.buyback_eur_per_oz).toLocaleString('de-DE',{style:'currency',currency:'EUR'})+'/oz':'Ankauf unbestätigt · Ampel grau';
   const d=document.getElementById('gsrLiveDetails');
   if(d)d.textContent='Händlerankauf: '+(fresh?(q.coin+' · '+q.buyback_eur_per_oz+' €/oz · '+q.date+' · '+q.source_url):'kein frisches verifiziertes Angebot');
   if(!last||!Number.isFinite(+last.ratio)||!/^\d{4}-\d{2}-\d{2}$/.test(last.date)){
     document.getElementById('gsrValue').textContent='–';draw([]);document.getElementById('gsrTrend').textContent='Kursdaten fehlen';return;
   }
   const age=(Date.now()-Date.parse(last.date+'T12:00:00Z'))/86400000;
   if(age>7||age< -2)throw Error('stale');
   document.getElementById('gsrValue').textContent=fmt(last.ratio);
   const period=document.getElementById('gsrPeriod');if(period)period.textContent=x.history_frequency==='monthly_plus_latest'?'12 Monate · Monatswerte + aktuell':'12 Monate · Tageswerte';
   draw(h);
   const t=x.trend_30d_pct==null?NaN:Number(x.trend_30d_pct),a=document.getElementById('gsrArrow'),desc=document.getElementById('gsrTrend');
   if(Number.isFinite(t)){a.textContent=t>0.5?'↘':t< -0.5?'↗':'→';a.style.color=t>0.5?'var(--red)':t< -0.5?'var(--green)':'var(--muted)';desc.textContent=(t>0?'+':'')+fmt(t)+' % / 30 T';}else{a.textContent='→';a.style.color='var(--muted)';desc.textContent='keine 30-Tage-Daten';}
   if(d)d.textContent='Ratio '+fmt(last.ratio)+' · Stand '+last.date+' · Quelle '+(x.source||'–')+' · '+d.textContent;
  }catch(e){lamp.style.background='var(--unknown)';document.getElementById('gsrValue').textContent='–';document.getElementById('gsrQuote').textContent='Marktdaten fehlen oder veraltet';draw([]);}
 }
 if(!install())setTimeout(install,150);
 setInterval(load,3600000);
})();