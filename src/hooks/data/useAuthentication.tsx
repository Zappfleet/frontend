import { useEffect, useState } from "react";
import { getApiClient } from "../../apis/client";
import { MSG_REQUIRED_FIELD } from "../../lib/string";

export default function useAuthentication(): any {
    const [state, setState] = useState(null);

    useEffect(() => {
        getApiClient().auth().then(({ data }) => {
            setState(data);
        }).catch(console.log);
    }, [])

    return {
        authInfo: state,
    };
}