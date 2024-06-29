import { useState, useEffect } from "react";
import { getApiClient } from "../../apis/client";
import { MODE_AREAL, MODE_DRIVER, MODE_PASSENGER } from "../../lib/constants";


export default function useMissions(props: any = {}) {

    const { mode, status, dateFilter, paging } = props;
    const [missions, setMissions] = useState({
        data: null
    });

   // console.log(78, mode, paging);


    useEffect(() => {
        const apiName = function () {
            switch (mode) {
                case MODE_AREAL: return "getListOfConcerningMissionsAreal";
                case MODE_DRIVER: return "getListOfConcerningMissionsAsDriver";
                case MODE_PASSENGER: return "getListOfConcerningMissionsAsPassenger";
            }
        }()
        if (apiName == null) throw "apiName is not set"
        
        getApiClient()[apiName](status, dateFilter, paging).then(({ data }) => {
            // console.log(54,data);

            setMissions({ ...missions, data })
        }).catch(console.log)
    }, [])


    return {
        missions
    }

}