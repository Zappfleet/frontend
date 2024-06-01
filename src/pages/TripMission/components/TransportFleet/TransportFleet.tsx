import './style.scss'
import React from 'react';
import MapContainer from '../../../../widgets/map/MapContainer';
import UserOne from '../../../images/user/user-01.png';
import { findText } from '../../../../lib/string';
import useVehicleBasicData from '../../../../hooks/data/useVehicleBasicData';
import { VehicleItem } from '../VehicleItem/VehicleItem';

const TransportFleet = (props: any) => {
  const { fleetData } = props;
  const { data: basicData }: any = useVehicleBasicData();

  return (
    <div className="TransportFleet-component">
      <div className="row">
        <div className="col-3">
          <input
            className="search"
            placeholder="جستجوی رانندگان ..."
          />
          <div className="driver-list">
            {fleetData?.data?.vehicles?.docs.map((vehicle: any) => {
              return (
                <div
                  onClick={() => props.handle_onVehicleClick?.(vehicle)}
                  key={vehicle._id}
                >
                  <VehicleItem vehicle={vehicle} basicData={basicData} />
                </div>
              );
            })}
          </div>
        </div>
        <div className="col-9">
          <MapContainer />
        </div>
      </div>

    </div>

  );
};

export default TransportFleet;
