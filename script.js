// 提示
const toast=document.getElementById('toast');let tt;
function say(t){toast.textContent=t;toast.classList.add('show');clearTimeout(tt);tt=setTimeout(()=>toast.classList.remove('show'),2200)}

// 手机菜单
const tg=document.querySelector('.nav-toggle'),menu=document.getElementById('menu');
tg.onclick=()=>{const o=menu.classList.toggle('open');tg.setAttribute('aria-expanded',o)};
menu.querySelectorAll('a').forEach(a=>a.onclick=()=>menu.classList.remove('open'));

// 导航高亮
const links=[...menu.querySelectorAll('a')];
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting)links.forEach(l=>l.classList.toggle('on',l.getAttribute('href')==='#'+e.target.id))}),{threshold:.5});
document.querySelectorAll('section[id]').forEach(s=>io.observe(s));

// 姜饼轮播
const slides=[...document.querySelectorAll('.slide')],dots=document.querySelector('.dots');
let cur=0,timer;
slides.forEach((_,i)=>{const d=document.createElement('i');d.onclick=()=>go(i);dots.appendChild(d)});
function go(i){cur=(i+slides.length)%slides.length;slides.forEach((s,k)=>s.classList.toggle('active',k===cur));[...dots.children].forEach((d,k)=>d.classList.toggle('on',k===cur));clearInterval(timer);timer=setInterval(()=>go(cur+1),5000)}
document.querySelector('.prev').onclick=()=>go(cur-1);
document.querySelector('.next').onclick=()=>go(cur+1);
document.querySelector('.more').onclick=()=>go(cur+1);
go(0);

// 下单
document.querySelectorAll('.order').forEach(b=>b.onclick=()=>say('已加入购物车：'+b.dataset.name+' 🎄'));

// 盲盒
const box=document.getElementById('box'),res=document.getElementById('boxResult');
const prizes=['🎉 限定圣诞杯套','🦌 隐藏款Lucky盲盒！','🍪 姜饼小挂件','⭐ 圣诞星星贴纸'];
box.onclick=()=>{box.classList.remove('open');void box.offsetWidth;box.classList.add('open');res.textContent='恭喜获得：'+prizes[Math.floor(Math.random()*prizes.length)]};

// 滤镜
const ex=document.getElementById('explore'),tip=document.getElementById('filterTip');
const flt=()=>{ex.classList.toggle('filtered');say(ex.classList.contains('filtered')?'圣诞滤镜已开启 ✨':'已关闭滤镜')};
tip.onclick=flt;tip.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();flt()}};

// 飘雪
const cv=document.getElementById('snow'),ctx=cv.getContext('2d');let W,H,fl=[];
function rs(){W=cv.width=innerWidth;H=cv.height=innerHeight;fl=Array.from({length:Math.min(90,W/10)},()=>({x:Math.random()*W,y:Math.random()*H,r:Math.random()*2.5+.8,v:Math.random()+.4,d:Math.random()*6}))}
addEventListener('resize',rs);rs();
(function draw(t){ctx.clearRect(0,0,W,H);ctx.fillStyle='rgba(255,255,255,.85)';fl.forEach(f=>{f.y+=f.v;f.x+=Math.sin(t/1000+f.d)*.5;if(f.y>H){f.y=-5;f.x=Math.random()*W}ctx.beginPath();ctx.arc(f.x,f.y,f.r,0,7);ctx.fill()});requestAnimationFrame(draw)})(0);

/* ================= v2 新增 ================= */
const $=id=>document.getElementById(id);

// 自动找图：依次尝试 assets/名字.png/.webp/.jpg/.jpeg，找不到返回 null
const EXTS=['png','webp','jpg','jpeg'];
function findAsset(name){return new Promise(ok=>{let i=0;(function next(){if(i>=EXTS.length)return ok(null);const u=`assets/${name}.${EXTS[i++]}`,im=new Image();im.onload=()=>ok(u);im.onerror=next;im.src=u})()})}

// 图片槽位 data-img="名字"
document.querySelectorAll('[data-img]').forEach(async el=>{const u=await findAsset(el.dataset.img);if(!u)return;const im=new Image();im.src=u;im.alt=el.dataset.alt||'';el.append(im);el.classList.add('filled')});
// 背景图 data-bg="名字"
document.querySelectorAll('[data-bg]').forEach(async el=>{const u=await findAsset(el.dataset.bg);if(u){el.style.backgroundImage=`url("${u}")`;el.classList.add('has-bg')}});
// 自动裁掉Lucky图片四周的透明空白，让它能紧贴按钮（失败时自动用原图）
function trimImage(u){return new Promise(ok=>{const im=new Image();im.onload=()=>{try{const W=im.naturalWidth,H=im.naturalHeight,c=document.createElement('canvas');c.width=W;c.height=H;const x=c.getContext('2d');x.drawImage(im,0,0);const d=x.getImageData(0,0,W,H).data;let t=H,b=0,l=W,r=0;for(let y=0;y<H;y++)for(let i=0;i<W;i++)if(d[(y*W+i)*4+3]>20){if(y<t)t=y;if(y>b)b=y;if(i<l)l=i;if(i>r)r=i}if(b<=t||r<=l)return ok(u);const w=r-l+1,h=b-t+1,o=document.createElement('canvas');o.width=w;o.height=h;o.getContext('2d').drawImage(c,l,t,w,h,0,0,w,h);ok(o.toDataURL('image/png'))}catch(e){ok(u)}};im.onerror=()=>ok(u);im.src=u})}

// Lucky 趴在按钮上 data-peek="lucky2"
document.querySelectorAll('[data-peek]').forEach(async b=>{
  const u=await findAsset(b.dataset.peek);if(!u)return;
  const w=document.createElement('span');w.className='peek';
  const im=new Image();im.src=await trimImage(u);im.alt='';im.className='peeker';
  b.before(w);w.append(im,b);
  b.addEventListener('click',()=>{w.classList.add('pop');setTimeout(()=>w.classList.remove('pop'),700)});
  new IntersectionObserver((es,ob)=>es.forEach(e=>{if(e.isIntersecting){w.classList.add('on');setTimeout(()=>w.classList.remove('on'),2200);ob.disconnect()}}),{threshold:1}).observe(w);
});

// 盲盒彩带
box.addEventListener('click',()=>{for(let i=0;i<16;i++){const s=document.createElement('span');s.className='cf';s.textContent=['🎉','⭐','🎄','❄️','🍪'][i%5];s.style.setProperty('--x',(Math.random()*260-130)+'px');s.style.setProperty('--y',(-Math.random()*160-40)+'px');box.append(s);setTimeout(()=>s.remove(),1100)}});

// 右侧小助手
const fab=$('fab'),help=$('help'),hint=$('hint');
function toggleHelp(open){open=open??!help.classList.contains('open');help.classList.toggle('open',open);fab.setAttribute('aria-expanded',open);help.setAttribute('aria-hidden',!open);hint.classList.remove('show')}
fab.onclick=()=>toggleHelp();
$('helpClose').onclick=()=>toggleHelp(false);
addEventListener('keydown',e=>{if(e.key==='Escape')toggleHelp(false)});
help.querySelectorAll('[data-go]').forEach(b=>b.onclick=()=>{toggleHelp(false);document.querySelector(b.dataset.go).scrollIntoView({behavior:'smooth'})});
setTimeout(()=>{if(!help.classList.contains('open')){hint.classList.add('show');setTimeout(()=>hint.classList.remove('show'),4000)}},3000);
