import { useState, useEffect } from 'react';
import { getApiClient } from '../../../apis/client';

export default function useComments(refreshHook: any, action_name: any, mission_id: any, comment: any) {

    const [result, setResult] = useState<any>(null);
    const [state, setState] = useState({
        in_progress: false
    });

    function refreshData() {
        switch (action_name) {
            case 'select':
                setState({ ...state, in_progress: true })
                getApiClient().getMissionComment(mission_id)
                    .then(resp => {
                        setResult(resp)
                    })
                    .catch(error => {
                        console.error(6001, 'Error fetching mission list:', error);
                        // Handle the error, e.g., show a message to the user
                    })
                    .finally(() => {
                        setState({ ...state, in_progress: false });
                    });
                break;

            case "insert":
                setState({ ...state, in_progress: true })
                //console.log(7888,mission_id,comment);

                getApiClient().saveMissionComment(mission_id, comment)
                    .then(resp => {
                        setResult(resp)
                    })
                    .catch(error => {
                        console.error(6001, 'Error fetching mission list:', error);
                        // Handle the error, e.g., show a message to the user
                    })
                    .finally(() => {
                        setState({ ...state, in_progress: false });
                    });
                break;
        }
    }

    useEffect(() => {
        if (refreshHook) {
            refreshData();
        }
    }, [refreshHook]); // Include fromDate and toDate as dependencies

    return {
        result,
        state,
        refreshData,
    }
}