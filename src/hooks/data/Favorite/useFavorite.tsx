import { useState, useEffect } from 'react';
import { getApiClient } from '../../../apis/client';

export default function useFavorite(refresh: boolean, action_name: any, item: any) {

    //  console.log(1200);

    const [result, setResult] = useState<any>(null);
    const [type, setType] = useState<any>(null);
    const [state, setState] = useState({
        in_progress: false
    });

    async function refreshData() {
        // console.log(300, action_name);
        switch (action_name) {
            case 'select':
                setState({ ...state, in_progress: true })
                getApiClient().select_FavoriteLocation()
                    .then(resp => {
                        setResult(resp)
                        setType('select')
                    })
                    .catch(error => {
                        console.error(6001, 'Error fetching Favorite list:', error);
                        // Handle the error, e.g., show a message to the user
                    })
                    .finally(() => {
                        setState({ ...state, in_progress: false });
                    });
                break;

            case "insert":
                if (item !== null) {
                    setState({ ...state, in_progress: true })
                    getApiClient().insert_FavoriteLocation(item)
                        .then(resp => {
                            setResult(resp)
                            setType('insert')
                          //  console.log(200, resp);
                        })
                        .catch(error => {
                            console.error(6001, 'Error fetching Favorite list:', error);
                            // Handle the error, e.g., show a message to the user
                        })
                        .finally(() => {
                            setState({ ...state, in_progress: false });
                        });
                }
                break;

            case 'update':
                console.log(41,item);
                
                if (item !== null) {
                    setState({ ...state, in_progress: true })
                    getApiClient().update_FavoriteLocation(item)
                        .then(resp => {
                            setResult(resp)
                            setType('update')
                           // console.log(200, resp);
                        })
                        .catch(error => {
                            console.error(6001, 'Error fetching Favorite list:', error);
                            // Handle the error, e.g., show a message to the user
                        })
                        .finally(() => {
                            setState({ ...state, in_progress: false });
                        });
                }
                break;

            case 'delete':
                setState({ ...state, in_progress: true })
                getApiClient().delete_FavoriteLocation(item._id)
                    .then(resp => {
                        setResult(resp)
                        setType('delete')
                      //  console.log(200, resp);
                    })
                    .catch(error => {
                        console.error(6001, 'Error fetching Favorite list:', error);
                        // Handle the error, e.g., show a message to the user
                    })
                    .finally(() => {
                        setState({ ...state, in_progress: false });
                    });
                break;
        }
    }

    useEffect(() => {
      //  console.log(666, action_name, refresh);

            refreshData();
        

    }, [refresh]);

    return {
        result,
        state,
        type,
        refreshData,
    }
}