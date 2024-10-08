'use client';

import ErrorBoundary from '../components/ErrorBoundary/ErrorBoundary';
import ModalLayout from '../components/ModalLayout/ModalLayout';
import useModal from './useModal';

const useFullScreenModal = (props: any) => {
  const modal = useModal();

  const ui = (
     
      <ModalLayout
        {...modal}
        {...props}
        mode="fullscreen"
        renderContent={props.renderContent}
        zIndex={props.zIndex}
      />
     
  );

  const show = (data: any) => {
    modal.handle_open(data);
  };

  const close = () => {
    modal.handle_close();
  };

  return {
    ui,
    show,
    close,
  };
};

export default useFullScreenModal;
