import { useState, useEffect } from 'react';
import { getApiClient } from '../../../apis/client';

export default function useSetWorkingWeek(type: any, key: any, item: any) {

  //  console.log(89,item);

    const [result, setResult] = useState<any>(null);
    const [state, setState] = useState({
        in_progress: false
    });

    function refreshData() {
       
        switch (type) {
            case 'insert':
                setState({ ...state, in_progress: true })
                getApiClient().insertSetWorkingWeek(key, item)
                    .then(resp => {
                        setResult(resp.data);
                    })
                    .catch(error => {
                        console.error(6001, 'Error fetching mission list:', error);
                        // Handle the error, e.g., show a message to the user
                    })
                    .finally(() => {
                     //   console.log(7000);
                        setState({ ...state, in_progress: false });
                    });
                break;
            case 'select':
                setState({ ...state, in_progress: true })
                getApiClient().selectSetWorkingWeek(key, item)
                    .then(resp => {
                        setResult(resp.data);
                    })
                    .catch(error => {
                        console.error(6001, 'Error fetching mission list:', error);
                        // Handle the error, e.g., show a message to the user
                    })
                    .finally(() => {
                      //  console.log(7000);
                        setState({ ...state, in_progress: false });
                    });
                break;

        }
    }

    useEffect(() => {
        refreshData();
    }, []); // Include fromDate and toDate as dependencies


    return {
        result,
        state,
        refreshData,
    }
}