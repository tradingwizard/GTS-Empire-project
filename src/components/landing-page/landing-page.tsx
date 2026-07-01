import React, {useEffect} from 'react';
import { motion } from 'framer-motion';
import './landing-page.scss';

interface LandingPageProps {
  onStart: () => void;
}

const DERIV_SIGNUP_URL = 'https://gtstrader.app';

// ─── Helpers ──────────────────────────────────────────────────────────────────

const smooth = (pts: [number, number][]): string =>
  pts.reduce((acc, [x, y], i) => {
    if (i === 0) return `M ${x} ${y}`;
    const [px, py] = pts[i - 1];
    const cpx = (px + x) / 2;
    return `${acc} C ${cpx},${py} ${cpx},${y} ${x},${y}`;
  }, '');

const area = (pts: [number, number][], h: number): string => {
  const line = smooth(pts);
  const last = pts[pts.length - 1];
  return `${line} L ${last[0]},${h} L ${pts[0][0]},${h} Z`;
};

// ─── Chart data ───────────────────────────────────────────────────────────────

const eurusdPts: [number, number][] = [
  [0,155],[55,140],[110,150],[165,128],[220,138],
  [275,112],[330,122],[385,96],[440,106],[495,82],
  [550,90],[605,68],[660,76],[715,52],[770,60],[830,42],
];

const btcPts: [number, number][] = [
  [0,115],[55,88],[110,138],[165,96],[220,76],
  [275,128],[330,92],[385,58],[440,108],[495,72],
  [550,52],[605,88],[660,48],[715,68],[770,38],[830,54],
];

const goldPts: [number, number][] = [
  [0,60],[55,72],[110,65],[165,80],[220,72],
  [275,88],[330,78],[385,95],[440,84],[495,100],
  [550,92],[605,110],[660,98],[715,118],[770,108],[830,128],
];

// ─── Static data ──────────────────────────────────────────────────────────────

const tickers = [
  { symbol: 'EUR/USD', price: '1.0842', change: '+0.12%', up: true },
  { symbol: 'BTC/USD', price: '67,243', change: '+2.34%', up: true },
  { symbol: 'GOLD', price: '2,312.40', change: '-0.45%', up: false },
  { symbol: 'GBP/USD', price: '1.2634', change: '+0.08%', up: true },
  { symbol: 'OIL/USD', price: '78.32', change: '-1.12%', up: false },
  { symbol: 'ETH/USD', price: '3,421', change: '+1.87%', up: true },
  { symbol: 'USD/JPY', price: '149.82', change: '+0.23%', up: true },
  { symbol: 'S&P 500', price: '5,123', change: '+0.56%', up: true },
  { symbol: 'NAS 100', price: '18,042', change: '+0.91%', up: true },
  { symbol: 'USD/ZAR', price: '18.64', change: '-0.33%', up: false },
];

const members = [
  { name: 'Marcus K.', country: 'South Africa', profit: '+24.3%', img: 'https://i.pravatar.cc/80?img=11' },
  { name: 'Priya S.', country: 'India', profit: '+18.7%', img: 'https://i.pravatar.cc/80?img=5' },
  { name: 'James O.', country: 'Nigeria', profit: '+31.2%', img: 'https://i.pravatar.cc/80?img=12' },
  { name: 'Sofia M.', country: 'Brazil', profit: '+12.8%', img: 'https://i.pravatar.cc/80?img=9' },
  { name: 'Ahmed R.', country: 'UAE', profit: '+29.5%', img: 'https://i.pravatar.cc/80?img=13' },
  { name: 'Nina L.', country: 'Germany', profit: '+16.4%', img: 'https://i.pravatar.cc/80?img=25' },
  { name: 'Carlos B.', country: 'Mexico', profit: '+22.1%', img: 'https://i.pravatar.cc/80?img=15' },
  { name: 'Yuki T.', country: 'Japan', profit: '+19.8%', img: 'https://i.pravatar.cc/80?img=27' },
  { name: 'Amara D.', country: 'Kenya', profit: '+27.6%', img: 'https://i.pravatar.cc/80?img=32' },
  { name: 'Oliver H.', country: 'UK', profit: '+14.9%', img: 'https://i.pravatar.cc/80?img=8' },
  { name: 'Lena V.', country: 'Netherlands', profit: '+21.3%', img: 'https://i.pravatar.cc/80?img=47' },
  { name: 'Kwame A.', country: 'Ghana', profit: '+33.1%', img: 'https://i.pravatar.cc/80?img=53' },
];

const features = [
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none">
        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"
          stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    title: 'AI Signal Engine',
    desc: 'Real-time trade signals powered by machine learning models trained on millions of market data points.',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none">
        <path d="M3 3v18h18M7 16l4-4 4 4 4-6"
          stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    title: 'Live Market Analytics',
    desc: 'Visualise price movements, volatility patterns and trend strength across Forex, Indices, Crypto and more.',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M12 6v6l4 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
    title: '24/7 Market Access',
    desc: 'Always-on monitoring so you never miss a setup. Alerts surface the moments that matter, day or night.',
  },
];

// ─── Reusable animated chart ──────────────────────────────────────────────────

interface MiniChartProps {
  pts: [number, number][];
  label: string;
  price: string;
  change: string;
  up: boolean;
  color?: string;
  delay?: number;
}

const MiniChart: React.FC<MiniChartProps> = ({
  pts, label, price, change, up, color = '#e5323b', delay = 0,
}) => {
  const W = 830;
  const H = 170;
  const fillId = `fill-${label.replace(/\W/g, '')}`;

  return (
    <motion.div
      className="lp__chart-card"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay }}
    >
      <div className="lp__chart-card-header">
        <span className="lp__chart-label">{label}</span>
        <div className="lp__chart-meta">
          <span className="lp__chart-price">{price}</span>
          <span className={`lp__chart-change ${up ? 'up' : 'down'}`}>{change}</span>
        </div>
      </div>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        preserveAspectRatio="none"
        className="lp__chart-svg"
      >
        <defs>
          <linearGradient id={fillId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.25"/>
            <stop offset="100%" stopColor={color} stopOpacity="0"/>
          </linearGradient>
        </defs>
        {/* Area fill */}
        <motion.path
          d={area(pts, H)}
          fill={`url(#${fillId})`}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: delay + 0.4 }}
        />
        {/* Line */}
        <motion.path
          d={smooth(pts)}
          stroke={color}
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 2, delay, ease: 'easeOut' }}
        />
        {/* Animated end dot */}
        <motion.circle
          cx={pts[pts.length - 1][0]}
          cy={pts[pts.length - 1][1]}
          r="5"
          fill={color}
          initial={{ opacity: 0, scale: 0 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.3, delay: delay + 1.8 }}
        />
        {/* Pulse ring on end dot */}
        <motion.circle
          cx={pts[pts.length - 1][0]}
          cy={pts[pts.length - 1][1]}
          r="8"
          stroke={color}
          strokeWidth="1.5"
          fill="none"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: [0, 0.7, 0] }}
          viewport={{ once: true }}
          transition={{ duration: 1.5, delay: delay + 2, repeat: Infinity }}
        />
      </svg>
    </motion.div>
  );
};

// ─── Stagger variants ─────────────────────────────────────────────────────────

const staggerContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};

// ─── Component ────────────────────────────────────────────────────────────────

const LandingPage: React.FC<LandingPageProps> = ({ onStart }) => {
  const tickerItems = [...tickers, ...tickers]; // duplicate for seamless loop
  const memberItems = [...members, ...members];

  useEffect(() => {
  console.log('🧹 Landing page mounted — resetting body scroll');

  document.body.style.overflow = '';
  document.documentElement.style.overflow = '';

  return () => {
    console.log('🧹 Landing page unmounted');
  };
}, []);
  return (
    <div className="lp">

      {/* ── Background glow orb ── */}
      <div className="lp__glow" aria-hidden="true" />

      {/* ── Nav ── */}
      <motion.nav
        className="lp__nav"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="lp__nav-inner">
          <div className="lp__brand">
            <img src="/assetsnew/belex.png" alt="GTS Empire" className="lp__brand-icon" />
            <span className="lp__brand-name">GTS EMPIRE</span>
          </div>
          <div className="lp__nav-links">
            <span>Features</span>
            <span>Markets</span>
            <span>Community</span>
          </div>
          <button className="lp__nav-cta" onClick={onStart}>Launch App</button>
        </div>
      </motion.nav>

      {/* ── Ticker bar ── */}
      <div className="lp__ticker">
        <div className="lp__ticker-track">
          {tickerItems.map((t, i) => (
            <div key={i} className="lp__ticker-item">
              <span className="lp__ticker-symbol">{t.symbol}</span>
              <span className="lp__ticker-price">{t.price}</span>
              <span className={`lp__ticker-change ${t.up ? 'up' : 'down'}`}>
                {t.up ? '▲' : '▼'} {t.change}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Hero ── */}
      <section className="lp__hero">
        <div className="lp__hero-inner">

          <motion.div
            className="lp__eyebrow"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <span className="lp__eyebrow-dot" />
            From Aspiring Trader to Informed Decision Maker
          </motion.div>

          <motion.h1
            className="lp__heading"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.35 }}
          >
            Elevate Your<br />
            <span className="lp__heading-accent">Trading Journey Today</span>
          </motion.h1>

          <motion.p
            className="lp__subtext"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            Whether you're starting out or already experienced, the right tools can help
            you trade smarter. Trading always carries risk. Our AI-powered tools are
            designed to help traders of all levels make informed choices.
          </motion.p>

          <motion.div
            className="lp__cta-group"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.65 }}
          >
            <a
              className="lp__btn lp__btn--primary"
              href={DERIV_SIGNUP_URL}
              target="_blank"
              rel="noopener noreferrer"
            >
              Create Deriv Account
            </a>
            <button className="lp__btn lp__btn--ghost" onClick={onStart}>
              <svg className="lp__play-icon" viewBox="0 0 20 20" fill="currentColor">
                <path d="M6.5 5.5l8 4.5-8 4.5V5.5z"/>
              </svg>
              I Already Have an Account
            </button>
          </motion.div>

          {/* Platform screenshot */}
          <motion.div
            className="lp__preview-wrap"
            initial={{ opacity: 0, y: 40, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.85, ease: 'easeOut' }}
          >
            <div className="lp__preview-glow" aria-hidden="true" />
            <div className="lp__preview-frame">
              <div className="lp__preview-bar">
                <span /><span /><span />
              </div>
              <img
                src="/assetsnew/landing.png"
                alt="GTS Empire Trading Platform"
                className="lp__preview-img"
              />
            </div>
          </motion.div>

        </div>
      </section>

      {/* ── Live Charts Section ── */}
      <section className="lp__charts-section">
        <div className="lp__charts-inner">
          <motion.div
            className="lp__section-eyebrow"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            Live Market Intelligence
          </motion.div>
          <motion.h2
            className="lp__section-heading"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Real-Time Charts.<br />Real-Time Decisions.
          </motion.h2>
          <motion.p
            className="lp__section-sub"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Monitor live price action across multiple markets simultaneously.
            Identify trends before they happen.
          </motion.p>

          <div className="lp__charts-grid">
            <MiniChart
              pts={eurusdPts} label="EUR / USD" price="1.0842"
              change="+0.12%" up={true} color="#e5323b" delay={0.1}
            />
            <MiniChart
              pts={btcPts} label="BTC / USD" price="67,243"
              change="+2.34%" up={true} color="#f59e0b" delay={0.25}
            />
            <MiniChart
              pts={goldPts} label="XAU / USD" price="2,312.40"
              change="-0.45%" up={false} color="#6366f1" delay={0.4}
            />
          </div>
        </div>
      </section>

      {/* ── Stats strip ── */}
      <motion.section
        className="lp__stats"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
      >
        <div className="lp__stats-inner">
          {[
            { val: '24+', label: 'Countries' },
            { val: '10,000+', label: 'Active Traders' },
            { val: '24/7', label: 'Market Coverage' },
            { val: '4', label: 'Asset Classes' },
          ].map((s, i) => (
            <React.Fragment key={s.label}>
              {i > 0 && <div className="lp__stat-divider" />}
              <motion.div
                className="lp__stat"
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <span className="lp__stat-val">{s.val}</span>
                <span className="lp__stat-label">{s.label}</span>
              </motion.div>
            </React.Fragment>
          ))}
        </div>
      </motion.section>

      {/* ── Members ribbon ── */}
      <section className="lp__members">
        <div className="lp__members-header">
          <motion.div
            className="lp__section-eyebrow"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            Community
          </motion.div>
          <motion.h2
            className="lp__section-heading"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Traders from Around<br />the World Trust GTS Empire
          </motion.h2>
          <motion.p
            className="lp__section-sub"
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Join a growing community of informed traders making smarter decisions every day.
          </motion.p>
        </div>

        <div className="lp__members-ribbon">
          <div className="lp__members-track">
            {memberItems.map((m, i) => (
              <div key={i} className="lp__member-card">
                <div className="lp__member-avatar">
                  <img src={m.img} alt={m.name} />
                </div>
                <div className="lp__member-info">
                  <span className="lp__member-name">{m.name}</span>
                  <span className="lp__member-country">{m.country}</span>
                </div>
                <span className="lp__member-profit">{m.profit}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="lp__features">
        <div className="lp__features-inner">
          <motion.div
            className="lp__section-eyebrow"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            How it works
          </motion.div>
          <motion.h2
            className="lp__section-heading"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            The Right Tools for<br />Every Level of Trader
          </motion.h2>
          <motion.p
            className="lp__section-sub"
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Whether you're just getting started or a seasoned market participant,
            GTS Empire gives you the intelligence to make better decisions — every session.
          </motion.p>

          <motion.div
            className="lp__feature-cards"
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
          >
            {features.map(f => (
              <motion.div key={f.title} className="lp__card" variants={fadeUp}>
                <div className="lp__card-icon">{f.icon}</div>
                <h3 className="lp__card-title">{f.title}</h3>
                <p className="lp__card-desc">{f.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Bottom CTA ── */}
      <section className="lp__bottom-cta">
        <div className="lp__bottom-glow" aria-hidden="true" />
        <motion.div
          className="lp__bottom-inner"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <div className="lp__section-eyebrow">Get started today</div>
          <h2 className="lp__bottom-heading">
            Secure Your Access &amp;<br />
            <span className="lp__heading-accent">Start Your Journey</span>
          </h2>
          <p className="lp__section-sub">
            Join thousands of traders already using GTS Empire. Create your free Deriv account
            or log straight into the platform — and start trading smarter today.
          </p>
          <div className="lp__cta-group">
            <a
              className="lp__btn lp__btn--primary"
              href={DERIV_SIGNUP_URL}
              target="_blank"
              rel="noopener noreferrer"
            >
              Create Deriv Account
            </a>
            <button className="lp__btn lp__btn--ghost" onClick={onStart}>
              <svg className="lp__play-icon" viewBox="0 0 20 20" fill="currentColor">
                <path d="M6.5 5.5l8 4.5-8 4.5V5.5z"/>
              </svg>
              I Already Have an Account
            </button>
          </div>
        </motion.div>
      </section>

      {/* ── Footer ── */}
      <footer className="lp__footer">
        <div className="lp__footer-inner">
          <div className="lp__brand">
            <img src="/assetsnew/belex.png" alt="GTS Empire" className="lp__brand-icon" />
            <span className="lp__brand-name">GTS EMPIRE</span>
          </div>
          <p className="lp__footer-legal">
            *Trading involves significant risk. Past performance does not guarantee future results.
            Only trade with money you can afford to lose.
          </p>
        </div>
      </footer>

    </div>
  );
};

export default LandingPage;
