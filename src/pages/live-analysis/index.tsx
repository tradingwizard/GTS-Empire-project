import React from 'react';
import { observer } from 'mobx-react-lite';
import './live-analysis.scss';

const LiveAnalysis = observer(() => {
    return (
        <div className='live-analysis-page'>
            <div className='la-header'>
                <div className='la-header__title'>
                    <h2>Live Analysis</h2>
                    <p>Real-time market analysis and prediction tools</p>
                </div>
            </div>
            <div className='la-content'>
                <div className='la-iframe-wrapper glass'>
                    <iframe
                        src='https://gtstrader.app'
                        title='GTS Empire Live Analysis'
                        className='la-iframe'
                        frameBorder='0'
                        allowFullScreen
                    />
                </div>
            </div>
        </div>
    );
});

export default LiveAnalysis;
