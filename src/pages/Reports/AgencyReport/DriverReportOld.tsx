import DatePicker from 'react-multi-date-picker';
import UsersSuggestionInput from '../../../widgets/UsersSuggestionInput/UsersSuggestionInput';
import { useEffect, useState } from 'react';
import persian from 'react-date-object/calendars/persian';
import persian_fa from 'react-date-object/locales/persian_fa';
import moment from 'jalali-moment';
import SimpleButton from '../../../components/SimpleButton';
import { RiFileExcel2Line } from 'react-icons/ri';
import useReportDriverDaily from '../../../hooks/data/reports/useReportDriverDaily';
import { getLocalDatetime } from '../../../lib/string';
import ErrorBoundary from '../../../components/ErrorBoundary/ErrorBoundary';

export default function DriverReport({ handleBackClick, title }: any) {
  const [selectedUsersState, setSelectedUsersState] = useState<any>([]);
  const [dateRage, setDateRage] = useState<any>([
    moment().subtract(7, 'days').toDate().getTime(),
    moment.now(),
  ]);

  useEffect(() => {
    //console.log(200,dateRage);

  }, [dateRage])

  const { state: dailyReport } = useReportDriverDaily({
    driver_id: selectedUsersState?.[0]?._id,
    date_filter: {
      gmt_from: dateRage[0],
      gmt_to: dateRage[1],
    },
  });

  useEffect(() => {
    console.log(200,dailyReport);

  }, [dailyReport])

  function handle_setSelectedUsers(value: any) {
    setSelectedUsersState(value?.length > 0 ? [value[1] || value[0]] : []);
  }
  return (
    <div className='AgencyReport-component'>

      {/* <i className='fa fa-arrow-left back-icon' onClick={handleBackClick}></i> */}
      <p>{title}</p>
      <div className="flex items-center px-4">
        <div className="flex-1 px-4 ">
           
            <UsersSuggestionInput
              hideChips={true}
              showListOnTop={false}
              externalState={[selectedUsersState, handle_setSelectedUsers]}
              permissions={['DRIVER']}
            />
           

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
          {selectedUsersState?.[0] && (
            <div>
              <div>
                <div className="p-2">
                  <label>{'نام : '}</label>
                  <label>{selectedUsersState?.[0]?.full_name}</label>
                </div>
                <div className="p-2">
                  <label>{'شماره  : '}</label>
                  <label>{selectedUsersState?.[0]?.phone}</label>
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
                <th className="p-1">تاریخ</th>
                <th className="p-1">تعداد سفر</th>
                <th className="p-1">زمان در سفر</th>
                <th className="p-1">مسیر طی شده</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(dailyReport?.trip_report || {}).map(
                ([key, value]: any) => {
                  return (
                    <tr className="border-b border-gray-4">
                      <td className="p-2">{getLocalDatetime(key)}</td>
                      <td className="p-2">2</td>
                      <td className="p-2">
                        {moment
                          .utc(moment(value?.mission_duration * 100000))
                          .format('HH:mm:ss')}
                      </td>
                      <td className="p-2">-</td>
                    </tr>
                  );
                }
              )}
              {Object.entries(dailyReport?.trip_report || {}).map(
                ([key, value]: any) => {
                  return (
                    <tr className="border-b border-gray-4">
                      <td className="p-2">{getLocalDatetime(key)}</td>
                      <td className="p-2">2</td>
                      <td className="p-2">
                        {moment
                          .utc(moment(value?.mission_duration * 100000))
                          .format('HH:mm:ss')}
                      </td>
                      <td className="p-2">-</td>
                    </tr>
                  );
                }
              )}
              {Object.entries(dailyReport?.trip_report || {}).map(
                ([key, value]: any) => {
                  return (
                    <tr className="border-b border-gray-4">
                      <td className="p-2">{getLocalDatetime(key)}</td>
                      <td className="p-2">2</td>
                      <td className="p-2">
                        {moment
                          .utc(moment(value?.mission_duration * 100000))
                          .format('HH:mm:ss')}
                      </td>
                      <td className="p-2">-</td>
                    </tr>
                  );
                }
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
