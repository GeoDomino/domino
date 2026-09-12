(()=>{
  const css=document.createElement('style');
  css.textContent=`
    .usfin-signal-row{display:flex;align-items:center;justify-content:center;gap:13px;margin:0 auto 8px}
    .usfin-signal-row .light{margin:0!important}
    .fed-intervention{width:58px;height:68px;display:flex;flex-direction:column;align-items:center;justify-content:center}
    .fed-arrow{font-size:42px;line-height:42px;font-weight:800;color:#cbd5e1;transform-origin:50% 50%}
    .fed-arrow.slow{animation:fedspin 7s linear infinite;color:var(--yellow)}
    .fed-arrow.fast{animation:fedspin 1.25s linear infinite;color:var(--red)}
    .fed-arrow.stopped{animation:none;color:#94a3b8}
    .fed-days{font-size:10px;color:var(--muted);margin-top:2px;font-weight:750}
    @keyframes fedspin{to{transform:rotate(360deg)}}
  `;
  document.head.appendChild(css);

  const cmap={green:'var(--green)',yellow:'var(--yellow)',orange:'var(--orange)',red:'var(--red)',unknown:'var(--unknown)'};
  const n=(v,d=1)=>Number(v).toLocaleString('de-DE',{minimumFractionDigits:d,maximumFractionDigits:d});

  function install(){
    const g=document.getElementById('financeGrid');
    if(!g||!g.children.length)return false;
    const first=g.children[0];
    if(!first)return false;
    first.outerHTML=`<div class="card" id="usFinCard">
      <div class="name">US-Finanzierung</div>
      <div class="usfin-signal-row">
        <div class="light" id="usFinLight"><span class="statusword" id="usFinDays">–</span></div>
        <div class="fed-intervention" title="Fed-Intervention">
          <div class="fed-arrow stopped" id="fedInterventionArrow">↻</div>
          <div class="fed-days" id="fedInterventionDays">–</div>
        </div>
      </div>
      <div class="price" id="usFinPrice">1,37 Bio. $</div>
      <div class="small" id="usFinSmall">Treasury-Auktionen · lädt</div>
      <div class="error" id="usFinError"></div>
    </div>`;

    const body=document.querySelector('.page:nth-child(3) .detailbody');
    if(body&&!document.getElementById('usFinancingRules')){
      const box=document.createElement('div');
      box.id='usFinancingRules';
      box.innerHTML=`<div class="detailtitle">US-Finanzierung · Version 1.1</div>
        <div class="rule"><b>Belastungstest bis Jahresende</b><br>Für Jul–Dez 2026 sind 1,367 Bio. $ Netto-Marktschuldenaufnahme angesetzt: Q3 739 Mrd. $ · Q4 628 Mrd. $. Die Summe selbst färbt die Ampel nicht. Entscheidend ist, ob der Markt die Emissionen sauber absorbiert.</div>
        <div class="rule"><b>Auktionsampel</b><br><span id="usFinAuctionDetail">Wartet auf Auktionsdaten.</span><br><br>Jede relevante Note-/Bond-Auktion wird mit bis zu acht vorigen Auktionen derselben Laufzeit verglichen. Kernwerte: Bid-to-Cover, Primary-Dealer-Anteil und Indirect-Bidder-Anteil. Die letzten drei Auktionen wirken mit 60/25/15 % nach; wiederholte ernst schwache Ergebnisse erzwingen mindestens Orange.</div>
        <div class="rule"><b>Ampellogik</b><br>🟢 normal absorbiert · 🟡 erste deutliche Schwäche · 🟠 ernst oder wiederholt schwach · 🔴 schwere bzw. wiederholte Funktionsstörung. Bills werden wegen ihrer sehr hohen Auktionsfrequenz nicht für die Ampelfarbe verwendet; sie würden sonst jeden anderen Befund zuschütten.</div>
        <div class="rule"><b>Fed-Pfeil</b><br><span id="usFinFedDetail">Wartet auf NY-Fed-Daten.</span><br><br>↻ steht = kein außergewöhnlicher Eingriff. Langsames Drehen = zusätzliche begrenzte Stützung wegen Treasury-Marktstress. Schnelles Drehen = massive oder wiederholte Stabilisierung. Normale SOMA-Rollover, Reinvestments und Reserve-Management-Käufe zählen ausdrücklich nicht als Krisenintervention.</div>
        <div class="rule"><b>Zeit</b><br>Ampelfarbe und Fed-Pfeil führen getrennte Tageszähler. Ein Farb- oder Interventionswechsel setzt nur den jeweiligen Zähler zurück.</div>`;
      body.appendChild(box);
    }
    load();
    return true;
  }

  async function load(){
    const light=document.getElementById('usFinLight'),days=document.getElementById('usFinDays'),price=document.getElementById('usFinPrice'),small=document.getElementById('usFinSmall'),err=document.getElementById('usFinError');
    const arrow=document.getElementById('fedInterventionArrow'),arrowDays=document.getElementById('fedInterventionDays');
    if(!light||!days||!arrow)return;
    try{
      const r=await fetch('./us-financing.json?ts='+Date.now(),{cache:'no-store'});if(!r.ok)throw new Error('HTTP '+r.status);
      const x=await r.json(),a=x.latest_auction||{},i=x.intervention||{};
      light.style.background=cmap[x.status]||cmap.unknown;
      days.textContent=String(x.days_in_status||1);
      price.textContent=(x.label||'?')+' · 1,37 Bio. $';
      small.textContent=a.date?('Letzte: '+a.security+' · '+a.date):'Wartet auf ersten Auktionslauf';
      arrow.className='fed-arrow '+(i.state==='fast'?'fast':i.state==='slow'?'slow':'stopped');
      arrowDays.textContent=String(i.days_in_state||1)+' T';
      arrow.title=i.label||'Fed-Intervention';
      if(err)err.style.display='none';
      const ad=document.getElementById('usFinAuctionDetail');
      if(ad){
        const parts=[];
        if(a.date)parts.push('<b style="color:var(--text)">'+a.security+' · '+a.date+' · '+String(a.status||'').toUpperCase()+'</b>');
        if(a.bid_to_cover!=null)parts.push('Bid-to-Cover '+n(a.bid_to_cover,2)+(a.bid_to_cover_baseline!=null?' (Vergleich '+n(a.bid_to_cover_baseline,2)+')':''));
        if(a.dealer_share_pct!=null)parts.push('Dealer '+n(a.dealer_share_pct,1)+' %'+(a.dealer_baseline_pct!=null?' (Vergleich '+n(a.dealer_baseline_pct,1)+' %)':''));
        if(a.indirect_share_pct!=null)parts.push('Indirect '+n(a.indirect_share_pct,1)+' %'+(a.indirect_baseline_pct!=null?' (Vergleich '+n(a.indirect_baseline_pct,1)+' %)':''));
        ad.innerHTML=parts.join('<br>')||'Noch keine abgeschlossene relevante Auktion erfasst.';
      }
      const fd=document.getElementById('usFinFedDetail');
      if(fd)fd.innerHTML='<b style="color:var(--text)">'+(i.label||'?')+' · seit '+(i.days_in_state||1)+' Tag(en)</b><br>'+((i.evidence||[])[0]||i.reason||'');
    }catch(e){
      light.style.background=cmap.unknown;days.textContent='?';price.textContent='US-Finanzierung';small.textContent='Aktualisierung fehlgeschlagen';arrow.className='fed-arrow stopped';arrowDays.textContent='?';
      if(err){err.textContent='Wartet auf US-Finanzierungsdaten';err.style.display='block'}
    }
  }

  let tries=0;
  const timer=setInterval(()=>{tries++;if(install()||tries>40)clearInterval(timer)},100);
  setInterval(load,3600000);
  window.loadUSFinancing=load;
})();
