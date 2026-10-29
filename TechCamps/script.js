/* ---------- Mobile ---------- */
const burger = document.getElementById('burger');
const menu = document.getElementById('menu');
burger.addEventListener('click', () => {
  const open = menu.classList.toggle('open');
  burger.setAttribute('aria-expanded', open);
});
menu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
  menu.classList.remove('open'); burger.setAttribute('aria-expanded', false);
}));

/* ---------- Animação de entrada ao rolar ---------- */
const io = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
}, { threshold: .12 });
document.querySelectorAll('.reveal').forEach(el => io.observe(el));

/* ---------- Destaque do link ativo no menu ---------- */
const links = [...document.querySelectorAll('.nav a.link')];
const spy = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      links.forEach(l => l.classList.toggle('active', l.getAttribute('href') === '#' + e.target.id));
    }
  });
}, { rootMargin: '-45% 0px -50% 0px' });
links.forEach(l => { const s = document.querySelector(l.getAttribute('href')); if (s) spy.observe(s); });

/* ---------- Seção 4: caminho da informação ---------- */
const steps = [
  { ic:'📱', t:'Pedido', d:'O cliente escolhe o produto no celular, tablet ou computador e confirma a compra. Neste instante, o aplicativo envia o pedido pela internet.',
    tech:'Tecnologias: aplicativo/site, HTTPS, balanceadores de carga' },
  { ic:'☁️', t:'Nuvem (AWS)', d:'Os sistemas na nuvem validam o pagamento, checam fraudes, confirmam o estoque e escolhem de qual centro de distribuição o item sairá. Tudo em frações de segundo.',
    tech:'Tecnologias: AWS, microsserviços, bancos de dados, filas de mensagens' },
  { ic:'🤖', t:'Robô busca o item', d:'No centro de distribuição, robôs da Amazon Robotics (descendentes dos robôs Kiva) levam a prateleira com o produto até o funcionário, evitando longas caminhadas.',
    tech:'Tecnologias: robótica móvel, software de orquestração, visão computacional' },
  { ic:'📦', t:'Embalagem', d:'O item é conferido, embalado e etiquetado. Sistemas sugerem o tamanho de caixa e registram o código de rastreio.',
    tech:'Tecnologias: leitores de código, esteiras, otimização de embalagem' },
  { ic:'🚚', t:'Transporte', d:'Os pacotes são separados por região e seguem por rotas calculadas por algoritmos, passando por centros de triagem até a base de entrega local.',
    tech:'Tecnologias: otimização de rotas, rastreamento em tempo real' },
  { ic:'🏠', t:'Entrega', d:'O pacote chega ao cliente, e o sistema atualiza o status, avisa por notificação e libera a avaliação da compra.',
    tech:'Última milha: entregadores, vans e, em testes, drones (Prime Air)' }
];
const jEl = document.getElementById('journey');
const jDet = document.getElementById('jdetail');
const jProg = document.getElementById('jprog');
let cur = 0, timer = null;

steps.forEach((s, i) => {
  const b = document.createElement('button');
  b.className = 'j-step'; b.setAttribute('role', 'tab');
  b.innerHTML = `<span class="ic" aria-hidden="true">${s.ic}</span><b>${i + 1}. ${s.t}</b>`;
  b.addEventListener('click', () => { stop(); show(i); });
  jEl.appendChild(b);
});
function show(i) {
  cur = (i + steps.length) % steps.length;
  [...jEl.children].forEach((b, k) => {
    b.classList.toggle('active', k === cur);
    b.classList.toggle('done', k < cur);
    b.setAttribute('aria-selected', k === cur);
  });
  const s = steps[cur];
  jDet.innerHTML = `<div class="ic" aria-hidden="true">${s.ic}</div><div><h3>Etapa ${cur + 1}: ${s.t}</h3><p>${s.d}</p><p class="tech">${s.tech}</p></div>`;
  jProg.style.width = ((cur + 1) / steps.length * 100) + '%';
}
const playBtn = document.getElementById('jplay');
function stop() { clearInterval(timer); timer = null; playBtn.textContent = '▶ Reproduzir'; }
playBtn.addEventListener('click', () => {
  if (timer) return stop();
  playBtn.textContent = '⏸ Pausar';
  if (cur === steps.length - 1) show(0);
  timer = setInterval(() => {
    if (cur >= steps.length - 1) return stop();
    show(cur + 1);
  }, 2600);
});
document.getElementById('jnext').addEventListener('click', () => { stop(); show(cur + 1); });
document.getElementById('jprev').addEventListener('click', () => { stop(); show(cur - 1); });
show(0);

/* ---------- simulador de pedido ---------- */
const services = [
  { n:'Busca',            tier:'☁️', log:'Busca localizou o produto entre milhões de itens', ops:120 },
  { n:'Recomendação',     tier:'☁️', log:'Modelo de IA sugeriu acessórios relacionados', ops:340 },
  { n:'Carrinho',         tier:'☁️', log:'Item adicionado ao carrinho e preço confirmado', ops:90 },
  { n:'Pagamento',        tier:'☁️', log:'Pagamento autorizado com o emissor do cartão', ops:210 },
  { n:'Antifraude',       tier:'☁️', log:'Análise de risco concluída: pedido aprovado', ops:480 },
  { n:'Estoque',          tier:'☁️', log:'Estoque reservado no centro de distribuição mais próximo', ops:150 },
  { n:'Robô',             tier:'🤖', log:'Robô designado: prateleira em deslocamento até a estação', ops:620 },
  { n:'Embalagem',        tier:'🤖', log:'Item conferido, embalado e etiquetado', ops:260 },
  { n:'Roteirização',     tier:'🚚', log:'Algoritmo calculou a melhor rota de entrega', ops:530 },
  { n:'Notificação',      tier:'🚚', log:'Cliente avisado: “Seu pedido saiu para entrega”', ops:70 }
];
const svcList = document.getElementById('svcList');
const logEl = document.getElementById('log');
const opsEl = document.getElementById('opsCount');
const simBtn = document.getElementById('simBtn');
services.forEach(s => {
  const d = document.createElement('div');
  d.className = 'svc'; d.innerHTML = `${s.n}<span class="tier">${s.tier}</span>`;
  svcList.appendChild(d);
});
function animateCount(from, to, ms = 500) {
  const t0 = performance.now();
  (function f(t) {
    const p = Math.min((t - t0) / ms, 1);
    opsEl.textContent = Math.round(from + (to - from) * p).toLocaleString('pt-BR');
    if (p < 1) requestAnimationFrame(f);
  })(t0);
}
let running = false;
simBtn.addEventListener('click', () => {
  if (running) return;
  running = true; simBtn.disabled = true; simBtn.textContent = 'Processando…';
  [...svcList.children].forEach(c => c.classList.remove('on'));
  logEl.innerHTML = ''; opsEl.textContent = '0';
  let total = 0, i = 0;
  const t0 = Date.now();
  const tick = setInterval(() => {
    if (i >= services.length) {
      clearInterval(tick);
      logEl.insertAdjacentHTML('beforeend', `<div class="c">✔ Pedido concluído. Um único clique envolveu ${total.toLocaleString('pt-BR')} operações (ilustrativo).</div>`);
      simBtn.disabled = false; simBtn.textContent = 'Simular outro pedido'; running = false;
      return;
    }
    const s = services[i];
    svcList.children[i].classList.add('on');
    const prev = total; total += s.ops;
    animateCount(prev, total);
    const sec = ((Date.now() - t0) / 1000).toFixed(1);
    logEl.insertAdjacentHTML('beforeend', `<div><span class="t">[+${sec}s]</span> <span class="c">${s.tier} ${s.n}</span> → ${s.log}</div>`);
    logEl.scrollTop = logEl.scrollHeight;
    i++;
  }, 650);
});