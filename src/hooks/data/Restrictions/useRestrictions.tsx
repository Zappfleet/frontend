import { useState, useEffect } from 'react';
import { getApiClient } from '../../../apis/client';

export default function useRestrictions(refresh: any, type: any, key: any, value: any) {

   // console.log(89, type, key, value);

    const [result, setResult] = useState<any>(null);
    const [resultType, setResultType] = useState<any>('');
    const [state, setState] = useState({
        in_progress: false
    });

    function refreshData() {
        console.log(52);

        switch (type) {
            case 'update':
                setResultType('update')
                setState({ ...state, in_progress: true })
                getApiClient().updateRestrictions(key, value)
                    .then(resp => {
                        setResult(resp.data);
                    })
                    .catch(error => {
                        console.error(6001, 'Error fetching mission list:', error);
                        // Handle the error, e.g., show a message to the user
                    })
                    .finally(() => {
                        console.log(7000);
                        setState({ ...state, in_progress: false });
                    });
                break;
            case 'select':
                setResultType('select')
                setState({ ...state, in_progress: true })
                getApiClient().selectRestrictions(key, value)
                    .then(resp => {
                        setResult(resp.data);
                    })
                    .catch(error => {
                        console.error(6001, 'Error fetching mission list:', error);
                        // Handle the error, e.g., show a message to the user
                    })
                    .finally(() => {
                        console.log(7000);
                        setState({ ...state, in_progress: false });
                    });
                break;

        }
    }

    useEffect(() => {
        refreshData();
    }, [refresh]); // Include fromDate and toDate as dependencies


    return {
        result,
        resultType,
        state,
        refreshData,
    }
}