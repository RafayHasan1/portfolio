import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { ArrowUpRight, Github, Play, Download, Linkedin, Mail, Code2, Bot, Workflow, BrainCircuit, Maximize2, X } from 'lucide-react';
import { IrisCover, AnnCover, TerminalCover, RatingCover } from './covers.jsx';
import { mountHeroAgent } from './heroAgent.js';
import './heroAgent.css';
import './styles.css';

const GH = 'https://github.com/RafayHasan1';

const projects = [
  {
    category: 'AI Automation',
    title: 'AI Dental Clinic WhatsApp Assistant',
    description: 'Answers patient questions on WhatsApp around the clock using the clinic’s own FAQ. Understands voice notes, remembers each conversation, logs chats to Google Sheets and alerts staff when a person is needed.',
    stack: ['n8n', 'AI Agent', 'RAG', 'Supabase', 'WhatsApp API', 'Google Sheets'],
    link: `${GH}/ai-dental-clinic-assistant`,
    image: '/images/dental-assistant.png',
    window: 'whatsapp-assistant',
    wide: true
  },
  {
    category: 'AI Automation',
    title: 'AI Cafe Ordering Assistant',
    description: 'A chat assistant that answers menu and delivery questions from the cafe’s own information, takes orders step by step, confirms them and saves them to Google Sheets. Replies in English or Urdu.',
    stack: ['n8n', 'Gemini', 'RAG', 'Google Sheets'],
    link: `${GH}/ai-cafe-ordering-assistant`,
    image: '/images/cafe-workflow.png',
    window: 'cafe-assistant'
  },
  {
    category: 'AI Automation',
    title: 'AI YouTube Video Agent Team',
    description: 'A team of AI agents that picks a topic, researches it with Google Search, writes the script, finds footage, adds an AI voice and renders the video, then emails me for approval before uploading to YouTube.',
    stack: ['n8n', 'Gemini', 'Google Search', 'Pexels', 'JSON2Video', 'YouTube API'],
    link: `${GH}/ai-youtube-video-agents`,
    image: '/images/youtube-agents.png',
    window: 'youtube-video-agents',
    wide: true
  },
  {
    category: 'AI Automation',
    title: 'Customer Rating Automation',
    description: 'Checks bookings every hour, finds finished services and sends each customer a WhatsApp rating request, then marks it in Google Sheets.',
    stack: ['n8n', 'WhatsApp API', 'Google Sheets', 'JavaScript'],
    link: `${GH}/customer-rating-automation`,
    cover: RatingCover
  },
  {
    category: 'AI Automation',
    title: 'AI Cold Email Outreach',
    description: 'Reads each lead’s website, writes a personalised email with an LLM and sends it over SMTP with daily limits and random delays, then updates the lead in Google Sheets.',
    stack: ['n8n', 'Groq', 'Llama 3.3', 'SMTP', 'Google Sheets'],
    link: `${GH}/ai-cold-email-outreach`,
    image: '/images/cold-email.png',
    window: 'cold-email-outreach',
    wide: true
  },
  {
    category: 'AI Automation',
    title: 'Clinic FAQ Knowledge Base',
    description: 'Splits the clinic FAQ into chunks, creates Gemini embeddings and stores them in a Supabase vector store for the WhatsApp assistant to search.',
    stack: ['n8n', 'Gemini embeddings', 'Supabase'],
    link: `${GH}/ai-dental-clinic-assistant`,
    image: '/images/faq-loader.png',
    window: 'faq-loader'
  },
  {
    category: 'Machine Learning',
    title: 'ANN Salary Regression',
    description: 'A Keras neural network that turns a churn dataset into a salary regression task, with a Streamlit app. Evaluated against a baseline, which showed salary can’t be predicted from these features.',
    stack: ['TensorFlow', 'Keras', 'scikit-learn', 'Streamlit'],
    link: `${GH}/ANN-salary-regression`,
    demo: 'https://ann-salary-regression0.streamlit.app/',
    cover: AnnCover
  },
  {
    category: 'Machine Learning',
    title: 'Iris Classifier',
    description: 'A Streamlit app that predicts an iris flower’s species from its measurements with a Random Forest, showing the probability for each species.',
    stack: ['scikit-learn', 'Streamlit', 'pandas'],
    link: `${GH}/iris-classifier`,
    demo: 'https://rafay-iris-classifier.streamlit.app/',
    cover: IrisCover
  },
  {
    category: 'Python',
    title: 'Money Converter',
    description: 'A command-line currency converter for USD, EUR, GBP and PKR with input validation, built to practise Python functions and dictionaries.',
    stack: ['Python', 'CLI'],
    link: `${GH}/Money-Converter`,
    cover: TerminalCover
  }
];

const filters = ['All', 'AI Automation', 'Machine Learning', 'Python'];

const skills = [
  { icon: Bot, title: 'AI agents & chatbots', text: 'Agents with memory, tools and RAG knowledge bases that answer customers on WhatsApp and websites.' },
  { icon: Workflow, title: 'Workflow automation', text: 'n8n workflows connecting WhatsApp, Google Sheets, email, LLMs and APIs.' },
  { icon: Code2, title: 'Python development', text: 'Application logic, scripting and Streamlit apps.' },
  { icon: BrainCircuit, title: 'Machine learning', text: 'Neural networks with TensorFlow and Keras, classic models with scikit-learn.' }
];

function HeroAgent() {
  const ref = useRef(null);
  useEffect(() => mountHeroAgent(ref.current), []);
  return <div ref={ref} role="img" aria-label="Animation: Python code builds an AI agent, which then answers a customer on WhatsApp and hands a booking to staff" />;
}

function Spotlight({ children, className, ...rest }) {
  const onMove = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty('--mx', `${e.clientX - r.left}px`);
    e.currentTarget.style.setProperty('--my', `${e.clientY - r.top}px`);
  };
  return <article className={className} onPointerMove={onMove} {...rest}>{children}</article>;
}

function Lightbox({ project, onClose }) {
  const closeRef = useRef(null);
  useEffect(() => {
    closeRef.current?.focus();
    const onKey = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => { window.removeEventListener('keydown', onKey); document.body.style.overflow = ''; };
  }, [onClose]);
  return (
    <div className="lightbox" role="dialog" aria-modal="true" aria-label={`${project.title} workflow`} onClick={onClose}>
      <figure onClick={(e) => e.stopPropagation()}>
        <figcaption><span>{project.title}</span><button ref={closeRef} onClick={onClose} aria-label="Close"><X size={18} /></button></figcaption>
        <img src={project.image} alt={`n8n workflow for ${project.title}`} />
      </figure>
    </div>
  );
}

function ProjectCard({ p, onZoom }) {
  const Cover = p.cover;
  return (
    <Spotlight className="project-card">
      <div className="cover">
        {p.image ? (
          <button className="shot" onClick={() => onZoom(p)} aria-label={`Open the ${p.title} workflow full size`}>
            <span className="shot-bar"><i /><i /><i /><span>n8n / {p.window}</span><Maximize2 size={13} /></span>
            <img src={p.image} alt="" loading="lazy" />
          </button>
        ) : <Cover />}
      </div>
      <div className="project-body">
        <span className="category">{p.category}</span>
        <h3>{p.title}</h3>
        <p>{p.description}</p>
        <ul className="tags">{p.stack.map((t) => <li key={t}>{t}</li>)}</ul>
        <div className="card-actions">{p.demo && <a className="code-link demo-link" href={p.demo} target="_blank" rel="noreferrer"><Play size={14} /> Live demo</a>}<a className="code-link" href={p.link} target="_blank" rel="noreferrer"><Github size={15} /> View code</a></div>
      </div>
    </Spotlight>
  );
}

function App() {
  const [filter, setFilter] = useState('All');
  const [zoomed, setZoomed] = useState(null);
  const shown = projects.filter((p) => filter === 'All' || p.category === filter);

  return (
    <div className="site">
      <header className="nav">
        <div className="wrap nav-inner">
          <a className="brand" href="#home"><span className="brand-mark">R</span>Rafay Hasan</a>
          <nav aria-label="Sections"><a href="#about">About</a><a href="#skills">Skills</a><a href="#projects">Projects</a><a href="#contact">Contact</a></nav>
          <a className="nav-cta" href={GH} target="_blank" rel="noreferrer"><Github size={15} /> GitHub</a>
        </div>
      </header>

      <main>
        <section className="hero" id="home">
          <div className="wrap hero-grid">
            <div className="hero-copy">
              <p className="status-pill"><span className="pulse" /> Open to AI automation projects</p>
              <h1>I build AI agents and automations that handle the busywork.</h1>
              <p className="hero-lead">I’m <strong>Syed Rafay Hasan</strong>, a Python developer at DIGGIT in Karachi. I build AI agents in Python that talk to customers, search a business’s own knowledge, remember each conversation and know when to hand over to a person.</p>
              <div className="hero-actions">
                <a className="button primary" href="#projects">See my projects</a>
                <a className="button ghost" href="/Syed_Rafay_Hasan_CV.pdf" download><Download size={16} /> Download CV</a>
              </div>
            </div>
            <HeroAgent />
          </div>
        </section>

        <section className="section wrap about" id="about">
          <h2>Curious by nature, builder by practice.</h2>
          <div className="about-text">
            <p>Before I wrote AI agents, I ran my own clothing brand, Terra Vogue. Over 300 orders, I answered every customer message, processed every order and handled support myself, so I know first-hand how much of a business day goes to repetitive work.</p>
            <p>Now, as a Python developer at DIGGIT, I build the AI agents and automations I wish I’d had then: assistants that answer customers, take orders, follow up with leads and hand over to a person when it matters.</p>
            <a className="text-link" href="https://www.linkedin.com/in/syed-rafay-hasan-31869439b/" target="_blank" rel="noreferrer">Connect on LinkedIn <ArrowUpRight size={15} /></a>
          </div>
        </section>

        <section className="section wrap" id="skills">
          <div className="section-head"><h2>What I work with</h2><p>Tools and technologies I build with every day.</p></div>
          <div className="skill-grid">
            {skills.map(({ icon: Icon, title, text }) => (
              <Spotlight className="skill-card" key={title}>
                <span className="skill-icon"><Icon size={20} /></span>
                <h3>{title}</h3><p>{text}</p>
              </Spotlight>
            ))}
          </div>
          <p className="tech-line"><span>Also familiar with</span> NumPy, Pandas, Matplotlib, Seaborn, Git and GitHub, React (basic)</p>
        </section>

        <section className="section wrap" id="projects">
          <div className="section-head projects-head">
            <div><h2>Featured projects</h2><p>AI agents, business automations, machine-learning apps and Python work. Every card links to its code.</p></div>
            <div className="filters" role="group" aria-label="Filter projects">
              {filters.map((f) => (
                <button key={f} className={f === filter ? 'active' : ''} aria-pressed={f === filter} onClick={() => setFilter(f)}>{f}</button>
              ))}
            </div>
          </div>
          <div className="project-grid" key={filter}>
            {shown.map((p, i) => <div className={`card-in${p.wide ? " wide" : ""}`} style={{ '--i': i }} key={p.title + i}><ProjectCard p={p} onZoom={setZoomed} /></div>)}
          </div>
        </section>

        <section className="contact" id="contact">
          <div className="wrap contact-inner">
            <h2>Have a process that should run itself?</h2>
            <p>Tell me what takes up your team’s time. I’m happy to talk through how an AI agent or workflow could handle it.</p>
            <div className="hero-actions">
              <a className="button primary" href="mailto:Rafayhasan112@gmail.com"><Mail size={16} /> Email me</a>
              <a className="button ghost" href="/Syed_Rafay_Hasan_CV.pdf" download><Download size={16} /> Download CV</a>
              <a className="button ghost" href="https://www.linkedin.com/in/syed-rafay-hasan-31869439b/" target="_blank" rel="noreferrer"><Linkedin size={16} /> LinkedIn</a>
              <a className="button ghost" href={GH} target="_blank" rel="noreferrer"><Github size={16} /> GitHub</a>
            </div>
          </div>
        </section>
      </main>

      <footer className="wrap footer">
        <span>© {new Date().getFullYear()} Syed Rafay Hasan</span>
        <a href="#home">Back to top</a>
      </footer>

      {zoomed && <Lightbox project={zoomed} onClose={() => setZoomed(null)} />}
    </div>
  );
}

createRoot(document.getElementById('root')).render(<App />);
