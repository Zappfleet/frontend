
import './MainStyle.scss';
import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import ErrorBoundary from '../../components/ErrorBoundary/ErrorBoundary';

const Main = () => {
    return (
        <main className='main-component'>
             
                <Outlet />
             
        </main>
    );
};

export default Main;