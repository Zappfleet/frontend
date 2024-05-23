import { useEffect, useState } from "react";
import { getApiClient } from "../../apis/client";

export default function useRegions() {
    const [regions, setRegions] = useState([]);

    const refreshRegions = () => {
        getApiClient().getRegionList().then(({ data }) => {
            setRegions(data.docs);
        }).catch(console.log)
    }

    useEffect(refreshRegions, []);


    return {
        regions,
        refreshRegions
    }
}