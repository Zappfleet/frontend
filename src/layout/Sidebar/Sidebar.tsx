
import './Style.scss'
import React, { useEffect, useRef, useState } from 'react';

import { NavLink, useLocation } from 'react-router-dom';
import Logo from '../images/logo/logo.svg';
import SidebarLinkGroup from '../../components/SidebarLinkGroup';
import useNavigationMenu, { NavigationMenuItem } from '../../hooks/useNavigationMenu';

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (arg: boolean) => void;
}

const Sidebar = () => {

  const navigationMenu = useNavigationMenu();

  const location = useLocation();
  const { pathname } = location;

  const trigger = useRef<any>(null);
  const sidebar = useRef<any>(null);

  const storedSidebarExpanded = localStorage.getItem('sidebar-expanded');
  const [sidebarExpanded, setSidebarExpanded] = useState(
    storedSidebarExpanded === null ? false : storedSidebarExpanded === 'true'
  );





  useEffect(() => {
    localStorage.setItem('sidebar-expanded', sidebarExpanded.toString());
    if (sidebarExpanded) {
      document.querySelector('body')?.classList.add('sidebar-expanded');
    } else {
      document.querySelector('body')?.classList.remove('sidebar-expanded');
    }
  }, [sidebarExpanded]);

  return (
    <div className="sidebar-component">
      <aside ref={sidebar}>
        <ul>
          {
            navigationMenu?.map((menuItem: NavigationMenuItem) => {
              if (menuItem.is_title) return <h3 key={menuItem.key} >{menuItem.label}</h3>
              if (menuItem.sub_menu == null) return <li key={menuItem.key}>
                <NavLink
                  to={menuItem.href as string}
                >
                  <i>{menuItem.icon} </i>
                  <span> {menuItem.label} </span>

                </NavLink>
              </li>

              return <ul key={menuItem.key}>
                <SidebarLinkGroup
                  activeCondition={
                    pathname === '/' || pathname.includes('dashboard')
                  }
                >
                  {(handleClick, open) => {
                    return (
                      <React.Fragment>
                        <NavLink
                          to="#"
                          onClick={(e) => {
                            e.preventDefault();
                            sidebarExpanded
                              ? handleClick()
                              : setSidebarExpanded(true);
                          }}
                        >
                          {menuItem.icon}
                          {menuItem.label}
                        </NavLink>

                        <div>
                          <ul>
                            {menuItem.sub_menu?.map((menuItem: NavigationMenuItem) => {
                              return <li key={menuItem.key}>
                                <NavLink
                                  to={menuItem.href as string}
                                >
                                  {menuItem.icon}
                                  {menuItem.label}
                                </NavLink>
                              </li>
                            })}
                          </ul>
                        </div>
                      </React.Fragment>
                    )
                  }}
                </SidebarLinkGroup>
              </ul>;
            })
          }
        </ul>
      </aside >
    </div>
  );
};

export default Sidebar;
