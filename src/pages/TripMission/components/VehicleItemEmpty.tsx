import { FaCar } from 'react-icons/fa';
import ErrorBoundary from '../../../components/ErrorBoundary/ErrorBoundary';

function VehicleItemEmpty({ onClick }: any) {
  return (
    <div onClick={onClick}>
      <div>
        <div>
           
            <FaCar size={32} />
           
          
        </div>
      </div>
    </div>
  );
}

export default VehicleItemEmpty;
