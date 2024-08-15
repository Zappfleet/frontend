import React from 'react';
import './style.scss'

function Alert({ msg, handleDataGridDelete }: any) {
   
    return (
        <div className='alert-component'>
            <div className="alert">
                <p className='alert-msg'>{msg}</p>
                <div className="buttens">
                    <button onClick={() => handleDataGridDelete(true)} className='my-btn'>تایید</button>
                    <button onClick={() => handleDataGridDelete(false)} className='my-btn'>انصراف</button>
                </div>
            </div>
        </div>
    );
}

export default Alert;