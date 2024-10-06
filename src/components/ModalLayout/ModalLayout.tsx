import classNames from 'classnames';
import React, { ReactElement, useEffect } from 'react';
import { BiX } from 'react-icons/bi';
import { ModalActions, ModalState } from '../../hooks/useModal';
import './style.scss'

interface ModalLayoutInterface {
  mode?: 'center' | 'fullscreen' | 'none';
  zIndex?: number;
  noScroll?: boolean;
  className?: String;
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

  // // تنظیم موقعیت محتوای مودال با توجه به اسکرول
  // useEffect(() => {
  //   const handleScroll = () => {
  //     const modalContent = document.querySelector('.modal-content') as HTMLElement;
  //     if (modalContent) {
  //       const scrollTop = window.scrollY || document.documentElement.scrollTop;
  //       modalContent.style.top = `calc(200px + ${scrollTop}px)`;
  //     }
  //   };

  //   // یکبار هنگام بارگذاری برای تنظیم موقعیت اولیه فراخوانی شود
  //   handleScroll();

    
  //   window.addEventListener('scroll', handleScroll);
  //   return () => {
  //     window.removeEventListener('scroll', handleScroll);
  //   };
  // }, []);

  return (
    <>
      {props.open &&
        <div className={props.className ? props.className : `ModalLayout-component`} style={{ zIndex: props.zIndex }}>
          <div className="modal-content modal-content2 ">
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
