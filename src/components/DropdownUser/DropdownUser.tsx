import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import './style.scss'
import UserOne from '../images/user/user-01.png';
import useConfirmModal from '../../hooks/useConfirmModal/useConfirmModal';
import { storeTokens } from '../../pages/Authentication/utils';
import { LOGIN_PAGE } from '../../lib/constants';
import useAuthentication from '../../hooks/data/useAuthentication';
import { BiUserCircle } from 'react-icons/bi';
import { FaUserCircle } from 'react-icons/fa';
import classNames from 'classnames';
import useUsers from '../../hooks/data/useUsers';

const DropdownUser = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);


  const { authInfo } = useAuthentication();
  const { userList, refreshData } = useUsers();

  const [fullname, setFullName] = useState<any>(null);

  useEffect(() => {

    if (authInfo && userList) {
      const user = userList?.filter((ite: any) => ite._id === authInfo?.auth?._id)
      console.log(44, user);

      setFullName(user[0]?.full_name)
    }

  }, [authInfo])

  console.log(21, authInfo, userList);


  const { show: showConfirm, ui: ModalUi } = useConfirmModal('ModalLayout-component-login');
  const navigate = useNavigate();


  const trigger = useRef<any>(null);
  const dropdown = useRef<any>(null);

  // close on click outside
  useEffect(() => {
    const clickHandler = ({ target }: MouseEvent) => {
      if (!dropdown.current) return;
      if (
        !dropdownOpen ||
        dropdown.current.contains(target) ||
        trigger.current.contains(target)
      )
        return;
      setDropdownOpen(false);
    };
    document.addEventListener('click', clickHandler);
    return () => document.removeEventListener('click', clickHandler);
  });

  // close if the esc key is pressed
  useEffect(() => {
    const keyHandler = ({ keyCode }: KeyboardEvent) => {
      if (!dropdownOpen || keyCode !== 27) return;
      setDropdownOpen(false);
    };
    document.addEventListener('keydown', keyHandler);
    return () => document.removeEventListener('keydown', keyHandler);
  });

  const handle_logOut = () => {
    storeTokens({});
    navigate(LOGIN_PAGE)
  }

  const prompt_userLogout = () => {
    showConfirm({
      title: "خروج از حساب",
      desc: `آیا قصد خروج از حساب کاربری خود را دارید؟`,
      label_confirm: "بله, خارج شو!",
      label_cancel: "خیر",
      onConfirm: () => handle_logOut()
    })
  }

  return (
    <div className="DropdownUser-component">
      {ModalUi}
      <NavLink
        ref={trigger}
        onClick={() => setDropdownOpen(!dropdownOpen)}
        to="#"
      >
        <span className='userTitle'>
          {fullname ? fullname : authInfo?.auth?.username}
        </span>
        <i className='fa fa-user user-img'></i>
        <i className=' fa fa-angle-down '></i>
      </NavLink>

      <div
        ref={dropdown}
        onFocus={() => setDropdownOpen(true)}
        onBlur={() => setDropdownOpen(false)}
        className='profile-div'
        style={{ display: dropdownOpen === true ? 'block' : 'none' }}>
        <ul>

          {import.meta.env.VITE_CUSTOMER_NAME !== 'zarghan' &&
            < li >
              <NavLink
                to="/profile"
              >
                <i className='fa fa-user'></i>
                <span>پروفایل</span>
              </NavLink>

            </li>
          }

          <li>
            <button
              onClick={prompt_userLogout}>
              <i className='fa fa-sign-out'></i>
              <span>خروج</span>

            </button>
          </li>
        </ul>
      </div >
    </div >
  );
};

export default DropdownUser;
