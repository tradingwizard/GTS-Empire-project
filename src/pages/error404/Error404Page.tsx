import React from 'react';
import { useNavigate } from 'react-router-dom';
import { localize } from '@deriv-com/translations';
import './error404.scss';

const Error404Page = () => {
    const navigate = useNavigate();

    return (
        <div className='error-404-page'>
            <div className='error-404-page__overlay'>
                <div className='error-404-page__container'>
                    <div className='error-404-page__icon'>
                        <span>404</span>
                    </div>
                    <h1 className='error-404-page__title'>{localize('Page Not Found')}</h1>
                    <p className='error-404-page__description'>
                        {localize("The page you are looking for doesn't exist or has been moved.")}
                    </p>
                    <button className='error-404-page__button' onClick={() => navigate('/', { replace: true })}>
                        {localize('Back to Dashboard')}
                    </button>

                    <div className='error-404-page__bg-elements'>
                        <div className='error-404-page__glow error-404-page__glow--1'></div>
                        <div className='error-404-page__glow error-404-page__glow--2'></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Error404Page;
