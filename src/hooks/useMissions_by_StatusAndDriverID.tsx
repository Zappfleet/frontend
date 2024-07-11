import { useState, useEffect } from 'react';
import { getApiClient } from '../apis/client';

export default function useMissions_by_StatusAndDriverID(status: string, driverID: any) {

    //console.log(60,status);

    const [missionList, setMissionList] = useState<any>(null);
    const [state, setState] = useState({
        in_progress: false
    });

    function refreshData() {
     //   console.log(520);
        
        setState({ ...state, in_progress: true })
        getApiClient().getMissions_by_StatusAndDriverID(status, driverID)
            .then(resp => {
                setMissionList(resp.data);
            })
            .catch(error => {
                console.error(6001, 'Error fetching mission list:', error);
            })
            .finally(() => {
               // console.log(7000);
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