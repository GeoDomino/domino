(()=>{
  const style=document.createElement('style');
  style.textContent=`.viewport{width:calc(100% + 24px)!important;max-width:none!important;margin-left:-12px!important;margin-right:-12px!important;overflow:hidden!important}.pages{min-width:0!important}.page{min-width:0!important;padding-left:4px!important;padding-right:4px!important;overflow:hidden!important}.page:nth-child(2){padding-left:2px!important;padding-right:10px!important}.grid{min-width:0!important;grid-template-columns:minmax(0,1fr) minmax(0,1fr)!important;gap:8px!important}.card{min-width:0!important;max-width:100%!important;overflow:hidden!important;padding-left:8px!important;padding-right:8px!important}.card>*{min-width:0!important;max-width:100%!important}.card .name,.card .price,.card .small{overflow-wrap:anywhere!important;word-break:normal!important}`;
  document.head.appendChild(style);

  const pairs=[['light','date'],['oilLight','oilDate'],['transportLight','transportDate'],['refLight','refDate'],['stockLight','stockDate'],['costLight','costDate']];
  function dayNumber(text){
    if(!text||text==='–')return '–';
    if(/seit heute/i.test(text))return '1';
    const m=text.match(/seit\s+(\d+)\s+Tag/i);
    return m?String(Number(m[1])+1):'–';
  }
  function apply(lightId,dateId){
    const light=document.getElementById(lightId),date=document.getElementById(dateId);
    if(!light||!date)return;
    let span=light.querySelector('.statusword');
    if(!span){span=document.createElement('span');span.className='statusword';light.appendChild(span)}
    const sync=()=>{span.textContent=dayNumber((date.textContent||'').trim());date.style.display='none'};
    sync();
    new MutationObserver(sync).observe(date,{childList:true,subtree:true,characterData:true});
  }
  pairs.forEach(([a,b])=>apply(a,b));

  const stocks=document.createElement('script');
  stocks.src='stocks-ui.js?v=20260820-1';
  document.body.appendChild(stocks);
})();
