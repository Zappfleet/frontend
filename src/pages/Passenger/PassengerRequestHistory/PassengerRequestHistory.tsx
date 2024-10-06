import ErrorBoundary from "../../../components/ErrorBoundary/ErrorBoundary";
import { MODE_PASSENGER } from "../../../lib/constants";
import RequestHistory from "../../../widgets/RequestHistory/RequestHistory";
import './style.scss'
export default function PassengerRequestHistory() {
    return <div>
        
         <RequestHistory mode={MODE_PASSENGER} />
         
    </div>
}