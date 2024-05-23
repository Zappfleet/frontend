import React from 'react';
import MapContainer from '../../../widgets/map/MapContainer';
import UserOne from '../../../images/user/user-01.png';
import { findText } from '../../../lib/string';
import useVehicleBasicData from '../../../hooks/data/useVehicleBasicData';
import { VehicleItem } from './VehicleItem';

const TransportFleet = (props: any) => {
  const { fleetData } = props;
  const { data: basicData }: any = useVehicleBasicData();

  return (
    <div className="relative flex h-full w-full">
      <div className="hidden w-70 flex-col overflow-y-auto rounded bg-white pt-2 dark:bg-boxdark lg:flex">
        <div className=" mx-1 mt-1 border-b border-gray-4">
          <input
            className="w-full rounded bg-transparent p-1 focus:outline-none"
            placeholder="جستجوی رانندگان ..."
          />
        </div>
        <div className="scroller mt-3 flex-1 overflow-y-scroll px-0.5">
          {fleetData?.data?.vehicles?.docs.map((vehicle: any) => {
            return (
              <div
                onClick={() => props.handle_onVehicleClick?.(vehicle)}
                key={vehicle._id}
                className="m-1.5 cursor-pointer rounded-lg p-2 hover:bg-gray dark:hover:bg-graydark"
              >
                <VehicleItem vehicle={vehicle} basicData={basicData} />
              </div>
            );
          })}
        </div>
      </div>
      <div className="relative mr-1 flex-1">
        <MapContainer />
      </div>
    </div>
  );
};

export default TransportFleet;
