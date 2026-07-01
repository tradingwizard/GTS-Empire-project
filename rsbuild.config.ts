import { defineConfig, loadEnv } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';
import { pluginSass } from '@rsbuild/plugin-sass';

const path = require('path');

loadEnv({ mode: 'production' });
const smartchartsDist = path.join(
    path.dirname(require.resolve('@deriv-com/smartcharts-champion/package.json')),
    'dist'
);

export default defineConfig({
    plugins: [
        pluginSass({
            sassLoaderOptions: {
                sourceMap: true,
                sassOptions: {
                    // includePaths: [path.resolve(__dirname, 'src')],
                },
                // additionalData: `@use "${path.resolve(__dirname, 'src/components/shared/styles')}" as *;`,
            },
            exclude: /node_modules/,
        }),
        pluginReact(),
    ],
    source: {
        entry: {
            index: './src/main.tsx',
        },
        define: {
            'process.env': {
                NEXT_PUBLIC_DERIV_APP_ID: JSON.stringify(process.env.NEXT_PUBLIC_DERIV_APP_ID ?? process.env.GTS_APP_ID ?? process.env.DERIV_APP_ID ?? '33bwKJisse4x97RR0zpa0'),
                NEXT_PUBLIC_DERIV_APP_NAME: JSON.stringify(process.env.NEXT_PUBLIC_DERIV_APP_NAME ?? 'GTS Empire'),
                NEXT_PUBLIC_DERIV_ENV: JSON.stringify(process.env.NEXT_PUBLIC_DERIV_ENV ?? 'production'),
                NEXT_PUBLIC_DERIV_REFERRAL_LINK: JSON.stringify(process.env.NEXT_PUBLIC_DERIV_REFERRAL_LINK ?? ''),
                NEXT_PUBLIC_APP_BUILD: JSON.stringify(process.env.NEXT_PUBLIC_APP_BUILD ?? ''),
                TRANSLATIONS_CDN_URL: JSON.stringify(process.env.TRANSLATIONS_CDN_URL),
                R2_PROJECT_NAME: JSON.stringify(process.env.R2_PROJECT_NAME),
                CROWDIN_BRANCH_NAME: JSON.stringify(process.env.CROWDIN_BRANCH_NAME),
                TRACKJS_TOKEN: JSON.stringify(process.env.TRACKJS_TOKEN),
                APP_ENV: JSON.stringify(process.env.APP_ENV),
                REF_NAME: JSON.stringify(process.env.REF_NAME),
                COMMIT_REF: JSON.stringify(process.env.COMMIT_REF),
                REMOTE_CONFIG_URL: JSON.stringify(process.env.REMOTE_CONFIG_URL),
                GD_CLIENT_ID: JSON.stringify(process.env.GD_CLIENT_ID),
                GD_APP_ID: JSON.stringify(process.env.GD_APP_ID),
                GD_API_KEY: JSON.stringify(process.env.GD_API_KEY),
                DATADOG_SESSION_REPLAY_SAMPLE_RATE: JSON.stringify(process.env.DATADOG_SESSION_REPLAY_SAMPLE_RATE),
                DATADOG_SESSION_SAMPLE_RATE: JSON.stringify(process.env.DATADOG_SESSION_SAMPLE_RATE),
                DATADOG_APPLICATION_ID: JSON.stringify(process.env.DATADOG_APPLICATION_ID),
                DATADOG_CLIENT_TOKEN: JSON.stringify(process.env.DATADOG_CLIENT_TOKEN),
                RUDDERSTACK_KEY: JSON.stringify(process.env.RUDDERSTACK_KEY),
                GROWTHBOOK_CLIENT_KEY: JSON.stringify(process.env.GROWTHBOOK_CLIENT_KEY),
                GROWTHBOOK_DECRYPTION_KEY: JSON.stringify(process.env.GROWTHBOOK_DECRYPTION_KEY),
                GTS_APP_ID: JSON.stringify(process.env.GTS_APP_ID),
                DERIV_APP_ID: JSON.stringify(process.env.DERIV_APP_ID),
                DERIV_AUTH_URL: JSON.stringify(process.env.DERIV_AUTH_URL),
                DERIV_API_REST_BASE: JSON.stringify(process.env.DERIV_API_REST_BASE),
                DERIV_WS_BASE: JSON.stringify(process.env.DERIV_WS_BASE),
                DERIV_OAUTH_SCOPE: JSON.stringify(process.env.DERIV_OAUTH_SCOPE),
                DERIV_AFFILIATE_ID: JSON.stringify(process.env.DERIV_AFFILIATE_ID),
                DERIV_AFFILIATE_REFERRAL: JSON.stringify(process.env.DERIV_AFFILIATE_REFERRAL),
            },
        },
        alias: {
            '@': path.resolve(__dirname, './src'),
            react: path.resolve('./node_modules/react'),
            'react-dom': path.resolve('./node_modules/react-dom'),
            '@/external': path.resolve(__dirname, './src/external'),
            '@/components': path.resolve(__dirname, './src/components'),
            '@/hooks': path.resolve(__dirname, './src/hooks'),
            '@/utils': path.resolve(__dirname, './src/utils'),
            '@/constants': path.resolve(__dirname, './src/constants'),
            '@/stores': path.resolve(__dirname, './src/stores'),
        },
    },
    output: {
        copy: [
            {
                from: path.join(smartchartsDist, '*'),
                to: 'js/smartcharts/[name][ext]',
                globOptions: { ignore: ['**/*.LICENSE.txt'] },
            },
            { from: path.join(smartchartsDist, 'chart'), to: 'js/smartcharts/chart' },
            { from: path.join(smartchartsDist, 'assets'), to: 'js/smartcharts/assets' },
            { from: path.join(smartchartsDist, 'assets/*'), to: 'assets/[name][ext]' },
            { from: path.join(smartchartsDist, 'assets/fonts/*'), to: 'assets/fonts/[name][ext]' },
            { from: path.join(smartchartsDist, 'assets/shaders/*'), to: 'assets/shaders/[name][ext]' },
            { from: path.join(__dirname, 'public') },
        ],
        // Ensure service worker is not cached by the browser
        filename: {
            js: ({ chunk }) => {
                // Don't add hash to service worker
                if (chunk?.name === 'sw') {
                    return '[name].js';
                }
                return '[name].[contenthash:8].js';
            },
        },
    },
    html: {
        template: './index.html',
    },
    server: {
        port: 5000,
        host: '0.0.0.0',
        compress: true,
        headers: {
            'Cross-Origin-Opener-Policy': 'unsafe-none',
            'Cross-Origin-Embedder-Policy': 'unsafe-none',
            'Cache-Control': 'no-cache',
        },
        proxy: {
            '/api': {
                target: `http://localhost:${process.env.BACKEND_PORT || 3001}`,
                changeOrigin: true,
            },
        },
    },
    dev: {
        hmr: true,
    },
    tools: {
        rspack: {
            plugins: [],
            resolve: {},
            module: {
                rules: [
                    {
                        test: /\.xml$/,
                        exclude: /node_modules/,
                        use: 'raw-loader',
                    },
                ],
            },
        },
    },
});
