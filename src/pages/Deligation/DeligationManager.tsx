import { useEffect, useState } from 'react';
import './style.scss';
// import TransferList from '../../components/TransferList';

import useAuthentication from '../../hooks/data/useAuthentication';
import UsersSuggestionInput from '../../widgets/UsersSuggestionInput/UsersSuggestionInput';
// import renderUi from '../../lib/renderUi';
import SimpleButton from '../../components/SimpleButton';
import useDeligation from '../../hooks/data/useDeligation';
import { NotificationController } from '../../lib/notificationController';

import useCurrentUserPermissions from '../../hooks/useCurrentUserPermissions';
import {
  PERMIT_DELEGATION
} from '../../lib/constants'


function translate(key: string) {
  switch (key) {
    case 'SERVICE_MANAGMENT':
      return 'مدیریت سرویس ها';
    case 'REQUEST_APPROVAL':
      return 'رد و تایید درخواست ها';
    case 'LOCATION_MANAGMENT':
      return 'مدیریت مکان های منتخب';
    case 'VEHICLE_MANAGMENT':
      return 'خودرو و آژانس';
    case 'USERS_MANAGEMENT':
      return 'مدیریت کاربران';
    case 'AREAS_MANAGEMENT':
      return 'مدیریت محدوده ها';
  }
}

const AllPermissionGroups: any = {
  SERVICE_MANAGMENT: [
    'SERVICE.ORG.DIRECT_SUBMIT',
    'SERVICE.ORG.DIRECT_EDIT',
    'SERVICE.ORG.DIRECT_CANCEL',
    'SERVICE.ORG.DISPATCH',
    'SERVICE.ORG.GET.AGENCY_FULL',
    'SERVICE.ORG.GET.AGENCY_LIMITED',
  ],
  REQUEST_APPROVAL: [
    'SERVICE.ORG.REQUEST_APPROVAL',
    'SERVICE.ORG.GET.AREA_FULL',
    'SERVICE.ORG.GET.AREA_LIMITED',
  ],

  LOCATION_MANAGMENT: [
    'LOCATION.ORG.SUBMIT',
    'LOCATION.ORG.EDIT',
    'LOCATION.ORG.CANCEL',
    'LOCATION.ORG.LIST',
  ],
  VEHICLE_MANAGMENT: [
    'VEHICLES.CREATE',
    'VEHICLES.DELETE',
    'VEHICLES.EDIT',
    'VEHICLES.LIST',
  ],
  USERS_MANAGEMENT: [
    'USERS.CREATE',
    'USERS.DELETE',
    'USERS.EDIT',
    'USERS.LIST',
  ],
  AREAS_MANAGEMENT: [
    'AREAS.CREATE',
    'AREAS.DELETE',
    'AREAS.EDIT',
    'AREAS.LIST',
  ],
};

function DeligationManager() {

  const { hasPermitGroup, hasPermitFor, hasAdminRank, permits } =
    useCurrentUserPermissions();

  const [loading, setLoading] = useState<boolean>(false)
  const [permission_DELEGATION, setPermission_DELEGATION] = useState<boolean>(false)


  useEffect(() => {
    setPermission_DELEGATION(hasPermitFor([PERMIT_DELEGATION]))
    // setLoading(true)
  }, [hasPermitFor])

  const { authInfo } = useAuthentication();

  const userPermissions = authInfo?.auth?.roles
    ?.map(({ permissions }: any) => permissions)
    ?.flat();

  const [state, setState] = useState<any>({
    selectedUsers: [],
    source: [],
    dest: [],
  });

  const { deligations: userDeligations, submitDeligationOn } = useDeligation({
    user_id: state?.selectedUsers?.[0]?._id,
  });

  useEffect(() => {
    if (userDeligations == null || userPermissions == null) return;
    const dest = detectPermitGroups(userDeligations.permissions);

    const not_deligated_permissions = userPermissions.filter((item: string) => {
      return !userDeligations.permissions.includes(item);
    });
    const source = detectPermitGroups(not_deligated_permissions);
    setState({ ...state, source, dest });
  }, [userDeligations]);

  function handle_tranfer(value: any, from: string, to: string) {
    const stateClone = { ...state };
    stateClone[from] = stateClone[from].filter((item: any) => {
      return item.key != value.key;
    });
    stateClone[to].push(value);
    setState(stateClone);
  }

  function handle_setSelectedUsers(value: any) {
    setState({
      ...state,
      selectedUsers: value?.length > 0 ? [value[1] || value[0]] : [],
    });
  }

  async function handle_submitDeligations() {
    const deligatedPermitions = state.dest
      .map(({ value }: any) => value)
      .flat();
    const revokePermissions = state.source
      .map(({ value }: any) => value)
      .flat();
    submitDeligationOn(
      state.selectedUsers[0]._id,
      deligatedPermitions,
      revokePermissions
    ).then(() => {
      NotificationController.showSuccess('تفویض اختیار انجام شد');
    });
  }



  return (
    <div className='DeligationManager-component'>
      <div className="row">
        <div className="col-12">
          <div className="search-user-div">
            <h1 className="mx-2 mt-6">
              {'جهت تفویض اختیارات خود به همکاران نام یا کد پرسنلی را جستجو کنید'}
            </h1>
            <UsersSuggestionInput
              smallChips={true}
              externalState={[state.selectedUsers, handle_setSelectedUsers]}
              showListOnTop={false}
              permissions={[]}
              search_all={true}
            />
          </div>
        </div>
      </div>
      {state?.selectedUsers?.length > 0 && userDeligations != null &&
        <>
          <div className="row">
            <div className="col-6">
              <div>
                <div className='box'>
                 <div className='title'>{'مجوز های من'}</div> 

                  {state.source.map((item: any) => {
                    return (
                      <div className='item-div' onClick={() => handle_tranfer(item, 'source', 'dest')}>
                        {item.label}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="col-6">
              <div>
                <div className='box'>
                 <div className='title'>{'تفویض شده'}</div> 

                  {state.dest.map((item: any) => {
                    return (
                      <div className='item-div' onClick={() => handle_tranfer(item, 'dest', 'source')} >
                        {item.label}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-12">
              <div className="btn-div">
                {permission_DELEGATION === true &&
                  <SimpleButton onClick={handle_submitDeligations}>
                    {'اعمال تفویض اختیار'}
                  </SimpleButton>
                }
                {permission_DELEGATION === false &&
                  <SimpleButton disabled={true} className={'NoPermission'}>
                    {'اعمال تفویض اختیار'}
                  </SimpleButton>
                }
              </div>
            </div>
          </div>
        </>
      }
      {/* {renderUi(
        <div>
          <TransferList
            options={{
              titleSource: 'مجوز های من',
              titleDest: 'تفویض شده',
            }}
            dest={state.dest}
            onTransfer={handle_tranfer}
            source={state.source}
          />
          {permission_DELEGATION === true &&
            <SimpleButton onClick={handle_submitDeligations} className={'mx-4'}>
              {'اعمال تفویض اختیار'}
            </SimpleButton>
          }
          {permission_DELEGATION === false &&
            <SimpleButton disabled={true} className={'NoPermission mx-4'}>
              {'اعمال تفویض اختیار'}
            </SimpleButton>
          }
        </div>
      ).if(state?.selectedUsers?.length > 0 && userDeligations != null)} */}
    </div>
  );
}

function detectPermitGroups(userPermissions: any) {
  const validGroups: any = {};
  for (let i = 0; i < userPermissions.length; i++) {
    const permit = userPermissions[i];

    Object.entries(AllPermissionGroups).map(([key], index) => {
      if (AllPermissionGroups[key].includes(permit)) {
        if (validGroups[key] == null) validGroups[key] = [];
        validGroups[key].push(permit);
      }
    });
  }

  return Object.entries(validGroups).map(([key, value]) => {
    return {
      key,
      value,
      label: translate(key),
    };
  });
}

export default DeligationManager;
