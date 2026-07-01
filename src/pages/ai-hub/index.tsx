import React, { useState } from 'react';
import { observer } from 'mobx-react-lite';
import BulkTradingPage from './bulk-trading';
import './ai-hub.scss';

const BulkTradingPageTab = () => (
    <div className='aihub-subpage aihub-subpage--bulk'>
        <BulkTradingPage />
    </div>
);

const UltimateTraderPage = () => (
    <div className='aihub-subpage aihub-subpage--ultimate'>
        <section className='aihub-ultimate-hero'>
            <div>
                <span className='aihub-kicker'>Closed development</span>
                <h2>Ultimate Trader</h2>
                <p>
                    A premium autonomous trading suite combining AI signals, bulk execution,
                    adaptive risk controls, and performance intelligence in one command layer.
                </p>
            </div>

            <div className='aihub-status-card'>
                <span>Release status</span>
                <strong>Coming Soon</strong>
                <em>Pro feature</em>
            </div>
        </section>

        <section className='aihub-features-grid'>
            {[
                {
                    title: 'AI Autopilot',
                    text: 'Reads live market data, selects the trade type, and executes against your risk profile.',
                },
                {
                    title: 'Goal-Based Sessions',
                    text: 'Set a profit target and stop-loss. The engine runs until one objective is reached.',
                },
                {
                    title: 'Live Strategy Feed',
                    text: "Receive strategy updates from GTS Empire's AI models trained on synthetic index ticks.",
                },
                {
                    title: 'Performance Dashboard',
                    text: 'Track win rate, ROI, best markets, session quality, and equity curve behavior.',
                },
            ].map((feature, index) => (
                <article className='aihub-feature-card' key={feature.title}>
                    <span>0{index + 1}</span>
                    <h3>{feature.title}</h3>
                    <p>{feature.text}</p>
                    <strong>PRO</strong>
                </article>
            ))}
        </section>

        <section className='aihub-cta'>
            <div>
                <span className='aihub-kicker'>Early access</span>
                <h3>Be the first to access the full autonomous suite.</h3>
                <p>Ultimate Trader is currently in closed development.</p>
            </div>

            <a className='aihub-cta__btn' href='https://gtstrader.app/' target='_blank' rel='noreferrer'>
                Visit GTS Empire Site
            </a>
        </section>
    </div>
);

type TTab = 'bulk' | 'ultimate';

const TABS: { id: TTab; label: string; description: string }[] = [
    {
        id: 'bulk',
        label: 'Bulk Trading',
        description: 'Execute multiple structured trades from one control surface.',
    },
    {
        id: 'ultimate',
        label: 'Ultimate Trader',
        description: 'Autonomous AI trading suite currently in development.',
    },
];

const AIHub = observer(() => {
    const [activeTab, setActiveTab] = useState<TTab>('bulk');

    console.log('🧠 AI Hub active tab:', activeTab);

    return (
        <div className='aihub-page'>
            <div className='aihub-page__grid' />
            <div className='aihub-page__glow' />

            <section className='aihub-header'>
                <div className='aihub-header__text'>
                    <span className='aihub-kicker'>AI Command Center</span>
                    <h1>AI Hub</h1>
                    <p>
                        Your intelligent trading control room for bulk execution,
                        automation workflows, and upcoming AI-powered trading systems.
                    </p>
                </div>

                <div className='aihub-header__panel'>
                    <span>System</span>
                    <strong>Online</strong>
                    <em>Machine intelligence ready</em>
                </div>
            </section>

            <nav className='aihub-tabs'>
                {TABS.map(tab => (
                    <button
                        key={tab.id}
                        className={`aihub-tab ${activeTab === tab.id ? 'aihub-tab--active' : ''}`}
                        onClick={() => setActiveTab(tab.id)}
                    >
                        <span className='aihub-tab__index'>{tab.id === 'bulk' ? '01' : '02'}</span>
                        <span className='aihub-tab__content'>
                            <strong>{tab.label}</strong>
                            <em>{tab.description}</em>
                        </span>
                    </button>
                ))}
            </nav>

            <section className='aihub-content'>
                {activeTab === 'bulk' && <BulkTradingPageTab />}
                {activeTab === 'ultimate' && <UltimateTraderPage />}
            </section>
        </div>
    );
});

export default AIHub;