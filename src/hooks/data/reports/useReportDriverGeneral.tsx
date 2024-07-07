import { useEffect, useState } from 'react';
import { getApiClient } from '../../../apis/client';

function useReportDriverGeneral({ driver_id, date_filter }: any) {
  const [state, setState] = useState<any>();

  useEffect(() => {
    getApiClient()
      .getReportDriverGeneral(driver_id, date_filter)
      .then(({ data }) => {
        console.log(744,data);
        
        setState(data);
      })
      .catch(console.log);
  }, [driver_id, date_filter?.gmt_from, date_filter?.gmt_to]);

  return {
    state,
  };
}

export default useReportDriverGeneral;
