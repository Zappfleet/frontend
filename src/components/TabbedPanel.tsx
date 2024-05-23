import classNames from 'classnames';
import { useState } from 'react';

function TabbedPanel(props: any) {
  const [state, setState] = useState({
    selectedKey: props.defaultTabKey || props.tabs[0].key,
  });

  const handle_clickTabs = (item: any) => {
    setState({ ...state, selectedKey: item.key });
    if (props.onTabChange) props.onTabChange(item);
  };

  return (
    <div>
      <div className="scroller flex flex-col bg-white shadow">
        <div>
          <ul className="scroller flex border-b border-gray">
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
          </ul>
        </div>
        <div className="p-2">
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
