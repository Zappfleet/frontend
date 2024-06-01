// import { Link } from 'react-router-dom';
// import Logo from '../images/logo/logo-icon.svg';
// import DarkModeSwitcher from './DarkModeSwitcher';
// import DropdownMessage from './DropdownMessage';
// import DropdownNotification from './DropdownNotification';
import DropdownUser from '../../components/DropdownUser/DropdownUser';
import './HeaderStyle.scss'

const Header = () => {
  return (
    <header className="bg-primary header-component">
      <div className="row header-div">
        <div className="col-12 col-md-2 flex-center">
          <span className='titlepage'> سامانه ی جامع حمل و نقل زپ</span>
        </div>

        <div className="col-2 d-block d-md-none"></div>
        <div className="col-6 col-md-8 flex-center">
          <div className="search flex-center">
            <input
              type="text"
              placeholder="جستجو ..."
              className='form-control'
            />
            <i className='fa fa-search flex-center'></i></div>
        </div>

        <div className="col-4 col-md-2 flex-end">
          <DropdownUser />
        </div>

      </div>
    </header>
  );
};

export default Header;
