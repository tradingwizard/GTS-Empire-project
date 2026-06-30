# GTS Empire Trading App

Clean GTS Empire Deriv-powered trading bot platform.

## Project status

- Brand: GTS Empire
- Official Deriv OAuth App ID: `33bwKJisse4x97RR0zpa0`
- Deployment target: Netlify
- Backend route: `/api/*` through Netlify Functions
- Old saved/preloaded Free Bots XML files removed
- Free Tools page remains ready for your future approved bots
- Legacy DBot app IDs removed from active configuration

## Local development

```bash
npm install
npm run start
```

This starts:

- backend proxy server on port `3001`
- Rsbuild frontend dev server on port `5000`

## Production build

```bash
npm run build
npm run start:prod
```

## Netlify deployment

Use these settings:

```text
Build command: npm run build
Publish directory: dist
Functions directory: netlify/functions
```

The included `netlify.toml` already contains the build settings and redirects `/api/*` to the Netlify Function.

## Environment variables

Copy `.env.example` and set the same values in Netlify environment variables for production. Do not commit private values.

Required values:

```text
GTS_APP_ID=33bwKJisse4x97RR0zpa0
DERIV_APP_ID=33bwKJisse4x97RR0zpa0
DERIV_WS_APP_ID=33bwKJisse4x97RR0zpa0
DERIV_AUTH_URL=https://auth.deriv.com/oauth2/auth
DERIV_AUTH_BASE=https://auth.deriv.com
DERIV_API_REST_BASE=https://api.derivws.com
DERIV_API_BASE=https://api.derivws.com
DERIV_OAUTH_SCOPE=trade account_manage
```

Optional values:

```text
DERIV_AFFILIATE_ID=your_affiliate_id
DERIV_AFFILIATE_REFERRAL=your_referral_code
```

## Adding future bots

1. Add approved XML bot files inside `public/bots/`.
2. Register each bot inside `src/pages/free-bots/index.tsx`.
3. Test every bot on demo before publishing it to users.

## Safety note

Do not enable real-money trading for users until OAuth login, account loading, WebSocket connection, proposal, buy, sell, and contract tracking are tested end-to-end on demo accounts.
