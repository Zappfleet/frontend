import { useEffect, useState } from "react";
import { getApiClient } from "../../apis/client";
import { MODE_AREAL, MODE_DRIVER, MODE_PASSENGER } from "../../lib/constants";

export default function useRequests({ initialParams, mode }: any) {
    const [requests, setRequests] = useState<any>();

    const loadRequests = (params = {}) => {
        const apiName = function () {
            switch (mode) {
                case MODE_AREAL: return "getRelatedRequestsAreal";
                case MODE_PASSENGER: return "getRelatedRequestsPassenger";
            }
        }()
        if (apiName == null) throw "apiName is not set"
        getApiClient()[apiName](params)
            .then(({ data }) => {
                setRequests(data)
            })
            .catch(console.log)
    }

    const update = (new_request: any, insert_if_not_exists = false) => {
        const request_id = new_request._id;
        const requestClone = { ...requests };
        let exists = false;
        requestClone.docs = requestClone.docs.map((request: any) => {
            if (request._id == request_id) {
                exists = true;
                return {
                    ...new_request,
                    submitted_by: request.submitted_by
                }
            }
            return request;
        })
        if (!exists && insert_if_not_exists) {
            requestClone.docs.unshift(new_request)
        }
        setRequests(requestClone)
    }

    const triggerRemoveFromList = (request_id: string) => {
        const requestClone = { ...requests };
        requestClone.docs.map((request: any) => {
            if (request._id == request_id) request.removed = true;
            return request;
        })
        setRequests(requestClone)
    }

    useEffect(() => {
        loadRequests(initialParams);
    }, [])

    return {
        loadRequests,
        triggerRemoveFromList,
        update,
        requests
    }

}