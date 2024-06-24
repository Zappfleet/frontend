import { useContext, useEffect, useState } from "react";
import {
  Badge,
  Box,
  Button,
  Card,
  Divider,
  Grid,
  Group,
  LoadingOverlay,
  Modal,
  ScrollArea,
  SegmentedControl,
  Text,
} from "@mantine/core";
import httpService from "../../../services/httpService";
import settings from "../../../config";
import useSWR from "swr";
import { HeightContext } from "../panel";
import { List, Map2, MapPin, Car, MapPins, Check } from "tabler-icons-react";
import RequestTable from "../../../components/request/requestTable";
import { uuid } from "uuidv4";
import CarsAndRequestsMap, { carIcon } from "../../../components/request/carNrequestsMap";
import SearchBox from "../../../components/common/filter&search/searchBox";
import FilterBox from "../../../components/common/filter&search/filterBox";
import { useParams } from "react-router";
import TripDrafts from "../../../components/trip/tripDraft";
import RequestDetailsBox, {
  finishIcon,
  startIcon,
  SureCancelRequestModal,
} from "../../../components/request/requestDetailsBox";
import { hideNotification, showNotification } from "@mantine/notifications";
import { useElementSize } from "@mantine/hooks";
import DriversTable from "../../../components/cars/driversTable";
import { catchError } from "../../../utils/errorHelper";
import {
  ErrorToast,
  SucccessToast,
} from "../../../components/common/errorToast";
import AvailableCarsModal from "../../../components/cars/availabelCarsModal";
import { useRole } from "../../../hooks/useRole";
import CarsFilterModal from "../../../components/cars/carsFilterModal";
import RequestsfilterModal from "../../../components/request/requestsfilterModal";
import HintTooltip from "../../../components/request/hintPopover";
import RestHeightContent from "../../../components/hoc/restHeightContent";
import _, { method } from "lodash";
import { SocketContext } from "../../../App";
import moment from "jalali-moment";
import { SureModal } from "../../../components/common/modal/sureModal";
import { useMemo } from "react";
import { useRef } from "react";
import { getETA, locationSearch } from "../../../services/externalApiService";
import { searchSystemLocations } from "../../../services/locationService";
import AvailableDrivers from "./availableDrivers";
import LoadingContainer from "../../../components/hoc/loadingContainer";
import { MapContainer, Marker, TileLayer } from "react-leaflet";
import { getTripStatusString } from "../../../utils/tripHelper";
import VisibleStartIcon from "../../../assets/imgs/visibleStartIcon";
import { getRequestActiveStepString, getRequestStepString } from "../../../utils/requestHelper";
import { marker } from "leaflet";

let tripDraftsOutState = [];
let showDetailsOut = false;
const DROP_DOWN_LIMIT = 6;

const earlyToday = new Date();
earlyToday.setUTCHours(0, 0, 0, 0);

const lateTomorrow = new Date();
lateTomorrow.setDate(lateTomorrow.getDate() + 1);
lateTomorrow.setUTCHours(23, 59, 59, 999);


const tripDraftParams = {
  status: [0, 1],
  for_date: [
    earlyToday,
    lateTomorrow,
  ]
};

function Requests() {
  let role = useRole();
  let _mode = useRef();
  let _step = useRef();
  let { mode } = useParams();
  if (!mode) mode = role;
  if (mode == "superDispatcher") mode = "dispatcher";
  const step = mode === "manager" ? [0] : [1, 2];

  _mode.current = mode;
  _step.current = step;

  const socket = useContext(SocketContext);

  const [cars, setCars] = useState();
  const [view, setView] = useState("map");
  const [layer, setLayer] = useState("requests");
  const [requests, setRequests] = useState();
  const [loading, setLoading] = useState(false);
  const [params, setParams] = useState({ step });
  const [tripDrafts, setTripDrafts] = useState([]);
  const [filterModalOpened, setFilterModalOpen] = useState(false);
  const [availableCars, setAvailableCars] = useState([]);
  const [displayDetailsOnCar, setDisplayDetailsOnCar] = useState(null);
  const [paginationData, setPaginationData] = useState();
  const [selectedRequest, setSelectedRequest] = useState();
  const [taxiCost, setTaxiCost] = useState("");
  const [showMode, setShowMode] = useState();
  const [showDetails, setShowDetails] = useState(false);
  const [requestDetailModal, setRequestDetailModal] = useState(false);
  const [showAvailableCarsModal, setShowAvailableCarsModal] = useState(false);
  const [iscancelReuestModalOpen, setIscancelReuestModalOpen] = useState(false);
  const [locationsResult, setLocationsResult] = useState([]);
  const [sureModal, setSureModal] = useState({
    opened: false,
    trip_id: null,
    car_id: null,
  });
  let [cancelledRequestsCount, setCancelledRequestsCount] = useState(0);

  const { ref: fixRef, width, height: fixHeight } = useElementSize();
  const height = useContext(HeightContext);
  const mapRef = useRef()
  const cityRef = useRef()
  const { data: draftsList, mutate: mutateDrafts } = useSWR(
    mode === "dispatcher"
      ? [settings.apiUrl + "/trip", { params: tripDraftParams }]
      : null,
    httpService.get,
    { revalidateOnFocus: false }
  );
  const {
    data: requestList,
    error: requestsError,
    mutate: mutateRequests,
  } = useSWR([settings.apiUrl + "/request", { params }], httpService.get, {
    revalidateOnFocus: false,
  });

  const { data: carList, mutate: muteCars } = useSWR(
    [settings.apiUrl + "/car", { params }],
    httpService.get,
    {
      revalidateOnFocus: false,
    }
  );

  if (requestsError) {
    ErrorToast({ message: "خطا در دریافت اطلاعات" });
  }

  const handleChangeShowMode = (mode) => {
    if (showMode === mode) {
      return setShowMode();
    }
    setShowMode(mode);
  };


  const handleChangeRequestTime = async (draft_id, request_id, for_time) => {
    try {
      await httpService.put(settings.apiUrl + `/request/${request_id}/time`, {
        for_time,
      });
      SucccessToast({ message: "ساعت جدید با موفقیت ثبت شد" });
      const newDraft = tripDrafts.find((draft) => draft.id === draft_id);
      newDraft.requests.forEach((rq) => {
        console.log({ rq });
        if (rq._id === request_id) {

          if (!rq.past_for_time) {
            rq.past_for_time = [];
          }

          rq.past_for_time.push({ from: rq.for_time, to: for_time });

          rq.for_time = for_time;
        }
      });
      setTripDrafts([...tripDrafts]);
    } catch (error) {
      catchError(error);
    }
  };

  const handleForceSelectRequest = async (request, tripId) => {
    const tripDraft = tripDrafts.find((t) => t.id === tripId);
    if (tripDraft?.frontCreated) {
      setSelectedRequest(request);
      setRequestDetailModal(true);
    } else {
      try {
        setLoading(true);
        const { data } = await httpService.get(
          settings.apiUrl + "/request/" + request._id
        );
        setLoading(false);
        setSelectedRequest(data?.doc);
        setRequestDetailModal(true);
      } catch (error) {
        setLoading(false);
        catchError(error);
      }
    }
  };

  const handleDeleteSavedTripDraft = async (id) => {
    try {
      setLoading(true);
      await httpService.delete(settings.apiUrl + "/trip/" + id);
      SucccessToast({ message: "حذف سفر انجام شد" });
      mutateDrafts();
      mutateRequests();
      setLoading(false);
    } catch (error) {
      setLoading(false);
      catchError(error);
    }
  };

  const handleAddToSavedTripDraft = async (trip_id, request_id) => {
    try {
      setLoading(true);
      await httpService.put(
        settings.apiUrl + `/trip/${trip_id}/request/${request_id}/add`
      );
      SucccessToast({ message: "درخواست سفر  به پیش نویس اضافه شد" });
      mutateDrafts();
      mutateRequests();
      setLoading(false);
    } catch (error) {
      setLoading(false);
      catchError(error);
    }
  };

  const handleRmPassFromSavedDarft = async (trip_id, request_id) => {
    try {
      setLoading(true);

      await httpService.delete(
        settings.apiUrl + `/trip/${trip_id}/request/${request_id}/delete`
      );
      SucccessToast({ message: "درخواست  حذف شد" });
      mutateRequests();
      mutateDrafts();
      setLoading(false);
    } catch (error) {
      setLoading(false);

      catchError(error);
    }
  };

  const handleCheckRequest = async (result) => {
    try {
      setLoading(true);
      await httpService.put(
        settings.apiUrl + `/request/${selectedRequest._id}/check`,
        {
          result,
        }
      );
      setRequestDetailModal(false);
      setIscancelReuestModalOpen(false);
      setLoading(false);
      SucccessToast({
        message: result ? "درخواست  تایید شد" : "درخواست لغو شد",
      });
      mutateRequests();
      setSelectedRequest(null);
    } catch (error) {
      setLoading(false);
      catchError(error);
      setIscancelReuestModalOpen(false);
    }
  };

  const handleAssignCarToTripDraft = async (tripDraft) => {
    const car_id = tripDraft?.car?._id;
    if (!car_id) return ErrorToast({ message: "سفر قبلا ثبت شده است" });
    try {
      setLoading(true);
      await httpService.put(settings.apiUrl + `/trip/${tripDraft.id}/car/add`, {
        car_id,
      });
      SucccessToast({ message: "سفر  ثبت شد" });
      mutateDrafts();
      mutateRequests();
      setLoading(false);
    } catch (error) {
      setLoading(false);
      if (
        error?.response?.status === 400 &&
        error?.response?.data?.info === "carInTrip"
      ) {
        const availableCars = error?.response?.data?.availableCars.map(
          (car) => ({
            value: car?._id,
            label: car?.driver?.user?.full_name,
            ...car,
          })
        );
        setAvailableCars(availableCars);
        return setShowAvailableCarsModal(true);
      }
      catchError(error);
    }
  };

  const handleRegisterTripDraft = async (id) => {

    let tripDraftIndex;
    const tripDraft = tripDrafts.find((td, index) => {
      if (td.id === id) {
        tripDraftIndex = index;
        return true;
      }
    });
    if (!tripDraft.frontCreated) return handleAssignCarToTripDraft(tripDraft);
    const request_ids = tripDraft?.requests?.map((r) => r._id);
    const car_id = tripDraft?.car?._id;
    try {
      setLoading(true);
      await httpService.post(settings.apiUrl + "/trip", {
        request_ids,
        car_id,
        taxi_cost: taxiCost || 0
      });
      SucccessToast({ message: "سفر  ثبت شد" });
      tripDraft.frontCreated = false;
      tripDrafts[tripDraftIndex] = tripDraft;

      setTripDrafts([...tripDrafts]);

      setTimeout(() => {
        mutateDrafts();
      }, 300);


      setLoading(false);

    } catch (error) {
      setLoading(false);
      if (
        error?.response?.status === 400 &&
        error?.response?.data?.info === "carInTrip"
      ) {
        const availableCars = error?.response?.data?.availableCars.map(
          (car) => ({
            value: car?._id,
            label: car?.driver?.user?.full_name,
            ...car,
          })
        );
        setAvailableCars(availableCars);
        return setShowAvailableCarsModal(true);
      }
      catchError(error);
    }
  };

  const handleDeleteCarFromSavedTrip = async (tripId) => {


    try {
      await httpService.delete(
        settings.apiUrl + "/trip/" + tripId + "/car/delete"
      );

      SucccessToast({ message: "راننده ی سفر حذف شد" });
      mutateDrafts();
    } catch (error) {
      catchError(error);
    }
  };

  const handleDeleteCarFromTripDraft = (boxId) => {
    const foundTrip = tripDrafts.find((item) => item.id == boxId);
    if (foundTrip == null) return;
    delete foundTrip.car;
    setTripDrafts([...tripDrafts]);
    handleDeleteCarFromSavedTrip(boxId);
  };

  const handleShowCarDetails = (id) => {
    console.log("show car details");
  };


  const handleChangeTripCar = async (trip_id, car_id) => {
    const foundTrip = tripDrafts.find((item) => item.id == trip_id);
    try {
      setLoading(true);
      if (foundTrip.status == 0) {
        await httpService.put(settings.apiUrl + `/trip/${trip_id}/car/add`, {
          car_id,
        });
      } else {
        await httpService.delete(
          settings.apiUrl + "/trip/" + trip_id + "/car/delete"
        );
        await httpService.put(settings.apiUrl + `/trip/${trip_id}/car/add`, {
          car_id,
        });
      }

      SucccessToast({ message: "سفر  ثبت شد" });
      sureModal.opened = false;
      setSureModal({ ...sureModal });
      mutateDrafts();
      mutateRequests();
      setLoading(false);
    } catch (error) {
      sureModal.opened = false;
      setSureModal({ ...sureModal });
      handleActivateTripDraft(trip_id);
      setLoading(false);
      if (
        error?.response?.status === 400 &&
        error?.response?.data?.info === "carInTrip"
      ) {
        const availableCars = error?.response?.data?.availableCars.map(
          (car) => ({
            value: car?._id,
            label: car?.driver?.user?.full_name,
            ...car,
          })
        );
        setAvailableCars(availableCars);
        setShowAvailableCarsModal(true);
      } else {
        console.log("err=>", error);
        catchError(error)
      };
    }
  };

  const handleOnCarItemClick = (car) => {
    setDisplayDetailsOnCar(car);
  }

  const handleAddCarToTripDraft = (id) => {
    let tripDraftIndex;
    const car = cars.find((c) => c._id === id);
    const newTripDrafts = [...tripDrafts];
    const tripDraft = newTripDrafts.find((t, index) => {
      if (t.active === true) {
        tripDraftIndex = index;
        return true;
      }
    });

    if (!tripDraft) return;
    if (!tripDraft.frontCreated && tripDraft?.car?._id) {


      sureModal.opened = true;
      sureModal.trip_id = tripDraft.id;
      sureModal.car_id = id;
      return setSureModal({ ...sureModal });
    }
    tripDraft.car = car;

    newTripDrafts[tripDraftIndex] = tripDraft;
    setTripDrafts(newTripDrafts);
    tripDraftsOutState = newTripDrafts;



  };

  const handleFilter = (param) => {
    setParams((prevParams) => {
      return { ...prevParams, ...param, step };
    });
  };

  const handleActivateTripDraft = (id) => {
    const newTripDrafts = [...tripDrafts];
    newTripDrafts.forEach((tripdraft) => {
      if (tripdraft.id === id) tripdraft.active = true;
      else tripdraft.active = false;
    });
    setTripDrafts(newTripDrafts);
  };

  const handleMaketripDraft = () => {
    tripDrafts.forEach((tripDraft) => {
      tripDraft.active = false;
    });
    setTripDrafts((tripDrafts) => {
      return [
        ...tripDrafts,
        {
          id: uuid(),
          requests: [],
          car: { id: "", driver: {} },
          active: true,
          frontCreated: true,
        },
      ];
    });
    tripDraftsOutState = [
      ...tripDrafts,
      {
        id: uuid(),
        requests: [],
        car: { id: "", driver: {} },
        active: true,
        frontCreated: true,
      },
    ];
  };

  const handleDeleteTripDraft = (id) => {
    const tripDraft = tripDrafts.find((td) => td.id === id);
    if (!tripDraft.frontCreated) return handleDeleteSavedTripDraft(id);
    const newRequests = [...requests];
    newRequests.push(...tripDraft.requests);
    setRequests(newRequests);
    tripDraftsOutState = tripDraftsOutState.filter((td) => td.id !== id);
    setTripDrafts(tripDraftsOutState);
  };

  const handleSelectRequest = (id) => {
    setSelectedRequest(() => requests.find((request) => request.id === id));
    if (mode == "dispatcher" && showDetailsOut) {
      setRequestDetailModal(true);
    }

  };

  const handleAddToActiveTripDraft = (requestId) => {

    if (mode != "dispatcher") return;

    if (showDetails) return;
    let newRequests = [...requests];
    let theRequest;
    newRequests = newRequests.filter((request) => {
      if (request._id === requestId) {
        theRequest = request;
        return false;
      }
      return true;
    });
    let index;
    const newDrafts = [...tripDraftsOutState];
    let draft = newDrafts.filter((tripDraft, i) => {
      if (tripDraft.active) {
        index = i;
        return true;
      }
    })[0];
    if (draft)
      if (!draft.frontCreated)
        return handleAddToSavedTripDraft(draft.id, requestId);

    index = !index ? 0 : index;
    const shouldReplace = draft != null;
    draft = !draft
      ? {
        id: uuid(),
        requests: [],
        car: { id: "", driver: {} },
        active: true,
        frontCreated: true,
      }
      : draft;
    const newDraft = {
      ...draft,
      requests: [...draft?.requests, theRequest],
    };
    let passengerCount = 0;
    newDraft.requests.forEach((r) => {
      passengerCount += r?.passenger?.guests?.length;
      passengerCount += r?.passenger?.mates?.length;
      passengerCount += 1;
    });
    if (passengerCount > 4)
      return ErrorToast({ message: "تعداد مسافران سفر بیش از ۴ نفر" });

    if (shouldReplace) {
      newDrafts[index] = newDraft;
      tripDraftsOutState = newDrafts;
    } else {
      tripDraftsOutState = [newDraft, ...newDrafts];
    }
    setTripDrafts(tripDraftsOutState);
    setRequests(newRequests);
  };

  const handleRemoveFromActiveTrip = (tripId, requestId) => {
    let index;
    let theRequest;
    const newDrafts = [...tripDraftsOutState];
    let draft = newDrafts.find((tripDraft, i) => {
      if (tripDraft.id === tripId) {
        index = i;
        return true;
      }
    });
    if (!draft.frontCreated)
      return handleRmPassFromSavedDarft(tripId, requestId);
    const newDraft = {
      ...draft,
      requests: draft.requests.filter((request) => {
        if (request._id === requestId) {
          theRequest = request;
          return false;
        }
        return true;
      }),
    };
    newDrafts[index] = newDraft;
    tripDraftsOutState = newDrafts;
    let newRequests = _.orderBy(
      [...requests, theRequest],
      ["for_date", "for_time"],
      ["asc", "asc"]
    );
    setRequests(newRequests);
    setTripDrafts(tripDraftsOutState);
  };

  useEffect(() => {
    socket.on("mutate-request-list", ({ request, method }) => {
      let insideParams;
      setParams((prevParams) => {
        insideParams = prevParams;
        return prevParams;
      });
      if (!insideParams?.for_date) return;

      if (method === "add") {
        if (
          moment(request?.for_date).isBetween(
            insideParams?.for_date[0],
            insideParams?.for_date[1],
            undefined,
            "[]"
          ) &&
          _step.current.includes(request?.step)
        ) {
          setRequests((prevRequests) => {
            if (Array.isArray(prevRequests)) return sortRequests([...prevRequests, request]);
            else return [request];
          });
        }
      } else if (method === "delete") {
        setRequests((prevRequests) => {
          if (Array.isArray(prevRequests)) {
            let result = prevRequests.filter((r) => r._id !== request?._id);
            return [...result];
          }
        });
      }
    });
    socket.on("car-status-changed", ({ car }) => {
      setCars((prevCars) => {
        if (Array.isArray(prevCars)) {

          let result = prevCars.filter((c) => c._id !== car._id);
          return [
            ...result,
            {
              value: car?._id,
              label: car?.driver?.user?.full_name,
              ...car,
            },
          ];
        } else
          return [
            {
              value: car?._id,
              label: car?.driver?.user?.full_name,
              ...car,
            },
          ];
      });
    });
    socket.on("mutate-drafts-list", ({ trip, method }) => {

      if (method === "delete") {
        {
          setTripDrafts((prevTrips) => {
            if (Array.isArray(prevTrips)) {
              let result = prevTrips.filter((t) => t.id !== trip?._id);
              tripDraftsOutState = [...result];
              return [...result];
            }
          });
        }
      } else if (method === "change") {

        setTripDrafts((prevTrips) => {
          if (Array.isArray(prevTrips)) {
            let index = null;
            prevTrips.find((t, i) => {
              if (t.id === trip?._id) {
                index = i;
                return true;
              }

              return false;
            });
            if (index !== null) {
              const requests = trip?.passengers?.map((p, order) => ({
                _id: p.request_id,
                passenger: { full_name: p.full_name },
                locations: trip?.locations[order],
              }));
              const newtrip = {
                requests,
                status: trip?.status,
                id: trip?._id,
                for_time: trip?.for_time,
                frontCreated: false,
                car: { _id: trip?.car?.car_id, driver: trip?.driver },
                active: false,
                has_cancelled_request: trip?.has_cancelled_request,
              };
              prevTrips[index] = newtrip;
              tripDraftsOutState = [...prevTrips];
              return [...prevTrips];
            }
          }
        });
      } else if (method === "add") {
        setTripDrafts((prevTrips) => {
          const requests = trip?.passengers?.map((p, order) => ({
            _id: p.request_id,
            passenger: { full_name: p.full_name },
            locations: trip?.locations[order],
          }));
          const newtrip = {
            requests,
            status: trip?.status,
            id: trip?._id,
            for_time: trip?.for_time,
            frontCreated: false,
            car: { _id: trip?.car?.car_id, driver: trip?.driver },
            active: false,
            has_cancelled_request: trip?.has_cancelled_request,
          };

          if (Array.isArray(prevTrips)) {
            let existingIndex = prevTrips.length;
            for (let i = 0; i < prevTrips.length; i++) {
              if (prevTrips[i].id == newtrip.id) {
                existingIndex = i;
                break;
              }
            }
            const newList = [...prevTrips];
            newList[existingIndex] = newtrip;
            tripDraftsOutState = sortTripList(newList);
            return sortTripList(newList);
          } else {
            tripDraftsOutState = [newtrip]
            return [newtrip]
          };
        });
      }
    });
  }, [socket]);

  useEffect(() => {
    if (showMode === "showDetails") {
      setShowDetails(true);
      showDetailsOut = true;
    } else {
      setShowDetails(false);
      showDetailsOut = false;
    }
  }, [showMode]);

  useEffect(() => {
    handleFilter({ step });
    setSelectedRequest(null);
  }, [mode]);

  useEffect(() => {
    if (showMode === "showDetails")
      showNotification({
        id: "hotKey",
        autoClose: false,
        message: "تغییر حالت نمایش",
        title: "حالت نمایش جزئیات درخواست ها",
        color: "green",
        icon: <Check />,
      });
    else if (showMode === "showDistination") {
      showNotification({
        id: "hotKey",
        autoClose: false,
        message: "تغییر حالت نمایش",
        title: "حالت نمایش مقصد درخواست ها",
        color: "green",
        icon: <Check />,
      });
    } else hideNotification("hotKey");
  }, [showMode]);

  useEffect(() => {
    setRequests(requestList?.data?.docs);
    delete requestList?.data?.docs;
    setPaginationData(requestList?.data);
  }, [requestList?.data]);

  useEffect(() => {
    const newCars = carList?.data?.docs.map((car) => {
      return {
        value: car?._id,
        label: car?.driver?.user?.full_name,
        ...car,
      };
    });
    setCars(newCars);
  }, [carList?.data]);

  useEffect(() => {

    const activeDraft = tripDrafts?.find((draft) => draft.active)

    cancelledRequestsCount = 0;
    let newList = draftsList?.data?.docs?.map((d, index) => {
      if (d?.has_cancelled_request) cancelledRequestsCount += 1;
      const requests = d?.passengers?.map((p, order) => ({
        _id: p.request_id,
        passenger: { full_name: p.full_name },
        locations: d?.locations[order],
      }));
      return {
        requests,
        status: d?.status,
        id: d?._id,
        for_date : d?.for_date,
        for_time: d?.for_time,
        frontCreated: false,
        car: { _id: d?.car?.car_id, driver: d?.driver },
        active: d?._id == activeDraft?._id ? true : false,
        has_cancelled_request: d?.has_cancelled_request,
        taxi_cost: d.taxi_cost
      };
    });
    if (newList?.length >= 0) {
      const newTripDrafts = [
        ...tripDrafts.filter((item) => item.frontCreated),
        ...newList,
      ];
      tripDraftsOutState = newTripDrafts;
      setTripDrafts(newTripDrafts);
      setCancelledRequestsCount(cancelledRequestsCount);
    }
  }, [draftsList?.data]);

  const onCityChanged = (city) => {
    cityRef.current = city
  }
  const handle_searchLocation = async ({ query }) => {
    const centerMap = mapRef.current?.getCenter()

    try {
      if (!query?.trim() || cityRef.current == null) return;

      const resMapSearch = await locationSearch(query, cityRef.current);
      const resSystemSearch = await searchSystemLocations(query);
      resSystemSearch.data.docs = resSystemSearch.data.docs.map((item) => {
        return {
          address: item.name,
          country: "",
          city: "",
          neighborhood: item.name,
          province: "",
          region: "",
          geom: {
            coordinates: item.lnglat.coordinates,
          },
        };
      });
      const result = [
        ...resSystemSearch.data.docs,
        ...(resMapSearch?.data?.value || []),
      ];
      setLocationsResult(result);
    } catch (e) {
      e?.response?.status != 404 && ErrorToast({ message: e.message });
    }
  };


  const handle_LocationSearchSelect = (item) => {
    return () => {
      mapRef.current.panTo(item.geom.coordinates.reverse())
      mapRef.current.setZoom(18)
      setLocationsResult([]);
    };
  };

  return (
    <div class="container-fluid" style={{ height }}>
      <LoadingOverlay visible={loading} />
      <div class="h-100 d-flex flex-column">
        <div className="row" ref={fixRef}>
          <Grid className="row mb-2">
            <Grid.Col span={1}>
              <SegmentedControl
                radius="md"
                size="xs"
                fullWidth
                value={view}
                onChange={setView}
                data={[
                  {
                    label: <HintTooltip target={<List />} hint="نمایش لیستی" />,
                    value: "list",
                  },
                  {
                    label: <HintTooltip target={<Map2 />} hint="نمایش نقشه" />,
                    value: "map",
                  },
                ]}
              />
            </Grid.Col>
            <Grid.Col span={2}>
              <SegmentedControl
                size="xs"
                radius="md"
                fullWidth
                value={layer}
                onChange={setLayer}
                data={[
                  {
                    label: (
                      <HintTooltip target={<MapPin />} hint="فقط درخواست ها" />
                    ),
                    value: "requests",
                  },
                  {
                    label: <HintTooltip target={<Car />} hint="فقط خودروها" />,
                    value: "drivers",
                  },
                  {
                    label: (
                      <HintTooltip
                        target={<MapPins />}
                        hint="خودرو و درخواست"
                      />
                    ),
                    value: "both",
                  },
                ]}
              />
            </Grid.Col>
            <Grid.Col span={2}>
              <div className="position-relative dropdown-search">
                <SearchBox placeholder="جستجوی نقشه" onSearch={handle_searchLocation} />
                <div style={{ zIndex: 10000 }} className="position-absolute w-100 dropdown-list">
                  {locationsResult.length > 0 && (
                    <ul className="d-block bg-white shadow-sm m-1 list-group">
                      {locationsResult.map((item, index) => {
                        if (index > DROP_DOWN_LIMIT) return;
                        return (
                          <li
                            key={index}
                            onClick={handle_LocationSearchSelect(item)}
                            onKeyDown={(e) =>
                              e.key === "Enter" &&
                              handle_LocationSearchSelect(item)
                            }
                            tabIndex={0}
                            className="list-group-item outline-none btn-outline-primary text-right "
                          >
                            {`${item.address}`}
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </div>
              </div>

            </Grid.Col>

            <Grid.Col span={1}>
              <Group>
                <FilterBox setOpenModal={setFilterModalOpen}>
                  {(layer === "requests" || layer === "both") && (
                    <RequestsfilterModal
                      opened={filterModalOpened}
                      setOpened={setFilterModalOpen}
                      onFilter={handleFilter}
                      applyStatusAndStep={false}
                    />
                  )}
                  {layer === "drivers" && (
                    <CarsFilterModal
                      opened={filterModalOpened}
                      setOpened={setFilterModalOpen}
                      onFilter={handleFilter}
                    />
                  )}
                </FilterBox>
              </Group>
            </Grid.Col>
            {mode == "dispatcher" && (
              <Grid.Col span={1}>
                <Group>
                  <Button color="violet" onClick={handleMaketripDraft}>
                    ایجاد سفر
                  </Button>
                </Group>
              </Grid.Col>
            )}
          </Grid>
        </div>
        <RestHeightContent>
          <div className="col-lg h-100">
            {view === "map" && (
              <>
                <CarsAndRequestsMap
                  cars={cars?.filter((item) => { return (!item.group || item.group == 0) })}
                  mode={mode}
                  layer={layer}
                  requests={requests}
                  showMode={showMode}
                  onChangeShowMode={handleChangeShowMode}
                  onRequestClick={handleSelectRequest}
                  onShowCarDetails={handleShowCarDetails}
                  onAddCarToTripDraft={handleAddCarToTripDraft}
                  onAddRequestToActiveTripDraft={handleAddToActiveTripDraft}
                  mapRef={mapRef}
                  onCityChanged={onCityChanged}
                />
              </>
            )}
            {view === "list" && (
              <div className="row">
                {layer === "requests" && (
                  <>
                    <RequestTable
                      mode={mode}
                      requests={requests}
                      showDetails={showDetails}
                      onRequestClick={handleSelectRequest}
                      onAddToActiveTripDraft={handleAddToActiveTripDraft}
                    />
                  </>
                )}
                {layer === "drivers" && (
                  <DriversTable
                    cars={cars?.filter((item) => { return (!item.group || item.group == 0) })}
                    onShowCarDetails={handleShowCarDetails}
                    onAddCarToTripDraft={handleAddCarToTripDraft}
                    onCarItemClick={handleOnCarItemClick}
                  />
                )}
              </div>
            )}
          </div>
          <div className="col-lg">
            {mode == "dispatcher" && (
              <>
                <div className="row">
                  <div
                    className="col-lg-4"
                    style={{
                      maxHeight: height - fixHeight,
                    }}
                  >
                    <AvailableDrivers
                      cars={cars}
                      height={height}
                      fixHeight={fixHeight}
                      handleAddCarToTripDraft={handleAddCarToTripDraft}
                    />
                  </div>
                  <div
                    className="col-lg-8"
                    style={{
                      maxHeight: height - fixHeight,
                    }}
                  >
                    <TripDrafts
                      cars={cars}
                      loading={loading}
                      tripDrafts={tripDrafts}
                      onSetTime={handleChangeRequestTime}
                      onForceSelectRequest={handleForceSelectRequest}
                      onDeleteTripDraft={handleDeleteTripDraft}
                      onActivateTripDraft={handleActivateTripDraft}
                      onRegisterTripDraft={handleRegisterTripDraft}
                      onAddCarToTripDraft={handleAddCarToTripDraft}
                      onDeletePassenger={handleRemoveFromActiveTrip}
                      onDeleteCarFromTripDraft={handleDeleteCarFromTripDraft}
                      taxiCost={taxiCost}
                      setTaxiCost={setTaxiCost}
                    />
                  </div>

                  <AvailableCarsModal
                    cars={availableCars}
                    opened={showAvailableCarsModal}
                    setOpened={setShowAvailableCarsModal}
                    onAddCarToTripDraft={handleAddCarToTripDraft}
                  />
                  <SureModal
                    title="تغییر راننده سفر"
                    opened={sureModal.opened}
                    setOpened={(result) => {
                      sureModal.opened = result;
                      setSureModal({ ...sureModal });
                    }}
                    onSure={() =>
                      handleChangeTripCar(sureModal.trip_id, sureModal.car_id)
                    }
                    loading={loading}
                    message="آیا از تغییر راننده سفر اطمینان دارید؟"
                  />
                </div>
              </>
            )}
            {mode != "dispatcher" && selectedRequest && (
              <RequestDetailsBox
                loading={loading}
                request={selectedRequest}
                onCheck={handleCheckRequest}
                iscancelReuestModalOpen={iscancelReuestModalOpen}
                setIscancelReuestModalOpen={setIscancelReuestModalOpen}
              />
            )}
          </div>
        </RestHeightContent>
      </div>
      <Modal
        opened={requestDetailModal}
        setOpened={setRequestDetailModal}
        size="xl"
        onClose={() => setRequestDetailModal(false)}
      >
        <RequestDetailsBox
          request={selectedRequest}
          onCheck={handleCheckRequest}
          loading={loading}
          setIscancelReuestModalOpen={setIscancelReuestModalOpen}
          iscancelReuestModalOpen={iscancelReuestModalOpen}
        />
      </Modal>

      {displayDetailsOnCar &&
        <Modal
          opened={displayDetailsOnCar != null}
          size="xl"
          onClose={() => setDisplayDetailsOnCar(null)}
        >
          <CarDetailedStatusPanel car={displayDetailsOnCar} />
        </Modal>
      }

    </div>
  );
}
export default Requests;

function CarDetailedStatusPanel({ car }) {
  const [loading, setLoading] = useState(false);
  const [map, setMap] = useState(null);
  const [displayData, setDisplayData] = useState({});

  const {
    data: resData,
    error,
    mutate,
  } = useSWR(
    settings.apiUrl + `/car/${car.driver_id}/detailed`,
    (url) => httpService.get(url),
    {
      revalidateOnFocus: false,
    }
  )

  useEffect(() => {
    const data = resData?.data?.doc;
    if (data == null) return data;
    // const locationInTripAvailable=data.latest_active_trip!=null && data.latest_active_trip.driver?.location?.length>0
    // const driverLocation = locationInTripAvailable ? data.latest_active_trip.driver.location:data.car.driver.location;
    const driverLocation = data?.driver?.location;
    let requestLocations = data.latest_active_trip?.locations || [];
    const newDisplayData = { ...displayData };

    newDisplayData.driverLocation = driverLocation;

    newDisplayData.requestLocations = requestLocations;

    newDisplayData.passengers = data.latest_active_trip?.passengers || [];

    newDisplayData.driver = data.driver;

    newDisplayData.latest_active_trip = data.latest_active_trip;

    const bounds = [];

    if (newDisplayData.driverLocation?.length > 0) {
      bounds.push(newDisplayData.driverLocation.reverse());
    }

    if (newDisplayData.requestLocations?.length > 0) {
      for (let i = 0; i < newDisplayData.requestLocations.length; i++) {
        const loc = newDisplayData.requestLocations[i];

        bounds.push(loc.start.lnglat.reverse());
        bounds.push(loc.finish.lnglat.reverse());
      }
    }

    if (bounds.length > 0) {
      map?.fitBounds(bounds, {
        maxZoom: 13,
        padding: [1.5, 1.5],
      });
      // map?.setZoom(13);
    }

    // setDisplayData(newDisplayData);

    async function fetchETA() {
      if (newDisplayData.requestLocations == null) return;
      const origin_lon = newDisplayData.driverLocation[0];
      const origin_lat = newDisplayData.driverLocation[1];
      for (let i = 0; i < newDisplayData.requestLocations.length; i++) {
        let dest_lon;
        let dest_lat;
        let label;
        if (newDisplayData.passengers[i].status >= 2) {
          dest_lon = newDisplayData.requestLocations[i].finish.lnglat[0];
          dest_lat = newDisplayData.requestLocations[i].finish.lnglat[1];
          label = "زمان تقریبی تا مقصد : ";
        } else {
          dest_lon = newDisplayData.requestLocations[i].start.lnglat[0];
          dest_lat = newDisplayData.requestLocations[i].start.lnglat[1];
          label = "زمان تقریبی تا مبدا : ";
        }
        const res = await getETA(origin_lon, origin_lat, dest_lon, dest_lat);

        if (newDisplayData.passengers[i] != null) {
          newDisplayData.passengers[i].eta_label = label;
          newDisplayData.passengers[i].eta = res.data.routes.duration;
        }
      }
      setDisplayData({ ...newDisplayData });
    }
    fetchETA();

  }, [resData]);

  useEffect(() => {
    const interval = setInterval(() => {
      mutate();
    }, 3 * 1000);

    return () => {
      clearInterval(interval);
    }
  }, [])

  return <LoadingContainer loading={loading}>
    <div>
      <div className="car-detail-div">
        <div className="detail-list">
          <div>
            <Text size="sm" className="m-2">{`راننده : ${displayData?.driver?.user?.full_name || ""} - ${displayData?.driver?.user?.phone_num || ""}`}</Text>
            {displayData.latest_active_trip != null ?
              <Text size="sm" className="m-2">{`وضعیت : ${getTripStatusString(displayData.latest_active_trip?.status)}`}</Text>
              :
              <Text size="sm" className="m-2">{`وضعیت : سفر فعالی وجود ندارد`}</Text>
            }

            <Divider size="xs" />
          </div>
          <div className="detail-scroll-list">
            {displayData.latest_active_trip &&
              <ScrollArea style={{ height: 250 }}>
                {displayData.latest_active_trip.passengers.map((passenger) => {
                  return <Card className="m-2 p-2" shadow="sm" p="lg">
                    <Text size="md">{`${passenger.full_name}`}</Text>
                    <Text size="xs">{`وضعیت : ${getRequestActiveStepString(passenger.status)}`}</Text>
                    <Text size="xs">{`${passenger.eta_label} ${humanReadableEta(passenger.eta)}`}</Text>
                  </Card>
                })}
              </ScrollArea>
            }
          </div>
        </div>
        <div className="detail-map">
          <MapContainer
            style={{
              zIndex: 1,
              borderRadius: "20px",
              height: "100%",
            }}
            zoom={12}
            center={car?.location?.[car?.location?.length] || settings.INITIAL_VIEW}
            whenCreated={(map) => {
              setMap(map);
            }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            />
            {displayData.driverLocation && displayData.driverLocation.length > 0 &&
              <Marker
                icon={carIcon("#228855")}
                position={[displayData.driverLocation[0], displayData.driverLocation[1]]}
              ></Marker>
            }
            {displayData.requestLocations && displayData.requestLocations.map((loc, index) => {
              let step = -1;
              if (displayData.passengers[index] != null) {
                step = displayData.passengers[index].status;
              }
              const marks = [];
              if (step < 2) {
                marks.push(<Marker
                  icon={startIcon}
                  position={[loc.start.lnglat[0], loc.start.lnglat[1]]}
                ></Marker>)
              }
              if (step < 4) {
                marks.push(<Marker
                  icon={finishIcon}
                  position={[loc.finish.lnglat[0], loc.finish.lnglat[1]]}
                ></Marker>)
              }

              return marks;
            })}
          </MapContainer>
        </div>
      </div>
    </div>
  </LoadingContainer>
}

function sortTripList(trips) {
  trips.sort((a, b) => {
    const aDateTime = (new Date(a.for_date)).getTime() + a.for_time;
    const bDateTime = (new Date(b.for_date)).getTime() + b.for_time;
    return -(bDateTime - aDateTime);
  })
  return trips;
}

function sortRequests(requestList) {
  requestList.sort((a, b) => {
    const aDateTime = (new Date(a.for_date)).getTime() + a.for_time;
    const bDateTime = (new Date(b.for_date)).getTime() + b.for_time;
    return -(bDateTime - aDateTime);
  })
  return requestList;
}

function humanReadableEta(seconds) {
  if (seconds == null) return "";

  if (seconds <= 60) return "کمتر از یک دقیقه";

  return parseInt(seconds / 60) + " دقیقه ";
}