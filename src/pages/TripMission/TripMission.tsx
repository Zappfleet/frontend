import { useEffect, useLayoutEffect, useState } from 'react';
import Breadcrumb from '../../components/Breadcrumb';
import TabLayout from '../../layout/TabLayout';
import {
  ACCESS_MISSION_HISTORY,
  ACCESS_REQUEST_ADMIN,
  ACCESS_REQUEST_DISPATCH,
  ACCESS_REQUEST_HISTORY,
} from '../../lib/accessKeys';
import RequestManagment from './components/RequestManagment';
import MissionHistory from '../../widgets/MissionHistory';
import { MODE_AREAL } from '../../lib/constants';
import RequestHistory from '../../widgets/RequestHistory';
import SimpleButton from '../../components/SimpleButton';
import { BiPlusCircle } from 'react-icons/bi';
import useCreateTripModal from '../../hooks/custom/useCreateTripModal';
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

  const { hasPermitGroup, hasPermitFor, hasAdminRank, permits, authInfo } =
    useCurrentUserPermissions();

  const [loading, setLoading] = useState<boolean>(false)
  const [permission_SUBMIT, setPermission_SUBMIT] = useState<boolean>(false)
  const [permission_EDIT, setPermission_EDIT] = useState<boolean>(false)

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
        <div className="relative flex h-full flex-col">
          <Breadcrumb pageName="مدیریت سفر ها" />
          <div className="mb-4">
            {permission_SUBMIT === true &&
              <SimpleButton
                onClick={show_createNewTripModal}
              >
                {'ایجاد سفر'} <BiPlusCircle />
              </SimpleButton>
            }
            {permission_SUBMIT === false &&
              <SimpleButton disabled={true}
                className={"NoPermission"}
              >
                {'ایجاد سفر'} <BiPlusCircle />
              </SimpleButton>
            }
          </div>

          <TabLayout
            tabs={TabLayoutItems}
            defaultActiveTab={activeTab}
            onTabChange={setActiveTab}
          />
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
        </div >
      }
    </>
  );
}

export default TripMission;
