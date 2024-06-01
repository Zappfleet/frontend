'use client';

import classNames from 'classnames';
import ModalLayout from '../components/ModalLayout/ModalLayout';
import useModal from './useModal';

const useContentModal = (props?: any) => {
  const modal = useModal();

  const ui = (
    <ModalLayout
      {...modal}
      {...props}
      renderContent={(data: any) => {
        if (!data) return '';
        return (
          <div className={classNames({ 'lg:w-90': !props.ignoreFixedWidth })}>
            <label className="inline-block px-1 pt-2 text-sm">
              {props.title || '<title>'}
            </label>
            <div>{props.renderContent}</div>
          </div>
        );
      }}
    />
  );

  const show = (data: any) => {
    modal.handle_open(data);
  };

  const hide = () => {
    modal.handle_close();
  };

  return {
    ui,
    show,
    hide,
  };
};

export default useContentModal;
