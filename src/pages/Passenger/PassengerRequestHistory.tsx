import { MODE_PASSENGER } from "../../lib/constants";
import RequestHistory from "../../widgets/RequestHistory";

export default function PassengerRequestHistory() {
    return <div>
        <RequestHistory mode={MODE_PASSENGER} />
    </div>
}