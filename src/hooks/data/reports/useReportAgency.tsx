import { useState, useEffect } from 'react';
import { getApiClient } from '../../../apis/client';



function useReportAgency() {
  const [result, setResult] = useState<any>();

  useEffect(() => {
    getApiClient()
      .getReportAgencyCost()
      .then(({ data }) => {
        setResult(data);
      })
      .catch(console.log);
  }, []);

  return {
    result,
  };
}
// function useReportAgency({ agency_id, date_filter }: any) {
//   const [state, setState] = useState<any>();

//   useEffect(() => {
//     getApiClient()
//       .getReportAgencyCost(agency_id, date_filter)
//       .then(({ data }) => {
//         setState(data);
//       })
//       .catch(console.log);
//   }, [agency_id, date_filter?.gmt_from, date_filter?.gmt_to]);

//   return {
//     state,
//   };
// }

export default useReportAgency;
