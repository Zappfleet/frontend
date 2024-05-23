import classNames from 'classnames';
import React from 'react';
import { BiFilterAlt } from 'react-icons/bi';
import useModal from '../hooks/useModal';
import useContentModal from '../hooks/useContentModal';
import DatePicker from 'react-multi-date-picker';
import persian from 'react-date-object/calendars/persian';
import persian_fa from 'react-date-object/locales/persian_fa';
import { requestStatus } from '../lib/string';
import CheckboxOne from '../components/CheckboxOne';

const SearchInputWithFilter = (props: any) => {
  const { ui: ModalUi, show } = useContentModal({
    renderContent: (
      <div>
        <div className="m-2">
          <label className="inline-block p-2  text-primary">
            {'بازه تاریخی'}
          </label>
          <DatePicker
            range
            dateSeparator={' , '}
            calendar={persian}
            locale={persian_fa}
            format="DD MMMM YYYY"
            className="datetime-picker"
            inputClass="datetime-input"
          />
        </div>
        <div className="m-2">
          <label className="inline-block w-full p-2 text-primary">
            {'وضعیت'}
          </label>
          <div className="flex flex-col">
            {requestStatus.map(([key, title]: any) => {
              return (
                <span key={key} className="inline-flex pl-4">
                  <label htmlFor={key} className="w-32 cursor-pointer p-1 px-2">
                    {title}
                  </label>
                  <input
                    name={`${key}`}
                    id={`${key}`}
                    type="checkbox"
                    className="cursor-pointer"
                  />
                </span>
              );
            })}
          </div>
        </div>
        <button className="mt-2 w-full rounded bg-primary p-2 text-white">
          {'اعمال'}
        </button>
      </div>
    ),
  });

  const handle_filterClick = () => {
    show({});
    // alert("handle_filterClick")
  };
  return (
    <div
      className={classNames(
        'relative w-full rounded-lg shadow',
        props.className
      )}
    >
      {ModalUi}
      <input
        type="text"
        placeholder="جستجو..."
        className="w-full bg-transparent p-2 pl-9 pr-4 focus:outline-none"
      />
      <BiFilterAlt
        onClick={handle_filterClick}
        className="absolute left-3 top-1/2 -translate-y-1/2 cursor-pointer"
        size={24}
      />
    </div>
  );
};

export default SearchInputWithFilter;
