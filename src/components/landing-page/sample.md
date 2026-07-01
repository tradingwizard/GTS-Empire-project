import React, { useState, useEffect } from 'react';
import './loading-screen.scss';

const SmoothTechLoadingScreen = () => {
  const [progress, setProgress] = useState(0);
  const [moneyElements, setMoneyElements] = useState([]);
  
  // Progress simulation
  useEffect(() => {
    const totalDuration = 5000; // 5 seconds
    const interval = 50;

    const timer = setInterval(() => {
      setProgress(prevProgress => {
        const newProgress = prevProgress + (interval / totalDuration) * 100;
        return newProgress >= 100 ? 100 : newProgress;
      });
    }, interval);

    return () => clearInterval(timer);
  }, []);
  
  // Generate falling money elements
  useEffect(() => {
    const generateMoneyElements = () => {
      const elements = [];
      // Create more money elements (40 instead of 15)
      for (let i = 0; i < 400; i++) {
        const symbol = Math.random() > 0.5 ? '💵' : '🖨️';
        elements.push({
          id: i,
          left: Math.random() * 100,
          delay: Math.random() * 5,
          size: 20 + Math.random() * 20,
          rotation: Math.random() * 360,
          duration: 3 + Math.random() * 3,
          symbol: symbol
        });
      }
      setMoneyElements(elements);
    };

    generateMoneyElements();
  }, []);
  
  // Loading stages with forex trading concept
  const loadingStages = [
    {
      title: 'Connecting to Forex Markets',
      description: 'Establishing secure trading channels',
      icon: '🔄',
      color: '#3498db'
    },
    {
      title: 'Fetching Currency Pairs',
      description: 'Syncing EUR/USD, GBP/JPY, USD/CHF rates',
      icon: '💱',
      color: '#2ecc71'
    },
    {
      title: 'Calibrating Trading Algorithms',
      description: 'Optimizing entry and exit strategies',
      icon: '📈',
      color: '#9b59b6'
    },
    {
      title: 'Analyzing Market Conditions',
      description: 'Processing technical & fundamental signals',
      icon: '📊',
      color: '#f39c12'
    },
    {
      title: 'Trading System Ready',
      description: 'All markets accessible for trading',
      icon: '🚀',
      color: '#27ae60'
    }
  ];

  // Current stage calculation
  const currentStageIndex = Math.min(
    Math.floor((progress / 100) * loadingStages.length),
    loadingStages.length - 1
  );
  const currentStage = loadingStages[currentStageIndex];

  const [printerElements, setPrinterElements] = useState([]);
  
  // Generate falling printer elements
  useEffect(() => {
    const generatePrinterElements = () => {
      const elements = [];
      for (let i = 0; i < 8; i++) {
        elements.push({
          id: i,
          left: 10 + Math.random() * 80, // More centered
          delay: Math.random() * 10,
          rotation: -10 + Math.random() * 20, // Slight rotation
          duration: 6 + Math.random() * 4 // Slower fall
        });
      }
      setPrinterElements(elements);
    };

    generatePrinterElements();
  }, []);

  return (
    <div className="smooth-loading-screen">
      {/* Background gradient */}
      <div className="smooth-loading-screen__background"></div>
      
      {/* Animated money elements */}
      <div className="smooth-loading-screen__money-container">
        {moneyElements.map(money => (
          <div 
            key={money.id}
            className="smooth-loading-screen__money"
            style={{
              left: `${money.left}%`,
              animationDelay: `${money.delay}s`,
              width: `${money.size}px`,
              height: `${money.size}px`,
              transform: `rotate(${money.rotation}deg)`,
              animationDuration: `${money.duration}s`
            }}
          >
            {money.symbol}
          </div>
        ))}
      </div>
      
      {/* Enhanced forex trading chart background element */}
      <div className="smooth-loading-screen__forex-background">
        <div className="smooth-loading-screen__chart-line"></div>
        <div className="smooth-loading-screen__chart-candles">
          {[...Array(18)].map((_, index) => {
            const height = 25 + Math.random() * 60;
            const isUp = Math.random() > 0.4;
            return (
              <div 
                key={index} 
                className={`smooth-loading-screen__candle ${isUp ? 'up' : 'down'}`}
                style={{
                  height: `${height}px`,
                  width: `${8 + Math.random() * 4}px`,
                  left: `${index * 5.5}%`
                }}
              >
                <div className="smooth-loading-screen__candle-wick"></div>
              </div>
            );
          })}
        </div>
      </div>
      
      {/* Falling printers */}
      <div className="smooth-loading-screen__printer-container">
        {printerElements.map(printer => (
          <div 
            key={printer.id}
            className="smooth-loading-screen__printer"
            style={{
              left: `${printer.left}%`,
              animationDelay: `${printer.delay}s`,
              transform: `rotate(${printer.rotation}deg)`,
              animationDuration: `${printer.duration}s`
            }}
          >
            <div className="smooth-loading-screen__printer-body">
              <div className="smooth-loading-screen__printer-output">
                <div className="smooth-loading-screen__printer-bill"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Main content */}
      <div className="smooth-loading-screen__content">
        {/* Logo */}
        <div className="smooth-loading-screen__logo-container">
          <div className="smooth-loading-screen__logo">
            <span>DP</span>
          </div>
        </div>
        
        {/* Title */}
        <h1 className="smooth-loading-screen__title">Dollar Printer</h1>
        
        {/* Forex subtitle */}
        <div className="smooth-loading-screen__subtitle">
          Advanced Forex Trading System
        </div>
        
        {/* Current stage indicator */}
        <div className="smooth-loading-screen__current-stage">
          <div className="smooth-loading-screen__stage-icon" style={{ backgroundColor: currentStage.color }}>
            {currentStage.icon}
          </div>
          <div className="smooth-loading-screen__stage-info">
            <div className="smooth-loading-screen__stage-title">{currentStage.title}</div>
            <div className="smooth-loading-screen__stage-description">{currentStage.description}</div>
          </div>
        </div>
        
        {/* Progress bars */}
        <div className="smooth-loading-screen__progress-container">
          {/* Individual stage progress */}
          <div className="smooth-loading-screen__stage-progress">
            {loadingStages.map((stage, index) => {
              const isActive = index <= currentStageIndex;
              const isComplete = index < currentStageIndex;
              const stageProgress = isComplete ? 100 : (
                index === currentStageIndex ? 
                (progress - (index * (100/loadingStages.length))) * (loadingStages.length) : 
                0
              );
              
              return (
                <div 
                  key={index}
                  className={`smooth-loading-screen__stage-bar ${isActive ? 'active' : ''}`}
                >
                  <div 
                    className="smooth-loading-screen__stage-fill"
                    style={{ 
                      width: `${stageProgress}%`,
                      backgroundColor: stage.color
                    }}
                  ></div>
                </div>
              );
            })}
          </div>
          
          {/* Overall progress */}
          <div className="smooth-loading-screen__overall-progress">
            <div 
              className="smooth-loading-screen__overall-fill"
              style={{ width: `${progress}%` }}
            ></div>
            
            <div className="smooth-loading-screen__progress-text">
              {Math.round(progress)}%
            </div>
          </div>
        </div>
        
        {/* Loading stages list */}
        <div className="smooth-loading-screen__stages-list">
          {loadingStages.map((stage, index) => {
            const isActive = index <= currentStageIndex;
            const isCurrent = index === currentStageIndex;
            
            return (
              <div 
                key={index}
                className={`smooth-loading-screen__stage-item ${isActive ? 'active' : ''} ${isCurrent ? 'current' : ''}`}
              >
                <div 
                  className="smooth-loading-screen__stage-bullet"
                  style={{ 
                    backgroundColor: isActive ? stage.color : 'transparent',
                    borderColor: stage.color
                  }}
                ></div>
                <div className="smooth-loading-screen__stage-label">
                  {stage.title}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default SmoothTechLoadingScreen;



// Smooth Tech Loading Screen Styles
:root {
  // Color Palette - Dark Navy Blue Theme
  --tech-bg-primary: #000435; // Very dark navy blue (primary)
  --tech-bg-secondary: #000D5C; // Slightly lighter dark navy
  --tech-accent-blue: #64B5F6; // Light blue accent
  --tech-accent-green: #7AE07A; // Green accent (kept the same)
  --tech-accent-purple: #a988ff; // Light purple accent
  --tech-accent-orange: #FFD966; // Yellow/orange accent
  --tech-text-primary: #FFFFFF; // White text
  --tech-text-secondary: rgba(255, 255, 255, 0.7); // Semi-transparent white
  
  // Typography
  --tech-font-primary: 'Inter', 'Roboto', sans-serif;
  --tech-font-display: 'Poppins', 'Montserrat', sans-serif;
}

// Keyframes for money falling animation
@keyframes money-fall {
  0% {
    transform: translateY(-100px) rotate(0deg);
    opacity: 0;
  }
  10% {
    opacity: 1;
  }
  90% {
    opacity: 1;
  }
  100% {
    transform: translateY(1000px) rotate(360deg);
    opacity: 0;
  }
}

// Keyframes for candle animation
@keyframes candle-glow {
  0%, 100% {
    box-shadow: 0 0 5px rgba(100, 181, 246, 0.5);
  }
  50% {
    box-shadow: 0 0 10px rgba(100, 181, 246, 0.8);
  }
}

// Keyframes for soft pulsing
@keyframes soft-pulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
}

// Keyframes for shadow pulse
@keyframes shadow-pulse {
  0%, 100% {
    box-shadow: 0 0 20px rgba(100, 181, 246, 0.3);
  }
  50% {
    box-shadow: 0 0 30px rgba(100, 181, 246, 0.5);
  }
}

.smooth-loading-screen {
  // Full screen layout
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  
  // Typography
  font-family: var(--tech-font-primary);
  color: var(--tech-text-primary);
  
  // Layout
  display: flex;
  justify-content: center;
  align-items: center;
//overflow: hidden;
  z-index: 9999;
  
  // Background
  &__background {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(135deg, var(--tech-bg-primary) 0%, var(--tech-bg-secondary) 100%);
    z-index: -1;
    
    &:after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: radial-gradient(circle at center, rgba(100, 181, 246, 0.03) 0%, transparent 70%);
    }
  }
  
  // Money elements container
  &__money-container {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  //overflow: hidden;
    z-index: 5;
    pointer-events: none;
  }
  
  // Individual money element
  &__money {
    position: absolute;
    top: -50px;
    font-size: 24px;
    animation: money-fall linear forwards;
    opacity: 0;
    z-index: 5;
    
    // Make some money spin differently
    &:nth-child(odd) {
      animation-name: money-fall;
    }
  }
  
  // Forex chart background
  &__forex-background {
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 90%;
    height: 200px;
    z-index: 2;
    opacity: 0.2;
    pointer-events: none;
  }
  
  &__chart-line {
    position: absolute;
    top: 50%;
    left: 0;
    width: 100%;
    height: 2px;
    background-color: rgba(100, 181, 246, 0.3);
  }
  
  &__chart-candles {
    position: relative;
    width: 100%;
    height: 100%;
  }
  
  &__candle {
    position: absolute;
    bottom: 50%;
    width: 8px;
    background-color: #FF6B8B; // Red for down candles
    border-radius: 2px;
    transform: translateX(-50%);
    animation: candle-glow 3s infinite;
    
    &.up {
      background-color: #7AE07A; // Green for up candles
    }
    
    &.down {
      background-color: #FF6B8B; // Red for down candles
    }
    
    .smooth-loading-screen__candle-wick {
      position: absolute;
      width: 2px;
      height: 20px;
      left: 50%;
      transform: translateX(-50%);
      background-color: rgba(255, 255, 255, 0.5);
      
      &:before, &:after {
        content: '';
        position: absolute;
        width: 2px;
        height: 10px;
        background-color: rgba(255, 255, 255, 0.5);
      }
      
      &:before {
        top: -10px;
      }
      
      &:after {
        bottom: -10px;
      }
    }
  }
  
  // Main content container
  &__content {
    position: relative;
    width: 90%;
    max-width: 600px;
    padding: 40px;
    background-color: rgba(0, 13, 92, 0.85); // Slightly lighter dark navy with transparency
    border-radius: 20px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3),
                0 0 50px rgba(100, 181, 246, 0.1);
    backdrop-filter: blur(10px);
    z-index: 10;
    
    // Light border
    border: 1px solid rgba(100, 181, 246, 0.2);
    text-align: center;
  }
  
  // Logo styling
  &__logo-container {
    margin-bottom: 25px;
  }
  
  &__logo {
    width: 80px;
    height: 80px;
    margin: 0 auto;
    background: linear-gradient(135deg, var(--tech-accent-blue) 0%, var(--tech-accent-purple) 100%);
    border-radius: 10px; // More rectangular like a printer
    display: flex;
    justify-content: center;
    align-items: center;
    animation: shadow-pulse 3s infinite;
    
    // Printer-like paper slot
    &:before {
      content: '';
      position: absolute;
      top: -10px;
      left: 50%;
      transform: translateX(-50%);
      width: 30px;
      height: 3px;
      background-color: rgba(255, 255, 255, 0.3);
    }
    
    span {
      color: var(--tech-bg-primary);
      font-size: 28px;
      font-weight: bold;
      font-family: var(--tech-font-display);
    }
  }
  
  // Title styling
  &__title {
    font-family: var(--tech-font-display);
    font-size: 36px;
    font-weight: 600;
    margin-bottom: 10px;
    background: linear-gradient(to right, var(--tech-accent-blue), var(--tech-accent-purple));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    letter-spacing: 1px;
  }
  
  &__subtitle {
    font-size: 16px;
    color: var(--tech-text-secondary);
    margin-bottom: 30px;
    letter-spacing: 1px;
  }
  
  // Current stage display
  &__current-stage {
    display: flex;
    align-items: center;
    margin-bottom: 35px;
    padding: 15px;
    background-color: rgba(0, 4, 53, 0.7); // Very dark navy background
    border-radius: 12px;
    border: 1px solid rgba(100, 181, 246, 0.1);
  }
  
  &__stage-icon {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-right: 20px;
    font-size: 24px;
  }
  
  &__stage-info {
    text-align: left;
    flex-grow: 1;
  }
  
  &__stage-title {
    font-size: 18px;
    font-weight: 600;
    margin-bottom: 5px;
  }
  
  &__stage-description {
    font-size: 14px;
    color: var(--tech-text-secondary);
  }
  
  // Progress container
  &__progress-container {
    margin-bottom: 30px;
  }
  
  // Stage progress bars
  &__stage-progress {
    display: flex;
    margin-bottom: 20px;
    height: 6px;
  }
  
  &__stage-bar {
    flex-grow: 1;
    height: 100%;
    background-color: rgba(255, 255, 255, 0.1);
    margin: 0 2px;
    border-radius: 3px;
  //overflow: hidden;
    position: relative;
  }
  
  &__stage-fill {
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    transition: width 0.3s ease;
  }
  
  // Overall progress bar
  &__overall-progress {
    height: 10px;
    background-color: rgba(255, 255, 255, 0.1);
    border-radius: 5px;
  //overflow: hidden;
    position: relative;
    margin-bottom: 10px;
  }
  
  &__overall-fill {
    height: 100%;
    background: linear-gradient(to right, var(--tech-accent-blue), var(--tech-accent-purple));
    position: absolute;
    top: 0;
    left: 0;
    transition: width 0.3s ease;
    
    &:after {
      content: '';
      position: absolute;
      right: 0;
      top: 0;
      height: 100%;
      width: 15px;
      background-color: rgba(100, 181, 246, 0.5);
      filter: blur(5px);
    }
  }
  
  &__progress-text {
    font-size: 14px;
    text-align: right;
    color: var(--tech-text-secondary);
  }
  
  // Stages list
  &__stages-list {
    display: flex;
    justify-content: space-between;
  }
  
  &__stage-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
    width: 20%;
    
    &:not(:last-child):after {
      content: '';
      position: absolute;
      top: 7px;
      right: -50%;
      width: 100%;
      height: 2px;
      background-color: rgba(255, 255, 255, 0.1);
      z-index: -1;
    }
    
    &.active:not(:last-child):after {
      background-color: var(--tech-accent-blue);
    }
    
    &.active .smooth-loading-screen__stage-label {
      color: var(--tech-text-primary);
    }
    
    &.current .smooth-loading-screen__stage-bullet {
      animation: soft-pulse 2s infinite;
    }
  }
  
  &__stage-bullet {
    width: 16px;
    height: 16px;
    border-radius: 50%;
    border: 2px solid;
    margin-bottom: 8px;
    transition: all 0.3s ease;
  }
  
  &__stage-label {
    font-size: 12px;
    color: var(--tech-text-secondary);
    text-align: center;
    transition: color 0.3s ease;
    max-width: 100%;
  //overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  
  // Optional printer elements
  &__printer-container {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  //overflow: hidden;
    z-index: 3;
    pointer-events: none;
  }
  
  &__printer {
    position: absolute;
    top: -100px;
    animation: printer-fall linear forwards;
    opacity: 0;
  }
  
  &__printer-body {
    width: 60px;
    height: 40px;
    background-color: #000D5C;
    border-radius: 5px;
    position: relative;
    border: 2px solid rgba(100, 181, 246, 0.5);
    box-shadow: 0 0 10px rgba(100, 181, 246, 0.3);
    
    &:before {
      content: '';
      position: absolute;
      top: 8px;
      right: 8px;
      width: 5px;
      height: 5px;
      border-radius: 50%;
      background-color: var(--tech-accent-blue);
      box-shadow: 0 0 5px var(--tech-accent-blue);
    }
  }
  
  &__printer-output {
    position: absolute;
    bottom: -2px;
    left: 10px;
    width: 40px;
    height: 3px;
    background-color: #001689;
  //overflow: hidden;
  }
  
  &__printer-bill {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 0;
    background: linear-gradient(0deg, #7AE07A, #2ecc71);
    animation: printer-output 2s ease-out infinite;
    
    &:after {
      content: '$';
      position: absolute;
      top: 5px;
      left: 50%;
      transform: translateX(-50%);
      color: #000435;
      font-weight: bold;
      font-size: 16px;
    }
  }
  
  // Responsive adjustments
  @media (max-width: 768px) {
    &__content {
      padding: 30px 20px;
    }
    
    &__title {
      font-size: 28px;
    }
    
    &__stages-list {
      display: none; // Hide on mobile to save space
    }
    
    &__stage-info {
      max-width: 80%;
    }
  }
  
  @media (max-width: 480px) {
    &__logo {
      width: 60px;
      height: 60px;
    }
    
    &__logo span {
      font-size: 20px;
    }
    
    &__title {
      font-size: 24px;
      margin-bottom: 20px;
    }
    
    &__stage-icon {
      width: 40px;
      height: 40px;
      font-size: 20px;
    }
    
    &__stage-title {
      font-size: 16px;
    }
  }
}

// Support for printer animation
@keyframes printer-fall {
  0% {
    transform: translateY(-100px) rotate(0deg);
    opacity: 0;
  }
  10% {
    opacity: 1;
  }
  90% {
    opacity: 1;
  }
  100% {
    transform: translateY(1200px) rotate(10deg);
    opacity: 0;
  }
}

// Support for printer output animation
@keyframes printer-output {
  0% {
    height: 0;
  }
  100% {
    height: 40px;
  }
}