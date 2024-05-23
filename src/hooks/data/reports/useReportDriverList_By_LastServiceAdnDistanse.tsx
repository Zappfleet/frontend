import { useState, useEffect } from 'react';
import { getApiClient } from '../../../apis/client';

export default function useReportDriverList_By_LastServiceAdnDistanse(status: string) {

    console.log(89,"ddd");

    const [missionList, setMissionList] = useState<any>(null);
    const [state, setState] = useState({
        in_progress: false
    });

    function refreshData() {
        setState({ ...state, in_progress: true })
        getApiClient().getDriverList_By_LastServiceAdnDistanse(status)
            .then(resp => {
                console.log(6000, resp);
                setMissionList(resp.data);
            })
            .catch(error => {
                console.error(6001, 'Error fetching mission list:', error);
                // Handle the error, e.g., show a message to the user
            })
            .finally(() => {
                console.log(7000);
                setState({ ...state, in_progress: false });
            });
    }

    useEffect(() => {
        refreshData();
    }, []); // Include fromDate and toDate as dependencies


    return {
        missionList,
        state,
        refreshData,
    }
}