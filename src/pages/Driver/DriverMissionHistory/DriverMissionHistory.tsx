import { MODE_DRIVER } from "../../../lib/constants";
import MissionHistory from "../../../widgets/MissionHistory/MissionHistory";
import './style.scss'
export default function DriverMissionHistory() {
    return <div className="DriverMissionHistory-component">
        <MissionHistory mode={MODE_DRIVER} />
    </div>
}