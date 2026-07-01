import React from 'react';
import { observer } from 'mobx-react-lite';
import './risk-calculator.scss';

const RiskCalculator = observer(() => {
    return (
        <div className='risk-calculator-page'>
            <div className='rc-header'>
                <div className='rc-header__title'>
                    <h2>Risk Management Calculator</h2>
                    <p>Calculate your risk parameters, lot sizes, and target goals</p>
                </div>
            </div>
            <div className='rc-content'>
                <div className='rc-iframe-wrapper glass'>
                    <iframe
                        src='https://gtstrader.app'
                        title='GTS Empire Risk Management Calculator'
                        className='rc-iframe'
                        frameBorder='0'
                        allowFullScreen
                    />
                </div>
            </div>
        </div>
    );
});

export default RiskCalculator;
