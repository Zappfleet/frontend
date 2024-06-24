import { useEffect, useState } from 'react';
import { BiShapePolygon, BiUser } from 'react-icons/bi';
import { BsFillCarFrontFill } from 'react-icons/bs';
import { MdAssignmentInd } from 'react-icons/md';
import useCurrentUserPermissions from './useCurrentUserPermissions';
import {
  PERMIT_ONLYADMIN,
  PERMIT_AREAS,
  PERMIT_AREAS_CREATE,
  PERMIT_DEFINITIONS,
  PERMIT_DELEGATION,
  PERMIT_DRIVER,
  PERMIT_PASSENGER_SERVICE,
  PERMIT_REPORTS,
  PERMIT_SERVICE,
  PERMIT_USERS_CREATE,
  PERMIT_USERS_DELETE,
  PERMIT_USERS_EDIT,
  PERMIT_USERS_LIST,
  PERMIT_VEHICLES_CREATE,
  PERMIT_RESTRICTION
} from '../lib/constants';

export type NavigationMenuItem = {
  key: string;
  label: string;
  is_title?: boolean;
  href?: string;
  sub_menu?: Array<NavigationMenuItem>;
  icon?: any;
};

export default function useNavigationMenu() {
  const { hasPermitGroup, hasPermitFor, hasAdminRank, permits, authInfo } =
    useCurrentUserPermissions();
  const [navigatioMenu, setNavigationMenu] =
    useState<Array<NavigationMenuItem>>();

  useEffect(() => {
    if (permits == null) return;

    const allNavItems = [
      // {
      //   key: 'menu.admin',
      //   label: 'منو مدیریت',
      //   is_title: true,
      //   isPermitted: true,
      // },
      {
        key: 'menu.services',
        label: 'سرویس ها',
        is_title: false,
        href: '/trip-mission',
        icon: <BsFillCarFrontFill />,
        isPermitted: hasPermitGroup([PERMIT_SERVICE]),
      },
      {
        key: 'menu.users',
        label: 'کاربران',
        is_title: false,
        href: '/user/',
        icon: <BiUser />,
        isPermitted: hasPermitGroup([
          PERMIT_USERS_CREATE,
          PERMIT_USERS_EDIT,
          PERMIT_USERS_DELETE,
        ]),
      },
      {
        key: 'menu.roles',
        label: 'نقش و عملیات',
        is_title: false,
        href: '/user/role-actions',
        icon: <MdAssignmentInd />,
        isPermitted: hasAdminRank(),
      },
      {
        key: 'menu.areas',
        label: 'محدوده ها',
        is_title: false,
        href: '/areas',
        icon: <BiShapePolygon />,
        isPermitted: hasPermitGroup([PERMIT_AREAS_CREATE]),
      },
      {
        key: 'menu.restriction',
        label: 'محدودیت ها',
        is_title: false,
        href: '/restriction',
        icon: <BiShapePolygon />,
        isPermitted: hasPermitGroup([PERMIT_RESTRICTION]),
      },
      {
        key: 'menu.definitions',
        label: 'تعاریف',
        is_title: false,
        href: '/definitions',
        icon: <BiShapePolygon />,
        isPermitted: hasPermitGroup([PERMIT_DEFINITIONS]),
      },
      {
        key: 'menu.vehicles',
        label: 'خودرو ها',
        is_title: false,
        href: '/vehicles',
        icon: <BiShapePolygon />,
        isPermitted: hasPermitGroup([
          PERMIT_VEHICLES_CREATE,
          PERMIT_USERS_DELETE,
          PERMIT_USERS_EDIT,
        ]),
      },
      {
        key: 'menu.deligations',
        label: 'تفویض اختیارات',
        is_title: false,
        href: '/deligations',
        icon: <BiShapePolygon />,
        isPermitted: hasPermitFor([PERMIT_DELEGATION]),
      },
      {
        key: 'menu.reports',
        label: 'گزارشات',
        is_title: false,
        href: '/reports',
        icon: <BiShapePolygon />,
        isPermitted: hasPermitGroup([PERMIT_REPORTS]),
      },
      {
        key: 'menu.reports',
        label: 'گزارش زمان سرویس',
        is_title: false,
        href: '/TimeOfServices',
        icon: <BiShapePolygon />,
        isPermitted: hasPermitGroup([PERMIT_REPORTS]),
      },
      {
        key: 'menu.reports',
        label: 'گزارش تعداد سرویس',
        is_title: false,
        href: '/CountOfServicesOfDrivers',
        icon: <BiShapePolygon />,
        isPermitted: hasPermitGroup([PERMIT_REPORTS]),
      },
      {
        key: 'menu.reports',
        label: 'گزارش استراحت بین سرویس ها',
        is_title: false,
        href: '/RestOfDriverBetweenServises',
        icon: <BiShapePolygon />,
        isPermitted: hasPermitGroup([PERMIT_REPORTS]),
      },
      {
        key: 'menu.reports',
        label: 'گزارش لیست اولویت بندی شده',
        is_title: false,
        href: '/DriverList_By_LastServiceAdnDistanse',
        icon: <BiShapePolygon />,
        isPermitted: hasPermitGroup([PERMIT_REPORTS]),
      },
      {
        key: 'menu.reports',
        label: 'نظرات',
        is_title: false,
        href: '/Comments',
        icon: <BiShapePolygon />,
        isPermitted: hasPermitGroup([PERMIT_RESTRICTION]),
      },
      {
        key: 'menu.passenger',
        label: 'منو مسافر',
        is_title: true,
        isPermitted: hasPermitGroup([PERMIT_PASSENGER_SERVICE]),
      },
      {
        key: 'menu.passenger.newtrip',
        label: 'سفر جدید',
        is_title: false,
        href: '/passenger/new',
        icon: <BsFillCarFrontFill />,
        isPermitted: hasPermitGroup([PERMIT_PASSENGER_SERVICE]),
      },
      {
        key: 'menu.passenger.current',
        label: 'سفر من',
        is_title: false,
        href: '/passenger/active',
        icon: <BsFillCarFrontFill />,
        isPermitted: hasPermitGroup([PERMIT_PASSENGER_SERVICE]),
      },
      {
        key: 'menu.passenger.history',
        label: 'درخواست ها',
        is_title: false,
        href: '/passenger/history',
        icon: <BsFillCarFrontFill />,
        isPermitted: hasPermitGroup([PERMIT_PASSENGER_SERVICE]),
      },
      {
        key: 'menu.passenger.favoriteLocation',
        label: 'مکان های منتخب',
        is_title: false,
        href: '/passenger/favoriteLocation',
        icon: <BsFillCarFrontFill />,
        isPermitted: hasPermitGroup([PERMIT_PASSENGER_SERVICE]),
      },
      // {
      //     key: "menu.passenger.newtrip",
      //     label: "مکان های منتخب",
      //     is_title: false,
      //     href: "/passenger/locations",
      //     icon: <BsFillCarFrontFill />,
      // },
      {
        key: 'menu.driver',
        label: 'منو راننده',
        is_title: true,
        isPermitted: hasPermitGroup([PERMIT_DRIVER]),
      },
      {
        key: 'menu.driver.current',
        label: 'سفر من',
        is_title: false,
        href: '/driver/active',
        icon: <BsFillCarFrontFill />,
        isPermitted: hasPermitGroup([PERMIT_DRIVER]),
      },
      {
        key: 'menu.driver.history',
        label: 'سفر ها',
        is_title: false,
        href: '/driver/history',
        icon: <BsFillCarFrontFill />,
        isPermitted: hasPermitGroup([PERMIT_DRIVER]),
      },
    ];
    setNavigationMenu(
      allNavItems.filter((item) => {
        return item.isPermitted;
      })
    );
  }, [permits]);

  return navigatioMenu;
}
