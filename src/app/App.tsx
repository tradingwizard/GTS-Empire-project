import { lazy, Suspense } from 'react';
import React from 'react';
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom';
import { cleanupUrl, handleOAuthCallback } from '@/external/deriv-core';
import ChunkLoader from '@/components/loader/chunk-loader';
import LocalStorageSyncWrapper from '@/components/localStorage-sync-wrapper';
import RoutePromptDialog from '@/components/route-prompt-dialog';
import { useAccountSwitching } from '@/hooks/useAccountSwitching';
import { useLanguageFromURL } from '@/hooks/useLanguageFromURL';
import { StoreProvider } from '@/hooks/useStore';
import { isPreviewMode, PREVIEW_BASE_PATH } from '@/utils/is-preview-mode';
import { localize, TranslationProvider } from '@deriv-com/translations';
import CoreStoreProvider from './CoreStoreProvider';
import i18nInstance from './i18n';
import './app-root.scss';

const Layout = lazy(() => import('../components/layout'));
const AppRoot = lazy(() => import('./app-root'));
const Home = lazy(() => import('../pages/home'));
const FreeBots = lazy(() => import('../pages/free-bots'));
const AnalysisTool = lazy(() => import('../pages/analysis-tool'));
const PremiumTools = lazy(() => import('../pages/premium-tools'));
const Endpoint = lazy(() => import('../pages/endpoint'));
const CallbackPage = lazy(() => import('../pages/callback'));

const LanguageHandler = ({ children }: { children: React.ReactNode }) => {
    useLanguageFromURL();
    return <>{children}</>;
};

const routerBasename = isPreviewMode() ? PREVIEW_BASE_PATH : undefined;

const TradingShell = () => (
    <Suspense fallback={<ChunkLoader message={localize('Please wait while we connect to the server...')} />}>
        <TranslationProvider defaultLang='EN' i18nInstance={i18nInstance}>
            <LanguageHandler>
                <StoreProvider>
                    <LocalStorageSyncWrapper>
                        <RoutePromptDialog />
                        <CoreStoreProvider>
                            <Layout />
                        </CoreStoreProvider>
                    </LocalStorageSyncWrapper>
                </StoreProvider>
            </LanguageHandler>
        </TranslationProvider>
    </Suspense>
);

const router = createBrowserRouter(
    createRoutesFromElements(
        <>
            <Route
                path='/'
                element={
                    <Suspense fallback={<ChunkLoader message={localize('Please wait while we connect to the server...')} />}>
                        <Home />
                    </Suspense>
                }
            />
            <Route path='/' element={<TradingShell />}>
                <Route path='dashboard' element={<AppRoot />} />
                <Route path='preview' element={<AppRoot />} />
                <Route path='endpoint' element={<Endpoint />} />
                <Route path='callback' element={<CallbackPage />} />
                <Route path='free-bots' element={<FreeBots />} />
                <Route path='analysis-tool' element={<AnalysisTool />} />
                <Route path='premium-tools' element={<PremiumTools />} />
            </Route>
        </>
    ),
    { basename: routerBasename }
);

function App() {
    useAccountSwitching();

    React.useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        if (!urlParams.has('code')) return;

        const handleCallback = async () => {
            try {
                const authInfo = await handleOAuthCallback(window.location.href, {
                    clientId:
                        process.env.NEXT_PUBLIC_DERIV_APP_ID ||
                        process.env.GTS_APP_ID ||
                        process.env.DERIV_APP_ID ||
                        '33bwKJisse4x97RR0zpa0',
                    redirectUri: window.location.origin,
                    scopes: 'trade',
                });

                const { DerivWSAccountsService } = await import('@/services/derivws-accounts.service');
                const accounts = await DerivWSAccountsService.fetchAccountsList(authInfo.access_token);

                if (accounts && accounts.length > 0) {
                    DerivWSAccountsService.storeAccounts(accounts);
                    const firstAccount = accounts[0];
                    localStorage.setItem('active_loginid', firstAccount.account_id);
                    const isDemo =
                        firstAccount.account_id.startsWith('VRT') || firstAccount.account_id.startsWith('VRTC');
                    localStorage.setItem('account_type', isDemo ? 'demo' : 'real');

                    const { api_base } = await import('@/external/bot-skeleton');
                    await api_base.init(true);
                    window.history.replaceState(window.history.state, '', '/dashboard');
                } else {
                    console.error('No accounts returned after authentication');
                    cleanupUrl(window.location.origin);
                }
            } catch (error) {
                console.error('OAuth callback error:', error);
                cleanupUrl(window.location.origin);
            }
        };

        handleCallback();
    }, []);

    return <RouterProvider router={router} />;
}

export default App;
