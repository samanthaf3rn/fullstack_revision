(function(){
var D=window.DATA,$=function(s){return document.querySelector(s)},main=$('#main'),list=$('#list'),qi=$('#q');
var root=document.documentElement,done={};
try{done=JSON.parse(localStorage.getItem('done')||'{}')}catch(e){}
function save(){try{localStorage.setItem('done',JSON.stringify(done))}catch(e){}}
function esc(s){return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')}
var KW='const|let|var|function|return|if|else|for|while|new|require|module|exports|async|await|class|try|catch|finally|throw|import|from|export|default|switch|case|break|true|false|null|undefined|this|typeof|of|in|do|extends|static';
var RX=new RegExp('(\\/\\/.*|\\/\\*[\\s\\S]*?\\*\\/)|("(?:\\\\.|[^"\\\\\\n])*"|\'(?:\\\\.|[^\'\\\\\\n])*\'|`(?:\\\\.|[^`\\\\])*`)|\\b('+KW+')\\b|\\b(\\d+(?:\\.\\d+)?)\\b','g');
function hl(t){var o='',l=0,m;RX.lastIndex=0;while((m=RX.exec(t))){o+=esc(t.slice(l,m.index));var c=m[1]?'c':m[2]?'s':m[3]?'k':'n';o+='<span class="'+c+'">'+esc(m[0])+'</span>';l=RX.lastIndex}return o+esc(t.slice(l))}
// theme
function setTheme(t){root.dataset.theme=t;$('#theme').textContent=t==='dark'?'☀ Light':'☾ Dark';try{localStorage.setItem('theme',t)}catch(e){}}
$('#theme').onclick=function(){setTheme(root.dataset.theme==='dark'?'light':'dark')};setTheme(root.dataset.theme||'light');
$('#menu').onclick=function(){document.body.classList.toggle('open')};
// menu
function menu(){var h='';D.forEach(function(e){h+='<li><a href="#/'+e.n+'" data-n="'+e.n+'" class="'+(done[e.n]?'done':'')+'"><b>'+e.n+'</b><span>'+esc(e.title)+'</span></a></li>'});
h+='<li><a href="#/viva" data-n="viva"><b>?</b><span>Viva questions</span></a></li>';h+='<li><a href="#/ref" data-n="ref"><b>★</b><span>Quick command reference</span></a></li>';list.innerHTML=h;prog()}
function prog(){var c=Object.keys(done).filter(function(k){return done[k]}).length;$('#prog').textContent=c+' of '+D.length+' revised'}
// quick ref
var REF=[['Node basics','node -v · npm -v · node                      (REPL: .help .exit .editor, Ctrl+C twice)\nnode file.js\nnpm init -y\nnpm install express colors sequelize mysql2 cors\nnpm install --save-dev nodemon webpack webpack-cli\nnpx nodemon index.js'],
['Express skeleton','const express=require("express");\nconst app=express();\napp.use(express.json());\napp.use(express.static(path.join(__dirname,"public")));\napp.get("/",(req,res)=>res.send("hello"));\napp.listen(3000,()=>console.log("running on http://localhost:3000"));'],
['Request data','req.query.name      // ?name=x\nreq.params.id       // /user/:id\nreq.body            // POST JSON (needs express.json())\nres.send() · res.json() · res.status(404).send() · res.sendFile(path.join(__dirname,"views","a.html"))'],
['Sequelize CLI','npm install sequelize sequelize-cli mysql2\nnpx sequelize-cli init\nnpx sequelize-cli model:generate --name Student --attributes name:string,age:integer\nnpx sequelize-cli db:migrate\nnpx sequelize-cli db:migrate:undo'],
['React (Vite)','npm create vite@latest myapp -- --template react\ncd myapp && npm install && npm run dev\nnpm install react-router-dom redux react-redux @reduxjs/toolkit']];
function ref(){main.innerHTML='<h1>Quick command reference</h1><div class="meta">Standard setup commands for the practical. Your journal’s own versions are in the experiments.</div>'+REF.map(function(r){return '<h2>'+r[0]+'</h2><div class="pg"><pre>'+esc(r[1])+'</pre></div>'}).join('')}
// experiment page
function view(n,q){var e=D[n-1];if(!e)return home();var N=window.NOTES[n-1]||['',[]],S=window.SNIP[n-1]||'';
var h='<h1>'+e.n+'. '+esc(e.title)+'</h1><div class="meta"><span>Journal page '+e.page+'</span><button id="dn">'+(done[n]?'\u2713 Revised':'Mark as revised')+'</button></div>';
h+='<div class="card"><h2>Understanding</h2><p>'+esc(N[0])+'</p></div><h2>Syntax snippet</h2><section class="pg"><h3><span>Key syntax</span><button class="cp">Copy</button></h3><pre>'+hl(S)+'</pre></section>';
var pg='';e.pages.forEach(function(p){if(p.t)pg+='<section class="pg"><h3><span>Page '+p.p+'</span><button class="cp">Copy</button></h3><pre>'+hl(p.t)+'</pre></section>'});
h+='<details class="jc"'+(q?' open':'')+'><summary><b>Full journal code</b> (optional)</summary>'+pg+'</details>';
h+='<div class="pn">'+(n>1?'<a href="#/'+(n-1)+'">\u2190 '+esc(D[n-2].title)+'</a>':'<span></span>')+(n<D.length?'<a href="#/'+(n+1)+'">'+esc(D[n].title)+' \u2192</a>':'')+'</div>';
main.innerHTML=h;
$('#dn').onclick=function(){done[n]=!done[n];save();this.textContent=done[n]?'\u2713 Revised':'Mark as revised';menu();act(n)};
main.querySelectorAll('.cp').forEach(function(b){b.onclick=function(){var t=b.closest('.pg').querySelector('pre').textContent;(navigator.clipboard?navigator.clipboard.writeText(t):Promise.reject()).catch(function(){}).then(function(){b.textContent='Copied';setTimeout(function(){b.textContent='Copy'},1200)})}});
if(q)mark(q)}
function viva(q){var ts=(q||'').toLowerCase().split(/\s+/).filter(Boolean),c=0,b='';
D.forEach(function(e){var N=window.NOTES[e.n-1];if(!N)return;var s='';N[1].forEach(function(x){var p=x.split('||'),t=(e.title+' '+x).toLowerCase();if(ts.every(function(w){return t.indexOf(w)>-1})){c++;s+='<details class="pg"'+(ts.length?' open':'')+'><summary style="padding:.6rem .9rem;cursor:pointer">'+esc(p[0])+'</summary><p style="margin:0;padding:.2rem .9rem .8rem">'+esc(p[1])+'</p></details>'}});if(s)b+='<h2>'+e.n+'. '+esc(e.title)+'</h2>'+s});
main.innerHTML='<h1>Viva questions</h1><div class="meta">'+c+' questions'+(q?' matching \u201c'+esc(q)+'\u201d':' \u00b7 tap a question to reveal the answer')+'</div>'+(b||'<p>No matches.</p>')+(q?'<p><a href="#/viva">Show all questions</a></p>':'');if(q)mark(q)}
function mark(q){var ts=q.toLowerCase().split(/\s+/).filter(Boolean);if(!ts.length)return;var re=new RegExp('('+ts.map(function(t){return t.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')}).join('|')+')','gi');
var w=document.createTreeWalker(main,NodeFilter.SHOW_TEXT),a=[],x;while((x=w.nextNode()))a.push(x);
a.forEach(function(t){if(t.parentNode.closest('button')||!re.test(t.data))return;re.lastIndex=0;var s=document.createElement('span');s.innerHTML=esc(t.data).replace(re,'<mark>$1</mark>');t.parentNode.replaceChild(s,t)});
var f=main.querySelector('mark');if(f)f.scrollIntoView({block:'center'})}
// search
var IDX=D.map(function(e){var N=window.NOTES[e.n-1]||['',[]];return {e:e,t:(e.title+'\n'+N[0]+'\n'+(window.SNIP[e.n-1]||'')+'\n'+e.pages.map(function(p){return p.t}).join('\n')).toLowerCase(),r:e.pages.map(function(p){return p.t}).join('\n')}});
function search(q){var ts=q.toLowerCase().split(/\s+/).filter(Boolean),r=[];
IDX.forEach(function(x){if(!ts.every(function(t){return x.t.indexOf(t)>-1}))return;
var lines=x.r.split('\n'),hit=[],i;for(i=0;i<lines.length&&hit.length<4;i++){var l=lines[i].toLowerCase();if(ts.some(function(t){return l.indexOf(t)>-1}))hit.push(lines[i].trim())}
r.push({e:x.e,s:hit,ti:ts.every(function(t){return x.e.title.toLowerCase().indexOf(t)>-1})})});
r.sort(function(a,b){return b.ti-a.ti});
var h='<h1>Search: “'+esc(q)+'”</h1><div class="meta">'+r.length+' experiment'+(r.length===1?'':'s')+' match</div>';
if(!r.length)h+='<p>No matches. Try fewer words, or a function name like <code>createServer</code>.</p>';
h+='<ul class="res">'+r.map(function(m){return '<li><a href="#/'+m.e.n+'?q='+encodeURIComponent(q)+'">'+m.e.n+'. '+esc(m.e.title)+'</a>'+(m.s.length?'<pre>'+esc(m.s.join('\n'))+'</pre>':'')+'</li>'}).join('')+'</ul>';
var vc=0;D.forEach(function(e){var N=window.NOTES[e.n-1];if(N)N[1].forEach(function(x){var t=(e.title+' '+x).toLowerCase();if(ts.every(function(w){return t.indexOf(w)>-1}))vc++})});if(vc)h+='<p><a href="#/viva?q='+encodeURIComponent(q)+'">'+vc+' viva question'+(vc>1?'s':'')+' match \u2192</a></p>';main.innerHTML=h;mark(q)}
function home(){var c=D.length;main.innerHTML='<h1>Full Stack Development – Practical Revision</h1><div class="meta">Built from your e-journal \u00b7 '+c+' experiments · works offline</div><div class="card"><h2>How to use</h2><p>Pick an experiment from the menu (same order as your index), or search any code, keyword or command. Each topic has a short explanation and a syntax snippet; all viva questions are together in one <a href="#/viva">Viva section</a>. the full journal code is tucked away if you need it. Tick “Mark as revised” to track progress.</p><p>Shortcuts: <b>/</b> focuses search, <b>←</b> <b>→</b> move between experiments.</p><p><a href="#/1">Start with experiment 1 →</a> · <a href="#/ref">Quick command reference</a></p></div>'}
function act(n){list.querySelectorAll('a').forEach(function(a){a.classList.toggle('on',a.dataset.n==n)})}
function route(){var m=location.hash.slice(1).split('?'),p=m[0].replace(/^\//,''),q=new URLSearchParams(m[1]||'').get('q');document.body.classList.remove('open');
if(p==='viva')viva(q);else if(p==='ref')ref();else if(p==='search')search(q||'');else if(/^\d+$/.test(p))view(+p,q);else home();
act(p);if(!q)window.scrollTo(0,0)}
var tm;qi.oninput=function(){clearTimeout(tm);tm=setTimeout(function(){var v=qi.value.trim();if(v){history.replaceState(null,'','#/search?q='+encodeURIComponent(v));route()}else{location.hash='#/'}},200)};
document.addEventListener('keydown',function(e){var tag=(e.target.tagName||'');if(e.key==='/'&&tag!=='INPUT'){e.preventDefault();qi.focus()}
if(tag==='INPUT')return;var n=+location.hash.replace(/^#\/(\d+).*/,'$1');if(n&&e.key==='ArrowRight'&&n<D.length)location.hash='#/'+(n+1);if(n&&e.key==='ArrowLeft'&&n>1)location.hash='#/'+(n-1)});
var z=document.createElement('div');z.id='zoom';z.innerHTML='<img alt="">';document.body.appendChild(z);
document.addEventListener('click',function(e){if(e.target.matches('.pg img')){z.firstChild.src=e.target.src;z.classList.add('on')}else if(z.contains(e.target))z.classList.remove('on')});
document.addEventListener('keydown',function(e){if(e.key==='Escape')z.classList.remove('on')});
window.onhashchange=route;menu();route();
if('serviceWorker' in navigator&&location.protocol.indexOf('http')===0)navigator.serviceWorker.register('sw.js').catch(function(){});
})();
