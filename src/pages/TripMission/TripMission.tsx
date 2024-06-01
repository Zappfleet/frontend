import { useEffect, useLayoutEffect, useState } from 'react';
import Breadcrumb from '../../components/Breadcrumb/Breadcrumb';
import TabLayout from '../../layout/TabLayout/TabLayout';
import './style.scss'
import {
  ACCESS_MISSION_HISTORY,
  ACCESS_REQUEST_ADMIN,
  ACCESS_REQUEST_DISPATCH,
  ACCESS_REQUEST_HISTORY,
} from '../../lib/accessKeys';
import RequestManagment from './components/RequestManagment/RequestManagment';
import MissionHistory from '../../widgets/MissionHistory';
import { MODE_AREAL } from '../../lib/constants';
import RequestHistory from '../../widgets/RequestHistory/RequestHistory';
import SimpleButton from '../../components/SimpleButton';
import { BiPlusCircle } from 'react-icons/bi';
import useCreateTripModal from '../../hooks/custom/useCreateTripModal/useCreateTripModal';
import { disable } from 'ol/rotationconstraint';

import useCurrentUserPermissions from '../../hooks/useCurrentUserPermissions';
import {
  PERMIT_SERVICE_PERSONAL_SUBMIT,
  PERMIT_SERVICE_ORG_DIRECT_SUBMIT,
  PERMIT_SERVICE_PERSONAL_EDIT,
  PERMIT_SERVICE_ORG_DIRECT_EDIT
} from '../../lib/constants'

const TabLayoutItems = [
  {
    key: ACCESS_REQUEST_ADMIN,
    label: 'مدیریت درخواست ها',
  },
  {
    key: ACCESS_REQUEST_HISTORY,
    label: 'تاریخچه درخواست ها',
  },
  {
    key: ACCESS_MISSION_HISTORY,
    label: 'تاریخچه سرویس ها',
  },
];


function TripMission() {
  const [activeTab, setActiveTab] = useState(TabLayoutItems[0].key);
  const createTripModal = useCreateTripModal();

  const { hasPermitGroup, hasPermitFor, hasAdminRank, permits, authInfo, type } =
    useCurrentUserPermissions();

  const [loading, setLoading] = useState<boolean>(false)
  const [permission_SUBMIT, setPermission_SUBMIT] = useState<boolean>(false)
  const [permission_EDIT, setPermission_EDIT] = useState<boolean>(false)

  useEffect(() => {
    console.log(111, type, permission_SUBMIT);
  }, [permission_SUBMIT])

  useEffect(() => {
    setPermission_SUBMIT(hasPermitFor([PERMIT_SERVICE_ORG_DIRECT_SUBMIT, PERMIT_SERVICE_PERSONAL_SUBMIT]))
    setPermission_EDIT(hasPermitFor([PERMIT_SERVICE_ORG_DIRECT_EDIT, PERMIT_SERVICE_PERSONAL_EDIT]))

    setLoading(true)


  }, [hasPermitFor])

  useEffect(() => {

  }, [loading])

  const show_createNewTripModal = () => {
    createTripModal.showFullScreenModal({ data: {} });
  };

  return (
    <>
      {loading === false && <p>در حال لود شدن ....</p>}
      {loading === true &&
        <div className="tripmission-component">
          <div className="row">
            <div className="col-12">
              <Breadcrumb pageName="مدیریت سفر ها" />
            </div>
          </div>
          <div className="row">
            <div className="col-12">
              <div className="NoPermission-div ">
                {permission_SUBMIT === true &&
                  <button className='my-btn flex-center' onClick={show_createNewTripModal}>
                    <span>{'ایجاد سفر'}</span>
                    <i className='fa fa-plus plus flex-center'></i>
                  </button>
                }
                {permission_SUBMIT === false &&
                  <>
                    <button disabled={true} className='my-btn NoPermission' onClick={show_createNewTripModal}>
                      <span>{'ایجاد سفر'}</span>
                      <i className='fa fa-warning info-icon'></i>
                      <div className='info-message alert alert-warning'>
                        {type === 'SystemInActive' ? 'سیستم غیر فعال است' :
                          type === 'No_WorkingWeek' ? 'امروز روز کاری نیست' : ''
                        }
                      </div>
                    </button>
                  </>
                }
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-12">
              <TabLayout
                tabs={TabLayoutItems}
                defaultActiveTab={activeTab}
                onTabChange={setActiveTab}
              />
            </div>
          </div>

          <div className="row">
            <div className="col-12">
              {
                (function () {
                  switch (activeTab) {
                    case ACCESS_REQUEST_ADMIN:
                      return <RequestManagment />;
                    case ACCESS_REQUEST_DISPATCH:
                      return '2';
                    case ACCESS_REQUEST_HISTORY:
                      return <RequestHistory mode={MODE_AREAL} />;
                    case ACCESS_MISSION_HISTORY:
                      return <MissionHistory mode={MODE_AREAL} />;
                  }
                })()
              }
              {createTripModal.FullScreenModalUi}
            </div>
          </div>

        </div >
      }
    </>
  );
}

export default TripMission;
