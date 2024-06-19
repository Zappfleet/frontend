import DatePicker from 'react-multi-date-picker';
import useVehicles from '../../../hooks/data/useVehicles';
import { VEHICLE_TYPE_AGENCY } from '../../../lib/constants';
import AgencySuggestionInput from '../../../widgets/AgencySuggestionInput';
import SuggestionTextInput from '../../../widgets/SuggestionTextInput/SuggestionTextInput';
import { useRef, useState } from 'react';

import persian from 'react-date-object/calendars/persian';
import persian_fa from 'react-date-object/locales/persian_fa';
import moment from 'jalali-moment';
import { BsFileExcel } from 'react-icons/bs';
import { RiFileExcel2Line } from 'react-icons/ri';
import SimpleButton from '../../../components/SimpleButton';

export default function AgencyReport() {
  const [selectedAgency, setSelectedAgency] = useState<any>();
  const [dateRage, setDateRage] = useState<any>([
    moment().subtract(7, 'days').toDate().getTime(),
    moment.now(),
  ]);

  return (
    <div>
      <div className="flex items-center px-4">
        <div className="flex-1 px-4 ">
          <AgencySuggestionInput onAgencySelected={setSelectedAgency} />
        </div>
        <div>
          <DatePicker
            onChange={setDateRage}
            range
            calendar={persian}
            locale={persian_fa}
            className="datetime-picker"
            inputClass="datetime-input !text-center !text-lg !p-4 "
            value={dateRage}
          />
        </div>
      </div>
      <div className="ml-3 mr-8 flex ">
        <div className="w-94">
          {selectedAgency && (
            <div>
              <div>
                <div className="p-2">
                  <label>{'نام : '}</label>
                  <label>{selectedAgency.extra.agency_name}</label>
                </div>
                <div className="p-2">
                  <label>{'شماره  : '}</label>
                  <label>{selectedAgency.extra.agency_phone}</label>
                </div>
              </div>
              <div className="ml-6 mt-6  rounded bg-white p-2 shadow">
                <label>{'جمع هزینه : '}</label>
              </div>
            </div>
          )}
        </div>
        <div className="flex-1">
          <div>
            <span className="mb-4 inline-block">
              <SimpleButton className="bg-success">
                <span className="ml-4">{'دانلود فایل اکسل'}</span>
                <RiFileExcel2Line
                  className={
                    'cursor-pointer rounded text-white hover:bg-gray-4'
                  }
                  size={24}
                />
              </SimpleButton>
            </span>
          </div>
          <table className="w-full border border-gray-5 text-right">
            <thead className=" border-b bg-gray-4">
              <tr>
                <th className="p-1">تاریخ سفر</th>
                <th className="p-1">هزینه</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-4">
                <td className="p-2">165445</td>
                <td className="p-2">90000</td>
              </tr>
              <tr className="even:bg-gray-2">
                <td className="p-2">165445</td>
                <td className="p-2">90000</td>
              </tr>
              <tr className="border-b border-gray-4">
                <td className="p-2">165445</td>
                <td className="p-2">90000</td>
              </tr>
              <tr className="even:bg-gray-2">
                <td className="p-2">165445</td>
                <td className="p-2">90000</td>
              </tr>
              <tr className="border-b border-gray-4">
                <td className="p-2">165445</td>
                <td className="p-2">90000</td>
              </tr>
              <tr className="even:bg-gray-2">
                <td className="p-2">165445</td>
                <td className="p-2">90000</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
