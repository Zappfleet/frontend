import { useState, useEffect } from 'react';
import { getApiClient } from '../../../apis/client';

export default function useCarteSalahiyat(action_name: any, item: any) {

    const [result, setResult] = useState<any>(null);
    const [type, setType] = useState<any>(null);
    const [state, setState] = useState({
        in_progress: false
    });

    function refreshData() {
        //  console.log(300, item, action_name);
        switch (action_name) {
            case 'select':
                setState({ ...state, in_progress: true })
                getApiClient().select_carteSalahiyat()
                    .then(resp => {
                        setResult(resp)
                        setType('select')
                    })
                    .catch(error => {
                        console.error(6001, 'Error fetching list:', error);
                        // Handle the error, e.g., show a message to the user
                    })
                    .finally(() => {
                        setState({ ...state, in_progress: false });
                    });
                break;

            case "insert":
                if (item !== null) {
                    setState({ ...state, in_progress: true })
                    getApiClient().insert_carteSalahiyat(item)
                        .then(resp => {
                            setResult(resp)
                            setType('insert')
                        })
                        .catch(error => {
                            console.error(6001, 'Error fetching list:', error);
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
                    getApiClient().update_carteSalahiyat(item)
                        .then(resp => {
                            setResult(resp)
                            setType('update')
                        })
                        .catch(error => {
                            console.error(6001, 'Error fetching list:', error);
                            // Handle the error, e.g., show a message to the user
                        })
                        .finally(() => {
                            setState({ ...state, in_progress: false });
                        });
                }
                break;

            case 'delete':
                setState({ ...state, in_progress: true })
                getApiClient().delete_carteSalahiyat(item._id)
                    .then(resp => {
                        setResult(resp)
                        setType('delete')
                    })
                    .catch(error => {
                        console.error(6001, 'Error fetching list:', error);
                        // Handle the error, e.g., show a message to the user
                    })
                    .finally(() => {
                        setState({ ...state, in_progress: false });
                    });
                break;
        }
    }

    useEffect(() => {
        //  console.log(44,action_name);

        action_name && refreshData();
    }, [action_name]); // Include fromDate and toDate as dependencies

    return {
        result,
        type,
        state,
        refreshData,
    }
}