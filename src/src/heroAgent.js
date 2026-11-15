// Hero animation: Python code builds an AI agent, the agent assembles, goes live
// and answers a WhatsApp customer. Plain DOM + SVG, no libraries.

const I = {
  msg: 'M7.9 20A9 9 0 1 0 4 16.1L2 22Z',
  bot: 'M12 8V4H8M6 8h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2zM2 14h2M20 14h2M15 13v2M9 13v2',
  send: 'M22 2 11 13M22 2l-7 20-4-9-9-4 20-7z',
  bell: 'M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9M10.3 21a1.94 1.94 0 0 0 3.4 0',
  db: 'M3 5a9 3 0 1 0 18 0a9 3 0 1 0-18 0M3 5v14a9 3 0 0 0 18 0V5M3 12a9 3 0 0 0 18 0',
  layers: 'm12 2 10 5-10 5L2 7ZM2 17l10 5 10-5M2 12l10 5 10-5',
  replay: 'M3 12a9 9 0 1 0 3-6.7L3 8M3 3v5h5',
};
const icon = (d, x, y, s = 0.55) => `<path class="ic" d="${d}" transform="translate(${x} ${y}) scale(${s})"/>`;
const node = (id, x, y, w, ic, label, sub) =>
  `<g class="ha-node" data-id="${id}"><rect x="${x}" y="${y}" width="${w}" height="${sub ? 34 : 32}" rx="9"/>${icon(ic, x + 8, y + (sub ? 10 : 9))}
   <text x="${x + 26}" y="${y + (sub ? 15 : 19)}">${label}</text>${sub ? `<text class="sm" x="${x + 26}" y="${y + 26}">${sub}</text>` : ''}</g>`;

const MARKUP = `
<button class="ha-replay" type="button" aria-label="Replay animation"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="${I.replay}"/></svg>Replay</button>
<div class="ha-stack">
  <div class="ha-panel ha-editor">
    <div class="ha-top">
      <div class="ha-lights"><i></i><i></i><i></i></div>
      <div class="ha-tab active"><svg viewBox="0 0 24 24" fill="none" stroke="#ffcb6b" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/></svg>clinic_agent.py</div>
      <div class="ha-tab second"><svg viewBox="0 0 24 24" fill="none" stroke="#56698a" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/></svg>clinic_faq.md</div>
      <span class="ha-state" data-r="state"><b></b><span data-r="stateText">idle</span></span>
    </div>
    <div class="ha-body"><div class="ha-gutter" data-r="gutter"></div><pre class="ha-code" data-r="code"></pre></div>
    <div class="ha-term"><div class="ha-term-head"><span>TERMINAL</span><span>OUTPUT</span></div><div class="ha-term-out" data-r="term"></div></div>
    <div class="ha-status"><span>Python 3.12</span><span>UTF-8</span><span data-r="statusRight">Agent stopped</span></div>
  </div>

  <div class="ha-panel ha-graph">
    <div class="ha-head">Agent workflow<small data-r="count">0 of 6 parts</small></div>
    <svg viewBox="0 0 320 192" aria-hidden="true">
      <defs><linearGradient id="ha-agent-fill" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#1b2d5c"/><stop offset="1" stop-color="#22184a"/></linearGradient></defs>
      <path class="ha-edge" data-e="trig" d="M82 95 H124"/>
      <path class="ha-edge" data-e="reply" d="M204 88 C224 88 226 51 244 51"/>
      <path class="ha-edge" data-e="alert" d="M204 102 C224 102 226 139 244 139"/>
      <path class="ha-edge tool" data-e="kb" d="M150 120 C150 136 118 138 118 152"/>
      <path class="ha-edge tool" data-e="mem" d="M178 120 C178 136 209 138 209 152"/>
      ${node('trig', 4, 78, 78, I.msg, 'New message', 'WhatsApp')}
      <g class="ha-node agent" data-id="agent"><rect x="124" y="70" width="80" height="50" rx="12"/>${icon(I.bot, 157, 76, 0.6)}<text x="164" y="111" text-anchor="middle" style="font-weight:600;font-size:9.4px">AI Agent</text></g>
      <rect class="ha-ring" data-r="ring" x="120" y="66" width="88" height="58" rx="15"/>
      ${node('reply', 244, 34, 72, I.send, 'Send reply', 'WhatsApp')}
      ${node('alert', 244, 122, 72, I.bell, 'Alert staff', 'WhatsApp')}
      ${node('kb', 70, 152, 96, I.db, 'Knowledge base', 'clinic FAQ, RAG')}
      ${node('mem', 174, 152, 70, I.layers, 'Memory', 'last 10 msgs')}
      <circle class="ha-pulse" r="3.4"/><circle class="ha-pulse" r="2.4" opacity=".6"/><circle class="ha-pulse" r="1.6" opacity=".35"/>
    </svg>
  </div>

  <div class="ha-panel ha-chat">
    <div class="ha-head"><span class="ha-av">B</span><span class="ha-who"><b>Bright Smile Dental</b><span data-r="wa">offline</span></span></div>
    <div class="ha-msgs" data-r="msgs"></div>
  </div>
</div>`;

const LINES = [
  { t: [['k', 'from'], ['', ' agents '], ['k', 'import'], ['', ' Agent, Memory, KnowledgeBase']] },
  { t: [['k', 'from'], ['', ' channels '], ['k', 'import'], ['', ' whatsapp, alert_staff']] },
  { t: [] },
  { t: [['c', '# RAG over the clinic FAQ']] },
  { t: [['', 'faq = '], ['f', 'KnowledgeBase'], ['', '('], ['s', '"clinic_faq.md"'], ['', ')']], build: 'kb' },
  { t: [] },
  { t: [['', 'agent = '], ['f', 'Agent'], ['p', '(']], build: 'agent' },
  { t: [['', '    model='], ['s', '"gemini-flash"'], ['', ',']] },
  { t: [['', '    memory='], ['f', 'Memory'], ['', '(last='], ['n', '10'], ['', '),']], build: 'mem' },
  { t: [['', '    tools=[faq.search, whatsapp.send, alert_staff],']], build: 'tools' },
  { t: [['', '    rules='], ['s', '"Answer from the FAQ. Hand bookings to staff."'], ['', ',']] },
  { t: [['p', ')']] },
  { t: [['d', '@whatsapp.on_message']], build: 'trig' },
  { t: [['k', 'def'], ['', ' '], ['f', 'reply'], ['', '(msg):']] },
  { t: [['', '    '], ['k', 'return'], ['', ' agent.run(msg.text, user=msg.sender)']] },
];

export function mountHeroAgent(root) {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  root.classList.add('ha');
  root.innerHTML = MARKUP;
  const r = (k) => root.querySelector(`[data-r="${k}"]`);
  const nodeEl = (k) => root.querySelector(`[data-id="${k}"]`);
  const edgeEl = (k) => root.querySelector(`[data-e="${k}"]`);
  const stack = root.querySelector('.ha-stack'), editor = root.querySelector('.ha-editor');
  const dots = [...root.querySelectorAll('.ha-pulse')];
  const code = r('code'), gutter = r('gutter'), term = r('term'), msgs = r('msgs');
  root.querySelectorAll('.ha-edge:not(.tool)').forEach((p) => p.style.setProperty('--len', p.getTotalLength()));

  let runId = 0, visible = true, built = 0;
  const sleep = (ms) => new Promise((res) => setTimeout(res, reduce ? 0 : ms));
  const waitVisible = async () => { while (!visible || document.hidden) await new Promise((res) => setTimeout(res, 250)); };
  const alive = (id) => id === runId;

  const setState = (cls, text, status) => { r('state').className = 'ha-state ' + cls; r('stateText').textContent = text; r('statusRight').textContent = status; };
  const hot = (k, v) => nodeEl(k).classList.toggle('hot', v);
  const addNode = (k) => { const n = nodeEl(k); if (!n.classList.contains('on')) { n.classList.add('on'); r('count').textContent = `${++built} of 6 parts`; } };
  const BUILD = {
    kb: () => addNode('kb'),
    agent: () => { addNode('agent'); edgeEl('kb').classList.add('on'); },
    mem: () => { addNode('mem'); edgeEl('mem').classList.add('on'); },
    tools: () => { addNode('reply'); addNode('alert'); edgeEl('reply').classList.add('on'); edgeEl('alert').classList.add('on'); },
    trig: () => { addNode('trig'); edgeEl('trig').classList.add('on'); },
  };

  function reset() {
    code.innerHTML = ''; gutter.textContent = ''; term.innerHTML = ''; msgs.innerHTML = ''; built = 0;
    r('count').textContent = '0 of 6 parts'; r('wa').textContent = 'offline'; r('ring').classList.remove('on');
    editor.classList.remove('live');
    root.querySelectorAll('.ha-node,.ha-edge').forEach((el) => el.classList.remove('on', 'hot'));
    setState('', 'idle', 'Agent stopped');
  }

  async function typeCode(id) {
    setState('typing', 'writing code', 'Editing clinic_agent.py');
    const cursor = document.createElement('span'); cursor.className = 'ha-cursor';
    let prev;
    for (let i = 0; i < LINES.length; i++) {
      if (!alive(id)) return;
      await waitVisible();
      gutter.textContent += `${i + 1}\n`;
      const line = document.createElement('span'); line.className = 'ha-line cur';
      prev?.classList.remove('cur'); prev = line;
      code.appendChild(line); line.appendChild(cursor);
      for (const [cls, text] of LINES[i].t) {
        const span = document.createElement('span'); if (cls) span.className = cls;
        line.insertBefore(span, cursor);
        for (const ch of text) {
          if (!alive(id)) return;
          span.textContent += ch;
          if (!reduce && ch !== ' ') await sleep(12 + Math.random() * 20);
        }
      }
      if (LINES[i].build) BUILD[LINES[i].build]();
      line.insertBefore(document.createTextNode('\n'), cursor);
      await sleep(LINES[i].t.length ? 120 : 50);
    }
    prev?.classList.remove('cur');
    cursor.remove();
  }

  const termLine = (html) => { const d = document.createElement('div'); d.innerHTML = html; term.appendChild(d); while (term.children.length > 4) term.firstChild.remove(); };
  const typeInto = async (el, text, speed = 16) => { for (const ch of text) { el.textContent += ch; await sleep(speed); } };
  const now = () => '10:0' + (2 + msgs.children.length % 7);
  function bubble(cls, text = '') {
    const m = document.createElement('div'); m.className = 'ha-msg ' + cls;
    const body = document.createElement('span'); body.textContent = text; m.appendChild(body);
    if (cls !== 'sys') { const t = document.createElement('time'); t.textContent = now(); m.appendChild(t); }
    msgs.appendChild(m); requestAnimationFrame(() => m.classList.add('on'));
    while (msgs.children.length > 5) msgs.firstChild.remove();
    return { m, body };
  }
  const read = (m) => { const t = m.querySelector('time'); if (t) t.innerHTML += '<i>✓✓</i>'; };

  function pulse(k, reverse = false, ms = 620) {
    return new Promise((resolve) => {
      if (reduce) return resolve();
      const path = edgeEl(k), len = path.getTotalLength(), t0 = performance.now();
      const step = (t) => {
        const p = Math.min((t - t0) / ms, 1);
        dots.forEach((d, i) => {
          let e = Math.max(p - i * 0.07, 0); e = e < 0.5 ? 2 * e * e : 1 - Math.pow(-2 * e + 2, 2) / 2;
          const pt = path.getPointAtLength((reverse ? 1 - e : e) * len);
          d.setAttribute('cx', pt.x); d.setAttribute('cy', pt.y); d.classList.add('go');
        });
        if (p < 1) requestAnimationFrame(step); else { dots.forEach((d) => d.classList.remove('go')); resolve(); }
      };
      requestAnimationFrame(step);
    });
  }

  async function runAgent(id) {
    const cmd = document.createElement('div'); cmd.innerHTML = '<span class="mu">~/agents $</span> <span class="cmd"></span>'; term.appendChild(cmd);
    await typeInto(cmd.querySelector('.cmd'), 'python clinic_agent.py', 32); if (!alive(id)) return;
    await sleep(350); termLine('<span class="ok">✓</span> knowledge base loaded: clinic_faq.md');
    await sleep(300); termLine('<span class="ok">✓</span> agent online, listening on WhatsApp'); if (!alive(id)) return;
    setState('online', 'agent online', 'Agent running'); editor.classList.add('live'); r('wa').textContent = 'online';
    await sleep(1000); await waitVisible(); if (!alive(id)) return;

    // 1. A question answered from the knowledge base
    bubble('in', 'Hi, are you open on Saturday?'); await sleep(350);
    hot('trig', true); await pulse('trig'); hot('trig', false);
    hot('agent', true); r('ring').classList.add('on'); r('wa').textContent = 'typing…'; if (!alive(id)) return;
    const thinking = bubble('out'); thinking.body.innerHTML = '<span class="ha-dots"><span></span><span></span><span></span></span>';
    termLine('<span class="mu">→</span> tool <span class="tool">faq.search</span>("saturday opening hours")');
    await pulse('kb'); hot('kb', true); await sleep(260); await pulse('kb', true); hot('kb', false); if (!alive(id)) return;
    await pulse('mem'); await pulse('reply'); hot('reply', true); r('ring').classList.remove('on');
    thinking.body.textContent = '';
    await typeInto(thinking.body, 'Yes! We’re open Monday to Saturday, 10 AM to 8 PM. Would you like to book a visit?', 13);
    read(thinking.m); hot('reply', false); hot('agent', false); r('wa').textContent = 'online'; if (!alive(id)) return;
    await sleep(1300); await waitVisible();

    // 2. A booking request handed to a person
    bubble('in', 'Yes please, Saturday at 5 PM'); await sleep(350);
    hot('trig', true); await pulse('trig'); hot('trig', false);
    hot('agent', true); r('ring').classList.add('on'); r('wa').textContent = 'typing…'; if (!alive(id)) return;
    termLine('<span class="mu">→</span> booking request: <span class="tool">alert_staff</span>()');
    await sleep(500); r('ring').classList.remove('on');
    await Promise.all([pulse('alert'), pulse('reply')]); hot('alert', true); hot('reply', true);
    const ans = bubble('out');
    await typeInto(ans.body, 'Great, a staff member will confirm your Saturday 5 PM slot shortly.', 13); read(ans.m);
    bubble('sys', 'Staff alerted on WhatsApp');
    termLine('<span class="ok">✓</span> handed off to staff');
    r('wa').textContent = 'online';
    await sleep(800); hot('alert', false); hot('reply', false); hot('agent', false);
  }

  async function play() {
    const id = ++runId;
    stack.classList.add('faded'); await sleep(500); reset(); stack.classList.remove('faded');
    await sleep(500); if (!alive(id)) return;
    await typeCode(id); if (!alive(id)) return;
    await sleep(450); await runAgent(id); if (!alive(id)) return;
    await sleep(4500); if (alive(id) && !reduce) play();
  }

  const onMove = (e) => {
    if (window.innerWidth <= 860) return;
    const b = root.getBoundingClientRect(), x = (e.clientX - b.left) / b.width - 0.5, y = (e.clientY - b.top) / b.height - 0.5;
    stack.style.transform = `rotateY(${-10 + x * 10}deg) rotateX(${5 - y * 8}deg)`;
  };
  const onLeave = () => { stack.style.transform = ''; };
  if (!reduce) { root.addEventListener('pointermove', onMove); root.addEventListener('pointerleave', onLeave); }
  root.querySelector('.ha-replay').addEventListener('click', play);
  const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; });
  io.observe(root);

  play();
  return () => { runId++; io.disconnect(); root.removeEventListener('pointermove', onMove); root.removeEventListener('pointerleave', onLeave); root.innerHTML = ''; };
}
