import { useEffect, useState } from "react";
import { getApiClient } from "../../apis/client";

export default function useVehicleBasicData(props?: any) {
    const include_inactive = props?.include_inactive;

    const [data, setData] = useState({});

    function refreshData() {
        getApiClient().getBasicEntities(include_inactive).then(({ data }) => {
            setData(data);
        }).catch(console.log);
    }

    useEffect(() => {
        refreshData()
    }, [])

    return {
        data,
        refreshData
    }
}