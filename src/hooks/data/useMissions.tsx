import { useState, useEffect } from "react";
import { getApiClient } from "../../apis/client";
import { MODE_AREAL, MODE_DRIVER, MODE_PASSENGER } from "../../lib/constants";


export default function useMissions(props: any = {}) {
    const { mode, status, dateFilter } = props;
    const [missions, setMissions] = useState({
        data: null
    });

    useEffect(() => {
        const apiName = function () {
            switch (mode) {
                case MODE_AREAL: return "getListOfConcerningMissionsAreal";
                case MODE_DRIVER: return "getListOfConcerningMissionsAsDriver";
                case MODE_PASSENGER: return "getListOfConcerningMissionsAsPassenger";
            }
        }()
        if (apiName == null) throw "apiName is not set"
        getApiClient()[apiName](status, dateFilter).then(({ data }) => {
            setMissions({ ...missions, data })
        }).catch(console.log)
    }, [])

    return {
        missions
    }

}