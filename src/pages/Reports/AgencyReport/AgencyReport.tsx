import DatePicker from 'react-multi-date-picker';
import './style.scss'
import useVehicles from '../../../hooks/data/useVehicles';
import { VEHICLE_TYPE_AGENCY } from '../../../lib/constants';
import AgencySuggestionInput from '../../../widgets/AgencySuggestionInput';
import SuggestionTextInput from '../../../widgets/SuggestionTextInput/SuggestionTextInput';
import { useEffect, useRef, useState } from 'react';

import persian from 'react-date-object/calendars/persian';
import persian_fa from 'react-date-object/locales/persian_fa';
import moment from 'jalali-moment';
import { BsFileExcel } from 'react-icons/bs';
import { RiFileExcel2Line } from 'react-icons/ri';
import SimpleButton from '../../../components/SimpleButton';
import DataGrid from '../../../components/DataGrid/DataGrid';
import useReportAgency from '../../../hooks/data/reports/useReportAgency';

export default function AgencyReport({ handleBackClick, title }: any) {

  console.log(21);

  const { result } = useReportAgency()
  const [items, setItems] = useState<any>(null)
  useEffect(() => {
    //console.log(5007, result);
    result?.data?.length > 0 && setItems(result.data)
  }, [result])

  useEffect(() => {
    console.log(5007, items);
  }, [items])

  const options = [{ id: 1, value: 5 }, { id: 2, value: 10 }, { id: 3, value: 15 }]
  const thead = [
    { key: 'project_Code', name: 'کد پروژه' },
    { key: 'proj_desc', name: 'توضیح پروژه' },
    { key: 'manager_emp_num', name: 'شناسه مدیر' },
    { key: 'cost_center', name: 'مرکز هزینه' },
    { key: 'desc', name: 'توضیحات' },
    { key: 'cost', name: 'هزینه' },
    { key: 'mission_date', name: 'تاریخ سفر' },
    { key: 'created_by', name: 'مسافر' },
    { key: 'distance', name: 'مسافت' },
    { key: 'mission_start', name: 'شروع سفر' },
    { key: 'mission_end', name: 'پایان سفر' },
    // { key: 'endBeforeService', name: 'پایان سرویس قبلی', type: 'caleadar', key2: 'todate' },
  ]

  
  return <div className='AgencyReport-component'>
    <i className=' fa fa-arrow-left back-icon' onClick={handleBackClick}></i>
    <p>{title}</p>

    <div className="flex items-center px-4">
      <div className="flex-1 px-4 ">
        {/* <AgencySuggestionInput onAgencySelected={setSelectedAgency} /> */}
      </div>
      <div>
        {/* <DatePicker
          onChange={setDateRage}
          range
          calendar={persian}
          locale={persian_fa}
          className="datetime-picker"
          inputClass="datetime-input !text-center !text-lg !p-4 "
          value={dateRage}
        /> */}
      </div>
    </div>
    <div className="row">
      <div className="col-12">
        {items && <DataGrid
          pagesize={options[0].value}
          items={items}
          options={options}
          thead={thead}
        />
        }
      </div>
    </div>
  </div>
}
