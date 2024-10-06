import { useEffect, useState } from 'react';
import { BiShapePolygon, BiUser } from 'react-icons/bi';
import { BsFillCarFrontFill } from 'react-icons/bs';
import { MdAssignmentInd } from 'react-icons/md';
import useCurrentUserPermissions from './useCurrentUserPermissions';
import * as PERMIT_CONST from '../lib/constants';

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
        key: 'menu.dashboard',
        label: 'داشبورد',
        is_title: false,
        href: '/dashboard',
        icon: <i className="fa fa-tachometer-alt"></i>,
        isPermitted: hasPermitGroup([PERMIT_CONST.PERMIT_DASHBOARD]),
      },
      {
        key: 'menu.dashboard',
        label: '',
        is_title: false,
        href: '/profile',
        icon: '',
        isPermitted: true,
      },
      {
        key: 'menu.services',
        label: 'سرویس ها',
        is_title: false,
        href: '/trip-mission',
        icon: <i className="fa fa-solid fa-ticket"></i>,
        isPermitted: hasPermitGroup([PERMIT_CONST.PERMIT_SERVICE]),
      },
      {
        key: 'menu.users',
        label: 'کاربران',
        is_title: false,
        href: '/user/',
        icon: <BiUser />,
        isPermitted: hasPermitGroup([
          PERMIT_CONST.PERMIT_USERS_CREATE,
          PERMIT_CONST.PERMIT_USERS_EDIT,
          PERMIT_CONST.PERMIT_USERS_DELETE,
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
        icon: <i className="fa fa-map"></i>,
        isPermitted: hasPermitGroup([PERMIT_CONST.PERMIT_AREAS_CREATE]),
      },
      {
        key: 'menu.restriction',
        label: 'محدودیت ها',
        is_title: false,
        href: '/restriction',
        icon: <i className="fa-solid fa-sliders"></i>
        ,
        isPermitted: hasPermitGroup([PERMIT_CONST.PERMIT_RESTRICTION]),
      },
      {
        key: 'menu.reports',
        label: 'گزارش ها',
        is_title: false,
        href: '/reports',
        icon: <i className="fa-solid fa-chart-bar"></i>,
        isPermitted: hasPermitGroup([PERMIT_CONST.PERMIT_REPORTS]),
      },
      {
        key: 'menu.definitions',
        label: 'تعاریف',
        is_title: false,
        href: '/definitions',
        icon: <i className="fa-solid fa-pen-to-square"></i>,
        isPermitted: hasPermitGroup([PERMIT_CONST.PERMIT_DEFINITIONS]),
      },
      {
        key: 'menu.vehicles',
        label: 'خودرو ها',
        is_title: false,
        href: '/vehicles',
        icon: <i className="fa-solid fa-car"></i>,
        isPermitted: import.meta.env.VITE_CUSTOMER_NAME === 'zarghan' ? false : hasPermitGroup([
          PERMIT_CONST.PERMIT_VEHICLES_CREATE,
          PERMIT_CONST.PERMIT_USERS_DELETE,
          PERMIT_CONST.PERMIT_USERS_EDIT,
        ]),
      },
      {
        key: 'menu.deligations',
        label: 'تفویض اختیارات',
        is_title: false,
        href: '/deligations',
        icon: <i className="fa fa-code-fork"></i>,
        isPermitted: hasPermitFor([PERMIT_CONST.PERMIT_DELEGATION]),
      },
      // {
      //   key: 'menu.reports',
      //   label: 'گزارشات',
      //   is_title: false,
      //   href: '/reports',
      //   icon: <BiShapePolygon />,
      //   isPermitted: hasPermitGroup([PERMIT_CONST.PERMIT_REPORTS]),
      // },
      // {
      //   key: 'menu.reports',
      //   label: 'گزارش زمان سرویس',
      //   is_title: false,
      //   href: '/TimeOfServices',
      //   icon: <BiShapePolygon />,
      //   isPermitted: hasPermitGroup([PERMIT_CONST.PERMIT_REPORTS]),
      // },
      // {
      //   key: 'menu.reports',
      //   label: 'گزارش تعداد سرویس',
      //   is_title: false,
      //   href: '/CountOfServicesOfDrivers',
      //   icon: <BiShapePolygon />,
      //   isPermitted: hasPermitGroup([PERMIT_CONST.PERMIT_REPORTS]),
      // },
      // {
      //   key: 'menu.reports',
      //   label: 'گزارش استراحت بین سرویس ها',
      //   is_title: false,
      //   href: '/RestOfDriverBetweenServises',
      //   icon: <BiShapePolygon />,
      //   isPermitted: hasPermitGroup([PERMIT_CONST.PERMIT_REPORTS]),
      // },
      // {
      //   key: 'menu.reports',
      //   label: 'گزارش لیست اولویت بندی شده',
      //   is_title: false,
      //   href: '/DriverList_By_LastServiceAdnDistanse',
      //   icon: <BiShapePolygon />,
      //   isPermitted: hasPermitGroup([PERMIT_CONST.PERMIT_REPORTS]),
      // },
      // {
      //   key: 'menu.reports',
      //   label: 'نظرات',
      //   is_title: false,
      //   href: '/Comments',
      //   icon: <BiShapePolygon />,
      //   isPermitted: hasPermitGroup([PERMIT_CONST.PERMIT_RESTRICTION]),
      // },
      {
        key: 'menu.aganceRegister',
        label: '  ثبت آژانس',
        is_title: false,
        href: '/aganceRegister',
        icon: <i className="fa-solid fa-taxi"></i>,
        isPermitted: hasPermitGroup([PERMIT_CONST.PERMIT_AGANCE_AGANCE_LIST]),
      },
      {
        key: 'menu.aganceSodureParvane',
        label: 'صدور و تمدید پروانه آژانس',
        is_title: false,
        href: '/aganceSodureParvane',
        icon: <i className="fa fa-id-card"></i>,
        isPermitted: hasPermitGroup([PERMIT_CONST.PERMIT_AGANCE_SODURE_PARVANE_LIST]),
      },
      {
        key: 'menu.aganceDriver',
        label: ' ثبت راننده',
        is_title: false,
        href: '/aganceDriver',
        icon: <i className="fa fa-id-card"></i>,
        isPermitted: hasPermitGroup([PERMIT_CONST.PERMIT_AGANCE_DRIVER_LIST]),
      },
      {
        key: 'menu.aganceCarteSalahiyat',
        label: ' صدور کارت صلاحیت',
        is_title: false,
        href: '/aganceCarteSalahiyat',
        icon: <i className="fa fa-id-card"></i>,
        isPermitted: hasPermitGroup([PERMIT_CONST.PERMIT_AGANCE_CART_SALAHIYAT_LIST]),
      },
      {
        key: 'menu.aganceEstelameSeGane',
        label: ' استعلام های سه گانه',
        is_title: false,
        href: '/aganceEstelameSeGane',
        icon: <i className="fas fa-qrcode"></i>,
        isPermitted: hasPermitGroup([PERMIT_CONST.PERMIT_AGANCE_ESTELAMHAYE_SE_GANE_LIST]),
      },
      {
        key: 'menu.aganceAmaken',
        label: ' استعلام اداره اماکن',
        is_title: false,
        href: '/aganceAmaken',
        icon: <i className="fas fa-qrcode"></i>,
        isPermitted: hasPermitGroup([PERMIT_CONST.PERMIT_AGANCE_ESTELAM_AMAKEN_LIST]),
      },
      {
        key: 'menu.aganceAvarez',
        label: ' تعرفه عوارض',
        is_title: false,
        href: '/aganceAvarez',
        icon: <i className="fa-solid fa-money-bill-1"></i>,
        isPermitted: hasPermitGroup([PERMIT_CONST.PERMIT_AGANCE_TAREFE_AVAREZ_LIST]),
      },
      {
        key: 'menu.aganceMoayeneFani',
        label: ' معاینه فنی',
        is_title: false,
        href: '/aganceMoayeneFani',
        icon: <i className="fa fa-institution"></i>,
        isPermitted: hasPermitGroup([PERMIT_CONST.PERMIT_AGANCE_MOAYENE_FANI_LIST]),
      },
      {
        key: 'menu.aganceProfile',
        label: 'دبیرخانه',
        is_title: false,
        href: '/aganceProfile',
        icon: <i className="fas fa-user-circle"></i>,
        isPermitted: hasPermitGroup([PERMIT_CONST.PERMIT_AGANCE_PROFILE_LIST]),
      },
      // {
      //   key: 'menu.aganceDabirkhane',
      //   label: ' دبیرخانه',
      //   is_title: false,
      //   href: '/aganceDabirkhane',
      //   icon: <i className="far fa-envelope-open"></i>,
      //   isPermitted: hasPermitGroup([PERMIT_CONST.PERMIT_AGANCE_DABIRKHANE_LIST]),
      // },



      {
        key: 'menu.passenger',
        label: 'منو مسافر',
        is_title: true,
        isPermitted: hasPermitGroup([PERMIT_CONST.PERMIT_PASSENGER_SERVICE]),
      },
      {
        key: 'menu.passenger.newtrip',
        label: 'سفر جدید',
        is_title: false,
        href: '/passenger/new',
        icon: <i className="fa fa-plus-square"></i>,
        isPermitted: hasPermitGroup([PERMIT_CONST.PERMIT_PASSENGER_SERVICE]),
      },
      {
        key: 'menu.passenger.current',
        label: 'سفر من',
        is_title: false,
        href: '/passenger/active',
        icon: <BsFillCarFrontFill />,
        isPermitted: hasPermitGroup([PERMIT_CONST.PERMIT_PASSENGER_SERVICE]),
      },
      {
        key: 'menu.passenger.history',
        label: 'درخواست ها',
        is_title: false,
        href: '/passenger/history',
        icon: <i className="fa fa-history"></i>,
        isPermitted: hasPermitGroup([PERMIT_CONST.PERMIT_PASSENGER_SERVICE]),
      },
      {
        key: 'menu.passenger.favoriteLocation',
        label: 'مکان های منتخب',
        is_title: false,
        href: '/passenger/favoriteLocation',
        icon: <i className="fa fa-map-pin"></i>,
        isPermitted: hasPermitGroup([PERMIT_CONST.PERMIT_PASSENGER_SERVICE]),
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
        isPermitted: hasPermitGroup([PERMIT_CONST.PERMIT_DRIVER]),
      },
      {
        key: 'menu.driver.current',
        label: 'سفر من',
        is_title: false,
        href: '/driver/active',
        icon: <BsFillCarFrontFill />,
        isPermitted: hasPermitGroup([PERMIT_CONST.PERMIT_DRIVER]),
      },
      {
        key: 'menu.driver.history',
        label: 'سفر ها',
        is_title: false,
        href: '/driver/history',
        icon: <i className="fa fa-calendar"></i>,
        isPermitted: hasPermitGroup([PERMIT_CONST.PERMIT_DRIVER]),
      },
    ];
    setNavigationMenu(
      allNavItems.filter((item) => {
        return item.isPermitted
      })
    );
  }, [permits]);

  return navigatioMenu;
}
