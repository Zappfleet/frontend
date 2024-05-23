import { useEffect, useState } from "react";
import { getApiClient } from "../../apis/client";

export default function useRoles(): any {

    const [data, setData] = useState({
        permissions: [],
        roles: [],
        in_progress: true,
    });

    const callApi = async () => {
        const apiClient = getApiClient();
        const permissions = await apiClient.getAllPermissions()
        const roles = await apiClient.listRoles();
        setData({
            permissions: permissions.data,
            roles: roles.data,
            in_progress: false,
        });

    }

    function refreshRoles() {
        callApi();
    }

    useEffect(() => {
        callApi();
    }, [])

    return {
        data,
        refreshRoles
    };
}