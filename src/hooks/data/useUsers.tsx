import { useEffect, useState } from "react"
import { getApiClient } from "../../apis/client"

export default function useUsers() {

    const [userList, setUserList] = useState<any>(null);
    const [state, setState] = useState({
        in_progress: false
    });

    function refreshData() {
        setState({ ...state, in_progress: true })
        getApiClient().getUserList({}).then(({ data }) => {
            setUserList(data);
        }).catch(console.log).finally(() => {
            setState({ ...state, in_progress: false })
        });
    }

    useEffect(() => {
        refreshData();
    }, [])

    return {
        userList,
        state,
        refreshData,
    }
}