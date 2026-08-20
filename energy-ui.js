(()=>{
  const ids=[['light','date'],['oilLight','oilDate'],['transportLight','transportDate'],['refLight','refDate'],['stockLight','stockDate'],['costLight','costDate']];
  function dayNumber(text){
    if(!text||text==='–') return '–';
    if(/seit heute/i.test(text)) return '1';
    let m=text.match(/seit\s+(\d+)\s+Tag/i);
    if(m) return String(Number(m[1])+1);
    return '–';
  }
  function apply(lightId,dateId){
    const light=document.getElementById(lightId), date=document.getElementById(dateId);
    if(!light||!date) return;
    let span=light.querySelector('.statusword');
    if(!span){ span=document.createElement('span'); span.className='statusword'; light.appendChild(span); }
    const sync=()=>{ span.textContent=dayNumber(date.textContent.trim()); date.style.display='none'; };
    sync();
    new MutationObserver(sync).observe(date,{childList:true,subtree:true,characterData:true});
  }
  ids.forEach(x=>apply(...x));
})();
