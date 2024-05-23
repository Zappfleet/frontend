import { useEffect, useState } from "react";
import { getApiClient } from "../../apis/client";
import { STATUS_DONE, STATUS_ON_ROUTE } from "../../lib/string";

function statusToRoute(status: string) {
    switch (status) {
        case STATUS_ON_ROUTE: return "on-route";
        default: return status.toLocaleLowerCase();
    }
}

export default function useMissionDetails(props: any) {
    const [data, setData] = useState<any>();

    useEffect(() => {
        getApiClient().getMissionDetails(props.mission_id).then(({ data }) => {
            setData(data)
        }).catch(console.log)
    }, [props.mission_id]);

    function findServiceRequestInMission(request: any) {
        return data.mission.service_requests.find(({ request: R }: any) => { return R.id == request._id })
    }

    function forceUpdate() {
        setData({ ...data })
    }

    async function updateMissionStatus(status: string) {
        if (data == null) return;
        try {
            const { data: apiData } = await getApiClient().updateMissionStatus(data.mission._id, statusToRoute(status));
            const { mission, history_entry } = apiData;
            const updatedMission = { ...data.mission };
            updatedMission.status = status;
            setData({ mission: updatedMission });
            return { mission }
        } catch (e) {
            console.log(e);
            return { error: e }
        }
    }

    async function initMissionRequest(request: any) {
        try {
            await getApiClient().setMissionRequestOnRoute(data.mission._id, request._id)
            const serviceRequest = findServiceRequestInMission(request);
            console.log({ serviceRequest });

            serviceRequest.status = STATUS_ON_ROUTE;
            forceUpdate();
            return data;
        } catch (e) {
            console.log(e);
        }

    }

    async function proceedMissionRequest(request: any, index: number) {
        try {
            await getApiClient().setMissionRequestCurrentLocation(data.mission._id, request._id, index)
            const serviceRequest = findServiceRequestInMission(request);
            serviceRequest.current_location_index = index;
            if (serviceRequest?.request?.locations.length - 1 == index) serviceRequest.status = STATUS_DONE;
            forceUpdate();
            return data;
        } catch (e) {
            console.log(e);
        }
    }

    return {
        updateMissionStatus,
        initMissionRequest,
        proceedMissionRequest,
        data,
    }

}