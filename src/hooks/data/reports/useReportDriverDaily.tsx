import { useEffect, useState } from 'react';
import { getApiClient } from '../../../apis/client';

function useReportDriverDaily({ driver_id, date_filter }: any) {
  const [state, setState] = useState<any>();

  useEffect(() => {
    getApiClient()
      .getReportDriverDaily(driver_id, date_filter)
      .then(({ data }) => {
        setState(data);
      })
      .catch(console.log);
  }, [driver_id, date_filter?.gmt_from, date_filter?.gmt_to]);

  return {
    state,
  };
}

export default useReportDriverDaily;
