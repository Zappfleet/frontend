import classNames from 'classnames';
import React, { useState } from 'react';

type FloatingButtonWithModalProps = {
  icon?: any;
  children?: any;
};

const FloatingButtonWithModal = (props: FloatingButtonWithModalProps) => {
  const [state, setState] = useState({
    open: false,
  });

  const handle_toggleModal = () => {
    setState({ ...state, open: !state.open });
  };

  return (
    <>
      <button
        onClick={handle_toggleModal}
        style={{ zIndex: 1000001 }}
        className={classNames(
          'fixed bottom-4 left-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary duration-200',
          {
            '!rotate-45': state.open,
          }
        )}
      >
        {props.icon}
      </button>
      <div
        style={{ zIndex: 1000000 }}
        className={classNames('fixed bottom-0 left-0', {
          '!pointer-events-none': !state.open,
        })}
      >
        <div
          className={classNames(
            'mx-2 mb-20 rounded border border-gray-4 bg-white py-3 shadow-lg duration-200',
            {
              '!pointer-events-none !scale-0 !p-0 !opacity-0': !state.open,
            }
          )}
        >
          {props.children}
        </div>
      </div>
    </>
  );
};

export default FloatingButtonWithModal;
