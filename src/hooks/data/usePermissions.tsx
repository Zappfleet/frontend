import { useEffect, useState } from "react";
import { getApiClient } from "../../apis/client";

export default function usePermissions(): any {

    const [data, setData] = useState({
        permissions: [],
        in_progress: true,
    });

    const callApi = async () => {
        const apiClient = getApiClient();
        const permissions = await apiClient.getAllPermissions()
               setData({
            permissions: permissions.data,
            in_progress: false,
        });

    }

  
    useEffect(() => {
        callApi();
    }, [])

    return {
        data,
    };
}