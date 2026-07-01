// import { lazy, Suspense, useEffect, useRef, useState } from 'react';
// import { observer } from 'mobx-react-lite';
// import ErrorBoundary from '@/components/error-component/error-boundary';
// import ErrorComponent from '@/components/error-component/error-component';
// import LoadingScreen from '@/components/loading-screen';
// import LandingPage from '@/components/landing-page';

// import { api_base } from '@/external/bot-skeleton';
// import { useStore } from '@/hooks/useStore';
// import { AnimatePresence } from 'framer-motion';
// import './app-root.scss';

// const AppContent = lazy(() => import('./app-content'));

// const AppRootLoader = () => {
//     console.log('⏳ Showing loading screen...');
//     return <LoadingScreen />;
// };

// const ErrorComponentWrapper = observer(() => {
//     const { common } = useStore();

//     if (!common.error) return null;

//     console.log('🚨 Showing app error:', common.error);

//     return (
//         <ErrorComponent
//             header={common.error?.header}
//             message={common.error?.message}
//             redirect_label={common.error?.redirect_label}
//             redirectOnClick={common.error?.redirectOnClick}
//             should_clear_error_on_click={common.error?.should_clear_error_on_click}
//             setError={common.setError}
//             redirect_to={common.error?.redirect_to}
//             should_redirect={common.error?.should_redirect}
//         />
//     );
// });

// const AppRoot = () => {
//     const store = useStore();
//     const api_base_initialized = useRef(false);

//     const [is_api_initialized, setIsApiInitialized] = useState(false);
//     const [show_landing_page, setShowLandingPage] = useState(true);

//     useEffect(() => {
//         console.log('🚀 Landing page animation started...');

//         const timer = setTimeout(() => {
//             console.log('✅ Landing page animation finished');
//             setShowLandingPage(false);
//         }, 3500);

//         return () => clearTimeout(timer);
//     }, []);

//     useEffect(() => {
//         const timeout_id = setTimeout(() => {
//             if (!is_api_initialized) {
//                 console.warn('⚠️ API init timeout reached. Continuing app startup...');
//                 setIsApiInitialized(true);
//             }
//         }, 8000);

//         const initializeApi = async () => {
//             if (api_base_initialized.current) return;

//             try {
//                 console.log('🔌 Initializing API base...');
//                 await api_base.init();

//                 api_base_initialized.current = true;
//                 console.log('✅ API base initialized');
//             } catch (error) {
//                 console.error('❌ API initialization failed:', error);
//                 api_base_initialized.current = false;
//             } finally {
//                 setIsApiInitialized(true);
//                 clearTimeout(timeout_id);
//             }
//         };

//         initializeApi();

//         return () => clearTimeout(timeout_id);
//     }, [is_api_initialized]);

//     if (!store) return <AppRootLoader />;

//     return (
//         <Suspense fallback={<AppRootLoader />}>
//             <AnimatePresence mode="wait">
//                 {show_landing_page && <LandingPage />}
//             </AnimatePresence>

//             {!show_landing_page && (
//                 <ErrorBoundary root_store={store}>
//                     <ErrorComponentWrapper />
//                     {!is_api_initialized ? <AppRootLoader /> : <AppContent />}
//                 </ErrorBoundary>
//             )}
//         </Suspense>
//     );
// };

// export default AppRoot;

import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import { observer } from 'mobx-react-lite';
import ErrorBoundary from '@/components/error-component/error-boundary';
import ErrorComponent from '@/components/error-component/error-component';
import TradingAssesmentModal from '@/components/trading-assesment-modal';
import { api_base } from '@/external/bot-skeleton';
import { useStore } from '@/hooks/useStore';
import { localize } from '@deriv-com/translations';
import LoadingScreen from '@/components/loading-screen';
import LandingPage from '@/components/landing-page';
import RiskDisclaimer from '@/components/risk-disclaimer';
import './app-root.scss';

const AppContent = lazy(() => import('./app-content'));

const ErrorComponentWrapper = observer(() => {
    const { common } = useStore();

    if (!common.error) return null;

    return (
        <ErrorComponent
            header={common.error?.header}
            message={common.error?.message}
            redirect_label={common.error?.redirect_label}
            redirectOnClick={common.error?.redirectOnClick}
            should_clear_error_on_click={common.error?.should_clear_error_on_click}
            setError={common.setError}
            redirect_to={common.error?.redirect_to}
            should_redirect={common.error?.should_redirect}
        />
    );
});

const AppRoot = () => {
    const store = useStore();
    const api_base_initialized = useRef(false);
    const [is_api_initialized, setIsApiInitialized] = useState(false);
    const [show_landing_page, setShowLandingPage] = useState(false);
    const [show_app_content, setShowAppContent] = useState(false);

    useEffect(() => {
        const initializeApi = async () => {
            if (!api_base_initialized.current) {
                // Add a minimum delay of 2.5 seconds for the loading screen
                const startTime = Date.now();
                await api_base.init();
                
                const apiInitTime = Date.now() - startTime;
                const remainingDelay = Math.max(0, 2500 - apiInitTime);
                
                // Wait for the remaining time if API initialized quickly
                setTimeout(() => {
                    api_base_initialized.current = true;
                    setIsApiInitialized(true);
                }, remainingDelay);
            }
        };

        initializeApi();
    }, []);

    // Handle loading screen completion
    const handleLoadingComplete = () => {
        setShowLandingPage(true);
    };

    // Handle start button click on landing page
    const handleStartClick = () => {
        setShowLandingPage(false);
        setShowAppContent(true);
    };

    if (!store || !is_api_initialized) {
        return <LoadingScreen onLoadingComplete={handleLoadingComplete} />;
    }
    
    if (show_landing_page) {
        return <LandingPage onStart={handleStartClick} />;
    }
    
    if (!show_app_content) {
        return <LoadingScreen onLoadingComplete={handleLoadingComplete} />;
    }

    return (
        <Suspense fallback={<LoadingScreen />}>
            <ErrorBoundary root_store={store}>
                <ErrorComponentWrapper />
                 <RiskDisclaimer /> 
                <AppContent />
                <TradingAssesmentModal />
               
            </ErrorBoundary>
        </Suspense>
    );
};

export default AppRoot;