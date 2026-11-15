// Visual covers for projects that don't have workflow screenshots.
import React from 'react';

// Real Iris dataset: [petal length cm, petal width cm, species]
const IRIS = [[1.0,0.2,0],[1.1,0.1,0],[1.2,0.2,0],[1.3,0.2,0],[1.3,0.3,0],[1.3,0.4,0],[1.4,0.1,0],[1.4,0.2,0],[1.4,0.3,0],[1.5,0.1,0],[1.5,0.2,0],[1.5,0.3,0],[1.5,0.4,0],[1.6,0.2,0],[1.6,0.4,0],[1.6,0.6,0],[1.7,0.2,0],[1.7,0.3,0],[1.7,0.4,0],[1.7,0.5,0],[1.9,0.2,0],[1.9,0.4,0],[3.0,1.1,1],[3.3,1.0,1],[3.5,1.0,1],[3.6,1.3,1],[3.7,1.0,1],[3.8,1.1,1],[3.9,1.1,1],[3.9,1.2,1],[3.9,1.4,1],[4.0,1.0,1],[4.0,1.2,1],[4.0,1.3,1],[4.1,1.0,1],[4.1,1.3,1],[4.2,1.2,1],[4.2,1.3,1],[4.2,1.5,1],[4.3,1.3,1],[4.4,1.2,1],[4.4,1.3,1],[4.4,1.4,1],[4.5,1.3,1],[4.5,1.5,1],[4.5,1.6,1],[4.5,1.7,2],[4.6,1.3,1],[4.6,1.4,1],[4.6,1.5,1],[4.7,1.2,1],[4.7,1.4,1],[4.7,1.5,1],[4.7,1.6,1],[4.8,1.4,1],[4.8,1.8,1],[4.8,1.8,2],[4.9,1.5,1],[4.9,1.8,2],[4.9,2.0,2],[5.0,1.5,2],[5.0,1.7,1],[5.0,1.9,2],[5.0,2.0,2],[5.1,1.5,2],[5.1,1.6,1],[5.1,1.8,2],[5.1,1.9,2],[5.1,2.0,2],[5.1,2.3,2],[5.1,2.4,2],[5.2,2.0,2],[5.2,2.3,2],[5.3,1.9,2],[5.3,2.3,2],[5.4,2.1,2],[5.4,2.3,2],[5.5,1.8,2],[5.5,2.1,2],[5.6,1.4,2],[5.6,1.8,2],[5.6,2.1,2],[5.6,2.2,2],[5.6,2.4,2],[5.7,2.1,2],[5.7,2.3,2],[5.7,2.5,2],[5.8,1.6,2],[5.8,1.8,2],[5.8,2.2,2],[5.9,2.1,2],[5.9,2.3,2],[6.0,1.8,2],[6.0,2.5,2],[6.1,1.9,2],[6.1,2.3,2],[6.1,2.5,2],[6.3,1.8,2],[6.4,2.0,2],[6.6,2.1,2],[6.7,2.0,2],[6.7,2.2,2],[6.9,2.3,2]];
const SPECIES = [['setosa', '#5ef0ff'], ['versicolor', '#4ea1ff'], ['virginica', '#9a8cff']];

export function IrisCover() {
  const x = (v) => 40 + (v - 1) / 6 * 300;
  const y = (v) => 170 - v / 2.6 * 140;
  return (
    <svg viewBox="0 0 380 210" className="cover-svg" role="img" aria-label="Scatter plot of iris petal length against petal width, showing three species clusters">
      {[0, 1, 2, 3, 4].map((i) => <line key={i} x1="40" x2="340" y1={30 + i * 35} y2={30 + i * 35} className="grid-line" />)}
      {IRIS.map(([l, w, s], i) => <circle key={i} cx={x(l)} cy={y(w)} r="3.4" fill={SPECIES[s][1]} opacity=".85" />)}
      <text x="190" y="198" className="axis">petal length</text>
      <text x="16" y="100" className="axis" transform="rotate(-90 16 100)">petal width</text>
      {SPECIES.map(([n, c], i) => (
        <g key={n} transform={`translate(${52 + i * 92} 14)`}>
          <circle r="4" fill={c} cy="-3" /><text x="9" className="legend">{n}</text>
        </g>
      ))}
    </svg>
  );
}

export function AnnCover() {
  const layers = [11, 7, 5, 1];
  const xs = [60, 150, 240, 320];
  const pos = layers.map((n, li) => Array.from({ length: n }, (_, i) => [xs[li], 105 + (i - (n - 1) / 2) * (n > 8 ? 15 : 22)]));
  return (
    <svg viewBox="0 0 380 210" className="cover-svg" role="img" aria-label="Neural network diagram: 11 customer features feeding hidden layers that output a salary prediction">
      {pos.slice(0, -1).map((layer, li) => layer.map(([x1, y1], i) => pos[li + 1].map(([x2, y2], j) => (
        <line key={`${li}-${i}-${j}`} x1={x1} y1={y1} x2={x2} y2={y2} className="nn-edge" />
      ))))}
      {pos.map((layer, li) => layer.map(([cx, cy], i) => (
        <circle key={`${li}-${i}`} cx={cx} cy={cy} r={li === 3 ? 9 : 5} className={li === 0 ? 'nn-in' : li === 3 ? 'nn-out' : 'nn-hidden'} />
      )))}
      <text x="60" y="200" className="axis">11 inputs</text>
      <text x="195" y="200" className="axis">hidden layers</text>
      <text x="320" y="132" className="axis">salary</text>
    </svg>
  );
}

export function TerminalCover() {
  return (
    <div className="term" aria-label="Terminal running the money converter">
      <div className="term-bar"><i /><i /><i /><span>calculator.py</span></div>
      <pre>
<span className="t-dim">$</span> python calculator.py{'\n'}
<span className="t-key">Enter amount:</span> 100{'\n'}
<span className="t-key">Convert FROM (USD/EUR/GBP/PKR):</span> usd{'\n'}
<span className="t-key">Convert TO (USD/EUR/GBP/PKR):</span> pkr{'\n'}
<span className="t-out">100.00 USD = 28,040.00 PKR</span>{'\n'}
<span className="t-key">Convert another amount? (y/n):</span> <span className="caret" />
      </pre>
    </div>
  );
}

export function RatingCover() {
  return (
    <div className="chat" aria-label="Example WhatsApp rating request sent by the workflow">
      <div className="chat-head"><span className="chat-avatar">B</span><div><b>Bookings</b><small>WhatsApp Business</small></div></div>
      <div className="bubble">
        Hi! How was your deep cleaning service on 2026-11-14? 🙏<br />
        Please rate it from 1 to 5 by replying:<br /><b>RATE B-1042 5</b>
        <span className="bubble-time">10:00 ✓✓</span>
      </div>
      <div className="sheet-chip"><span>B-1042</span><span>rating_asked</span><b>yes</b></div>
    </div>
  );
}

export function CafeChatCover() {
  return (
    <div className="cafe" aria-label="Example chat: the cafe assistant takes a delivery order, confirms it and saves it to Google Sheets">
      <div className="cafe-head"><span className="cafe-logo">Z</span><div><b>Zoey’s Cafe</b><small>AI assistant</small></div></div>
      <div className="cafe-msgs">
        <p className="c-in">2 Zinger burgers and a Mint Margarita, delivery to DHA please</p>
        <p className="c-out">2 × Zinger Burger, 1 × Mint Margarita, plus Rs. 200 delivery. Total Rs. 2,500. Shall I confirm?</p>
        <p className="c-in short">Yes</p>
        <span className="c-saved">✓ Order saved to Google Sheets</span>
      </div>
    </div>
  );
}

const STEPS = [
  ['Topic Scout', 'M21 21l-4.3-4.3M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16z'],
  ['Researcher', 'M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2zM22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z'],
  ['Scriptwriter', 'M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z'],
  ['Footage', 'M15 10l5-3v10l-5-3M3 6h12v12H3z'],
  ['Voice & edit', 'M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3zM19 10v2a7 7 0 0 1-14 0v-2M12 19v3'],
  ['Your approval', 'M22 6l-10 7L2 6M2 4h20v16H2z'],
  ['YouTube', 'M2.5 17a24 24 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.6 49.6 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24 24 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.6 49.6 0 0 1-16.2 0A2 2 0 0 1 2.5 17M10 15l5-3-5-3z'],
];

export function AgentPipelineCover() {
  return (
    <div className="pipe" aria-label="Pipeline of AI agents: topic scout, researcher, scriptwriter, footage, voice and edit, your approval, YouTube">
      <div className="pipe-row">
        {STEPS.map(([label, d], i) => (
          <React.Fragment key={label}>
            <div className={`pipe-step${i === 5 ? ' wait' : i < 5 ? ' done' : ''}`}>
              <span className="pipe-ic"><svg viewBox="0 0 24 24"><path d={d} /></svg></span>
              <span className="pipe-lb">{label}</span>
            </div>
            {i < STEPS.length - 1 && <span className={`pipe-ln${i < 5 ? ' on' : ''}`} />}
          </React.Fragment>
        ))}
      </div>
      <div className="pipe-mail">
        <span className="pipe-mail-ic">✉</span>
        <div><b>New Short ready for review</b><small>Script, sources and video attached</small></div>
        <span className="pipe-btn ok">Approve &amp; Upload</span><span className="pipe-btn">Reject</span>
      </div>
    </div>
  );
}
