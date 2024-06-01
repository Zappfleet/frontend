import { FaCar } from 'react-icons/fa';

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
