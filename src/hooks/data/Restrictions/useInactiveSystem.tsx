import { useState, useEffect } from 'react';
import { getApiClient } from '../../../apis/client';

export default function useInactiveSystem(action_name: any, item: any) {

    //  console.log(1200);

    const [missionList, setMissionList] = useState<any>(null);
    const [state, setState] = useState({
        in_progress: false
    });

    function refreshData() {
       // console.log(300, item, action_name);
        switch (action_name) {
            case 'select':
                setState({ ...state, in_progress: true })
                getApiClient().select_InactiveSystem()
                    .then(resp => {
                        setMissionList(resp)
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
                if (item !== null) {
                    setState({ ...state, in_progress: true })
                    getApiClient().insert_InactiveSystem(item)
                        .then(resp => {
                            console.log(200, resp);
                        })
                        .catch(error => {
                            console.error(6001, 'Error fetching mission list:', error);
                            // Handle the error, e.g., show a message to the user
                        })
                        .finally(() => {
                            setState({ ...state, in_progress: false });
                        });
                }
                break;

            case 'update':
                if (item !== null) {
                    setState({ ...state, in_progress: true })
                    getApiClient().update_InactiveSystem(item)
                        .then(resp => {
                            console.log(200, resp);
                        })
                        .catch(error => {
                            console.error(6001, 'Error fetching mission list:', error);
                            // Handle the error, e.g., show a message to the user
                        })
                        .finally(() => {
                            setState({ ...state, in_progress: false });
                        });
                }
                break;

            case 'delete':
                setState({ ...state, in_progress: true })
                getApiClient().delete_InactiveSystem(item)
                    .then(resp => {
                        setMissionList(resp)
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
      //  console.log(520, item);
        refreshData();
    }, [item]); // Include fromDate and toDate as dependencies

    return {
        missionList,
        state,
        refreshData,
    }
}