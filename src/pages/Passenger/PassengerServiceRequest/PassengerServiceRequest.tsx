import { useEffect, useRef, useState } from 'react';
import './style.scss'
import MapContainer, { MapRefType } from '../../../widgets/map/MapContainer';
import LoaderButton from '../../../components/LoaderButton';
import MarkerRed from '../../../images/map/marker-red.png';
import BottomSheetModal from '../../../components/BottomSheetModal';
import carIcon from '../../../assets/imgs/car.svg';
import { RiArrowUpDoubleFill } from 'react-icons/ri';
import TripMissionDetails from '../TripMissionDetails/TripMissionDetails';
import LocationSearch from '../../../widgets/LocationSearch/LocationSearch';
import { BsPin, BsX } from 'react-icons/bs';
import { SmallLoader } from '../../../common/Loader';
import classNames from 'classnames';
import useNeshanApi from '../../../hooks/data/useNeshanApi';
import { MAP_COLOR_PRIMARY, NONE_KEY } from '../../../lib/constants';
import { BiCheck, BiCheckCircle } from 'react-icons/bi';
import useAuthentication from '../../../hooks/data/useAuthentication';
import { ModularInput } from '../../../components/ModularInput';
import { readFormInputs } from '../../../lib/form';
import useVehicleBasicData from '../../../hooks/data/useVehicleBasicData';
import { serviceUnits } from '../../../lib/string';
import { getApiClient } from '../../../apis/client';
import { NotificationController } from '../../../lib/notificationController';
import renderUi from '../../../lib/renderUi';
import ModularForm from '../../../widgets/ModularForm';
import { useLocation } from 'react-router-dom';
import useFavorite from '../../../hooks/data/Favorite/useFavorite';
import DriverOnMap from '../../../components/DriverOnMap/DriverOnMap';


export const MODE_USER_ONLY = 'user-only';
export const MODE_ADMIN_ONLY = 'admin-only';

const PassengerServiceRequest = (props: any = {}) => {

  // console.log(300, props);
  const { result: resultFavorite } = useFavorite(true, 'select', null)
  const { mode: componentMode = MODE_USER_ONLY } = props;
  const internalState = useState<any>(props.initialValues || {});
  const internalUserInput = useState<any>({
    locations: [],
  });


  //sgh
  const location = useLocation();

  const { type, submitted_by, mode, initialLocations, initialValues, className } = location.state || {}; // Extract your props here

  const [formState, setFormState] = props?.externalState != null ? props.externalState : internalState;

  const { authInfo } = useAuthentication();

useEffect(()=>{
console.log(745,authInfo?.org?.additionalRequestFields);

},[authInfo])
  //sgh
  useEffect(() => {
    if (type === "update") {
      setFormState(initialValues)
      //   handle_hideBottomSheet()
      //  handle_showBottomSheet()
    }
  }, [type])

  useEffect(() => {
    //console.log(7, formState);
  }, [formState])

  ////////////////////////////////


  const [userInput, setUserInput] =
    props?.externalUserInput != null
      ? props.externalUserInput
      : internalUserInput;

  useEffect(() => {
    console.log(120, userInput);

  }, [userInput])

  const { searchState, reverseGeocoding } = useNeshanApi();

  const { data: vehicleData }: any = useVehicleBasicData({
    include_inactive: false,
  });

  // const { authInfo } = useAuthentication();

  const mapRef = useRef<MapRefType>();
  const bottomSheet = useRef<any>();

  const mapLayers = useRef<any>({
    polyline: null,
  });

  const [uiState, setUiState] = useState<any>({
    readyForSubmit: false,
  });


  useEffect(() => {
    updateInbetweenLines(userInput.locations);
  }, [userInput]);

  useEffect(() => {
    if (type === undefined && props.initialLocations == null) return;
    const locations = type && type === 'update' ? initialLocations : props.initialLocations.map(
      ({ address, lat, lng }: any) => {
        return {
          address,
          lat,
          lng,
          marker: mapRef.current?.addMarker(lng, lat, true),
        };
      }
    );
    setUserInput({ ...userInput, locations });
    setUiState({
      ...uiState,
      readyForSubmit: locations.length > 1,
    });
  }, []);

  

  const updateInbetweenLines = (newLocations: any) => {
    if (searchState.inProgress || mapRef.current == null) return;

    if (mapLayers.current.polyline != null) {
      mapRef.current.remove(mapLayers.current.polyline.polyline);
      mapLayers.current.polyline = null;
    }
    if ((newLocations || userInput.locations).length > 1) {
      const addPolylineResult = mapRef.current.addPolyline(
        (newLocations || userInput.locations).map((m: any) => {
          return [m.lng, m.lat];
        }),
        true,
        MAP_COLOR_PRIMARY
      );
      if (addPolylineResult == null) return;

      mapLayers.current.polyline = addPolylineResult;
    }

    setUiState({
      ...uiState,
      readyForSubmit: newLocations.length > 1,
    });
  };

  const handle_clickPin = () => {
    if (searchState.inProgress || mapRef.current == null) return;

    const addMarkerResult = mapRef.current.addMarkerToCenter();
    if (addMarkerResult == null) return;

    const [lng, lat] = addMarkerResult.coordinates;
    console.log(200, lng, lat);

    reverseGeocoding(lat, lng)
      .then((result) => {
        setUserInput({
          ...userInput,
          locations: [
            {
              address: result.formatted_address,
              lng,
              lat,
              marker: addMarkerResult.marker,
            },
            ...userInput.locations,
          ],
        });
      })
      .catch((e) => {
        mapRef.current?.remove(addMarkerResult.marker);
      });
  };

  const handle_deleteLocation = (index: number) => {
    const itemToRemove = userInput.locations[index];
    mapRef.current?.remove(itemToRemove.marker);

    userInput.locations.splice(index, 1);
    const newLocations = [...userInput.locations];
    setUserInput({
      ...userInput,
      locations: newLocations,
    });
  };

  const onBottomSheetCreate = (ui: any) => {
    bottomSheet.current = ui;
  };

  const handle_showBottomSheet = () => {
    bottomSheet.current.show();
  };
  const handle_hideBottomSheet = () => {
    bottomSheet.current.hide();
  };

  const clearMapMarkers = () => {
    userInput.locations.map(({ marker }: any) => {
      mapRef.current?.remove(marker);
    });
    setUserInput({
      ...userInput,
      locations: [],
    });
    updateInbetweenLines([]);
  };

  const handle_submitRequest = (e: any) => {
    console.log(1);
    
    e.preventDefault();

    const body = buildRequestBody(formState, userInput, type, submitted_by);

    console.log(2,props.overrideOnSubmit,body,formState._id);
    
    if (props.overrideOnSubmit != null) {
      props.overrideOnSubmit(body, formState._id);
      handle_hideBottomSheet();
    //  return;
    }

    const method = formState._id == null ? 'submitRequest' : 'updateRequest';
     console.log(333, method);

    getApiClient()
    [method](body, formState._id)
      .then(({ data }) => {
        console.log(320,data);
        
        NotificationController.showSuccess('اطلاعات با موفقیت ذخیره شد');
        setFormState({});
        clearMapMarkers();
        handle_hideBottomSheet();
        if (props.submitCallback != null) props.submitCallback(data);
      })
      .catch((e) => {
        NotificationController.showError(e.response.data.error);
      });
  };

  const handle_onInputChanged = (e: any) => {
    setFormState({ ...formState, [e.target.name]: e.target.value });
  };

  const handleSelectFavorite = (item: any) => {
    const [lng, lat] = item?.location?.coordinates
    mapRef.current?.viewCoordinates(lng, lat, 16)
  }

  const showDriverOnMap = () => {
    console.log(55);
    const [lng, lat] = [52.808064, 29.88258900000001]
    mapRef.current?.addMarker(5879388.492312675, 3488877.5134539823, false, carIcon)

  }

  return (
    <div className="PassengerServiceRequest-page">
      <div className={`main-div ${type === 'update' ? className : ''}`}>

        {/* sgh map */}
        <MapContainer mapRef={mapRef as { current: MapRefType }} />


        <img className="absolute bottom-2/4 left-2/4 w-8 -translate-x-2/4"
          src={MarkerRed}
        />

        <LocationSearch
          mapRef={mapRef}
          className="absolute left-0 right-0 top-0 z-50 m-2 flex "
        />

        <div className="showFavoriteLocation">
          {resultFavorite?.data?.map((item: any) => {
            return <div onClick={() => handleSelectFavorite(item)} className='favorite-name'>
              {item.name}
            </div>
          })}
        </div>


        <div className="loc-name-div">
          {userInput.locations.map((item: any, index: number) => {
            return (
              <div className='loc-name'>
                <span
                  key={`${item.lat}${item.lng}`}
                >
                  <i className='fa fa-remove loc-remove' onClick={() => handle_deleteLocation(index)} ></i>
                  <span >{item.address}</span>
                </span>
              </div>
            );
          })}

          <span className="flex-center">
            {/* <i className='fa fa-search' onClick={showDriverOnMap}></i> */}
            <button  onClick={handle_clickPin} className="my-btn"><i className="fas fa-thumbtack"></i> انتخاب ایستگاه</button>

            {/* <button
              onClick={handle_clickPin}
              className="m-2 flex h-14 w-14 cursor-pointer items-center justify-center rounded-full bg-primary p-3 text-primary text-white shadow active:saturate-50"
            >
              <BsPin
                className={classNames('absolute p-0.5 text-white duration-200', {
                  'scale-0': searchState.inProgress,
                  'scale-100': !searchState.inProgress,
                })}
                size={30}
              />
              <SmallLoader
                className={classNames('absolute duration-200', {
                  'scale-0': !searchState.inProgress,
                  'scale-100': searchState.inProgress,
                })}
                color={'white'}
              />
            </button> */}
 

            <button
              onClick={handle_showBottomSheet}
              className={classNames(
                'm-2 flex h-14 w-14 cursor-pointer items-center justify-center rounded-full bg-success p-3 text-primary text-white shadow duration-300 active:saturate-50',
                {
                  'scale-100': uiState.readyForSubmit,
                  'scale-0': !uiState.readyForSubmit,
                }
              )}
            >
              <BiCheck
                className={classNames('absolute p-0.5 text-white duration-200')}
                size={40}
              />
            </button>
          </span>
        </div>

        <BottomSheetModal onCreate={onBottomSheetCreate}>
          <div>
            <form>
              <div className="mb-2">
                <label className="inline-block py-2">{'سرویس'}</label>
                <select
                  value={formState['service'] || NONE_KEY}
                  onChange={handle_onInputChanged}
                  name="service"
                  className="select-box w-full flex-1"
                >
                  <option
                    disabled
                    key={NONE_KEY}
                    value={NONE_KEY}
                  >{`--- سرویس مورد نظر را انتخاب کنید ---`}</option>
                  {vehicleData?.services?.map((item: any) => {
                    return (
                      <option
                        key={item.key}
                        value={item.key}
                      >{`${item.title}`}</option>
                    );
                  })}
                </select>
              </div>

              <ModularForm
                formState={formState}
                fields={authInfo?.org?.additionalRequestFields}
                onInputChange={handle_onInputChanged}
                mode={componentMode}
              />
            </form>
            <LoaderButton
              onClick={handle_submitRequest}
              className={'my-3 w-full'}
            >
              {props.overrideOnSubmit != null ? 'تایید' : type && type === 'update' ? 'بروزرسانی' : 'ثبت درخواست'}
            </LoaderButton>
          </div>
        </BottomSheetModal>
      </div >
    </div>
  );
};

export function buildRequestBody(formState: any, userInput: any, type: any, submitted_by: any) {
  const body: any = {};

  const { service, datetime, ...rest } = formState;

  console.log(414141, service, formState);

  if (datetime != null) {
    body.gmt_for_date = !Array.isArray(datetime)
      ? [datetime]
      : datetime.map((v: any) => {
        if (typeof v === 'string' || v instanceof String) return v;
        return v.toDate().toISOString();
      });
  }

  body.details = rest;
  body.service = service;
  body.locations = userInput.locations.map((loc: any) => {

    const { lng, lat, ...rest } = loc;
    delete rest.marker;
    return {
      coordinates: [lat, lng],
      wait: 0,
      meta: rest,
    };
  });

  body.type = type && type === 'update' ? type : '';
  body.submitted_by = type && type === 'update' ? submitted_by : ''

  return body;
}

export default PassengerServiceRequest;
