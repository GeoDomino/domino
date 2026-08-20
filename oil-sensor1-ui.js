(()=>{
  const target=document.getElementById('oilComponents');
  if(!target)return;
  const description='<div class="rule" data-oil-sensor1-note><b>Sensor 1 Ölversorgung · Angebot/Nachfrage-Balance (Global Supply–Demand Balance)</b><br>Misst, ob die weltweite Ölproduktion den weltweiten Verbrauch deckt oder ob ein Defizit bzw. Überschuss in Mio. Barrel pro Tag entsteht.<br><span style="color:var(--muted)">Quelle: U.S. EIA Short-Term Energy Outlook (STEO). Der STEO wird monatlich veröffentlicht; der angezeigte Wert ist daher kein Tagesmesswert.</span><br><br><b>DOMINO-Schwellen:</b> 🟢 Defizit &lt;0,5 mb/d · 🟡 0,5–&lt;1,5 · 🟠 1,5–&lt;5,0 · 🔴 ab 5,0 mb/d.</div>';
  function apply(){
    if(target.querySelector('[data-oil-sensor1-note]'))return;
    target.insertAdjacentHTML('afterbegin',description);
  }
  apply();
  new MutationObserver(()=>requestAnimationFrame(apply)).observe(target,{childList:true,subtree:true});
})();
