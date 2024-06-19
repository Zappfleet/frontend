import classNames from 'classnames';
import './style.scss'
import LoaderButton from '../../components/LoaderButton';
import { useEffect, useRef, useState } from 'react';
import useVehicles from '../../hooks/data/useVehicles';
import useVehicleBasicData from '../../hooks/data/useVehicleBasicData';
import PlaqueInput from '../Form/PlaqueInput';
import SimpleButton from '../../components/SimpleButton';
import { BiCloset, BiPlusCircle, BiX, BiXCircle } from 'react-icons/bi';
import { MdClose } from 'react-icons/md';
import {
  MSG_FILL_CHILDREN,
  MSG_OPERATION_WAS_SUCCESSFUL,
  MSG_PICK_ATLEAST_ONE,
  MSG_REQUIRED_FIELD,
  carStatusEntries,
  convertPlaqueToString,
  convertStringToPlaque,
  serviceUnits,
} from '../../lib/string';
import ErrorMessage from '../Form/FormErrorMessage';
import { getApiClient } from '../../apis/client';
import { NotificationController } from '../../lib/notificationController';
import usePermittedUsers from '../../hooks/data/usePermittedUsers';
import SuggestionTextInput from '../../widgets/SuggestionTextInput/SuggestionTextInput';
import {
  EMPTY,
  NONE_KEY,
  PERMIT_DRIVER,
  VEHICLE_TYPE_AGENCY,
} from '../../lib/constants';
import TabbedPanel from '../../components/TabbedPanel/TabbedPanel';


import useCurrentUserPermissions from '../../hooks/useCurrentUserPermissions';
import {
  PERMIT_VEHICLES_CREATE,
  PERMIT_VEHICLES_DELETE,
  PERMIT_VEHICLES_EDIT,
  PERMIT_VEHICLES_LIST
} from '../../lib/constants'

const DEFAULT_SERVICE_ITEM = () => {
  return {
    temp_id: new Date().getTime(),
    service: NONE_KEY,
    capacity: 0,
  };
};

const DEFAULT_INPUT_VALUES = () => {
  return {
    group: '-',
    plaque: {
      serial: '',
      threeDigit: '',
      character: '',
      twoDigit: '',
    },
    services: [DEFAULT_SERVICE_ITEM()],
    extras: {
      name: '-',
      color: '-',
    },
  };
};

const VehicleManager = () => {

  const { hasPermitGroup, hasPermitFor, hasAdminRank, permits } =
    useCurrentUserPermissions();

  const [loading, setLoading] = useState<boolean>(false)
  const [permission_SUBMIT, setPermission_SUBMIT] = useState<boolean>(false)
  const [permission_EDIT, setPermission_EDIT] = useState<boolean>(false)
  const [permission_DELETE, setPermission_DELETE] = useState<boolean>(false)
  const [permission_LIST, setPermission_LIST] = useState<boolean>(false)

  useEffect(() => {
    setPermission_SUBMIT(hasPermitFor([PERMIT_VEHICLES_CREATE]))
    setPermission_EDIT(hasPermitFor([PERMIT_VEHICLES_EDIT]))
    setPermission_DELETE(hasPermitFor([PERMIT_VEHICLES_DELETE]))
    setPermission_LIST(hasPermitFor([PERMIT_VEHICLES_LIST]))

    // setLoading(true)
  }, [hasPermitFor])

  const formRef = useRef<any>();
  const plaqueRef = useRef<any>();

  const { data }: any = useVehicleBasicData({ include_inactive: false });
  const { refreshData: fetchUserData }: any = usePermittedUsers({
    permissions: [PERMIT_DRIVER],
    include_external_base: false,
  });

  const tabsRef = useRef<any>();
  const [input, setInput] = useState<any>(DEFAULT_INPUT_VALUES());
  const [errors, setErrors] = useState<any>({});

  const { vehicles, refreshVehicles } = useVehicles();

  const handle_addServiceItem = (e: any) => {
    e.preventDefault();
    const stateClone = { ...input };
    stateClone.services.push(DEFAULT_SERVICE_ITEM());
    setInput(stateClone);
  };

  const handle_tabChanged = (item: any) => {
    tabsRef.current = item.key;
    refreshVehicles({ type: item.key });
    clearInputs();
  };

  const handle_ServiceItemCapacityChanged = (serviceItem: any, e: any) => {
    const inputClone = { ...input };
    inputClone.services.find(
      ({ temp_id }: any) => temp_id == serviceItem.temp_id
    ).capacity = parseInt(e.target.value);
    setInput(inputClone);
  };

  const handle_ServceItemChanged = (serviceItem: any, e: any) => {
    const inputClone = { ...input };
    inputClone.services.find(
      ({ temp_id }: any) => temp_id == serviceItem.temp_id
    ).service = e.target.value;
    setInput(inputClone);
  };

  const handle_deleteServiceItem = (serviceItem: any) => {
    const inputClone = { ...input };
    inputClone.services = inputClone.services.filter(
      ({ temp_id }: any) => temp_id != serviceItem.temp_id
    );
    setInput(inputClone);
  };

  const handle_onExtraChange = (e: any) => {
    const inputClone = { ...input };
    inputClone.extras[e.target.name] = e.target.value;
    setInput(inputClone);
  };

  const handle_groupChanged = (e: any) => {
    const inputClone = { ...input };
    inputClone.group = e.target.value;
    setInput(inputClone);
  };

  const handle_plaqueChange = (value: any) => {
    setInput({ ...input, plaque: value });
  };

  const checkForAgencyErrors = () => {
    const errors: any = {};
    if (input.agency_name == null || input.agency_name?.trim().length == 0)
      errors.agency_name = MSG_REQUIRED_FIELD;

    if (input.agency_phone == null || input.agency_phone?.trim().length == 0)
      errors.agency_phone = MSG_REQUIRED_FIELD;

    setErrors(errors);

    const hasErrors = Object.keys(errors).length > 0;
    return hasErrors;
  };

  const checkForVehicleErrors = () => {
    const errors: any = {};
    if (input.group == NONE_KEY) errors.group = MSG_REQUIRED_FIELD;

    if (
      Object.entries(input.plaque)
        .map(([_, value]) => value)
        .includes(EMPTY)
    ) {
      errors.plaque = MSG_REQUIRED_FIELD;
    }

    if (input.services.length == 0) errors.services = MSG_PICK_ATLEAST_ONE;

    const emptyFieldExists =
      input.services.find((item: any) => {
        return (
          item.service == NONE_KEY ||
          item.capacity == 0 ||
          item.capacity == null
        );
      }) != null;
    if (emptyFieldExists) {
      errors.services = MSG_FILL_CHILDREN;
    }

    if (input.extras.name == NONE_KEY)
      errors['extras.name'] = MSG_REQUIRED_FIELD;
    if (input.extras.color == NONE_KEY)
      errors['extras.color'] = MSG_REQUIRED_FIELD;

    setErrors(errors);

    const hasErrors = Object.keys(errors).length > 0;
    return hasErrors;
  };

  const handle_onInputChange = (e: any) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const clearInputs = () => {
    setInput(DEFAULT_INPUT_VALUES());
    plaqueRef.current.resetToDefaults();
  };

  const executeApi = (
    method: 'insertVehicle' | 'updateVehicle' | 'insertAgency' | 'updateAgency',
    body: any
  ) => {
    getApiClient()
    [method](body, input._id)
      .then(() => {
        NotificationController.showSuccess(MSG_OPERATION_WAS_SUCCESSFUL);
        clearInputs();
        refreshVehicles({ type: tabsRef.current });
      })
      .catch((e: any) => {
        NotificationController.showError(e.message);
      });
  };

  const handle_submitAgency = (e: any) => {
    e.preventDefault();

    const hasErrors = checkForAgencyErrors();
    if (hasErrors) return;

    const body = {
      agency_name: input.agency_name,
      agency_phone: input.agency_phone,
    };

    const method = input._id == null ? 'insertAgency' : 'updateAgency';
    executeApi(method, body);
  };

  const handle_submitVehicle = (e: any) => {
    e.preventDefault();

    const hasErrors = checkForVehicleErrors();
    if (hasErrors) return;

    const body = {
      group: input.group,
      plaque: convertPlaqueToString(input.plaque),
      services: input.services,
      extra: input.extras,
      driver_user: input.driver?._id,
    };

    const method = input._id == null ? 'insertVehicle' : 'updateVehicle';
    executeApi(method, body);
  };

  function findText(key: any, source: any) {
    if (!source) return '';
    return (
      source.find((item: any) => {
        return item.key == key;
      })?.title || key
    );
  }

  async function readPermittedDrivers(search: string): Promise<any[]> {
    return new Promise((resolve, reject) =>
      fetchUserData(search).then(resolve).catch(reject)
    );
  }

  function handle_selectDriver(driver: any) {
    setInput({ ...input, driver });
  }

  function handle_clearSelectedDriver() {
    setInput({ ...input, driver: null });
  }

  function isAgencyTabSelected() {
    return tabsRef.current == VEHICLE_TYPE_AGENCY;
  }

  function handle_onRowClick(item: any) {
    if (isAgencyTabSelected()) {
      const state = {
        _id: item._id,
        agency_name: item.extra.agency_name,
        agency_phone: item.extra.agency_phone,
      };

      setInput(state);
    } else {
      const state = {
        _id: item._id,
        group: item.group,
        plaque: convertStringToPlaque(item.plaque),
        services: item.services.map((x: any) => {
          return { ...x };
        }),
        extras: { ...item.extra },
        driver: item.driver_user,
      };
      plaqueRef.current.setValues(state.plaque);

      setInput(state);
    }
  }

  function renderHeaders() {
    if (isAgencyTabSelected())
      return (
        <>
          <th>
            نام آژانس
          </th>
          <th>تلفن</th>
        </>
      );
    return (
      <>
        <th>گروه</th>
        <th>وضعیت</th>
        <th>پلاک</th>
        <th>
          سرویس ها
        </th>
        <th>راننده</th>
        <th>جزئیات</th>
      </>
    );
  }

  return (
    <>
      <div className="VehicleManager-component">
        <div className="row">
          <div className="col-12 col-md-4 order-2 order-md-1">
            <div className="right">

              {input._id != null && <i className=' fa fa-remove close-icon' onClick={clearInputs} ></i>}


              <form ref={formRef}>
                <TabbedPanel
                  onTabChange={handle_tabChanged}
                  tabs={[
                    {
                      label: 'سازمانی',
                      key: 'org',
                      component: (
                        <div>
                          <div className="mb-4">
                            <label className="mb-2.5 block font-medium text-black dark:text-white">
                              گروه
                              <ErrorMessage message={errors.group} />
                            </label>
                            <div className="relative flex items-center justify-center">
                              <select
                                value={input.group}
                                onChange={handle_groupChanged}
                                className="select-box w-full"
                              >
                                <option disabled value={NONE_KEY}>
                                  {NONE_KEY}
                                </option>
                                {data?.groups?.map((item: any) => {
                                  return (
                                    <option key={item.key} value={item.key}>
                                      {item.title}
                                    </option>
                                  );
                                })}
                              </select>
                            </div>
                          </div>

                          <div>
                            <label className="mb-2.5 block font-medium text-black dark:text-white">
                              {'پلاک'}
                              <ErrorMessage message={errors.plaque} />
                            </label>
                            <PlaqueInput
                              inputRef={plaqueRef}
                              onChange={handle_plaqueChange}
                            />
                          </div>

                          <div className="mb-2 p-2 shadow">
                            <label className="mb-2.5 block font-medium text-black dark:text-white">
                              {'راننده'}
                              <ErrorMessage message={errors.driver} />
                            </label>
                            <SuggestionTextInput
                              onSuggestionSelected={handle_selectDriver}
                              placeholder="جستجوی راننده ها ..."
                              readFromDataSource={readPermittedDrivers}
                              suggestionRenderer={(item) => (
                                <div className="px-4 py-1">{item.full_name}</div>
                              )}
                            />
                            <div className="mb-2 h-8">
                              {input.driver == null ? (
                                <label className="block w-full text-center text-sm">
                                  {'راننده انتخاب نشده'}
                                </label>
                              ) : (
                                <div className="item-center flex justify-between rounded p-2 shadow">
                                  <span>{`${input.driver.full_name}`}</span>
                                  <BiX
                                    onClick={handle_clearSelectedDriver}
                                    className={'cursor-pointer hover:text-danger'}
                                    size={24}
                                  />
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="mb-4 rounded p-2 shadow">
                            <label className="mb-2.5 block font-medium text-black dark:text-white">
                              سرویس های خودرو
                              <ErrorMessage message={errors.services} />
                            </label>
                            <SimpleButton onClick={handle_addServiceItem}>
                              {'افزودن سرویس'}
                              <BiPlusCircle size={24} className={'mr-2'} />
                            </SimpleButton>

                            {input.services?.map((item: any) => {
                              return (
                                <div
                                  key={item.temp_id}
                                  className="mt-3 flex items-center p-2 shadow"
                                >
                                  <MdClose
                                    onClick={() => handle_deleteServiceItem(item)}
                                    className={
                                      'ml-1 cursor-pointer hover:text-danger'
                                    }
                                    size={24}
                                  />
                                  <select
                                    onChange={(e) =>
                                      handle_ServceItemChanged(item, e)
                                    }
                                    value={item.service}
                                    className="select-box w-full flex-1"
                                  >
                                    <option disabled value={NONE_KEY}>
                                      {NONE_KEY}
                                    </option>
                                    {data?.services?.map((item: any) => {
                                      return (
                                        <option key={item.key} value={item.key}>{`${item.title
                                          } (${Object.fromEntries(serviceUnits)[
                                          item.unit
                                          ] || 'نامشخص'
                                          })`}</option>
                                      );
                                    })}
                                  </select>
                                  <input
                                    onChange={(e) =>
                                      handle_ServiceItemCapacityChanged(item, e)
                                    }
                                    value={item.capacity || ''}
                                    className="mr-2 w-24 rounded border border-gray px-2 outline-none"
                                    placeholder="ظرفیت ..."
                                  />
                                </div>
                              );
                            })}
                          </div>

                          <div className="mx-1 mb-4 flex-1">
                            <label className="mb-2.5 block font-medium text-black dark:text-white">
                              مدل خودرو
                              <ErrorMessage message={errors['extras.name']} />
                            </label>
                            <div className="relative flex items-center justify-center">
                              <select
                                name={'name'}
                                onChange={(e: any) => handle_onExtraChange(e)}
                                value={input.extras?.name}
                                className="select-box w-full"
                              >
                                <option disabled value={NONE_KEY}>
                                  {NONE_KEY}
                                </option>
                                {data?.names?.map((item: any) => {
                                  return (
                                    <option key={item.key} value={item.key}>
                                      {item.title}
                                    </option>
                                  );
                                })}
                              </select>
                            </div>
                          </div>

                          <div className="mx-1 mb-4 flex-1">
                            <label className="mb-2.5 block font-medium text-black dark:text-white">
                              رنگ خودرو
                              <ErrorMessage message={errors['extras.color']} />
                            </label>
                            <div className="relative flex items-center justify-center">
                              <select
                                name={'color'}
                                onChange={(e: any) => handle_onExtraChange(e)}
                                value={input.extras?.color}
                                className="select-box w-full"
                              >
                                <option disabled value={NONE_KEY}>
                                  {NONE_KEY}
                                </option>
                                {data?.colors?.map((item: any) => {
                                  return (
                                    <option key={item.key} value={item.key}>
                                      {item.title}
                                    </option>
                                  );
                                })}
                              </select>
                            </div>
                            <div className="mt-5">
                              {permission_SUBMIT === true &&
                                <LoaderButton
                                  onClick={handle_submitVehicle}
                                  className={'mt-3 w-full cursor-pointer  rounded-lg bg-primary p-2 text-white transition hover:bg-opacity-90'}
                                >
                                  {'ثبت خودرو'}
                                </LoaderButton>
                              }
                              {permission_SUBMIT === false &&
                                <LoaderButton
                                  disabled={true}
                                  className={
                                    'NoPermission mt-3 w-full cursor-pointer  rounded-lg bg-primary p-2 text-white transition hover:bg-opacity-90'
                                  }
                                >
                                  {'ثبت خودرو'}
                                </LoaderButton>
                              }


                            </div>
                          </div>
                        </div>
                      ),
                    },
                    {
                      label: 'آژانس',
                      key: VEHICLE_TYPE_AGENCY,
                      component: (
                        <div className="m-2">
                          <div>
                            <label className="my-2 inline-block">{'نام آژانس'}</label>
                            <ErrorMessage message={errors.agency_name} />
                            <input
                              value={input.agency_name || ''}
                              onChange={handle_onInputChange}
                              name="agency_name"
                              className="w-full rounded border border-gray p-2 outline-none"
                              placeholder="نام آژانس"
                            />
                          </div>
                          <div className="mt-2">
                            <label className="my-2 inline-block">
                              {'شماره تماس'}
                            </label>
                            <ErrorMessage message={errors.agency_phone} />
                            <input
                              onChange={handle_onInputChange}
                              value={input.agency_phone || ''}
                              name="agency_phone"
                              className="w-full rounded border border-gray p-2 outline-none"
                              placeholder="تلفن آژانس"
                            />
                          </div>

                          <div className="mt-5">
                            {permission_SUBMIT === true &&
                              <LoaderButton
                                onClick={handle_submitAgency}
                                className={
                                  'mt-3 w-full cursor-pointer  rounded-lg bg-primary p-2 text-white transition hover:bg-opacity-90'
                                }
                              >
                                {'ثبت آژانس'}
                              </LoaderButton>
                            }
                            {permission_SUBMIT === false &&
                              <LoaderButton
                                disabled={true}
                                className={
                                  'NoPermission mt-3 w-full cursor-pointer  rounded-lg bg-primary p-2 text-white transition hover:bg-opacity-90'
                                }
                              >
                                {'ثبت آژانس'}
                              </LoaderButton>

                            }


                          </div>
                        </div>
                      ),
                    },
                  ]}
                />
              </form>

            </div>
          </div>
          <div className="col-12 col-md-8 order-1 order-md-2">
            <div className="left">
              <table className="table table-hover table-striped">
                <thead>
                  <tr>
                    {renderHeaders()}
                  </tr>
                </thead>
                <tbody>
                  {vehicles?.docs?.map((item: any) => {
                    if (isAgencyTabSelected()) {
                      return (
                        <tr
                          onClick={() => { permission_EDIT === true ? handle_onRowClick(item) : undefined }}
                          key={item._id}
                        >
                          <td>
                            {item.extra.agency_name}
                          </td>
                          <td>
                            {item.extra.agency_phone}
                          </td>
                        </tr>
                      );
                    }
                    return (
                      <tr
                        onClick={() => handle_onRowClick(item)}
                        key={item._id}
                      >
                        <td>
                          {findText(item.group, data.groups)}
                        </td>
                        <td>
                          {Object.fromEntries(carStatusEntries)[item.status]}
                        </td>
                        <td>
                          <PlaqueInput
                            small={true}
                            disabled
                            value={convertStringToPlaque(item.plaque)}
                          />
                        </td>
                        <td>
                          {item.services.map((item: any) => {
                            return (
                              <span>{`${findText(
                                item.service,
                                data.services
                              )} (${item.capacity})`}</span>
                            );
                          })}
                        </td>
                        <td>
                          {item.driver_user?.full_name}
                        </td>
                        <td>
                          {Object.entries(item.extra).map(([_, value]: any) => {
                            return (
                              <span>
                                {findText(value, data[`${_}s`])}
                              </span>
                            );
                          })}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

    </>
  );
};

export default VehicleManager;
