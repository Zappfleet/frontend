import { useState, useEffect } from "react";
import { getApiClient } from "../../apis/client";

export default function useDraftMission() {

    const [state, setState] = useState<any>({
        data: null,
    });

    const contains = (item: any) => {
        return state.data?.service_requests?.find(({ request }: any) => {
            return request._id == item._id
        }) != null
    }


    const update = (new_request: any) => {
        const dataClone = { ...state.data };
        const request_id = new_request._id;
        dataClone.service_requests = dataClone.service_requests.map(({ request }: any) => {
            if (request._id == request_id) {
                return {
                    request: {
                        ...new_request,
                        submitted_by: request.submitted_by
                    }
                }
            }
            return { request };
        })
        setState({ ...state, data: dataClone });
    }

    const assignRequestToDraft = (request: any) => {
        if (state.data == null) return;
        const dataClone = { ...state.data };
        dataClone.service_requests.push({ request });
        setState({ ...state, data: dataClone });
        return getApiClient().assignRequestToMission(state.data._id, request._id);
    }

    const removeRequestFromDraft = (r: any) => {
        if (state.data == null) return;
        const dataClone = { ...state.data };
        dataClone.service_requests = dataClone.service_requests.filter(({ request }: any) => { return request._id != r._id })
        setState({ ...state, data: dataClone });
        return getApiClient().removeRequestFromMission(state.data._id, r._id);
    }


    const reloadDraft = () => {
        getApiClient().getDraftMission()
            .then(({ data }) => setState({ data }))
            .catch(console.log);
    }

    useEffect(() => {
        reloadDraft();
    }, [])

    return {
        data: state.data,
        assignRequestToDraft,
        removeRequestFromDraft,
        contains,
        update,
        reloadDraft,
    }

}