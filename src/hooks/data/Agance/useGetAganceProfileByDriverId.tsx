import { useState, useEffect } from 'react';
import { getApiClient } from '../../../apis/client';

export default function useGetAganceProfileByDriverId(refreshReport: any, driverId: any) {

    //console.log(1200,action_name);

    const [result, setResult] = useState<any>(null);
    const [type, setType] = useState<any>(null);
    const [state, setState] = useState({
        in_progress: false
    });

    function refreshData() {
        getApiClient().selectAganceProfileByDriverId(driverId)
            .then(resp => {
                setResult(resp)
                setType('selectVehicleByDriverID')
            })
            .catch(error => {
                console.error(6001, 'useAgenceVehicle selectVehicleByDriverID Error fetching list:', error);
                // Handle the error, e.g., show a message to the user
            })
            .finally(() => {
                setState({ ...state, in_progress: false });
            });
    }

    useEffect(() => {
        driverId && refreshData();
    }, [refreshReport]); // Include fromDate and toDate as dependencies

    return {
        result,
        type,
        state,
        refreshData,
    }
}