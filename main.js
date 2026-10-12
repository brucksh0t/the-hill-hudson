// The Hill concept: 2027 date request checker.
// Facts used (hudsonvalleyweddings.net): weddings May–October, one per weekend, barn holds 75–300.
// No availability data is published, so every in-season date is "ask Lisa", never "open/booked".
(function(){
  var f=document.getElementById('checker');if(!f)return;
  var out=f.querySelector('[data-results]'),send=f.querySelector('[data-send]');
  var DAYS=['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
  var MON=['January','February','March','April','May','June','July','August','September','October','November','December'];
  function parse(v){var p=v.split('-');return new Date(Date.UTC(+p[0],p[1]-1,+p[2]));}
  function label(d){return DAYS[d.getUTCDay()]+', '+MON[d.getUTCMonth()]+' '+d.getUTCDate()+', '+d.getUTCFullYear();}
  function check(v){
    var d=parse(v),m=d.getUTCMonth(),y=d.getUTCFullYear(),dow=d.getUTCDay();
    if(y!==2027)return {cls:'closed',t:label(d)+': this checker covers 2027 only. Call to confirm other years.'};
    if(m<4||m>9)return {cls:'closed',t:label(d)+': outside the May–October season The Hill publishes.'};
    var wk=(dow===0||dow>=5)?' A weekend date.':' A weekday. Ask whether weekdays are offered.';
    return {cls:'later',t:label(d)+': in season.'+wk+' Availability not published. Lisa confirms.'};
  }
  var mm=window.gsap&&gsap.matchMedia?gsap.matchMedia():null,motion=false,ready=false;
  if(mm)mm.add('(prefers-reduced-motion: no-preference)',function(){motion=true;return function(){motion=false;};});
  function animate(){
    if(!ready||!motion)return;
    var li=out.querySelectorAll('li');gsap.killTweensOf(li);
    gsap.fromTo(li,{opacity:0,y:16},{opacity:1,y:0,duration:0.6,ease:'power2.out',stagger:0.08,clearProps:'transform'});
    var d=out.querySelectorAll('.dot');gsap.killTweensOf(d);
    gsap.fromTo(d,{scale:0},{scale:1,duration:0.4,ease:'power2.out',stagger:0.08,delay:0.15});
  }
  function update(){
    var rows=[],lines=[];
    ['d1','d2','d3'].forEach(function(n,i){var v=f.elements[n].value;if(!v)return;var r=check(v);
      rows.push('<li><span class="dot dot--'+r.cls+'" aria-hidden="true"></span><span><b>'+(i?'Alternate '+i:'First choice')+':</b> '+r.t+'</span></li>');
      var flag=r.cls==='closed'?(/2027 only/.test(r.t)?' (outside 2027, which this request covers)':' (outside the May–October season)'):'';
      lines.push('- '+(i?'Alternate '+i:'First choice')+': '+label(parse(v))+flag);});
    var g=parseInt(f.elements.guests.value,10);
    if(g){var gt=g<75?'Fewer than 75 guests. The Hill’s stated range is 75–300, so call to confirm smaller weddings.':g>300?'More than 300 guests. The Hill’s stated range is 75–300, so call to confirm.':g+' guests fits the barn’s listed 75–300.';
      rows.push('<li><span class="dot dot--'+((g>300||g<75)?'later':'open')+'" aria-hidden="true"></span><span><b>Guests:</b> '+gt+'</span></li>');}
    var html=rows.length?rows.join(''):'<li>Pick a date to check it against the May–October season.</li>';
    if(html!==out.innerHTML){out.innerHTML=html;animate();}
    var body='Hi Lisa,\n\nWe’re looking at The Hill for our 2027 wedding. Our dates:\n'+(lines.join('\n')||'- (dates)')+'\n- Guests: about '+(g||'?')+'\n\nAre any of these open? We’d also love to schedule a tour.\n\nThank you,\n'+'Name: '+f.elements.name.value.trim()+'\nPhone: '+f.elements.phone.value.trim()+'\n';
    send.href='mailto:lisacoon231@gmail.com?subject='+encodeURIComponent('2027 date request')+'&body='+encodeURIComponent(body);
  }
  f.addEventListener('input',update);f.addEventListener('change',update);update();ready=true;
  window.__hill={check:check,motion:function(){return motion;}};
})();
