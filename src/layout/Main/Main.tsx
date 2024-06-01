
import './MainStyle.scss';
import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';

const Main = () => {
    return (
        <main className='main-component'>
            <Outlet />
        </main>
    );
};

export default Main;