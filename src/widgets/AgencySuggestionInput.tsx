import useVehicles from '../hooks/data/useVehicles';
import { VEHICLE_TYPE_AGENCY } from '../lib/constants';
import SuggestionTextInput from './SuggestionTextInput';
import { useRef } from 'react';

export default function AgencySuggestionInput({ onAgencySelected }: any) {
  const suggestionTextInputRef = useRef<any>();
  const { refreshVehicles: fetchAgencies } = useVehicles();

  async function readAgencies(search: string): Promise<any[]> {
    return new Promise<any>((resolve, reject) => {
      fetchAgencies({ type: VEHICLE_TYPE_AGENCY, search })
        .then((data: any) => {
          resolve(data.docs);
        })
        .catch(reject);
    });
  }
  return (
    <SuggestionTextInput
      componentRef={suggestionTextInputRef}
      wrapperClassName={'flex-1'}
      showListOnTop={false}
      onSuggestionSelected={onAgencySelected}
      placeholder="جستجوی آژانس ..."
      readFromDataSource={readAgencies}
      suggestionRenderer={(item) => (
        <div className={'px-4 py-1'}>{item.extra.agency_name}</div>
      )}
    />
  );
}
