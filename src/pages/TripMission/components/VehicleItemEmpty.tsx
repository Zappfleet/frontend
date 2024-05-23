import { FaCar } from 'react-icons/fa';

function VehicleItemEmpty({ onClick }: any) {
  return (
    <div onClick={onClick} className="h-28 px-4 pb-4">
      <div className="relative mx-1 h-full p-2">
        <div className="absolute bottom-2 left-0 right-0 top-2 flex cursor-pointer items-center justify-center rounded border border-dashed hover:border-primary hover:text-primary">
          <FaCar className={'duration-300'} size={32} />
        </div>
      </div>
    </div>
  );
}

export default VehicleItemEmpty;
