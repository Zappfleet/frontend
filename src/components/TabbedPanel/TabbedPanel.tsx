import classNames from 'classnames';
import './style.scss'
import { useState } from 'react';

function TabbedPanel(props: any) {
  const [state, setState] = useState({
    selectedKey: props.defaultTabKey || props.tabs[0].key,
  });

  const handle_clickTabs = (item: any) => {
    setState({ ...state, selectedKey: item.key });
    if (props.onTabChange) props.onTabChange(item);
  };

  const handleSelectChange = (event: any) => {
    const selectedKey = event.target.value;
    const selectedItem = props.tabs.find((item: any) => item.key === selectedKey);
    handle_clickTabs(selectedItem);
  };

  return (
    <div className='TabbedPanel-component'>
      <div className="row">
        <div className="col-12">
          <div className="select">
            <select
              onChange={handleSelectChange}
              value={state.selectedKey}
              className="form-control"
            >
              {props.tabs?.map((item: any) => (
                <option
                  key={item.key}
                  value={item.key}
                  className="cursor-pointer whitespace-nowrap hover:saturate-50"
                >
                  {item.label}
                </option>
              ))}
            </select>
            {/* <ul className="scroller flex border-b border-gray">
            {props.tabs?.map((item: any) => {
              return (
                <li
                  onClick={() => handle_clickTabs(item)}
                  key={item.key}
                  className={classNames(
                    'flex-1 cursor-pointer whitespace-nowrap px-10 py-3 text-center hover:saturate-50',
                    {
                      'bg-gray': state.selectedKey == item.key,
                    }
                  )}
                >
                  {item.label}
                </li>
              );
            })}
          </ul> */}
          </div>
        </div>
      </div>


      <div className="row">
        <div className="col-12">
          {props.tabs?.map((item: any) => {
            if (item.key != state.selectedKey) return;
            return item.component;
          })}
        </div>
      </div>
    </div>

  );
}

export default TabbedPanel;
