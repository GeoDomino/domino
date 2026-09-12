(()=>{
  const style=document.createElement('style');
  style.textContent=`.viewport{width:calc(100% + 24px)!important;max-width:none!important;margin-left:-12px!important;margin-right:-12px!important;overflow:hidden!important}.pages{min-width:0!important}.page{min-width:0!important;padding-left:4px!important;padding-right:4px!important;overflow:hidden!important}.page:nth-child(2){padding-left:2px!important;padding-right:10px!important}.grid{min-width:0!important;grid-template-columns:minmax(0,1fr) minmax(0,1fr)!important;gap:8px!important}.card{min-width:0!important;max-width:100%!important;overflow:hidden!important;padding-left:8px!important;padding-right:8px!important}.card>*{min-width:0!important;max-width:100%!important}.card .name,.card .price,.card .small{overflow-wrap:anywhere!important;word-break:normal!important}.domino-watch{background:var(--unknown)!important;color:#fff!important}`;
  document.head.appendChild(style);
  const pairs=[['light','date'],['oilLight','oilDate'],['transportLight','transportDate'],['refLight','refDate'],['stockLight','stockDate'],['costLight','costDate']];
  function dayNumber(text){if(!text||text==='–')return '–';if(/seit heute/i.test(text))return '1';const m=text.match(/seit\s+(\d+)\s+Tag/i);return m?String(Number(m[1])+1):'–'}
  function apply(lightId,dateId){const light=document.getElementById(lightId),date=document.getElementById(dateId);if(!light||!date)return;let span=light.querySelector('.statusword');if(!span){span=document.createElement('span');span.className='statusword';light.appendChild(span)}const sync=()=>{span.textContent=dayNumber((date.textContent||'').trim());date.style.display='none'};sync();new MutationObserver(sync).observe(date,{childList:true,subtree:true,characterData:true})}
  pairs.forEach(([a,b])=>apply(a,b));

  function watchCard(name,price,small){return `<div class="card"><div class="name">${name}</div><div class="light domino-watch"><span class="statusword">BEOB.</span></div><div class="price">${price}</div><div class="small">${small}</div></div>`}
  function installStructuralBreakLayer(){
    const g=document.getElementById('economyGrid');
    if(g&&g.children.length>=8){
      g.children[3].outerHTML=watchCard('Logistik-Kapazität','Flotte · Kühlkette','Ausfall spezialisierter Transportkapazität');
      g.children[4].outerHTML=watchCard('Industrie-Netzwerk','kritische Zulieferer','Qualifikation · Werkzeuge · Ersatzzeit');
      g.children[5].outerHTML=watchCard('Agrar / Nahrung','Saisonfenster','Ernte · Aussaat · Verarbeitung');
      g.children[6].outerHTML=watchCard('Strukturverlust','Hysterese','Kapazitätsabgang > Ersatzaufbau');
      g.children[7].outerHTML=watchCard('Reparaturfähigkeit','Investition','Kann verlorene Kapazität ersetzt werden?');
    }
    const body=document.querySelector('.page:nth-child(2) .detailbody');
    if(body&&!document.getElementById('structureBreakRules')){
      const box=document.createElement('div');box.id='structureBreakRules';box.innerHTML=`<div class="detailtitle">Strukturbruch · Version 1.0</div><div class="rule"><b>Phasenlogik</b><br>1 Preisstress → 2 Liquiditätsstress → 3 Firmen-/Kapazitätsausfall → 4 Netzwerk- und Fähigkeitsverlust → 5 Wiederaufbau blockiert.</div><div class="rule"><b>Logistik</b><br>Rot wird nicht schon bei teurem Diesel ausgelöst. Kritisch ist der dauerhafte Verlust spezialisierter Kapazität wie Kühlfahrzeuge, Fahrer, Depots, Werkstätten, Disposition und feste Lieferfenster.</div><div class="rule"><b>Industrie</b><br>Ein kleiner spezialisierter Zulieferer kann einen großen Produktionsverbund blockieren. Entscheidend sind Ersatzzeit, Zertifizierung, Werkzeugbau und verfügbare Alternativkapazität.</div><div class="rule"><b>Agrar / Nahrung</b><br>Verpasste Ernte-, Aussaat- oder Verarbeitungsfenster sind zeitgebunden. Sinkt der Dieselpreis später, lässt sich die verlorene Saison nicht nachholen.</div><div class="rule"><b>Hysterese-Regel</b><br>Eine Strukturbruch-Ampel bleibt kritisch, auch wenn der ursprüngliche Dieseltrigger wieder fällt. Entwarnung erst, wenn reale Ersatzkapazität, Lieferfähigkeit und Finanzierung wieder aufgebaut werden.</div><div class="alarm"><b style="color:var(--text)">DOMINO-Strukturbruch</b><br>Der Übergang vom Stress zum Systembruch beginnt, wenn produktive oder logistische Kapazität schneller verschwindet als neue Kapazität entstehen kann. Ein fallender Dieselpreis kann dann Demand Destruction anzeigen und ist nicht automatisch Entwarnung.</div>`;body.appendChild(box);
    }
  }

  async function loadCreditStress(){
    const light=document.getElementById('creditLight'),status=document.getElementById('creditStatus'),price=document.getElementById('creditPrice'),small=document.getElementById('creditDate'),err=document.getElementById('creditError');
    if(!light||!status||!price||!small)return;
    try{
      const r=await fetch('./credit-stress.json?ts='+Date.now(),{cache:'no-store'});if(!r.ok)throw 0;
      const x=await r.json(),h=x.components?.hy_spread||{},s=x.components?.sloos||{};
      light.style.background=colors[x.status]||colors.unknown;status.textContent=x.label||'?';
      price.textContent='Score '+Number(x.score).toLocaleString('de-DE',{maximumFractionDigits:2});
      small.textContent='HY '+Number(h.value).toLocaleString('de-DE',{minimumFractionDigits:2,maximumFractionDigits:2})+' % · SLOOS '+(Number(s.value)>=0?'+':'')+Number(s.value).toLocaleString('de-DE',{maximumFractionDigits:1})+' %';
      if(err)err.style.display='none';
      const d=document.getElementById('creditStressDetail');
      if(d)d.innerHTML='<span class="dot" style="background:'+colors[h.status]+'"></span>ICE BofA Single-B HY OAS: <b style="color:var(--text)">'+Number(h.value).toLocaleString('de-DE',{minimumFractionDigits:2,maximumFractionDigits:2})+' % · '+String(h.status||'').toUpperCase()+'</b> · Gewicht 60 %<br><span class="dot" style="background:'+colors[s.status]+'"></span>SLOOS Kreditstandards: <b style="color:var(--text)">'+(Number(s.value)>=0?'+':'')+Number(s.value).toLocaleString('de-DE',{maximumFractionDigits:1})+' % netto · '+String(s.status||'').toUpperCase()+'</b> · Gewicht 40 %<br><span style="color:var(--muted)">SLOOS: große/mittlere Firmen '+(Number(s.large_middle)>=0?'+':'')+Number(s.large_middle).toLocaleString('de-DE',{maximumFractionDigits:1})+' %, kleine Firmen '+(Number(s.small)>=0?'+':'')+Number(s.small).toLocaleString('de-DE',{maximumFractionDigits:1})+' %.</span><br>Gesamt: <b style="color:var(--text)">'+(x.label||'?')+' · Score '+Number(x.score).toLocaleString('de-DE',{maximumFractionDigits:2})+'</b>';
    }catch(e){status.textContent='?';light.style.background=colors.unknown;price.textContent='Kreditstress';small.textContent='Aktualisierung fehlgeschlagen';if(err){err.textContent='Wartet auf Kreditdaten';err.style.display='block'}}
  }

  function installCreditChain(){
    const g=document.getElementById('financeGrid');
    if(g){
      g.innerHTML=`
        <div class="card"><div class="name">US-Finanzierung</div><div class="light" style="background:var(--green)"><span class="statusword">GRÜN</span></div><div class="price">1,37 Bio. $</div><div class="small">Jul–Dez 2026 · geplant</div></div>
        <div class="card"><div class="name">Dollar / Yen · Wippe</div><div class="light" id="yenLight"><span class="statusword" id="yenStatus">Lädt</span></div><div class="price" id="yenPrice">–</div><div class="small" id="yenDate">Balance wird geladen</div><div class="error" id="yenError"></div></div>
        ${watchCard('Unternehmensliquidität','Working Capital','Kosten vor Zahlungseingang')}
        ${watchCard('Insolvenzen','Ausfallrate','Logistik · Industrie · Bau')}
        ${watchCard('Kreditqualität','Stage 2 / NPL','Zahlungsausfälle erreichen Banken')}
        <div class="card"><div class="name">Kreditklemme</div><div class="light" id="creditLight"><span class="statusword" id="creditStatus">Lädt</span></div><div class="price" id="creditPrice">–</div><div class="small" id="creditDate">ICE + SLOOS</div><div class="error" id="creditError"></div></div>
        ${watchCard('Sicherheiten','Fahrzeuge · CRE','Wertverlust verstärkt Bankrisiko')}
        ${watchCard('Reparaturkapital','Neuinvestition','Finanziert das System Ersatzkapazität?')}`;
      setTimeout(()=>{if(typeof window.loadYen==='function')window.loadYen();loadCreditStress()},0);
    }
    const body=document.querySelector('.page:nth-child(3) .detailbody');
    if(body&&!document.getElementById('creditChainRules')){
      const box=document.createElement('div');box.id='creditChainRules';box.innerHTML=`<div class="detailtitle">Kredit- und Reparaturkette · Version 1.2</div><div class="rule"><b>Kausalkette</b><br>Energie-/Dieselstress → höheres Working Capital und schwächere Margen → Liquiditätsverbrauch → Kreditausfälle → höhere NPL/Stage-2-Risiken → strengere Kreditstandards und höhere Risikoprämien → weniger Ersatzinvestitionen.</div><div class="rule"><b>Dollar / Yen · Wippensensor</b><br>USD/JPY wird bidirektional überwacht. Ein zu schwacher Yen kann Interventions- und Finanzierungsstress erzeugen; eine schnelle Yen-Aufwertung kann Carry-Trade-Positionen unter Druck setzen. Die Ampel selbst bewertet nur Kursniveau und Bewegungsgeschwindigkeit. Carry Trade, Treasury-Verkäufe und Interventionen werden nicht direkt eingerechnet.</div><div class="rule"><b>Yen-Schwellen</b><br>Niveau: 🟢 145–158 · 🟡 140–&lt;145 / &gt;158–162 · 🟠 135–&lt;140 / &gt;162–166 · 🔴 &lt;135 / &gt;166 USD/JPY.<br>Dynamik über 5 Handelstage: 🟢 &lt;3 % · 🟡 3–&lt;4 % · 🟠 4–&lt;5 % · 🔴 ≥5 %. Die höhere der beiden Stufen bestimmt die Ampel; der drehende Pfeil zeigt auffällige Dynamik.</div><div class="rule"><b>Kreditklemme · automatischer Kern</b><br><span id="creditStressDetail">Wartet auf Kreditdaten.</span><br><br>Der tägliche Marktsensor ist der ICE BofA Single-B US High Yield Option-Adjusted Spread. Der strukturelle Banksensor ist SLOOS; dafür wird der Mittelwert der Kreditstandards für große/mittlere und kleine C&amp;I-Firmen verwendet. Beide Quellen werden mindestens einmal täglich abgerufen; SLOOS selbst erscheint nur quartalsweise.</div><div class="rule"><b>Gewichtung</b><br>ICE/BofA Spread 60 % · SLOOS 40 %. Der Spread reagiert täglich auf Marktstress; SLOOS prüft, ob Banken ihre reale Kreditvergabe verschärfen.</div><div class="rule"><b>Schwellen</b><br><b>HY OAS:</b> 🟢 &lt;3 % · 🟡 3–&lt;4 % · 🟠 4–&lt;6 % · 🔴 ≥6 %.<br><b>SLOOS:</b> 🟢 ≤5 % · 🟡 &gt;5–15 % · 🟠 &gt;15–30 % · 🔴 &gt;30 % netto verschärfend.<br>Gesamtscore: 60 % Spread-Stufe + 40 % SLOOS-Stufe.</div><div class="rule"><b>Private Credit · Rücknahmedruck</b><br>Rücknahmedruck bleibt ein zusätzliches Frühwarnsignal. Solange dafür keine robuste tägliche Datenquelle automatisiert ist, beeinflusst er die Ampel nicht.</div><div class="rule"><b>Zinsregel</b><br>Ein Energiepreisschock kann Inflationsdruck und damit höhere oder länger hohe Leitzinsen erzeugen. Bei schwerer Rezession können Leitzinsen zugleich fallen. Für DOMINO zählt deshalb zusätzlich der Kreditspread: Firmen können trotz sinkendem Leitzins teurer oder gar nicht mehr finanzierbar sein.</div><div class="rule"><b>Rückkopplung</b><br>Ausfälle drücken Sicherheitenwerte und Bankrisikobudgets. Banken und Kreditfonds begrenzen neue Kredite gerade in den Branchen, in denen Ersatzkapazität benötigt wird. Damit kann die normale Selbstheilung des Marktes blockiert werden.</div><div class="alarm"><b style="color:var(--text)">DOMINO-Reparaturtest</b><br>Der entscheidende Systemtest lautet: Kann ein gesunder Betreiber die ausgefallene Kapazität kaufen, bauen und finanzieren? Wenn die Antwort über längere Zeit nein ist, wird aus einem Preisschock ein struktureller Schaden.</div>`;body.appendChild(box);
    }
  }

  setTimeout(()=>{installStructuralBreakLayer();installCreditChain()},0);
  setInterval(loadCreditStress,3600000);
  for(const [src,v] of [['stocks-ui.js','20260827-2'],['transport-ui.js','20260821-7'],['refinery-ui.js','20260820-1'],['oil-sensor1-ui.js','20260820-4'],['us-oil-physical-ui.js','20260910-2'],['yen-ui.js','20260912-1']]){const s=document.createElement('script');s.src=src+'?v='+v;document.body.appendChild(s)}
  {const s=document.createElement('script');s.src='us-financing-ui.js?v=20260912-1';document.body.appendChild(s)}
})();
