import classNames from 'classnames';
import './style.scss'
import React, { useState } from 'react';

type FloatingButtonWithModalProps = {
  icon?: any;
  children?: any;
};

const FloatingButtonWithModal = (props: FloatingButtonWithModalProps) => {
  const [state, setState] = useState(false);

  const handle_toggleModal = () => {
    setState(!state);
  };

  return (
    <div className="FloatingButtonWithModal-component">
      <i className='fa fa-plus icon'
        style={{ display: !state ? 'block' : 'none' }}
        onClick={handle_toggleModal}></i>


      <i className='fa fa-remove icon'
        style={{ display: state ? 'block' : 'none' }}
        onClick={handle_toggleModal}></i>


      <div
        style={{ display: state ? 'block' : 'none' }}
        className='pishkhan-div'>
        {props.children}
      </div>
      
    </div>


  );
};

export default FloatingButtonWithModal;
