import {
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

export function ModularInput(props: any) {
  //console.log(400,props);

  return (
    <div>
      <label>{props.title}</label>
      {renderUi(
        <input className='form-control'
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
            format={props.format || 'DD MMMM YYYY - HH:mm'}
            className="datetime-picker"
            inputClass="datetime-input"
            plugins={
              props.hideTime ? [] : [<AnalogTimePicker hideSeconds={true} />]
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
