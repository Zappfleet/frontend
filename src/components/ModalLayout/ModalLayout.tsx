import classNames from 'classnames';
import React, { ReactElement } from 'react';
import { BiX } from 'react-icons/bi';
import { ModalActions, ModalState } from '../../hooks/useModal';
import './style.scss'

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
    <>
      {props.open &&
        <div className='ModalLayout-component'>
          <div className="modal-content">
            <div>
              <i onClick={props.handle_close} className='fa fa-close close-icon'></i>
              {props.renderContent(props.data)}
            </div>
          </div>
        </div>
      }
    </>
  );
};

export default ModalLayout;
