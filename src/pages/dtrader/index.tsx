import React, { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { localize } from '@deriv-com/translations';
import { LabelPairedPlayCaptionBoldIcon } from '@deriv/quill-icons/LabelPaired';
import './dtrader.scss';

const DTraderRedirect = observer(() => {
    const url = 'https://trader.gtstrader.app/';

    const handleRedirect = () => {
        window.open(url, '_blank');
    };

    useEffect(() => {
        // Automatically open the external link once when the tab loads
        handleRedirect();
    }, []);

    return (
        <div className='dtrader-redirect-page'>
            <div className='dtrader-redirect-page__overlay' />
            <div className='dtrader-redirect-card'>
                <div className='dtrader-redirect-card__logo'>
                    <div className='logo-glowing-ring'>
                        <span className='logo-text'>Z</span>
                    </div>
                </div>
                <h1 className='dtrader-redirect-card__title'>{localize('Opening DTrader...')}</h1>
                <p className='dtrader-redirect-card__subtitle'>
                    {localize('Experience institutional-grade execution on our standalone trading engine.')}
                </p>

                <div className='dtrader-redirect-card__prompt-box'>
                    <p className='prompt-text'>
                        {localize('We are opening the platform in a secure external tab.')}
                    </p>
                    <p className='prompt-subtext'>
                        {localize("If the window didn't open automatically, please click the button below:")}
                    </p>
                </div>

                <button className='dtrader-redirect-card__button' onClick={handleRedirect}>
                    <LabelPairedPlayCaptionBoldIcon width='20px' height='20px' fill='white' />
                    <span>{localize('Click Here to Open DTrader')}</span>
                </button>

                <div className='dtrader-redirect-card__footer'>
                    <span>&copy; {new Date().getFullYear()} GTS Empire. All rights reserved.</span>
                </div>
            </div>
        </div>
    );
});

export default DTraderRedirect;
