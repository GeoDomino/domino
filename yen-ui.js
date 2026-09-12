(()=>{
  const css=document.createElement('style');
  css.textContent=`
    #yenBalance{margin:7px 0 3px}
    #yenTrack{position:relative;height:12px;border-radius:8px;background:linear-gradient(90deg,var(--red) 0 8%,var(--orange) 8% 16%,var(--yellow) 16% 27%,var(--green) 27% 73%,var(--yellow) 73% 84%,var(--orange) 84% 92%,var(--red) 92% 100%);opacity:.9}
    #yenMarker{position:absolute;top:50%;width:16px;height:16px;border:2px solid #fff;border-radius:50%;background:#111;transform:translate(-50%,-50%);box-shadow:0 0 6px rgba(0,0,0,.6)}
    #yenEnds{display:flex;justify-content:space-between;font-size:9px;color:var(--muted);margin-top:3px}
    #yenSpin{display:inline-block;margin-left:5px;font-size:18px;line-height:1;vertical-align:-2px}
    #yenSpin.active{animation:yenSpin 2.4s linear infinite}
    #yenSpin.fast{animation-duration:1.1s}
    #yenSpin.veryfast{animation-duration:.55s}
    @keyframes yenSpin{to{transform:rotate(360deg)}}
  `;document.head.appendChild(css);

  const colors={green:'var(--green)',yellow:'var(--yellow)',orange:'var(--orange)',red:'var(--red)',unknown:'var(--unknown)'};
  function pctPosition(v){const lo=130,hi=171;return Math.max(2,Math.min(98,(v-lo)/(hi-lo)*100))}
  async function loadYen(){
    const light=document.getElementById('yenLight'),status=document.getElementById('yenStatus'),price=document.getElementById('yenPrice'),small=document.getElementById('yenDate'),err=document.getElementById('yenError');
    if(!light||!status||!price||!small)return;
    try{
      const r=await fetch('./yen-stress.json?ts='+Date.now(),{cache:'no-store'});if(!r.ok)throw 0;
      const x=await r.json(),rate=Number(x.usd_jpy),ch=Number(x.change_5d_pct);
      light.style.background=colors[x.status]||colors.unknown;
      status.innerHTML=(x.label||'?')+' <span id="yenSpin" aria-label="Dynamik">↻</span>';
      const spin=document.getElementById('yenSpin');
      if(spin&&Number(x.speed_level)>0){spin.className='active'+(Number(x.speed_level)>=3?' veryfast':Number(x.speed_level)>=2?' fast':'');}
      price.textContent='USD/JPY '+rate.toLocaleString('de-DE',{minimumFractionDigits:2,maximumFractionDigits:2});
      const dir=ch<0?'Yen stärker ←':ch>0?'→ Yen schwächer':'stabil';
      small.innerHTML=dir+' · 5T '+(ch>=0?'+':'')+ch.toLocaleString('de-DE',{minimumFractionDigits:2,maximumFractionDigits:2})+' %<div id="yenBalance"><div id="yenTrack"><span id="yenMarker" style="left:'+pctPosition(rate)+'%"></span></div><div id="yenEnds"><span>Yen zu stark</span><span>Balance</span><span>Yen zu schwach</span></div></div>';
      if(err)err.style.display='none';
    }catch(e){status.textContent='?';light.style.background=colors.unknown;price.textContent='USD/JPY';small.textContent='Aktualisierung fehlgeschlagen';if(err){err.textContent='Wartet auf Yen-Daten';err.style.display='block'}}
  }
  window.loadYen=loadYen;
  setTimeout(loadYen,100);
  setInterval(loadYen,3600000);
})();
