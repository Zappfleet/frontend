import PassengerServiceRequest, {
  MODE_ADMIN_ONLY,
  buildRequestBody,
} from '../../pages/Passenger/PassengerServiceRequest';
import useFullScreenModal from '../useFullScreenModal';
import { MdMenu } from 'react-icons/md';
import { useState } from 'react';
import SimpleButton from '../../components/SimpleButton';
import { BiPlus, BiPlusCircle } from 'react-icons/bi';
import UsersSuggestionInput, {
  UserSelectionRender,
} from '../../widgets/UsersSuggestionInput';
import useContentModal from '../useContentModal';
import ModularForm from '../../widgets/ModularForm';
import useAuthentication from '../data/useAuthentication';
import { getApiClient } from '../../apis/client';
import { NotificationController } from '../../lib/notificationController';
import { VehicleItem } from '../../pages/TripMission/components/VehicleItem';
import useVehicleBasicData from '../data/useVehicleBasicData';
import VehicleItemEmpty from '../../pages/TripMission/components/VehicleItemEmpty';
import { RiPageSeparator, RiSeparator } from 'react-icons/ri';
import TitledSparator from '../../components/TitledSparator';
import TransportFleet from '../../pages/TripMission/components/TransportFleet';
import useFleet from '../data/useFleet';
import renderUi from '../../lib/renderUi';

export default function useCreateTripModal() {
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
    const requestBodies = selectedUsersState.map((user: any, index: number) => {
      const body = buildRequestBody(
        requestListState[selectedUsersState[index]._id],
        requestsListUserInput[selectedUsersState[index]._id]
      );
      body.submitted_for = user;
      return body;
    });

    const fullBody = {
      extra: { ...finalState },
      data: requestBodies,
      vehicle_id: selectedVehicle?._id,
    };
    getApiClient()
      .submitFullMission(fullBody)
      .then(({ data }) => {
        NotificationController.showSuccess('سرویس با موفقیت ثبت شد');
        clearStates();
        hideFinalModal();
        closeFullScreenModal();
      })
      .catch((e) => {
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
      <div style={{ width: '70vw' }}>
        <div
          style={{ height: '80vh' }}
          className="mt-2 rounded-md border border-gray-4"
        >
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
    zIndex: 9000000,
    renderContent: (
      <div className="px-1 py-4">
        <ModularForm
          formState={finalState}
          fields={authInfo?.org?.additionalTripFields}
          onInputChange={handle_onFinalInputChanged}
        />
        <TitledSparator title={'انتخاب خودرو'} />
        <div className="mt-6 cursor-pointer" onClick={triggerVehicleSelection}>
          {renderUi(<VehicleItemEmpty />).if(selectedVehicle == null)}
          <div className="mb-4">
            <VehicleItem
              vehicle={selectedVehicle}
              basicData={vehicleBasicData}
            />
          </div>
        </div>

        <SimpleButton onClick={handle_submitTrip} className="mt-2 w-full">
          ثبت سفر
        </SimpleButton>
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

  const handle_submitOverride = (requestBody: any, requestId: string) => {
    //take no action
  };

  const {
    show: showFullScreenModal,
    ui: FullScreenModalUi,
    close: closeFullScreenModal,
  } = useFullScreenModal({
    zIndex: 1000003,
    noScroll: true,
    renderContent: ({}: any) => {
      return (
        <div className="flex h-full flex-col">
          <div className="flex items-center">
            <div className="mt-3 w-full">
              <UsersSuggestionInput
                hideChips={true}
                showListOnTop={false}
                externalState={[selectedUsersState, setSelectedUsersState]}
                permissions={['SERVICE.PERSONAL.SUBMIT']}
                include_external_base={true}
                onChange={handle_updateRequestListStates}
              />
            </div>
          </div>
          <div className="relative flex flex-1">
            <div className="relative flex-1">
              {renderUi(
                <div className="flex h-full items-center justify-center text-center text-2xl text-gray-5">
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
                      className="!top-0"
                    />
                  );
              })}
            </div>
            <div className="absolute left-3 right-3 top-16">
              <UserSelectionRender
                highlights={state.activeUser ? [state.activeUser] : []}
                smallChips={true}
                list={selectedUsersState}
                onChipsItemClick={handle_onUserChipsItemClick}
                handleRemove={handle_onUserChipsItemRemoved}
              />
            </div>
          </div>
          <div className="flex justify-end p-3">
            {FinalModalUi}
            <SimpleButton
              onClick={handle_finalModal}
              disabled={selectedUsersState?.length == 0}
            >
              {'ثبت درخواست'}
            </SimpleButton>
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
