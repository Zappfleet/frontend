import { useState, useEffect } from 'react';
import { getApiClient } from '../../../apis/client';

export default function useRestrictionShowRequests(type: any, key: number, count: any) {

    //console.log(89,status);

    const [result, setResult] = useState<any>(null);
    const [state, setState] = useState({
        in_progress: false
    });

    function refreshData() {
       
        switch (type) {
            case 'insert':
              //  console.log(96);
                
                setState({ ...state, in_progress: true })
                getApiClient().insertRestrictionShowRequests(key, count)
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
            case 'select':
                setState({ ...state, in_progress: true })
                getApiClient().selectRestrictionShowRequests(key, count)
                    .then(resp => {
                        setResult(resp.data);
                    })
                    .catch(error => {
                        console.error(6001, 'Error fetching mission list:', error);
                        // Handle the error, e.g., show a message to the user
                    })
                    .finally(() => {
                       // console.log(7000);
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