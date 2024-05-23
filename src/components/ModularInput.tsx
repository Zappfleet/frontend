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
import UsersSuggestionInput from '../widgets/UsersSuggestionInput';

export function ModularInput(props: any) {
  return (
    <div>
      <label className="inline-block py-2">{props.title}</label>
      {renderUi(
        <input
          {...props}
          className="w-full rounded border border-gray-4 p-2 outline-none"
          name={props.inputKey}
        />
      ).if(props.type == INPUT_TYPE_TEXT || props.type == INPUT_TYPE_NUMBER)}
      {renderUi(
        <select {...props} className="select-box w-full" name={props.inputKey}>
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
            freeInput={true}
            permissions={['SERVICE.PERSONAL.SUBMIT']}
            include_external_base={true}
          />
        </div>
      ).if(props.type == INPUT_TYPE_USERLIST)}
    </div>
  );
}
