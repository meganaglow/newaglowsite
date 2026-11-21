/* Horizon Financial concept: page switching, scroll reveal and a scripted intake demo.
   The intake summary is canned, not a live AI, and nothing is sent or saved. */
function showPage(id){
  document.querySelectorAll('.page').forEach(function(p){p.classList.remove('active')});
  var target=document.getElementById('page-'+id);
  if(target){target.classList.add('active')}
  document.querySelectorAll('nav.main button').forEach(function(b){
    var match = (b.dataset.page===id) || (id==='post-roth' && b.dataset.page==='blog');
    if(match){b.setAttribute('aria-current','page')}else{b.removeAttribute('aria-current')}
  });
  var nav=document.getElementById('mainNav');
  nav.classList.remove('open');
  var t=document.querySelector('.menu-toggle');
  if(t){t.setAttribute('aria-expanded','false')}
  window.scrollTo({top:0,behavior:'instant' in window?'instant':'auto'});
  requestAnimationFrame(revealInit);
}
function toggleMenu(btn){
  var nav=document.getElementById('mainNav');
  var open=nav.classList.toggle('open');
  btn.setAttribute('aria-expanded',open?'true':'false');
}
/* Scripted intake: turns the intro-call form into the summary a planner would read first.
   The "focus" lines are meeting prompts, never advice. */
var INTAKE_FOCUS={
  'Retirement planning':['When they hope to stop working, and what a good week looks like after that','What they have saved so far, and any pension or Social Security estimates','What worries them most about retiring'],
  'Investment management':['What they hold now, and where','How they felt during the last market drop','What the money is for, and when they will need it'],
  'Tax planning':['Anything in last year’s return that surprised them','One-off events coming up: a sale, a bonus, an inheritance','Who prepares their taxes today'],
  'Equity compensation':['Which grants they hold and when they vest','How much of their savings sits in employer stock','Any sales they are planning this year'],
  'Something else':['What prompted them to reach out now','What a good outcome looks like a year from today','Who else is part of the decision']
};
function intakeSummary(){
  var name=document.getElementById('f-name').value.trim()||'A new visitor';
  var topic=document.getElementById('f-topic').value;
  var msg=document.getElementById('f-msg').value.trim();
  var rows=[['From',name],['Topic',topic]];
  if(msg){rows.push(['In their words','“'+msg+'”'])}
  var dl=document.getElementById('intake-facts');dl.textContent='';
  rows.forEach(function(r){var dt=document.createElement('dt');dt.textContent=r[0];var dd=document.createElement('dd');dd.textContent=r[1];dl.appendChild(dt);dl.appendChild(dd)});
  var ul=document.getElementById('intake-focus');ul.textContent='';
  (INTAKE_FOCUS[topic]||INTAKE_FOCUS['Something else']).forEach(function(t){var li=document.createElement('li');li.textContent=t;ul.appendChild(li)});
  var box=document.getElementById('intake');
  var panel=box.parentNode;panel.style.minHeight=panel.offsetHeight+'px'; /* keep the page from jumping */
  document.getElementById('intake-form').hidden=true;
  box.hidden=false;box.focus({preventScroll:true});
}
function intakeReset(){
  document.getElementById('intake').hidden=true;
  document.getElementById('intake-form').hidden=false;
  document.getElementById('f-name').focus({preventScroll:true});
}
/* Photos not uploaded yet: remove the broken image so the line-art panel shows instead. */
document.querySelectorAll('.portrait img').forEach(function(img){
  function miss(){img.remove()}
  if(img.complete&&img.naturalWidth===0){miss()}else{img.addEventListener('error',miss)}
});
/* scroll reveal */
var observer=null;
function revealInit(){
  var reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var els=document.querySelectorAll('.page.active .reveal:not(.in)');
  if(reduced||!('IntersectionObserver' in window)){
    els.forEach(function(e){e.classList.add('in')});
    return;
  }
  if(!observer){
    observer=new IntersectionObserver(function(entries){
      entries.forEach(function(en){
        if(en.isIntersecting){en.target.classList.add('in');observer.unobserve(en.target)}
      });
    },{threshold:0.12});
  }
  els.forEach(function(e){observer.observe(e)});
}
revealInit();
