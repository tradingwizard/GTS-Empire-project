import classNames from 'classnames';
import { observer } from 'mobx-react-lite';
import Text from '@/components/shared_ui/text';
import { useStore } from '@/hooks/useStore';
import { localize } from '@deriv-com/translations';
import { useDevice } from '@deriv-com/ui';
import ToolbarButton from './toolbar/toolbar-button';
import ToggleSwitch from '@/components/shared_ui/toggle-switch';
import './bot-action-buttons.scss';

const BotActionButtons = observer(() => {
    const { isDesktop } = useDevice();
    const { quick_strategy, run_panel, client } = useStore();
    const { setFormVisibility } = quick_strategy;

    if (isDesktop) return null;

    const handleQuickStrategyOpen = () => {
        setFormVisibility(true);
    };

    return (
        <div className={classNames('db-action-buttons', { 'db-action-buttons--mobile': !isDesktop })}>
            <div className='db-action-buttons__container'>
                <ToolbarButton
                    popover_message={localize('Click here to start building your Deriv Bot.')}
                    button_id='db-toolbar__get-started-button'
                    button_classname='toolbar__btn toolbar__btn--icon toolbar__btn--start'
                    buttonOnClick={handleQuickStrategyOpen}
                    button_text={localize('Quick strategy')}
                />
                {client.is_virtual && (
                    <div className='db-action-buttons__copy-trade'>
                        <Text size='xxs' weight='bold' className='db-action-buttons__copy-trade-label'>
                            {localize('Demo to Real')}
                        </Text>
                        <ToggleSwitch
                            id='db-toolbox__copy-trade-toggle'
                            className='db-action-buttons__toggle'
                            is_enabled={run_panel.is_copy_trading}
                            handleToggle={() => run_panel.setIsCopyTrading(!run_panel.is_copy_trading)}
                        />
                    </div>
                )}
            </div>
        </div>
    );
});

export default BotActionButtons;
