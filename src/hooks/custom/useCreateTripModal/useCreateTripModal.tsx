
import './style.scss'
import PassengerServiceRequest, {
  MODE_ADMIN_ONLY,
  buildRequestBody,
} from '../../../pages/Passenger/PassengerServiceRequest/PassengerServiceRequest';
import useFullScreenModal from '../../useFullScreenModal';
import { MdMenu } from 'react-icons/md';
import { useEffect, useState } from 'react';
import SimpleButton from '../../../components/SimpleButton';
import { BiPlus, BiPlusCircle } from 'react-icons/bi';
import UsersSuggestionInput, {
  UserSelectionRender,
} from '../../../widgets/UsersSuggestionInput/UsersSuggestionInput';
import useContentModal from '../../useContentModal';
import ModularForm from '../../../widgets/ModularForm';
import useAuthentication from '../../data/useAuthentication';
import { getApiClient } from '../../../apis/client';
import { NotificationController } from '../../../lib/notificationController';
import { VehicleItem } from '../../../pages/TripMission/components/VehicleItem/VehicleItem';
import useVehicleBasicData from '../../data/useVehicleBasicData';
import VehicleItemEmpty from '../../../pages/TripMission/components/VehicleItemEmpty';
import { RiPageSeparator, RiSeparator } from 'react-icons/ri';
import TitledSparator from '../../../components/TitledSparator';
import TransportFleet from '../../../pages/TripMission/components/TransportFleet/TransportFleet';
import useFleet from '../../data/useFleet';
import renderUi from '../../../lib/renderUi';
import useCurrentUserPermissions from '../../useCurrentUserPermissions';

import {
  PERMIT_SERVICE_ORG_DIRECT_SUBMIT,
} from '../../../lib/constants'


export default function useCreateTripModal() {

  //sgh IsDispature
  const [IsDispature, setIsDispature] = useState<boolean>(false)
  const { hasPermitFor } = useCurrentUserPermissions();

  useEffect(() => {
    // console.log(300,hasPermitFor);

    setIsDispature(hasPermitFor([PERMIT_SERVICE_ORG_DIRECT_SUBMIT]))
  }, [hasPermitFor])

  useEffect(() => {
    //console.log(12, IsDispature);

  }, [IsDispature])

  const [state, setSate] = useState<any>({
    activeUser: null,
  });
  const { authInfo } = useAuthentication();
  const [finalState, setFinalState] = useState<any>({});
  const [requestListState, setRequestListState] = useState<any>({});
  const [requestsListUserInput, setRequestListUserInput] = useState<any>({});
  const [selectedVehicle, setSelectedVehicle] = useState<any>(null);
  const [selectedUsersState, setSelectedUsersState] = useState<any>([]);

  const fleetData: any = useFleet();
  const { data: vehicleBasicData }: any = useVehicleBasicData();

  const handle_onFinalInputChanged = (e: any) => {
    setFinalState({ ...finalState, [e.target.name]: e.target.value });
    console.log(51, finalState);

  };

  const clearStates = () => {
    setFinalState({});
    setRequestListState({});
    setRequestListUserInput({});
    setSelectedVehicle(null);
    setSelectedUsersState([]);
    setSate({ ...state, activeUser: null });
  };

  const handle_submitTrip = () => {
    console.log(3000, selectedUsersState);

    const requestBodies = selectedUsersState.map((user: any, index: number) => {
      const body = buildRequestBody(finalState,
        //requestListState[selectedUsersState[index]._id],
        requestsListUserInput[selectedUsersState[index]._id], '', ''
      );
      body.submitted_for = user;
      return body;
    });

    console.log(441, requestBodies);


    const fullBody = {
      extra: { ...finalState },
      data: requestBodies,
      vehicle_id: selectedVehicle?._id,
    };

    console.log(71, fullBody);

    getApiClient()
      .submitFullMission(fullBody)
      .then(({ data }) => {
        console.log(8);

        NotificationController.showSuccess('سرویس با موفقیت ثبت شد');
        clearStates();
        hideFinalModal();
        closeFullScreenModal();
      })
      .catch((e) => {
        console.log(7);

        NotificationController.showError(e.message);
      });
  };

  const handle_onVehicleClick = (vehicle: any) => {
    setSelectedVehicle(vehicle);
    hideVehicleSelectionModal();
    showFinalModal({});
  };

  const {
    ui: FleetModalUi,
    show: showVehicleSelectionModal,
    hide: hideVehicleSelectionModal,
  } = useContentModal({
    title: 'انتخاب خودرو',
    zIndex: 9000001,
    ignoreFixedWidth: true,
    renderContent: (
      <div>
        <div>
          <TransportFleet
            handle_onVehicleClick={handle_onVehicleClick}
            fleetData={fleetData}
          />
        </div>
      </div>
    ),
  });

  const triggerVehicleSelection = () => {
    showVehicleSelectionModal({});
    hideFinalModal();
  };

  const {
    ui: FinalModalUi,
    show: showFinalModal,
    hide: hideFinalModal,
  } = useContentModal({
    title: 'اطلاعات تکمیلی',
    zIndex: 4,
    renderContent: (
      <div>

        <ModularForm
          formState={finalState}
          fields={authInfo?.org?.additionalTripFields}
          onInputChange={handle_onFinalInputChanged}

        />
        <TitledSparator title={'انتخاب خودرو'} />
        <div onClick={triggerVehicleSelection}>
          {renderUi(<i className=' fa fa-car'></i>).if(selectedVehicle == null)}
          <div>
            <VehicleItem
              vehicle={selectedVehicle}
              basicData={vehicleBasicData}
            />
          </div>
        </div>

        <button className='my-btn' onClick={handle_submitTrip}>
          ثبت سفر
        </button>

      </div>
    ),
  });

  const handle_finalModal = () => {
    showFinalModal({});
  };

  const handle_onUserChipsItemRemoved = (removedUser: any) => {
    const newUserList = selectedUsersState.filter(
      (item: any) => item._id != removedUser._id
    );
    setSelectedUsersState(newUserList);

    const requestListStateClone = { ...requestListState };
    delete requestListStateClone[removedUser._id];
    setRequestListState(requestListStateClone);

    const requestsListUserInputClone = { ...requestsListUserInput };
    delete requestsListUserInputClone[removedUser._id];
    setRequestListUserInput(requestsListUserInputClone);

    if (newUserList.length == 0) {
      setSate({ ...state, activeUser: null });
    }
  };

  const handle_updateRequestListStates = (e: any) => {
    const values = e.target.value;
    const existingDataCount = Object.keys(requestListState).length;
    if (existingDataCount < values?.length) {
      values?.map((user: any) => {
        if (requestListState[user._id] == null) {
          updateRequestListStateById(user, {});
          updateRequestsListUserInput(user, { locations: [] });
        }
      });
    }
    if (state.activeUser == null) handle_onUserChipsItemClick(values?.[0]);
  };

  const updateRequestListStateById = (user: any, stateValue: any) => {
    setRequestListState({
      ...requestListState,
      [user._id]: stateValue,
    });
  };

  const updateRequestsListUserInput = (user: any, stateValue: any) => {
    setRequestListUserInput({
      ...requestsListUserInput,
      [user._id]: stateValue,
    });
  };

  const handle_onUserChipsItemClick = (item: any) => {
    setSate({ ...state, activeUser: item });
  };

  const handle_submitOverride = (requestBody: any, requestId: any) => {
    console.log(5);
    
    //take no action
  };

  const {
    show: showFullScreenModal,
    ui: FullScreenModalUi,
    close: closeFullScreenModal,
  } = useFullScreenModal({
    renderContent: ({ }: any) => {
      return (

        
        <div className='useCreateTripModal-component'>
          <div>
            <div>
              <UsersSuggestionInput
                freeInput={IsDispature === true ? true : false}
                hideChips={true}
                showListOnTop={false}
                externalState={[selectedUsersState, setSelectedUsersState]}
                permissions={['SERVICE.PERSONAL.SUBMIT']}
                include_external_base={true}
                onChange={handle_updateRequestListStates}
              />
            </div>
          </div>
          <div>
            <div>
              <UserSelectionRender
                highlights={state.activeUser ? [state.activeUser] : []}
                smallChips={true}
                list={selectedUsersState}
                onChipsItemClick={handle_onUserChipsItemClick}
                handleRemove={handle_onUserChipsItemRemoved}
              />
            </div>
            <div>
              {renderUi(
                <div className='search-default-text'>
                  مسافر مورد نظر را جستجو کنید ...
                </div>
              ).if(selectedUsersState?.length == 0)}
              {selectedUsersState.map((user: any) => {
                if (user._id == state.activeUser?._id)
                  return (
                    <PassengerServiceRequest
                      mode={MODE_ADMIN_ONLY}
                      key={user._id}
                      externalState={[
                        requestListState[user._id],
                        (value: any) => updateRequestListStateById(user, value),
                      ]}
                      externalUserInput={[
                        requestsListUserInput[user._id],
                        (value: any) =>
                          updateRequestsListUserInput(user, value),
                      ]}
                      overrideOnSubmit={handle_submitOverride}
                    // submitCallback={submitCallback}
                    // initialLocations={initialLocations}
                    // initialValues={initialValues}
                    />
                  );
              })}
            </div>
          </div>
          <div>
            {FinalModalUi}
            <button className='my-btn regist-btn' onClick={handle_finalModal}>
              {'ثبت درخواست'}
            </button>
          </div>
          {FleetModalUi}
        </div>
      );
    },
  });


  return {
    showFullScreenModal,
    FullScreenModalUi,
    closeFullScreenModal,
  };
}
