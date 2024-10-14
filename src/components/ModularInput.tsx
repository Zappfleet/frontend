import {
  DB_ROLE_MOSAFER_TITLE,
  INPUT_TYPE_DATETIME,
  INPUT_TYPE_LIST,
  INPUT_TYPE_NUMBER,
  INPUT_TYPE_TEXT,
  INPUT_TYPE_USERLIST,
} from '../lib/constants';
import renderUi from '../lib/renderUi';

import DatePicker from 'react-multi-date-picker';
import persian from 'react-date-object/calendars/persian';
import persian_fa from 'react-date-object/locales/persian_fa';
import AnalogTimePicker from 'react-multi-date-picker/plugins/analog_time_picker';
import UsersSuggestionInput from '../widgets/UsersSuggestionInput/UsersSuggestionInput';
import moment from 'jalali-moment';
import { convertToJalali } from '../utils/utils';
import useAuthentication from '../hooks/data/useAuthentication';
import { useEffect, useState } from 'react';
import ErrorBoundary from './ErrorBoundary/ErrorBoundary';

export function ModularInput(props: any) {
  //console.log(40044,props);

  const { authInfo } = useAuthentication();
  const [minDate, setMinDate] = useState<any>(null)

  useEffect(() => {

    if (authInfo?.auth?.roles?.filter((ite: any) => ite.title === DB_ROLE_MOSAFER_TITLE)?.length === 1) {
      setMinDate(moment(new Date()).format('jYYYY/jMM/jDD - HH:mm'))
    }
  }, [authInfo])


  // console.log(72, minDate);


  return (
    <div>
      <label>{props.title}</label>
      {renderUi(
        <input className='form-control sgh'
          disabled={props.className1}
          {...props}
          name={props.inputKey}
        />
      ).if(props.type == INPUT_TYPE_TEXT || props.type == INPUT_TYPE_NUMBER)}
      {renderUi(
        <select {...props} name={props.inputKey}>
          {props.options?.map((option: any) => {
            return (
              <option key={option.key} value={option.key}>
                {option.title}
              </option>
            );
          })}
        </select>
      ).if(props.type == INPUT_TYPE_LIST)}
      {renderUi(

        <div>

          <DatePicker
            {...props}
            onChange={(value: any) => {
              props.onChange({
                target: {
                  name: props.inputKey,
                  value,
                },
              });
            }}
            dateSeparator={' , '}
            calendar={persian}
            locale={persian_fa}
            format={props.format || 'YYYY/MM/DD - HH:mm'}
            className="datetime-picker"
            inputClass="datetime-input"
            minDate={minDate} // تنظیم تاریخ حداقل قابل انتخاب به امروز
            plugins={
              props.hideTime ? [] : [
                <AnalogTimePicker hideSeconds={true} />
              ]
            }
          />


        </div>
      ).if(props.type == INPUT_TYPE_DATETIME)}
      {renderUi(
        <div>

          <UsersSuggestionInput
            {...props}
            name={props.inputKey}
            freeInput={false}
            permissions={['SERVICE.PERSONAL.SUBMIT']}
            include_external_base={true}
          />

        </div>
      ).if(props.type == INPUT_TYPE_USERLIST)}
    </div>
  );
}
