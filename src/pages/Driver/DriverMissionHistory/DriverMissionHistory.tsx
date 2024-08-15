import { useEffect, useState } from "react";
import useAuthentication from "../../../hooks/data/useAuthentication";
import { DB_ROLE_DRIVER_TITLE, MODE_DRIVER } from "../../../lib/constants";
import MissionHistory from "../../../widgets/MissionHistory/MissionHistory";
import './style.scss'
export default function DriverMissionHistory() {

    const [load, setLoad] = useState<any>(null)
    const [isDriver, setIsDriver] = useState<any>(false)
    const { authInfo } = useAuthentication();
    useEffect(() => {
        if (authInfo) {
            if (authInfo.auth.roles[0].title === DB_ROLE_DRIVER_TITLE) {
                setIsDriver(true)
            }
            setLoad(true)
        }
    }, [authInfo])

    return <div className="DriverMissionHistory-component">
        {load && <MissionHistory mode={isDriver === true ? MODE_DRIVER : ''} status={''} paging={false} />}
    </div>
}