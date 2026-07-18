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
  var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}})},{threshold:0.12});
  document.querySelectorAll('.reveal').forEach(function(el){io.observe(el)});

  // FAQ accordion
  document.querySelectorAll('.faq-q').forEach(function(q){
    q.addEventListener('click',function(){q.parentElement.classList.toggle('open')});
  });

  // Contact form + suite prefill
  var form=document.getElementById('contactForm');
  if(form){
    var q=new URLSearchParams(location.search).get('unit')||new URLSearchParams(location.search).get('model');
    if(q){var msg=form.querySelector('#msg');if(msg)msg.value="I'm interested in "+q+". Please send availability, pricing, and a private tour.";}
    form.addEventListener('submit',function(e){e.preventDefault();
      var n=document.getElementById('formNote');if(n){n.textContent='Thank you — your inquiry has been received. Our team will be in touch shortly.';n.style.color='var(--gold-light)';}
      var b=form.querySelector('button[type=submit]');if(b){b.textContent='Submitted ✓';b.disabled=true;}
    });
  }
})();

/* Interactive site plan (availability page) */
(function(){
  var plan=document.getElementById('plan'); if(!plan) return;
  var P=function(k){return 'assets/img/'+k;};
  var SUITES={
    'A1':{name:'The Summit · A1',model:'The Summit',page:'summit.html',status:'available',sqft:'6,000',bays:'10–12 cars + living',ceiling:'28 ft',price:'From $2,150,000',img:P('lineup.jpg')},
    'A2':{name:'The Summit · A2',model:'The Summit',page:'summit.html',status:'sold',sqft:'6,000',bays:'10–12 cars + living',ceiling:'28 ft',price:'Sold',img:P('mclaren.jpg')},
    'B1':{name:'The Overlook · B1',model:'The Overlook',page:'overlook.html',status:'available',sqft:'4,500',bays:'8–10 cars + living',ceiling:'26 ft',price:'From $1,650,000',img:P('dream-car.jpg')},
    'B2':{name:'The Overlook · B2',model:'The Overlook',page:'overlook.html',status:'reserved',sqft:'4,500',bays:'8–10 cars + living',ceiling:'26 ft',price:'From $1,650,000',img:P('ferrari.jpg')},
    'B3':{name:'The Overlook · B3',model:'The Overlook',page:'overlook.html',status:'available',sqft:'4,500',bays:'8–10 cars + living',ceiling:'26 ft',price:'From $1,650,000',img:P('lineup.jpg')},
    'C1':{name:'The Ranch · C1',model:'The Ranch',page:'ranch.html',status:'sold',sqft:'3,000',bays:'6–8 cars + mezz',ceiling:'24 ft',price:'Sold',img:P('mclaren.jpg')},
    'C2':{name:'The Ranch · C2',model:'The Ranch',page:'ranch.html',status:'available',sqft:'3,000',bays:'6–8 cars + mezz',ceiling:'24 ft',price:'From $1,180,000',img:P('dream-car.jpg')},
    'C3':{name:'The Ranch · C3',model:'The Ranch',page:'ranch.html',status:'reserved',sqft:'3,000',bays:'6–8 cars + mezz',ceiling:'24 ft',price:'From $1,180,000',img:P('ferrari.jpg')},
    'C4':{name:'The Ranch · C4',model:'The Ranch',page:'ranch.html',status:'available',sqft:'3,000',bays:'6–8 cars + mezz',ceiling:'24 ft',price:'From $1,180,000',img:P('lineup.jpg')},
    'D1':{name:'The Retreat · D1',model:'The Retreat',page:'retreat.html',status:'available',sqft:'2,250',bays:'4–6 cars + loft',ceiling:'22 ft',price:'From $895,000',img:P('mclaren.jpg')},
    'D2':{name:'The Retreat · D2',model:'The Retreat',page:'retreat.html',status:'available',sqft:'2,250',bays:'4–6 cars + loft',ceiling:'22 ft',price:'From $895,000',img:P('dream-car.jpg')},
    'D3':{name:'The Retreat · D3',model:'The Retreat',page:'retreat.html',status:'reserved',sqft:'2,250',bays:'4–6 cars + loft',ceiling:'22 ft',price:'From $895,000',img:P('ferrari.jpg')},
    'D4':{name:'The Retreat · D4',model:'The Retreat',page:'retreat.html',status:'available',sqft:'2,250',bays:'4–6 cars + loft',ceiling:'22 ft',price:'From $895,000',img:P('lineup.jpg')}
  };
  var detail=document.getElementById('suiteDetail');
  function render(id){
    var s=SUITES[id]; if(!s) return;
    plan.querySelectorAll('.unit').forEach(function(u){u.classList.toggle('selected',u.dataset.id===id)});
    var sold=s.status!=='available';
    var actions=sold
      ? '<a class="btn btn-sm" href="contact.html?unit='+encodeURIComponent(s.name)+'">Join the Waitlist</a><a class="btn btn-sm" href="'+s.page+'">View '+s.model+'</a>'
      : '<a class="btn btn-solid btn-sm" href="contact.html?unit='+encodeURIComponent(s.name)+'">Reserve This Unit</a><a class="btn btn-sm" href="'+s.page+'">View '+s.model+'</a>';
    detail.innerHTML=
      '<img src="'+s.img+'" alt="'+s.name+'" style="width:calc(100% + 68px);max-width:none;height:190px;object-fit:cover;margin:-34px -34px 26px">'
      +'<span class="sd-status '+s.status+'">'+s.status+'</span>'
      +'<div class="sd-name">'+s.name+'</div>'
      +'<div class="sd-sub">'+s.model+' · Texas Hill Country</div>'
      +'<div class="sd-specs"><div><div class="k">Interior</div><div class="v">'+s.sqft+' sf</div></div>'
      +'<div><div class="k">Capacity</div><div class="v" style="font-size:16px">'+s.bays+'</div></div>'
      +'<div><div class="k">Clear Height</div><div class="v">'+s.ceiling+'</div></div>'
      +'<div><div class="k">Ownership</div><div class="v" style="font-size:16px">Deeded</div></div></div>'
      +'<div class="sd-price">'+s.price+'</div><div class="sd-actions">'+actions+'</div>';
  }
  plan.querySelectorAll('.unit').forEach(function(u){
    u.setAttribute('tabindex','0');
    u.addEventListener('click',function(){render(u.dataset.id)});
    u.addEventListener('keypress',function(e){if(e.key==='Enter')render(u.dataset.id)});
  });
  render('A1');
})();
