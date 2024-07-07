import { lazy } from 'react';

const Calendar = lazy(() => import('../pages/Calendar'));
const Chart = lazy(() => import('../pages/Chart'));
const FormElements = lazy(() => import('../pages/Form/FormElements'));
const FormLayout = lazy(() => import('../pages/Form/FormLayout'));
const Profile = lazy(() => import('../pages/Profile'));
const Settings = lazy(() => import('../pages/Settings'));
const Tables = lazy(() => import('../pages/Tables'));
const Alerts = lazy(() => import('../pages/UiElements/Alerts'));
const Buttons = lazy(() => import('../pages/UiElements/Buttons'));
const TripMission = lazy(() => import('../pages/TripMission/TripMission'));
const dashboard = lazy(() => import('../pages/Dashboard/Dashboard'));

const PassengerNewServiceRequest = lazy(
  () => import('../pages/Passenger/PassengerServiceRequest/PassengerServiceRequest')
);
const PassengerMissionDetails = lazy(
  () => import('../pages/Passenger/PassengerMissionDetails/PassengerMissionDetails')
);
const DriverCurrentMissionService = lazy(
  () => import('../pages/Driver/DriverCurrentMissionService/DriverCurrentMissionService')
);
const RoleActions = lazy(() => import('../pages/Users/RoleActions/RoleActions'));
const UsersManager = lazy(() => import('../pages/Users/UsersManager/UsersManager'));
const AreaManager = lazy(() => import('../pages/Areas/AreaManager'));
const  Restriction= lazy(() => import('../pages/Restrictions/Restrictions/Restrictions'));
const DefinitionsManager = lazy(
  () => import('../pages/definitions/DefinitionsManager')
);
const VehicleManager = lazy(() => import('../pages/Vehicles/VehicleManager'));
const DriverMissionHistory = lazy(() => import('../pages/Driver/DriverMissionHistory/DriverMissionHistory'));
const PassengerRequestHistory = lazy(
  () => import('../pages/Passenger/PassengerRequestHistory/PassengerRequestHistory')
);
const PassengerFavoriteLocation = lazy(
  () => import('../pages/Passenger/PassengerFavoriteLocation/PassengerFavoriteLocation')
);


const Reports = lazy(() => import('../pages/Reports/Reports'));
const TimeOfServices = lazy(() => import('../pages/Reports/TimeOfServices/TimeOfServices'));
const CountOfServicesOfDrivers = lazy(() => import('../pages/Reports/CountOfServicesOfDrivers/CountOfServicesOfDrivers'));
const DriverList_By_LastServiceAdnDistanse = lazy(() => import('../pages/Reports/DriverList_By_LastServiceAdnDistanse/DriverList_By_LastServiceAdnDistanse'));
const RestOfDriverBetweenServises = lazy(() => import('../pages/Reports/RestOfDriverBetweenServises/RestOfDriverBetweenServises'));

const InActiveSystem = lazy(() => import('../pages/Restrictions/InActiveSystem/InActiveSystem'));
const RestrictionShowRequests = lazy(() => import('../pages/Restrictions/RestrictionShowRequests/RestrictionShowRequests'));
const SetWorkingWeek = lazy(() => import('../pages/Restrictions/SetWorkingWeek/SetWorkingWeek'));
const Comments = lazy(() => import('../pages/Comments/Comments'));

const DeligationManager = lazy(
  () => import('../pages/Deligation/DeligationManager')
);

const coreRoutes = [
  {
    path: '/deligations',
    title: 'deligations',
    component: DeligationManager,
  },
  {
    path: '/definitions',
    title: 'definitions',
    component: DefinitionsManager,
  },
  {
    path: '/user',
    title: 'Users',
    component: UsersManager,
  },
  {
    path: '/dashboard',
    title: 'dashboard',
    component: dashboard,
  },
  {
    path: '/trip-mission',
    title: 'TripMission',
    component: TripMission,
  },
  {
    path: '/passenger/new',
    title: 'Passenger',
    component: PassengerNewServiceRequest,
  },
  {
    path: '/passenger/active',
    title: 'Passenger',
    component: PassengerMissionDetails,
  },
  {
    path: '/driver/active',
    title: 'Driver',
    component: DriverCurrentMissionService,
  },
  {
    path: '/user/role-actions',
    title: 'Roles and Actions',
    component: RoleActions,
  },
  {
    path: '/calendar',
    title: 'Calender',
    component: Calendar,
  },
  {
    path: '/profile',
    title: 'Profile',
    component: Profile,
  },
  {
    path: '/forms/form-elements',
    title: 'Forms Elements',
    component: FormElements,
  },
  {
    path: '/forms/form-layout',
    title: 'Form Layouts',
    component: FormLayout,
  },
  {
    path: '/tables',
    title: 'Tables',
    component: Tables,
  },
  {
    path: '/settings',
    title: 'Settings',
    component: Settings,
  },
  {
    path: '/chart',
    title: 'Chart',
    component: Chart,
  },
  {
    path: '/ui/alerts',
    title: 'Alerts',
    component: Alerts,
  },
  {
    path: '/ui/buttons',
    title: 'Buttons',
    component: Buttons,
  },
  {
    path: '/areas',
    title: 'Areas',
    component: AreaManager,
  },
  {
    path: '/restriction',
    title: 'Restriction',
    component: Restriction,
  },
  {
    path: '/vehicles',
    title: 'Vehicles',
    component: VehicleManager,
  },
  {
    path: '/driver/history',
    title: 'Driver Mission history',
    component: DriverMissionHistory,
  },
  {
    path: '/passenger/history',
    title: 'Passenger Request history',
    component: PassengerRequestHistory,
  },
  {
    path: '/passenger/favoriteLocation',
    title: 'Passenger favorite Location',
    component: PassengerFavoriteLocation,
  },
  {
    path: '/reports',
    title: 'Reports',
    component: Reports,
  },
  {
    path: '/TimeOfServices',
    title: 'Reports Time Of Services',
    component: TimeOfServices,
  },
  {
    path: '/CountOfServicesOfDrivers',
    title: 'Reports Count Of Services',
    component: CountOfServicesOfDrivers,
  },
  {
    path: '/RestOfDriverBetweenServises',
    title: 'Reports Rest Of Driver Between Servises',
    component: RestOfDriverBetweenServises,
  },
  {
    path: '/DriverList_By_LastServiceAdnDistanse',
    title: 'DriverList By LastService Adn Distanse',
    component: DriverList_By_LastServiceAdnDistanse,
  },
  {
    path: '/InActiveSystem',
    title: 'InActiveSystem',
    component: InActiveSystem,
  },
  {
    path: '/RestrictionShowRequests',
    title: 'RestrictionShowRequests',
    component: RestrictionShowRequests,
  },
  {
    path: '/SetWorkingWeek',
    title: 'SetWorkingWeek',
    component: SetWorkingWeek,
  },
  {
    path: '/Comments',
    title: 'Comments',
    component: Comments,
  },
  
];

const routes = [...coreRoutes];
export default routes;
