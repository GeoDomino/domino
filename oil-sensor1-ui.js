(()=>{
  const target=document.getElementById('oilComponents');
  if(!target)return;
  const description='<div class="rule" data-oil-sensor1-note><b>Sensor 1 Ölversorgung · Angebot/Nachfrage-Balance (Global Supply–Demand Balance)</b><br>Misst, ob die weltweite Ölproduktion den weltweiten Verbrauch deckt oder ob ein Defizit bzw. Überschuss in Mio. Barrel pro Tag entsteht.<br><span style="color:var(--muted)">Quelle: U.S. EIA Short-Term Energy Outlook (STEO). Der STEO wird monatlich veröffentlicht; der angezeigte Wert ist daher kein Tagesmesswert.</span></div>';
  function apply(){
    if(target.querySelector('[data-oil-sensor1-note]'))return;
    target.insertAdjacentHTML('afterbegin',description);
  }
  apply();
  new MutationObserver(()=>requestAnimationFrame(apply)).observe(target,{childList:true,subtree:true});
})();
