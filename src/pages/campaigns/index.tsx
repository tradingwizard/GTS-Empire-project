import React, { useState } from 'react';
import { observer } from 'mobx-react-lite';
import { motion, AnimatePresence } from 'framer-motion';
import { localize } from '@deriv-com/translations';
import './campaigns.scss';

const socials = [
    { name: 'WhatsApp', href: 'https://wa.me/254719229005', type: 'whatsapp' },
    { name: 'Telegram', href: 'https://t.me/Binary_Legacy_Hub', type: 'telegram' },
    { name: 'YouTube', href: 'https://youtube.com/@gtsempire?si=loIRp3l-w_8QhOx4', type: 'youtube' },
    { name: 'Instagram', href: 'https://www.instagram.com/gtsempire?igsh=MTI4emswcjRrbXp1Ng==', type: 'instagram' },
    { name: 'TikTok', href: 'https://www.tiktok.com/@gtsempire.com?_r=1&_t=ZS-96149s9iO8K', type: 'tiktok' },
];

const Icon = ({ type }: { type: string }) => {
    const common = { width: 20, height: 20, viewBox: '0 0 24 24', fill: 'none', xmlns: 'http://www.w3.org/2000/svg' };

    if (type === 'whatsapp') {
        return (
            <svg {...common}>
                <path d='M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.455 5.703 1.457h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z' fill='currentColor' />
            </svg>
        );
    }

    if (type === 'telegram') {
        return (
            <svg {...common}>
                <path d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-1-.65-.35-1 .22-1.62.15-.16 2.72-2.5 2.77-2.71.01-.03.01-.13-.05-.18-.06-.05-.14-.03-.2-.02-.09.02-1.49.95-4.22 2.79-.4.28-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.75-.55 2.92-1.27 4.86-2.11 5.83-2.52 2.78-1.16 3.35-1.36 3.73-1.37.08 0 .27.02.39.12.1.08.13.2.14.29-.01.06-.01.13-.02.2z' fill='currentColor' />
            </svg>
        );
    }

    if (type === 'youtube') {
        return (
            <svg {...common}>
                <path d='M23.498 6.163a3.003 3.003 0 00-2.11-2.11C19.53 3.545 12 3.545 12 3.545s-7.53 0-9.388.508a3.003 3.003 0 00-2.11 2.11C0 8.017 0 12 0 12s0 3.983.502 5.837a3.003 3.003 0 002.11 2.11c1.858.508 9.388.508 9.388.508s7.53 0 9.388-.508a3.003 3.003 0 002.11-2.11C24 15.983 24 12 24 12s0-3.983-.502-5.837z' fill='currentColor' />
                <path d='M9.545 15.568V8.432L15.818 12l-6.273 3.568z' fill='#000' />
            </svg>
        );
    }

    if (type === 'instagram') {
        return (
            <svg {...common}>
                <path d='M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z' fill='currentColor' />
            </svg>
        );
    }

    return (
        <svg {...common}>
            <path d='M12.525.02c1.31-.02 2.61-.01 3.91-.01.08 1.53.63 3.09 1.75 4.17 1.12.97 2.63 1.34 4.09 1.25V9.45c-1.28-.06-2.55-.54-3.56-1.37-.9-.74-1.52-1.78-1.78-2.9v10.37c-.01 2.3-1.21 4.54-3.32 5.51-2.11.99-4.76.77-6.66-.56-2.02-1.42-2.9-4.04-2.17-6.4 1.05-3.03 4.7-4.48 7.56-3.01.21.11.41.24.61.37v4.18c-.89-.59-2.07-.63-2.99-.08-1.07.64-1.52 2.05-.98 3.19.46.96 1.53 1.51 2.58 1.33 1.15-.17 1.91-1.21 1.91-2.36V0h.01z' fill='currentColor' />
        </svg>
    );
};

const GuideCard = ({
    badge,
    title,
    desc,
    image,
    alt,
    actions,
}: {
    badge: string;
    title: string;
    desc: string;
    image: string;
    alt: string;
    actions: { label: string; href: string; primary?: boolean }[];
}) => (
    <motion.article
        className='guide-card'
        initial={{ opacity: 0, y: 22 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.38 }}
    >
        <div className='guide-card__media'>
            <img src={image} alt={alt} />
        </div>

        <div className='guide-card__content'>
            <span className='guide-card__badge'>{badge}</span>
            <h2>{title}</h2>
            <p>{desc}</p>

            <div className='guide-card__actions'>
                {actions.map(action => (
                    <a
                        key={action.href}
                        href={action.href}
                        target='_blank'
                        rel='noopener noreferrer'
                        className={`guide-card__btn ${action.primary ? 'guide-card__btn--primary' : 'guide-card__btn--secondary'}`}
                    >
                        {action.label}
                    </a>
                ))}
            </div>
        </div>
    </motion.article>
);

const Campaigns = observer(() => {
    const [activeTab, setActiveTab] = useState<'start' | 'mentorship'>('start');

    console.log('📣 Campaigns page active tab:', activeTab);

    return (
        <div className='campaigns-page'>
            <div className='campaigns-page__grid' />
            <div className='campaigns-page__glow' />

            <aside className='campaigns-sidebar'>
                <div>
                    <span className='campaigns-sidebar__eyebrow'>{localize('Quick Guide')}</span>
                    <h1>{localize('Your trading path starts here.')}</h1>
                    <p>
                        {localize(
                            'Choose your starting point, book mentorship, or connect with the GTS Empire community.'
                        )}
                    </p>
                </div>

                <div className='campaigns-socials'>
                    {socials.map(social => (
                        <a
                            key={social.type}
                            href={social.href}
                            target='_blank'
                            rel='noopener noreferrer'
                            className={`campaigns-socials__item campaigns-socials__item--${social.type}`}
                            title={social.name}
                        >
                            <Icon type={social.type} />
                        </a>
                    ))}
                </div>
            </aside>

            <main className='campaigns-main'>
                <nav className='campaigns-nav'>
                    <button
                        className={`campaigns-nav__btn ${activeTab === 'start' ? 'campaigns-nav__btn--active' : ''}`}
                        onClick={() => setActiveTab('start')}
                    >
                        {localize('START HERE')}
                    </button>

                    <button
                        className={`campaigns-nav__btn ${activeTab === 'mentorship' ? 'campaigns-nav__btn--active' : ''}`}
                        onClick={() => setActiveTab('mentorship')}
                    >
                        {localize('BOOK MENTORSHIP')}
                    </button>
                </nav>

                <AnimatePresence mode='wait'>
                    {activeTab === 'start' ? (
                        <motion.section
                            key='start'
                            className='quick-guide-content'
                            initial={{ opacity: 0, y: 14 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -14 }}
                            transition={{ duration: 0.25 }}
                        >
                            <GuideCard
                                badge={localize('Official Guide')}
                                title={localize('Start With Guidance. Trade With Structure.')}
                                desc={localize(
                                    'Access the right trading path, mentorship, and automation support through the GTS Empire ecosystem.'
                                )}
                                image='/campaigns/gtsempire_welcome_enhanced.png'
                                alt={localize('Welcome to GTS Empire')}
                                actions={[
                                    {
                                        label: localize('START HERE'),
                                        href: 'https://gtstrader.app',
                                        primary: true,
                                    },
                                    {
                                        label: localize('BOOK MENTORSHIP'),
                                        href: 'https://gtstrader.app',
                                    },
                                ]}
                            />

                            <GuideCard
                                badge={localize('Choose Your Path')}
                                title={localize('Choose Your Trading Path')}
                                desc={localize(
                                    'Start with automation for structured trade execution, or build your skill through manual trading.'
                                )}
                                image='/campaigns/gtsempire_partner_summit.jpg'
                                alt={localize('Choose Your Trading Path')}
                                actions={[
                                    {
                                        label: localize('AUTOMATED TRADING'),
                                        href: 'https://gtstrader.app',
                                        primary: true,
                                    },
                                    {
                                        label: localize('MANUAL TRADING'),
                                        href: 'https://gtstrader.app',
                                    },
                                ]}
                            />
                        </motion.section>
                    ) : (
                        <motion.section
                            key='mentorship'
                            className='quick-guide-content'
                            initial={{ opacity: 0, y: 14 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -14 }}
                            transition={{ duration: 0.25 }}
                        >
                            <GuideCard
                                badge={localize('Premium Mentorship')}
                                title={localize('Accelerate Success. Master Trading With Professionals.')}
                                desc={localize(
                                    'Get structured mentorship designed to help you understand trading, choose the right path, manage risk, and build the discipline needed to approach the market with confidence.'
                                )}
                                image='/campaigns/gtsempire_mentorship_office.jpg'
                                alt={localize('GTS Empire Mentorship Program')}
                                actions={[
                                    {
                                        label: localize('BOOK MENTORSHIP'),
                                        href: 'https://gtstrader.app',
                                        primary: true,
                                    },
                                    {
                                        label: localize('EXPLORE COURSES'),
                                        href: 'https://gtstrader.app',
                                    },
                                ]}
                            />
                        </motion.section>
                    )}
                </AnimatePresence>
            </main>
        </div>
    );
});

export default Campaigns;