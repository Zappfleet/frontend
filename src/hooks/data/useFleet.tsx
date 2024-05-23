import { useEffect, useState } from "react";
import { getApiClient } from "../../apis/client";

export default function useFleet() {
    const [state, setState] = useState({
        vehicles: null,
    });

    function loadSortedVehicleList(mission_id?: string) {
        getApiClient().getSortedVehicles(mission_id).then(({ data }) => {
            setState({...state , vehicles : data})
        }).catch(console.log)
    }

    useEffect(() => {
        loadSortedVehicleList();
    }, [])

    return {
        data: state,
    }
} 