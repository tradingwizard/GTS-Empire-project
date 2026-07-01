import React, { useState, useEffect } from 'react';
import './loading-screen.scss';

interface LoadingScreenProps {
  onLoadingComplete: () => void;
}

const STEPS = ['Init', 'Markets', 'Data', 'Interface', 'Ready'];

const STATUS = [
  'Initializing system...',
  'Connecting to markets...',
  'Loading trading data...',
  'Preparing interface...',
  'System ready.',
];

// ECG path: 6 identical periods across viewBox 0-1800 (seamless at 50%)
const ECG_PATH = `
  M 0,30 L 80,30
  L 90,26 L 100,30 L 108,4 L 118,56 L 128,8 L 138,30 L 150,38 L 160,30
  L 300,30 L 380,30
  L 390,26 L 400,30 L 408,4 L 418,56 L 428,8 L 438,30 L 450,38 L 460,30
  L 600,30 L 680,30
  L 690,26 L 700,30 L 708,4 L 718,56 L 728,8 L 738,30 L 750,38 L 760,30
  L 900,30 L 980,30
  L 990,26 L 1000,30 L 1008,4 L 1018,56 L 1028,8 L 1038,30 L 1050,38 L 1060,30
  L 1200,30 L 1280,30
  L 1290,26 L 1300,30 L 1308,4 L 1318,56 L 1328,8 L 1338,30 L 1350,38 L 1360,30
  L 1500,30 L 1580,30
  L 1590,26 L 1600,30 L 1608,4 L 1618,56 L 1628,8 L 1638,30 L 1650,38 L 1660,30
  L 1800,30
`.trim();

const LoadingScreen: React.FC<LoadingScreenProps> = ({ onLoadingComplete }) => {
  const [progress, setProgress] = useState(0);
  const [stepIdx, setStepIdx] = useState(0);

  useEffect(() => {
    const total = 3400;
    const tick = 40;
    const t = setInterval(() => {
      setProgress(prev => {
        const next = Math.min(prev + (tick / total) * 100, 100);
        setStepIdx(Math.min(Math.floor((next / 100) * STATUS.length), STATUS.length - 1));
        if (next >= 100) {
          clearInterval(t);
          setTimeout(() => onLoadingComplete?.(), 700);
        }
        return next;
      });
    }, tick);
    return () => clearInterval(t);
  }, [onLoadingComplete]);

  const pct = Math.round(progress);
  const activeStep = Math.min(Math.floor((progress / 100) * STEPS.length), STEPS.length - 1);

  return (
    <div className="ls">

      {/* Background grid texture */}
      <div className="ls__grid" aria-hidden="true" />

      {/* Radial glow — matches landing page */}
      <div className="ls__glow" aria-hidden="true" />

      {/* Scrolling background data streams */}
      <div className="ls__streams" aria-hidden="true">
        {[...Array(7)].map((_, i) => (
          <div key={i} className={`ls__stream ls__stream--${i}`} />
        ))}
      </div>

      {/* ── Center hero ── */}
      <div className="ls__center">
        {/* Logo with orbital ring */}
        <div className="ls__logo-wrap">
          <div className="ls__ring ls__ring--outer" />
          <div className="ls__ring ls__ring--inner" />
          <img src="/assetsnew/belex.png" alt="GTS Empire" className="ls__icon" />
        </div>

        <h1 className="ls__wordmark">GTS EMPIRE</h1>
        <p className="ls__tagline">AI-Powered Trading Intelligence</p>
      </div>

      {/* ── ECG strip ── */}
      <div className="ls__ecg-wrap" aria-hidden="true">
        <svg
          className="ls__ecg"
          viewBox="0 0 1800 60"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="ecg-grad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%"   stopColor="#e5323b" stopOpacity="0" />
              <stop offset="40%"  stopColor="#e5323b" stopOpacity="0.6" />
              <stop offset="60%"  stopColor="#e5323b" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#e5323b" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path d={ECG_PATH} stroke="url(#ecg-grad)" strokeWidth="1.5" fill="none" />
        </svg>
      </div>

      {/* ── Bottom section ── */}
      <div className="ls__bottom">

        {/* Status row */}
        <div className="ls__status-row">
          <div className="ls__status-left">
            <span className="ls__status-dot" />
            <span className="ls__status-text">{STATUS[stepIdx]}</span>
          </div>
          <span className="ls__pct">
            {pct}<span className="ls__pct-sym">%</span>
          </span>
        </div>

        {/* Step node track */}
        <div className="ls__steps">
          {STEPS.map((label, i) => (
            <React.Fragment key={label}>
              {i > 0 && (
                <div className={`ls__connector ${i <= activeStep ? 'active' : ''}`} />
              )}
              <div className="ls__step">
                <div className={`ls__node ${i < activeStep ? 'done' : ''} ${i === activeStep ? 'current' : ''}`}>
                  {i < activeStep ? (
                    <svg viewBox="0 0 10 10" fill="none">
                      <path d="M2 5l2.5 2.5L8 3" stroke="currentColor" strokeWidth="1.5"
                        strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  ) : null}
                </div>
                <span className={`ls__step-lbl ${i <= activeStep ? 'active' : ''}`}>{label}</span>
              </div>
            </React.Fragment>
          ))}
        </div>

      </div>

      {/* Full-width progress bar at the very bottom */}
      <div className="ls__bar">
        <div className="ls__bar-fill" style={{ width: `${progress}%` }} />
      </div>

    </div>
  );
};

export default LoadingScreen;
