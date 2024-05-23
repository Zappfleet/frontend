import React from 'react';
import './Page403Style.scss'

const Page403 = () => {
    return (
        <div className='page403-component'>
            <div className="row">
                <div className="col-12 flex-center">
                    <p className='codeError'>403 <i className='fa fa-lock'></i></p>
                </div>
                <div className="col-12 flex-center">
                    <p className='text'>شما اجازه دسترسی ندارید!!!</p>
                </div>
            </div>
        </div>
    );
};

export default Page403;