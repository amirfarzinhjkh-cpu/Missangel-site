(() => {
  'use strict';
  const reduce=matchMedia('(prefers-reduced-motion: reduce)');
  const fine=matchMedia('(hover:hover) and (pointer:fine)');
  const small=matchMedia('(max-width:700px)');
  const canvas=document.createElement('canvas');canvas.id='godhand-atmosphere';canvas.setAttribute('aria-hidden','true');document.body.prepend(canvas);
  const gl=canvas.getContext('webgl',{alpha:true,antialias:false,powerPreference:'low-power'});
  const vertex='attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}';
  const fragment=`precision mediump float;uniform vec2 r;uniform float t;uniform vec2 mouse;
  float h(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
  float n(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(h(i),h(i+vec2(1.,0.)),f.x),mix(h(i+vec2(0.,1.)),h(i+vec2(1.,1.)),f.x),f.y);}
  float fb(vec2 p){float v=0.,a=.5;for(int i=0;i<4;i++){v+=a*n(p);p*=2.02;a*=.5;}return v;}
  void main(){vec2 uv=gl_FragCoord.xy/r;vec2 p=(uv-.5)*vec2(r.x/r.y,1.);p-=mouse*.018;
  float clouds=fb(p*3.1+vec2(t*.008,-t*.012));float veil=smoothstep(.24,.82,clouds)*(1.0-smoothstep(.12,1.0,length(p-vec2(.3,.12))));
  float d=length((p-vec2(.3,.12))*vec2(1.,1.08));float eclipse=smoothstep(.36,.28,d)*(1.-smoothstep(.28,.32,d));
  float ash=pow(n(uv*r.y*.31+vec2(t*.015)),8.)*.2;
  vec3 c=vec3(.012,.014,.016)+vec3(.15,.035,.044)*(veil*.55+eclipse*.35)+vec3(.32,.28,.25)*(veil*.045+ash);
  gl_FragColor=vec4(c,clamp(veil*.42+eclipse*.24+ash*.5,0.,.58));}`;
  let program=null,frame=0,last=0,start=performance.now(),mx=0,my=0,tx=0,ty=0,w=1,hg=1;
  if(gl){const compile=(type,src)=>{const s=gl.createShader(type);gl.shaderSource(s,src);gl.compileShader(s);return gl.getShaderParameter(s,gl.COMPILE_STATUS)?s:null;};const vs=compile(gl.VERTEX_SHADER,vertex),fs=compile(gl.FRAGMENT_SHADER,fragment);if(vs&&fs){program=gl.createProgram();gl.attachShader(program,vs);gl.attachShader(program,fs);gl.linkProgram(program);if(!gl.getProgramParameter(program,gl.LINK_STATUS))program=null;}}
  const uniforms={};
  function resize(){w=innerWidth;hg=innerHeight;if(!gl||!program)return;const dpr=Math.min(devicePixelRatio||1,small.matches?1:1.2);canvas.width=Math.max(1,Math.round(w*dpr));canvas.height=Math.max(1,Math.round(hg*dpr));gl.viewport(0,0,canvas.width,canvas.height);}
  function render(now){frame=0;if(!gl||!program||document.hidden||reduce.matches)return;if(now-last<32){frame=requestAnimationFrame(render);return;}last=now;mx+=(tx-mx)*.035;my+=(ty-my)*.035;gl.useProgram(program);gl.uniform2f(uniforms.r,canvas.width,canvas.height);gl.uniform1f(uniforms.t,(now-start)*.001);gl.uniform2f(uniforms.mouse,mx,my);gl.drawArrays(gl.TRIANGLE_STRIP,0,4);frame=requestAnimationFrame(render);}
  if(gl&&program){const b=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,b);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,1,1]),gl.STATIC_DRAW);gl.useProgram(program);const a=gl.getAttribLocation(program,'p');gl.enableVertexAttribArray(a);gl.vertexAttribPointer(a,2,gl.FLOAT,false,0,0);uniforms.r=gl.getUniformLocation(program,'r');uniforms.t=gl.getUniformLocation(program,'t');uniforms.mouse=gl.getUniformLocation(program,'mouse');resize();if(!reduce.matches)frame=requestAnimationFrame(render);}else canvas.remove();
  addEventListener('resize',resize,{passive:true});
  if(fine.matches)addEventListener('pointermove',e=>{tx=(e.clientX/w-.5)*2;ty=(e.clientY/hg-.5)*2;},{passive:true});

  // A restrained ember field gives the atmosphere a visible signature without a heavy particle engine.
  if(!reduce.matches){
    const field=document.createElement('div');field.className='ashen-ember-field';field.setAttribute('aria-hidden','true');
    for(let i=0;i<22;i++){const ember=document.createElement('i');ember.className='ashen-ember';ember.style.setProperty('--x',((i*47)%97)+'%');ember.style.setProperty('--s',(i%5===0?3:2)+'px');ember.style.setProperty('--d',(13+(i%7)*3)+'s');ember.style.setProperty('--delay',(-((i*3)%19))+'s');field.append(ember);}
    document.body.append(field);
  }

  const grain=document.createElement('div');grain.className='ashen-grain';grain.setAttribute('aria-hidden','true');document.body.append(grain);
  const vignette=document.createElement('div');vignette.className='ashen-vignette';vignette.setAttribute('aria-hidden','true');document.body.append(vignette);
  const targets=document.querySelectorAll('main section,.signal-card,.panel,.entry,.gateway-frame,.intro-layout,.signals-heading');
  if('IntersectionObserver'in window&&!reduce.matches){const io=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('ashen-reveal');requestAnimationFrame(()=>e.target.classList.add('is-visible'));io.unobserve(e.target);}}),{threshold:.07,rootMargin:'0px 0px -28px'});targets.forEach((el,i)=>{el.dataset.delay=i%4;io.observe(el);});}else targets.forEach(el=>el.classList.add('is-visible'));
  if(fine.matches&&!reduce.matches){
    const ring=document.createElement('div'),core=document.createElement('div');ring.className='ashen-cursor';core.className='ashen-cursor-core';document.body.append(ring,core);
    addEventListener('pointermove',e=>{ring.classList.add('is-active');core.classList.add('is-active');ring.style.left=e.clientX+'px';ring.style.top=e.clientY+'px';core.style.left=e.clientX+'px';core.style.top=e.clientY+'px';},{passive:true});
    document.querySelectorAll('a,button,input,textarea,select,[role=button]').forEach(el=>{el.addEventListener('pointerenter',()=>ring.classList.add('is-hover'));el.addEventListener('pointerleave',()=>ring.classList.remove('is-hover'));});
    document.querySelectorAll('.signal-card,.panel,.entry,.button-primary,.header-cta').forEach(el=>{el.classList.add('ashen-pointer-glow');el.addEventListener('pointermove',e=>{const b=el.getBoundingClientRect();el.style.setProperty('--px',(e.clientX-b.left)+'px');el.style.setProperty('--py',(e.clientY-b.top)+'px');},{passive:true});});
    const depth=document.querySelectorAll('.moon-scene,.gateway-frame,.card-art');depth.forEach(el=>{el.classList.add('ashen-depth');el.addEventListener('pointermove',e=>{const b=el.getBoundingClientRect(),px=(e.clientX-b.left)/b.width-.5,py=(e.clientY-b.top)/b.height-.5;el.style.transform='perspective(900px) rotateX('+(-py*3)+'deg) rotateY('+(px*4)+'deg) translateZ(0)';},{passive:true});el.addEventListener('pointerleave',()=>{el.style.transform='';});});
  }
  // Archive and Idea Lab receive the same opt-in ambience control; homepage keeps its existing control.
  if(!document.querySelector('#soundToggle')){
    const button=document.createElement('button');button.type='button';button.className='ashen-audio-toggle';button.setAttribute('aria-pressed','false');button.innerHTML='<span class="bars" aria-hidden="true"><i></i><i></i><i></i><i></i></span><span>AMBIENCE OFF</span>';document.body.append(button);
    let ctx=null,master=null,osc=[];
    const stop=()=>{if(master&&ctx){master.gain.setTargetAtTime(0,ctx.currentTime,.12);osc.forEach(o=>{try{o.stop(ctx.currentTime+.7)}catch{}});}osc=[];button.setAttribute('aria-pressed','false');button.lastElementChild.textContent='AMBIENCE OFF';};
    button.addEventListener('click',async()=>{if(osc.length){stop();return;}try{const AC=window.AudioContext||window.webkitAudioContext;if(!AC)throw 0;ctx??=new AC();await ctx.resume();master=ctx.createGain();master.gain.value=.0001;master.gain.setTargetAtTime(.012,ctx.currentTime,.7);master.connect(ctx.destination);[49,73.4,98].forEach((hz,i)=>{const o=ctx.createOscillator(),g=ctx.createGain();o.type=i===1?'triangle':'sine';o.frequency.value=hz;g.gain.value=i===0?.3:.12;o.connect(g);g.connect(master);o.start();osc.push(o);});button.setAttribute('aria-pressed','true');button.lastElementChild.textContent='AMBIENCE ON';}catch{stop();button.lastElementChild.textContent='AUDIO UNAVAILABLE';}});
    document.addEventListener('visibilitychange',()=>{if(document.hidden&&osc.length)stop();});
  }
  document.addEventListener('visibilitychange',()=>{if(document.hidden&&frame){cancelAnimationFrame(frame);frame=0;}else if(!document.hidden&&program&&!reduce.matches&&!frame)frame=requestAnimationFrame(render);});
  reduce.addEventListener?.('change',()=>{if(reduce.matches&&frame){cancelAnimationFrame(frame);frame=0;}else if(!reduce.matches&&program&&!frame)frame=requestAnimationFrame(render);});

  // GODHAND v2: expose the Forge from the primary navigation without changing page markup.
  const primaryNav=document.querySelector('.nav');
  if(primaryNav&&!primaryNav.querySelector('[data-forge-link]')){
    const link=document.createElement('a');
    link.href='/forge';
    link.textContent='کارگاه تازه';
    link.dataset.fa='کارگاه تازه';
    link.dataset.en='The Forge';
    link.dataset.forgeLink='true';
    primaryNav.append(link);
  }
})();
