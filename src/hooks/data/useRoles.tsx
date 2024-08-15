import { useEffect, useState } from "react";
import { getApiClient } from "../../apis/client";
import { CustomAllPermissions } from "../../utils/utils";

export default function useRoles(): any {

    const [data, setData] = useState({
        permissions: [],
        roles: [],
        in_progress: true,
    });

    const callApi = async () => {
        const apiClient = getApiClient();
        const raw_permissions = await apiClient.getAllPermissions()
        const permissions=CustomAllPermissions(raw_permissions.data)
        const roles = await apiClient.listRoles();
      //  console.log(22,permissions);
        setData({
            permissions: permissions,
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