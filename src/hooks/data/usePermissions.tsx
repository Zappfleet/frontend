import { useEffect, useState } from "react";
import { getApiClient } from "../../apis/client";
import { CustomAllPermissions } from "../../utils/utils";

export default function usePermissions(): any {

    const [data, setData] = useState({
        permissions: [],
        in_progress: true,
    });

    const callApi = async () => {
        const apiClient = getApiClient();
        const raw_permissions = await apiClient.getAllPermissions()
        const permissions = CustomAllPermissions(raw_permissions.data)

        setData({
            permissions: permissions,
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