import { useState, useEffect, useRef } from 'react';
import FloatingButtonWithModal from '../../../widgets/FloatingButtonWithModal';
import SearchInputWithFilter from '../../../widgets/SearchInputWithFilter';
import ServiceRequestCard from './ServiceRequestCard';
import classNames from 'classnames';
import renderUi from '../../../lib/renderUi';
import TripMissionCard from './TripMissionCard';
import TransportFleet from './TransportFleet';
import useRequests from '../../../hooks/data/useRequests';
import { BiPlus, BiPlusCircle } from 'react-icons/bi';
import useDraftMission from '../../../hooks/data/useDraftMission';
import { NotificationController } from '../../../lib/notificationController';
import { findText, networkErrorString } from '../../../lib/string';
import Loader, { SmallLoader } from '../../../common/Loader';
import useVehicleBasicData from '../../../hooks/data/useVehicleBasicData';
import DatePicker from 'react-multi-date-picker';

import persian from 'react-date-object/calendars/persian';
import persian_fa from 'react-date-object/locales/persian_fa';
import AnalogTimePicker from 'react-multi-date-picker/plugins/analog_time_picker';
import { MdClose, MdEdit } from 'react-icons/md';
import useRequestEditModal from '../../../hooks/custom/useRequestEditModal';
import useFleet from '../../../hooks/data/useFleet';
import useSocket from '../../../hooks/useSocket';
import {
  EVENT_FLEET_GPS_REQUEST,
  EVENT_FLEET_GPS_UPDATE,
  MODE_AREAL,
} from '../../../lib/constants';
import SimpleButton from '../../../components/SimpleButton';
import { FaCar } from 'react-icons/fa';
import {
  MISSION_API_PUBLISH,
  MISSION_API_READY,
  TAB_FLEET,
  TAB_REQUESTS,
  TAB_SERVICES,
} from './constants';
import { getApiClient } from '../../../apis/client';
import { VehicleItem } from './VehicleItem';
import useConfirmModal from '../../../hooks/useConfirmModal';
import VehicleItemEmpty from './VehicleItemEmpty';

const ACTIVITY_SELECT_VEHICLE_FOR_MISSION = 'select-vehicle-for-mission';

const switchButtonCommonClassnames =
  'duration-100 flex-1 lg:flex-none mx-1 rounded  py-3 px-3 text-xs font-medium text-black hover:bg-white hover:shadow-card dark:bg-boxdark dark:text-white dark:hover:bg-boxdark';
const switchButtonActiveClassnames = 'bg-white shadow-card';

const REQUESTS_DEFAULT_PARAMS = {
  status: 'PENDING,CONFIRM',
};

const RequestManagment = () => {
  const [fleetGps, setFleetGps] = useState({});

  const fleetData: any = useFleet();

  const [activity, setActivity] = useState<any>({});

  const { show: showConfirm, ui: ConfirmModalUi } = useConfirmModal();

  const fleetGpsUpdate = (payload: any) => {
    if (fleetData?.data?.vehicles?.docs == null) return;
    const newFleetGps: any = {};
    fleetData?.data?.vehicles?.docs?.map((vehicle: any) => {
      newFleetGps[vehicle._id] = {
        vehicle_gps: payload[vehicle._id],
        user_gps: vehicle?.driver_user && payload[vehicle.driver_user._id],
      };
    });
    setFleetGps(newFleetGps);
  };

  const socket = useSocket({
    listeners: {
      [EVENT_FLEET_GPS_UPDATE]: fleetGpsUpdate,
    },
  });

  useEffect(() => {
    console.log('GPS UPDATE');
  }, [fleetGps]);

  useEffect(() => {
    if (socket.current == null) return;
    const interval = setInterval(() => {
      socket.current.emit(EVENT_FLEET_GPS_REQUEST);
    }, 5000);
    return () => {
      clearInterval(interval);
    };
  });

  const { data: vehicleBasicData }: any = useVehicleBasicData();

  const { showFullScreenModal, FullScreenModalUi, closeFullScreenModal } =
    useRequestEditModal();

  const draftMission = useDraftMission();
  const requestsData = useRequests({
    initialParams: REQUESTS_DEFAULT_PARAMS,
    mode: MODE_AREAL,
  });

  const [state, setState] = useState({
    visible_tab: TAB_REQUESTS,
  });

  function handle_switchTab(visible_tab: string, reset_activity = true) {
    setState({ ...state, visible_tab });
    if (reset_activity) {
      setActivity({});
    }
  }

  function handle_editCallback(data: any) {
    if (draftMission.contains(data)) draftMission.update(data);
    requestsData.update(data);
  }

  async function handle_editRequest(item: any) {
    showFullScreenModal({
      data: item,
      submitCallback: (result: any) => {
        closeFullScreenModal();
        handle_editCallback(result);
      },
    });
  }

  async function handle_removeRequestFromDraft(item: any) {
    try {
      const { data }: any = await draftMission.removeRequestFromDraft(item);
      requestsData.update(data.serviceRequest, true);
      NotificationController.showSuccess('درخواست از پیش نویس حذف شد');
    } catch (e) {
      NotificationController.showError(networkErrorString(e));
    }
  }

  async function handle_assignRequestToDraft(item: any) {
    try {
      const { data }: any = await draftMission.assignRequestToDraft(item);
      requestsData.update(data.serviceRequest);
      NotificationController.showSuccess('درخواست به پیش نویس اضافه شد');
    } catch (e) {
      NotificationController.showError(networkErrorString(e));
    }
  }

  function handle_onVehicleClick(vehicle: any) {
    if (activity.current == ACTIVITY_SELECT_VEHICLE_FOR_MISSION) {
      getApiClient()
        .assignVehicleToMission(activity.mission._id, vehicle._id)
        .then(() => {
          if (activity.callback_tab == TAB_REQUESTS) draftMission.reloadDraft();
          NotificationController.showSuccess('خودرو به سرویس اختصاص یافت');
          handle_switchTab(activity.callback_tab);
          setActivity({});
        })
        .catch((e: any) => {
          NotificationController.showError(e.message);
        });
    }
  }

  function removeAssignedVehicleFromMission(mission: any) {
    getApiClient()
      .removeVehicleFromMission(mission._id)
      .then(() => {
        draftMission.reloadDraft();
        NotificationController.showSuccess('خودرو از سرویس حذف شد');
      })
      .catch((e: any) => {
        NotificationController.showError(e.message);
      });
  }

  function prompt_onMissionReady(mission: any) {
    showConfirm({
      title: 'تایید نهایی سرویس',
      desc: `به تایید نهایی سرویس اطمینان دارید؟`,
      label_confirm: 'تایید شود!',
      label_cancel: 'خیر',
      onConfirm: () => {
        getApiClient()
          .updateMissionStatus(mission?._id, MISSION_API_READY)
          .then(() => {
            NotificationController.showSuccess('سرویس ما موفقیت تایید شد.');
            draftMission.reloadDraft();
          })
          .catch((e) => {
            NotificationController.showError(e.message);
          });
      },
    });
  }

  function prompt_publishMission({ setAsReady }: any) {
    showConfirm({
      title: setAsReady ? 'تایید سرویس' : 'انتشار سرویس',
      desc: setAsReady
        ? `آیا از تایید نهایی سرویس اطمینان دارید؟`
        : `آیا از انتشار سرویس اطمینان دارید؟`,
      label_confirm: setAsReady ? 'تایید شود!' : 'منتشر شود!',
      label_cancel: 'خیر',
      onConfirm: () => {
        getApiClient()
          .updateMissionStatus(
            draftMission?.data?._id,
            setAsReady ? MISSION_API_READY : MISSION_API_PUBLISH
          )
          .then(() => {
            NotificationController.showSuccess('اطلاعات با موفقیت حذف شد');
            draftMission.reloadDraft();
          })
          .catch((e) => {
            NotificationController.showError(e.message);
          });
      },
    });
  }

  function triggerVehicleAssignment(mission: any, callback_tab: string) {
    handle_switchTab(TAB_FLEET, false);
    setActivity({
      current: ACTIVITY_SELECT_VEHICLE_FOR_MISSION,
      mission,
      callback_tab,
    });
  }

  return (
    <div>
      {ConfirmModalUi}
      {FullScreenModalUi}
      <div className="flex flex-col items-center justify-between lg:flex-row">
        <SearchInputWithFilter />
        <div className="mt-4 flex w-full lg:mt-0 lg:w-auto">
          <button
            onClick={() => handle_switchTab(TAB_REQUESTS)}
            className={classNames(switchButtonCommonClassnames, {
              [switchButtonActiveClassnames]: state.visible_tab == TAB_REQUESTS,
            })}
          >
            درخواست
          </button>
          <button
            onClick={() => handle_switchTab(TAB_SERVICES)}
            className={classNames(switchButtonCommonClassnames, {
              [switchButtonActiveClassnames]: state.visible_tab == TAB_SERVICES,
            })}
          >
            سرویس
          </button>
          <button
            onClick={() => handle_switchTab(TAB_FLEET)}
            className={classNames(switchButtonCommonClassnames, {
              [switchButtonActiveClassnames]: state.visible_tab == TAB_FLEET,
            })}
          >
            ناوگان
          </button>
        </div>
      </div>

      <div className="py-4">
        {renderUi(
          <ServiceRequestCard
            editCallback={handle_editCallback}
            requests={requestsData}
            draftMission={draftMission}
            handle_assignRequestToDraft={handle_assignRequestToDraft}
          />
        ).if(state.visible_tab == TAB_REQUESTS)}
        {renderUi(
          <TripMissionCard
            prompt_onMissionReady={prompt_onMissionReady}
            triggerVehicleAssignment={triggerVehicleAssignment}
          />
        ).if(state.visible_tab == TAB_SERVICES)}
        {renderUi(
          <div style={{ height: '62vh' }}>
            <TransportFleet
              handle_onVehicleClick={handle_onVehicleClick}
              fleetData={fleetData}
            />
          </div>
        ).if(state.visible_tab == TAB_FLEET)}
      </div>

      <FloatingButtonWithModal
        icon={<BiPlus size={42} className={'text-white'} />}
      >
        {renderUi(<SmallLoader />).if(draftMission?.data == null)}

        {renderUi(
          <label className="p-12">
            {'هیچ درخواستی در پیش نویس وجود ندارد'}
          </label>
        ).if(draftMission?.data?.service_requests?.length === 0)}
        {renderUi(
          <div>
            {draftMission?.data?.service_requests?.map(({ request }: any) => {
              return (
                <div className="relative mx-2 my-4 rounded py-2 pl-6 pr-10 shadow duration-200">
                  <MdClose
                    onClick={(e: any) => handle_removeRequestFromDraft(request)}
                    className="absolute right-0 top-0 h-10 w-10 cursor-pointer p-2 hover:text-danger"
                  />
                  <div className="relative flex items-center border-b border-gray-2">
                    <div className="flex flex-col">
                      <span className="text-primary">
                        {request.submitted_by?.full_name}
                      </span>
                      <span className="text-xs">
                        {findText(request.service, vehicleBasicData.services)}
                      </span>
                    </div>
                    <div className="py-2 pr-6 text-xs">
                      <DatePicker
                        onChange={(value: any) => {}}
                        disableDayPicker
                        calendar={persian}
                        locale={persian_fa}
                        format="HH:mm"
                        className="datetime-picker"
                        inputClass="datetime-input !w-24 !text-center !text-lg !p-4"
                        plugins={[<AnalogTimePicker hideSeconds={true} />]}
                        value={request.gmt_for_date}
                      />
                    </div>
                    <MdEdit
                      onClick={() => handle_editRequest(request)}
                      className="absolute left-0 top-0 h-10 w-10 cursor-pointer p-2 hover:text-secondary"
                    />
                  </div>
                  <div>
                    <span className="text-primary">{'مبدا : '}</span>
                    <span className="inline-block pt-2">
                      {request.locations[0].meta?.address}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        ).if(draftMission?.data != null)}

        {renderUi(
          <div
            onClick={() =>
              triggerVehicleAssignment(draftMission?.data, TAB_REQUESTS)
            }
            className="h-28 px-4 pb-4"
          >
            <div className="relative mx-1 h-full p-2">
              <div className="absolute bottom-2 left-0 right-0 top-2 flex cursor-pointer items-center justify-center rounded border border-dashed hover:border-primary hover:text-primary">
                <MdClose
                  onClick={(e: any) => {
                    e.stopPropagation();
                    removeAssignedVehicleFromMission(draftMission?.data);
                  }}
                  className="absolute right-2 top-2 cursor-pointer hover:text-danger"
                />
                <VehicleItem
                  vehicle={draftMission?.data?.vehicle}
                  basicData={vehicleBasicData}
                />
              </div>
            </div>
          </div>
        ).if(
          draftMission?.data?.service_requests?.length > 0 &&
            draftMission?.data?.vehicle != null
        )}

        {renderUi(
          <VehicleItemEmpty
            onClick={() =>
              triggerVehicleAssignment(draftMission?.data, TAB_REQUESTS)
            }
          />
        ).if(
          draftMission?.data?.service_requests?.length > 0 &&
            draftMission?.data?.vehicle == null
        )}

        {renderUi(
          <div className="flex px-4">
            <SimpleButton
              onClick={() => prompt_publishMission({ setAsReady: true })}
              className={'m-1 w-full bg-secondary'}
            >
              {'انتشار'}
            </SimpleButton>
            <SimpleButton
              onClick={() => prompt_publishMission({ setAsReady: true })}
              className={'m-1 w-full'}
            >
              {'تایید نهایی'}
            </SimpleButton>
          </div>
        ).if(draftMission?.data?.service_requests?.length > 0)}
      </FloatingButtonWithModal>
    </div>
  );
};

export default RequestManagment;
