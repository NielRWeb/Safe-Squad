(function(){const a=document.createElement("link").relList;if(a&&a.supports&&a.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))t(i);new MutationObserver(i=>{for(const n of i)if(n.type==="childList")for(const r of n.addedNodes)r.tagName==="LINK"&&r.rel==="modulepreload"&&t(r)}).observe(document,{childList:!0,subtree:!0});function s(i){const n={};return i.integrity&&(n.integrity=i.integrity),i.referrerPolicy&&(n.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?n.credentials="include":i.crossOrigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function t(i){if(i.ep)return;i.ep=!0;const n=s(i);fetch(i.href,n)}})();function o(e,a={},...s){const t=document.createElement(e);return pa(t,a),ya(t,s),t}function pa(e,a){for(const[s,t]of Object.entries(a))t==null||t===!1||(s==="class"?e.className=String(t):s==="html"?e.innerHTML=String(t):s==="text"?e.textContent=String(t):s==="style"&&typeof t=="object"?Object.assign(e.style,t):s.startsWith("on")&&typeof t=="function"?e.addEventListener(s.slice(2).toLowerCase(),t):s==="dataset"&&typeof t=="object"?Object.assign(e.dataset,t):e.setAttribute(s,String(t)))}function ya(e,a){for(const s of a)s==null||s===!1||e.appendChild(typeof s=="string"?document.createTextNode(s):s)}function He(e,a=""){const s=document.createElement("div");return a&&(s.className=a),s.innerHTML=e,s.setAttribute("aria-hidden","true"),s}function ga(e){for(;e.firstChild;)e.removeChild(e.firstChild)}function et(e,a,s,t){return e.addEventListener(a,s,t),()=>e.removeEventListener(a,s,t)}function kt(e){return new Promise(a=>window.setTimeout(a,e))}function Nt(e){let a=0,s=performance.now(),t=!0;const i=n=>{if(!t)return;const r=Math.min(.05,(n-s)/1e3);s=n;try{e(r,n)}catch(h){console.warn("[loop] step error",h)}a=requestAnimationFrame(i)};return a=requestAnimationFrame(i),()=>{t=!1,cancelAnimationFrame(a)}}function ze(e,a,s){return e<a?a:e>s?s:e}function mt(e,a,s){return e+(a-e)*s}class rt{constructor(){this.ids=new Set,this.disposed=!1}after(a,s){if(this.disposed)return 0;const t=window.setTimeout(()=>{this.ids.delete(t),this.disposed||a()},s);return this.ids.add(t),t}clear(){this.disposed=!0,this.ids.forEach(a=>window.clearTimeout(a)),this.ids.clear()}}function Yt(){const e=window.devicePixelRatio||1,a=typeof window.matchMedia=="function"&&window.matchMedia("(pointer: coarse)").matches;return Math.max(1,Math.min(e,a?1.5:2))}const we=(e,a="")=>`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"
     stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${e}${a}</svg>`,ba={back:we('<path d="M15 5 8 12l7 7"/>'),home:we('<path d="M4 11 12 4l8 7v8a1 1 0 0 1-1 1h-4v-6H9v6H5a1 1 0 0 1-1-1z"/>'),play:we('<path d="M8 5.5 18 12 8 18.5z" fill="currentColor" stroke-width="2"/>'),replay:we('<path d="M4 12a8 8 0 1 0 2.6-5.9"/><path d="M4 4v4h4"/>'),question:we('<circle cx="12" cy="12" r="9"/><path d="M9.4 9.2a2.7 2.7 0 0 1 5.2.9c0 1.8-2.6 2.2-2.6 4"/><circle cx="12" cy="17.4" r="1.1" fill="currentColor" stroke="none"/>'),gear:we('<circle cx="12" cy="12" r="3.2"/><path d="M12 3.2v2.1M12 18.7v2.1M20.8 12h-2.1M5.3 12H3.2M18.2 5.8l-1.5 1.5M7.3 16.7l-1.5 1.5M18.2 18.2l-1.5-1.5M7.3 7.3 5.8 5.8"/>'),soundOn:we('<path d="M4 9.5h3.5L12 5.5v13L7.5 14.5H4z"/><path d="M16 9a4.4 4.4 0 0 1 0 6"/><path d="M18.6 6.4a8 8 0 0 1 0 11.2"/>'),soundOff:we('<path d="M4 9.5h3.5L12 5.5v13L7.5 14.5H4z"/><path d="m16.5 9.5 5 5M21.5 9.5l-5 5"/>'),musicOn:we('<path d="M9 18V6.6l10-2v11"/><circle cx="6.6" cy="18" r="2.6"/><circle cx="16.6" cy="15.6" r="2.6"/>'),musicOff:we('<path d="M9 18V6.6l10-2v3"/><circle cx="6.6" cy="18" r="2.6"/><path d="m15 13 6 6M21 13l-6 6"/>'),check:we('<circle cx="12" cy="12" r="9"/><path d="m7.8 12.3 2.8 2.9 5.6-6"/>'),cross:we('<circle cx="12" cy="12" r="9"/><path d="m8.6 8.6 6.8 6.8M15.4 8.6l-6.8 6.8"/>'),bulb:we('<path d="M9 17h6M10 20.5h4"/><path d="M12 3a6 6 0 0 0-3.6 10.8c.5.4.8 1 .8 1.6V17h5.6v-1.6c0-.6.3-1.2.8-1.6A6 6 0 0 0 12 3z"/>'),tap:we('<path d="M9 11.5V6.2a2 2 0 1 1 4 0v7.1l2.2-1a2 2 0 0 1 2.7 2.4l-1.3 4A3.5 3.5 0 0 1 13.3 21H11a4 4 0 0 1-3.4-1.9L5 15a1.9 1.9 0 0 1 3-2.3z"/>'),mouse:we('<rect x="7.5" y="3" width="9" height="18" rx="4.5"/><path d="M12 7v3.2"/>'),drag:we('<path d="M12 3v18M3 12h18M9 6l3-3 3 3M9 18l3 3 3-3M6 9l-3 3 3 3M18 9l3 3-3 3"/>'),star:'<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="m12 2.6 2.9 5.9 6.5.9-4.7 4.6 1.1 6.5-5.8-3-5.8 3 1.1-6.5L2.6 9.4l6.5-.9z" fill="currentColor"/></svg>',starEmpty:we('<path d="m12 3.4 2.7 5.5 6 .9-4.3 4.2 1 6-5.4-2.8-5.4 2.8 1-6L3.3 9.8l6-.9z"/>'),heart:'<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M12 20.5S3.5 15.2 3.5 9.4A4.9 4.9 0 0 1 12 6a4.9 4.9 0 0 1 8.5 3.4c0 5.8-8.5 11.1-8.5 11.1z" fill="currentColor"/></svg>',shield:we('<path d="M12 3.2 19 6v6c0 4.6-3 7.6-7 8.8-4-1.2-7-4.2-7-8.8V6z"/><path d="m8.8 12 2.2 2.2 4.2-4.4"/>'),arrowLeft:we('<path d="M20 12H5"/><path d="m11 6-6 6 6 6"/>'),arrowRight:we('<path d="M4 12h15"/><path d="m13 6 6 6-6 6"/>'),car:we('<path d="M4.5 16.5v2a1 1 0 0 0 1 1h1.6a1 1 0 0 0 1-1v-2M15.9 16.5v2a1 1 0 0 0 1 1h1.6a1 1 0 0 0 1-1v-2"/><path d="M3.6 16.5h16.8v-3.2l-1.7-4.6a2 2 0 0 0-1.9-1.3H7.2a2 2 0 0 0-1.9 1.3l-1.7 4.6z"/><path d="M6.4 13.4h11.2"/>'),puzzle:we('<path d="M10 4h4a1 1 0 0 1 1 1v1.4a1.8 1.8 0 1 0 3.4 1v-.2H20a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1h-1.4a1.8 1.8 0 1 0-1 3.4H20v3.4a1 1 0 0 1-1 1h-4"/><path d="M15 20H5a1 1 0 0 1-1-1v-4h1.4A1.8 1.8 0 1 0 6.4 11H4V6a1 1 0 0 1 1-1h5"/>'),baby:we('<circle cx="12" cy="12" r="9"/><path d="M9 10.5h.01M15 10.5h.01"/><path d="M9.6 15c1.4 1.3 3.4 1.3 4.8 0"/>'),eye:we('<path d="M2.6 12S6 5.8 12 5.8 21.4 12 21.4 12 18 18.2 12 18.2 2.6 12 2.6 12z"/><circle cx="12" cy="12" r="2.6"/>'),people:we('<circle cx="9" cy="8" r="3.2"/><path d="M2.8 20a6.2 6.2 0 0 1 12.4 0"/><path d="M16.4 5.3a3.2 3.2 0 0 1 0 6.1M17.8 20a6 6 0 0 0-2-4.3"/>'),flag:we('<path d="M6 21V4"/><path d="M6 4.6h11.5l-2.2 4 2.2 4H6"/>'),close:we('<path d="m6.5 6.5 11 11M17.5 6.5l-11 11"/>')};function T(e){var a;return(a=ba[e])!=null?a:we('<circle cx="12" cy="12" r="6"/>')}const ca="safesquad.settings.v1",qt="safesquad.progress.v1",ma={music:!0,sfx:!0,volume:.75},wa={best:{},plays:{},seenIntro:!1};function ha(e,a){try{const s=localStorage.getItem(e);return s?{...a,...JSON.parse(s)}:{...a}}catch{return{...a}}}function Pt(e,a){try{localStorage.setItem(e,JSON.stringify(a))}catch{}}const xe=ha(ca,ma),Fe=ha(qt,wa),xa=new Set;function Gt(){xa.forEach(e=>{try{e()}catch(a){console.warn("[state] listener failed",a)}})}function vt(e){Object.assign(xe,e),Pt(ca,xe),Gt()}function ka(e,a){var s,t;Fe.best[e]=Math.max((s=Fe.best[e])!=null?s:0,a),Fe.plays[e]=((t=Fe.plays[e])!=null?t:0)+1,Pt(qt,Fe),Gt()}function va(){Fe.seenIntro=!0,Pt(qt,Fe)}function Ma(){Fe.best={},Fe.plays={},Fe.seenIntro=!1,Pt(qt,Fe),Gt()}const _a={},$a={},It=e=>440*Math.pow(2,(e-69)/12),Sa={hub:{bpm:104,bassWave:"triangle",leadWave:"square",gain:.9,bass:[45,null,45,null,52,null,45,null,47,null,47,null,54,null,47,null],lead:[69,71,73,null,76,null,73,71,69,71,73,76,78,null,76,null],pad:[[57,61,64],[59,62,66],[61,64,68],[57,61,64]],hats:[0,2,4,6,8,10,12,14],kick:[0,6,8,14]},baby:{bpm:76,bassWave:"sine",leadWave:"triangle",gain:.75,bass:[48,null,null,null,53,null,null,null,55,null,null,null,50,null,null,null],lead:[72,null,76,null,79,null,76,null,74,null,72,null,71,null,null,null],pad:[[60,64,67],[65,69,72],[67,71,74],[62,65,69]],hats:[4,12],kick:[0,8]},puzzle:{bpm:92,bassWave:"triangle",leadWave:"sine",gain:.8,bass:[43,null,43,null,48,null,43,null,46,null,46,null,50,null,46,null],lead:[67,70,72,70,75,null,72,70,67,70,72,74,75,null,72,null],pad:[[55,58,62],[60,63,67],[58,62,65],[55,58,62]],hats:[2,6,10,14],kick:[0,8,11]},drive:{bpm:122,bassWave:"sawtooth",leadWave:"square",gain:.72,bass:[40,40,47,40,45,45,52,45,43,43,50,43,45,47,48,50],lead:[64,null,67,null,71,null,67,null,69,null,72,null,71,null,67,null],pad:[[52,55,59],[57,60,64],[55,59,62],[52,55,59]],hats:[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15],kick:[0,4,7,8,12]},battle:{bpm:116,bassWave:"triangle",leadWave:"square",gain:.8,bass:[41,null,41,48,43,null,43,50,45,null,45,52,46,48,50,52],lead:[65,null,68,null,72,71,68,null,65,null,70,null,73,null,70,null],pad:[[53,56,60],[55,58,62],[57,60,64],[53,56,60]],hats:[0,2,4,6,8,10,12,14],kick:[0,3,6,8,11,14]},maze:{bpm:108,bassWave:"sawtooth",leadWave:"triangle",gain:.7,bass:[38,38,null,45,38,null,43,null,40,40,null,47,40,null,45,null],lead:[62,65,67,65,70,null,67,65,62,65,69,65,72,null,67,null],pad:[[50,53,57],[52,55,59],[50,53,57],[55,58,62]],hats:[1,3,5,7,9,11,13,15],kick:[0,6,8,12]},hero:{bpm:132,bassWave:"triangle",leadWave:"square",gain:.72,bass:[43,43,50,43,48,48,55,48,45,45,52,45,47,47,54,47],lead:[72,76,79,76,81,null,79,76,74,77,81,77,83,null,79,null],pad:[[55,59,62],[60,64,67],[57,61,64],[59,62,66]],hats:[0,2,4,6,8,10,12,14],kick:[0,4,8,12]},bingo:{bpm:96,bassWave:"sine",leadWave:"triangle",gain:.78,bass:[48,null,55,null,50,null,57,null,52,null,59,null,50,null,55,null],lead:[76,79,83,79,84,null,81,79,76,79,84,81,88,null,84,null],pad:[[60,64,67],[62,65,69],[64,67,71],[59,62,67]],hats:[2,6,10,14],kick:[0,8]}};class Ta{constructor(){this.ctx=null,this.master=null,this.musicBus=null,this.sfxBus=null,this.noiseBuffer=null,this.currentTrack=null,this.pendingTrack=null,this.schedulerId=0,this.step=0,this.nextNoteTime=0,this.engine=null,this.buffers=new Map,this.unlocked=!1,this.fileMusic=null}unlock(){try{const a=this.ensureCtx();if(!a)return;if(a.state==="suspended"&&a.resume(),this.unlocked=!0,this.pendingTrack){const s=this.pendingTrack;this.pendingTrack=null,this.music(s)}}catch(a){console.warn("[audio] unlock failed",a)}}ensureCtx(){var a;if(this.ctx)return this.ctx;try{const s=(a=window.AudioContext)!=null?a:window.webkitAudioContext;if(!s)return null;const t=new s,i=t.createGain();i.gain.value=xe.volume,i.connect(t.destination);const n=t.createGain();n.gain.value=xe.music?.32:0,n.connect(i);const r=t.createGain();return r.gain.value=xe.sfx?.9:0,r.connect(i),this.ctx=t,this.master=i,this.musicBus=n,this.sfxBus=r,this.noiseBuffer=this.makeNoise(t),this.preloadFiles(),t}catch(s){return console.warn("[audio] Web Audio unavailable — running silently",s),null}}makeNoise(a){const s=Math.floor(a.sampleRate*1.2),t=a.createBuffer(1,s,a.sampleRate),i=t.getChannelData(0);for(let n=0;n<s;n++)i[n]=Math.random()*2-1;return t}async preloadFiles(){const a=[...Object.entries(_a).map(([s,t])=>[`sfx:${s}`,t]),...Object.entries($a).map(([s,t])=>[`music:${s}`,t])];for(const[s,t]of a)try{const n=await(await fetch(t)).arrayBuffer(),r=this.ctx;if(!r)return;this.buffers.set(s,await r.decodeAudioData(n))}catch(i){console.warn(`[audio] could not load ${t} — using generated sound instead`,i)}}setVolume(a){const s=this.ensureCtx();!s||!this.master||this.master.gain.setTargetAtTime(a,s.currentTime,.05)}setMusicEnabled(a){const s=this.ensureCtx();!s||!this.musicBus||(this.musicBus.gain.setTargetAtTime(a?.32:0,s.currentTime,.08),a&&!this.currentTrack&&this.pendingTrack&&this.music(this.pendingTrack))}setSfxEnabled(a){const s=this.ensureCtx();!s||!this.sfxBus||this.sfxBus.gain.setTargetAtTime(a?.9:0,s.currentTime,.05)}music(a){if(this.currentTrack===a)return;const s=this.ensureCtx();if(!s||!this.unlocked){this.pendingTrack=a;return}this.stopMusic(),this.currentTrack=a;const t=this.buffers.get(`music:${a}`);if(t&&this.musicBus){const r=s.createBufferSource();r.buffer=t,r.loop=!0,r.connect(this.musicBus),r.start(),this.fileMusic=r;return}this.step=0,this.nextNoteTime=s.currentTime+.08;const i=Sa[a],n=60/i.bpm/4;this.schedulerId=window.setInterval(()=>{const r=this.ctx;if(r)for(;this.nextNoteTime<r.currentTime+.15;)this.scheduleStep(i,this.step,this.nextNoteTime),this.nextNoteTime+=n,this.step=(this.step+1)%16},40)}stopMusic(){if(this.schedulerId&&(clearInterval(this.schedulerId),this.schedulerId=0),this.fileMusic){try{this.fileMusic.stop()}catch{}this.fileMusic=null}this.currentTrack=null}scheduleStep(a,s,t){const i=this.ctx,n=this.musicBus;if(!i||!n)return;const r=60/a.bpm/4,h=a.bass[s];h!=null&&this.blip(It(h),t,r*1.6,a.bassWave,.16*a.gain,n,700);const f=a.lead[s];f!=null&&this.blip(It(f),t,r*1.3,a.leadWave,.075*a.gain,n,2600),s%4===0&&a.pad[s/4%a.pad.length].forEach(m=>this.blip(It(m),t,r*3.6,"sine",.05*a.gain,n,1400)),a.hats.includes(s)&&this.noiseHit(t,.03,7e3,.05*a.gain,n),a.kick.includes(s)&&this.kick(t,n,.28*a.gain)}sfx(a){const s=this.ensureCtx();if(!s||!this.sfxBus)return;s.state==="suspended"&&s.resume();const t=this.sfxBus,i=s.currentTime,n=this.buffers.get(`sfx:${a}`);if(n){const r=s.createBufferSource();r.buffer=n,r.connect(t),r.start();return}try{switch(a){case"click":this.blip(660,i,.07,"square",.16,t,3e3),this.blip(990,i+.03,.06,"square",.09,t,4e3);break;case"back":this.blip(520,i,.08,"triangle",.16,t,2400),this.blip(340,i+.05,.1,"triangle",.12,t,1800);break;case"whoosh":this.sweepNoise(i,.35,400,4200,.12,t);break;case"pop":this.slide(300,900,i,.12,"sine",.2,t);break;case"appear":[784,1046,1318].forEach((r,h)=>this.blip(r,i+h*.055,.14,"triangle",.13,t,5e3));break;case"correct":[659,830,988,1318].forEach((r,h)=>this.blip(r,i+h*.07,.2,"triangle",.16,t,6e3));break;case"snap":this.blip(1200,i,.05,"square",.14,t,6e3),this.noiseHit(i,.05,2600,.14,t),this.blip(1600,i+.04,.16,"sine",.12,t,7e3);break;case"wrong":this.blip(196,i,.16,"sawtooth",.16,t,900),this.blip(185,i+.13,.24,"sawtooth",.16,t,700);break;case"sad":this.slide(420,220,i,.5,"triangle",.16,t);break;case"fanfare":[523,659,784,1046,1318].forEach((r,h)=>this.blip(r,i+h*.11,.34,"square",.12,t,6e3)),[523,784,1046].forEach(r=>this.blip(r,i+.55,.7,"triangle",.11,t,5e3));break;case"babyCoo":this.voice(i,[560,720,640],.5,.12,t,6);break;case"babyFuss":this.voice(i,[520,430],.45,.15,t,9),this.voice(i+.4,[480,400],.4,.12,t,9);break;case"babyCry":this.cryWave(i,3,.2,t);break;case"babyTantrum":this.cryWave(i,5,.26,t,1.25);break;case"momCalm":this.voice(i,[330,300,270],.75,.1,t,4);break;case"momGasp":this.sweepNoise(i,.28,900,2600,.1,t),this.slide(420,620,i,.22,"sine",.08,t);break;case"crash":this.noiseHit(i,.34,900,.3,t),this.blip(90,i,.35,"square",.26,t,400),this.slide(300,70,i+.03,.4,"sawtooth",.14,t);break;case"flatTyre":this.sweepNoise(i,.9,3e3,300,.16,t),this.slide(260,90,i+.1,.8,"sawtooth",.1,t);break;case"skid":this.sweepNoise(i,.5,1800,700,.14,t);break;case"attack":this.slide(320,1150,i,.16,"square",.16,t),this.noiseHit(i+.14,.12,1800,.16,t),this.blip(1400,i+.16,.12,"triangle",.12,t,6e3);break;case"hurt":this.slide(520,150,i,.34,"sawtooth",.16,t),this.noiseHit(i,.16,700,.16,t);break;case"jump":this.slide(320,780,i,.16,"square",.12,t);break;case"coin":this.blip(1046,i,.08,"square",.13,t,7e3),this.blip(1568,i+.07,.22,"square",.12,t,7e3);break;case"boxOpen":this.noiseHit(i,.1,1400,.16,t),this.slide(220,520,i,.14,"triangle",.13,t);break;case"empty":this.blip(300,i,.12,"sine",.12,t,1200),this.blip(220,i+.1,.2,"sine",.1,t,900);break;case"victory":[659,784,988,1318,1568].forEach((r,h)=>this.blip(r,i+h*.1,.3,"triangle",.13,t,6e3));break;case"defeat":[392,349,311,262].forEach((r,h)=>this.blip(r,i+h*.16,.34,"sawtooth",.12,t,1600));break;case"chase":this.blip(180,i,.14,"square",.1,t,800),this.blip(150,i+.13,.16,"square",.1,t,700);break}}catch(r){console.warn("[audio] sfx failed",a,r)}}cryWave(a,s,t,i,n=1){const r=Math.min(4,1+Math.floor(s/1.6));for(let h=0;h<r;h++){const f=a+h*.38/n,c=520+s*40+h*25;this.voice(f,[c,c*1.25,c*.85],.34/n,t,i,12+s*2)}}startEngine(){const a=this.ensureCtx();if(!(!a||!this.sfxBus||this.engine))try{const s=a.createOscillator();s.type="sawtooth",s.frequency.value=78;const t=a.createBiquadFilter();t.type="lowpass",t.frequency.value=420;const i=a.createGain();i.gain.value=0,s.connect(t).connect(i).connect(this.sfxBus),s.start(),i.gain.setTargetAtTime(.055,a.currentTime,.3),this.engine={osc:s,gain:i,filter:t}}catch(s){console.warn("[audio] engine failed",s)}}setEngineSpeed(a){const s=this.ctx;!s||!this.engine||(this.engine.osc.frequency.setTargetAtTime(70+a*80,s.currentTime,.15),this.engine.gain.gain.setTargetAtTime(.03+a*.05,s.currentTime,.2))}stopEngine(){const a=this.ctx;if(!a||!this.engine)return;const{osc:s,gain:t}=this.engine;this.engine=null;try{t.gain.setTargetAtTime(0,a.currentTime,.12),s.stop(a.currentTime+.6)}catch{}}blip(a,s,t,i,n,r,h=5e3){const f=this.ctx;if(!f)return;const c=f.createOscillator();c.type=i,c.frequency.setValueAtTime(a,s);const m=f.createBiquadFilter();m.type="lowpass",m.frequency.value=h;const k=f.createGain();k.gain.setValueAtTime(1e-4,s),k.gain.exponentialRampToValueAtTime(Math.max(2e-4,n),s+.012),k.gain.exponentialRampToValueAtTime(1e-4,s+t),c.connect(m).connect(k).connect(r),c.start(s),c.stop(s+t+.05)}slide(a,s,t,i,n,r,h){const f=this.ctx;if(!f)return;const c=f.createOscillator();c.type=n,c.frequency.setValueAtTime(a,t),c.frequency.exponentialRampToValueAtTime(Math.max(20,s),t+i);const m=f.createGain();m.gain.setValueAtTime(1e-4,t),m.gain.exponentialRampToValueAtTime(r,t+.02),m.gain.exponentialRampToValueAtTime(1e-4,t+i),c.connect(m).connect(h),c.start(t),c.stop(t+i+.05)}voice(a,s,t,i,n,r=8){const h=this.ctx;if(!h)return;const f=h.createOscillator();f.type="sawtooth";const c=t/s.length;s.forEach((l,ie)=>{ie===0?f.frequency.setValueAtTime(l,a):f.frequency.linearRampToValueAtTime(l,a+c*ie)});const m=h.createOscillator();m.frequency.value=r;const k=h.createGain();k.gain.value=s[0]*.05,m.connect(k).connect(f.frequency);const Y=h.createBiquadFilter();Y.type="bandpass",Y.frequency.value=900,Y.Q.value=3.5;const G=h.createGain();G.gain.setValueAtTime(1e-4,a),G.gain.exponentialRampToValueAtTime(i,a+t*.22),G.gain.exponentialRampToValueAtTime(1e-4,a+t),f.connect(Y).connect(G).connect(n),f.start(a),m.start(a),f.stop(a+t+.05),m.stop(a+t+.05)}noiseHit(a,s,t,i,n){const r=this.ctx;if(!r||!this.noiseBuffer)return;const h=r.createBufferSource();h.buffer=this.noiseBuffer;const f=r.createBiquadFilter();f.type="highpass",f.frequency.value=t;const c=r.createGain();c.gain.setValueAtTime(i,a),c.gain.exponentialRampToValueAtTime(1e-4,a+s),h.connect(f).connect(c).connect(n),h.start(a),h.stop(a+s+.05)}sweepNoise(a,s,t,i,n,r){const h=this.ctx;if(!h||!this.noiseBuffer)return;const f=h.createBufferSource();f.buffer=this.noiseBuffer,f.loop=!0;const c=h.createBiquadFilter();c.type="bandpass",c.Q.value=1.2,c.frequency.setValueAtTime(t,a),c.frequency.exponentialRampToValueAtTime(Math.max(60,i),a+s);const m=h.createGain();m.gain.setValueAtTime(1e-4,a),m.gain.exponentialRampToValueAtTime(n,a+.05),m.gain.exponentialRampToValueAtTime(1e-4,a+s),f.connect(c).connect(m).connect(r),f.start(a),f.stop(a+s+.1)}kick(a,s,t){const i=this.ctx;if(!i)return;const n=i.createOscillator();n.type="sine",n.frequency.setValueAtTime(150,a),n.frequency.exponentialRampToValueAtTime(48,a+.13);const r=i.createGain();r.gain.setValueAtTime(t,a),r.gain.exponentialRampToValueAtTime(1e-4,a+.18),n.connect(r).connect(s),n.start(a),n.stop(a+.22)}}const p=new Ta;function za(){const e=()=>{p.unlock(),p.setVolume(xe.volume),p.setMusicEnabled(xe.music),p.setSfxEnabled(xe.sfx)};["pointerdown","touchstart","keydown"].forEach(a=>window.addEventListener(a,e,{once:!1,passive:!0}))}let St=0;const Ct=new Set;function Be(){[...Ct].forEach(e=>e()),Ct.clear()}function _t(e){var f;const a=document.activeElement,s=o("button",{class:"icon-btn modal__close",type:"button","aria-label":"Close dialog",html:T("close")}),t=o("div",{class:"modal__body scroll-y"});e.body.forEach(c=>t.appendChild(typeof c=="string"?o("p",{text:c}):c));const i=o("div",{class:`modal${e.className?` ${e.className}`:""}`,role:"dialog","aria-modal":"true","aria-label":e.title},o("div",{class:"modal__head"},o("h2",{text:e.title}),s),t);if((f=e.actions)!=null&&f.length){const c=o("div",{class:"modal__foot"});e.actions.forEach(m=>{const k=o("button",{class:`btn ${m.variant?`btn--${m.variant}`:""}`,type:"button",text:m.label});k.addEventListener("click",()=>{var Y;p.sfx("click"),(Y=m.onClick)==null||Y.call(m,r),m.closeAfter!==!1&&r()}),c.appendChild(k)}),i.appendChild(c)}const n=o("div",{class:"modal-backdrop"},i);function r(){var c,m;Ct.delete(r),n.isConnected&&(document.removeEventListener("keydown",h,!0),n.remove(),St=Math.max(0,St-1),St===0&&(document.body.style.removeProperty("overflow"),document.body.classList.remove("has-modal")),(c=e.onClose)==null||c.call(e),(m=a==null?void 0:a.focus)==null||m.call(a))}function h(c){if(c.key==="Escape"){c.preventDefault(),p.sfx("back"),r();return}if(c.key!=="Tab")return;const m=i.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');if(!m.length)return;const k=m[0],Y=m[m.length-1];c.shiftKey&&document.activeElement===k?(c.preventDefault(),Y.focus()):!c.shiftKey&&document.activeElement===Y&&(c.preventDefault(),k.focus())}return s.addEventListener("click",()=>{p.sfx("back"),r()}),n.addEventListener("pointerdown",c=>{c.target===n&&r()}),document.addEventListener("keydown",h,!0),document.body.appendChild(n),Ct.add(r),St++,document.body.style.overflow="hidden",document.body.classList.add("has-modal"),window.setTimeout(()=>s.focus(),40),r}function Qt(e,a,s){const t=o("div",{class:"howto-step__icon","aria-hidden":"true"});t.innerHTML=e;const i=o("div",{},o("h3",{text:a}),o("p",{text:s}));return o("div",{class:"howto-step"},t,i)}class Ca{constructor(a){this.container=a,this.current=null,this.factories=new Map,this.nav={go:s=>this.go(s),toHub:()=>this.go("hub")}}register(a,s){this.factories.set(a,s)}go(a){var i,n;const s=this.factories.get(a);if(!s){console.error(`[router] unknown route "${a}" — returning to hub`),a!=="hub"&&this.go("hub");return}Be();try{(n=(i=this.current)==null?void 0:i.destroy)==null||n.call(i)}catch(r){console.warn("[router] destroy failed",r)}this.container.replaceChildren();let t;try{t=s(this.nav)}catch(r){if(console.error("[router] scene failed to start",r),a!=="hub"){this.go("hub");return}throw r}this.current=t,t.root.classList.add("scene--enter"),this.container.appendChild(t.root),location.hash.slice(1)!==a&&history.replaceState(null,"",`#${a}`),window.scrollTo(0,0)}start(a="hub"){const s=location.hash.slice(1);this.go(this.factories.has(s)?s:a)}}const Dt='preserveAspectRatio="xMidYMid slice"';function yt(e,a,s,t=.9){return`<g transform="translate(${e} ${a}) scale(${s})" opacity="${t}">
    <ellipse cx="0" cy="0" rx="34" ry="20" fill="#fff"/>
    <ellipse cx="26" cy="6" rx="24" ry="15" fill="#fff"/>
    <ellipse cx="-26" cy="6" rx="22" ry="13" fill="#fff"/>
  </g>`}function Tt(e,a,s,t="#3fae6a"){return`<g transform="translate(${e} ${a}) scale(${s})">
    <rect x="-6" y="-6" width="12" height="34" rx="6" fill="#8d6b4b"/>
    <circle cx="0" cy="-26" r="26" fill="${t}"/>
    <circle cx="-18" cy="-12" r="18" fill="${t}"/>
    <circle cx="18" cy="-12" r="18" fill="${t}"/>
    <circle cx="-6" cy="-38" r="16" fill="#57c47e" opacity=".8"/>
  </g>`}function Ut(e,a,s){return`<g transform="translate(${e} ${a}) scale(${s})">
    <ellipse cx="0" cy="0" rx="26" ry="17" fill="#3fae6a"/>
    <ellipse cx="-14" cy="4" rx="16" ry="12" fill="#57c47e"/>
    <ellipse cx="14" cy="4" rx="16" ry="12" fill="#48b872"/>
  </g>`}function Ea(){const e=Array.from({length:26},()=>{const a=Math.round(Math.random()*1200),s=Math.round(Math.random()*240),t=(Math.random()*1.6+.8).toFixed(1);return`<circle cx="${a}" cy="${s}" r="${t}" fill="#fff" opacity="${(Math.random()*.5+.25).toFixed(2)}"/>`}).join("");return`
<svg viewBox="0 0 1200 800" ${Dt} aria-hidden="true">
  <defs>
    <linearGradient id="hubSky" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#0f2b52"/><stop offset=".42" stop-color="#2a6f9e"/>
      <stop offset=".72" stop-color="#54b6c4"/><stop offset="1" stop-color="#9ee7cf"/>
    </linearGradient>
    <radialGradient id="hubSun" cx="50%" cy="50%" r="50%">
      <stop offset="0" stop-color="#fff3c4"/><stop offset=".55" stop-color="#ffd166"/>
      <stop offset="1" stop-color="#ffd166" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="1200" height="800" fill="url(#hubSky)"/>
  ${e}
  <circle cx="960" cy="210" r="150" fill="url(#hubSun)" opacity=".85"/>
  <circle cx="960" cy="210" r="52" fill="#ffe08a" opacity=".95"/>
  ${yt(190,150,1.25,.5)}${yt(700,110,.9,.4)}${yt(1060,330,1.1,.35)}
  ${yt(380,300,.75,.28)}

  <!-- far hills -->
  <path d="M0 560c150-70 260-30 380 10s250 40 400-20 320-40 420 10v240H0z" fill="#2c7f86" opacity=".85"/>
  <path d="M0 620c170-60 300-10 430 30s260 20 400-30 300-20 370 20v160H0z" fill="#238a7a"/>
  <!-- mid hills -->
  <path d="M0 690c180-50 330 10 470 30s260-10 400-40 260-10 330 20v100H0z" fill="#1f9e7f"/>
  <!-- village -->
  <g opacity=".95">
    <g transform="translate(150 640)">
      <rect x="-34" y="-46" width="68" height="48" rx="8" fill="#f3e2c7"/>
      <path d="M-44-46 0-84l44 38z" fill="#e07a5f"/>
      <rect x="-12" y="-28" width="24" height="30" rx="4" fill="#ffd166"/>
    </g>
    <g transform="translate(1010 660) scale(.9)">
      <rect x="-34" y="-46" width="68" height="48" rx="8" fill="#f3e2c7"/>
      <path d="M-44-46 0-84l44 38z" fill="#7b61ff"/>
      <rect x="-12" y="-28" width="24" height="30" rx="4" fill="#ffd166"/>
    </g>
  </g>
  ${Tt(300,700,1.1)}${Tt(430,730,.85,"#35a061")}${Tt(880,720,1.05)}
  ${Tt(1130,700,.9,"#35a061")}${Ut(600,760,1.2)}${Ut(760,786,1)}
  <!-- foreground grass -->
  <path d="M0 760c220-40 420 20 640 10s380-40 560-16v46H0z" fill="#7ed99b"/>
  <rect y="790" width="1200" height="20" fill="#7ed99b"/>
</svg>`}function qa(){return`
<svg viewBox="0 0 1200 800" ${Dt} aria-hidden="true">
  <defs>
    <linearGradient id="wall" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#ffe6c9"/><stop offset="1" stop-color="#ffcfa8"/>
    </linearGradient>
    <linearGradient id="floorG" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#c98b52"/><stop offset="1" stop-color="#a86e3c"/>
    </linearGradient>
    <linearGradient id="winSky" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#8fd8ff"/><stop offset="1" stop-color="#d7f4e6"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="800" fill="url(#wall)"/>
  <!-- wallpaper dots -->
  <g fill="#ffb98a" opacity=".55">
    ${Array.from({length:40},(e,a)=>{const s=60+a%10*125,t=70+Math.floor(a/10)*130;return`<circle cx="${s}" cy="${t}" r="7"/><circle cx="${s+62}" cy="${t+65}" r="4"/>`}).join("")}
  </g>
  <!-- window -->
  <g transform="translate(170 130)">
    <rect x="-14" y="-14" width="288" height="248" rx="22" fill="#fff6e6" stroke="#e2a86f" stroke-width="12"/>
    <rect x="4" y="4" width="252" height="212" rx="10" fill="url(#winSky)"/>
    ${yt(90,60,.6,.95)}${yt(200,130,.45,.8)}
    <circle cx="215" cy="50" r="26" fill="#ffe08a"/>
    <path d="M4 170c40-26 80-6 120 10s90 6 132-14v50H4z" fill="#7ed99b"/>
    <rect x="120" y="4" width="14" height="212" fill="#e2a86f"/>
    <rect x="4" y="100" width="252" height="14" fill="#e2a86f"/>
  </g>
  <!-- shelf with toys -->
  <g transform="translate(830 190)">
    <rect x="0" y="150" width="300" height="18" rx="9" fill="#c98b52"/>
    <g transform="translate(50 150)">
      <circle cx="0" cy="-30" r="30" fill="#7b61ff"/><circle cx="-22" cy="-52" r="12" fill="#7b61ff"/>
      <circle cx="22" cy="-52" r="12" fill="#7b61ff"/><circle cx="-10" cy="-30" r="4" fill="#fff"/>
      <circle cx="10" cy="-30" r="4" fill="#fff"/><ellipse cx="0" cy="-18" rx="10" ry="7" fill="#ffd7c9"/>
    </g>
    <g transform="translate(150 150)">
      <rect x="-26" y="-52" width="52" height="52" rx="10" fill="#ff6f61"/>
      <rect x="-14" y="-40" width="28" height="28" rx="6" fill="#ffd166"/>
    </g>
    <g transform="translate(240 150)">
      <path d="M-24 0v-56h48v56z" fill="#2fd6c0"/><path d="M-24-56h48l-10 12h-28z" fill="#12a08f"/>
    </g>
  </g>
  <!-- hanging mobile -->
  <g transform="translate(600 0)" opacity=".95">
    <path d="M0 0v90" stroke="#c98b52" stroke-width="6"/>
    <path d="M-90 90h180" stroke="#c98b52" stroke-width="6" stroke-linecap="round"/>
    <g><path d="M-80 90v30" stroke="#c98b52" stroke-width="4"/><circle cx="-80" cy="136" r="16" fill="#ffd166"/></g>
    <g><path d="M0 90v46" stroke="#c98b52" stroke-width="4"/><path d="M-16 152a16 16 0 1 1 32 0z" fill="#63c6ff"/></g>
    <g><path d="M80 90v24" stroke="#c98b52" stroke-width="4"/><path d="M80 116l14 24H66z" fill="#ff9a86"/></g>
  </g>
  <!-- floor + rug -->
  <path d="M0 620h1200v180H0z" fill="url(#floorG)"/>
  <g stroke="#8f5a2c" stroke-width="4" opacity=".5">
    ${Array.from({length:9},(e,a)=>`<path d="M${a*150} 620 ${a*150-60} 800"/>`).join("")}
  </g>
  <ellipse cx="600" cy="740" rx="440" ry="90" fill="#f2b5a0"/>
  <ellipse cx="600" cy="740" rx="330" ry="66" fill="#ffd7c9"/>
  <ellipse cx="600" cy="740" rx="210" ry="42" fill="#fff0e2"/>
  <!-- crib on the right -->
  <g transform="translate(1000 470)">
    <rect x="-10" y="0" width="230" height="24" rx="12" fill="#e2a86f"/>
    <rect x="-10" y="90" width="230" height="24" rx="12" fill="#e2a86f"/>
    ${Array.from({length:8},(e,a)=>`<rect x="${a*30}" y="0" width="10" height="110" rx="5" fill="#f0c391"/>`).join("")}
    <rect x="0" y="112" width="16" height="52" rx="8" fill="#c98b52"/>
    <rect x="200" y="112" width="16" height="52" rx="8" fill="#c98b52"/>
  </g>
</svg>`}function Pa(){return`
<svg viewBox="0 0 1200 800" ${Dt} aria-hidden="true">
  <defs>
    <linearGradient id="clsWall" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#1b3f6b"/><stop offset=".55" stop-color="#2f6fa8"/>
      <stop offset="1" stop-color="#3f9bbd"/>
    </linearGradient>
    <linearGradient id="deskG" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#f0b979"/><stop offset="1" stop-color="#c9803c"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="800" fill="url(#clsWall)"/>
  <!-- soft light beams -->
  <g opacity=".12" fill="#fff">
    <path d="M120 0 320 0 120 800 -80 800z"/>
    <path d="M520 0 640 0 420 800 300 800z"/>
    <path d="M980 0 1140 0 980 800 820 800z"/>
  </g>
  <!-- pin board -->
  <g transform="translate(120 90)">
    <rect width="420" height="280" rx="20" fill="#f6e0bd" stroke="#c9803c" stroke-width="12"/>
    <g transform="translate(40 40)">
      <rect width="150" height="110" rx="8" fill="#fff" transform="rotate(-4)"/>
      <g transform="rotate(-4) translate(12 14)">
        <circle cx="30" cy="26" r="18" fill="#ffd166"/>
        <path d="M0 84c8-26 24-34 30-34s22 8 30 34z" fill="#2fd6c0"/>
        <rect x="76" y="14" width="58" height="10" rx="5" fill="#cfd9e6"/>
        <rect x="76" y="34" width="46" height="10" rx="5" fill="#cfd9e6"/>
        <rect x="76" y="54" width="58" height="10" rx="5" fill="#cfd9e6"/>
      </g>
      <g transform="translate(190 10) rotate(5)">
        <rect width="150" height="110" rx="8" fill="#fff"/>
        <path d="M22 76 60 34l26 28 20-18 24 32z" fill="#7ed99b"/>
        <circle cx="112" cy="26" r="14" fill="#ffd166"/>
      </g>
    </g>
    <circle cx="60" cy="34" r="8" fill="#ff6f61"/>
    <circle cx="360" cy="40" r="8" fill="#7b61ff"/>
  </g>
  <!-- whiteboard -->
  <g transform="translate(700 110)">
    <rect width="400" height="250" rx="18" fill="#f7fbff" stroke="#cfd9e6" stroke-width="10"/>
    <g stroke="#2fd6c0" stroke-width="10" stroke-linecap="round" fill="none">
      <path d="M50 70h180"/><path d="M50 110h240"/><path d="M50 150h140"/>
    </g>
    <g transform="translate(300 150)">
      <path d="M0-60 46-42v34c0 24-18 38-46 46-28-8-46-22-46-46v-34z" fill="#ffd166" stroke="#e0a92a" stroke-width="7"/>
      <path d="m-18 -6 12 12 26-28" stroke="#8a6100" stroke-width="8" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    </g>
  </g>
  <!-- desk -->
  <path d="M0 560h1200v240H0z" fill="url(#deskG)"/>
  <rect y="548" width="1200" height="34" rx="16" fill="#f3cf9e"/>
  <g opacity=".35" stroke="#a86e3c" stroke-width="4">
    ${Array.from({length:12},(e,a)=>`<path d="M0 ${600+a*18}h1200"/>`).join("")}
  </g>
  <!-- desk props -->
  <g transform="translate(110 560)">
    <rect x="-40" y="-70" width="80" height="70" rx="12" fill="#ff6f61" stroke="#c9483c" stroke-width="6"/>
    <rect x="-16" y="-96" width="12" height="30" rx="6" fill="#ffd166"/>
    <rect x="4" y="-104" width="12" height="38" rx="6" fill="#63c6ff"/>
    <rect x="-34" y="-100" width="12" height="34" rx="6" fill="#7ed99b"/>
  </g>
  <g transform="translate(1080 560)">
    <ellipse cx="0" cy="-8" rx="58" ry="14" fill="#e0f7ff"/>
    <path d="M-46-8c0-30 92-30 92 0z" fill="#a8e6ff"/>
    <path d="M-30-40c6-14 54-14 60 0z" fill="#7ed99b" opacity=".8"/>
  </g>
</svg>`}function Kt(){return`
<svg viewBox="0 0 300 200" preserveAspectRatio="none" aria-hidden="true">
  <defs>
    <linearGradient id="ppSky" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#8fd8ff"/><stop offset="1" stop-color="#d9f6ea"/>
    </linearGradient>
  </defs>
  <rect width="300" height="200" fill="url(#ppSky)"/>
  <circle cx="252" cy="34" r="22" fill="#ffe08a"/>
  <g fill="#fff" opacity=".9">
    <ellipse cx="60" cy="34" rx="22" ry="13"/><ellipse cx="76" cy="38" rx="16" ry="10"/>
    <ellipse cx="44" cy="38" rx="14" ry="9"/>
    <ellipse cx="180" cy="22" rx="16" ry="9"/><ellipse cx="192" cy="25" rx="12" ry="7"/>
  </g>
  <!-- school building -->
  <g transform="translate(150 96)">
    <rect x="-70" y="-30" width="140" height="60" rx="8" fill="#fff3df" stroke="#d9a26a" stroke-width="3"/>
    <path d="M-80-30 0-66l80 36z" fill="#e07a5f" stroke="#b9553c" stroke-width="3"/>
    <rect x="-14" y="-6" width="28" height="36" rx="4" fill="#7b61ff"/>
    <circle cx="6" cy="14" r="2.4" fill="#ffd166"/>
    <rect x="-56" y="-16" width="24" height="20" rx="4" fill="#63c6ff" stroke="#3f9bbd" stroke-width="2"/>
    <rect x="32" y="-16" width="24" height="20" rx="4" fill="#63c6ff" stroke="#3f9bbd" stroke-width="2"/>
    <path d="M0-66v-12" stroke="#8d6b4b" stroke-width="3"/>
    <path d="M0-78h18l-4 6 4 6H0z" fill="#2fd6c0"/>
  </g>
  <!-- grass -->
  <path d="M0 130c60-16 110 8 160 10s90-10 140-14v74H0z" fill="#7ed99b"/>
  <path d="M0 152c70-10 120 12 170 12s90-8 130-12v48H0z" fill="#5fc482"/>
  <!-- trees -->
  <g transform="translate(28 138)">
    <rect x="-4" y="-4" width="8" height="24" rx="4" fill="#8d6b4b"/>
    <circle cx="0" cy="-18" r="18" fill="#3fae6a"/><circle cx="-12" cy="-8" r="12" fill="#48b872"/>
    <circle cx="12" cy="-8" r="12" fill="#48b872"/>
  </g>
  <g transform="translate(276 146) scale(.85)">
    <rect x="-4" y="-4" width="8" height="24" rx="4" fill="#8d6b4b"/>
    <circle cx="0" cy="-18" r="18" fill="#3fae6a"/><circle cx="-12" cy="-8" r="12" fill="#48b872"/>
  </g>
  <!-- three students + trusted adult holding a shield -->
  <g transform="translate(96 168)">
    <ellipse cx="0" cy="16" rx="16" ry="4" fill="#3f9663" opacity=".5"/>
    <path d="M-13 14c-2-22 4-30 13-30s15 8 13 30z" fill="#ff6f61"/>
    <circle cx="0" cy="-22" r="12" fill="#f7c9a5"/>
    <path d="M-12-24a12 12 0 0 1 24 0c-4-5-8-6-12-6s-8 1-12 6z" fill="#3b2b28"/>
    <circle cx="-4" cy="-21" r="1.8" fill="#25303f"/><circle cx="4" cy="-21" r="1.8" fill="#25303f"/>
    <path d="M-3-15c2 2 4 2 6 0" stroke="#8a4a3a" stroke-width="1.6" fill="none" stroke-linecap="round"/>
  </g>
  <g transform="translate(150 172) scale(1.15)">
    <ellipse cx="0" cy="14" rx="17" ry="4" fill="#3f9663" opacity=".5"/>
    <path d="M-14 12c-2-22 5-30 14-30s16 8 14 30z" fill="#2fd6c0"/>
    <circle cx="0" cy="-22" r="12" fill="#e8b78d"/>
    <path d="M-12-24a12 12 0 0 1 24 0c-4-6-8-7-12-7s-8 1-12 7z" fill="#241a18"/>
    <circle cx="-4" cy="-21" r="1.8" fill="#25303f"/><circle cx="4" cy="-21" r="1.8" fill="#25303f"/>
    <path d="M-4-14c3 3 5 3 8 0" stroke="#8a4a3a" stroke-width="1.6" fill="none" stroke-linecap="round"/>
  </g>
  <g transform="translate(204 168)">
    <ellipse cx="0" cy="16" rx="16" ry="4" fill="#3f9663" opacity=".5"/>
    <path d="M-13 14c-2-22 4-30 13-30s15 8 13 30z" fill="#ffc93c"/>
    <circle cx="0" cy="-22" r="12" fill="#f2c39c"/>
    <path d="M-12-22c0-8 5-12 12-12s12 4 12 12c0 4-2 6-4 6 0-6-4-8-8-8s-8 2-8 8c-2 0-4-2-4-6z" fill="#5a3a2a"/>
    <circle cx="-4" cy="-21" r="1.8" fill="#25303f"/><circle cx="4" cy="-21" r="1.8" fill="#25303f"/>
    <path d="M-3-15c2 2 4 2 6 0" stroke="#8a4a3a" stroke-width="1.6" fill="none" stroke-linecap="round"/>
  </g>
  <!-- protective shield emblem -->
  <g transform="translate(150 96) scale(.62)">
    <path d="M0-52 40-36v28c0 22-16 36-40 44-24-8-40-22-40-44v-28z" fill="#ffd166" stroke="#e0a92a" stroke-width="6" opacity=".95"/>
    <path d="m-16-6 12 12 24-26" stroke="#8a6100" stroke-width="8" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
  </g>
  <!-- banner -->
  <g transform="translate(150 18)">
    <rect x="-92" y="-14" width="184" height="28" rx="14" fill="#7b61ff" opacity=".92"/>
    <text x="0" y="6" text-anchor="middle" font-family="ui-rounded, system-ui, sans-serif"
          font-size="15" font-weight="900" fill="#fff">SAFE SCHOOL, SAFE ME</text>
  </g>
</svg>`}function La(e){const a=t=>e>=t?"#ffd166":"#e3e9f2",s=t=>e>=t?"#e0a92a":"#cbd5e4";return`
<svg viewBox="0 0 200 170" aria-hidden="true">
  <circle cx="100" cy="92" r="62" fill="#e8f7f4"/>
  <path d="M100 40 148 58v34c0 28-20 46-48 56-28-10-48-28-48-56V58z" fill="#2fd6c0" stroke="#0b7a6d" stroke-width="6"/>
  <path d="m82 92 14 14 28-32" stroke="#fff" stroke-width="11" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
  <g>
    <g transform="translate(36 40)"><path d="m0-16 5 10 11 2-8 8 2 11-10-5-10 5 2-11-8-8 11-2z" fill="${a(1)}" stroke="${s(1)}" stroke-width="3"/></g>
    <g transform="translate(100 18) scale(1.25)"><path d="m0-16 5 10 11 2-8 8 2 11-10-5-10 5 2-11-8-8 11-2z" fill="${a(2)}" stroke="${s(2)}" stroke-width="2.6"/></g>
    <g transform="translate(164 40)"><path d="m0-16 5 10 11 2-8 8 2 11-10-5-10 5 2-11-8-8 11-2z" fill="${a(3)}" stroke="${s(3)}" stroke-width="3"/></g>
  </g>
</svg>`}const wt=320,xt=180;function nt(e,a,s,t){return`
<svg viewBox="0 0 ${wt} ${xt}" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
  <defs>
    <linearGradient id="${e}Sky" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="${a[0]}"/><stop offset="1" stop-color="${a[1]}"/>
    </linearGradient>
    <radialGradient id="${e}Key" cx="22%" cy="10%" r="80%">
      <stop offset="0" stop-color="#ffffff" stop-opacity=".28"/>
      <stop offset="1" stop-color="#ffffff" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="${e}Vig" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#050d1c" stop-opacity="0"/>
      <stop offset="1" stop-color="#050d1c" stop-opacity=".34"/>
    </linearGradient>
    <pattern id="${e}Mark" width="54" height="54" patternUnits="userSpaceOnUse" patternTransform="rotate(-12)">
      <path d="M27 12 40 17v11c0 9-6 14-13 17-7-3-13-8-13-17V17z" fill="#ffffff" opacity=".05"/>
    </pattern>
  </defs>
  <rect width="${wt}" height="${xt}" fill="url(#${e}Sky)"/>
  <rect width="${wt}" height="${xt}" fill="url(#${e}Mark)"/>
  ${t!=null?t:""}
  <rect width="${wt}" height="${xt}" fill="url(#${e}Key)"/>
  ${s}
  <rect width="${wt}" height="${xt}" fill="url(#${e}Vig)"/>
</svg>`}const Qe=(e,a,s,t=s*.26)=>`<ellipse cx="${e}" cy="${a}" rx="${s}" ry="${t}" fill="#06202a" opacity=".22"/>`;function Aa(){const e=`
  <!-- nursery props -->
  <g opacity=".55">
    <rect x="18" y="30" width="52" height="46" rx="8" fill="#fff3e2" stroke="#e2a86f" stroke-width="4"/>
    <rect x="26" y="38" width="36" height="30" rx="4" fill="#bfe9ff"/>
    <circle cx="54" cy="46" r="6" fill="#ffe08a"/>
    <path d="M26 60c8-6 16-2 22 2s12 4 14 2v4H26z" fill="#8fe0ad"/>
  </g>
  <g opacity=".5">
    <path d="M262 20v18" stroke="#c98b52" stroke-width="4"/>
    <path d="M240 38h44" stroke="#c98b52" stroke-width="4" stroke-linecap="round"/>
    <circle cx="244" cy="50" r="8" fill="#ffd166"/>
    <path d="M262 38v10" stroke="#c98b52" stroke-width="3"/><path d="M254 58a8 8 0 0 1 16 0z" fill="#63c6ff"/>
    <path d="M280 38v8" stroke="#c98b52" stroke-width="3"/><path d="M280 48l7 12h-14z" fill="#ff9a86"/>
  </g>

  ${Qe(160,168,62,12)}

  <!-- mother (bust, correct proportions: head ≈ 1/4 of the visible figure) -->
  <g transform="translate(160 24)">
    <!-- long hair behind -->
    <path d="M0 6c-26 0-38 18-38 44 0 22 3 40-3 62 14 6 27 9 41 10 14-1 27-4 41-10-6-22-3-40-3-62C38 24 26 6 0 6z"
          fill="#3b2b28"/>
    <!-- body -->
    <path d="M0 74c-26 0-40 16-46 44-2 10-3 20-3 34h98c0-14-1-24-3-34-6-28-20-44-46-44z" fill="#7b61ff"/>
    <path d="M-20 84c6 8 12 12 20 12s14-4 20-12" stroke="#4a34b8" stroke-width="4" fill="none" opacity=".4"/>
    <!-- neck: short and natural -->
    <path d="M-9 60h18v12c0 6-4 9-9 9s-9-3-9-9z" fill="#e8b78d"/>
    <!-- head -->
    <ellipse cx="0" cy="36" rx="26" ry="28" fill="#f7c9a5"/>
    <path d="M-26 32c0-22 12-30 26-30s26 8 26 30c-3-11-9-16-14-17-5 6-16 9-25 7-7-2-11 2-13 10z" fill="#3b2b28"/>
    <ellipse cx="-9" cy="38" rx="4.4" ry="5" fill="#fff"/><ellipse cx="9" cy="38" rx="4.4" ry="5" fill="#fff"/>
    <circle cx="-8.4" cy="39" r="2.6" fill="#25303f"/><circle cx="9.6" cy="39" r="2.6" fill="#25303f"/>
    <ellipse cx="-17" cy="45" rx="5" ry="3" fill="#ff9a86" opacity=".55"/>
    <ellipse cx="17" cy="45" rx="5" ry="3" fill="#ff9a86" opacity=".55"/>
    <path d="M-6 48c4 5 8 5 12 0" stroke="#b3564a" stroke-width="2.6" fill="none" stroke-linecap="round"/>
    <g transform="translate(22 12)"><circle r="4" fill="#ff8fa0"/><circle cx="-5" cy="-2.5" r="3.4" fill="#ff6f8a"/>
      <circle cx="5" cy="-2.5" r="3.4" fill="#ff6f8a"/><circle cx="-3.4" cy="4" r="3.4" fill="#ff6f8a"/>
      <circle cx="3.4" cy="4" r="3.4" fill="#ff6f8a"/><circle r="1.8" fill="#ffd166"/></g>
  </g>

  <!-- baby cradled in front -->
  <g transform="translate(160 122)">
    <path d="M0-24c22 0 37 14 37 33 0 18-16 29-37 29s-37-11-37-29c0-19 15-33 37-33z"
          fill="#ffd97a" stroke="#e9932a" stroke-width="3"/>
    <circle cx="0" cy="-4" r="22" fill="#fbd8b8"/>
    <path d="M-22-10c3-13 13-19 22-19s18 6 20 17c-7-6-13-3-20-3s-14-2-22 5z" fill="#c98b52"/>
    <ellipse cx="-8" cy="-4" rx="4.4" ry="5" fill="#fff"/><ellipse cx="8" cy="-4" rx="4.4" ry="5" fill="#fff"/>
    <circle cx="-7.4" cy="-3" r="2.8" fill="#25303f"/><circle cx="8.6" cy="-3" r="2.8" fill="#25303f"/>
    <ellipse cx="-15" cy="3" rx="5" ry="3.4" fill="#ff9a86" opacity=".8"/>
    <ellipse cx="15" cy="3" rx="5" ry="3.4" fill="#ff9a86" opacity=".8"/>
    <path d="M-6 4c4 5 9 5 13 0z" fill="#b3564a"/>
  </g>
  <!-- mother's arms in front of the bundle -->
  <path d="M120 118c-8 20 4 36 32 40" stroke="#6a4fe0" stroke-width="15" stroke-linecap="round" fill="none"/>
  <path d="M200 118c8 20-4 36-32 40" stroke="#7b61ff" stroke-width="15" stroke-linecap="round" fill="none"/>
  <ellipse cx="152" cy="150" rx="11" ry="8" fill="#f0b590"/>
  <ellipse cx="168" cy="151" rx="11" ry="8" fill="#e8b78d"/>

  <!-- YES / NO chips: the gameplay at a glance -->
  <g transform="translate(44 138)">
    <rect x="-28" y="-14" width="56" height="28" rx="14" fill="#29b96b" stroke="#158a4c" stroke-width="3"/>
    <text x="0" y="6" text-anchor="middle" font-family="ui-rounded, system-ui, sans-serif"
          font-size="15" font-weight="900" fill="#fff">YES</text>
  </g>
  <g transform="translate(278 138)">
    <rect x="-26" y="-14" width="52" height="28" rx="14" fill="#ef4b5e" stroke="#c22a3c" stroke-width="3"/>
    <text x="0" y="6" text-anchor="middle" font-family="ui-rounded, system-ui, sans-serif"
          font-size="15" font-weight="900" fill="#fff">NO</text>
  </g>`;return nt("cb",["#ffe9d2","#ffbf94"],e,'<path d="M0 132h320v48H0z" fill="#d79a63"/><ellipse cx="160" cy="150" rx="150" ry="30" fill="#ffd7c9" opacity=".85"/>')}function Ia(){const e=(s,t,i,n,r)=>`<rect x="${s}" y="${t}" width="${i}" height="${n}" rx="7" fill="${r}"/>`,a=`
  <!-- classroom hint -->
  <g opacity=".35">
    <rect x="16" y="18" width="66" height="48" rx="8" fill="#f7fbff"/>
    <path d="M24 56l14-16 10 10 8-8 12 14z" fill="#7ed99b"/><circle cx="66" cy="30" r="6" fill="#ffd166"/>
  </g>

  <!-- board with holes -->
  <g transform="translate(160 92)">
    <rect x="-104" y="-56" width="208" height="112" rx="16" fill="#0e2a4b" opacity=".45"/>
    <rect x="-104" y="-56" width="208" height="112" rx="16" fill="none" stroke="#ffffff"
          stroke-width="3" stroke-dasharray="9 8" opacity=".8"/>
    ${e(-98,-50,64,50,"#ffd166")}
    ${e(-30,-50,64,50,"#7ed99b")}
    ${e(-98,4,64,46,"#ff9a86")}
    ${e(38,4,60,46,"#63c6ff")}
    <!-- empty hole -->
    <rect x="38" y="-50" width="60" height="50" rx="7" fill="#08213c" opacity=".55"/>
    <text x="68" y="-18" text-anchor="middle" font-family="ui-rounded, system-ui, sans-serif"
          font-size="20" font-weight="900" fill="#9fc3e8" opacity=".8">?</text>
  </g>

  <!-- the piece being dragged in -->
  <g transform="translate(238 44) rotate(-12)">
    ${Qe(0,34,30,8)}
    <rect x="-30" y="-24" width="60" height="48" rx="9" fill="#ffe08a" stroke="#e0a92a" stroke-width="4"/>
    <circle cx="0" cy="-4" r="12" fill="#fff"/><path d="M-8 8c5 7 11 7 16 0z" fill="#e0a92a"/>
  </g>
  <!-- hand cursor -->
  <g transform="translate(252 92)">
    <path d="M0-16v16M0 0c-6 0-10 4-10 10 0 10 6 18 16 18h8c8 0 12-6 12-14v-12c0-4-6-4-6 0v6
             c0-6-6-6-6 0v-4c0-6-6-6-6 0v-4c0-6-8-6-8 0z" fill="#fff" stroke="#25303f" stroke-width="3"
          stroke-linejoin="round"/>
  </g>

  <!-- drag arrow -->
  <path d="M214 66c-14 6-22 14-26 22" stroke="#ffffff" stroke-width="4" fill="none"
        stroke-linecap="round" stroke-dasharray="7 8" opacity=".85"/>`;return nt("cp",["#1b3f6b","#3f9bbd"],a,'<path d="M0 148h320v32H0z" fill="#c9803c"/><rect y="140" width="320" height="12" rx="6" fill="#f3cf9e"/>')}function Ha(){const e=`
  <!-- Y road with aligned markings -->
  <g>
    <path d="M138 180v-52l-46-44V0" fill="none" stroke="#eef2f7" stroke-width="56" stroke-linejoin="round" stroke-linecap="round"/>
    <path d="M182 180v-52l46-44V0" fill="none" stroke="#eef2f7" stroke-width="56" stroke-linejoin="round" stroke-linecap="round"/>
    <path d="M138 180v-52l-46-44V0" fill="none" stroke="#59637a" stroke-width="46" stroke-linejoin="round" stroke-linecap="round"/>
    <path d="M182 180v-52l46-44V0" fill="none" stroke="#59637a" stroke-width="46" stroke-linejoin="round" stroke-linecap="round"/>
    <circle cx="160" cy="126" r="32" fill="#59637a"/>
    <path d="M160 180v-54" stroke="#ffd85e" stroke-width="4" stroke-dasharray="11 9"/>
    <path d="M150 116 108 76V6" stroke="#ffd85e" stroke-width="4" stroke-dasharray="11 9" fill="none"/>
    <path d="M170 116l42-40V6" stroke="#ffd85e" stroke-width="4" stroke-dasharray="11 9" fill="none"/>
    <g stroke="#ffffff" stroke-width="3" opacity=".55" stroke-linecap="round" fill="none">
      <path d="M150 140l-14-14"/><path d="M136 126h9"/><path d="M136 126v9"/>
      <path d="M170 140l14-14"/><path d="M184 126h-9"/><path d="M184 126v9"/>
    </g>
  </g>

  <!-- signs -->
  <g transform="translate(58 56)">
    <rect x="-26" y="-16" width="52" height="32" rx="9" fill="#29b96b" stroke="#158a4c" stroke-width="4"/>
    <text x="0" y="7" text-anchor="middle" font-family="ui-rounded, system-ui, sans-serif"
          font-size="15" font-weight="900" fill="#fff">YES</text>
    <rect x="-4" y="16" width="8" height="18" rx="4" fill="#8d6b4b"/>
  </g>
  <g transform="translate(262 56)">
    <rect x="-24" y="-16" width="48" height="32" rx="9" fill="#ef4b5e" stroke="#c22a3c" stroke-width="4"/>
    <text x="0" y="7" text-anchor="middle" font-family="ui-rounded, system-ui, sans-serif"
          font-size="15" font-weight="900" fill="#fff">NO</text>
    <rect x="-4" y="16" width="8" height="18" rx="4" fill="#8d6b4b"/>
  </g>

  <!-- top-down car -->
  <g transform="translate(160 142) scale(.94)">
    ${Qe(0,26,24,7)}
    <g fill="#232a3a">
      <rect x="-27" y="-22" width="10" height="18" rx="5"/><rect x="17" y="-22" width="10" height="18" rx="5"/>
      <rect x="-27" y="6" width="10" height="18" rx="5"/><rect x="17" y="6" width="10" height="18" rx="5"/>
    </g>
    <rect x="-22" y="-28" width="44" height="56" rx="16" fill="#ff6f61" stroke="#a8342a" stroke-width="3"/>
    <path d="M-14-14h28l-3 9h-22z" fill="#cdeeff" stroke="#6aa9c9" stroke-width="2"/>
    <rect x="-13" y="-4" width="26" height="17" rx="7" fill="#ffd0c6" stroke="#a8342a" stroke-width="2"/>
    <circle cx="0" cy="4" r="6.5" fill="#f7c9a5"/><path d="M-6.5 3a6.5 6.5 0 0 1 13 0z" fill="#3b2b28"/>
    <circle cx="-2.5" cy="5" r="1.3" fill="#25303f"/><circle cx="2.5" cy="5" r="1.3" fill="#25303f"/>
    <path d="M-13 15h26l-2 7h-22z" fill="#cdeeff" stroke="#6aa9c9" stroke-width="2"/>
    <rect x="-18" y="-27" width="9" height="5" rx="2.5" fill="#fff2b8"/>
    <rect x="9" y="-27" width="9" height="5" rx="2.5" fill="#fff2b8"/>
  </g>

  <!-- roadside trees, clearly on the grass -->
  <g transform="translate(28 120)">${Qe(2,22,16,5)}<rect x="-4" y="-2" width="8" height="24" rx="4" fill="#8d6b4b"/>
    <circle cx="0" cy="-12" r="18" fill="#2f9c5e"/><circle cx="-12" cy="-2" r="12" fill="#3fae6a"/>
    <circle cx="12" cy="-2" r="12" fill="#3fae6a"/><circle cx="-3" cy="-22" r="10" fill="#57c47e"/></g>
  <g transform="translate(292 132) scale(.85)">${Qe(2,22,16,5)}<rect x="-4" y="-2" width="8" height="24" rx="4" fill="#8d6b4b"/>
    <circle cx="0" cy="-12" r="18" fill="#2f9c5e"/><circle cx="-12" cy="-2" r="12" fill="#3fae6a"/>
    <circle cx="12" cy="-2" r="12" fill="#3fae6a"/></g>`;return nt("cd",["#7fd8a1","#4bb877"],e)}function Ba(){const e=(s,t,i,n=1)=>`<g transform="translate(${s} ${t}) scale(${n})"><path d="M0 8C-8 2-13-3-13-8a5.6 5.6 0 0 1 13-2.6A5.6 5.6 0 0 1 13-8c0 5-5 10-13 16z"
      fill="${i?"#ff4f6d":"#6d7893"}" stroke="${i?"#c22a3c":"#525c74"}" stroke-width="2.4"/></g>`,a=`
  <!-- arena banners + crowd -->
  <g opacity=".7">
    ${[36,96,224,284].map((s,t)=>`<g transform="translate(${s} 0)">
      <rect x="-11" y="-4" width="22" height="42" rx="5" fill="${["#2fd6c0","#ffd166","#ff6f61","#63c6ff"][t]}"/>
      <path d="M-11 38h22l-11 10z" fill="#0e1a33" opacity=".25"/></g>`).join("")}
  </g>
  <g opacity=".45" fill="#1a2a55">
    ${Array.from({length:12},(s,t)=>`<circle cx="${16+t*27}" cy="62" r="9"/>`).join("")}
    <rect y="70" width="320" height="12" fill="#152449"/>
  </g>

  <!-- hero -->
  <g transform="translate(86 150)">
    ${Qe(0,8,28,7)}
    <rect x="-14" y="-26" width="11" height="28" rx="5.5" fill="#2a3a5c"/>
    <rect x="3" y="-26" width="11" height="28" rx="5.5" fill="#2a3a5c"/>
    <path d="M-22-62c0-14 10-22 22-22s22 8 22 22v30c0 8-10 12-22 12s-22-4-22-12z" fill="#2fd6c0" stroke="#0b7a6d" stroke-width="3.4"/>
    <path d="M0-78l14 6v11c0 8-6 12-14 15-8-3-14-7-14-15v-11z" fill="#ffd166" stroke="#e0a92a" stroke-width="2.6"/>
    <circle cx="0" cy="-96" r="21" fill="#f7c9a5"/>
    <path d="M-21-98a21 21 0 0 1 42 0c-6-9-13-12-21-12s-15 3-21 12z" fill="#2f2320"/>
    <ellipse cx="-8" cy="-96" rx="5" ry="5.6" fill="#fff"/><ellipse cx="8" cy="-96" rx="5" ry="5.6" fill="#fff"/>
    <circle cx="-7" cy="-95" r="3" fill="#25303f"/><circle cx="9" cy="-95" r="3" fill="#25303f"/>
    <path d="M-6-86h12" stroke="#8a4a3a" stroke-width="3" stroke-linecap="round"/>
    <path d="M20-56c9 3 13 10 12 19" stroke="#f7c9a5" stroke-width="9" stroke-linecap="round" fill="none"/>
  </g>
  <g>${e(64,168,!0,.92)}${e(88,168,!0,.92)}${e(112,168,!0,.92)}</g>

  <!-- demon -->
  <g transform="translate(238 150)">
    ${Qe(0,8,32,8)}
    <ellipse cx="-14" cy="0" rx="13" ry="7" fill="#4a34b8"/><ellipse cx="14" cy="0" rx="13" ry="7" fill="#4a34b8"/>
    <path d="M0-96c25 0 39 22 39 53 0 32-17 48-39 48s-39-16-39-48c0-31 14-53 39-53z" fill="#7b61ff" stroke="#3f2ba3" stroke-width="3.4"/>
    <path d="M-25-84c-7-9-6-20 1-25 4 8 9 14 14 17z" fill="#c9b3ff" stroke="#3f2ba3" stroke-width="2.6"/>
    <path d="M25-84c7-9 6-20-1-25-4 8-9 14-14 17z" fill="#c9b3ff" stroke="#3f2ba3" stroke-width="2.6"/>
    <ellipse cx="0" cy="-26" rx="21" ry="24" fill="#c9b3ff" opacity=".45"/>
    <ellipse cx="-12" cy="-62" rx="10" ry="11" fill="#fff"/><ellipse cx="12" cy="-62" rx="10" ry="11" fill="#fff"/>
    <circle cx="-11" cy="-60" r="5.4" fill="#25303f"/><circle cx="13" cy="-60" r="5.4" fill="#25303f"/>
    <path d="M-20-78c6-4 13-4 17-1M20-78c-6-4-13-4-17-1" stroke="#3f2ba3" stroke-width="3.4" stroke-linecap="round" fill="none"/>
    <path d="M-12-40h24" stroke="#2b1c66" stroke-width="4.4" stroke-linecap="round"/>
  </g>
  <g>${e(214,168,!0,.92)}${e(238,168,!0,.92)}${e(262,168,!1,.92)}</g>

  <!-- energy burst mid-flight -->
  <g transform="translate(163 104)">
    <circle r="19" fill="#5ef0d8" opacity=".92"/><circle r="10" fill="#fff" opacity=".95"/>
    <path d="M0-30l6 15 15 6-15 6-6 15-6-15-15-6 15-6z" fill="#12a08f" opacity=".5"/>
  </g>
  <path d="M120 108c10-6 20-8 28-6" stroke="#5ef0d8" stroke-width="4" stroke-linecap="round"
        stroke-dasharray="6 7" fill="none" opacity=".8"/>`;return nt("ch",["#22265e","#5b41d8"],a,'<path d="M20 96h280l40 84H-20z" fill="#ffb648"/><path d="M46 108h228l30 72H16z" fill="#ffd08a" opacity=".65"/>')}function Ra(){const e=(t,i,n,r)=>`<rect x="${t}" y="${i}" width="${n}" height="${r}" rx="7" fill="#2f9c5e"/>
     <circle cx="${t+8}" cy="${i+8}" r="3.4" fill="#57c47e"/>`,a=(t,i,n,r,h=1)=>`<g transform="translate(${t} ${i}) scale(${h})">
      <path d="M-11 9c0-14 4-22 11-22s11 8 11 22c-4-3-5 2-7.5 2S0 8-3 10s-4-4-8 -1z" fill="${n}" stroke="${r}" stroke-width="2.6"/>
      <circle cx="-4" cy="-4" r="3.6" fill="#fff"/><circle cx="4" cy="-4" r="3.6" fill="#fff"/>
      <circle cx="-3.2" cy="-3.4" r="1.8" fill="#25303f"/><circle cx="4.8" cy="-3.4" r="1.8" fill="#25303f"/>
    </g>`,s=`
  <rect x="18" y="16" width="284" height="148" rx="14" fill="#f3e6c8"/>
  <g>
    ${e(18,16,284,14)}${e(18,150,284,14)}
    ${e(18,16,14,148)}${e(288,16,14,148)}
    ${e(96,44,14,62)}${e(40,88,62,14)}
    ${e(146,32,14,46)}${e(96,118,84,14)}
    ${e(196,46,14,74)}${e(210,46,56,14)}
    ${e(232,96,34,14)}${e(96,74,46,14)}
  </g>
  <!-- gates -->
  <g transform="translate(60 58)">
    <circle r="22" fill="#29b96b" opacity=".25"/>
    <rect x="-22" y="-13" width="44" height="26" rx="9" fill="#29b96b" stroke="#158a4c" stroke-width="3"/>
    <text x="0" y="6" text-anchor="middle" font-family="ui-rounded, system-ui, sans-serif"
          font-size="13" font-weight="900" fill="#fff">YES</text>
  </g>
  <g transform="translate(262 58)">
    <circle r="22" fill="#ef4b5e" opacity=".25"/>
    <rect x="-20" y="-13" width="40" height="26" rx="9" fill="#ef4b5e" stroke="#c22a3c" stroke-width="3"/>
    <text x="0" y="6" text-anchor="middle" font-family="ui-rounded, system-ui, sans-serif"
          font-size="13" font-weight="900" fill="#fff">NO</text>
  </g>
  <!-- runner -->
  <g transform="translate(160 140)">
    ${Qe(0,14,15,5)}
    <circle r="15" fill="#ffd166" stroke="#e0a92a" stroke-width="3"/>
    <path d="M-15-4a15 15 0 0 1 30 0z" fill="#12a08f"/>
    <circle cx="-5" cy="2" r="3" fill="#4a3405"/><circle cx="5" cy="2" r="3" fill="#4a3405"/>
    <path d="M-5 8c3 3 7 3 10 0" stroke="#8a6100" stroke-width="2.4" fill="none" stroke-linecap="round"/>
    <ellipse cx="-16" cy="4" rx="8" ry="4" fill="#ff6f61" transform="rotate(-14)"/>
  </g>
  <!-- three chasers -->
  ${a(112,96,"#ff6f61","#c9483c",1.05)}
  ${a(214,128,"#c084ff","#7b3fd0",1.05)}
  ${a(232,108,"#63c6ff","#2f7fbd",1.05)}`;return nt("cm",["#123a5c","#1f7a56"],s)}function Oa(){const e=`
  <!-- sky furniture -->
  <g fill="#fff" opacity=".95">
    <ellipse cx="58" cy="40" rx="21" ry="11"/><ellipse cx="75" cy="44" rx="15" ry="8"/><ellipse cx="43" cy="44" rx="13" ry="7"/>
    <ellipse cx="196" cy="26" rx="16" ry="8"/><ellipse cx="209" cy="29" rx="11" ry="6"/>
  </g>
  <circle cx="290" cy="28" r="16" fill="#ffe08a"/>
  <g opacity=".5" fill="#7ed99b">
    <ellipse cx="60" cy="128" rx="90" ry="34"/><ellipse cx="250" cy="126" rx="110" ry="36"/>
  </g>

  <!-- castle on the right: the goal of the adventure -->
  <g transform="translate(242 132)">
    ${Qe(0,6,52,8)}
    <rect x="-46" y="-58" width="20" height="58" rx="4" fill="#dfe7f2" stroke="#b7c3d6" stroke-width="2.5"/>
    <path d="M-49-58h26l-13-16z" fill="#5b41d8"/>
    <rect x="26" y="-58" width="20" height="58" rx="4" fill="#dfe7f2" stroke="#b7c3d6" stroke-width="2.5"/>
    <path d="M23-58h26l-13-16z" fill="#5b41d8"/>
    <rect x="-28" y="-48" width="56" height="48" rx="5" fill="#eef3fa" stroke="#b7c3d6" stroke-width="2.5"/>
    <path d="M-32-48h64l-32-20z" fill="#7b61ff"/>
    <path d="M0-68v-12h14l-4 5 4 5z" fill="#ffd166"/>
    <rect x="-9" y="-22" width="18" height="22" rx="9" fill="#2b1c66"/>
    <rect x="-38" y="-44" width="10" height="12" rx="3" fill="#63c6ff"/>
    <rect x="28" y="-44" width="10" height="12" rx="3" fill="#63c6ff"/>
  </g>

  <!-- princess: the SAME height as the hero, waving beside the gate -->
  <g transform="translate(288 132)">
    ${Qe(0,2,15,4)}
    <path d="M-13 0c-1-19 5-27 13-27s14 8 13 27z" fill="#ff8fb1" stroke="#d3527c" stroke-width="2.6"/>
    <path d="M-9-27c2-5 5-7 9-7s7 2 9 7z" fill="#ffa7c4"/>
    <path d="M9-30c7-3 11 0 12 6" stroke="#f7c9a5" stroke-width="5" stroke-linecap="round" fill="none"/>
    <circle cx="0" cy="-38" r="11" fill="#f7c9a5"/>
    <path d="M-11-40a11 11 0 0 1 22 0c-3-6-6-8-11-8s-8 2-11 8z" fill="#7a4a2a"/>
    <path d="M-12-33c-3 8-3 14-1 19 3-6 3-12 1-19zM12-33c3 8 3 14 1 19-3-6-3-12-1-19z" fill="#7a4a2a"/>
    <path d="M-9-47l3-8 3 6 3-8 3 8 3-6 3 8z" fill="#ffd166"/>
    <circle cx="-4" cy="-38" r="1.9" fill="#25303f"/><circle cx="4" cy="-38" r="1.9" fill="#25303f"/>
    <ellipse cx="-8" cy="-34" rx="3" ry="2" fill="#ff9a86" opacity=".7"/>
    <ellipse cx="8" cy="-34" rx="3" ry="2" fill="#ff9a86" opacity=".7"/>
    <path d="M-3-32c2 2 4 2 6 0" stroke="#b3564a" stroke-width="1.8" fill="none" stroke-linecap="round"/>
  </g>

  <!-- platform staircase leading to the castle -->
  <g>
    <rect x="14" y="126" width="78" height="15" rx="7" fill="#8d6b4b"/>
    <rect x="14" y="122" width="78" height="9" rx="4.5" fill="#57c47e"/>
    <rect x="108" y="98" width="70" height="15" rx="7" fill="#8d6b4b"/>
    <rect x="108" y="94" width="70" height="9" rx="4.5" fill="#57c47e"/>
    <rect x="186" y="120" width="52" height="15" rx="7" fill="#8d6b4b"/>
    <rect x="186" y="116" width="52" height="9" rx="4.5" fill="#57c47e"/>
  </g>

  <!-- ? block above the middle platform -->
  <g transform="translate(143 58)">
    <rect x="-17" y="-17" width="34" height="34" rx="8" fill="#ffd166" stroke="#e0a92a" stroke-width="4"/>
    ${[[-11,-11],[11,-11],[-11,11],[11,11]].map(([a,s])=>`<circle cx="${a}" cy="${s}" r="2.4" fill="#e0a92a"/>`).join("")}
    <text x="0" y="8" text-anchor="middle" font-family="ui-rounded, system-ui, sans-serif"
          font-size="22" font-weight="900" fill="#8a6100">?</text>
  </g>
  <g transform="translate(143 90)" opacity=".85">
    <path d="M0-8v10" stroke="#ffd166" stroke-width="4" stroke-linecap="round" stroke-dasharray="4 5"/>
  </g>

  <!-- hero mid-jump, same scale as the princess -->
  <g transform="translate(96 104)">
    ${Qe(4,26,15,5)}
    <rect x="-11" y="4" width="8" height="15" rx="4" fill="#2a3a5c" transform="rotate(-14)"/>
    <rect x="4" y="4" width="8" height="15" rx="4" fill="#2a3a5c" transform="rotate(12)"/>
    <path d="M-14-9c0-9 6-14 14-14s14 5 14 14v10c0 6-6 9-14 9s-14-3-14-9z" fill="#2fd6c0" stroke="#0b7a6d" stroke-width="3"/>
    <circle cx="0" cy="-9" r="5" fill="#ffd166"/>
    <path d="M13-16c7-4 12-1 13 6" stroke="#f7c9a5" stroke-width="6.5" stroke-linecap="round" fill="none"/>
    <path d="M-13-16c-6-2-9 1-10 6" stroke="#f7c9a5" stroke-width="6.5" stroke-linecap="round" fill="none"/>
    <circle cx="0" cy="-33" r="13" fill="#f7c9a5"/>
    <path d="M-13-35a13 13 0 0 1 26 0c-4-6-8-8-13-8s-9 2-13 8z" fill="#2f2320"/>
    <ellipse cx="4" cy="-33" rx="3.6" ry="4.2" fill="#fff"/><circle cx="5" cy="-32" r="2.2" fill="#25303f"/>
    <ellipse cx="-6" cy="-33" rx="3.4" ry="4" fill="#fff"/><circle cx="-5" cy="-32" r="2" fill="#25303f"/>
    <path d="M-2-25c3 3 6 3 8 0" stroke="#8a4a3a" stroke-width="2.4" fill="none" stroke-linecap="round"/>
  </g>
  <!-- motion arc under the jump -->
  <path d="M46 138c10-20 24-30 38-32" stroke="#ffffff" stroke-width="3.4" fill="none"
        stroke-linecap="round" stroke-dasharray="5 7" opacity=".55"/>

  <!-- critter patrolling the first platform -->
  <g transform="translate(206 114)">
    ${Qe(0,6,12,4)}
    <ellipse cx="0" cy="-3" rx="12" ry="10" fill="#ff9a86" stroke="#c9483c" stroke-width="2.6"/>
    <circle cx="-4" cy="-5" r="3.2" fill="#fff"/><circle cx="4" cy="-5" r="3.2" fill="#fff"/>
    <circle cx="-3.4" cy="-4.4" r="1.6" fill="#25303f"/><circle cx="4.6" cy="-4.4" r="1.6" fill="#25303f"/>
  </g>`;return nt("cz",["#5bc0ff","#cdf1ff"],e,'<path d="M0 150h320v30H0z" fill="#8d6b4b"/><rect y="144" width="320" height="12" rx="6" fill="#57c47e"/>')}function Na(){const e=[];for(let r=0;r<4;r++)for(let h=0;h<5;h++){const f=90+h*29,c=46+r*29,m=r===h,k=m&&r<3;e.push(k?`<g><rect x="${f}" y="${c}" width="24" height="24" rx="7" fill="#fff4d2" stroke="#e0a92a" stroke-width="3"/>
             <path d="m${f+24/2} ${c+5} 2.6 5.6 6 .8-4.4 4.2 1.1 6-5.3-3-5.3 3 1.1-6-4.4-4.2 6-.8z" fill="#ffd166" stroke="#e0a92a" stroke-width="1.4"/></g>`:`<g><rect x="${f}" y="${c}" width="24" height="24" rx="7" fill="#5fd8ff" stroke="#1d5f96" stroke-width="3"/>
             <path d="M${f} ${c+24/2}h24" stroke="#1d5f96" stroke-width="2" opacity=".45"/>
             <circle cx="${f+24/2}" cy="${c+24/2}" r="4.4" fill="#ffd166" stroke="#e0a92a" stroke-width="1.6"/></g>`),m&&e.push(`<rect x="${f-3}" y="${c-3}" width="30" height="30" rx="9" fill="none"
             stroke="#ffd166" stroke-width="3" stroke-dasharray="6 5" opacity=".95"/>`)}const n=`
  <g opacity=".16" fill="#fff">
    ${Array.from({length:10},(r,h)=>{const f=h/10*Math.PI*2,c=f+.2;return`<path d="M160 96 L${160+Math.cos(f)*300} ${96+Math.sin(f)*300} L${160+Math.cos(c)*300} ${96+Math.sin(c)*300}z"/>`}).join("")}
  </g>
  ${[24,60,260,296].map(r=>`<circle cx="${r}" cy="16" r="6.5" fill="#ffe08a" opacity=".9"/>`).join("")}
  <!-- stage curtains -->
  <path d="M0 0h44c-8 62-4 118 4 180H0z" fill="#ff8a72"/>
  <path d="M320 0h-44c8 62 4 118-4 180h48z" fill="#ff8a72"/>
  ${e.join("")}
  <!-- star popping out of a freshly opened box -->
  <g transform="translate(238 138)">
    <circle r="21" fill="#ffd166" opacity=".28"/>
    <path d="m0-18 5.4 11 12 1.7-8.8 8.4 2.2 12L0 9.6-10.8 15l2.2-12-8.8-8.4 12-1.7z" fill="#ffd166" stroke="#e0a92a" stroke-width="3"/>
  </g>
  <g transform="translate(74 140)">
    <rect x="-20" y="-18" width="40" height="36" rx="9" fill="#5fd8ff" stroke="#1d5f96" stroke-width="3"/>
    <path d="M-20-2h40" stroke="#1d5f96" stroke-width="2.4" opacity=".5"/>
    <circle cx="0" cy="-2" r="6" fill="#ffd166" stroke="#e0a92a" stroke-width="2"/>
  </g>`;return nt("cbg",["#2a1b6b","#7b4fd0"],n,'<path d="M0 156h320v24H0z" fill="#241a52"/>')}function Mt(e="happy"){return`
<svg viewBox="0 0 200 220" class="kaya" role="img" aria-label="Kaya, the Safe Squad guardian mascot">
  <defs>
    <linearGradient id="kayaBody" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#4ce4cd"/><stop offset="1" stop-color="#12a08f"/>
    </linearGradient>
    <radialGradient id="kayaGlow" cx="50%" cy="45%" r="55%">
      <stop offset="0" stop-color="#ffffff" stop-opacity=".55"/>
      <stop offset="1" stop-color="#ffffff" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <ellipse cx="100" cy="204" rx="52" ry="10" fill="#06202a" opacity=".22"/>
  <!-- sprout leaf -->
  <path d="M100 40c0-16 12-28 30-30-2 18-13 29-30 32z" fill="#7ce495"/>
  <path d="M100 42c-2-14-12-22-27-24 2 15 11 23 27 26z" fill="#57cf7c"/>
  <path d="M100 44v14" stroke="#2f9e63" stroke-width="6" stroke-linecap="round"/>
  <!-- shield body -->
  <path d="M100 52c22 6 42 9 46 10v58c0 40-24 62-46 72-22-10-46-32-46-72V62c4-1 24-4 46-10z"
        fill="url(#kayaBody)" stroke="#0b7a6d" stroke-width="5" stroke-linejoin="round"/>
  <path d="M100 52c22 6 42 9 46 10v58c0 40-24 62-46 72V52z" fill="#0b7a6d" opacity=".08"/>
  <ellipse cx="100" cy="105" rx="42" ry="42" fill="url(#kayaGlow)"/>
  ${e==="wave"?'<g style="transform-origin:52px 150px;animation:arm-wiggle-l 1.2s ease-in-out infinite"><path d="M52 150c-14-6-22-18-20-30" stroke="#12a08f" stroke-width="13" stroke-linecap="round" fill="none"/></g>':'<path d="M52 150c-13 2-20 10-21 20" stroke="#12a08f" stroke-width="13" stroke-linecap="round" fill="none"/>'}
  <path d="M148 150c13 2 20 10 21 20" stroke="#12a08f" stroke-width="13" stroke-linecap="round" fill="none"/>
  <!-- face -->
  <g>
    <ellipse cx="80" cy="99" rx="13" ry="14.5" fill="#fff"/>
    <ellipse cx="120" cy="99" rx="13" ry="14.5" fill="#fff"/>
    <circle cx="82" cy="102" r="7" fill="#0d3b36"/>
    <circle cx="122" cy="102" r="7" fill="#0d3b36"/>
    <circle cx="79" cy="98" r="2.6" fill="#fff"/>
    <circle cx="119" cy="98" r="2.6" fill="#fff"/>
    <ellipse cx="62" cy="118" rx="9" ry="6" fill="#ff9a86" opacity=".65"/>
    <ellipse cx="138" cy="118" rx="9" ry="6" fill="#ff9a86" opacity=".65"/>
    ${e==="think"?'<path d="M86 128c6-3 14-3 20 1" stroke="#0d3b36" stroke-width="5" stroke-linecap="round" fill="none"/>':'<path d="M80 124c6 12 28 12 34 0z" fill="#0d3b36"/><path d="M87 133c4 4 12 4 16 0z" fill="#ff8fa0"/>'}
  </g>
  <!-- badge -->
  <circle cx="100" cy="158" r="15" fill="#ffc93c" stroke="#e79f10" stroke-width="4"/>
  <path d="m93 158 5 5 9-10" stroke="#7a5200" stroke-width="4.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`}function Ya(){return`
<svg viewBox="0 0 340 440" class="chars mood-0" role="img"
     aria-label="A cartoon mother with long hair holding her baby. The baby's face shows how the round is going.">
  <defs>
    <linearGradient id="dress" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#8a72ff"/><stop offset="1" stop-color="#5b41d8"/>
    </linearGradient>
    <linearGradient id="dressArm" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#9d88ff"/><stop offset="1" stop-color="#6a4fe0"/>
    </linearGradient>
    <linearGradient id="blanket" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#ffe4a1"/><stop offset="1" stop-color="#ffb648"/>
    </linearGradient>
    <linearGradient id="hairG" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#4a352f"/><stop offset="1" stop-color="#2b1e1a"/>
    </linearGradient>
    <clipPath id="babyHeadClip"><circle cx="170" cy="300" r="41"/></clipPath>
    <clipPath id="momHeadClip"><ellipse cx="170" cy="126" rx="48" ry="52"/></clipPath>
  </defs>

  <ellipse cx="170" cy="428" rx="120" ry="13" fill="#06202a" opacity=".22"/>

  <!-- ============ MOTHER ============ -->
  <g class="mother">
    <!-- long hair BEHIND the body: one soft silhouette, no floating strands -->
    <path d="M170 62c-42 0-64 30-64 74 0 26 4 44 4 66 0 34-8 62-14 90 20 8 40 12 60 13
             -10-34-12-70-8-104-6-22-8-42-6-58 4-30 14-46 28-46s24 16 28 46c2 16 0 36-6 58
             4 34 2 70-8 104 20-1 40-5 60-13-6-28-14-56-14-90 0-22 4-40 4-66 0-44-22-74-64-74z"
          fill="url(#hairG)"/>
    <!-- torso: shoulders slightly wider than the head, natural silhouette -->
    <path d="M170 196c-38 0-62 22-72 60-8 30-12 68-12 174h168c0-106-4-144-12-174-10-38-34-60-72-60z"
          fill="url(#dress)"/>
    <path d="M132 214c10 14 22 21 38 21s28-7 38-21" stroke="#4a34b8" stroke-width="6"
          opacity=".35" fill="none" stroke-linecap="round"/>
    <!-- short, natural neck -->
    <path d="M152 166h36v22c0 10-8 16-18 16s-18-6-18-16z" fill="#e8b78d"/>
    <path d="M152 176c10 8 26 8 36 0v-10h-36z" fill="#d8a67c" opacity=".55"/>

    <!-- head -->
    <g class="mother-head">
      <ellipse cx="170" cy="126" rx="48" ry="52" fill="#f7c9a5"/>
      <!-- ears -->
      <ellipse cx="122" cy="130" rx="8" ry="11" fill="#f0b590"/>
      <ellipse cx="218" cy="130" rx="8" ry="11" fill="#f0b590"/>
      <!-- fringe, clipped to the head so it never floats -->
      <g clip-path="url(#momHeadClip)">
        <path d="M118 120c0-40 22-58 52-58s52 18 52 58c-6-20-16-30-26-32-10 12-30 17-48 13-14-3-24 3-30 19z"
              fill="url(#hairG)"/>
      </g>
      <!-- hair volume on both sides of the face -->
      <path d="M124 108c-8 16-9 38-6 58 8-16 10-38 10-52z" fill="#4a352f"/>
      <path d="M216 108c8 16 9 38 6 58-8-16-10-38-10-52z" fill="#4a352f"/>
      <!-- eyes -->
      <ellipse cx="152" cy="130" rx="8.5" ry="9.5" fill="#fff"/>
      <ellipse cx="188" cy="130" rx="8.5" ry="9.5" fill="#fff"/>
      <circle cx="153" cy="132" r="5" fill="#25303f"/>
      <circle cx="189" cy="132" r="5" fill="#25303f"/>
      <circle cx="151" cy="129" r="1.9" fill="#fff"/>
      <circle cx="187" cy="129" r="1.9" fill="#fff"/>
      <rect class="eye-lid" x="142" y="118" width="20" height="13" fill="#f7c9a5"/>
      <rect class="eye-lid" x="178" y="118" width="20" height="13" fill="#f7c9a5"/>
      <!-- lashes -->
      <path d="M143 126c1-3 3-5 6-6M197 126c-1-3-3-5-6-6" stroke="#2b1e1a" stroke-width="2.6"
            stroke-linecap="round" fill="none"/>
      <g class="brow brow-calm">
        <path d="M143 115c5-4 13-4 17-1" stroke="#3b2b28" stroke-width="4.2" stroke-linecap="round" fill="none"/>
        <path d="M180 114c5-3 12-3 17 1" stroke="#3b2b28" stroke-width="4.2" stroke-linecap="round" fill="none"/>
      </g>
      <g class="brow brow-worry">
        <path d="M142 118c6-6 13-8 18-4" stroke="#3b2b28" stroke-width="4.2" stroke-linecap="round" fill="none"/>
        <path d="M198 118c-6-6-13-8-18-4" stroke="#3b2b28" stroke-width="4.2" stroke-linecap="round" fill="none"/>
      </g>
      <ellipse class="blush" cx="138" cy="145" rx="9.5" ry="6" fill="#ff9a86" opacity=".55"/>
      <ellipse class="blush" cx="202" cy="145" rx="9.5" ry="6" fill="#ff9a86" opacity=".55"/>
      <path d="M170 136c3 4 3 7 0 9" stroke="#e0a17a" stroke-width="2.6" fill="none" stroke-linecap="round"/>
      <!-- mouths -->
      <path class="mouth-happy" d="M159 152c6 8 16 8 22 0" stroke="#b3564a" stroke-width="4.4"
            fill="none" stroke-linecap="round"/>
      <path class="mouth-sad" d="M159 158c6-7 16-7 22 0" stroke="#b3564a" stroke-width="4.4"
            fill="none" stroke-linecap="round"/>
      <ellipse class="mouth-cry" cx="170" cy="155" rx="10" ry="8" fill="#a34a3e"/>
      <!-- hair flower keeps the character clearly feminine -->
      <g transform="translate(214 92)">
        <circle r="6.5" fill="#ff8fa0"/>
        <circle cx="-8.5" cy="-4" r="5.5" fill="#ff6f8a"/><circle cx="8.5" cy="-4" r="5.5" fill="#ff6f8a"/>
        <circle cx="-5.5" cy="6.5" r="5.5" fill="#ff6f8a"/><circle cx="5.5" cy="6.5" r="5.5" fill="#ff6f8a"/>
        <circle r="3" fill="#ffd166"/>
      </g>
      <g class="sweat">
        <path d="M232 86c5 8 8 12 8 15a8 8 0 1 1-16 0c0-3 3-7 8-15z" fill="#8fd8ff" stroke="#4aa8e0" stroke-width="2"/>
      </g>
    </g>
  </g>

  <!-- ============ BABY (cradled in front) ============ -->
  <g class="baby-body">
    <!-- swaddle -->
    <path d="M170 258c40 0 68 26 68 62 0 34-30 56-68 56s-68-22-68-56c0-36 28-62 68-62z"
          fill="url(#blanket)" stroke="#e9932a" stroke-width="5"/>
    <path d="M112 348c34 16 82 16 116 0" stroke="#e9932a" stroke-width="5" fill="none" opacity=".55"/>
    <path d="M170 320c-14 8-26 10-40 8 10 12 26 18 40 18s30-6 40-18c-14 2-26 0-40-8z"
          fill="#ffcf7a" opacity=".7"/>

    <!-- head -->
    <g>
      <circle cx="170" cy="300" r="41" fill="#fbd8b8"/>
      <ellipse cx="129" cy="303" rx="7" ry="9" fill="#f2c8a4"/>
      <ellipse cx="211" cy="303" rx="7" ry="9" fill="#f2c8a4"/>
      <g clip-path="url(#babyHeadClip)">
        <path d="M129 284c6-24 24-35 41-35s33 11 37 32c-13-11-25-6-38-6s-26-4-40 9z" fill="#c98b52"/>
      </g>
      <path d="M164 259c4-9 13-11 17-5" stroke="#c98b52" stroke-width="5" fill="none" stroke-linecap="round"/>
      <ellipse cx="155" cy="300" rx="8.4" ry="9.4" fill="#fff"/>
      <ellipse cx="186" cy="300" rx="8.4" ry="9.4" fill="#fff"/>
      <circle cx="156" cy="302" r="5.6" fill="#25303f"/>
      <circle cx="187" cy="302" r="5.6" fill="#25303f"/>
      <circle cx="154" cy="299" r="2.1" fill="#fff"/>
      <circle cx="185" cy="299" r="2.1" fill="#fff"/>
      <rect class="eye-lid" x="145" y="288" width="20" height="12" fill="#fbd8b8"/>
      <rect class="eye-lid" x="176" y="288" width="20" height="12" fill="#fbd8b8"/>
      <g class="brow brow-calm">
        <path d="M147 287c4-3 12-3 16-1" stroke="#c98b52" stroke-width="4" stroke-linecap="round" fill="none"/>
        <path d="M178 286c4-2 12-2 16 1" stroke="#c98b52" stroke-width="4" stroke-linecap="round" fill="none"/>
      </g>
      <g class="brow brow-worry">
        <path d="M146 290c5-6 12-7 17-3" stroke="#c98b52" stroke-width="4" stroke-linecap="round" fill="none"/>
        <path d="M195 290c-5-6-12-7-17-3" stroke="#c98b52" stroke-width="4" stroke-linecap="round" fill="none"/>
      </g>
      <ellipse class="blush" cx="141" cy="314" rx="9" ry="6.4" fill="#ff9a86" opacity=".75"/>
      <ellipse class="blush" cx="200" cy="314" rx="9" ry="6.4" fill="#ff9a86" opacity=".75"/>
      <path class="mouth-happy" d="M158 320c7 9 20 9 27 0z" fill="#b3564a"/>
      <path class="mouth-sad" d="M159 326c6-7 18-7 24 0" stroke="#b3564a" stroke-width="4.6"
            fill="none" stroke-linecap="round"/>
      <g class="mouth-cry">
        <ellipse cx="171" cy="324" rx="14" ry="12" fill="#b3564a"/>
        <ellipse cx="171" cy="330" rx="7" ry="5" fill="#ff8fa0"/>
      </g>
      <g class="tear"><path d="M145 310c4 6 6 9 6 12a6 6 0 1 1-12 0c0-3 2-6 6-12z"
            fill="#8fd8ff" stroke="#4aa8e0" stroke-width="2"/></g>
      <g class="tear" style="animation-delay:.4s"><path d="M197 310c4 6 6 9 6 12a6 6 0 1 1-12 0c0-3 2-6 6-12z"
            fill="#8fd8ff" stroke="#4aa8e0" stroke-width="2"/></g>
    </g>
  </g>

  <!-- mother's forearms cradling the swaddle -->
  <g class="mother-arms">
    <path d="M96 250c-16 44 4 100 62 108" stroke="#6a4fe0" stroke-width="34"
          stroke-linecap="round" fill="none" opacity=".9"/>
    <path d="M244 250c16 44-4 100-62 108" stroke="url(#dressArm)" stroke-width="34"
          stroke-linecap="round" fill="none"/>
    <ellipse cx="160" cy="360" rx="19" ry="15" fill="#f0b590"/>
    <ellipse cx="182" cy="362" rx="19" ry="15" fill="#e8b78d"/>
    <path d="M150 356c8 6 20 7 28 2" stroke="#d89b74" stroke-width="3" fill="none" stroke-linecap="round"/>
  </g>

  <!-- baby hands rest on top of the cradling arms: only the hand waddles -->
  <g class="baby-arm-r">
    <path d="M132 330c-16 2-26 9-30 20" stroke="#fbd8b8" stroke-width="17" stroke-linecap="round" fill="none"/>
    <circle cx="100" cy="352" r="11" fill="#fbd8b8"/>
    <path d="M94 350c3 3 8 3 11 0" stroke="#e8b78d" stroke-width="2.4" fill="none" stroke-linecap="round"/>
  </g>
  <g class="baby-arm-l">
    <path d="M208 330c16 2 26 9 30 20" stroke="#fbd8b8" stroke-width="17" stroke-linecap="round" fill="none"/>
    <circle cx="240" cy="352" r="11" fill="#fbd8b8"/>
    <path d="M235 350c3 3 8 3 11 0" stroke="#e8b78d" stroke-width="2.4" fill="none" stroke-linecap="round"/>
  </g>

  <!-- happy music notes (shown briefly after a correct answer) -->
  <g class="music-note" fill="#ffd166" stroke="#e09b20" stroke-width="2">
    <g transform="translate(272 250)"><circle cx="0" cy="12" r="7"/><rect x="5" y="-16" width="4" height="28"/>
      <path d="M9 -16c8 2 12 6 12 12" fill="none"/></g>
    <g transform="translate(62 262)"><circle cx="0" cy="12" r="6"/><rect x="4" y="-12" width="3.4" height="24"/></g>
  </g>
</svg>`}function Ga(){return`
<svg viewBox="0 0 120 190" class="car-svg" role="img" aria-label="A cartoon car seen from above with a driver inside">
  <defs>
    <linearGradient id="carPaint" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#ff8f79"/><stop offset=".5" stop-color="#ff6f61"/>
      <stop offset="1" stop-color="#d9483c"/>
    </linearGradient>
    <linearGradient id="glass" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#cdeeff"/><stop offset="1" stop-color="#7fc4e8"/>
    </linearGradient>
  </defs>
  <!-- wheels -->
  <g fill="#232a3a">
    <rect x="4" y="36" width="18" height="34" rx="8"/>
    <rect x="98" y="36" width="18" height="34" rx="8"/>
    <rect x="4" y="120" width="18" height="34" rx="8"/>
    <rect x="98" y="120" width="18" height="34" rx="8"/>
  </g>
  <g class="wheel-tread" fill="#4b5468">
    <rect x="6" y="42" width="14" height="4" rx="2"/><rect x="6" y="54" width="14" height="4" rx="2"/>
    <rect x="100" y="42" width="14" height="4" rx="2"/><rect x="100" y="54" width="14" height="4" rx="2"/>
    <rect x="6" y="126" width="14" height="4" rx="2"/><rect x="6" y="138" width="14" height="4" rx="2"/>
    <rect x="100" y="126" width="14" height="4" rx="2"/><rect x="100" y="138" width="14" height="4" rx="2"/>
  </g>
  <!-- flat tyre overlay (shown when the car breaks down) -->
  <g class="wheel-flat" fill="#2b3242">
    <ellipse cx="13" cy="140" rx="14" ry="9"/>
    <ellipse cx="107" cy="140" rx="14" ry="9"/>
  </g>

  <g class="car-body">
    <!-- chassis -->
    <rect x="12" y="12" width="96" height="166" rx="34" fill="url(#carPaint)" stroke="#a8342a" stroke-width="4"/>
    <!-- bonnet + boot shading -->
    <path d="M20 40c10-16 70-16 80 0" fill="none" stroke="#ffb3a5" stroke-width="5" stroke-linecap="round" opacity=".8"/>
    <path d="M20 152c10 14 70 14 80 0" fill="none" stroke="#a8342a" stroke-width="5" stroke-linecap="round" opacity=".5"/>
    <!-- windscreen -->
    <path d="M28 56h64l-7 22H35z" fill="url(#glass)" stroke="#6aa9c9" stroke-width="3"/>
    <!-- cabin roof -->
    <rect x="26" y="80" width="68" height="46" rx="16" fill="#ffd0c6" stroke="#a8342a" stroke-width="3"/>
    <!-- driver seen from above -->
    <g class="driver-top">
      <circle cx="60" cy="100" r="17" fill="#f7c9a5"/>
      <path d="M43 98a17 17 0 0 1 34 0z" fill="#3b2b28"/>
      <circle cx="53" cy="104" r="3.2" fill="#25303f"/>
      <circle cx="67" cy="104" r="3.2" fill="#25303f"/>
      <path d="M55 112c3 3 7 3 10 0" stroke="#8a4a3a" stroke-width="3" fill="none" stroke-linecap="round"/>
      <rect x="34" y="112" width="52" height="14" rx="7" fill="#2fd6c0" opacity=".9"/>
    </g>
    <!-- rear window -->
    <path d="M32 130h56l-6 16H38z" fill="url(#glass)" stroke="#6aa9c9" stroke-width="3"/>
    <!-- headlights -->
    <rect x="22" y="16" width="18" height="10" rx="5" fill="#fff2b8" stroke="#e0b430" stroke-width="2.5"/>
    <rect x="80" y="16" width="18" height="10" rx="5" fill="#fff2b8" stroke="#e0b430" stroke-width="2.5"/>
    <rect x="22" y="166" width="18" height="8" rx="4" fill="#ff4f5e" stroke="#a8342a" stroke-width="2"/>
    <rect x="80" y="166" width="18" height="8" rx="4" fill="#ff4f5e" stroke="#a8342a" stroke-width="2"/>
  </g>

  <!-- breakdown smoke -->
  <g class="smoke" fill="#e6eef6" opacity=".9">
    <circle cx="34" cy="18" r="11"/>
    <circle cx="52" cy="8" r="8" opacity=".8"/>
    <circle cx="70" cy="16" r="6" opacity=".7"/>
  </g>
</svg>`}function Da(){return`
<svg viewBox="0 0 100 120" class="driver-svg" role="img" aria-label="The driver stands beside the car looking worried">
  <ellipse cx="50" cy="112" rx="26" ry="6" fill="#06202a" opacity=".25"/>
  <g class="driver-body">
    <!-- legs -->
    <rect x="38" y="78" width="10" height="30" rx="5" fill="#2a3a5c"/>
    <rect x="52" y="78" width="10" height="30" rx="5" fill="#2a3a5c"/>
    <!-- torso -->
    <rect x="30" y="42" width="40" height="42" rx="16" fill="#2fd6c0" stroke="#0b7a6d" stroke-width="3"/>
    <!-- arms -->
    <g class="driver-arm-l"><path d="M68 52c10-4 16 2 16 12" stroke="#f7c9a5" stroke-width="11" stroke-linecap="round" fill="none"/></g>
    <g class="driver-arm-r"><path d="M32 52c-10-4-16 2-16 12" stroke="#f7c9a5" stroke-width="11" stroke-linecap="round" fill="none"/></g>
    <!-- head -->
    <circle cx="50" cy="30" r="20" fill="#f7c9a5"/>
    <path d="M30 27a20 20 0 0 1 40 0c-6-7-14-9-20-9s-14 2-20 9z" fill="#3b2b28"/>
    <ellipse cx="42" cy="31" rx="4.6" ry="5.4" fill="#fff"/>
    <ellipse cx="58" cy="31" rx="4.6" ry="5.4" fill="#fff"/>
    <circle cx="42" cy="32" r="2.8" fill="#25303f"/>
    <circle cx="58" cy="32" r="2.8" fill="#25303f"/>
    <path d="M35 22c4 1 8 3 10 6" stroke="#3b2b28" stroke-width="3" stroke-linecap="round" fill="none"/>
    <path d="M65 22c-4 1-8 3-10 6" stroke="#3b2b28" stroke-width="3" stroke-linecap="round" fill="none"/>
    <ellipse cx="50" cy="42" rx="7" ry="5.5" fill="#8a4a3a"/>
    <path d="M74 14c5 7 8 11 8 14a8 8 0 1 1-16 0c0-3 3-7 8-14z" fill="#8fd8ff" stroke="#4aa8e0" stroke-width="2"/>
  </g>
</svg>`}function Xt(e){const a=e==="yes";return`
<svg viewBox="0 0 120 120" aria-hidden="true">
  <g filter="none">
    <rect x="6" y="6" width="108" height="76" rx="18"
          fill="${a?"#29b96b":"#ef4b5e"}" stroke="${a?"#158a4c":"#c22a3c"}" stroke-width="6"/>
    <rect x="54" y="76" width="12" height="40" rx="5" fill="#8d6b4b" stroke="#6b4f36" stroke-width="4"/>
    <text x="60" y="56" text-anchor="middle" font-family="ui-rounded, system-ui, sans-serif"
          font-size="34" font-weight="900" fill="#ffffff">${a?"YES":"NO"}</text>
    <path d="${a?"M34 24h-14l-10 10 10 10h14":"M86 24h14l10 10-10 10H86"}"
          fill="none" stroke="#ffffff" stroke-width="0"/>
  </g>
</svg>`}const Ht=()=>window.matchMedia("(pointer: coarse)").matches||"ontouchstart"in window,Jt={hub:{title:"How SAFE SQUAD works",intro:"Three mini-games, five questions each. Every question is about keeping children safe — online, at school and at home.",steps:[{icon:T("play"),title:"Pick a game",text:"Tap any card on the hub. Each game teaches the same topics in a different way."},{icon:T("question"),title:"5 questions per round",text:"Questions are drawn at random from the question bank, so every round is different."},{icon:T("bulb"),title:"Learn from feedback",text:"After each answer you get a short explanation. Miss a few and a helpful tip appears."},{icon:T("shield"),title:"Finish and improve",text:"A completion screen shows your score. Replay to beat it, or return to the hub any time."}],touch:"Tap the big buttons. Nothing needs a long press, and you can play with one thumb.",mouse:"Click the buttons, or use Tab and Enter to play entirely with the keyboard."},babyCry:{title:"How to play: Don't Make the Baby Cry",intro:"You are the mother carrying the baby. Answer each YES/NO question before the timer runs out. You get 3 chances for the whole round — the 3rd mistake ends the game with a tantrum.",steps:[{icon:T("question"),title:"Read the situation",text:"A YES/NO statement appears under the characters, with a countdown bar. Letting the timer run out counts as a mistake."},{icon:T("check"),title:"Answer YES or NO",text:"Correct: the baby giggles and the mother smiles. You move to the next question."},{icon:T("cross"),title:"Wrong answers",text:"1st mistake: the baby cries softly. 2nd: it cries louder. 3rd: a tantrum and the game ends. Chances never reset between questions."},{icon:T("bulb"),title:"Goal",text:"Answer all 5 questions of the category without using up your 3 chances."}],touch:"Tap the green YES or red NO button. They are big enough for one-thumb play.",mouse:"Click YES or NO, or press the Y and N keys on your keyboard."},puzzle:{title:"How to play: Attach the Missing Puzzle",intro:"The board starts empty. Answer a question correctly to earn a puzzle piece, then drag that piece into the right hole yourself. Five correct answers complete the picture.",steps:[{icon:T("question"),title:"Answer to earn a piece",text:"Every question is YES or NO. Only a correct answer releases a piece into your tray."},{icon:T("replay"),title:"Wrong answer? Try again",text:"No piece is given. You get the official explanation plus a tip, and the same question comes back."},{icon:T("drag"),title:"Drag it into place",text:"Pieces never attach by themselves. Move the piece over its matching hole — it snaps when close enough."},{icon:T("cross"),title:"Wrong hole?",text:"The piece bounces back to the tray with a buzz. No penalty — just try another hole."},{icon:T("eye"),title:"Hid the question by accident?",text:'Tap the yellow "See Q&A" button to bring it back — you can never skip a question.'},{icon:T("star"),title:"Complete the picture",text:"Place every piece to reveal the full illustration and finish the round."}],touch:"Press and drag a piece with your finger, then lift your finger over the hole.",mouse:"Click and hold a piece, drag it to the hole and release the mouse button."},factFall:{title:"How to play: Fact or Fall",intro:"You are driving along a cartoon road. At every fork a statement appears — decide whether it is TRUE (YES) or FALSE (NO) and pick your road. You have 3 chances.",steps:[{icon:T("car"),title:"Drive to the fork",text:"The car drives on its own. It stops at each junction and a question panel slides up."},{icon:T("arrowLeft"),title:"LEFT = YES / FACT",text:"Take the left road when you believe the statement is true."},{icon:T("arrowRight"),title:"RIGHT = NO / MYTH",text:"Take the right road when you believe the statement is false."},{icon:T("cross"),title:"Wrong road = breakdown",text:"The car crashes and you lose one of your 3 chances. You get the explanation and retry the fork — but when the chances run out, the run is over."}],touch:"Tap the LEFT (YES) or RIGHT (NO) button under the question panel.",mouse:"Click a button, or use the ← and → arrow keys to steer."},hearts:{title:"How to play: Save Your Hearts",intro:"A cartoon question battle. You and the doubt demon start with 3 hearts each. Every correct answer lands a hit; every wrong answer costs you a heart. The fight lasts as long as it takes — there is no fixed number of questions.",steps:[{icon:T("heart"),title:"3 hearts each",text:"Hearts are shown above both fighters. The battle ends only when the demon is defeated — or when you run out of hearts."},{icon:T("question"),title:"Pick the best action",text:"Each round shows a child-protection situation with three possible responses. Choose the safest one."},{icon:T("check"),title:"Correct = you attack",text:"Your hero throws a shield burst and the demon loses one heart. Three hits win the battle."},{icon:T("cross"),title:"Wrong = you take a hit",text:"The demon counter-attacks and you lose a heart. Read the explanation, then keep fighting."}],touch:"Tap the answer you think is safest. All buttons are finger-sized.",mouse:"Click an answer, or use Tab and Enter to play from the keyboard."},maze:{title:"How to play: Choose & Escape",intro:"There is no question pop-up. The maze starts straight away: read the statement on the card above the maze, then drive into the YES portal or the NO portal — the portal you enter IS your answer.",steps:[{icon:T("question"),title:"Read the card, then run",text:"The statement sits on a card above the maze the whole time, so you can re-read it while you move."},{icon:T("flag"),title:"The portals are your answer",text:"Drive into the green YES portal or the red NO portal. Both are equally reachable — the maze never hints at the answer."},{icon:T("people"),title:"Three enemies hunt you",text:"They patrol the corridors like arcade ghosts. If one catches you, you restart the same question from the entrance."},{icon:T("arrowRight"),title:"Use the side portals",text:"The glowing tunnel in the middle row wraps around: run off the left edge and you reappear on the right."},{icon:T("star"),title:"Five escapes to win",text:"Reach the correct gate five times to finish the round."}],touch:"Tap the D-pad (or swipe the maze) to set a direction — you keep running until the corridor turns.",mouse:"Arrow keys or WASD. Movement is four-way only, exactly like a classic maze arcade game."},princess:{title:"How to play: Save the Princess",intro:"A cartoon platform adventure. Run and jump across the kingdom, hit the five question blocks, and open the gate to rescue the princess.",steps:[{icon:T("play"),title:"Run and jump",text:"Cross the platforms, skip the gaps and avoid the wandering critters."},{icon:T("question"),title:"Hit the ? blocks",text:"Jump into a question block to pause the action and open a child-protection question."},{icon:T("check"),title:"Correct opens the way",text:"A correct answer turns the block into a star. Five stars open the gate to the princess."},{icon:T("cross"),title:"Wrong costs a life",text:"A wrong answer, a fall or a critter costs one of your 3 lives and sends you back to the last checkpoint flag."}],touch:"Hold the ◀ ▶ buttons to run and tap the JUMP button to jump.",mouse:"Arrow keys or A/D to run, Space or W to jump."},bingo:{title:"How to play: Bingo Game",intro:"Twenty-five closed boxes. Some hide a star, most are empty. Collect stars on the highlighted pattern to win.",steps:[{icon:T("flag"),title:"Watch the pattern",text:"One Bingo pattern is chosen at random each round and outlined on the board. Only those squares win the game."},{icon:T("tap"),title:"Open a box",text:"Tap any closed box. It either cracks open on an empty square, or reveals a star."},{icon:T("star"),title:"Stars ask a question",text:"A star is only collected once you answer its YES/NO question correctly. A wrong answer keeps the question active — try again."},{icon:T("check"),title:"Complete the pattern",text:"Collect a star on every highlighted square to win. Only the highlighted pattern counts as a Bingo."}],touch:"Tap a box to open it. The board scales to your screen so every box stays finger-sized.",mouse:"Click a box to open it. Hover shows which box you are about to pick."}};function gt(e,a){var n;const s=(n=Jt[e])!=null?n:Jt.hub,t=[s.intro];s.steps.forEach(r=>t.push(Qt(r.icon,r.title,r.text))),t.push(Qt(Ht()?T("tap"):T("mouse"),Ht()?"Touch controls":"Mouse & keyboard",Ht()?s.touch:s.mouse));const i=document.createElement("p");i.className="howto-note",i.textContent="Remember: if a real situation ever feels unsafe, talk to a trusted adult straight away.",t.push(i),e==="hub"&&va(),_t({title:s.title,body:t,actions:[{label:"Got it — let's play",variant:"mint"}],onClose:a})}const fa=5,Fa={id:"c1",name:"Physical Abuse — Corporal Punishment",shortName:"Corporal punishment",completionMessage:"If you have experienced or witnessed someone being physically hurt or punished, do not stay silent. Speak up and seek help from a trusted teacher, school personnel, parent, or adult.",questions:[{id:"c1-q1",categoryId:"c1",topic:"Corporal punishment",question:"Physical force used against a student, even without causing serious injury, can be considered violence.",correct:"YES",explanation:"Physical force can be considered violence even without serious injury because violence is not limited to acts that leave visible or severe injuries. The intentional use of physical force that causes or may cause harm can already be considered violent."},{id:"c1-q2",categoryId:"c1",topic:"Corporal punishment",question:"Pushing, kicking, or punching a classmate is only considered physical violence when it causes visible injury.",correct:"NO",explanation:"Visible injury is not required for physical violence to occur. Pushing, kicking, or punching involves physical force and can be violent even when the person does not have visible marks or injuries."},{id:"c1-q3",categoryId:"c1",topic:"Corporal punishment",question:"Using physical force to threaten or intimidate another student may constitute abuse.",correct:"YES",explanation:"Using physical force to threaten or intimidate can make a student feel afraid or unsafe. Because it involves the use or threat of force, it may be considered violent or abusive behavior."},{id:"c1-q4",categoryId:"c1",topic:"Corporal punishment",question:"A physical attack between students is not considered violence when it happens outside the classroom.",correct:"NO",explanation:"The location does not determine whether an act is violence. A physical attack can still be considered violent whether it happens inside the classroom, outside the classroom, or elsewhere in the school."},{id:"c1-q5",categoryId:"c1",topic:"Corporal punishment",question:"Causing physical harm to a student through intentional force may be considered an act of violence in school.",correct:"YES",explanation:"Intentionally using physical force that causes physical harm is an act of physical violence. When directed toward a student, it may also constitute physical abuse depending on the circumstances."}]},Wa={id:"c2",name:"Physical Abuse — Bullying or Peer Abuse",shortName:"Physical bullying",completionMessage:"If you see someone being physically bullied or harmed by a peer, don't ignore it. Report the incident to a teacher, school personnel, or another trusted adult, and offer support to the person affected. Speaking up can help stop the harm and keep others safe.",questions:[{id:"c2-q1",categoryId:"c2",topic:"Physical bullying",question:"Punching a classmate is not considered a form of physical bullying.",correct:"NO",explanation:"Punching a classmate is intentional physical aggression. When used to hurt, intimidate, or repeatedly target another student, it can be considered physical bullying."},{id:"c2-q2",categoryId:"c2",topic:"Physical bullying",question:"Pushing someone with the intention to hurt them is a form of physical abuse.",correct:"YES",explanation:"Pushing someone with the intention of hurting them is deliberate physical aggression. It can therefore be considered physical bullying and, depending on the circumstances, may constitute physical abuse."},{id:"c2-q3",categoryId:"c2",topic:"Physical bullying",question:"Kicking or hitting a peer is only considered bullying when it causes visible injury.",correct:"NO",explanation:"Physical bullying does not require visible injuries. Hitting or kicking can still cause pain, fear, or harm even when there are no bruises, wounds, or other visible marks."},{id:"c2-q4",categoryId:"c2",topic:"Physical bullying",question:"Physically threatening someone can create fear and emotional harm.",correct:"YES",explanation:"A physical threat can make a student feel afraid or unsafe. This fear and insecurity can negatively affect the student's emotional well-being even if the threatened physical act does not actually occur."},{id:"c2-q5",categoryId:"c2",topic:"Physical bullying",question:"Repeated physical attacks among peers are not considered a form of peer abuse.",correct:"NO",explanation:"Repeated physical attacks are harmful physical behaviors directed toward another student. When they involve bullying behavior, they can constitute physical bullying or peer abuse."}]},ja={id:"c3",name:"Psychological Abuse — Child Abuse",shortName:"Child abuse",completionMessage:"If hurtful words, threats, humiliation, rumors, or exclusion are causing emotional distress, remember that you do not have to face it alone. Talk to a trusted teacher, school personnel, parent, or another trusted adult, and support others who may be experiencing the same.",questions:[{id:"c3-q1",categoryId:"c3",topic:"Child abuse",question:"Repeatedly insulting or humiliating a child is not considered a form of psychological abuse.",correct:"NO",explanation:"Repeated insults and humiliation can make a child feel ashamed, unwanted, or worthless. Over time, this can damage the child's self-esteem and emotional well-being."},{id:"c3-q2",categoryId:"c3",topic:"Child abuse",question:"Threatening a child to create fear may be considered emotional or psychological abuse.",correct:"YES",explanation:"Threatening a child to deliberately create fear can cause emotional distress and make the child feel unsafe. Repeated or serious threats may constitute psychological or emotional abuse."},{id:"c3-q3",categoryId:"c3",topic:"Child abuse",question:"Constantly criticizing or degrading a child does not affect their emotional well-being.",correct:"NO",explanation:"Constant criticism or degrading treatment can make a child lose confidence and develop a negative view of themselves. It can therefore negatively affect their emotional and psychological well-being."},{id:"c3-q4",categoryId:"c3",topic:"Child abuse",question:"Ignoring a child's emotional needs may be considered a form of psychological abuse.",correct:"YES",explanation:"A child's emotional needs are important to their development. Consistently ignoring those needs can cause emotional harm and, depending on the circumstances, may constitute emotional neglect."},{id:"c3-q5",categoryId:"c3",topic:"Child abuse",question:"Making a child feel worthless or unwanted can cause psychological harm.",correct:"YES",explanation:"Making a child feel worthless or unwanted can seriously affect their self-esteem and sense of self-worth. Such treatment can cause psychological and emotional harm."}]},Va={id:"c4",name:"Psychological Abuse — Discrimination Against Children",shortName:"Discrimination",completionMessage:"If you are ignored, mocked, excluded, or made to feel less important because of who you are or where you come from, this hurts deeply. You are just as valuable as anyone else. Share this with a teacher or parent, they will stand with you and make sure you are treated fairly.",questions:[{id:"c4-q1",categoryId:"c4",topic:"Discrimination",question:"Excluding a child from activities because of their disability, background, or status is not considered discrimination.",correct:"NO",explanation:"Excluding a child specifically because of their disability, background, or status can be unfair treatment based on a personal characteristic. When the exclusion is discriminatory, it can violate the child's right to equal treatment."},{id:"c4-q2",categoryId:"c4",topic:"Discrimination",question:"Insulting someone because of their differences can cause psychological harm.",correct:"YES",explanation:"Insulting someone because of their differences can cause embarrassment, humiliation, and emotional distress. Repeated or severe treatment can negatively affect the person's psychological well-being."},{id:"c4-q3",categoryId:"c4",topic:"Discrimination",question:"Treating a child unfairly because of their identity does not violate their rights.",correct:"NO",explanation:"Children have the right to be treated fairly and respectfully. Treating a child unfairly because of their identity can result in unequal treatment and may violate their rights."},{id:"c4-q4",categoryId:"c4",topic:"Discrimination",question:"Denying equal opportunities to a child is not considered a form of discrimination.",correct:"NO",explanation:"Equal opportunities should not be denied unfairly because of a child's characteristics. When opportunities are withheld for discriminatory reasons, this can constitute discrimination."},{id:"c4-q5",categoryId:"c4",topic:"Discrimination",question:"Making a child feel inferior because of their differences can affect their emotional well-being.",correct:"YES",explanation:"Making a child feel inferior because of their differences can damage their confidence and self-esteem. It can also cause emotional distress and negatively affect their well-being."}]},Qa={id:"c5",name:"Psychological Abuse — Child Exploitation",shortName:"Child exploitation",completionMessage:"If you are pressured, forced, or manipulated into doing things that make you feel scared, ashamed, or unworthy, or made to feel you only matter when you serve others, this harms you deeply. You are not here to be used. Tell a teacher, guidance counselor, or your parents.",questions:[{id:"c5-q1",categoryId:"c5",topic:"Exploitation",question:"Threatening or manipulating a child to gain something from them is not considered exploitation.",correct:"NO",explanation:"Threatening or manipulating a child to obtain something takes advantage of the child's vulnerability. This type of behavior may constitute exploitation, particularly when the child is pressured for another person's benefit."},{id:"c5-q2",categoryId:"c5",topic:"Exploitation",question:"Using fear or pressure to control a child may cause psychological harm.",correct:"YES",explanation:"Fear and pressure can be used to control a child against their wishes. This can cause emotional distress, fear, and psychological harm."},{id:"c5-q3",categoryId:"c5",topic:"Exploitation",question:"Deceiving a child for personal benefit is not considered a form of exploitation.",correct:"NO",explanation:"Deceiving a child for personal benefit involves gaining an advantage by taking advantage of the child's trust or vulnerability. This may constitute exploitation depending on the situation."},{id:"c5-q4",categoryId:"c5",topic:"Exploitation",question:"Forcing children into harmful situations does not affect their emotional well-being.",correct:"NO",explanation:"Forcing children into harmful situations can expose them to fear, distress, and psychological harm. Children have the right to protection from harmful and exploitative situations."},{id:"c5-q5",categoryId:"c5",topic:"Exploitation",question:"Taking advantage of a child's vulnerability is a violation of child protection rights.",correct:"YES",explanation:"Exploitation involves taking unfair advantage of another person's vulnerability for someone's benefit. Children are entitled to protection from exploitation and other forms of abuse."}]},Ua={id:"c6",name:"Psychological Abuse — Violence Against Children",shortName:"Psychological violence",completionMessage:"If you get called names, threatened, humiliated, gossiped about, or left out at school, this hurts your heart and mind deeply. It is wrong and not your fault. Tell a trusted teacher, guidance counselor, or parent. You deserve to feel safe and valued.",questions:[{id:"c6-q1",categoryId:"c6",topic:"Psychological violence",question:"Repeatedly insulting or humiliating a student is not considered a form of psychological violence.",correct:"NO",explanation:"Repeated insults and humiliation can cause emotional pain and damage a child's self-esteem. Because of this, they can be forms of psychological or emotional violence."},{id:"c6-q2",categoryId:"c6",topic:"Psychological violence",question:"Threatening a student to create fear may be considered emotional abuse.",correct:"YES",explanation:"Threatening a student to create fear can cause emotional distress and make the student feel unsafe. Depending on the circumstances, this may constitute psychological or emotional abuse."},{id:"c6-q3",categoryId:"c6",topic:"Psychological violence",question:"Harassment and intimidation do not cause harm to a student's mental well-being.",correct:"NO",explanation:"Harassment and intimidation can cause a student to experience fear, stress, or emotional distress. Therefore, they can negatively affect the student's mental and emotional well-being."},{id:"c6-q4",categoryId:"c6",topic:"Psychological violence",question:"Spreading harmful rumors to damage a student emotionally is not considered a form of abuse.",correct:"NO",explanation:"Spreading harmful rumors with the purpose of embarrassing or hurting a student can damage their reputation and emotional well-being. It can therefore be a form of psychological or relational bullying."},{id:"c6-q5",categoryId:"c6",topic:"Psychological violence",question:"Intentionally isolating or excluding a student can cause psychological harm.",correct:"YES",explanation:"Intentionally isolating or excluding a student can make them feel rejected, lonely, or unwanted. This can cause emotional distress and negatively affect their psychological well-being."}]},Ka={id:"c7",name:"Psychological Abuse — Bullying or Peer Abuse",shortName:"Peer bullying",completionMessage:"If you receive constant yelling, put-downs, threats, rejection, or being made to feel worthless or afraid, this is emotional harm. You do not deserve this and it is never your fault. Speak up to someone you trust, your parents, or guidance counselor.",questions:[{id:"c7-q1",categoryId:"c7",topic:"Peer bullying",question:"Repeatedly calling someone hurtful names is not considered a form of bullying.",correct:"NO",explanation:"Repeatedly calling someone hurtful names can humiliate them and damage their self-esteem. When done as bullying behavior, it can be a form of verbal or psychological bullying."},{id:"c7-q2",categoryId:"c7",topic:"Peer bullying",question:"Spreading rumors to embarrass someone may be considered a form of psychological bullying.",correct:"YES",explanation:"Spreading rumors to embarrass or harm someone can damage their relationships, reputation, and emotional well-being. This can be a form of relational or psychological bullying."},{id:"c7-q3",categoryId:"c7",topic:"Peer bullying",question:"Threatening or intimidating classmates does not cause emotional harm.",correct:"NO",explanation:"Threatening or intimidating classmates can create fear and make them feel unsafe. This can cause emotional distress even when no physical harm occurs."},{id:"c7-q4",categoryId:"c7",topic:"Peer bullying",question:"Intentionally excluding someone from a group is not considered bullying.",correct:"NO",explanation:"Intentionally excluding someone to hurt or isolate them can cause feelings of rejection and loneliness. When done as harmful peer behavior, it can be a form of relational bullying."},{id:"c7-q5",categoryId:"c7",topic:"Peer bullying",question:"Humiliating a peer in person or online can cause psychological harm.",correct:"YES",explanation:"Humiliating a peer in person or online can cause embarrassment, emotional distress, and psychological harm. When it meets the circumstances of bullying, it can be considered bullying."}]},Et=[Fa,Wa,ja,Va,Qa,Ua,Ka];Et.flatMap(e=>e.questions);function Xa(){return Et[Math.floor(Math.random()*Et.length)]}function Ja(e){return Et.find(a=>a.id===e)}const Ot={babyCry:["Read the statement twice: does it describe something that protects a child, or something that harms them?",'Statements containing "only", "never" or "not considered" are often false.',"Harm can be real even when nobody can see a bruise.","Need a little help? Tap How to Play for a reminder of the rules."],puzzle:["Ask yourself whether the action would make a child feel safe, respected and protected.",'Watch out for statements that excuse harm because "there was no injury".',"Emotional harm counts as harm, even without physical contact.","Need a little help? Tap How to Play to review how pieces are earned."],factFall:["Slow down at the fork: is the statement always true, or only sometimes?",'Statements with words like "only", "never" or "always" are often myths.',"Remember: harm is still harm even when there is no visible mark.","Need a little help? Tap How to Play before choosing your road."],hearts:["Think about who is being protected by the statement — the child, or the person causing harm?","Threats and intimidation can be abusive even when nobody is touched.","If a statement excuses harmful behaviour, it is usually false.","Need a little help? Tap How to Play to review the battle rules."],maze:["Read the statement carefully before you answer — the maze never hints at the answer.",'Statements with "only", "never" or "not considered" are often false.',"Keep an eye on the enemies: take a longer route rather than a risky one.","Need a little help? Tap How to Play for the controls."],princess:["Question blocks pause the game — take your time before answering.","Ask yourself whether the situation protects the child or silences them.","Use checkpoints: they save your progress through the level.","Need a little help? Tap How to Play for the jump controls."],bingo:["The highlighted squares are the pattern you must complete.","A star only counts once you answer its question correctly.","Empty boxes are part of the board — they cost you nothing but a tap.","Need a little help? Tap How to Play to review the Bingo rules."]},Ft=["Not quite — but noticing the warning sign is the skill.","Almost! Read the statement again, then keep going.","That one is tricky. Learn it now, use it in real life."];function Wt(e){const a=e.slice();for(let s=a.length-1;s>0;s--){const t=Math.floor(Math.random()*(s+1));[a[s],a[t]]=[a[t],a[s]]}return a}function Lt(e,a){return e.length?e[Math.floor(Math.random()*e.length)]:a}function Za(e){return Wt(e.answers)}class lt{constructor(a){this.index=0,this.correct=0,this.wrong=0,this.wrongStreak=0,this.answeredCurrent=!1;const s=a&&Ja(a)||Xa();if(this.category=s,this.questions=Wt(s.questions).slice(0,fa),!this.questions.length)throw new Error("No questions available — check src/data/questions.ts")}get total(){return this.questions.length}get current(){return this.questions[Math.min(this.index,this.questions.length-1)]}get humanIndex(){return Math.min(this.index+1,this.total)}get isFinished(){return this.index>=this.total}get progressRatio(){return this.total?this.index/this.total:0}get completionMessage(){return this.category.completionMessage}score(a){this.answeredCurrent||(this.answeredCurrent=!0,a?(this.correct++,this.wrongStreak=0):(this.wrong++,this.wrongStreak++))}next(){return this.index++,this.answeredCurrent=!1,!this.isFinished}allowRetry(){this.answeredCurrent=!1}result(){const a=this.total;return{correct:this.correct,wrong:this.wrong,total:a,percent:a?Math.round(this.correct/a*100):0}}}function $t(e,a){return e.correct===a}function es(e,a){return e.correctAnswer===a}function da(){const e=o("button",{class:`icon-btn ${xe.music?"icon-btn--on":""}`,type:"button","aria-pressed":String(xe.music),"aria-label":"Toggle background music",title:"Music",html:xe.music?T("musicOn"):T("musicOff")}),a=o("button",{class:`icon-btn ${xe.sfx?"icon-btn--on":""}`,type:"button","aria-pressed":String(xe.sfx),"aria-label":"Toggle sound effects",title:"Sound effects",html:xe.sfx?T("soundOn"):T("soundOff")});return e.addEventListener("click",()=>{vt({music:!xe.music}),p.setMusicEnabled(xe.music),e.innerHTML=xe.music?T("musicOn"):T("musicOff"),e.classList.toggle("icon-btn--on",xe.music),e.setAttribute("aria-pressed",String(xe.music)),p.sfx("click")}),a.addEventListener("click",()=>{vt({sfx:!xe.sfx}),p.setSfxEnabled(xe.sfx),a.innerHTML=xe.sfx?T("soundOn"):T("soundOff"),a.classList.toggle("icon-btn--on",xe.sfx),a.setAttribute("aria-pressed",String(xe.sfx)),p.sfx("click")}),[e,a]}function Zt(){const e=(s,t,i,n)=>{const r=o("button",{class:"switch",type:"button",role:"switch","aria-checked":String(i),"aria-label":s});return r.addEventListener("click",()=>{const h=r.getAttribute("aria-checked")!=="true";r.setAttribute("aria-checked",String(h)),n(h),p.sfx("click")}),o("div",{class:"setting-row"},o("div",{class:"setting-row__text"},o("strong",{text:s}),o("span",{text:t})),r)},a=o("input",{type:"range",min:"0",max:"100",value:String(Math.round(xe.volume*100)),"aria-label":"Master volume"});a.addEventListener("input",()=>{const s=Number(a.value)/100;vt({volume:s}),p.setVolume(s)}),_t({title:"Settings",body:[e("Background music","Original chiptune loops",xe.music,s=>{vt({music:s}),p.setMusicEnabled(s)}),e("Sound effects","Buttons, characters and feedback",xe.sfx,s=>{vt({sfx:s}),p.setSfxEnabled(s)}),o("div",{class:"setting-row"},o("div",{class:"setting-row__text"},o("strong",{text:"Volume"}),o("span",{text:"Master level for music and effects"})),a),o("div",{class:"setting-row"},o("div",{class:"setting-row__text"},o("strong",{text:"Reset progress"}),o("span",{text:"Clears best scores saved on this device"})),(()=>{const s=o("button",{class:"btn btn--ghost",type:"button",text:"Reset"});return s.addEventListener("click",()=>{Ma(),p.sfx("back"),s.textContent="Cleared",s.setAttribute("disabled","true")}),s})())],actions:[{label:"Done",variant:"mint"}]})}class ct{constructor(a){const s=o("button",{class:"btn hud__back",type:"button","aria-label":"Return to the game hub",html:`${T("arrowLeft")}<span>Return to Hub</span>`});s.addEventListener("click",()=>{if(p.sfx("back"),a.confirmExit===!1){a.onBack();return}is(a.onBack)}),this.fill=o("div",{class:"progress__fill"}),this.label=o("div",{class:"progress__label",text:`Question 1 / ${a.total}`});const t=o("div",{class:"progress",role:"progressbar","aria-valuemin":"1","aria-valuemax":String(a.total),"aria-valuenow":"1"},this.label,o("div",{class:"progress__track"},this.fill)),i=o("button",{class:"icon-btn",type:"button","aria-label":"How to play",title:"How to play",html:T("question")});i.addEventListener("click",()=>{p.sfx("click"),gt(a.howTo)}),this.root=o("div",{class:"hud"},s,o("div",{class:"hud__spacer"}),t,o("div",{class:"hud__spacer"}),i,...da())}setProgress(a,s){var t;this.label.textContent=`Question ${a} / ${s}`,this.fill.style.width=`${a/s*100}%`,(t=this.root.querySelector(".progress"))==null||t.setAttribute("aria-valuenow",String(a))}setLabel(a,s){this.label.textContent=a,this.fill.style.width=`${Math.max(0,Math.min(1,s))*100}%`;const t=this.root.querySelector(".progress");t==null||t.setAttribute("aria-valuenow",String(Math.round(s*100))),t==null||t.setAttribute("aria-valuemin","0"),t==null||t.setAttribute("aria-valuemax","100"),t==null||t.setAttribute("aria-label",a)}}class ht{constructor(){this.root=o("div",{class:"toast",role:"status","aria-live":"polite"}),this.timer=0}show(a,s="plain",t=2200){this.root.textContent=a,this.root.className=`toast is-show${s==="plain"?"":` toast--${s}`}`,window.clearTimeout(this.timer),this.timer=window.setTimeout(()=>this.root.classList.remove("is-show"),t)}hide(){this.root.classList.remove("is-show")}}class ft{constructor(a,s="bottom"){this.gameId=a,this.timer=0,this.shownCount=0;const t=o("div",{class:"tip__icon","aria-hidden":"true"});t.innerHTML=`<svg viewBox="0 0 48 48"><circle cx="24" cy="24" r="22" fill="#ffe08a"/>
      <path d="M24 10a10 10 0 0 0-6 18c.9.7 1.4 1.7 1.4 2.8V32h9.2v-1.2c0-1.1.5-2.1 1.4-2.8A10 10 0 0 0 24 10z" fill="#fff6d6" stroke="#e0a92a" stroke-width="2.4"/>
      <path d="M20 35h8M21.5 38.5h5" stroke="#e0a92a" stroke-width="3" stroke-linecap="round"/></svg>`,this.textEl=o("p",{class:"tip__text"});const i=o("button",{class:"tip__close",type:"button","aria-label":"Dismiss tip",text:"✕"});i.addEventListener("click",()=>this.hide()),this.root=o("div",{class:`tip${s==="top"?" tip--top":""}`,role:"status","aria-live":"polite"},t,this.textEl,i)}nudge(){var s;const a=(s=Ot[this.gameId])!=null?s:[];a.length&&this.show(a[this.shownCount++%a.length])}maybeShow(a){var i;if(a<2)return;const s=(i=Ot[this.gameId])!=null?i:[];if(!s.length)return;const t=s[this.shownCount%s.length];this.shownCount++,this.show(t)}show(a,s=6500){this.textEl.textContent=a,this.root.classList.add("is-show"),window.clearTimeout(this.timer),this.timer=window.setTimeout(()=>this.hide(),s)}hide(){this.root.classList.remove("is-show")}}class dt{constructor(){this.root=o("div",{class:"feedback",role:"status","aria-live":"polite"}),this.titleEl=o("div",{class:"feedback__title"}),this.textEl=o("p",{class:"feedback__text"}),this.actionsEl=o("div",{class:"feedback__actions"}),this.root.append(this.titleEl,this.textEl,this.actionsEl)}show(a,s,t,i){this.root.classList.toggle("feedback--bad",!a),this.titleEl.innerHTML=`${T(a?"check":"cross")}<span>${s}</span>`,this.textEl.textContent=t,ga(this.actionsEl),i.forEach(n=>{var h;const r=o("button",{class:`btn ${(h=n.variant)!=null?h:a?"":"btn--coral"}`,type:"button",text:n.label});r.addEventListener("click",()=>{p.sfx("click"),n.onClick()}),this.actionsEl.appendChild(r)}),this.root.classList.add("is-show"),window.setTimeout(()=>{var n;return(n=this.actionsEl.querySelector("button"))==null?void 0:n.focus()},220)}hide(){this.root.classList.remove("is-show")}}function at(e){var Y,G;const{correct:a,total:s}=e;ka(e.gameId,a),p.sfx(a>=Math.ceil(s*.6)?"fanfare":"sad");const t=s?a/s:0,i=t>=.9?3:t>=.6?2:t>=.3?1:0,n=(Y=e.message)!=null?Y:"Remember: if something feels unsafe, tell a trusted teacher, guidance counsellor or parent.",r=o("div",{class:"complete__badge","aria-hidden":"true"});r.innerHTML=La(i);const h=o("div",{class:"complete__stars","aria-hidden":"true"});for(let l=1;l<=3;l++){const ie=o("div",{style:{color:l<=i?"#ffc93c":"#dfe6f0"}});ie.innerHTML=T("star"),h.appendChild(ie)}const f=o("button",{class:"btn btn--sun",type:"button",text:"Play again"});f.addEventListener("click",()=>{p.sfx("click"),Be(),k.remove(),e.onReplay()});const c=o("button",{class:"btn btn--ghost",type:"button",text:"← Return to Hub"});c.addEventListener("click",()=>{p.sfx("back"),Be(),k.remove(),e.onHub()});const m=o("div",{class:"complete__card",role:"dialog","aria-modal":"true","aria-label":"Round complete"},r,o("h2",{text:(G=e.title)!=null?G:a===s?"Perfect round!":"Round complete!"}),h,o("div",{class:"complete__score"},o("b",{text:String(a)}),o("span",{text:`/ ${s} correct`})),e.categoryName?o("span",{class:"complete__cat",text:e.categoryName}):o("span",{class:"sr-only",text:"Round summary"}),e.extraLine?o("p",{class:"complete__extra",text:e.extraLine}):o("span"),o("p",{class:"complete__msg",text:n}),o("div",{class:"complete__actions"},f,c)),k=o("div",{class:"complete"},ts(i>0),m);return window.setTimeout(()=>f.focus(),300),k}function ts(e){const a=o("div",{class:"confetti","aria-hidden":"true"});if(!e)return a;const s=["#ffc93c","#2fd6c0","#ff6f61","#7b61ff","#63c6ff","#7ed99b"];for(let t=0;t<34;t++){const i=document.createElement("i");i.style.left=`${Math.random()*100}%`,i.style.background=s[t%s.length],i.style.animationDuration=`${2.4+Math.random()*2.4}s`,i.style.animationDelay=`${Math.random()*1.6}s`,i.style.transform=`rotate(${Math.random()*180}deg)`,a.appendChild(i)}return a}function as(e=120){const a=o("div",{style:{width:`${e}px`,margin:"0 auto"},"aria-hidden":"true"});return a.innerHTML=Mt("happy"),a}function ut(e,a,s,t){let i=!1;const n=()=>{i||(i=!0,t())};_t({title:e,body:[as(120),a],actions:[{label:"How to Play",variant:"ghost",closeAfter:!1,onClick:()=>gt(s)},{label:"Start round",variant:"mint",onClick:n}],onClose:n})}function ss(e){var s,t;const a=o("div",{class:"alert__art","aria-hidden":"true"});a.innerHTML=(s=e.art)!=null?s:Mt("think"),_t({title:e.title,className:"modal--alert",body:[a,o("p",{class:"alert__text",text:e.text})],actions:[{label:(t=e.cancelLabel)!=null?t:"Cancel",variant:"ghost",onClick:()=>{var i;return(i=e.onCancel)==null?void 0:i.call(e)}},{label:e.confirmLabel,variant:"coral",onClick:()=>e.onConfirm()}]})}function is(e){ss({title:"Return to Hub?",text:"Your progress in this round will be lost. Are you sure you want to leave the game?",confirmLabel:"Yes, return to Hub",cancelLabel:"Cancel, keep playing",onConfirm:e})}class pt{constructor(a,s,t=3){this.gameId=a,this.howTo=s,this.threshold=t,this.disposed=!1,this.closeCurrent=null,this.nextTrigger=t}dispose(){var a;this.disposed=!0,(a=this.closeCurrent)==null||a.call(this),this.closeCurrent=null}register(a,s){var r,h;if(this.disposed||a<this.nextTrigger)return!1;this.nextTrigger=a+this.threshold;const t=((r=Ot[this.gameId])!=null?r:[]).filter(f=>!/how to play/i.test(f)),i=Lt(t,"Take a moment and think about what keeps a child safe."),n=o("div",{class:"alert__art","aria-hidden":"true"});return n.innerHTML=Mt("think"),p.sfx("appear"),(h=this.closeCurrent)==null||h.call(this),this.closeCurrent=_t({title:"Need a little help?",className:"modal--alert",body:[n,o("p",{class:"alert__text",text:`You have missed ${a} questions in this round. That is completely normal — this is how you learn to spot the warning signs.`}),o("div",{class:"alert__tip"},o("strong",{text:"Tip · "}),o("span",{text:i}))],actions:[{label:"Open How to Play",variant:"ghost",closeAfter:!1,onClick:()=>gt(this.howTo)},{label:"Got it — keep going",variant:"mint"}],onClose:()=>{this.closeCurrent=null,s==null||s()}}),!0}}class jt{constructor(){this.root=o("div",{class:"qoverlay",hidden:"true"}),this.current=null,this.lastOpts={},this.lastHandler=null}get isOpen(){return!this.root.hidden}ask(a,s,t={}){var f;this.current=a,this.lastOpts=t,this.lastHandler=s;const i=o("div",{class:`qpanel qoverlay__panel ${(f=t.className)!=null?f:""}`});if(t.closable){const c=o("button",{class:"icon-btn qoverlay__close",type:"button","aria-label":"Hide the question",title:"Hide question",html:T("close")});c.addEventListener("click",()=>{var m;p.sfx("back"),this.hide(),(m=t.onClose)==null||m.call(t)}),i.appendChild(c)}t.caption&&i.appendChild(o("span",{class:"qoverlay__caption",text:t.caption})),i.appendChild(o("span",{class:"qpanel__topic",text:a.topic})),i.appendChild(o("p",{class:"qpanel__text",role:"heading","aria-level":"2",text:a.question}));const n=o("div",{class:"opt-list"}),r=[],h=(c,m,k)=>{var Y;if(r.forEach(G=>G.disabled=!0),k.classList.add(c?"is-correct":"is-wrong"),!c){const G="answers"in a?a.correctAnswer:a.correct;(Y=r.find(l=>l.dataset.answer===G))==null||Y.classList.add("is-correct")}p.sfx(c?"correct":"wrong"),s(c,m)};if("answers"in a){const c=a;Za(c).forEach(m=>{const k=o("button",{class:"btn opt-btn",type:"button"});k.dataset.answer=m,k.append(o("span",{class:"opt-text",text:m})),k.addEventListener("click",()=>h(es(c,m),m,k)),r.push(k),n.appendChild(k)})}else{const c=a;["YES","NO"].forEach(m=>{const k=o("button",{class:`btn answer-btn${m==="NO"?" answer-btn--no":""}`,type:"button",html:`${T(m==="YES"?"check":"cross")}<span>${m}</span>`,"aria-label":`Answer ${m.toLowerCase()}`});k.dataset.answer=m,k.addEventListener("click",()=>h($t(c,m),m,k)),r.push(k),n.appendChild(k)}),n.classList.add("opt-list--yesno")}i.appendChild(n),this.root.replaceChildren(o("div",{class:"qoverlay__card"},i)),this.root.hidden=!1,window.setTimeout(()=>{var c;return(c=r[0])==null?void 0:c.focus()},180)}reopen(){this.current&&this.lastHandler&&this.ask(this.current,this.lastHandler,this.lastOpts)}hide(){this.root.hidden=!0,this.root.replaceChildren()}}const os=[{id:"babyCry",n:1,tag:"Emotion · Yes / No",title:"Don't Make the Baby Cry",desc:"Beat the timer with YES or NO answers. Three mistakes and the baby has a tantrum — keep the little one calm to the end of the round.",art:Aa(),pills:["Timed YES / NO","3 chances"],howTo:"babyCry"},{id:"puzzle",n:2,tag:"Drag & drop puzzle",title:"Attach the Missing Puzzle",desc:"Start with an empty board. Only correct YES/NO answers release a puzzle piece — then drag it into place yourself to reveal the picture.",art:Ia(),pills:["YES / NO","Touch dragging"],howTo:"puzzle"},{id:"factFall",n:3,tag:"Top-down driving",title:"Fact or Fall",desc:"Drive the road and choose LEFT for YES or RIGHT for NO. A wrong turn crashes the car and costs one of your 3 chances.",art:Ha(),pills:["YES / NO roads","3 chances"],howTo:"factFall"},{id:"hearts",n:4,tag:"Question battle",title:"Save Your Hearts",desc:"Duel the doubt demon! Both start with 3 hearts: correct YES/NO answers land a hit, mistakes cost you a heart.",art:Ba(),pills:["YES / NO duel","3 v 3 hearts"],howTo:"hearts"},{id:"maze",n:5,tag:"Maze chase",title:"Choose & Escape",desc:"Answer first — then the question disappears and you must escape through your own gate while three enemies hunt you.",art:Ra(),pills:["Answer, then run","3 enemies"],howTo:"maze"},{id:"princess",n:6,tag:"Platform adventure",title:"Save the Princess",desc:"Run, jump and hit the ? blocks. Five correct answers open the castle gate — a wrong one costs a life.",art:Oa(),pills:["Jump & dodge","3 lives"],howTo:"princess"},{id:"bingo",n:7,tag:"Board game",title:"Bingo Game",desc:"Open closed boxes to find stars. A star only counts when you answer its question — complete the highlighted pattern to win.",art:Na(),pills:["5x5 board","Random pattern"],howTo:"bingo"}];function rs(e){p.music("hub");const a=o("section",{class:"hub","aria-label":"SAFE SQUAD game hub"});a.appendChild(He(Ea(),"hub__sky"));const s=He(Mt("happy"),"hub__logo"),t=o("button",{class:"icon-btn",type:"button","aria-label":"Open settings",title:"Settings",html:T("gear")});t.addEventListener("click",()=>{p.sfx("click"),Zt()});const i=o("header",{class:"hub__topbar"},o("div",{class:"hub__brand"},s,o("div",{class:"hub__brandtext"},o("strong",{text:"SAFE SQUAD"}),o("span",{text:"Child Protection Hub"}))),t,...da()),n=o("div",{class:"hub__hero"},o("div",{class:"hub__herotext"},o("h1",{html:"Learn to spot the signs.<br><em>Protect every child.</em>"}),o("p",{text:`Seven cartoon mini-games about staying safe online, at school and at home — ${fa} random questions every round.`}),o("div",{class:"hub__herobadges"},o("span",{class:"hub__badge",html:`${T("tap")}<span>Made for phones</span>`}),o("span",{class:"hub__badge",html:`${T("question")}<span>5 questions per round</span>`}),o("span",{class:"hub__badge",html:`${T("people")}<span>Classroom friendly</span>`}))),He(Mt("wave"),"hub__mascot")),r=ls(),h=o("div",{class:"hub__cards"});os.forEach(k=>h.appendChild(ns(k,e)));const f=o("button",{class:"btn btn--sun",type:"button",html:`${T("question")}<span>How to Play</span>`});f.addEventListener("click",()=>{p.sfx("click"),gt("hub")});const c=o("button",{class:"btn btn--ghost",type:"button",html:`${T("gear")}<span>Settings</span>`});c.addEventListener("click",()=>{p.sfx("click"),Zt()});const m=o("div",{class:"hub__inner"},i,n,o("div",{class:"hub__sectionhead"},o("h2",{text:"Choose your mission"}),o("span",{text:"7 games · 5 questions each"})),h,r,o("div",{class:"hub__actions"},f,c),o("p",{class:"hub__foot",html:"SAFE SQUAD · original artwork, characters and music created for this project.<br>If something in real life feels unsafe, tell a trusted adult straight away."}));return a.appendChild(m),Fe.seenIntro||window.setTimeout(()=>gt("hub"),700),{root:a}}function ns(e,a){const s=He(e.art,"gcard__art");s.appendChild(o("span",{class:"gcard__tag",text:e.tag})),s.appendChild(o("span",{class:"gcard__num",text:String(e.n),"aria-hidden":"true"}));const t=Fe.best[e.id],i=o("button",{class:"gcard__main",type:"button","aria-label":`Play ${e.title}. ${e.desc}`},s,o("div",{class:"gcard__body"},o("h3",{text:e.title}),o("p",{text:e.desc}),o("div",{class:"gcard__meta"},...e.pills.map(r=>o("span",{class:"gcard__pill",text:r})),t!==void 0?o("span",{class:"gcard__pill gcard__pill--best",text:`★ Best ${t}/5`}):o("span",{class:"gcard__pill",text:"New"})),o("div",{class:"gcard__cta"},o("span",{class:"gcard__play",html:`${T("play")}<span>Play now</span>`}))));i.addEventListener("click",()=>{p.sfx("whoosh"),a.go(e.id)});const n=o("button",{class:"gcard__how",type:"button",text:"How to play","aria-label":`How to play ${e.title}`});return n.addEventListener("click",r=>{r.stopPropagation(),p.sfx("click"),gt(e.howTo)}),o("article",{class:"gcard"},i,o("div",{class:"gcard__foot"},n))}function ls(){const e={babyCry:"Baby Cry",puzzle:"Puzzle",factFall:"Fact or Fall",hearts:"Save Your Hearts",maze:"Choose & Escape",princess:"Save the Princess",bingo:"Bingo"},a=o("div",{class:"hub__progressbars"});Object.keys(e).forEach(t=>{var r;const i=(r=Fe.best[t])!=null?r:0,n=o("div",{class:"progress__fill",style:{width:`${i/5*100}%`}});a.appendChild(o("div",{class:"hub__prow"},o("span",{text:e[t]}),o("span",{class:"progress__track"},n),o("b",{text:`${i}/5`})))});const s=o("div",{"aria-hidden":"true"});return s.innerHTML=`<svg viewBox="0 0 24 24" fill="none" stroke="#12a08f" stroke-width="2.2"
      stroke-linecap="round" stroke-linejoin="round"><path d="M12 3.2 19 6v6c0 4.6-3 7.6-7 8.8-4-1.2-7-4.2-7-8.8V6z"/>
      <path d="m8.8 12 2.2 2.2 4.2-4.4"/></svg>`,o("div",{class:"hub__progresscard"},s,o("div",{style:{flex:"1",minWidth:"0"}},o("strong",{style:{fontSize:"0.95rem"},text:"Your best scores on this device"}),a))}const ea=["Baby is calm","Baby is sad","Baby is upset","Baby is crying","Baby is very upset","Baby tantrum!"];function cs(e){p.music("baby"),Be();const a=new lt,s=3,t=25,i=new ct({onBack:e.toHub,howTo:"babyCry",total:a.total}),n=new dt,r=new ht,h=new ft("babyCry"),f=new pt("babyCry","babyCry"),c=new rt,m=o("section",{class:"game baby","aria-label":"Don't Make the Baby Cry"});m.appendChild(He(qa(),"game__bg"));const k=o("div",{class:"baby__chars"});k.innerHTML=Ya();const Y=k.querySelector("svg"),G=o("div",{class:"baby__timerfill"}),l=o("span",{class:"baby__timertext"}),ie=o("div",{class:"baby__timer",role:"timer","aria-live":"off"},o("span",{class:"baby__timerlabel",text:"TIME"}),o("div",{class:"baby__timertrack"},G),l),K=o("div",{class:"progress__fill"}),x=o("span",{text:ea[0]}),W=o("div",{class:"baby__moodbar",role:"status","aria-live":"polite"},x,o("div",{class:"progress__track"},K)),$=o("span",{class:"qpanel__topic"}),Ce=o("p",{class:"qpanel__text",role:"heading","aria-level":"2"}),re=o("div",{class:"qpanel"},$,Ce),ce=o("button",{class:"btn answer-btn",type:"button",html:`${T("check")}<span>YES</span><small>SAFE / TRUE</small>`,"aria-label":"Answer yes"}),F=o("button",{class:"btn answer-btn answer-btn--no",type:"button",html:`${T("cross")}<span>NO</span><small>UNSAFE / FALSE</small>`,"aria-label":"Answer no"}),U=o("div",{class:"baby__answers"},ce,F),he=o("div",{class:"game__stage"},o("div",{class:"baby__layout"},k,o("div",{class:"baby__panelwrap"},W,ie,re,U)));m.append(i.root,he,h.root,r.root,n.root);let I=!0,H=!1,N=0,B=t,pe=0;function D(){pe&&(window.clearInterval(pe),pe=0)}function P(){l.textContent=`${Math.ceil(Math.max(0,B))}s`,G.style.width=`${Math.max(0,B)/t*100}%`,ie.classList.toggle("is-urgent",B<=6)}function j(){D(),B=t,P(),pe=window.setInterval(()=>{I||H||(B-=.1,P(),B<=0&&(D(),ee()))},100)}function ae(){i.setLabel(`Question ${a.humanIndex} / ${a.total} · chances ${s-N}/${s}`,a.humanIndex/a.total)}function v(X){const de=Math.max(0,Math.min(5,X));Y.setAttribute("class",`chars mood-${de}`),x.textContent=ea[de],K.style.width=`${100-de*20}%`}function w(){const X=a.current;$.textContent=X.topic,Ce.textContent=X.question,ae(),re.animate([{opacity:0,transform:"translateY(14px) scale(.97)"},{opacity:1,transform:"translateY(0) scale(1)"}],{duration:320,easing:"cubic-bezier(.22,1,.36,1)"}),ce.disabled=!1,F.disabled=!1,I=!1,j()}function M(){Y.classList.add("react-good"),c.after(()=>Y.classList.remove("react-good"),950),p.sfx("correct"),c.after(()=>p.sfx("babyCoo"),220)}function R(X){Y.classList.add("react-bad"),c.after(()=>Y.classList.remove("react-bad"),550),p.sfx("wrong"),c.after(()=>{X>=5?p.sfx("babyTantrum"):X>=3?p.sfx("babyCry"):p.sfx("babyFuss")},260),X>=3&&c.after(()=>p.sfx("momGasp"),700)}function ee(){I||H||fe(!1,!0)}function ne(X){I||H||fe($t(a.current,X),!1)}function fe(X,de){I=!0,D(),ce.disabled=!0,F.disabled=!0;const Le=a.current;a.score(X),X||N++,v(N),X?(M(),r.show("Correct!","good",1400)):(R(N),r.show(de?"Time is up — that counts as a mistake.":Lt(Ft,"Not quite."),"bad",1800),h.maybeShow(N));const Ge=N>=s,je=a.index>=a.total-1,Re=X?"Correct — the baby stays calm":Ge?"Tantrum! That was your third mistake":de?`Time up — the answer was ${Le.correct}`:`Not quite — the answer was ${Le.correct}`;n.show(X,Re,Le.explanation,[{label:Ge||je?"See my result":"Next question",variant:X?"":"btn--coral",onClick:()=>{n.hide(),h.hide();const Ae=()=>{if(Ge){Te(!0);return}a.next()?w():Te(!1)};!X&&f.register(N,Ae)||Ae()}}])}function Te(X=!1){if(H)return;H=!0,D();const{correct:de,total:Le}=a.result(),Ge=X?"Game over — the baby had a tantrum after 3 mistakes.":N===0?"You finished every question and the baby stayed calm!":`You finished the round with ${N} of ${s} chances used.`;p.sfx(X?"defeat":"victory"),m.appendChild(at({gameId:"babyCry",gameTitle:"Don't Make the Baby Cry",correct:de,total:Le,title:X?"Game over":void 0,extraLine:Ge,message:a.completionMessage,categoryName:a.category.name,onReplay:()=>e.go("babyCry"),onHub:e.toHub}))}ce.addEventListener("click",()=>ne("YES")),F.addEventListener("click",()=>ne("NO"));const Me=et(window,"keydown",X=>{const de=X.key.toLowerCase();de==="y"&&ne("YES"),de==="n"&&ne("NO")});return v(0),w(),I=!0,ce.disabled=!0,F.disabled=!0,ut("Don't Make the Baby Cry","You are the mother carrying the baby. Answer each YES/NO question before the timer runs out. You have 3 chances for the whole round: 1st mistake the baby cries softly, 2nd it cries louder, 3rd it has a tantrum and the game ends.","babyCry",()=>{p.sfx("babyCoo"),I=!1,ce.disabled=!1,F.disabled=!1}),{root:m,destroy:()=>{c.clear(),D(),f.dispose(),n.hide(),Be(),Me(),p.stopMusic()}}}const zt=[{x:0,y:0,w:1/3,h:.5},{x:1/3,y:0,w:1/3,h:.5},{x:2/3,y:0,w:1/3,h:.5},{x:0,y:.5,w:.5,h:.5},{x:.5,y:.5,w:.5,h:.5}],ta=zt.length;function hs(e){p.music("puzzle"),Be();const a=new lt,s=new ct({onBack:e.toHub,howTo:"puzzle",total:a.total}),t=new dt,i=new ht,n=new ft("puzzle","top"),r=new pt("puzzle","puzzle");let h=0;const f=new rt,c=o("section",{class:"game puz","aria-label":"Attach the Missing Puzzle"});c.appendChild(He(Pa(),"game__bg"));const m=o("div",{class:"puz__board"});m.appendChild(He(Kt(),"puz__ghost"));const k=zt.map((g,b)=>{const L=o("div",{class:"puz__slot",style:{left:`${g.x*100}%`,top:`${g.y*100}%`,width:`${g.w*100}%`,height:`${g.h*100}%`}});return L.appendChild(o("div",{class:"puz__slotnum",text:String(b+1)})),m.appendChild(L),L}),Y=o("div",{class:"puz__boardwrap"},m),G=o("div",{class:"puz__trayhint",text:"Answer the question correctly to earn your first piece."}),l=o("div",{class:"puz__tray"},G),ie=o("div",{class:"puz__traylabel"},o("span",{text:"Piece tray"}),o("small",{text:"Drag each piece into its numbered hole"})),K=o("div",{class:"puz__side"}),x=o("div",{class:"puz__layer",style:{position:"absolute",inset:"0",zIndex:"25",pointerEvents:"none"}}),W=o("div",{class:"game__stage"},o("div",{class:"puz__layout"},Y,K)),$=o("button",{class:"btn btn--sun puz__seeqa",type:"button",html:`${T("question")}<span>See Q&amp;A</span>`,"aria-label":"Reopen the current question"});$.addEventListener("click",()=>{p.sfx("click"),ne?de():Ge()}),K.append($,ie,l),c.append(s.root,W,x,n.root,i.root,t.root);const Ce=Wt(Array.from({length:ta},(g,b)=>b)),re=new Map;let ce=0;function F(g){const b=o("div",{class:"puzzle-piece__inner",style:{position:"absolute",left:"0",top:"0",pointerEvents:"none"}});b.innerHTML=Kt();const L=b.firstElementChild;L==null||L.setAttribute("preserveAspectRatio","none");const V=o("div",{class:"puzzle-piece__fx"},b),te=o("div",{class:"puzzle-piece is-new",role:"button",tabindex:"0","aria-label":`Puzzle piece ${g+1}. Drag it into hole ${g+1}.`,style:{position:"absolute",pointerEvents:"auto"}},V);x.appendChild(te);const J={index:g,node:te,placed:!1,trayOrder:ce++};return re.set(g,J),B(J),J}function U(g){const b=m.getBoundingClientRect(),L=zt[g];return{x:b.left+L.x*b.width,y:b.top+L.y*b.height,w:L.w*b.width,h:L.h*b.height}}function he(){const g=x.getBoundingClientRect(),b=m.getBoundingClientRect();re.forEach(L=>{const V=zt[L.index],te=V.w*b.width,J=V.h*b.height;L.node.style.width=`${te}px`,L.node.style.height=`${J}px`;const ye=L.node.querySelector(".puzzle-piece__inner");if(ye.style.width=`${b.width}px`,ye.style.height=`${b.height}px`,ye.style.transform=`translate(${-V.x*b.width}px, ${-V.y*b.height}px)`,L.node.classList.contains("is-dragging"))return;const _=I(L);N(L.node,_.x-g.left,_.y-g.top,_.scale)})}function I(g){if(g.placed){const b=U(g.index);return{x:b.x,y:b.y,scale:1}}return H(g)}function H(g){const b=l.getBoundingClientRect(),L=U(g.index),V=Math.max(60,b.width-20),te=Math.max(1,ce),J=ze(Math.min(1,V/(te*(L.w+10))),.42,1),ye=(L.w+10)*J;return{x:b.left+(b.width-ye*te)/2+g.trayOrder*ye,y:b.top+Math.max(6,(b.height-L.h*J)/2),scale:J}}function N(g,b,L,V=1){g.style.transformOrigin="top left",g.style.transform=`translate3d(${b}px, ${L}px, 0) scale(${V})`}function B(g){const b=g.node;let L=!1,V=0,te=0,J=-1;const ye=ge=>{if(g.placed||L)return;L=!0,J=ge.pointerId;const ve=x.getBoundingClientRect(),C=b.getBoundingClientRect();V=ge.clientX-C.left,te=ge.clientY-C.top,b.classList.add("is-dragging"),b.classList.remove("is-returning","is-new"),N(b,C.left-ve.left,C.top-ve.top,1);try{b.setPointerCapture(ge.pointerId)}catch{}p.sfx("pop"),ge.preventDefault()},_=ge=>{const ve=U(g.index);return{cx:ge.clientX-V+ve.w/2,cy:ge.clientY-te+ve.h/2}},le=ge=>{if(!L||ge.pointerId!==J)return;const ve=x.getBoundingClientRect();N(b,ge.clientX-V-ve.left,ge.clientY-te-ve.top,1);const{cx:C,cy:O}=_(ge);D(pe(C,O)),ge.preventDefault()},Se=ge=>{if(!L)return;L=!1,J=-1,b.classList.remove("is-dragging"),D(-1);const{cx:ve,cy:C}=_(ge),O=pe(ve,C);O===g.index?j(g):ae(g,O)};b.addEventListener("pointerdown",ye),b.addEventListener("pointermove",le),b.addEventListener("pointerup",Se),b.addEventListener("pointercancel",()=>{L&&(L=!1,b.classList.remove("is-dragging"),D(-1),v(g))}),b.addEventListener("keydown",ge=>{const ve=ge.key;(ve==="Enter"||ve===" ")&&(ge.preventDefault(),j(g))})}function pe(g,b){let L=-1,V=1/0,te=0;for(let J=0;J<ta;J++){const ye=U(J),_=Math.hypot(g-(ye.x+ye.w/2),b-(ye.y+ye.h/2));_<V&&(V=_,L=J,te=Math.max(ye.w,ye.h))}return V<te*.75?L:-1}function D(g){k.forEach((b,L)=>b.classList.toggle("puz__slot--hot",L===g&&!P(L)))}function P(g){const b=re.get(g);return!!b&&b.placed}function j(g){g.placed=!0,g.node.classList.remove("is-new"),g.node.classList.add("is-placed","is-snapping"),g.node.style.pointerEvents="none",g.node.tabIndex=-1,k[g.index].classList.add("puz__slot--filled");const b=k[g.index].querySelector(".puz__slotnum");b&&(b.style.display="none"),p.sfx("snap"),he(),M(g.index),i.show("Piece attached!","good",1200),w(),f.after(()=>g.node.classList.remove("is-snapping"),420),f.after(Re,520)}function ae(g,b){p.sfx("wrong"),g.node.classList.add("is-wrong"),f.after(()=>g.node.classList.remove("is-wrong"),420),i.show(b===-1?"Drop the piece closer to a hole on the board.":`That hole belongs to another piece — try hole ${g.index+1}.`,"bad",2e3),v(g)}function v(g){g.node.classList.add("is-returning");const b=x.getBoundingClientRect(),L=I(g);N(g.node,L.x-b.left,L.y-b.top,L.scale),f.after(()=>g.node.classList.remove("is-returning"),340)}function w(){let g=0;ce=0,re.forEach(b=>{b.placed||ce++}),re.forEach(b=>{b.placed||(b.trayOrder=g++)}),G.style.display=ce?"none":"grid",G.textContent=ce?"":Te()?"All pieces attached — well done!":"Answer the question correctly to earn the next piece.",he()}function M(g){const b=U(g),L=x.getBoundingClientRect(),V=["#ffc93c","#2fd6c0","#ff6f61","#7b61ff"];for(let te=0;te<10;te++){const J=document.createElement("span");J.className="sparkle",J.style.background=V[te%V.length],J.style.left=`${b.x-L.left+b.w/2}px`,J.style.top=`${b.y-L.top+b.h/2}px`;const ye=te/10*Math.PI*2;J.style.setProperty("--dx",`${Math.cos(ye)*(40+Math.random()*40)}px`),J.style.setProperty("--dy",`${Math.sin(ye)*(40+Math.random()*40)}px`),x.appendChild(J),f.after(()=>J.remove(),700)}}const R=o("div",{class:"puz__qoverlay",hidden:"true"});c.appendChild(R);let ee=!1,ne=!1,fe=null;function Te(){return a.index>=a.total}function Me(){const g=R.hidden&&!ee&&(ne||fe!==null);$.classList.toggle("is-show",g),$.disabled=!g;const b=ne?"See Q&A":"Review Q&A",L=$.querySelector("span");L&&(L.textContent=b),$.setAttribute("aria-label",ne?"Reopen the current question":"Review the question you just answered")}function X(){R.hidden=!0,R.replaceChildren(),Me()}function de(){if(ee)return;const g=a.current;ne=!0,s.setProgress(a.humanIndex,a.total);const b=o("span",{class:"qpanel__topic",text:g.topic}),L=o("p",{class:"qpanel__text",role:"heading","aria-level":"2",text:g.question}),V=o("div",{class:"opt-list opt-list--yesno"}),te=[];["YES","NO"].forEach(_=>{const le=o("button",{class:`btn answer-btn${_==="NO"?" answer-btn--no":""}`,type:"button",html:`${T(_==="YES"?"check":"cross")}<span>${_}</span>`,"aria-label":`Answer ${_.toLowerCase()}`});le.dataset.answer=_,le.addEventListener("click",()=>Le(_,le,te)),te.push(le),V.appendChild(le)});const J=o("button",{class:"icon-btn puz__qclose",type:"button","aria-label":"Hide the question (you can reopen it with See Q&A)",title:"Hide question",html:T("close")});J.addEventListener("click",()=>{p.sfx("back"),X(),i.show('Question hidden — tap "See Q&A" to bring it back.',"plain",2600)});const ye=o("div",{class:"puz__qcard"},o("div",{class:"qpanel puz__qpanel"},J,b,L,V));R.replaceChildren(ye),R.hidden=!1,Me(),f.after(()=>{var _;return(_=te[0])==null?void 0:_.focus()},200)}function Le(g,b,L){const V=a.current,te=$t(V,g);if(L.forEach(J=>J.disabled=!0),b.classList.add(te?"is-correct":"is-wrong"),a.score(te),p.sfx(te?"correct":"wrong"),te){fe=V,t.show(!0,"Correct — piece unlocked!",V.explanation,[{label:"Take the piece",onClick:()=>{t.hide(),ne=!1,X(),je()}}]);return}h++,n.nudge(),t.show(!1,`Not quite — the answer was ${V.correct}`,`${Lt(Ft,"Not quite.")} ${V.explanation}`,[{label:"Try again",variant:"btn--coral",onClick:()=>{t.hide(),r.register(h,()=>de())||de()}}])}function Ge(){const g=fe;if(!g)return;const b=o("button",{class:"icon-btn puz__qclose",type:"button","aria-label":"Close the recap",title:"Close",html:T("close")});b.addEventListener("click",()=>{p.sfx("back"),X()});const L=o("div",{class:"opt-list"}),V=o("div",{class:"btn opt-btn is-correct","aria-disabled":"true"});V.append(o("span",{class:"opt-text",text:`Correct answer: ${g.correct}`})),L.appendChild(V);const te=o("div",{class:"puz__qcard"},o("div",{class:"qpanel puz__qpanel"},b,o("span",{class:"qpanel__topic",text:`${g.topic} · answered`}),o("p",{class:"qpanel__text",text:g.question}),L,o("p",{class:"puz__reviewnote",text:g.explanation})));R.replaceChildren(te),R.hidden=!1,Me(),f.after(()=>b.focus(),150)}function je(){const g=Ce[a.index];g!==void 0&&!re.has(g)&&(F(g),p.sfx("appear"),w(),i.show(`Piece ${g+1} is in your tray — drag it into hole ${g+1}.`,"plain",3e3)),a.next(),Re()}function Re(){ee||(Me(),[...re.values()].some(b=>!b.placed))||(Te()?Ae():f.after(de,350))}function Ae(){if(ee)return;ee=!0,ne=!1,Me(),p.sfx("fanfare"),m.classList.add("pulse-good");const{correct:g,total:b}=a.result();f.after(()=>{c.appendChild(at({gameId:"puzzle",gameTitle:"Attach the Missing Puzzle",correct:g,total:b,extraLine:"You completed the picture!",message:a.completionMessage,categoryName:a.category.name,onReplay:()=>e.go("puzzle"),onHub:e.toHub}))},700)}const Ee=new ResizeObserver(()=>he());Ee.observe(m),Ee.observe(l);const it=et(window,"resize",()=>he()),Oe=et(window,"orientationchange",()=>f.after(he,250));return requestAnimationFrame(()=>{he(),w()}),Me(),ut("Attach the Missing Puzzle","The board starts empty. Answer each YES/NO question correctly to earn a puzzle piece, then drag it into its hole yourself. A wrong answer means no piece — you simply try that question again.","puzzle",()=>{he(),de()}),{root:c,destroy:()=>{f.clear(),r.dispose(),t.hide(),Be(),Ee.disconnect(),it(),Oe(),p.stopMusic()}}}const aa=1200;function fs(e){p.music("drive"),Be();const a=new lt,s=3;let t=s;const i=new ct({onBack:e.toHub,howTo:"factFall",total:a.total}),n=new dt,r=new ht,h=new ft("factFall"),f=new pt("factFall","factFall",2);let c=0;const m=new rt,k=o("section",{class:"game drive","aria-label":"Fact or Fall driving game"}),Y=o("canvas",{"aria-hidden":"true"}),G=o("div",{class:"drive__world"},Y),l=Y.getContext("2d"),ie=He(Ga(),"drive__car"),K=He(Da(),"drive__driver"),x=He(Xt("yes"),"drive__sign drive__sign--yes"),W=He(Xt("no"),"drive__sign drive__sign--no"),$=o("div",{class:"drive__signs"},x,W),Ce=o("span",{class:"qpanel__topic"}),re=o("p",{class:"qpanel__text",role:"heading","aria-level":"2"}),ce=o("div",{class:"drive__panel qpanel"},Ce,re),F=o("button",{class:"btn road-btn",type:"button",html:"<small>← LEFT ROAD</small><span>YES · FACT</span>","aria-label":"Take the left road: yes, this is a fact"}),U=o("button",{class:"btn road-btn road-btn--right",type:"button",html:"<small>RIGHT ROAD →</small><span>NO · MYTH</span>","aria-label":"Take the right road: no, this is a myth"}),he=o("div",{class:"drive__choices"},F,U),I=o("div",{class:"drive__hint",text:"Tip: the road signs at the fork show which side is YES and which is NO."}),H=o("div",{class:"drive__ui"},ce,he,I);k.append(G,$,ie,K,i.root,H,h.root,r.root,n.root);let N=1,B=1,pe=1,D=200,P="idle",j=0,ae=0,v=!1,w=0,M=0,R=0,ee=1,ne=0,fe=-1,Te=0,Me=!1;const X=[];let de=1234;function Le(){return de=(de*1664525+1013904223)%4294967296,de/4294967296}function Ge(){X.length=0;const y=aa*(a.total+2);for(let q=-400;q<y;q+=62){const A=Le(),se=A>.5?1:-1,Z=A>.62?"tree":A>.42?"bush":A>.3?"rock":A>.22?"sign":"flower";X.push({side:se,offset:40+Le()*260,world:q+Le()*60,kind:Z,size:.7+Le()*.8})}}Ge();let je=!0;function Re(){je=!1,L="",N=Math.max(1,k.clientWidth),B=Math.max(1,k.clientHeight),pe=Yt();const y=Math.round(N*pe),q=Math.round(B*pe);(Y.width!==y||Y.height!==q)&&(Y.width=y,Y.height=q),Y.style.width=`${N}px`,Y.style.height=`${B}px`,l==null||l.setTransform(pe,0,0,pe,0,0),D=ze(N*.24,104,210);const A=ze(D*.46,62,110);ie.style.width=`${A}px`,K.style.width=`${A*.78}px`,(P==="idle"||P==="driving")&&(w=N/2,M=Oe())}const Ae=()=>ze(D*1.5,D*1.15,N*.36),Ee=()=>ze(Oe()*.27,70,170),it=()=>ze(Oe()*.3,80,180),Oe=()=>{const y=H.getBoundingClientRect().height||B*.28,q=(ie.getBoundingClientRect().width||80)*(190/120);return ze(B-y-q*.75,B*.28,B*.72)},g=()=>(a.index+1)*aa,b=()=>Oe()-(g()-j);let L="";function V(){const y=`${N}|${B}|${Math.round(j*4)}|${P}|${fe}`;y!==L&&(L=y,te())}function te(){if(!l)return;const y=N/2,q=l.createLinearGradient(0,0,0,B);q.addColorStop(0,"#6fce8f"),q.addColorStop(.5,"#7ed99b"),q.addColorStop(1,"#5fc482"),l.fillStyle=q,l.fillRect(0,0,N,B),l.fillStyle="rgba(63,174,106,.28)";for(let oe=0;oe<3;oe++){const Pe=(j*.12+oe*420)%(B+500)-200;l.beginPath(),l.ellipse(y-D*2.4+oe*90,Pe,260,90,0,0,Math.PI*2),l.ellipse(y+D*2.2-oe*60,Pe+160,300,100,0,0,Math.PI*2),l.fill()}const A=b(),se=A>-300&&A<B+200,Z=Ae(),De=Ee(),qe=[{x:y,y:B+80},{x:y,y:se?A:-120}],Ye=se?[-1,1].map(oe=>[{x:y,y:A},{x:y+oe*Z,y:A-De},{x:y+oe*Z,y:A-De-900}]):[],Xe=[qe,...Ye],tt=oe=>{l.beginPath(),l.moveTo(oe[0].x,oe[0].y);for(let Pe=1;Pe<oe.length;Pe++)l.lineTo(oe[Pe].x,oe[Pe].y)};l.lineJoin="round",l.lineCap="round",l.strokeStyle="#eef2f7",l.lineWidth=D+12,Xe.forEach(oe=>{tt(oe),l.stroke()}),l.strokeStyle="#59637a",l.lineWidth=D,Xe.forEach(oe=>{tt(oe),l.stroke()});const bt=Math.max(18,D*.16);l.strokeStyle="#ffd85e",l.lineWidth=Math.max(5,D*.045),l.setLineDash([bt,bt*.85]),l.lineCap="butt",l.lineDashOffset=-(j%(bt*1.85)),tt(qe),l.stroke(),l.lineDashOffset=0,Ye.forEach(oe=>{tt(oe),l.stroke()}),l.setLineDash([]),l.lineCap="round",se&&(l.fillStyle="#59637a",l.beginPath(),l.arc(y,A,D*.62,0,Math.PI*2),l.fill(),l.strokeStyle="rgba(255,255,255,.55)",l.lineWidth=Math.max(4,D*.04),l.lineCap="round",[-1,1].forEach(oe=>{const Pe=y+oe*D*.3,Ze=A-D*.16;l.beginPath(),l.moveTo(y+oe*D*.06,A+D*.2),l.lineTo(Pe,Ze),l.moveTo(Pe,Ze),l.lineTo(Pe-oe*D*.12,Ze+D*.02),l.moveTo(Pe,Ze),l.lineTo(Pe-oe*D*.02,Ze+D*.14),l.stroke()})),X.forEach(oe=>{const Pe=Oe()-(oe.world-j);if(Pe<-80||Pe>B+80)return;const Ze=y+oe.side*(D/2+oe.offset);Ze<-80||Ze>N+80||_(Ze,Pe,A,se,Z,De,34*oe.size)||J(oe,Ze,Pe)}),(P==="crash"||P==="recover")&&ge(y+fe*Z*.9,A-De*.86);const ot=l.createLinearGradient(0,B*.55,0,B);ot.addColorStop(0,"rgba(6,16,32,0)"),ot.addColorStop(1,"rgba(6,16,32,.35)"),l.fillStyle=ot,l.fillRect(0,B*.55,N,B*.45)}function J(y,q,A){if(!l)return;const se=y.size;switch(l.save(),l.translate(q,A),l.scale(se,se),l.fillStyle="rgba(20,60,40,.18)",y.kind){case"tree":l.beginPath(),l.ellipse(6,10,30,22,0,0,Math.PI*2),l.fill(),l.fillStyle="#2f9c5e",le(0,0,30),l.fillStyle="#3fae6a",le(-12,-8,20),le(14,-4,18),l.fillStyle="#57c47e",le(-2,-14,15),l.fillStyle="#8d6b4b",l.beginPath(),l.arc(0,0,6,0,Math.PI*2),l.fill();break;case"bush":l.beginPath(),l.ellipse(4,8,20,12,0,0,Math.PI*2),l.fill(),l.fillStyle="#3fae6a",le(0,0,18),l.fillStyle="#57c47e",le(-10,4,12),le(10,4,12);break;case"rock":l.fillStyle="#9fb0c4",l.beginPath(),l.moveTo(-14,8),l.lineTo(-6,-10),l.lineTo(8,-12),l.lineTo(16,6),l.closePath(),l.fill(),l.fillStyle="#c3d0de",l.beginPath(),l.moveTo(-6,-10),l.lineTo(8,-12),l.lineTo(4,0),l.closePath(),l.fill();break;case"sign":l.fillStyle="#8d6b4b",l.fillRect(-3,-6,6,26),l.fillStyle="#2fd6c0",Se(-20,-30,40,26,8),l.fill(),l.fillStyle="#0b7a6d",Se(-13,-23,26,5,2.5),l.fill(),Se(-13,-14,18,5,2.5),l.fill();break;default:l.fillStyle="#ffd166",le(0,0,5),l.fillStyle="#fff",le(-8,4,4),le(8,3,4);break}l.restore()}function ye(y,q,A,se,Z,De){const qe=Z-A,Ye=De-se,Xe=qe*qe+Ye*Ye||1,tt=ze(((y-A)*qe+(q-se)*Ye)/Xe,0,1);return Math.hypot(y-(A+tt*qe),q-(se+tt*Ye))}function _(y,q,A,se,Z,De,qe){const Ye=N/2,Xe=D/2+qe+12,tt=se?A:-200;if(Math.abs(y-Ye)<Xe&&q>tt-Xe)return!0;if(!se)return!1;if(Math.hypot(y-Ye,q-A)<D*.72+qe)return!0;for(const bt of[-1,1]){const ot=Ye+bt*Z,oe=A-De;if(ye(y,q,Ye,A,ot,oe)<Xe||ye(y,q,ot,oe,ot,oe-900)<Xe)return!0}return!1}function le(y,q,A){l&&(l.beginPath(),l.arc(y,q,A,0,Math.PI*2),l.fill())}function Se(y,q,A,se,Z){l&&(l.beginPath(),l.moveTo(y+Z,q),l.arcTo(y+A,q,y+A,q+se,Z),l.arcTo(y+A,q+se,y,q+se,Z),l.arcTo(y,q+se,y,q,Z),l.arcTo(y,q,y+A,q,Z),l.closePath())}function ge(y,q){l&&(l.save(),l.translate(y,q),l.fillStyle="#2f3646",l.beginPath(),l.ellipse(0,0,46,26,0,0,Math.PI*2),l.fill(),l.fillStyle="#1c212c",l.beginPath(),l.ellipse(0,2,36,18,0,0,Math.PI*2),l.fill(),l.fillStyle="#ff9a3c",Se(-40,-46,80,14,6),l.fill(),l.fillStyle="#fff",[-30,-6,18].forEach(A=>{Se(A,-46,12,14,4),l.fill()}),l.restore())}function ve(){const y=Te>0?Math.sin(performance.now()/28)*Te:0;ie.style.transform=`translate3d(${w+y}px, ${M}px, 0) translate(-50%, -50%) rotate(${R}deg) scale(${ee})`}function C(y){ie.classList.toggle("is-rolling",y)}function O(){i.setLabel(`Question ${a.humanIndex} / ${a.total} · chances ${t}/${s}`,(a.humanIndex-1)/a.total)}function $e(){const y=a.current;Ce.textContent=y.topic,re.textContent=y.question,O(),ce.classList.add("is-show"),F.disabled=!1,U.disabled=!1,he.style.visibility="visible",_e(!0),P="question",p.setEngineSpeed(.05)}function ke(){ce.classList.remove("is-show"),F.disabled=!0,U.disabled=!0,_e(!1)}function _e(y){const q=b(),A=Ae(),se=ze(q-Ee()*1.25,140,B*.62);x.style.left=`${ze(N/2-A,70,N-70)}px`,x.style.top=`${se}px`,W.style.left=`${ze(N/2+A,70,N-70)}px`,W.style.top=`${se}px`,x.classList.toggle("is-show",y),W.classList.toggle("is-show",y)}function u(y){if(P!=="question"||v)return;const q=a.current,A=$t(q,y);fe=y==="YES"?-1:1,ke(),ne=0,p.sfx("skid"),A?(Me||a.score(!0),P="turning",C(!0),p.setEngineSpeed(.9),r.show(Me?"Back on the road!":"Correct — nice driving!","good",1500)):(Me||a.score(!1),c++,h.maybeShow(c),Me=!0,P="turning",C(!0),p.setEngineSpeed(.7)),d=A}let d=!1;function E(){P="crash",C(!1),Te=6,ie.classList.add("is-broken"),p.sfx("crash"),p.setEngineSpeed(0),m.after(()=>p.sfx("flatTyre"),420),m.after(()=>{Te=0,K.style.left=`${w-fe*70}px`,K.style.top=`${M+30}px`,K.classList.add("is-out")},500);const y=a.current;t=Math.max(0,t-1),O();const q=t<=0;m.after(()=>{n.show(!1,q?"Crash! That was your last chance":`Oh no — you fell off the road! The answer was ${y.correct}`,`${Lt(Ft,"")} ${y.explanation}`,[{label:q?"See my result":`Retry this fork · ${t} chance(s) left`,variant:"btn--coral",onClick:()=>{if(n.hide(),q){z(!0);return}f.register(c,()=>S())||S()}}])},900)}function S(){P="recover",K.classList.remove("is-out"),ie.classList.remove("is-broken"),p.sfx("pop"),a.allowRetry();const y=w,q=M,A=R,se=performance.now(),Z=700,De=()=>{const qe=ze((performance.now()-se)/Z,0,1);w=mt(y,N/2,qe),M=mt(q,Oe(),qe),R=mt(A,0,qe),ve(),qe<1?requestAnimationFrame(De):(p.setEngineSpeed(.2),$e())};requestAnimationFrame(De)}function Q(){a.next()?(Me=!1,P="driving",ae=0,w=N/2,M=Oe(),R=0,C(!0)):z()}function z(y=!1){if(v)return;v=!0,P="done",C(!1),p.stopEngine(),p.sfx(y?"defeat":"victory");const{correct:q,total:A}=a.result();k.appendChild(at({gameId:"factFall",gameTitle:"Fact or Fall",correct:q,total:A,title:y?"Game over":void 0,extraLine:y?"You ran out of chances before reaching the destination.":`You reached the destination with ${t}/${s} chances left!`,message:a.completionMessage,categoryName:a.category.name,onReplay:()=>e.go("factFall"),onHub:e.toHub}))}const be=Nt(y=>{if(je&&(Re(),_e(P==="question")),P==="driving"){const q=g()-it(),A=q-j,se=ze(A*1.6,90,520);ae=mt(ae,se,.06),j=Math.min(q,j+ae*y),p.setEngineSpeed(ze(ae/520,.1,1)),A<=2&&(j=q,ae=0,C(!1),p.sfx("skid"),$e())}else if(P==="turning"){ne=ze(ne+y*(d?.85:1.1),0,1);const q=b(),A=Ae(),se=Ee(),Z=ne,De={x:N/2,y:Oe()},qe={x:N/2,y:q},Ye=d?{x:N/2+fe*A,y:Math.max(60,q-se-D*.6)}:{x:N/2+fe*A*.9,y:q-se*.86};if(w=(1-Z)*(1-Z)*De.x+2*(1-Z)*Z*qe.x+Z*Z*Ye.x,M=(1-Z)*(1-Z)*De.y+2*(1-Z)*Z*qe.y+Z*Z*Ye.y,R=mt(0,fe*42,Math.min(1,Z*1.6)),d&&(j+=180*y*Z),ne>=1)if(d){P="idle",p.sfx("correct");const Xe=a.current;n.show(!0,"Correct road!",Xe.explanation,[{label:a.index>=a.total-1?"Finish the drive":"Drive on",onClick:()=>{n.hide(),Q()}}])}else E()}ve(),V()});F.addEventListener("click",()=>u("YES")),U.addEventListener("click",()=>u("NO"));const We=et(window,"keydown",y=>{const q=y.key;q==="ArrowLeft"&&u("YES"),q==="ArrowRight"&&u("NO")}),Ke=et(window,"resize",()=>{je=!0}),me=new ResizeObserver(()=>{je=!0});return me.observe(k),Re(),O(),ke(),he.style.visibility="hidden",w=N/2,M=Oe(),ve(),ut("Fact or Fall","Drive the road and decide at every fork: LEFT = YES, RIGHT = NO. A wrong turn makes the car crash and costs one of your 3 chances. Reach the destination before your chances run out!","factFall",()=>{p.startEngine(),he.style.visibility="visible",P="driving",C(!0)}),{root:k,destroy:()=>{m.clear(),f.dispose(),n.hide(),h.hide(),Be(),be(),We(),Ke(),me.disconnect(),p.stopEngine(),p.stopMusic()}}}const Vt='preserveAspectRatio="xMidYMid slice"';function ds(){const e=Array.from({length:26},(a,s)=>{const t=40+s*46,i=300+s%3*16,n=["#ffd166","#63c6ff","#ff9a86","#7ed99b","#c9b3ff"][s%5];return`<g transform="translate(${t} ${i})"><circle r="17" fill="${n}" opacity=".85"/>
      <path d="M-20 34c0-16 9-24 20-24s20 8 20 24z" fill="${n}" opacity=".6"/></g>`}).join("");return`
<svg viewBox="0 0 1200 800" ${Vt} aria-hidden="true">
  <defs>
    <linearGradient id="arenaSky" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#1b2c5c"/><stop offset=".45" stop-color="#3f4fa0"/>
      <stop offset="1" stop-color="#7b61ff"/>
    </linearGradient>
    <linearGradient id="arenaFloor" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#ffb648"/><stop offset="1" stop-color="#e08a2a"/>
    </linearGradient>
    <radialGradient id="spot" cx="50%" cy="0%" r="70%">
      <stop offset="0" stop-color="#fff6d6" stop-opacity=".55"/>
      <stop offset="1" stop-color="#fff6d6" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="1200" height="800" fill="url(#arenaSky)"/>
  <ellipse cx="600" cy="120" rx="520" ry="300" fill="url(#spot)"/>

  <!-- banners -->
  ${[160,420,780,1040].map((a,s)=>`<g transform="translate(${a} 0)">
      <rect x="-34" y="-10" width="68" height="150" rx="10" fill="${["#2fd6c0","#ff6f61","#ffd166","#63c6ff"][s]}"/>
      <path d="M-34 140h68l-34 34z" fill="${["#12a08f","#c9483c","#e0a92a","#2f9ae0"][s]}"/>
      <circle cx="0" cy="62" r="22" fill="#fff" opacity=".85"/>
      <path d="M0 46 14 52v14c0 10-6 16-14 20-8-4-14-10-14-20V52z" fill="#0e1a33" opacity=".7"/>
    </g>`).join("")}

  <!-- crowd stand -->
  <path d="M0 260h1200v120H0z" fill="#152449"/>
  ${e}
  <path d="M0 356h1200v34H0z" fill="#0e1a33"/>

  <!-- arena floor -->
  <path d="M60 390h1080l120 410H-60z" fill="url(#arenaFloor)"/>
  <path d="M100 420h1000l90 320H10z" fill="#ffd08a" opacity=".55"/>
  <g stroke="#c9803c" stroke-width="5" opacity=".45">
    ${Array.from({length:7},(a,s)=>`<path d="M${120+s*160} 400 ${60+s*190} 800"/>`).join("")}
  </g>
  <ellipse cx="600" cy="640" rx="420" ry="80" fill="#ffe3b0" opacity=".5"/>
</svg>`}function us(){return`
<svg viewBox="0 0 1200 800" ${Vt} aria-hidden="true">
  <defs>
    <linearGradient id="mazeSky" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#123a5c"/><stop offset=".5" stop-color="#1f6f7a"/>
      <stop offset="1" stop-color="#2f9c6a"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="800" fill="url(#mazeSky)"/>
  <g opacity=".18" fill="#fff">
    <ellipse cx="220" cy="120" rx="120" ry="46"/><ellipse cx="300" cy="140" rx="90" ry="34"/>
    <ellipse cx="980" cy="180" rx="130" ry="48"/><ellipse cx="890" cy="196" rx="80" ry="30"/>
  </g>
  <circle cx="1010" cy="120" r="56" fill="#ffe08a" opacity=".85"/>
  <path d="M0 620c150-60 300-20 460 10s320 20 480-30 260-20 260-20v220H0z" fill="#1f7a56" opacity=".7"/>
  <path d="M0 700c180-40 340 10 520 20s340-30 500-10 180 20 180 20v70H0z" fill="#176046"/>
  ${[90,300,900,1120].map((e,a)=>`<g transform="translate(${e} ${700-a%2*40}) scale(${1+a%2*.25})">
      <rect x="-8" y="-10" width="16" height="60" rx="8" fill="#6b4f36"/>
      <circle cx="0" cy="-34" r="42" fill="#2f9c5e"/>
      <circle cx="-28" cy="-12" r="28" fill="#3fae6a"/><circle cx="28" cy="-12" r="28" fill="#3fae6a"/>
      <circle cx="-6" cy="-56" r="24" fill="#57c47e" opacity=".9"/>
    </g>`).join("")}
</svg>`}function ps(){const e=Array.from({length:22},(a,s)=>{const t=40+s*54;return`<circle cx="${t}" cy="46" r="11" fill="#ffe08a" opacity=".9"/>
            <circle cx="${t}" cy="46" r="20" fill="#ffd166" opacity=".18"/>`}).join("");return`
<svg viewBox="0 0 1200 800" ${Vt} aria-hidden="true">
  <defs>
    <linearGradient id="bingoWall" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#2a1b6b"/><stop offset=".55" stop-color="#4b2fa8"/>
      <stop offset="1" stop-color="#7b4fd0"/>
    </linearGradient>
    <linearGradient id="bingoStageG" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#ff9a86"/><stop offset="1" stop-color="#e0553f"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="800" fill="url(#bingoWall)"/>
  <!-- radial rays -->
  <g opacity=".14" fill="#fff">
    ${Array.from({length:12},(a,s)=>{const t=s/12*Math.PI*2,i=t+.16,n=900;return`<path d="M600 360 L${600+Math.cos(t)*n} ${360+Math.sin(t)*n} L${600+Math.cos(i)*n} ${360+Math.sin(i)*n}z"/>`}).join("")}
  </g>
  ${e}
  <!-- curtains -->
  <path d="M0 0h230c-40 220-10 460 30 800H0z" fill="url(#bingoStageG)"/>
  <path d="M1200 0H970c40 220 10 460-30 800h260z" fill="url(#bingoStageG)"/>
  <g opacity=".25" stroke="#7a1f14" stroke-width="6">
    ${Array.from({length:5},(a,s)=>`<path d="M${40+s*42} 0c-20 260 0 520 20 800"/>`).join("")}
    ${Array.from({length:5},(a,s)=>`<path d="M${1160-s*42} 0c20 260 0 520-20 800"/>`).join("")}
  </g>
  <!-- stage floor -->
  <path d="M0 690h1200v110H0z" fill="#241a52"/>
  <ellipse cx="600" cy="700" rx="520" ry="60" fill="#ffd166" opacity=".12"/>
  <!-- floating stars -->
  ${[[180,250,1],[1030,300,.8],[300,560,.6],[920,590,.7]].map(([a,s,t])=>`<g transform="translate(${a} ${s}) scale(${t})" opacity=".5">
          <path d="m0-26 8 17 18 3-13 13 3 18-16-9-16 9 3-18-13-13 18-3z" fill="#ffd166"/></g>`).join("")}
</svg>`}function ys(){return`
<svg viewBox="0 0 200 260" class="fighter fighter--hero" role="img" aria-label="Bantay, the Safe Squad hero">
  <defs>
    <linearGradient id="heroSuit" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#3fe0c8"/><stop offset="1" stop-color="#12a08f"/>
    </linearGradient>
  </defs>
  <ellipse class="shadow" cx="100" cy="248" rx="56" ry="10" fill="#06202a" opacity=".25"/>
  <g class="fighter__body">
    <!-- legs -->
    <rect x="74" y="188" width="20" height="54" rx="10" fill="#2a3a5c"/>
    <rect x="106" y="188" width="20" height="54" rx="10" fill="#2a3a5c"/>
    <rect x="68" y="232" width="32" height="14" rx="7" fill="#1c2740"/>
    <rect x="100" y="232" width="32" height="14" rx="7" fill="#1c2740"/>
    <!-- torso -->
    <path d="M66 126c0-20 15-32 34-32s34 12 34 32v50c0 12-15 18-34 18s-34-6-34-18z"
          fill="url(#heroSuit)" stroke="#0b7a6d" stroke-width="5"/>
    <path d="M100 100 118 108v18c0 12-8 18-18 22-10-4-18-10-18-22v-18z" fill="#ffd166" stroke="#e0a92a" stroke-width="4"/>
    <!-- arms -->
    <g class="fighter__arm-back">
      <path d="M70 138c-16 4-24 18-22 34" stroke="#f7c9a5" stroke-width="16" stroke-linecap="round" fill="none"/>
    </g>
    <g class="fighter__arm-front">
      <path d="M130 138c16 4 24 18 22 34" stroke="#f7c9a5" stroke-width="16" stroke-linecap="round" fill="none"/>
    </g>
    <!-- head -->
    <g class="fighter__head">
      <circle cx="100" cy="66" r="38" fill="#f7c9a5"/>
      <path d="M62 62a38 38 0 0 1 76 0c-8-14-20-20-38-20s-30 6-38 20z" fill="#2f2320"/>
      <path d="M62 62c-4-26 14-44 38-44s42 18 38 44c-4-8-10-12-14-12-8 8-40 10-48 2-6 0-12 4-14 10z" fill="#3b2b28"/>
      <!-- eyes -->
      <ellipse class="eye" cx="86" cy="66" rx="9" ry="10" fill="#fff"/>
      <ellipse class="eye" cx="114" cy="66" rx="9" ry="10" fill="#fff"/>
      <circle class="pupil" cx="87" cy="68" r="5.4" fill="#25303f"/>
      <circle class="pupil" cx="115" cy="68" r="5.4" fill="#25303f"/>
      <circle cx="85" cy="65" r="2" fill="#fff"/>
      <circle cx="113" cy="65" r="2" fill="#fff"/>
      <ellipse class="blush" cx="74" cy="80" rx="8" ry="5.5" fill="#ff9a86" opacity=".7"/>
      <ellipse class="blush" cx="126" cy="80" rx="8" ry="5.5" fill="#ff9a86" opacity=".7"/>
      <!-- expressions -->
      <path class="mouth mouth--happy" d="M90 84c6 7 14 7 20 0" stroke="#8a4a3a" stroke-width="4.4" fill="none" stroke-linecap="round"/>
      <path class="mouth mouth--determined" d="M88 86h24" stroke="#8a4a3a" stroke-width="4.6" fill="none" stroke-linecap="round"/>
      <ellipse class="mouth mouth--hurt" cx="100" cy="88" rx="10" ry="8" fill="#8a4a3a"/>
      <g class="brow brow--calm">
        <path d="M78 52c5-4 12-4 16-1" stroke="#2f2320" stroke-width="4" stroke-linecap="round" fill="none"/>
        <path d="M106 51c4-3 11-3 16 1" stroke="#2f2320" stroke-width="4" stroke-linecap="round" fill="none"/>
      </g>
      <g class="brow brow--hurt">
        <path d="M78 48c5 1 12 5 16 9" stroke="#2f2320" stroke-width="4" stroke-linecap="round" fill="none"/>
        <path d="M122 48c-5 1-12 5-16 9" stroke="#2f2320" stroke-width="4" stroke-linecap="round" fill="none"/>
      </g>
    </g>
  </g>
</svg>`}function gs(){return`
<svg viewBox="0 0 200 260" class="fighter fighter--rival" role="img" aria-label="Grumble, the cartoon rival">
  <defs>
    <linearGradient id="rivalBody" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#9b7dff"/><stop offset="1" stop-color="#5b41d8"/>
    </linearGradient>
  </defs>
  <ellipse class="shadow" cx="100" cy="248" rx="60" ry="11" fill="#06202a" opacity=".25"/>
  <g class="fighter__body">
    <!-- feet -->
    <ellipse cx="74" cy="236" rx="22" ry="12" fill="#4a34b8"/>
    <ellipse cx="126" cy="236" rx="22" ry="12" fill="#4a34b8"/>
    <!-- body blob -->
    <path d="M100 62c40 0 62 34 62 84 0 52-28 84-62 84s-62-32-62-84c0-50 22-84 62-84z"
          fill="url(#rivalBody)" stroke="#3f2ba3" stroke-width="5"/>
    <!-- horns -->
    <path d="M62 74c-10-14-8-30 2-38 6 12 12 20 18 24z" fill="#c9b3ff" stroke="#3f2ba3" stroke-width="4"/>
    <path d="M138 74c10-14 8-30-2-38-6 12-12 20-18 24z" fill="#c9b3ff" stroke="#3f2ba3" stroke-width="4"/>
    <!-- arms -->
    <g class="fighter__arm-back">
      <path d="M44 150c-14 8-18 22-14 36" stroke="#7b61ff" stroke-width="18" stroke-linecap="round" fill="none"/>
    </g>
    <g class="fighter__arm-front">
      <path d="M156 150c14 8 18 22 14 36" stroke="#7b61ff" stroke-width="18" stroke-linecap="round" fill="none"/>
    </g>
    <!-- belly -->
    <ellipse cx="100" cy="176" rx="34" ry="40" fill="#c9b3ff" opacity=".5"/>
    <!-- face -->
    <g class="fighter__head">
      <ellipse class="eye" cx="82" cy="112" rx="15" ry="17" fill="#fff"/>
      <ellipse class="eye" cx="120" cy="112" rx="15" ry="17" fill="#fff"/>
      <circle class="pupil" cx="84" cy="115" r="8" fill="#25303f"/>
      <circle class="pupil" cx="122" cy="115" r="8" fill="#25303f"/>
      <circle cx="81" cy="111" r="3" fill="#fff"/>
      <circle cx="119" cy="111" r="3" fill="#fff"/>
      <g class="brow brow--calm">
        <path d="M68 92c6-5 16-5 22-1" stroke="#3f2ba3" stroke-width="5" stroke-linecap="round" fill="none"/>
        <path d="M110 91c6-4 16-4 22 1" stroke="#3f2ba3" stroke-width="5" stroke-linecap="round" fill="none"/>
      </g>
      <g class="brow brow--hurt">
        <path d="M68 86c6 2 16 7 22 12" stroke="#3f2ba3" stroke-width="5" stroke-linecap="round" fill="none"/>
        <path d="M132 86c-6 2-16 7-22 12" stroke="#3f2ba3" stroke-width="5" stroke-linecap="round" fill="none"/>
      </g>
      <path class="mouth mouth--happy" d="M84 142c8 10 24 10 32 0z" fill="#2b1c66"/>
      <path class="mouth mouth--determined" d="M84 144h32" stroke="#2b1c66" stroke-width="6" stroke-linecap="round" fill="none"/>
      <ellipse class="mouth mouth--hurt" cx="100" cy="146" rx="16" ry="13" fill="#2b1c66"/>
      <path d="M88 138l6 6M112 138l-6 6" stroke="#fff" stroke-width="4" stroke-linecap="round"/>
    </g>
  </g>
</svg>`}function sa(e){return`
<svg viewBox="0 0 120 120" aria-hidden="true">
  <circle cx="60" cy="60" r="34" fill="${e==="hero"?"#5ef0d8":"#c9b3ff"}" opacity=".9"/>
  <circle cx="60" cy="60" r="22" fill="#fff" opacity=".85"/>
  <path d="M60 4l10 26 26-10-10 26 26 10-26 10 10 26-26-10-10 26-10-26-26 10 10-26L4 60l26-10-10-26 26 10z"
        fill="${e==="hero"?"#12a08f":"#5b41d8"}" opacity=".55"/>
</svg>`}function bs(){return`
<svg viewBox="0 0 100 100" aria-hidden="true">
  <defs>
    <linearGradient id="boxFace" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#5fd8ff"/><stop offset="1" stop-color="#2f9ae0"/>
    </linearGradient>
  </defs>
  <rect x="6" y="10" width="88" height="84" rx="16" fill="#1d5f96"/>
  <rect x="6" y="6" width="88" height="80" rx="16" fill="url(#boxFace)" stroke="#1d5f96" stroke-width="4"/>
  <path d="M6 40h88" stroke="#1d5f96" stroke-width="5" opacity=".5"/>
  <path d="M50 6v80" stroke="#1d5f96" stroke-width="5" opacity=".35"/>
  <circle cx="50" cy="40" r="12" fill="#ffd166" stroke="#e0a92a" stroke-width="4"/>
  <path d="M45 40h10M50 35v10" stroke="#8a6100" stroke-width="4" stroke-linecap="round"/>
</svg>`}function ia(e){return`
<svg viewBox="0 0 100 100" aria-hidden="true">
  <circle cx="50" cy="50" r="40" fill="${e?"#fff4d2":"#ffffff"}" opacity=".85"/>
  <path d="m50 14 11 23 25 4-18 18 4 25-22-12-22 12 4-25-18-18 25-4z" fill="${e?"#ffd166":"#ffe9a8"}" stroke="${e?"#e0a92a":"#d7b45c"}" stroke-width="5"
        stroke-linejoin="round"/>
  ${e?'<path d="m38 52 9 9 18-20" stroke="#0b7a6d" stroke-width="7" fill="none" stroke-linecap="round" stroke-linejoin="round"/>':""}
</svg>`}function ms(){return`
<svg viewBox="0 0 100 100" aria-hidden="true">
  <circle cx="50" cy="52" r="34" fill="#e8eef6" opacity=".7"/>
  <path d="M32 44c4-6 10-6 14 0M54 44c4-6 10-6 14 0" stroke="#8fa2bb" stroke-width="5" stroke-linecap="round" fill="none"/>
  <path d="M38 70c7-7 17-7 24 0" stroke="#8fa2bb" stroke-width="5" stroke-linecap="round" fill="none"/>
</svg>`}const Je=3;function ws(e){p.music("battle"),Be();const a=new lt,s=new ct({onBack:e.toHub,howTo:"hearts",total:Je}),t=new dt,i=new ht,n=new ft("hearts","top"),r=new pt("hearts","hearts"),h=new jt;let f=Je,c=Je,m=!1,k=!1;const Y=new rt,G=o("section",{class:"game hearts","aria-label":"Save Your Hearts battle game"});G.appendChild(He(ds(),"game__bg"));const l=He(ys(),"hearts__fighter hearts__fighter--hero"),ie=He(gs(),"hearts__fighter hearts__fighter--rival"),K=l.querySelector("svg"),x=ie.querySelector("svg"),W=He(sa("hero"),"hearts__burst"),$=o("div",{class:"hearts__row","aria-label":"Your hearts"}),Ce=o("div",{class:"hearts__row","aria-label":"Rival hearts"});function re(){const P=Je-c;s.setLabel(`Demon hearts ${c} / ${Je}`,P/Je)}function ce(){const P=(j,ae,v)=>{j.replaceChildren();for(let w=0;w<Je;w++){const M=w<ae,R=o("span",{class:`hearts__pip${M?"":" is-lost"}`,html:T("heart"),"aria-hidden":"true"});j.appendChild(R)}j.setAttribute("aria-label",`${v}: ${ae} of ${Je} hearts left`)};P($,f,"You"),P(Ce,c,"Demon"),re()}const F=o("div",{class:"hearts__arena"},o("div",{class:"hearts__side hearts__side--hero"},o("div",{class:"hearts__name",text:"BANTAY (You)"}),$,l),o("div",{class:"hearts__vs"},o("span",{text:"VS"})),o("div",{class:"hearts__side hearts__side--rival"},o("div",{class:"hearts__name",text:"GRUMBLE · DOUBT DEMON"}),Ce,ie),W),U=o("button",{class:"btn btn--sun hearts__ask",type:"button",html:`${T("question")}<span>See question</span>`,"aria-label":"Reopen the current question"});U.addEventListener("click",()=>{p.sfx("click"),h.reopen(),I()});const he=o("div",{class:"game__stage hearts__stage"},F,U);G.append(s.root,he,h.root,n.root,i.root,t.root);function I(){const P=!h.isOpen&&!m&&!k;U.classList.toggle("is-show",P),U.disabled=!P}function H(P,j){P.classList.remove("mood-calm","mood-determined","mood-hurt"),P.classList.add(`mood-${j}`)}async function N(P){const j=P==="hero"?K:x,ae=P==="hero"?x:K;W.innerHTML=sa(P),j.classList.add("is-attacking"),H(j,"determined"),p.sfx("attack"),W.classList.remove("is-flying-hero","is-flying-rival"),W.offsetWidth,W.classList.add(P==="hero"?"is-flying-hero":"is-flying-rival"),await kt(430),ae.classList.add("is-hit"),H(ae,"hurt"),p.sfx("hurt"),P==="hero"?c--:f--,ce(),(P==="hero"?Ce:$).classList.add("is-shaking"),await kt(620),j.classList.remove("is-attacking"),ae.classList.remove("is-hit"),W.classList.remove("is-flying-hero","is-flying-rival"),$.classList.remove("is-shaking"),Ce.classList.remove("is-shaking"),H(j,"calm"),H(ae,"calm")}function B(){m||(re(),h.ask(a.current,pe,{closable:!0,caption:`Question ${a.humanIndex} of ${a.total} · demon hearts ${c}`,onClose:()=>{i.show('Tap "See question" to bring the battle question back.',"plain",2400),I()}}),I())}async function pe(P){if(k)return;k=!0,I();const j=a.current;a.score(P),await kt(520),h.hide(),await N(P?"hero":"rival"),P?i.show("Direct hit! The demon loses a heart.","good",1600):(i.show("Ouch! You lose a heart.","bad",1600),n.maybeShow(a.wrong));const ae=f<=0||c<=0;t.show(P,P?"Correct — nice hit!":"Wrong — the demon strikes back",j.explanation,[{label:ae?"See the result":"Next attack",variant:P?"":"btn--coral",onClick:()=>{if(t.hide(),k=!1,ae){D();return}const v=()=>{a.next()?B():D()};!P&&r.register(a.wrong,v)||v()}}])}function D(){if(m)return;m=!0,I(),h.hide();const P=c<=0&&f>0;p.sfx(P?"victory":"defeat"),K.classList.toggle("is-winner",P),x.classList.toggle("is-winner",!P),H(P?K:x,"determined"),H(P?x:K,"hurt");const{correct:j,total:ae}=a.result();Y.after(()=>{G.appendChild(at({gameId:"hearts",gameTitle:"Save Your Hearts",correct:j,total:ae,title:P?void 0:"Game over",extraLine:P?`Demon defeated — you kept ${f} of ${Je} hearts!`:`The demon won this one. You landed ${Je-c} of ${Je} hits.`,message:a.completionMessage,categoryName:a.category.name,onReplay:()=>e.go("hearts"),onHub:e.toHub}))},900)}return ce(),H(K,"calm"),H(x,"calm"),I(),ut("Save Your Hearts","You and the doubt demon both start with 3 hearts. Every correct answer knocks a heart off the demon — every wrong answer costs you one. The battle runs until one of you is defeated, so there is no fixed number of questions!","hearts",()=>B()),{root:G,destroy:()=>{Y.clear(),r.dispose(),h.hide(),t.hide(),Be(),p.stopMusic()}}}function Ue(e,a,s,t,i,n){const r=Math.min(n,t/2,i/2);e.beginPath(),e.moveTo(a+r,s),e.arcTo(a+t,s,a+t,s+i,r),e.arcTo(a+t,s+i,a,s+i,r),e.arcTo(a,s+i,a,s,r),e.arcTo(a,s,a+t,s,r),e.closePath()}function At(e,a,s,t,i,n="#25303f"){e.fillStyle="#fff",e.beginPath(),e.ellipse(a-t*.34,s,t*.24,t*.28,0,0,Math.PI*2),e.ellipse(a+t*.34,s,t*.24,t*.28,0,0,Math.PI*2),e.fill(),e.fillStyle=n,e.beginPath(),e.arc(a-t*.34+i*t*.08,s+t*.04,t*.13,0,Math.PI*2),e.arc(a+t*.34+i*t*.08,s+t*.04,t*.13,0,Math.PI*2),e.fill()}function xs(e,a,s,t,i,n){const r=Math.sin(i*9)*t*.08;e.save(),e.translate(a,s+r),e.fillStyle="rgba(6,32,42,.28)",e.beginPath(),e.ellipse(0,t*.95-r,t*.8,t*.28,0,0,Math.PI*2),e.fill(),e.fillStyle="#ff6f61",e.beginPath(),e.ellipse(-n*t*.7,t*.1,t*.5,t*.22,Math.sin(i*9)*.3,0,Math.PI*2),e.fill(),e.fillStyle="#ffd166",e.strokeStyle="#e0a92a",e.lineWidth=Math.max(2,t*.14),e.beginPath(),e.arc(0,0,t,0,Math.PI*2),e.fill(),e.stroke(),e.fillStyle="#12a08f",e.beginPath(),e.arc(0,-t*.25,t*.92,Math.PI*1.08,Math.PI*1.92),e.fill(),At(e,0,t*.05,t,n,"#4a3405"),e.strokeStyle="#8a6100",e.lineWidth=Math.max(1.6,t*.1),e.lineCap="round",e.beginPath(),e.arc(0,t*.22,t*.34,.25*Math.PI,.75*Math.PI),e.stroke(),e.restore()}function ks(e,a,s,t,i,n="#ff6f61",r="#c9483c"){e.save(),e.translate(a,s),e.fillStyle="rgba(6,32,42,.28)",e.beginPath(),e.ellipse(0,t*.95,t*.8,t*.26,0,0,Math.PI*2),e.fill();const h=Math.sin(i*6)*t*.08;e.fillStyle=n,e.strokeStyle=r,e.lineWidth=Math.max(2,t*.14),e.beginPath(),e.moveTo(-t,t*.7),e.quadraticCurveTo(-t-h,-t*1.1,0,-t*1.05),e.quadraticCurveTo(t+h,-t*1.1,t,t*.7);for(let f=0;f<4;f++){const c=t-f*2*t/4;e.quadraticCurveTo(c-t*.25,t*(f%2?.45:.95),c-t*.5,t*.7)}e.closePath(),e.fill(),e.stroke(),At(e,0,-t*.2,t*1.05,0),e.strokeStyle=r,e.lineWidth=Math.max(1.6,t*.1),e.beginPath(),e.arc(0,t*.42,t*.3,1.2*Math.PI,1.8*Math.PI),e.stroke(),e.restore()}function oa(e,a,s,t,i){const n=i==="yes";e.save(),e.translate(a,s),e.fillStyle=n?"rgba(41,185,107,.28)":"rgba(239,75,94,.28)",e.beginPath(),e.arc(0,0,t*.95,0,Math.PI*2),e.fill(),e.fillStyle=n?"#29b96b":"#ef4b5e",e.strokeStyle=n?"#158a4c":"#c22a3c",e.lineWidth=Math.max(2,t*.14),Ue(e,-t*.72,-t*.6,t*1.44,t*1.05,t*.28),e.fill(),e.stroke(),e.fillStyle="#fff",e.font=`900 ${Math.round(t*.62)}px ui-rounded, system-ui, sans-serif`,e.textAlign="center",e.textBaseline="middle",e.fillText(n?"YES":"NO",0,-t*.05),e.restore()}function vs(e,a,s,t,i,n){const r=n.running&&n.grounded?Math.sin(n.t*14):0;e.save(),e.translate(a+t/2,s+i),n.invincible&&Math.floor(n.t*12)%2===0&&(e.globalAlpha=.45),e.scale(n.facing>=0?1:-1,1),e.fillStyle="rgba(6,32,42,.25)",e.beginPath(),e.ellipse(0,2,t*.5,i*.07,0,0,Math.PI*2),e.fill(),e.fillStyle="#2a3a5c";const h=i*.26;Ue(e,-t*.3+r*t*.16,-h,t*.24,h,t*.12),e.fill(),Ue(e,t*.06-r*t*.16,-h,t*.24,h,t*.12),e.fill(),e.fillStyle="#2fd6c0",e.strokeStyle="#0b7a6d",e.lineWidth=Math.max(2,t*.07),Ue(e,-t*.34,-i*.66,t*.68,i*.42,t*.22),e.fill(),e.stroke(),e.fillStyle="#ffd166",e.beginPath(),e.arc(0,-i*.45,t*.13,0,Math.PI*2),e.fill(),e.strokeStyle="#f7c9a5",e.lineWidth=t*.16,e.lineCap="round",e.beginPath(),e.moveTo(t*.18,-i*.58),e.lineTo(t*.34+(n.grounded?r*t*.1:t*.12),-i*.4-(n.grounded?0:i*.1)),e.stroke();const f=-i*.78;e.fillStyle="#f7c9a5",e.beginPath(),e.arc(0,f,t*.34,0,Math.PI*2),e.fill(),e.fillStyle="#2f2320",e.beginPath(),e.arc(0,f-t*.04,t*.34,Math.PI*1.05,Math.PI*2.05),e.fill(),e.fillStyle="#fff",e.beginPath(),e.ellipse(t*.12,f+t*.03,t*.09,t*.1,0,0,Math.PI*2),e.fill(),e.fillStyle="#25303f",e.beginPath(),e.arc(t*.14,f+t*.04,t*.05,0,Math.PI*2),e.fill(),e.strokeStyle="#8a4a3a",e.lineWidth=Math.max(1.5,t*.05),e.beginPath(),e.arc(t*.1,f+t*.18,t*.1,.1*Math.PI,.8*Math.PI),e.stroke(),e.restore()}function Ms(e,a,s,t,i,n){const r=1+Math.sin(n*8)*.06;e.save(),e.translate(a+t/2,s+i),e.fillStyle="rgba(6,32,42,.22)",e.beginPath(),e.ellipse(0,2,t*.46,i*.1,0,0,Math.PI*2),e.fill(),e.scale(1,r),e.fillStyle="#ff9a86",e.strokeStyle="#c9483c",e.lineWidth=Math.max(2,t*.08),e.beginPath(),e.ellipse(0,-i*.45,t*.46,i*.45,0,0,Math.PI*2),e.fill(),e.stroke(),e.fillStyle="#c9483c",e.beginPath(),e.ellipse(-t*.22,-i*.02,t*.16,i*.1,0,0,Math.PI*2),e.ellipse(t*.22,-i*.02,t*.16,i*.1,0,0,Math.PI*2),e.fill(),At(e,0,-i*.55,t*.9,0),e.restore()}function _s(e,a,s,t,i){const n=Math.sin(i*2.2)*t*.03;e.save(),e.translate(a,s+n);const r=t*.62;e.fillStyle="#ff8fb1",e.strokeStyle="#d3527c",e.lineWidth=Math.max(2,t*.035),e.beginPath(),e.moveTo(-r*.16,-t*.5),e.lineTo(r*.16,-t*.5),e.quadraticCurveTo(r*.55,-t*.06,r*.42,0),e.lineTo(-r*.42,0),e.quadraticCurveTo(-r*.55,-t*.06,-r*.16,-t*.5),e.closePath(),e.fill(),e.stroke(),e.fillStyle="#f7c9a5",e.beginPath(),e.arc(0,-t*.62,t*.16,0,Math.PI*2),e.fill(),e.fillStyle="#7a4a2a",e.beginPath(),e.arc(0,-t*.65,t*.17,Math.PI,Math.PI*2),e.fill(),e.beginPath(),e.ellipse(-t*.16,-t*.5,t*.06,t*.16,0,0,Math.PI*2),e.ellipse(t*.16,-t*.5,t*.06,t*.16,0,0,Math.PI*2),e.fill(),e.fillStyle="#ffd166",e.beginPath(),e.moveTo(-t*.12,-t*.74),e.lineTo(-t*.08,-t*.86),e.lineTo(-t*.02,-t*.76),e.lineTo(t*.03,-t*.88),e.lineTo(t*.08,-t*.76),e.lineTo(t*.12,-t*.86),e.lineTo(t*.14,-t*.74),e.closePath(),e.fill(),At(e,0,-t*.62,t*.34,0),e.strokeStyle="#b3564a",e.lineWidth=Math.max(1.4,t*.022),e.beginPath(),e.arc(0,-t*.56,t*.05,.15*Math.PI,.85*Math.PI),e.stroke(),e.restore()}function $s(e,a,s,t,i,n){const r=i?0:Math.sin(n*3)*t*.05;e.save(),e.translate(a,s+r),e.fillStyle=i?"#c9803c":"#ffd166",e.strokeStyle=i?"#8a5a22":"#e0a92a",e.lineWidth=Math.max(2,t*.08),Ue(e,0,0,t,t,t*.18),e.fill(),e.stroke(),e.fillStyle=i?"#8a5a22":"#e0a92a",[.18,.82].forEach(h=>[.18,.82].forEach(f=>{e.beginPath(),e.arc(t*h,t*f,t*.05,0,Math.PI*2),e.fill()})),i?(e.fillStyle="#ffd166",ua(e,t/2,t/2,t*.3,t*.14),e.fill()):(e.fillStyle="#8a6100",e.font=`900 ${Math.round(t*.62)}px ui-rounded, system-ui, sans-serif`,e.textAlign="center",e.textBaseline="middle",e.fillText("?",t/2,t*.56)),e.restore()}function ua(e,a,s,t,i){e.beginPath();for(let n=0;n<10;n++){const r=n%2===0?t:i,h=n/10*Math.PI*2-Math.PI/2,f=a+Math.cos(h)*r,c=s+Math.sin(h)*r;n===0?e.moveTo(f,c):e.lineTo(f,c)}e.closePath()}function Ss(e,a,s,t,i,n){e.save(),e.translate(a,s),e.strokeStyle="#8d6b4b",e.lineWidth=Math.max(2,t*.08),e.lineCap="round",e.beginPath(),e.moveTo(0,0),e.lineTo(0,-t),e.stroke();const r=i?Math.sin(n*5)*t*.06:0;e.fillStyle=i?"#2fd6c0":"#b9c4d4",e.beginPath(),e.moveTo(0,-t),e.quadraticCurveTo(t*.32,-t+r,t*.6,-t*.82),e.quadraticCurveTo(t*.32,-t*.72+r,0,-t*.62),e.closePath(),e.fill(),e.restore()}function Ts(e,a,s,t,i,n){e.save(),e.translate(a,s),e.fillStyle="#e6ecf5",e.strokeStyle="#b7c3d6",e.lineWidth=4,Ue(e,0,-i,t,i,8),e.fill(),e.stroke(),e.fillStyle="#7b61ff",e.beginPath(),e.moveTo(-8,-i),e.lineTo(t/2,-i-i*.28),e.lineTo(t+8,-i),e.closePath(),e.fill(),e.fillStyle=n?"#2b1c66":"#8d6b4b";const r=t*.44,h=i*.6;if(e.beginPath(),e.moveTo(t/2-r/2,0),e.lineTo(t/2-r/2,-h+r/2),e.arc(t/2,-h+r/2,r/2,Math.PI,0),e.lineTo(t/2+r/2,0),e.closePath(),e.fill(),!n){e.strokeStyle="#6b4f36",e.lineWidth=3;for(let f=1;f<4;f++)e.beginPath(),e.moveTo(t/2-r/2,-h*(f/4)),e.lineTo(t/2+r/2,-h*(f/4)),e.stroke();e.fillStyle="#ffd166",e.beginPath(),e.arc(t/2+r*.3,-h*.35,4,0,Math.PI*2),e.fill()}e.restore()}const Bt={cols:27,rows:15},zs={cols:15,rows:21},Cs=5.4,ra=2,Ne={up:{x:0,y:-1},down:{x:0,y:1},left:{x:-1,y:0},right:{x:1,y:0}};function Es(e){p.music("maze"),Be();const a=new lt,s=new ct({onBack:e.toHub,howTo:"maze",total:a.total}),t=new dt,i=new ht,n=new ft("maze","top"),r=new pt("maze","maze");let h=0,f=!1,c=!1;const m=new rt,k=o("section",{class:"game maze","aria-label":"Choose and Escape maze game"});k.appendChild(He(us(),"game__bg"));const Y=o("span",{class:"maze__topic"}),G=o("p",{class:"maze__statement"}),l=o("span",{class:"maze__answer",text:"Choose a portal to answer"}),ie=o("div",{class:"maze__target"},o("div",{class:"maze__strip"},Y,G),l,i.root),K=o("canvas",{class:"maze__canvas","aria-hidden":"true"}),x=K.getContext("2d"),W=o("div",{class:"maze__wrap"},K),$=(d,E,S)=>{const Q=o("button",{class:`maze__padbtn ${S}`,type:"button","aria-label":`Move ${d}`,html:E}),z=be=>{be.preventDefault(),ee=Ne[d]};return Q.addEventListener("pointerdown",z),Q.addEventListener("click",z),Q},Ce=o("div",{class:"maze__pad","aria-label":"Movement controls"},$("up",T("arrowLeft"),"is-up"),$("left",T("arrowLeft"),"is-left"),$("right",T("arrowRight"),"is-right"),$("down",T("arrowRight"),"is-down")),re=o("div",{class:"maze__status"}),ce=o("div",{class:"game__stage maze__stage"},ie,W,o("div",{class:"maze__footer"},re,Ce));k.append(s.root,ce,n.root,t.root);let F=[],U="",he=!0,I=Bt.cols,H=Bt.rows,N={c:I>>1,r:H-2},B={c:1,r:1},pe={c:I-2,r:1},D=[],P=7;function j(){const d=W.getBoundingClientRect(),S=d.height>d.width*1.05?zs:Bt;I=S.cols,H=S.rows;const Q=I%2?I>>1:(I>>1)-1,z=H%2?H>>1:(H>>1)-1;P=z%2===1?z:z+1,N={c:Q,r:H-2},B={c:1,r:1},pe={c:I-2,r:1};const be=Math.max(1,P-2),We=Math.min(H-2,P+2);D=[{c:Q,r:1},{c:1,r:be},{c:I-2,r:We}]}function ae(){j(),F=Array.from({length:H},()=>Array(I).fill(0));const d=[{c:1,r:H-2}];for(F[H-2][1]=1;d.length;){const S=d[d.length-1],Q=[{c:S.c+2,r:S.r},{c:S.c-2,r:S.r},{c:S.c,r:S.r+2},{c:S.c,r:S.r-2}].filter(be=>be.c>0&&be.c<I-1&&be.r>0&&be.r<H-1&&F[be.r][be.c]===0);if(!Q.length){d.pop();continue}const z=Q[Math.floor(Math.random()*Q.length)];F[(S.r+z.r)/2][(S.c+z.c)/2]=1,F[z.r][z.c]=1,d.push(z)}[N,B,pe,...D].forEach(S=>{F[S.r][S.c]=1});const E=Math.round(I*H/26);for(let S=0;S<E;S++){const Q=1+2*Math.floor(Math.random()*((H-1)/2)),z=2*(1+Math.floor(Math.random()*((I-3)/2)));F[Q][z]=1}F[1][2]=1,F[1][I-3]=1,F[2][1]=1,F[2][I-2]=1;for(let S=0;S<I;S++)F[P][S]=1;U=F.map(S=>S.join("")).join("|"),D.forEach(S=>{F[S.r][Math.max(1,S.c-1)]=1,F[Math.max(1,S.r-1)][S.c]=1}),ve()}const v=d=>(d%I+I)%I,w=(d,E)=>{var z;const S=v(Math.round(d)),Q=Math.round(E);return Q>=0&&Q<H&&((z=F[Q])==null?void 0:z[S])===1};let M={x:N.c,y:N.r},R=null,ee=null,ne=0,fe=ra,Te=0;const Me=[{body:"#ff6f61",edge:"#c9483c"},{body:"#c084ff",edge:"#7b3fd0"},{body:"#63c6ff",edge:"#2f7fbd"}],X=[3,2.7,2.4];let de=[];const Le=["chase","ambush","rove"];function Ge(){de=D.map((d,E)=>({x:d.c,y:d.r,dir:Ne.left,lastCell:"",speed:X[E%X.length],style:Le[E%Le.length],roveTarget:{c:d.c,r:d.r},roveIn:0,body:Me[E%Me.length].body,edge:Me[E%Me.length].edge,home:d}))}function je(d){const E=Math.round(M.x),S=Math.round(M.y);if(d.style==="chase")return{c:E,r:S};if(d.style==="ambush"){const z=R!=null?R:Ne.up;return{c:E+z.x*4,r:S+z.y*4}}return Math.hypot(E-d.x,S-d.y)<6?{c:E,r:S}:d.roveTarget}function Re(d){const E=Math.round(d.x),S=Math.round(d.y),Q=je(d),z=Object.values(Ne).filter(y=>w(E+y.x,S+y.y));if(!z.length)return d.dir;const be=z.filter(y=>!(y.x===-d.dir.x&&y.y===-d.dir.y)),We=be.length?be:z;let Ke=We[0],me=1/0;for(const y of We){const q=E+y.x,A=Math.min(Math.abs(Q.c-q),I-Math.abs(Q.c-q)),se=Q.r-(S+y.y),Z=Math.hypot(A,se)+Math.random()*.35;Z<me&&(me=Z,Ke=y)}return Ke}function Ae(){M={x:N.c,y:N.r},R=null,ee=null,ne=1.2,fe=ra,Ge(),de.forEach(d=>{d.lastCell=""})}function Ee(){if(f)return;const d=a.current;s.setProgress(a.humanIndex,a.total),G.textContent=d.question,Y.textContent=d.topic,he=Math.random()<.5,ae(),Ae(),L(),ie.classList.add("is-live"),ie.classList.remove("is-answered"),l.textContent="Choose a portal to answer",l.className="maze__answer",c=!0,i.show("Drive into the YES portal or the NO portal to answer!","plain",2600)}function it(d){c=!1,h++,p.sfx("hurt"),n.nudge(),t.show(!1,d,"Back to the entrance — read the statement again and pick your portal.",[{label:"Run again",variant:"btn--coral",onClick:()=>{t.hide();const E=()=>{Ae(),c=!0};r.register(h,E)||E()}}])}function Oe(d){if(!c||f)return;c=!1;const E=d==="left"===he?"YES":"NO",S=a.current,Q=$t(S,E);a.score(Q),p.sfx(Q?"correct":"wrong"),Q||(h++,n.nudge()),l.textContent=`You entered the ${E} portal`,l.className=`maze__answer ${E==="YES"?"is-yes":"is-no"}`,ie.classList.add("is-answered");const z=a.index>=a.total-1;t.show(Q,Q?`Correct — ${E} was the right answer!`:`Not quite — you chose ${E}, the answer was ${S.correct}`,S.explanation,[{label:z?"See my result":"Next maze",variant:Q?"":"btn--coral",onClick:()=>{t.hide();const be=()=>{a.next()?Ee():b()};!Q&&r.register(h,be)||be()}}])}function g(){!c||f||it("An enemy caught you!")}function b(){if(f)return;f=!0,c=!1,p.sfx("fanfare");const{correct:d,total:E}=a.result();k.appendChild(at({gameId:"maze",gameTitle:"Choose & Escape",correct:d,total:E,extraLine:"You escaped every maze!",message:a.completionMessage,categoryName:a.category.name,onReplay:()=>e.go("maze"),onHub:e.toHub}))}function L(){re.innerHTML=`<span class="maze__key maze__key--yes">YES</span> ${he?"left":"right"}
      · <span class="maze__key maze__key--no">NO</span> ${he?"right":"left"}
      <span class="maze__hint"> · 3 enemies chasing</span><span class="maze__hint maze__hint--tunnel"> · side tunnels wrap left ⇄ right</span>`}function V(){for(let d=0;d<60;d++){const E=1+Math.floor(Math.random()*(I-2)),S=1+Math.floor(Math.random()*(H-2));if(w(E,S))return{c:E,r:S}}return{c:1,r:1}}let te=0;function J(d,E,S,Q){if(!E)return d;let z=d.x+E.x*S*Q;const be=d.y+E.y*S*Q,We=Math.round(z+E.x*.5),Ke=Math.round(be+E.y*.5);return w(We,Ke)?(z<-.5?(z+=I,te++):z>I-.5&&(z-=I,te++),{x:z,y:be}):{x:Math.round(d.x),y:Math.round(d.y)}}const ye=d=>Math.abs(d.x-Math.round(d.x))<.08&&Math.abs(d.y-Math.round(d.y))<.08;let _=26,le=0,Se=0,ge=!0;function ve(){ge=!1;const d=Yt(),E=Math.max(1,W.clientWidth),S=Math.max(1,W.clientHeight),Q=Math.round(E*d),z=Math.round(S*d);(K.width!==Q||K.height!==z)&&(K.width=Q,K.height=z),K.style.width=`${E}px`,K.style.height=`${S}px`,x==null||x.setTransform(d,0,0,d,0,0),_=Math.max(6,Math.floor(Math.min(E/I,S/H))),le=Math.round((E-_*I)/2),Se=Math.round((S-_*H)/2)}function C(){var We,Ke;if(!x)return;const d=K.clientWidth,E=K.clientHeight;x.clearRect(0,0,d,E),x.fillStyle="#8fe0ad",Ue(x,le-6,Se-6,_*I+12,_*H+12,16),x.fill();for(let me=0;me<H;me++)for(let y=0;y<I;y++){const q=le+y*_,A=Se+me*_;((We=F[me])==null?void 0:We[y])===1?(x.fillStyle=(me+y)%2?"#f3e6c8":"#efe0bd",x.fillRect(q,A,_,_)):(x.fillStyle="#2f9c5e",Ue(x,q+1,A+1,_-2,_-2,_*.3),x.fill(),x.fillStyle="#57c47e",x.beginPath(),x.arc(q+_*.36,A+_*.34,_*.12,0,Math.PI*2),x.fill())}const S=Se+P*_+_/2;[le,le+_*I].forEach((me,y)=>{const q=x.createRadialGradient(me,S,_*.1,me,S,_*.9);q.addColorStop(0,"rgba(111,232,255,.85)"),q.addColorStop(1,"rgba(111,232,255,0)"),x.fillStyle=q,x.beginPath(),x.arc(me,S,_*.9,0,Math.PI*2),x.fill(),x.strokeStyle="#6fe8ff",x.lineWidth=Math.max(2,_*.09),x.beginPath(),x.arc(me,S,_*.42,y===0?Math.PI*.5:Math.PI*1.5,y===0?Math.PI*1.5:Math.PI*.5),x.stroke(),x.beginPath();const A=y===0?-1:1;for(let se=0;se<2;se++){const Z=me+A*(_*.12+se*_*.16);x.moveTo(Z-A*_*.08,S-_*.14),x.lineTo(Z,S),x.lineTo(Z-A*_*.08,S+_*.14)}x.stroke()});const Q=Se+B.r*_+_/2,z=le+(he?B.c:pe.c)*_+_/2,be=le+(he?pe.c:B.c)*_+_/2;if(oa(x,z,Q,_*.78,"yes"),oa(x,be,Q,_*.78,"no"),x.fillStyle="rgba(18,160,143,.25)",x.beginPath(),x.arc(le+N.c*_+_/2,Se+N.r*_+_/2,_*.42,0,Math.PI*2),x.fill(),de.forEach(me=>{ks(x,le+me.x*_+_/2,Se+me.y*_+_/2,_*.34,Te,me.body,me.edge)}),fe>0&&c){const me=le+_*I/2,y=Se+18;x.fillStyle="rgba(11,22,44,.72)",Ue(x,me-92,y-14,184,30,15),x.fill(),x.fillStyle="#ffd166",x.font="900 15px ui-rounded, system-ui, sans-serif",x.textAlign="center",x.textBaseline="middle",x.fillText(`Safe for ${Math.ceil(fe)}s…`,me,y+1)}xs(x,le+M.x*_+_/2,Se+M.y*_+_/2,_*.34,Te,((Ke=R==null?void 0:R.x)!=null?Ke:1)>=0?1:-1),ne>0&&(x.strokeStyle="rgba(255,255,255,.75)",x.lineWidth=3,x.beginPath(),x.arc(le+M.x*_+_/2,Se+M.y*_+_/2,_*.48,0,Math.PI*2),x.stroke())}const O=Nt(d=>{if(Te+=d,ge&&ve(),c&&!f){ne=Math.max(0,ne-d),fe=Math.max(0,fe-d),ee&&R&&ee.x===-R.x&&ee.y===-R.y&&(R=ee,ee=null),ye(M)&&(M.x=v(Math.round(M.x)),M.y=Math.round(M.y),ee&&w(M.x+ee.x,M.y+ee.y)?(R=ee,ee=null):R&&!w(M.x+R.x,M.y+R.y)&&(R=null)),M=J(M,R,Cs,d);{de.forEach(z=>{z.roveIn-=d,z.roveIn<=0&&(z.roveIn=3.5,z.roveTarget=V());const be=`${v(Math.round(z.x))},${Math.round(z.y)}`;ye(z)&&z.lastCell!==be&&(z.x=v(Math.round(z.x)),z.y=Math.round(z.y),z.dir=Re(z),z.lastCell=be),!w(Math.round(z.x)+z.dir.x,Math.round(z.y)+z.dir.y)&&ye(z)&&(z.dir=Re(z),z.lastCell=be);const Ke=Math.round(z.y)===P?z.speed*.45:z.speed,me=J({x:z.x,y:z.y},z.dir,Ke,d);z.x=me.x,z.y=me.y});const Q=de.some(z=>{const be=Math.min(Math.abs(z.x-M.x),I-Math.abs(z.x-M.x));return Math.hypot(be,z.y-M.y)<.62});ne<=0&&fe<=0&&Q&&g()}const E=Math.round(M.x),S=Math.round(M.y);S===B.r&&E===B.c?Oe("left"):S===pe.r&&E===pe.c&&Oe("right")}k.dataset.cell=`${Math.round(M.x)},${Math.round(M.y)}`,k.dataset.aligned=String(Math.abs(M.x-Math.round(M.x))<.001||Math.abs(M.y-Math.round(M.y))<.001),k.dataset.wraps=String(te),k.dataset.grid=`${I}x${H}`,k.dataset.tunnel=String(P),k.dataset.pos=`${M.x.toFixed(2)},${M.y.toFixed(2)}`,k.dataset.enemycount=String(de.length),k.dataset.enemies=de.map(E=>`${E.x.toFixed(1)}:${E.y.toFixed(1)}`).join("|"),k.dataset.mazegrid!==U&&(k.dataset.mazegrid=U),C()}),$e=et(window,"keydown",d=>{const E=d.key.toLowerCase(),S={arrowup:Ne.up,w:Ne.up,arrowdown:Ne.down,s:Ne.down,arrowleft:Ne.left,a:Ne.left,arrowright:Ne.right,d:Ne.right};S[E]&&(ee=S[E],d.preventDefault())});let ke=null;K.addEventListener("pointerdown",d=>{ke={x:d.clientX,y:d.clientY}}),K.addEventListener("pointercancel",()=>{ke=null}),K.addEventListener("pointerup",d=>{if(!ke)return;const E=d.clientX-ke.x,S=d.clientY-ke.y;ke=null,!(Math.hypot(E,S)<18)&&(ee=Math.abs(E)>Math.abs(S)?E>0?Ne.right:Ne.left:S>0?Ne.down:Ne.up)});const _e=et(window,"resize",()=>{ge=!0}),u=new ResizeObserver(()=>{ge=!0});return u.observe(W),ae(),Ae(),L(),G.textContent=a.current.question,Y.textContent=a.current.topic,s.setProgress(1,a.total),requestAnimationFrame(()=>ve()),ut("Choose & Escape","The maze starts straight away. Read the statement above the maze, then drive into the YES portal or the NO portal — the portal you enter is your answer. Three enemies are hunting you, so plan your route!","maze",()=>Ee()),{root:k,destroy:()=>{m.clear(),r.dispose(),t.hide(),Be(),O(),$e(),_e(),u.disconnect(),p.stopMusic()}}}const qs=2200,Ps=260,st=42,Ve=58,ue=460,Rt=3;function Ls(e){var ve;p.music("hero"),Be();const a=new lt,s=new ct({onBack:e.toHub,howTo:"princess",total:a.total}),t=new dt,i=new ht,n=new ft("princess","top"),r=new pt("princess","princess"),h=new jt,f=new URLSearchParams(location.search),c=f.has("assist"),m=Math.max(0,Math.min(2,(Number(f.get("level"))||1)-1));let k=Rt,Y=0,G=!1,l=!0,ie=0;const K=new rt,x=o("section",{class:"game princess","aria-label":"Save the Princess platform game"}),W=o("canvas",{class:"princess__canvas","aria-hidden":"true"}),$=W.getContext("2d");x.appendChild(o("div",{class:"princess__world"},W));const re=[{name:"Green Fields",width:2400,platforms:[{x:0,y:ue,w:760,h:120},{x:880,y:ue,w:620,h:120},{x:1620,y:ue,w:780,h:120},{x:380,y:350,w:180,h:26},{x:700,y:290,w:160,h:26},{x:1120,y:330,w:190,h:26},{x:1760,y:300,w:200,h:26}],critters:[{x:560,y:ue-40,w:46,h:40,from:470,to:690,dir:1,alive:!0},{x:1800,y:ue-40,w:46,h:40,from:1700,to:2100,dir:-1,alive:!0}],blocks:[{x:430,y:250,s:56,used:!1},{x:1180,y:220,s:56,used:!1}],checkpoints:[{x:120,y:ue,reached:!0},{x:1e3,y:ue,reached:!1}],gate:{x:2200,y:ue,w:120,h:170}},{name:"Cloud Steps",width:2600,platforms:[{x:0,y:ue,w:560,h:120},{x:700,y:ue,w:420,h:120},{x:1280,y:ue,w:500,h:120},{x:1920,y:ue,w:680,h:120},{x:330,y:330,w:160,h:26},{x:620,y:260,w:150,h:24},{x:900,y:330,w:170,h:26},{x:1360,y:300,w:190,h:26},{x:1640,y:240,w:150,h:24},{x:2050,y:320,w:190,h:26}],critters:[{x:820,y:ue-40,w:46,h:40,from:740,to:1080,dir:1,alive:!0},{x:1420,y:ue-40,w:46,h:40,from:1320,to:1740,dir:-1,alive:!0},{x:2200,y:ue-40,w:46,h:40,from:2e3,to:2400,dir:1,alive:!0}],blocks:[{x:660,y:170,s:56,used:!1},{x:1680,y:150,s:56,used:!1}],checkpoints:[{x:100,y:ue,reached:!0},{x:1340,y:ue,reached:!1}],gate:{x:2400,y:ue,w:120,h:170}},{name:"Castle Approach",width:3e3,platforms:[{x:0,y:ue,w:3e3,h:120},{x:300,y:320,w:170,h:26},{x:900,y:330,w:190,h:26},{x:1180,y:250,w:150,h:24},{x:1620,y:320,w:190,h:26},{x:1900,y:250,w:160,h:24},{x:2200,y:320,w:180,h:26}],critters:[{x:900,y:ue-40,w:46,h:40,from:800,to:1300,dir:1,alive:!0},{x:1700,y:ue-40,w:46,h:40,from:1520,to:1980,dir:-1,alive:!0},{x:2300,y:ue-40,w:46,h:40,from:2150,to:2500,dir:1,alive:!0}],blocks:[{x:1560,y:312,s:56,used:!1}],checkpoints:[{x:100,y:ue,reached:!0},{x:1520,y:ue,reached:!1}],gate:{x:2680,y:ue,w:130,h:190}}],ce=re.reduce((C,O)=>C+O.blocks.length,0);let F=0,U=re[0],he=U.platforms,I=U.critters,H=U.blocks,N=U.checkpoints,B=U.gate,pe=U.width;const D={x:2880,y:ue};function P(C){F=C,U=re[C],he=U.platforms,I=U.critters,H=U.blocks,N=U.checkpoints,B=U.gate,pe=U.width,j={x:90,y:ue-Ve},v.x=j.x,v.y=j.y,v.vx=0,v.vy=0,v.invincible=1.2,ae=0,ee()}let j={x:90,y:ue-Ve},ae=0;const v={x:90,y:ue-Ve,vx:0,vy:0,grounded:!0,facing:1,invincible:0};ae=0;const w={left:!1,right:!1,jump:!1},M=o("div",{class:"princess__lives","aria-label":"Lives"}),R=o("div",{class:"princess__stars"});function ee(){M.replaceChildren();for(let C=0;C<Rt;C++)M.appendChild(o("span",{class:`princess__life${C<k?"":" is-lost"}`,html:T("heart"),"aria-hidden":"true"}));M.setAttribute("aria-label",`${k} of ${Rt} hearts left`),R.innerHTML=`${T("flag")}<span>Level ${F+1}/${re.length}</span>${T("star")}<span>${Y} / ${ce}</span>`,s.setLabel(`Level ${F+1} of ${re.length} · ${Y}/${ce} stars`,Y/ce)}const ne=(C,O,$e,ke)=>{const _e=o("button",{class:`princess__btn ${$e}`,type:"button","aria-label":ke,html:C}),u=E=>{E.preventDefault(),w[O]=!0,O==="jump"&&Me(),_e.classList.add("is-down")},d=()=>{w[O]=!1,_e.classList.remove("is-down")};return _e.addEventListener("pointerdown",u),_e.addEventListener("pointerup",d),_e.addEventListener("pointerleave",d),_e.addEventListener("pointercancel",d),_e},fe=o("div",{class:"princess__controls"},o("div",{class:"princess__dpad"},ne(T("arrowLeft"),"left","is-left","Move left"),ne(T("arrowRight"),"right","is-right","Move right")),ne("<span>JUMP</span>","jump","is-jump","Jump")),Te=o("div",{class:"princess__status"},M,R);x.append(s.root,Te,fe,h.root,n.root,i.root,t.root);function Me(){l||G||v.grounded&&(v.vy=-900,v.grounded=!1,p.sfx("jump"))}function X(){v.x=j.x,v.y=j.y,v.vx=0,v.vy=0,v.invincible=1.4,ae=ze(v.x-L()*.35,0,Math.max(0,pe-L()))}function de(C){if(!(l||G||v.invincible>0)){if(c){p.sfx("pop"),i.show(`${C} — assist mode: back to the checkpoint`,"plain",1600),X();return}if(k--,ee(),p.sfx("hurt"),l=!0,k<=0){Ge();return}i.show(`${C} — ${k} ${k===1?"heart":"hearts"} left`,"bad",2e3),K.after(()=>{X(),l=!1},700)}}function Le(){if(G)return;l=!0,p.sfx("victory");const C=re[F+1].name;t.show(!0,`Level ${F+1} complete — ${U.name} cleared!`,`Great work. Next up: ${C}. Your lives and stars carry over.`,[{label:"Enter the next level",onClick:()=>{t.hide(),P(F+1),l=!1}}])}function Ge(){if(G)return;G=!0,l=!0,p.sfx("defeat");const{correct:C,total:O}=a.result();x.appendChild(at({gameId:"princess",gameTitle:"Save the Princess",correct:C,total:O,title:"Game over",extraLine:`Out of hearts on level ${F+1}! You collected ${Y} of ${ce} stars.`,message:a.completionMessage,categoryName:a.category.name,onReplay:()=>e.go("princess"),onHub:e.toHub}))}function je(){if(G)return;G=!0,l=!0,p.sfx("victory");const{correct:C,total:O}=a.result();x.appendChild(at({gameId:"princess",gameTitle:"Save the Princess",correct:C,total:O,extraLine:`You cleared all ${re.length} levels and rescued the princess!`,message:a.completionMessage,categoryName:a.category.name,onReplay:()=>e.go("princess"),onHub:e.toHub}))}let Re=null;const Ae=o("button",{class:"btn btn--sun princess__see",type:"button",html:`${T("question")}<span>See Q&amp;A</span>`,"aria-label":"Reopen the current question"});Ae.addEventListener("click",()=>{p.sfx("click"),h.reopen(),Ee()}),x.appendChild(Ae);function Ee(){const C=!!Re&&!h.isOpen&&!G;Ae.classList.toggle("is-show",C),Ae.disabled=!C}function it(C){C.used||Re||G||(Re=C,l=!0,p.sfx("boxOpen"),s.setProgress(a.humanIndex,a.total),h.ask(a.current,O=>Oe(O,C),{closable:!0,caption:`Question block ${Y+1} of ${ce}`,onClose:()=>{i.show('Tap "See Q&A" to answer the block question.',"plain",2400),Ee()}}),Ee())}function Oe(C,O){a.score(C),K.after(()=>{if(h.hide(),C){O.used=!0,Y++,ee(),p.sfx("coin");const $e=H.every(ke=>ke.used);i.show(`Star ${Y} of ${ce}!${$e?" The gate of this level is open!":""}`,"good",2e3),t.show(!0,"Correct — the block turns into a star",a.current.explanation,[{label:Y===H.length?"Head for the gate":"Keep going",onClick:()=>{t.hide(),Re=null,Ee(),a.next(),l=!1}}])}else{const $e=a.current;n.nudge(),t.show(!1,`Wrong answer — that costs a heart (the answer was ${$e.correct})`,`${$e.explanation} You will restart from the last checkpoint and can hit the block again.`,[{label:"Back to checkpoint",variant:"btn--coral",onClick:()=>{t.hide(),Re=null,Ee();const ke=()=>{if(c){X(),l=!1;return}if(k--,ee(),k<=0){Ge();return}p.sfx("hurt"),X(),l=!1};r.register(a.wrong,ke)||ke()}}])}},480)}function g(C){if(l||G)return;ie+=C,v.invincible=Math.max(0,v.invincible-C);const O=(w.right?1:0)-(w.left?1:0);v.vx=O*Ps,O!==0&&(v.facing=O),w.jump&&v.grounded&&Me(),v.x=ze(v.x+v.vx*C,0,pe-st),v.vy+=qs*C;const $e=v.y+v.vy*C;v.grounded=!1;for(const u of he)v.x+st>u.x+4&&v.x<u.x+u.w-4&&(v.vy>=0&&v.y+Ve<=u.y+6&&$e+Ve>=u.y?(v.y=u.y-Ve,v.vy=0,v.grounded=!0):v.vy<0&&v.y>=u.y+u.h-6&&$e<=u.y+u.h&&(v.y=u.y+u.h,v.vy=40));if(v.grounded||(v.y=v.vy===0?v.y:$e),v.y>ue+260){de("You fell");return}for(const u of I)if(!(!u.alive||(u.x+=u.dir*70*C,u.x<u.from&&(u.x=u.from,u.dir=1),u.x>u.to&&(u.x=u.to,u.dir=-1),!(v.x+st-8>u.x&&v.x+8<u.x+u.w&&v.y+Ve>u.y&&v.y<u.y+u.h))))if(v.vy>120&&v.y+Ve<u.y+u.h*.7)u.alive=!1,v.vy=-900*.65,p.sfx("pop");else{de("A critter bumped you");return}for(const u of H){if(u.used)continue;if(v.x+st>u.x-6&&v.x<u.x+u.s+6&&v.y<u.y+u.s+10&&v.y+Ve>u.y-10){it(u);break}}for(const u of N)!u.reached&&v.x>u.x&&(u.reached=!0,j={x:u.x+10,y:ue-Ve},p.sfx("appear"),i.show("Checkpoint reached!","good",1400));const ke=H.every(u=>u.used),_e=F===re.length-1;if(v.x+st>B.x+6)if(ke){if(!_e){Le();return}}else{v.x=B.x-st+6;const u=H.filter(d=>!d.used).length;i.show(`The gate is locked — ${u} question block(s) left in this level.`,"plain",1600)}_e&&ke&&v.x+st>D.x-40&&je(),ae=ze(v.x-L()*.35,0,Math.max(0,pe-L()))}const b=()=>{const C=W.clientHeight||620,O=W.clientWidth||900;return ze(Math.min(C/620,O/430),.55,1.5)},L=()=>(W.clientWidth||900)/b();let V=!0;function te(){var d;V=!1;const C=(d=W.parentElement)!=null?d:x,O=Yt(),$e=Math.max(1,Math.floor(C.clientWidth||x.clientWidth)),ke=Math.max(1,Math.floor(C.clientHeight||x.clientHeight)),_e=Math.round($e*O),u=Math.round(ke*O);(W.width!==_e||W.height!==u)&&(W.width=_e,W.height=u),$==null||$.setTransform(O,0,0,O,0,0)}function J(){if(!$)return;const C=W.clientWidth,O=W.clientHeight,$e=b();$.clearRect(0,0,C,O);const ke=$.createLinearGradient(0,0,0,O);ke.addColorStop(0,"#5bc0ff"),ke.addColorStop(.55,"#9fe3ff"),ke.addColorStop(1,"#d9f6ea"),$.fillStyle=ke,$.fillRect(0,0,C,O),$.save(),$.fillStyle="rgba(255,255,255,.9)";for(let u=0;u<8;u++){const d=(u*520-ae*.25)%(C+700)-200,E=60+u%3*46;$.beginPath(),$.ellipse(d,E,62,26,0,0,Math.PI*2),$.ellipse(d+44,E+10,44,20,0,0,Math.PI*2),$.ellipse(d-44,E+12,38,18,0,0,Math.PI*2),$.fill()}$.fillStyle="#7ed99b";for(let u=0;u<8;u++){const d=(u*460-ae*.45)%(C+900)-250;$.beginPath(),$.ellipse(d,O*.72,240,120,0,0,Math.PI*2),$.fill()}$.restore(),$.save(),$.translate(0,O-620*$e),$.scale($e,$e),$.translate(-ae,0),$.fillStyle="#3f2d1f",$.fillRect(ae-60,ue,L()+120,900);for(const u of he){const d=Math.min(18,u.h*.4);$.fillStyle="#8d6b4b",Ue($,u.x,u.y,u.w,u.h,10),$.fill(),$.fillStyle="#57c47e",Ue($,u.x,u.y,u.w,d+6,10),$.fill(),$.fillStyle="rgba(0,0,0,.08)";for(let E=0;E<u.w;E+=60)$.fillRect(u.x+E+12,u.y+d+16,26,6)}N.forEach(u=>Ss($,u.x,u.y,78,u.reached,ie)),H.forEach(u=>$s($,u.x,u.y,u.s,u.used,ie)),I.forEach(u=>u.alive&&Ms($,u.x,u.y,u.w,u.h,ie));const _e=H.every(u=>u.used);Ts($,B.x,B.y,B.w,B.h,_e),F===re.length-1&&_s($,D.x,D.y,Ve*1.14,ie),vs($,v.x,v.y,st,Ve,{facing:v.facing,running:Math.abs(v.vx)>10,grounded:v.grounded,t:ie,invincible:v.invincible>0}),_e||($.fillStyle="rgba(11,22,44,.75)",Ue($,B.x-24,B.y-B.h-96,180,48,14),$.fill(),$.fillStyle="#ffd166",ua($,B.x+4,B.y-B.h-72,16,7),$.fill(),$.fillStyle="#fff",$.font="900 24px ui-rounded, system-ui, sans-serif",$.textAlign="left",$.textBaseline="middle",$.fillText(`${H.filter(u=>u.used).length} / ${H.length}`,B.x+28,B.y-B.h-70)),$.restore()}const ye=Nt(C=>{V&&te(),g(C),J()}),_=et(window,"keydown",C=>{const O=C.key.toLowerCase();(O==="arrowleft"||O==="a")&&(w.left=!0),(O==="arrowright"||O==="d")&&(w.right=!0),(O===" "||O==="arrowup"||O==="w")&&(w.jump=!0,Me(),C.preventDefault())}),le=et(window,"keyup",C=>{const O=C.key.toLowerCase();(O==="arrowleft"||O==="a")&&(w.left=!1),(O==="arrowright"||O==="d")&&(w.right=!1),(O===" "||O==="arrowup"||O==="w")&&(w.jump=!1)}),Se=et(window,"resize",()=>{V=!0}),ge=new ResizeObserver(()=>{V=!0});return ge.observe((ve=W.parentElement)!=null?ve:x),P(m),ee(),Ee(),te(),ut("Save the Princess","Three levels of running and jumping. Every ? block asks a YES/NO child-protection question: answer correctly to turn it into a star and open the level gate. A wrong answer, a fall or a critter costs one of your 3 hearts. Clear all three levels to save the princess.","princess",()=>{l=!1}),{root:x,destroy:()=>{K.clear(),r.dispose(),h.hide(),t.hide(),Be(),ye(),_(),le(),Se(),ge.disconnect(),p.stopMusic()}}}const Ie=5,na=Ie*Ie;function As(){const e=[];for(let a=0;a<Ie;a++)e.push({name:`Horizontal · row ${a+1}`,cells:Array.from({length:Ie},(s,t)=>a*Ie+t)});for(let a=0;a<Ie;a++)e.push({name:`Vertical · column ${a+1}`,cells:Array.from({length:Ie},(s,t)=>t*Ie+a)});return e.push({name:"Diagonal ↘",cells:[0,6,12,18,24]}),e.push({name:"Diagonal ↙",cells:[4,8,12,16,20]}),e}let la=null;function Is(){const a=As().filter(t=>t.name!==la),s=a[Math.floor(Math.random()*a.length)];return la=s.name,s}function Hs(e){p.music("bingo"),Be();const a=new lt,s=new ct({onBack:e.toHub,howTo:"bingo",total:Ie}),t=new dt,i=new ht,n=new ft("bingo","top"),r=new pt("bingo","bingo"),h=new jt;let f=0,c=!1,m=!1,k=null;const Y=new rt,G=o("section",{class:"game bingo","aria-label":"Bingo child protection game"});G.appendChild(He(ps(),"game__bg"));const l=Is(),ie=new Set(l.cells),K=new Set(l.cells),x=o("div",{class:"bingo__board",role:"grid","aria-label":`Bingo board, 5 by 5. Target pattern: ${l.name}`}),W=[];for(let w=0;w<na;w++){const M=o("div",{class:"bingo__face"});M.innerHTML=bs();const R=o("button",{class:"bingo__cell",type:"button",role:"gridcell","aria-label":`Closed box, row ${Math.floor(w/Ie)+1}, column ${w%Ie+1}`},M);R.addEventListener("click",()=>N(W[w])),x.appendChild(R),W.push({index:w,hasStar:K.has(w),inPattern:ie.has(w),state:"closed",node:R,face:M})}const $=o("div",{class:"bingo__mini is-hidden","aria-hidden":"true"});for(let w=0;w<na;w++)$.appendChild(o("span"));const Ce=o("span",{class:"bingo__count"}),re=o("button",{class:"btn btn--sun bingo__see",type:"button",html:`${T("question")}<span>See Q&amp;A</span>`,"aria-label":"Reopen the current question"});re.addEventListener("click",()=>{p.sfx("click"),k&&B(k),I()});const ce=o("aside",{class:"bingo__panel"},o("div",{class:"bingo__patterncard"},o("span",{class:"bingo__label",text:"Hidden pattern"}),o("strong",{class:"bingo__pattern",text:"Find the 5 hidden stars"}),$,Ce),re),F=o("div",{class:"game__stage bingo__stage"},o("div",{class:"bingo__layout"},o("div",{class:"bingo__boardwrap"},x),ce));G.append(s.root,F,h.root,n.root,i.root,t.root);const U=()=>W.filter(w=>w.inPattern&&w.state==="collected").length;function he(){Ce.textContent=`${U()} / ${Ie} stars collected`,s.setLabel(`Stars collected ${U()} / ${Ie}`,U()/Ie)}function I(){const w=!!k&&!h.isOpen&&!c;re.classList.toggle("is-show",w),re.disabled=!w}function H(w){W.forEach(M=>{M.node.disabled=!w||M.state!=="closed"})}async function N(w){if(!(m||c||k||w.state!=="closed")){if(m=!0,H(!1),w.node.classList.add("is-opening"),p.sfx("boxOpen"),await kt(320),w.node.classList.remove("is-opening"),!w.hasStar){w.state="empty",w.face.innerHTML=ms(),w.node.classList.add("is-empty"),w.node.setAttribute("aria-label",`Empty box, row ${Math.floor(w.index/Ie)+1}, column ${w.index%Ie+1}`),p.sfx("empty"),i.show("Empty box — nothing inside. Keep looking!","plain",1500),m=!1,H(!0),P();return}w.state="pending",w.face.innerHTML=ia(!1),w.node.classList.add("is-star"),p.sfx("coin"),w.node.setAttribute("aria-label","Star found — answer the question to collect it"),k=w,m=!1,await kt(340),B(w)}}function B(w){c||(he(),h.ask(a.current,M=>pe(M,w),{closable:!0,caption:`Star found! Answer to collect it · ${a.humanIndex} of ${a.total}`,onClose:()=>{i.show('The star is still locked — tap "See Q&A" to answer.',"plain",2400),I()}}),H(!1),I())}function pe(w,M){a.score(w),Y.after(()=>{if(h.hide(),w){M.state="collected",M.face.innerHTML=ia(!0),M.node.classList.remove("is-star"),M.node.classList.add("is-collected"),M.node.setAttribute("aria-label","Star collected"),k=null,p.sfx("correct"),D(M),he(),I();const ee=U()>=Ie;t.show(!0,M.inPattern?"Star collected — pattern progress!":"Bonus star collected",a.current.explanation,[{label:ee?"See my result":"Keep playing",onClick:()=>{t.hide(),a.next(),he(),ee?v():H(!0)}}]);return}f++;const R=a.current;n.nudge(),p.sfx("wrong"),t.show(!1,`Not quite — the star stays locked (the answer was ${R.correct})`,`${R.explanation} Try the same question again.`,[{label:"Try again",variant:"btn--coral",onClick:()=>{t.hide();const ee=()=>B(M);r.register(f,ee)||ee()}}])},460)}function D(w){const M=w.node.getBoundingClientRect(),R=G.getBoundingClientRect(),ee=["#ffd166","#2fd6c0","#ff6f61","#7b61ff"];for(let ne=0;ne<10;ne++){const fe=document.createElement("span");fe.className="sparkle",fe.style.background=ee[ne%ee.length],fe.style.left=`${M.left-R.left+M.width/2}px`,fe.style.top=`${M.top-R.top+M.height/2}px`;const Te=ne/10*Math.PI*2;fe.style.setProperty("--dx",`${Math.cos(Te)*(36+Math.random()*34)}px`),fe.style.setProperty("--dy",`${Math.sin(Te)*(36+Math.random()*34)}px`),G.appendChild(fe),Y.after(()=>fe.remove(),700)}}function P(){W.some(M=>M.inPattern&&M.state==="empty")&&ae("One of the pattern squares turned out to be empty.")}function j(){const w=ce.querySelector(".bingo__pattern");w&&(w.textContent=l.name),$.classList.remove("is-hidden"),$.querySelectorAll("span").forEach((M,R)=>{M.classList.toggle("is-on",ie.has(R))})}function ae(w){if(c)return;c=!0,j(),H(!1),I(),p.sfx("defeat");const{correct:M,total:R}=a.result();G.appendChild(at({gameId:"bingo",gameTitle:"Bingo Game",correct:M,total:R,title:"Round over",extraLine:`${w} Tap "Play again" for a brand-new board and pattern.`,message:a.completionMessage,categoryName:a.category.name,onReplay:()=>e.go("bingo"),onHub:e.toHub}))}function v(){if(c)return;c=!0,H(!1),I(),p.sfx("victory"),x.classList.add("is-bingo"),W.filter(R=>R.inPattern).forEach(R=>R.node.classList.add("is-winline")),j();const{correct:w,total:M}=a.result();Y.after(()=>{G.appendChild(at({gameId:"bingo",gameTitle:"Bingo Game",correct:w,total:M,extraLine:`BINGO! You completed the "${l.name}" pattern.`,message:a.completionMessage,categoryName:a.category.name,onReplay:()=>e.go("bingo"),onHub:e.toHub}))},900)}return new URLSearchParams(location.search).has("qa")&&(G.dataset.stars=[...K].sort((w,M)=>w-M).join(","),G.dataset.pattern=l.name),he(),H(!1),I(),ut("Bingo Game","Twenty-five closed boxes that all look the same. Break them open to hunt for the 5 hidden stars — each star only counts once you answer its YES/NO question correctly. The stars form a secret horizontal, vertical or diagonal line: collect them all for a BINGO!","bingo",()=>{H(!0),i.show("Tap any box to break it open — the 5 stars are hidden!","plain",3e3)}),{root:G,destroy:()=>{Y.clear(),r.dispose(),h.hide(),t.hide(),Be(),p.stopMusic()}}}function Bs(){const e=document.getElementById("app");if(!e){console.error("[SAFE SQUAD] #app container missing");return}za();const a=new Ca(e);a.register("hub",rs),a.register("babyCry",cs),a.register("puzzle",hs),a.register("factFall",fs),a.register("hearts",ws),a.register("maze",Es),a.register("princess",Ls),a.register("bingo",Hs),a.start("hub"),window.addEventListener("hashchange",()=>{const t=location.hash.slice(1);["hub","babyCry","puzzle","factFall","hearts","maze","princess","bingo"].includes(t)&&a.go(t)});const s=()=>document.documentElement.style.setProperty("--vh",`${window.innerHeight*.01}px`);s(),window.addEventListener("resize",s),window.addEventListener("orientationchange",()=>window.setTimeout(s,200))}window.addEventListener("error",e=>console.warn("[SAFE SQUAD] runtime error",e.error));window.addEventListener("unhandledrejection",e=>console.warn("[SAFE SQUAD] promise rejection",e.reason));Bs();
