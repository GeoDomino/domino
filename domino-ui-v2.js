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

  function installCreditChain(){
    const g=document.getElementById('financeGrid');
    if(g&&g.children.length>=8){
      g.children[2].outerHTML=watchCard('Unternehmensliquidität','Working Capital','Kosten vor Zahlungseingang');
      g.children[3].outerHTML=watchCard('Insolvenzen','Ausfallrate','Logistik · Industrie · Bau');
      g.children[4].outerHTML=watchCard('Kreditqualität','Stage 2 / NPL','Zahlungsausfälle erreichen Banken');
      g.children[5].outerHTML=watchCard('Kreditklemme','Standards · Spreads','Refinanzierung wird schwieriger');
      g.children[6].outerHTML=watchCard('Sicherheiten','Fahrzeuge · CRE','Wertverlust verstärkt Bankrisiko');
      g.children[7].outerHTML=watchCard('Reparaturkapital','Neuinvestition','Finanziert das System Ersatzkapazität?');
    }
    const body=document.querySelector('.page:nth-child(3) .detailbody');
    if(body&&!document.getElementById('creditChainRules')){
      const box=document.createElement('div');box.id='creditChainRules';box.innerHTML=`<div class="detailtitle">Kredit- und Reparaturkette · Version 1.0</div><div class="rule"><b>Kausalkette</b><br>Energie-/Dieselstress → höheres Working Capital und schwächere Margen → Liquiditätsverbrauch → Kreditausfälle → höhere NPL/Stage-2-Risiken → strengere Kreditstandards und höhere Risikoprämien → weniger Ersatzinvestitionen.</div><div class="rule"><b>Zinsregel</b><br>Ein Energiepreisschock kann Inflationsdruck und damit höhere oder länger hohe Leitzinsen erzeugen. Bei schwerer Rezession können Leitzinsen zugleich fallen. Für DOMINO zählt deshalb zusätzlich der Kreditspread: Firmen können trotz sinkendem Leitzins teurer oder gar nicht mehr finanzierbar sein.</div><div class="rule"><b>Rückkopplung</b><br>Ausfälle drücken Sicherheitenwerte und Bankrisikobudgets. Banken begrenzen neue Kredite gerade in den Branchen, in denen Ersatzkapazität benötigt wird. Damit kann die normale Selbstheilung des Marktes blockiert werden.</div><div class="alarm"><b style="color:var(--text)">DOMINO-Reparaturtest</b><br>Der entscheidende Systemtest lautet: Kann ein gesunder Betreiber die ausgefallene Kapazität kaufen, bauen und finanzieren? Wenn die Antwort über längere Zeit nein ist, wird aus einem Preisschock ein struktureller Schaden.</div>`;body.appendChild(box);
    }
  }

  setTimeout(()=>{installStructuralBreakLayer();installCreditChain()},0);
  for(const [src,v] of [['stocks-ui.js','20260827-2'],['transport-ui.js','20260821-7'],['refinery-ui.js','20260820-1'],['oil-sensor1-ui.js','20260820-4'],['us-oil-physical-ui.js','20260827-1']]){const s=document.createElement('script');s.src=src+'?v='+v;document.body.appendChild(s)}
})();
