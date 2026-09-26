const KEY="meuLook.v1";
let state=JSON.parse(localStorage.getItem(KEY)||'{"items":[],"me":null,"favorites":[],"tab":"home"}');
const $=s=>document.querySelector(s);
const save=()=>localStorage.setItem(KEY,JSON.stringify(state));
const cats=["Blusa","Calça","Saia","Vestido","Jaqueta","Sapato","Bolsa","Acessório"];
const esc=s=>String(s||"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]));

function render(){
  document.querySelectorAll(".bottom button").forEach(b=>b.classList.toggle("active",b.dataset.tab===state.tab));
  const c=$("#content");
  if(state.tab==="home") c.innerHTML=home();
  if(state.tab==="closet") c.innerHTML=closet();
  if(state.tab==="create") c.innerHTML=create();
  if(state.tab==="favorites") c.innerHTML=favorites();
  bind();
}
function home(){
 return `<div class="hero">
  <h2>Monte seu look em você ✨</h2>
  <p>Cadastre suas roupas e deixe o Meu Look criar combinações para trabalho, passeio, jantar, festa e muito mais.</p>
  <button class="primary" data-action="create">Criar meu look</button>
 </div>
 <div class="grid2"><div class="stat"><b>${state.items.length}</b><span>peças cadastradas</span></div><div class="stat"><b>${state.favorites.length}</b><span>looks favoritos</span></div></div>
 <div class="section"><h3>Comece agora</h3></div>
 <div class="actions"><button class="secondary" data-action="add">📸 Adicionar peça</button><button class="secondary" data-action="me">👩 Minha foto</button></div>
 <div class="section"><h3>Como funciona</h3></div>
 <div class="notice">1. Fotografe suas roupas. 2. Escolha uma ocasião. 3. O app combina suas peças. 4. A etapa de IA de provador virtual usa sua foto para gerar a visualização do look.</div>`;
}
function closet(){
 return `<div class="section"><h3>Meu guarda-roupa</h3><button class="secondary" data-action="add">＋ Peça</button></div>
 <div class="actions" style="overflow:auto;margin-bottom:12px"><button class="secondary" data-filter="Todas">Todas</button>${cats.map(x=>`<button class="secondary" data-filter="${x}">${x}</button>`).join("")}</div>
 <div class="cards">${state.items.length?state.items.map(pieceCard).join(""):`<div class="empty" style="grid-column:1/-1">Seu closet ainda está vazio.<br><br>Adicione a primeira peça 📸</div>`}</div>`;
}
function pieceCard(x){return `<div class="piece"><img src="${x.image}" alt=""><div class="meta"><b>${esc(x.name)}</b><small>${esc(x.category)} • ${esc(x.color)}</small></div></div>`}
function create(){
 return `<div class="section"><h3>Criar Look</h3></div>
 <div class="form">
 <div class="field"><label>OCASIÃO</label><select id="occasion"><option>Trabalho</option><option>Casual</option><option>Jantar</option><option>Festa</option><option>Encontro</option><option>Dia quente</option><option>Surpreenda-me</option></select></div>
 <div class="field"><label>PEÇA OBRIGATÓRIA (opcional)</label><select id="required"><option value="">Nenhuma</option>${state.items.map(x=>`<option value="${x.id}">${esc(x.name)}</option>`).join("")}</select></div>
 <button class="primary" data-action="generate">✨ Criar Look em Mim</button>
 ${!state.me?`<div class="notice">Para a visualização personalizada, cadastre primeiro uma foto sua de corpo inteiro em “Minha foto”.</div>`:""}
 </div>`;
}
function favorites(){
 return `<div class="section"><h3>Meus Looks</h3></div><div class="empty">Os looks favoritos aparecerão aqui.</div>`;
}
function openModal(html){$("#modalContent").innerHTML=html;$("#modal").classList.remove("hidden");}
function closeModal(){$("#modal").classList.add("hidden")}
function addModal(){
 openModal(`<h2>Adicionar peça</h2><div class="form">
 <div class="photoBox" id="preview">📷 Escolha uma foto</div>
 <input id="photo" type="file" accept="image/*" capture="environment">
 <div class="field"><label>NOME</label><input id="name" placeholder="Ex.: Calça pink"></div>
 <div class="field"><label>TIPO</label><select id="category">${cats.map(x=>`<option>${x}</option>`).join("")}</select></div>
 <div class="field"><label>COR</label><input id="color" placeholder="Ex.: Pink"></div>
 <button class="primary" id="savePiece">Salvar peça</button></div>`);
 $("#photo").onchange=e=>readImage(e.target.files[0],"preview");
 $("#savePiece").onclick=()=>{
   const src=$("#preview img")?.src;if(!src){alert("Escolha uma foto.");return}
   state.items.unshift({id:crypto.randomUUID(),name:$("#name").value||"Minha peça",category:$("#category").value,color:$("#color").value||"Não informada",image:src});
   save();closeModal();render();
 };
}
function meModal(){
 openModal(`<h2>Minha foto</h2><p style="color:var(--muted)">Use uma foto de corpo inteiro, de preferência com boa luz e sem outra pessoa na imagem.</p>
 <div class="photoBox" id="mePreview">${state.me?`<img src="${state.me}">`:"👩 Escolha sua foto"}</div>
 <input id="meFile" type="file" accept="image/*" capture="user">
 <button class="primary" id="saveMe" style="margin-top:12px">Salvar minha foto</button>
 <div class="notice" style="margin-top:12px">A foto fica armazenada localmente neste protótipo. Para gerar imagens realistas de você usando as roupas, será necessário conectar um serviço de IA por um backend seguro.</div>`);
 $("#meFile").onchange=e=>readImage(e.target.files[0],"mePreview");
 $("#saveMe").onclick=()=>{const img=$("#mePreview img")?.src;if(img){state.me=img;save();closeModal();render()}};
}
function readImage(file,target){
 if(!file)return;const r=new FileReader();r.onload=()=>{$("#"+target).innerHTML=`<img src="${r.result}">`};r.readAsDataURL(file);
}
function generate(){
 if(!state.items.length){alert("Cadastre algumas peças primeiro.");state.tab="closet";render();return}
 const occ=$("#occasion").value, req=$("#required").value;
 let chosen=req?state.items.filter(x=>x.id===req):[];
 const pick=c=>state.items.find(x=>x.category===c);
 ["Blusa","Calça","Saia","Vestido","Jaqueta","Sapato","Bolsa"].forEach(c=>{if(!chosen.some(x=>x.category===c)){const p=pick(c);if(p)chosen.push(p)}});
 if(occ==="Surpreenda-me") chosen=state.items.slice(0,Math.min(4,state.items.length));
 openModal(`<h2>Seu look • ${esc(occ)}</h2><div class="look">
 <div class="lookPhoto">${state.me?`<img src="${state.me}" alt="Sua foto">`:`<div style="padding:30px;text-align:center;color:var(--muted)">Cadastre sua foto para ver você no look.</div>`}</div>
 <div class="lookList">${chosen.map(x=>`<span class="chip">${esc(x.category)}: ${esc(x.name)}</span>`).join("")}</div>
 <div class="notice" style="margin-top:12px">Prévia do MVP: suas peças são selecionadas e sua foto é exibida. A próxima integração é a geração de “você vestindo as peças”, feita por IA.</div>
 <button class="primary" style="margin-top:12px" id="fav">♡ Salvar nos favoritos</button></div>`);
 $("#fav").onclick=()=>{state.favorites.push({occasion,items:chosen.map(x=>x.id),photo:state.me});save();alert("Look salvo!");};
}
function bind(){
 document.querySelectorAll("[data-tab]").forEach(b=>b.onclick=()=>{state.tab=b.dataset.tab;save();render()});
 document.querySelectorAll("[data-action]").forEach(b=>b.onclick=()=>{
   const a=b.dataset.action;if(a==="add")addModal();if(a==="me")meModal();if(a==="create"){state.tab="create";render()}if(a==="generate")generate();
 });
 document.querySelectorAll("[data-filter]").forEach(b=>b.onclick=()=>{const f=b.dataset.filter;document.querySelectorAll(".piece").forEach(el=>{el.style.display=(f==="Todas"||el.innerText.startsWith(f))?"block":"none"})});
}
$("#closeModal").onclick=closeModal;$("#modal").onclick=e=>{if(e.target.id==="modal")closeModal()};
$("#profileBtn").onclick=()=>openModal(`<h2>Configurações</h2><p style="color:var(--muted)">Versão inicial do Meu Look.</p><div class="notice">Para transformar este protótipo em um aplicativo publicado na App Store, será necessário criar o projeto iOS no Xcode, configurar assinatura Apple e conectar o backend de IA.</div>`);
render();
