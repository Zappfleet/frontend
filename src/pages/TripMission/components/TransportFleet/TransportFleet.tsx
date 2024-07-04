import './style.scss'
import React, { useEffect, useRef, useState } from 'react';
import MapContainer, { MapRefType } from '../../../../widgets/map/MapContainer';
import UserOne from '../../../images/user/user-01.png';
import { findText } from '../../../../lib/string';
import useVehicleBasicData from '../../../../hooks/data/useVehicleBasicData';
import { VehicleItem } from '../VehicleItem/VehicleItem';
import getCurrentLocations from '../../../../hooks/useCurrentLocations/getCurrentLocations';
import carIcon from '../../../../images/map/carIcon.png';

const TransportFleet = (props: any) => {
  const { fleetData } = props;
  const { data: basicData }: any = useVehicleBasicData();

  const mapRef1 = useRef<MapRefType>();
  const [permitForRunUseFleetGps, setPermitForRunUseFleetGps] = useState<any>(false)
  const [vehicleIDs, setVehicleIDs] = useState<any>(null)
  const [mode, setMode] = useState<any>(null)
  const useFleetGpsResult = getCurrentLocations(permitForRunUseFleetGps, vehicleIDs, mapRef1, carIcon, 0.015);


  useEffect(() => {
    console.log(7820, fleetData?.data?.vehicles?.docs);

    if (mapRef1) {
      console.log(100, 'ناوگان')
      //show current location
      setMode('driver')
      const vedicle_ids: any = []
      fleetData?.data?.vehicles?.docs.map((vehicle: any) => {
        vedicle_ids.push(vehicle._id)
      })
      setVehicleIDs(vedicle_ids)
      setPermitForRunUseFleetGps(true)
    }
  }, [fleetData, mapRef1])

  return (
    <div className="TransportFleet-component">
      <div className="row">
        <div className="col-12 col-md-3">
          <div className="search-div">
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
        </div>
        <div className="col-12 col-md-8">
          <div className="map-div">
            <div className="location-div">
              <MapContainer mapRef={mapRef1 as { current: MapRefType }} />
            </div>
          </div>
        </div>
      </div>

    </div>

  );
};

export default TransportFleet;
