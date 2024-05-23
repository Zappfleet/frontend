import { useEffect, useState } from 'react';
import { getApiClient } from '../../apis/client';
import { VEHICLE_TYPE_AGENCY } from '../../lib/constants';

export default function useVehicles() {
  const [state, setState] = useState<any>({
    vehicles: [],
  });

  const refreshVehicles = async ({ type = 'org', search }: any) => {
    const method =
      type == VEHICLE_TYPE_AGENCY ? 'getAgencyList' : 'getVehicleList';
    try {
      const { data } = await getApiClient()[method](search);
      setState({ ...state, vehicles: data });
      return data;
    } catch (e) {
      console.log(e);
      return null;
    }
  };

  useEffect(() => {
    refreshVehicles({ type: 'org' });
  }, []);

  return {
    refreshVehicles,
    vehicles: state.vehicles || [],
  };
}
