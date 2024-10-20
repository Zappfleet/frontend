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
import ErrorBoundary from '../../../components/ErrorBoundary/ErrorBoundary';

export default function AgencyReport({ handleBackClick, title }: any) {

  // console.log(21);

  const { result } = useReportAgency()
  const [items, setItems] = useState<any>(null)
  useEffect(() => {
    console.log(5007, result);
    result?.data?.length > 0 && setItems(result.data)
  }, [result])

  useEffect(() => {
    console.log(5007, items);
  }, [items])

  const options = [{ id: 1, value: 5 }, { id: 2, value: 10 }, { id: 3, value: 15 }]
  const thead = [
    { key: 'agency_name', name: 'نام آژانس' },
    { key: 'confirmed_by', name: 'ثبت کننده' },
    // { key: 'proj_desc', name: 'توضیح پروژه' },
    // { key: 'manager_emp_num', name: 'شناسه مدیر' },
    // { key: 'cost_center', name: 'مرکز هزینه' },
    { key: 'bill_number', name: 'شماره فاکتور' },
    { key: 'cost_agance', name: 'هزینه' },
    { key: 'mission_date', name: 'تاریخ سفر', key2: 'fromdate', type: 'caleadar' },
    { key: 'created_by', name: 'مسافر' },

    { key: 'distance', name: 'مسافت' },
    { key: 'distance_dasti', name: ' مسافت دستی' },
    // { key: 'mission_start', name: 'شروع سفر' },
    // { key: 'mission_end', name: 'پایان سفر' },
    { key: 'proj_desc', name: 'توضیحات' },
    // { key: 'endBeforeService', name: 'پایان سرویس قبلی', type: 'caleadar', key2: 'todate' },
  ]

  const clickOnRow = (item: any, type: any) => {
    console.log(77, item);

  }

  return <>
    {!items && <p>Loading</p>}
    {items &&
      <div className='AgencyReport-component'>
        {/* <i className=' fa fa-arrow-left back-icon' onClick={handleBackClick}></i> */}
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
            {items &&
              <DataGrid
                clickOnRow={clickOnRow}
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
  </>

}
