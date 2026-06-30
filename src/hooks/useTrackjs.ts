import { TrackJS } from 'trackjs';

const { TRACKJS_TOKEN } = process.env;

/**
 * Custom hook to initialize TrackJS.
 * @returns {Object} An object containing the `init` function.
 */
const useTrackjs = () => {
    const isProduction = process.env.APP_ENV === 'production';
    const trackjs_version = process.env.REF_NAME ?? 'undefined';

    const initTrackJS = (loginid: string) => {
        try {
            // TrackJS is optional. The cleaned GTS Empire build does not ship
            // with a TrackJS token, so do not install it unless a real token is
            // provided. This removes the noisy "TrackJS: missing token" console
            // warning without affecting Deriv/API functionality.
            if (!isProduction || !TRACKJS_TOKEN) return;

            if (!TrackJS.isInstalled()) {
                TrackJS.install({
                    application: 'gts-empire',
                    dedupe: false,
                    enabled: true,
                    token: TRACKJS_TOKEN,
                    userId: loginid,
                    version:
                        (document.querySelector('meta[name=version]') as HTMLMetaElement)?.content ?? trackjs_version,
                });
            }
        } catch (error) {
            // eslint-disable-next-line no-console
            console.error('Failed to initialize TrackJS', error);
        }
    };

    return { initTrackJS };
};

export default useTrackjs;
