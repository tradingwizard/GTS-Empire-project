import { useMemo } from 'react';
/* [AI] - Analytics removed - utility functions moved to @/utils/account-helpers */
import { isVirtualAccount } from '@/utils/account-helpers';
/* [/AI] */
import { CurrencyIcon } from '@/components/currency/currency-icon';
import { addComma, getDecimalPlaces } from '@/components/shared';
import { useApiBase } from '@/hooks/useApiBase';
import { Balance } from '@deriv/api-types';

/** A custom hook that returns the account object for the current active account. */
const useActiveAccount = ({
    allBalanceData,
    directBalance,
}: {
    allBalanceData: Balance | null;
    directBalance?: string;
}) => {
    const { accountList, activeLoginid } = useApiBase();

    const activeAccount = useMemo(
        () => accountList?.find(account => account.loginid === activeLoginid),
        [activeLoginid, accountList]
    );

    const currentBalanceData = allBalanceData?.accounts?.[activeAccount?.loginid ?? ''];

    const modifiedAccount = useMemo(() => {
        if (!activeAccount) return undefined;

        // Use centralized utility to determine if demo account
        const isVirtual = isVirtualAccount(activeAccount.loginid);

        let balVal = currentBalanceData?.balance
            ? currentBalanceData.balance
            : directBalance
              ? parseFloat(directBalance)
              : 0;

        // Override if marketing mode is active on a legacy account
        const isLegacy = localStorage.getItem('is_legacy_account') === 'true';
        if (localStorage.getItem('marketing_mode_active') === 'true' && isLegacy) {
            if (isVirtual) {
                balVal = 10000;
            } else if (
                activeAccount.currency === 'USD' ||
                (!activeAccount.currency && activeAccount.loginid.startsWith('CR'))
            ) {
                const storedRealBal = localStorage.getItem('marketing_mode_real_balance');
                if (storedRealBal) {
                    balVal = Number(storedRealBal);
                } else {
                    const initialRealBal = (Math.random() * 1000 + 5000).toFixed(2);
                    localStorage.setItem('marketing_mode_real_balance', initialRealBal);
                    balVal = Number(initialRealBal);
                }
            }
        }

        return {
            ...activeAccount,
            balance: addComma(balVal.toFixed(getDecimalPlaces(activeAccount.currency || 'USD'))),
            currencyLabel: isVirtual ? 'Demo' : activeAccount?.currency,
            icon: <CurrencyIcon currency={activeAccount?.currency?.toLowerCase()} isVirtual={isVirtual} />,
            isVirtual: isVirtual,
            isActive: activeAccount?.loginid === activeLoginid,
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeAccount, activeLoginid, allBalanceData, directBalance]);

    return {
        /** User's current active account. */
        data: modifiedAccount,
    };
};

export default useActiveAccount;
