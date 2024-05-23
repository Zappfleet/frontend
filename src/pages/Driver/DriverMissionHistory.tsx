import { MODE_DRIVER } from "../../lib/constants";
import MissionHistory from "../../widgets/MissionHistory";

export default function DriverMissionHistory() {
    return <div>
        <MissionHistory mode={MODE_DRIVER} />
    </div>
}