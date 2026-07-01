// src/components/risk-disclaimer/risk-disclaimer.tsx
import React, { useState } from 'react';
import Dialog from '@/components/shared_ui/dialog';
import { localize, Localize } from '@deriv-com/translations';
import './risk-disclaimer.scss';

const RiskDisclaimer = () => {
    const [is_popup_open, setIsPopupOpen] = useState(false);

    const openPopup = () => setIsPopupOpen(true);
    const closePopup = () => setIsPopupOpen(false);

    return (
        <>
            <button 
                className='risk-disclaimer-button'
                onClick={openPopup}
            >
                <Localize i18n_default_text='Risk Disclaimer' />
            </button>
            
            <Dialog
                className='risk-disclaimer-dialog'
                is_visible={is_popup_open}
                title={localize('Risk Disclaimer')}
                onClose={closePopup}
                onConfirm={closePopup}
                confirm_button_text={localize('I understand')}
                has_close_icon
                portal_element_id='modal_root'
            >
                <div className='risk-disclaimer-content'>  
                <h3><Localize i18n_default_text='Trading Risk Disclaimer' /></h3>  
                <p>  
                    <Localize i18n_default_text='Deriv offers complex derivatives, such as options and contracts for difference (“CFDs”). These products may not be suitable for all clients, and trading them puts you at risk. Please make sure that you understand the following risks before trading Deriv products: a) you may lose some or all of the money you invest in the trade, b) if your trade involves currency conversion, exchange rates will affect your profit and loss. You should never trade with borrowed money or with money that you cannot afford to lose.' />  
                </p>  
                  
            </div>  
            </Dialog>
        </>
    );
};

export default RiskDisclaimer;