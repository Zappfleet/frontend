// import { Link } from 'react-router-dom';
// import Logo from '../images/logo/logo-icon.svg';
// import DarkModeSwitcher from './DarkModeSwitcher';
// import DropdownMessage from './DropdownMessage';
// import DropdownNotification from './DropdownNotification';
import { NavLink } from 'react-router-dom';
import DropdownUser from '../../components/DropdownUser/DropdownUser';
import './HeaderStyle.scss'
import ErrorBoundary from '../../components/ErrorBoundary/ErrorBoundary';

const Header = () => {
  return (
    <header className="bg-primary header-component">
      <div className="row header-div">
        <div className={`col-12 col-md-${import.meta.env.VITE_CUSTOMER_NAME !== 'zarghan' ? '2' : '10'} flex-right`}>
          <NavLink to={"/"}>
            <span className='titlepage'>{import.meta.env.VITE_TITLE}</span>
          </NavLink>
        </div>

        {import.meta.env.VITE_CUSTOMER_NAME !== 'zarghan' &&
          <div className="col-12 col-md-8 flex-center">
            <div className="search flex-center">
              <input
                type="text"
                placeholder="جستجو ..."
                className='form-control'
              />
              <i className='fa fa-search flex-center'></i>
            </div>
          </div>
        }


        <div className="col-2 d-block d-md-none"></div>

        <div className="col-10 col-md-2 flex-end">

          <DropdownUser />

        </div>

      </div>
    </header>
  );
};

export default Header;
