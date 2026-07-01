import React, { lazy, Suspense, useEffect, useState } from 'react';
import classNames from 'classnames';
import { observer } from 'mobx-react-lite';
import { useLocation, useNavigate } from 'react-router-dom';

import LoadingScreen from '@/components/loading-screen';
import { generateOAuthURL } from '@/components/shared';
import DesktopWrapper from '@/components/shared_ui/desktop-wrapper';
import Dialog from '@/components/shared_ui/dialog';
import MobileWrapper from '@/components/shared_ui/mobile-wrapper';
import Tabs from '@/components/shared_ui/tabs/tabs';
import TradeTypeConfirmationModal from '@/components/trade-type-confirmation-modal';
import TradingViewModal from '@/components/trading-view-chart/trading-view-modal';

import { DBOT_TABS, TAB_IDS } from '@/constants/bot-contents';
import { api_base, updateWorkspaceName } from '@/external/bot-skeleton';
import { CONNECTION_STATUS } from '@/external/bot-skeleton/services/api/observables/connection-status-stream';
import { isDbotRTL } from '@/external/bot-skeleton/utils/workspace';
import { useApiBase } from '@/hooks/useApiBase';
import { useStore } from '@/hooks/useStore';

import {
    disableUrlParameterApplication,
    enableUrlParameterApplication,
    setupTradeTypeChangeListener,
} from '@/utils/blockly-url-param-handler';

import {
    checkAndShowTradeTypeModal,
    getModalState,
    handleTradeTypeCancel,
    handleTradeTypeConfirm,
    resetUrlParamProcessing,
    setModalStateChangeCallback,
} from '@/utils/trade-type-modal-handler';

import { Localize, localize } from '@deriv-com/translations';
import { useDevice } from '@deriv-com/ui';

import RunPanel from '../../components/run-panel';
import Footer from '../../components/layout/footer';
import ChartModal from '../chart/chart-modal';
import Dashboard from '../dashboard';
import RunStrategy from '../dashboard/run-strategy';

import './main.scss';

const ChartWrapper = lazy(() => import('../chart/chart-wrapper'));
const DCircles = lazy(() => import('../dcircles'));
const FreeBots = lazy(() => import('../freebots'));
const AIHub = lazy(() => import('../ai-hub'));
const TradingView = lazy(() => import(/* webpackChunkName: "trading-view" */ '../trading-view'));
const RiskCalculator = lazy(() => import(/* webpackChunkName: "risk-calculator" */ '../risk-calculator'));
const LiveAnalysis = lazy(() => import(/* webpackChunkName: "live-analysis" */ '../live-analysis'));
const Tutorial = lazy(() => import('../tutorials'));
const Campaigns = lazy(() => import('../campaigns'));
const DTraderRedirect = lazy(() => import('../dtrader'));

type CustomIconProps = {
    fill?: string;
    height?: string;
    width?: string;
    className?: string;
};

const IconWrapper = ({ children, className }: { children: React.ReactNode; className?: string }) => (
    <span
        className={className}
        style={{
            display: 'inline-flex',
            width: '16px',
            height: '16px',
            alignItems: 'center',
            justifyContent: 'center',
        }}
    >
        {children}
    </span>
);

const AnalysisToolIcon = ({ fill = 'var(--text-general)', className }: CustomIconProps) => (
    <IconWrapper className={className}>
        <svg viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'>
            <path
                d='M19.5 21C21.5 21 22 19.5 22 19V5C22 4.5 21.5 3 19.5 3H4.5C2.5 3 2 4.5 2 5V19C2 19.5 2.5 21 4.5 21H19.5Z'
                stroke={fill}
                strokeWidth='1.5'
                fill='none'
                strokeLinecap='round'
                strokeLinejoin='round'
            />
            <path
                d='M6 9L10 17L14 13L18 17'
                stroke={fill}
                strokeWidth='1.5'
                fill='none'
                strokeLinecap='round'
                strokeLinejoin='round'
            />
        </svg>
    </IconWrapper>
);

const BotsIcon = ({ fill = 'var(--text-general)', className }: CustomIconProps) => (
    <IconWrapper className={className}>
        <svg viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'>
            <rect x='3' y='5' width='18' height='14' rx='2' stroke={fill} strokeWidth='1.5' fill='none' />
            <circle cx='8' cy='10' r='2' stroke={fill} strokeWidth='1.5' fill='none' />
            <circle cx='16' cy='10' r='2' stroke={fill} strokeWidth='1.5' fill='none' />
            <path d='M7 16H17' stroke={fill} strokeWidth='1.5' fill='none' strokeLinecap='round' />
            <path d='M12 2V5' stroke={fill} strokeWidth='1.5' fill='none' strokeLinecap='round' />
        </svg>
    </IconWrapper>
);

const CopyTradingIcon = ({ fill = 'var(--text-general)', className }: CustomIconProps) => (
    <IconWrapper className={className}>
        <svg viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'>
            <path
                d='M15 3H9C7.89543 3 7 3.89543 7 5V17C7 18.1046 7.89543 19 9 19H15C16.1046 19 17 18.1046 17 17V5C17 3.89543 16.1046 3 15 3Z'
                stroke={fill}
                strokeWidth='1.5'
                fill='none'
            />
            <path
                d='M17 10H20C21.1046 10 22 10.8954 22 12V19C22 20.1046 21.1046 21 20 21H14'
                stroke={fill}
                strokeWidth='1.5'
                fill='none'
                strokeLinecap='round'
                strokeLinejoin='round'
            />
            <path
                d='M7 14H4C2.89543 14 2 13.1046 2 12V5C2 3.89543 2.89543 3 4 3H10'
                stroke={fill}
                strokeWidth='1.5'
                fill='none'
                strokeLinecap='round'
                strokeLinejoin='round'
            />
        </svg>
    </IconWrapper>
);

const TradingViewIcon = ({ fill = 'var(--text-general)', className }: CustomIconProps) => (
    <IconWrapper className={className}>
        <svg viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'>
            <path d='M2 12H22' stroke={fill} strokeWidth='1.5' fill='none' strokeLinecap='round' />
            <path
                d='M8 5L12 9L16 5'
                stroke={fill}
                strokeWidth='1.5'
                fill='none'
                strokeLinecap='round'
                strokeLinejoin='round'
            />
            <path
                d='M8 19L12 15L16 19'
                stroke={fill}
                strokeWidth='1.5'
                fill='none'
                strokeLinecap='round'
                strokeLinejoin='round'
            />
            <circle cx='7' cy='12' r='2' stroke={fill} strokeWidth='1.5' fill='none' />
            <circle cx='17' cy='12' r='2' stroke={fill} strokeWidth='1.5' fill='none' />
        </svg>
    </IconWrapper>
);

const RiskManagerIcon = ({ fill = 'var(--text-general)', className }: CustomIconProps) => (
    <IconWrapper className={className}>
        <svg viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'>
            <path
                d='M12 4L4 8L12 12L20 8L12 4Z'
                stroke={fill}
                strokeWidth='1.5'
                fill='none'
                strokeLinecap='round'
                strokeLinejoin='round'
            />
            <path
                d='M4 16L12 20L20 16'
                stroke={fill}
                strokeWidth='1.5'
                fill='none'
                strokeLinecap='round'
                strokeLinejoin='round'
            />
            <path
                d='M4 12L12 16L20 12'
                stroke={fill}
                strokeWidth='1.5'
                fill='none'
                strokeLinecap='round'
                strokeLinejoin='round'
            />
        </svg>
    </IconWrapper>
);

const GuideIcon = ({ fill = 'var(--text-general)', className }: CustomIconProps) => (
    <IconWrapper className={className}>
        <svg viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'>
            <path
                d='M5 4.5C5 3.67157 5.67157 3 6.5 3H18.5C19.3284 3 20 3.67157 20 4.5V19.5C20 20.3284 19.3284 21 18.5 21H6.5C5.67157 21 5 20.3284 5 19.5V4.5Z'
                stroke={fill}
                strokeWidth='1.5'
                fill='none'
            />
            <path d='M8 7H17' stroke={fill} strokeWidth='1.5' strokeLinecap='round' />
            <path d='M8 11H17' stroke={fill} strokeWidth='1.5' strokeLinecap='round' />
            <path d='M8 15H13' stroke={fill} strokeWidth='1.5' strokeLinecap='round' />
        </svg>
    </IconWrapper>
);

const SuspenseWithLoader = ({ children }: { children: React.ReactNode }) => {
    console.log('⏳ Lazy tab loading with custom LoadingScreen...');

    return <Suspense fallback={<LoadingScreen />}>{children}</Suspense>;
};

const AppWrapper = observer(() => {
    const { connectionStatus } = useApiBase();
    const { dashboard, load_modal, run_panel, quick_strategy, summary_card, blockly_store } = useStore();
    const { is_loading } = blockly_store;

    const {
        active_tab,
        active_tour,
        is_chart_modal_visible,
        is_trading_view_modal_visible,
        setActiveTab,
        setWebSocketState,
        setActiveTour,
        setTourDialogVisibility,
    } = dashboard;

    const { dashboard_strategies } = load_modal;

    const {
        is_dialog_open,
        is_drawer_open,
        dialog_options,
        onCancelButtonClick,
        onCloseDialog,
        onOkButtonClick,
        stopBot,
    } = run_panel;

    const { is_open } = quick_strategy;
    const { cancel_button_text, ok_button_text, title, message, dismissable, is_closed_on_cancel } =
        dialog_options as {
            [key: string]: string;
        };

    const { clear } = summary_card;
    const { DASHBOARD, BOT_BUILDER } = DBOT_TABS;

    const init_render = React.useRef(true);

    const hash = [
        'campaigns',
        'dashboard',
        'bot_builder',
        'chart',
        'dcircles',
        'freebots',
        'ai-hub',
        'dtrader',
        'trading-view',
        'risk-calculator',
        'live-analysis',
        'tutorial',
    ];

    const { isDesktop } = useDevice();
    const location = useLocation();
    const navigate = useNavigate();

    const [tradeTypeModalState, setTradeTypeModalState] = useState(getModalState());

    const getTradeTypeModalProps = () => {
        const { tradeTypeData } = tradeTypeModalState;

        return {
            is_visible: tradeTypeModalState.isVisible,
            trade_type_display_name: tradeTypeData?.displayName || '',
            current_trade_type: tradeTypeData?.currentTradeType
                ? `${tradeTypeData.currentTradeType.tradeTypeCategory}/${tradeTypeData.currentTradeType.tradeType}`
                : 'N/A',
            current_trade_type_display_name: tradeTypeData?.currentTradeTypeDisplayName || 'N/A',
            onConfirm: handleTradeTypeConfirm,
            onCancel: handleTradeTypeCancel,
        };
    };

    let tab_value: number | string = active_tab;

    const GetHashedValue = (tab: number) => {
        tab_value = location.hash?.split('#')[1];
        if (!tab_value) return tab;
        return Number(hash.indexOf(String(tab_value)));
    };

    const active_hash_tab = GetHashedValue(active_tab);

    React.useEffect(() => {
        console.log('🧩 Setting trade type modal state callback');

        setModalStateChangeCallback(new_state => {
            setTradeTypeModalState(new_state);
        });
    }, [is_loading]);

    React.useEffect(() => {
        console.log('🔁 Location search changed. Resetting URL param processing...');
        resetUrlParamProcessing();
    }, [location.search]);

    React.useEffect(() => {
        if (connectionStatus !== CONNECTION_STATUS.OPENED) {
            const is_bot_running = document.getElementById('db-animation__stop-button') !== null;

            console.warn('⚠️ WebSocket not opened. Checking running bot state...', {
                connectionStatus,
                is_bot_running,
            });

            if (is_bot_running) {
                console.warn('🛑 Stopping bot because socket disconnected');
                clear();
                stopBot();
                api_base.setIsRunning(false);
                setWebSocketState(false);
            }
        } else {
            console.log('✅ WebSocket connection opened');
        }
    }, [clear, connectionStatus, setWebSocketState, stopBot]);

    React.useEffect(() => {
        let pollTimeoutId: ReturnType<typeof setTimeout> | null = null;

        if (active_tab === BOT_BUILDER) {
            console.log('🧱 Bot Builder tab active. Preparing trade type URL handling...');

            requestAnimationFrame(() => {
                disableUrlParameterApplication();
                setupTradeTypeChangeListener();

                const handleTradeTypeModal = () => {
                    console.log('🔎 Checking whether trade type modal should show...');

                    checkAndShowTradeTypeModal(
                        () => {
                            console.log('✅ Trade type confirmed. Re-enabling URL parameters...');
                            enableUrlParameterApplication();
                        },
                        () => {
                            console.log('🚫 Trade type change cancelled');
                        }
                    );
                };

                if (!blockly_store.is_loading) {
                    setTimeout(() => {
                        handleTradeTypeModal();
                    }, 500);
                } else {
                    let pollAttempts = 0;
                    const maxPollAttempts = 10;

                    const checkBlocklyLoaded = () => {
                        if (!blockly_store.is_loading) {
                            console.log('✅ Blockly finished loading. Checking URL parameters...');
                            handleTradeTypeModal();
                            return;
                        }

                        if (pollAttempts < maxPollAttempts) {
                            pollAttempts++;
                            console.log(`⏳ Waiting for Blockly to finish loading... attempt ${pollAttempts}/10`);
                            pollTimeoutId = setTimeout(checkBlocklyLoaded, 500);
                        } else {
                            console.warn(
                                '⚠️ Blockly loading timeout after 5 seconds - proceeding without URL parameter check'
                            );
                        }
                    };

                    checkBlocklyLoaded();
                }
            });
        }

        return () => {
            if (pollTimeoutId) {
                console.log('🧹 Clearing Blockly poll timeout');
                clearTimeout(pollTimeoutId);
                pollTimeoutId = null;
            }
        };
    }, [active_tab, is_loading, blockly_store, BOT_BUILDER]);

    const handleTabChange = React.useCallback(
        (tab_index: number) => {
            console.log('🧭 Switching tab:', {
                tab_index,
                hash: hash[tab_index],
            });

            setActiveTab(tab_index);

            const el_id = TAB_IDS[tab_index];

            if (el_id) {
                const el_tab = document.getElementById(el_id);

                setTimeout(() => {
                    el_tab?.scrollIntoView({
                        behavior: 'smooth',
                        block: 'center',
                        inline: 'center',
                    });
                }, 10);
            }
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [active_tab]
    );

    React.useEffect(() => {
        if (is_open) {
            console.log('⚡ Quick strategy open. Hiding tour dialog...');
            setTourDialogVisibility(false);
        }

        if (init_render.current) {
            console.log('🚀 First render. Setting active tab from hash:', active_hash_tab);

            setActiveTab(Number(active_hash_tab));

            if (!isDesktop) {
                handleTabChange(Number(active_hash_tab));
            }

            init_render.current = false;
        } else {
            const currentSearch = window.location.search;
            const nextHash = hash[active_tab] || hash[0];

            console.log('🔗 Updating URL hash:', nextHash);
            navigate(`${currentSearch}#${nextHash}`);
        }

        if (active_tour !== '') {
            console.log('🧹 Clearing active tour');
            setActiveTour('');
        }

        const mainElement = document.querySelector('.main__container');
        const scrollLockedTabs = [DBOT_TABS.TUTORIAL];

        if (scrollLockedTabs.includes(active_tab) && !isDesktop) {
            document.body.style.overflow = 'hidden';

            if (mainElement instanceof HTMLElement) {
                mainElement.classList.add('no-scroll');
            }
        } else {
            document.body.style.overflow = '';

            if (mainElement instanceof HTMLElement) {
                mainElement.classList.remove('no-scroll');
            }
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [active_tab]);

    React.useEffect(() => {
        const trashcan_init_id = setTimeout(() => {
            if (active_tab === BOT_BUILDER && (Blockly as any)?.derivWorkspace?.trashcan) {
                const trashcanY = window.innerHeight - 250;
                let trashcanX;

                if (is_drawer_open) {
                    trashcanX = isDbotRTL() ? 380 : window.innerWidth - 460;
                } else {
                    trashcanX = isDbotRTL() ? 20 : window.innerWidth - 100;
                }

                console.log('🗑️ Moving Blockly trashcan:', {
                    trashcanX,
                    trashcanY,
                    is_drawer_open,
                });

                (Blockly as any)?.derivWorkspace?.trashcan?.setTrashcanPosition(trashcanX, trashcanY);
            }
        }, 100);

        return () => {
            clearTimeout(trashcan_init_id);
        };

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [active_tab, is_drawer_open]);

    useEffect(() => {
        let timer: ReturnType<typeof setTimeout>;

        if (dashboard_strategies.length > 0) {
            timer = setTimeout(() => {
                console.log('📝 Updating workspace name...');
                updateWorkspaceName();
            });
        }

        return () => {
            if (timer) clearTimeout(timer);
        };
    }, [dashboard_strategies, active_tab]);

    const handleLoginGeneration = async () => {
        console.log('🔐 Generating OAuth URL...');

        const oauthUrl = await generateOAuthURL();

        if (oauthUrl) {
            console.log('✅ OAuth URL generated. Redirecting...');
            window.location.replace(oauthUrl);
        } else {
            console.error('❌ Failed to generate OAuth URL');
        }
    };

    const modalProps = getTradeTypeModalProps();

    return (
        <React.Fragment>
            <div className='main'>
                <div
                    className={classNames('main__container', {
                        'main__container--active': active_tour && active_tab === DASHBOARD && !isDesktop,
                    })}
                >
                    <Tabs
                        active_index={active_tab}
                        className='main__tabs'
                        onTabItemClick={handleTabChange}
                        top
                        history={window.history as any}
                    >
                        <div
                            label={
                                <>
                                    <GuideIcon />
                                    <Localize i18n_default_text='Quick Guide' />
                                </>
                            }
                            id='id-campaigns'
                        >
                            <SuspenseWithLoader>
                                <Campaigns />
                            </SuspenseWithLoader>
                        </div>

                        <div
                            label={
                                <>
                                    <AnalysisToolIcon />
                                    <Localize i18n_default_text='Dashboard' />
                                </>
                            }
                            id='id-dbot-dashboard'
                        >
                            <Dashboard handleTabChange={handleTabChange} />
                        </div>

                        <div
                            label={
                                <>
                                    <BotsIcon />
                                    <Localize i18n_default_text='Bot Builder' />
                                </>
                            }
                            id='id-bot-builder'
                        />

                        <div
                            label={
                                <>
                                    <AnalysisToolIcon />
                                    <Localize i18n_default_text='Charts' />
                                </>
                            }
                            id={
                                is_chart_modal_visible || is_trading_view_modal_visible
                                    ? 'id-charts--disabled'
                                    : 'id-charts'
                            }
                        >
                            <SuspenseWithLoader>
                                <ChartWrapper show_digits_stats={false} />
                            </SuspenseWithLoader>
                        </div>

                        <div
                            label={
                                <>
                                    <CopyTradingIcon />
                                    <Localize i18n_default_text='DCircles' />
                                </>
                            }
                            id='id-dcircles'
                        >
                            <SuspenseWithLoader>
                                <DCircles />
                            </SuspenseWithLoader>
                        </div>

                        <div
                            label={
                                <>
                                    <BotsIcon />
                                    <Localize i18n_default_text='Trading Robots' />
                                </>
                            }
                            id='id-freebots'
                        >
                            <SuspenseWithLoader>
                                <FreeBots />
                            </SuspenseWithLoader>
                        </div>

                        <div
                            label={
                                <>
                                    <AnalysisToolIcon />
                                    <Localize i18n_default_text='AI Hub' />
                                </>
                            }
                            id='id-ai-hub'
                        >
                            <SuspenseWithLoader>
                                <AIHub />
                            </SuspenseWithLoader>
                        </div>

                        <div
                            label={
                                <>
                                    <GuideIcon />
                                    <Localize i18n_default_text='DTrader' />
                                </>
                            }
                            id='id-dtrader'
                        >
                            <SuspenseWithLoader>
                                <DTraderRedirect />
                            </SuspenseWithLoader>
                        </div>

                        <div
                            label={
                                <>
                                    <TradingViewIcon />
                                    <Localize i18n_default_text='TradingView' />
                                </>
                            }
                            id='id-trading-view'
                        >
                            <SuspenseWithLoader>
                                <TradingView />
                            </SuspenseWithLoader>
                        </div>

                        <div
                            label={
                                <>
                                    <RiskManagerIcon />
                                    <Localize i18n_default_text='Risk Calculator' />
                                </>
                            }
                            id='id-risk-calculator'
                        >
                            <SuspenseWithLoader>
                                <RiskCalculator />
                            </SuspenseWithLoader>
                        </div>

                        <div
                            label={
                                <>
                                    <AnalysisToolIcon />
                                    <Localize i18n_default_text='Live Analysis' />
                                </>
                            }
                            id='id-live-analysis'
                        >
                            <SuspenseWithLoader>
                                <LiveAnalysis />
                            </SuspenseWithLoader>
                        </div>

                        <div
                            label={
                                <>
                                    <GuideIcon />
                                    <Localize i18n_default_text='Tutorials' />
                                </>
                            }
                            id='id-tutorials'
                        >
                            <div className='tutorials-wrapper'>
                                <SuspenseWithLoader>
                                    <Tutorial handleTabChange={handleTabChange} />
                                </SuspenseWithLoader>
                            </div>
                        </div>
                    </Tabs>
                </div>
            </div>

            <DesktopWrapper>
                <div
                    className={classNames('main__run-strategy-wrapper', {
                        'main__run-strategy-wrapper--minimized': run_panel.is_run_panel_minimized,
                    })}
                >
                    <RunStrategy />
                    <RunPanel />
                </div>

                <ChartModal />
                <TradingViewModal />
            </DesktopWrapper>

            <MobileWrapper>{!is_open && <RunPanel />}</MobileWrapper>

            <Dialog
                cancel_button_text={cancel_button_text || localize('Cancel')}
                className='dc-dialog__wrapper--fixed'
                confirm_button_text={ok_button_text || localize('Ok')}
                has_close_icon
                is_mobile_full_width={false}
                is_visible={is_dialog_open}
                onCancel={onCancelButtonClick ?? undefined}
                onClose={onCloseDialog ?? undefined}
                onConfirm={(onOkButtonClick || onCloseDialog) ?? undefined}
                portal_element_id='modal_root'
                title={title}
                login={handleLoginGeneration}
                dismissable={!!dismissable}
                is_closed_on_cancel={!!is_closed_on_cancel}
            >
                {message}
            </Dialog>

            <TradeTypeConfirmationModal
                is_visible={modalProps.is_visible}
                trade_type_display_name={modalProps.trade_type_display_name}
                current_trade_type={modalProps.current_trade_type}
                current_trade_type_display_name={modalProps.current_trade_type_display_name}
                onConfirm={modalProps.onConfirm}
                onCancel={modalProps.onCancel}
            />

            <DesktopWrapper>
                <Footer />
            </DesktopWrapper>
        </React.Fragment>
    );
});

export default AppWrapper;