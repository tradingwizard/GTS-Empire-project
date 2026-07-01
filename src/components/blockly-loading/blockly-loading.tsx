import React from 'react';
import { observer } from 'mobx-react-lite';
import { useStore } from '@/hooks/useStore';
// import AmazingLoader from '../loader/amazing-loader';
import LoadingScreen from '../loading-screen';

const BlocklyLoading = observer(() => {
    const { blockly_store } = useStore();
    const { is_loading } = blockly_store;

    return <>{is_loading && <LoadingScreen/>}</>;
});

export default BlocklyLoading;
