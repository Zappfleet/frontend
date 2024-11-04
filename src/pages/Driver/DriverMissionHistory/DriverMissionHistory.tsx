import { useEffect, useState } from "react";
import useAuthentication from "../../../hooks/data/useAuthentication";
import { DB_ROLE_DRIVER_TITLE, MODE_DRIVER } from "../../../lib/constants";
import MissionHistory from "../../../widgets/MissionHistory/MissionHistory";
import './style.scss'
import ErrorBoundary from "../../../components/ErrorBoundary/ErrorBoundary";
export default function DriverMissionHistory() {

    console.log(22);
    
    const [load, setLoad] = useState<any>(null)
    const [isDriver, setIsDriver] = useState<any>(false)
    const { authInfo } = useAuthentication();
    useEffect(() => {
        if (authInfo) {
            console.log(100,authInfo.auth.roles);
            
            if (authInfo.auth.roles[0].title === DB_ROLE_DRIVER_TITLE) {
                setIsDriver(true)
            }
            setLoad(true)
        }
    }, [authInfo])

    return <div className="DriverMissionHistory-component">
        {load &&  
            <MissionHistory mode={isDriver === true ? MODE_DRIVER : MODE_DRIVER} status={''} paging={false} />
         }
    </div>
}