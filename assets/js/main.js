/* Lakeway Luxury Car Suites — shared behavior (20-page) */
(function(){
  document.body.classList.remove('no-js');
  var header=document.getElementById('header');
  if(header){var s=function(){header.classList.toggle('scrolled',window.scrollY>40)};window.addEventListener('scroll',s);s();}
  var burger=document.getElementById('hamburger'), links=document.getElementById('navLinks');
  if(burger&&links){
    burger.addEventListener('click',function(){links.classList.toggle('open')});
    links.querySelectorAll('a').forEach(function(a){a.addEventListener('click',function(){links.classList.remove('open')})});
  }
  // Reveal engine — scroll-position based (no IntersectionObserver dependency)
  document.querySelectorAll('.split-media, .model-media, .contact-photo, .showcase-main').forEach(function(el){el.classList.add('reveal-img')});
  var revealEls=Array.prototype.slice.call(document.querySelectorAll('.reveal, .reveal-img'));
  function checkReveals(){
    var vh=window.innerHeight;
    for(var i=revealEls.length-1;i>=0;i--){
      var el=revealEls[i], r=el.getBoundingClientRect();
      var vis=r.top<vh*0.9 && r.bottom>vh*0.05;
      var replay=el.closest('.statement');
      if(vis){el.classList.add('in'); if(!replay) revealEls.splice(i,1);}
      else if(replay){el.classList.remove('in');}
    }
  }
  // panels join the reveal engine (staggered text rise)
  document.querySelectorAll('.panel').forEach(function(el){revealEls.push(el)});
  // scroll progress hairline
  var prog=document.createElement('div'); prog.className='scroll-progress'; document.body.appendChild(prog);
  // parallax depth on panel backgrounds
  var pxPanels=Array.prototype.slice.call(document.querySelectorAll('.panel .bg img'));
  function fx(){
    var vh=window.innerHeight;
    var max=document.body.scrollHeight-vh;
    prog.style.width=(max>0?(window.scrollY/max*100):0)+'%';
    for(var i=0;i<pxPanels.length;i++){
      var r=pxPanels[i].parentElement.getBoundingClientRect();
      if(r.bottom<0||r.top>vh) continue;
      var t=((r.top+r.height/2)/vh-0.5)*36;
      pxPanels[i].style.transform='translateY('+t.toFixed(1)+'px) scale(1.12)';
    }
  }
  var rvLast=0;
  function onRv(){ var n=Date.now(); if(n-rvLast<60) return; rvLast=n; checkReveals(); fx(); }
  window.addEventListener('scroll',onRv,{passive:true});
  window.addEventListener('resize',onRv);
  checkReveals(); fx(); setTimeout(function(){checkReveals();fx();},350); window.addEventListener('load',checkReveals);
  setInterval(function(){checkReveals();fx();},450); /* safety net: guarantees reveals in throttled/background contexts */
  // entrance choreography
  setTimeout(function(){document.body.classList.add('entered')},90);
  // magnetic buttons
  document.querySelectorAll('.btn').forEach(function(b){
    b.style.transition=b.style.transition||'';
    b.addEventListener('mousemove',function(e){
      var r=b.getBoundingClientRect();
      var dx=(e.clientX-(r.left+r.width/2))/r.width, dy=(e.clientY-(r.top+r.height/2))/r.height;
      b.style.transform='translate('+(dx*7).toFixed(1)+'px,'+(dy*5).toFixed(1)+'px)';
    });
    b.addEventListener('mouseleave',function(){ b.style.transform=''; });
  });

  // FAQ accordion
  document.querySelectorAll('.faq-q').forEach(function(q){
    q.addEventListener('click',function(){q.parentElement.classList.toggle('open')});
  });

  // Contact / showings form -> delivers every lead by email (FormSubmit, no backend needed)
  var form=document.getElementById('contactForm');
  if(form){
    var LEAD_EMAIL='lakewayluxurycarsuites@gmail.com';
    var q=new URLSearchParams(location.search).get('unit')||new URLSearchParams(location.search).get('model');
    if(q){var msg=form.querySelector('#msg');if(msg)msg.value="I'm interested in "+q+". Please send availability, pricing, and a private tour.";}
    form.addEventListener('submit',function(e){e.preventDefault();
      var g=function(id){var el=document.getElementById(id);return el?(''+el.value).trim():'';};
      var note=document.getElementById('formNote');
      var btn=form.querySelector('button[type=submit]');
      var first=g('fn'),last=g('ln'),email=g('em');
      if(!first||!last||!email){if(note){note.textContent='Please add your name and email so we can reach you.';note.style.color='#b3402e';}return;}
      var payload={
        Name:(first+' '+last).replace(/\s+/g,' ').trim(),
        Email:email, Phone:g('ph'), Inquiry:g('ty'),
        Preferred_Date:g('dt'), Preferred_Time:g('tm'), Message:g('msg'),
        Source_Page:(document.title||'')+' — '+location.href,
        _subject:'New lead — '+(document.title||'Lakeway Luxury Car Suites'),
        _template:'table'
      };
      Object.keys(payload).forEach(function(k){if(payload[k]==='')delete payload[k];});
      if(btn){btn.textContent='Sending…';btn.disabled=true;}
      fetch('https://formsubmit.co/ajax/'+LEAD_EMAIL,{method:'POST',
        headers:{'Content-Type':'application/json','Accept':'application/json'},
        body:JSON.stringify(payload)})
      .then(function(r){return r.json();})
      .then(function(){
        if(note){note.textContent='Thank you — your inquiry has been received. Our team will be in touch shortly.';note.style.color='#1c1a17';}
        if(btn){btn.textContent='Submitted ✓';}
        form.reset();
      })
      .catch(function(){
        if(note){note.innerHTML='We couldn’t send that automatically. Please email us directly at <a href="mailto:'+LEAD_EMAIL+'" style="border-bottom:1px solid currentColor">'+LEAD_EMAIL+'</a>.';note.style.color='#b3402e';}
        if(btn){btn.textContent='Try Again';btn.disabled=false;}
      });
    });
  }
})();

/* Interactive site plan (availability page) */
(function(){
  var plan=document.getElementById('plan'); if(!plan) return;
  var P=function(k){return 'assets/img/'+k;};
  var SUITES={
    'L1':{name:'The Flagship Residence',model:'Completed · Move-In Ready',page:'residences.html',view:'Tour the Residence',status:'available',badge:'Move-In Ready',sqft:'5,004',bays:'Up to 10 cars + living',ceiling:'Two-story gallery',cta:'Book a Private Tour',img:P('property/photo-07.jpg')},
    'L2':{name:'Residence Two',model:'Completed · The Twin Gallery',page:'contact.html?unit=Residence%20Two',view:'Contact Sales',status:'available',badge:'Completed',sqft:'Inquire',bays:'Twin gallery residence',ceiling:'Two-story gallery',cta:'Inquire About Residence Two',img:P('property/photo-09.jpg')},
    'L3':{name:'Homesite L3',model:'Homesite',page:'availability.html',view:'View the Site Plan',status:'available',sqft:'Inquire',bays:'Details on request',ceiling:'Homesite',cta:'Inquire About This Homesite',img:P('property/photo-11.jpg')},
    'L4':{name:'Homesite L4',model:'Homesite',page:'availability.html',view:'View the Site Plan',status:'available',sqft:'Inquire',bays:'Details on request',ceiling:'Homesite',cta:'Inquire About This Homesite',img:P('property/photo-15.jpg')},
    'L5':{name:'Homesite L5',model:'Reserved',page:'availability.html',view:'View the Site Plan',status:'reserved',sqft:'Inquire',bays:'Details on request',ceiling:'Homesite',cta:'Join the Waitlist',img:P('property/photo-18.jpg')},
    'L6':{name:'Homesite L6',model:'Homesite',page:'availability.html',view:'View the Site Plan',status:'available',sqft:'Inquire',bays:'Details on request',ceiling:'Homesite',cta:'Inquire About This Homesite',img:P('property/photo-19.jpg')}
  };
  var detail=document.getElementById('suiteDetail');
  function render(id){
    var s=SUITES[id]; if(!s) return;
    plan.querySelectorAll('.unit').forEach(function(u){u.classList.toggle('selected',u.dataset.id===id)});
    var sold=s.status!=='available';
    var primary=s.cta||(sold?'Join the Waitlist':'Reserve This Lot');
    var actions='<a class="btn '+(sold?'':'btn-solid')+' btn-sm" href="contact.html?unit='+encodeURIComponent(s.name)+'">'+primary+'</a><a class="btn btn-sm" href="'+s.page+'">'+(s.view||'Learn More')+'</a>';
    var sizeVal=(/^[\d,]+$/.test(s.sqft)?s.sqft+' sf':s.sqft);
    detail.innerHTML=
      '<img src="'+s.img+'" alt="'+s.name+'" style="width:calc(100% + 68px);max-width:none;height:190px;object-fit:cover;margin:-34px -34px 26px">'
      +'<span class="sd-status '+s.status+'">'+(s.badge||s.status)+'</span>'
      +'<div class="sd-name">'+s.name+'</div>'
      +'<div class="sd-sub">'+s.model+' · Texas Hill Country</div>'
      +'<div class="sd-specs"><div><div class="k">Interior</div><div class="v">'+sizeVal+'</div></div>'
      +'<div><div class="k">Capacity</div><div class="v" style="font-size:16px">'+s.bays+'</div></div>'
      +'<div><div class="k">Gallery</div><div class="v" style="font-size:16px">'+s.ceiling+'</div></div>'
      +'<div><div class="k">Ownership</div><div class="v" style="font-size:16px">Outright</div></div></div>'
      +'<div class="sd-actions" style="margin-top:20px">'+actions+'</div>';
  }
  plan.querySelectorAll('.unit').forEach(function(u){
    u.setAttribute('tabindex','0');
    u.addEventListener('click',function(){render(u.dataset.id)});
    u.addEventListener('keypress',function(e){if(e.key==='Enter')render(u.dataset.id)});
  });
  render('L1');
})();

/* Lightbox — full-screen viewer with a public API (window.LB) */
(function(){
  var lb=document.createElement('div'); lb.className='lightbox';
  lb.innerHTML='<button class="lb-close" aria-label="Close">&times;</button><button class="lb-prev" aria-label="Previous">&#8249;</button><img alt="Photo"/><button class="lb-next" aria-label="Next">&#8250;</button><div class="lb-count"></div>';
  document.body.appendChild(lb);
  var lbImg=lb.querySelector('img'), count=lb.querySelector('.lb-count'), list=[], idx=0;
  function show(i){ if(!list.length) return; idx=(i+list.length)%list.length; lbImg.src=list[idx]; count.textContent=(idx+1)+' / '+list.length; }
  function open(srcs,i){ list=srcs; show(i||0); lb.classList.add('open'); document.body.style.overflow='hidden'; }
  function close(){ lb.classList.remove('open'); document.body.style.overflow=''; }
  lb.querySelector('.lb-close').addEventListener('click',close);
  lb.querySelector('.lb-prev').addEventListener('click',function(e){ e.stopPropagation(); show(idx-1); });
  lb.querySelector('.lb-next').addEventListener('click',function(e){ e.stopPropagation(); show(idx+1); });
  lb.addEventListener('click',function(e){ if(e.target===lb) close(); });
  document.addEventListener('keydown',function(e){
    if(!lb.classList.contains('open')) return;
    if(e.key==='Escape') close();
    if(e.key==='ArrowLeft') show(idx-1);
    if(e.key==='ArrowRight') show(idx+1);
  });
  window.LB={open:open};
  // auto-bind static galleries (campaign graphics etc.)
  var autos=Array.prototype.slice.call(document.querySelectorAll('.gal-grid img, .campaign-grid img'));
  var srcs=autos.map(function(im){ return im.currentSrc||im.src; });
  autos.forEach(function(im,i){ im.style.cursor='zoom-in'; im.addEventListener('click',function(){ open(srcs.slice(),i); }); });
})();

/* Hero slideshow — slow crossfade (homepage) */
(function(){
  var hero=document.getElementById('heroSlides'); if(!hero) return;
  var slides=hero.querySelectorAll('.hero-media img.hs'); if(slides.length<2) return;
  var i=0;
  setInterval(function(){
    slides[i].classList.remove('on');
    i=(i+1)%slides.length;
    slides[i].classList.add('on');
  }, 6500);
})();

/* Flagship showcase — photo browser (residences) */
(function(){
  var sc=document.getElementById('showcase'); if(!sc) return;
  var P=function(n){ return 'assets/img/property/photo-'+n+'.jpg'; };
  var IDS=['00','05','06','35','36','07','08','09','10','12','13','14','16','17','18','20','21','22','24','26','28','30','33','01','02','03','04','37','38'];
  var thumbsEl=document.getElementById('scThumbs'),
      mainEl=document.getElementById('scMain'), countEl=document.getElementById('scCount');
  var idx=0;
  function renderMain(){
    mainEl.style.opacity=0;
    setTimeout(function(){ mainEl.src=P(IDS[idx]); mainEl.onload=function(){ mainEl.style.opacity=1; }; },180);
    countEl.textContent=(idx+1)+' / '+IDS.length;
    var ths=thumbsEl.querySelectorAll('img');
    ths.forEach(function(t,j){ t.classList.toggle('on', j===idx); });
    var on=ths[idx]; if(on&&on.scrollIntoView) on.scrollIntoView({block:'nearest',inline:'center',behavior:'smooth'});
  }
  IDS.forEach(function(n,j){
    var t=document.createElement('img');
    t.src=P(n); t.loading='lazy'; t.alt='Photo '+(j+1);
    t.addEventListener('click',function(){ idx=j; renderMain(); });
    thumbsEl.appendChild(t);
  });
  sc.querySelector('.sc-prev').addEventListener('click',function(){ idx=(idx-1+IDS.length)%IDS.length; renderMain(); });
  sc.querySelector('.sc-next').addEventListener('click',function(){ idx=(idx+1)%IDS.length; renderMain(); });
  sc.querySelector('.sc-expand').addEventListener('click',function(){ if(window.LB) LB.open(IDS.map(P), idx); });
  mainEl.addEventListener('click',function(){ if(window.LB) LB.open(IDS.map(P), idx); });
  mainEl.style.cursor='zoom-in';
  renderMain();
})();

/* Supercar carousel — auto-advance, arrows, dots, swipe */
(function(){
  var car=document.getElementById('carCarousel'); if(!car) return;
  var track=car.querySelector('.car-track'), slides=car.querySelectorAll('.car-slide'), dots=car.querySelector('.car-dots');
  var n=slides.length, i=0, timer=null;
  for(var d=0; d<n; d++){ var b=document.createElement('button'); b.setAttribute('aria-label','Slide '+(d+1)); (function(k){ b.addEventListener('click',function(){ go(k,true); }); })(d); dots.appendChild(b); }
  var dotEls=dots.querySelectorAll('button');
  function go(k,manual){
    i=(k+n)%n;
    track.style.transform='translateX(-'+(i*100)+'%)';
    dotEls.forEach(function(el,j){ el.classList.toggle('on', j===i); });
    if(manual) restart();
  }
  function next(){ go(i+1); }
  function restart(){ if(timer) clearInterval(timer); timer=setInterval(next, 5000); }
  car.querySelector('.car-prev').addEventListener('click',function(){ go(i-1,true); });
  car.querySelector('.car-next').addEventListener('click',function(){ go(i+1,true); });
  car.addEventListener('mouseenter',function(){ if(timer) clearInterval(timer); });
  car.addEventListener('mouseleave',restart);
  var x0=null;
  car.addEventListener('touchstart',function(e){ x0=e.touches[0].clientX; },{passive:true});
  car.addEventListener('touchend',function(e){
    if(x0===null) return;
    var dx=e.changedTouches[0].clientX-x0;
    if(Math.abs(dx)>40) go(i+(dx<0?1:-1),true);
    x0=null;
  },{passive:true});
  go(0); restart();
})();

/* Animated stat counters — numbers count up when scrolled into view */
(function(){
  var stats=Array.prototype.slice.call(document.querySelectorAll('.stat .n'));
  if(!stats.length) return;
  function runCounter(el){
    var m=el.textContent.trim().match(/^([\d,]+)$/); if(!m) return;
    var target=parseInt(m[1].replace(/,/g,''),10), t0=null;
    function step(ts){
      if(!t0) t0=ts;
      var p=Math.min(1,(ts-t0)/1400); p=1-Math.pow(1-p,3);
      el.textContent=Math.round(target*p).toLocaleString('en-US');
      if(p<1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  function checkStats(){
    var vh=window.innerHeight;
    for(var i=stats.length-1;i>=0;i--){
      var r=stats[i].getBoundingClientRect();
      if(r.top<vh*0.88 && r.bottom>0){ runCounter(stats[i]); stats.splice(i,1); }
    }
    if(!stats.length){ window.removeEventListener('scroll',onSt); }
  }
  var stLast=0;
  function onSt(){ var n=Date.now(); if(n-stLast<120) return; stLast=n; checkStats(); }
  window.addEventListener('scroll',onSt,{passive:true});
  checkStats(); setTimeout(checkStats,350);
  var stTimer=setInterval(function(){ checkStats(); if(!stats.length) clearInterval(stTimer); },450);
})();

/* Subtle hero parallax (subpages; homepage keeps its slow zoom) */
(function(){
  var hero=document.querySelector('.hero:not(.kenburns) .hero-media img');
  if(!hero) return;
  var ticking=false;
  window.addEventListener('scroll',function(){
    if(ticking) return; ticking=true;
    requestAnimationFrame(function(){
      var y=window.scrollY;
      if(y<window.innerHeight) hero.style.transform='translateY('+(y*0.16)+'px) scale(1.06)';
      ticking=false;
    });
  },{passive:true});
})();
