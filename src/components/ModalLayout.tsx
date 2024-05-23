import classNames from 'classnames';
import React, { ReactElement } from 'react';
import { BiX } from 'react-icons/bi';
import { ModalActions, ModalState } from '../hooks/useModal';

interface ModalLayoutInterface {
  mode?: 'center' | 'fullscreen' | 'none';
  zIndex?: number;
  noScroll?: boolean;
  renderContent: (data: any) => ReactElement | string;
}

const ModalLayout = (
  props: React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  > &
    ModalLayoutInterface &
    ModalState &
    ModalActions
) => {
  return (
    <div
      style={{
        zIndex: props.zIndex,
        ...props.style,
      }}
      className={classNames(
        ' fixed left-0 right-0 top-0 flex h-screen justify-center duration-150 ',
        {
          scroller: !props.noScroll,
          'items-start': props.mode == null || props.mode == 'none',
          'items-center': props.mode == 'center',
          'bg-gray-900/[0] pointer-events-none': !props.open,
          'bg-graydark/[0.7]': props.open,
        }
      )}
    >
      <div
        className={classNames('rounded bg-white p-2 shadow duration-300', {
          'mb-2 ml-2 mr-1 mt-19 flex-1 lg:ml-2 lg:mr-75':
            props.mode == 'fullscreen',
          'pointer-events-none scale-0': !props.open,
          'scale-100': props.open,
        })}
      >
        <BiX
          onClick={props.handle_close}
          color="gray"
          className={classNames(
            'absolute left-1 top-3 z-30 ml-2 cursor-pointer duration-150',
            { 'opacity-0': !props.open }
          )}
        />
        {props.open && props.renderContent(props.data)}
      </div>
    </div>
  );
};

export default ModalLayout;
