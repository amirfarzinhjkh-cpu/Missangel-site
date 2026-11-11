(() => {
  'use strict';
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  const small = window.matchMedia('(max-width: 700px)');
  const canvas = document.createElement('canvas');
  canvas.id = 'godhand-atmosphere';
  canvas.setAttribute('aria-hidden','true');
  document.body.prepend(canvas);
  const gl = canvas.getContext('webgl',{alpha:true,antialias:false,powerPreference:'low-power'});
  let frame=0, last=0, width=0, height=0, dpr=1, program=null, start=performance.now();
  const vertex='attribute vec2 p; void main(){gl_Position=vec4(p,0.0,1.0);}';
  const fragment=`
    precision mediump float;
    uniform vec2 r; uniform float t; uniform vec2 mouse;
    float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
    float noise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.0-2.0*f);return mix(mix(hash(i),hash(i+vec2(1.,0.)),f.x),mix(hash(i+vec2(0.,1.)),hash(i+vec2(1.,1.)),f.x),f.y);}
    float fbm(vec2 p){float v=0.,a=.5;for(int i=0;i<4;i++){v+=a*noise(p);p*=2.03;a*=.5;}return v;}
    void main(){
      vec2 uv=gl_FragCoord.xy/r; vec2 p=(uv-.5)*vec2(r.x/r.y,1.);
      p.x-=mouse.x*.035;p.y+=mouse.y*.025;
      float n=fbm(p*3.2+vec2(t*.009,-t*.014));
      float haze=smoothstep(.22,.92,n)*smoothstep(.9,.12,length(p-vec2(.35,.12)));
      float eclipse=length((p-vec2(.28,.16))*vec2(1.,1.12));
      float rim=smoothstep(.34,.27,eclipse)*smoothstep(.18,.28,eclipse);
      float dust=pow(noise(uv*r.y*.34+vec2(t*.018)),7.)*.22;
      vec3 ink=vec3(.018,.021,.023);
      vec3 rust=vec3(.19,.055,.065);
      vec3 ash=vec3(.39,.34,.31);
      vec3 col=mix(ink,rust,haze*.42+rim*.34);
      col+=ash*(haze*.045+dust);
      col+=rust*rim*.22;
      gl_FragColor=vec4(col,clamp(haze*.42+rim*.25+dust*.45,0.,.62));
    }`;
  function shader(type,source){const s=gl.createShader(type);gl.shaderSource(s,source);gl.compileShader(s);if(!gl.getShaderParameter(s,gl.COMPILE_STATUS)){gl.deleteShader(s);return null;}return s;}
  if(gl){
    const vs=shader(gl.VERTEX_SHADER,vertex), fs=shader(gl.FRAGMENT_SHADER,fragment);
    if(vs&&fs){program=gl.createProgram();gl.attachShader(program,vs);gl.attachShader(program,fs);gl.linkProgram(program);}
    if(!program||!gl.getProgramParameter(program,gl.LINK_STATUS)){canvas.remove();program=null;}
  }
  let mx=0,my=0,tx=0,ty=0;
  function resize(){if(!gl||!program)return;dpr=Math.min(devicePixelRatio||1,small.matches?1:1.25);width=Math.max(1,innerWidth);height=Math.max(1,innerHeight);canvas.width=Math.round(width*dpr);canvas.height=Math.round(height*dpr);gl.viewport(0,0,canvas.width,canvas.height);}
  if(program){
    const buffer=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,buffer);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,1,1]),gl.STATIC_DRAW);
    gl.useProgram(program);const loc=gl.getAttribLocation(program,'p');gl.enableVertexAttribArray(loc);gl.vertexAttribPointer(loc,2,gl.FLOAT,false,0,0);
    const res=gl.getUniformLocation(program,'r'),time=gl.getUniformLocation(program,'t'),pointer=gl.getUniformLocation(program,'mouse');
    function draw(now){frame=0;if(document.hidden||reduce.matches)return;if(now-last<33){frame=requestAnimationFrame(draw);return;}last=now;mx+=(tx-mx)*.035;my+=(ty-my)*.035;gl.uniform2f(res,canvas.width,canvas.height);gl.uniform1f(time,(now-start)*.001);gl.uniform2f(pointer,mx,my);gl.drawArrays(gl.TRIANGLE_STRIP,0,4);frame=requestAnimationFrame(draw);}
    resize();if(!reduce.matches)frame=requestAnimationFrame(draw);
    addEventListener('resize',resize,{passive:true});
    addEventListener('pointermove',e=>{tx=(e.clientX/width-.5)*2;ty=(e.clientY/height-.5)*2;},{passive:true});
  }
  const grain=document.createElement('div');grain.className='ashen-grain';grain.setAttribute('aria-hidden','true');document.body.append(grain);
  const vignette=document.createElement('div');vignette.className='ashen-vignette';vignette.setAttribute('aria-hidden','true');document.body.append(vignette);
  const revealTargets=document.querySelectorAll('main section, .signal-card, .panel, .entry, .gateway-frame');
  if('IntersectionObserver' in window&&!reduce.matches){const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('ashen-reveal','is-visible');observer.unobserve(entry.target);}}),{threshold:.08,rootMargin:'0px 0px -35px 0px'});revealTargets.forEach((el,i)=>{el.dataset.delay=String(i%4);observer.observe(el);});}else revealTargets.forEach(el=>el.classList.add('is-visible'));
  if(matchMedia('(hover:hover) and (pointer:fine)').matches){document.querySelectorAll('.signal-card,.panel,.entry,.button-primary,.header-cta').forEach(el=>{el.classList.add('ashen-pointer-glow');el.addEventListener('pointermove',e=>{const b=el.getBoundingClientRect();el.style.setProperty('--px',(e.clientX-b.left)+'px');el.style.setProperty('--py',(e.clientY-b.top)+'px');},{passive:true});});}
  document.addEventListener('visibilitychange',()=>{if(document.hidden&&frame){cancelAnimationFrame(frame);frame=0;}else if(!document.hidden&&program&&!reduce.matches&&!frame)frame=requestAnimationFrame(drawFallback);});
  function drawFallback(){if(!gl||!program||document.hidden||reduce.matches)return;const now=performance.now();if(now-last<33){frame=requestAnimationFrame(drawFallback);return;}last=now;mx+=(tx-mx)*.035;my+=(ty-my)*.035;gl.uniform2f(gl.getUniformLocation(program,'r'),canvas.width,canvas.height);gl.uniform1f(gl.getUniformLocation(program,'t'),(now-start)*.001);gl.uniform2f(gl.getUniformLocation(program,'mouse'),mx,my);gl.drawArrays(gl.TRIANGLE_STRIP,0,4);frame=requestAnimationFrame(drawFallback);}
  reduce.addEventListener?.('change',()=>{if(reduce.matches&&frame){cancelAnimationFrame(frame);frame=0;}else if(!reduce.matches&&program&&!frame)frame=requestAnimationFrame(drawFallback);});
})();