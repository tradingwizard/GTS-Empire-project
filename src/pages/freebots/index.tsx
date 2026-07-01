import { useEffect, useMemo, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { useStore } from '@/hooks/useStore';
import { load, save_types } from '@/external/bot-skeleton';
import { DBOT_TABS } from '@/constants/bot-contents';
import { Localize } from '@deriv-com/translations';
import {
    LabelPairedPuzzlePieceTwoCaptionBoldIcon,
    LabelPairedPlusLgFillIcon,
    LabelPairedChartMixedCaptionBoldIcon,
    LabelPairedPlayCaptionBoldIcon,
    LabelPairedSearchCaptionBoldIcon,
    LabelPairedCircleInfoCaptionBoldIcon,
} from '@deriv/quill-icons/LabelPaired';
import './freebots.scss';

interface BotManifestItem {
    id: string;
    name: string;
    description: string;
    category: string;
    icon: string;
    status?: string;
    accuracy: number;
    isPremium: boolean;
    download_url?: string;
}

const FreeBots = observer(() => {
    const { dashboard } = useStore();
    const [bots, setBots] = useState<BotManifestItem[]>([]);
    const [loadingBotId, setLoadingBotId] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        // GTS Empire: no preloaded saved bots are shipped.
        // Approved bot XML files can be added later through /public/bots/manifest.json.
        setBots([]);
    }, []);

    const filteredBots = useMemo(() => {
        const query = searchTerm.toLowerCase().trim();

        if (!query) return bots;

        return bots.filter(
            bot =>
                bot.name.toLowerCase().includes(query) ||
                bot.description.toLowerCase().includes(query) ||
                bot.category.toLowerCase().includes(query)
        );
    }, [bots, searchTerm]);

    const handleLoadBot = async (bot: BotManifestItem) => {
        console.log('🚀 Loading bot:', bot);

        setLoadingBotId(bot.id);

        try {
            let xml_string = '';

            if (bot.download_url) {
                console.log('🌐 Downloading bot from dynamic URL:', bot.download_url);

                const response = await fetch(bot.download_url);
                xml_string = await response.text();
            } else {
                const paths = [
                    `/bots/${encodeURIComponent(bot.name)}`,
                    `/bots/${bot.name}`,
                    `/public/bots/${bot.name}`,
                    `/${bot.name}`,
                ];

                for (const path of paths) {
                    try {
                        console.log('🔎 Trying bot path:', path);

                        const res = await fetch(path);

                        if (res.ok) {
                            xml_string = await res.text();
                            console.log('✅ Bot XML found:', path);
                            break;
                        }
                    } catch (error) {
                        console.warn('⚠️ Bot path failed:', path, error);
                    }
                }
            }

            if (!xml_string) throw new Error('Bot strategy payload not found');

            const clean_name = bot.name.replace(/\.[^/.]+$/, '');

            await load({
                block_string: xml_string,
                file_name: clean_name,
                workspace: window.Blockly.derivWorkspace,
                from: save_types.LOCAL,
                strategy_id: bot.id,
                showIncompatibleStrategyDialog: false,
                drop_event: {},
                show_snackbar: true,
            } as any);

            console.log('✅ Bot loaded successfully:', clean_name);

            dashboard.setActiveTab(DBOT_TABS.BOT_BUILDER);
        } catch (error) {
            console.error('❌ Error loading bot:', error);
        } finally {
            setLoadingBotId(null);
        }
    };

    const getIcon = (iconName: string) => {
        const props = { width: '24px', height: '24px', fill: 'currentColor' };

        switch (iconName) {
            case 'ai':
                return <LabelPairedPlusLgFillIcon {...props} />;
            case 'chart':
                return <LabelPairedChartMixedCaptionBoldIcon {...props} />;
            default:
                return <LabelPairedPuzzlePieceTwoCaptionBoldIcon {...props} />;
        }
    };

    return (
        <div className='freebots-page'>
            <div className='freebots-page__grid-bg' />
            <div className='freebots-page__glow' />

            <section className='freebots-hero'>
                <div className='freebots-hero__copy'>
                    <span className='freebots-hero__eyebrow'>
                        <Localize i18n_default_text='GTS Empire Bot Library' />
                    </span>

                    <h1>
                        <Localize i18n_default_text='GTS Empire Trading Robots' />
                    </h1>

                    <p>
                        <Localize i18n_default_text='Approved GTS Empire trading robots will appear here when they are added. The page is ready, but no saved bots are published yet.' />
                    </p>
                </div>

                <div className='freebots-hero__panel'>
                    <div>
                        <span>
                            <Localize i18n_default_text='Published bots' />
                        </span>
                        <strong>{bots.length}</strong>
                    </div>
                    <div>
                        <span>
                            <Localize i18n_default_text='Showing' />
                        </span>
                        <strong>{filteredBots.length}</strong>
                    </div>
                    <div>
                        <span>
                            <Localize i18n_default_text='Status' />
                        </span>
                        <strong>
                            <Localize i18n_default_text='Empty' />
                        </strong>
                    </div>
                </div>
            </section>

            <section className='freebots-toolbar'>
                <div className='freebots-toolbar__search'>
                    <LabelPairedSearchCaptionBoldIcon className='freebots-toolbar__search-icon' />
                    <input
                        type='text'
                        placeholder='Search strategies, categories, or descriptions...'
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className='freebots-toolbar__hint'>
                    <LabelPairedCircleInfoCaptionBoldIcon width='14px' height='14px' />
                    <span>
                        <Localize i18n_default_text='Load any bot directly into Bot Builder.' />
                    </span>
                </div>
            </section>

            <section className='freebots-page__content'>
                {filteredBots.length > 0 ? (
                    <div className='freebots-page__grid'>
                        {filteredBots.map(bot => {
                            const cleanName = bot.name.replace(/\.[^/.]+$/, '').replace(/_/g, ' ');
                            const isLoading = loadingBotId === bot.id;

                            return (
                                <article key={bot.id} className='bot-card'>
                                    <div className='bot-card__shine' />

                                    <div className='bot-card__top'>
                                        <div className='bot-card__icon-wrapper'>{getIcon(bot.icon)}</div>

                                        <div className='bot-card__badges'>
                                            {bot.isPremium && <span className='bot-card__ribbon'>FREE</span>}
                                            {bot.status && (
                                                <span className={`bot-card__status bot-card__status--${bot.status.toLowerCase()}`}>
                                                    {bot.status}
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    <div className='bot-card__body'>
                                        <h3>{cleanName}</h3>
                                        <p>{bot.description}</p>
                                    </div>

                                    <div className='bot-card__stats'>
                                        <div className='bot-card__stat-header'>
                                            <span>Accuracy Rate</span>
                                            <strong>{bot.accuracy}%</strong>
                                        </div>

                                        <div className='bot-card__progress-bg'>
                                            <div className='bot-card__progress-fill' style={{ width: `${bot.accuracy}%` }} />
                                        </div>
                                    </div>

                                    <div className='bot-card__footer'>
                                        <div className='bot-card__category-pill'>
                                            <LabelPairedCircleInfoCaptionBoldIcon width='12px' height='12px' />
                                            <span>{bot.category}</span>
                                        </div>

                                        <button
                                            className={`bot-card__load-btn ${isLoading ? 'bot-card__load-btn--loading' : ''}`}
                                            onClick={() => handleLoadBot(bot)}
                                            disabled={loadingBotId !== null}
                                        >
                                            {isLoading ? (
                                                <div className='bot-card__loader' />
                                            ) : (
                                                <>
                                                    <LabelPairedPlayCaptionBoldIcon width='16px' height='16px' fill='currentColor' />
                                                    <span>Load Bot</span>
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </article>
                            );
                        })}
                    </div>
                ) : (
                    <div className='freebots-empty'>
                        <span>⌁</span>
                        <h3>No bots published yet</h3>
                        <p>Your approved GTS Empire bot XML files will appear here later.</p>
                    </div>
                )}

                <div className='premium-bot-banner'>
                    <div className='premium-bot-banner__inner'>
                        <div className='premium-bot-banner__info'>
                            <span className='premium-bot-banner__badge'>PREMIUM</span>
                            <h2 className='premium-bot-banner__title'>Premium Tools</h2>
                            <p className='premium-bot-banner__sub'>
                                Access approved GTS Empire premium tools when they are connected.
                            </p>
                        </div>

                        <a
                            href='https://gtstrader.app'
                            target='_blank'
                            rel='noopener noreferrer'
                            className='premium-bot-banner__btn'
                        >
                            ACCESS
                        </a>
                    </div>
                </div>
            </section>
        </div>
    );
});

export default FreeBots;