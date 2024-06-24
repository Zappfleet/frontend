import {
  Box,
  Button,
  Card,
  Checkbox,
  CloseButton,
  Divider,
  Input,
  NumberInput,
  Text,
  Modal,
  List,
  ThemeIcon
} from "@mantine/core";
import Joi from "joi";
import DatePicker from "@amir04lm26/react-modern-calendar-date-picker";
import {
  jalaliToIso,
  timeToHourMinute,
  timeToString,
  toModernDate,
} from "../../../../utils/dateTools";
import { CalendarTime, Car, CircleCheck, CircleX, ListNumbers } from "tabler-icons-react";
import { searchUsers } from "../../../../services/userService";
import { TimeInput } from "@mantine/dates";
import useSWR from "swr";
import httpService from "../../../../services/httpService";
import settings from "../../../../config";
import {
  ErrorToast,
  SucccessToast,
} from "../../../../components/common/errorToast";
import {
  postTripByDispatcher,
  putTripByDispatcher,
} from "../../../../services/tripListService";
import { useNavigate } from "react-router";
import CustomSearchBox from "../../../../components/common/filter&search/customeSearchBox";
import { useEffect, useState } from "react";
import { useRef } from "react";
import LoadingContainer from "../../../../components/hoc/loadingContainer";
import MomentUtils from '@date-io/moment'; // choose your lib
import {
  TimePicker,
  MuiPickersUtilsProvider,
} from '@material-ui/pickers';
import moment from "moment"
const PASSENGER_GUEST = "guests";
const PASSENGER_MATES = "mates";

const schema = Joi.object().keys({
  taxi_cost: Joi.number().integer().optional().messages({
    "any.required": `ورود مبلغ کرایه الزامیست`,
  }),
  distance_override: Joi.number().optional().messages({
    "number.base": "فیلد مسافت باید عدد باشد",
    "string.empty": `مسافت نمیتواند خالی باشد`,
  }),
  for_time: Joi.string().required().messages({
    "string.empty": `ثبت ساعت سفر الزامیست`,
    "any.required": `ثبت ساعت سفر الزامیست`,
  }),
  for_date: Joi.string().required().messages({
    "string.empty": ` تاریخ سفر را وارد کنید`,
    "any.required": ` ثبت تاریخ سفر الزامی است`,
  }),
  car_id: Joi.required().messages({
    "any.required": `انتخاب خودرو الزامیست`,
  }),
  locations: Joi.object().required().messages({
    "object.required": `انتخاب نقطه ی مبدا و مقصد الزامیست`,
    "object.base": `انتخاب نقطه ی مبدا و مقصد الزامیست`,
    "any.required": `انتخاب نقطه ی مبدا و مقصد الزامیست`,
  }),
  passengers: Joi.array().items(
    Joi.object({
      guests: Joi.array().required().messages({
        "array.required": `a`,
        "array.base": `b`,
      }),
      mates: Joi.array().required(),
      account_id: Joi.string(),
    })
  ),
});

const arrayToPassengers = (array) => {
  if (!array) return {};
  const output = {};
  for (let i = 0; i < array.length; i++) {
    output[i] = array[i];
  }
  return output;
};
function Chips({ primary, isText, item, valueName, handle_remove }) {
  const render = (text) => {
    return (
      <span className={`chips ${primary ? "bg-primary" : "bg-secondary"}`}>
        <span
          className="chips-close"
          onClick={() => handle_remove(isText, item)}
        >
          ✖
        </span>
        <label className="text-white">{text}</label>
      </span>
    );
  };

  if (isText) return render(item);

  return render(item[valueName]);
}

function ErrorText({ text }) {
  if (!text) return "";
  return <label className="mt-3 text-danger btn-sm">{text}</label>;
}

function RenderTab({ defaultData, onDataUpdate }) {
  const getDefaultPassenger = (d) => {
    if (!d) return undefined;
    const clone = { ...d };
    delete clone.mates;
    delete clone.guests;
    return Object.keys(clone).length > 2 ? clone : undefined;
  };

  const [companions, setCompanions] = useState({
    mates: defaultData?.mates || [],
    guests: defaultData?.guests || [],
  });

  const [passenger, setPassenger] = useState(getDefaultPassenger(defaultData));

  const [queryUsers, setQueryUsers] = useState({ query: "", result: [] });

  const [didmomunt, setDidmount] = useState(false);


  useEffect(() => {
    setDidmount(true);
  }, []);

  const handle_userSearch = async ({ query }) => {
    if (!query?.trim()) return;

    try {
      const res = await searchUsers(query.trim());
      const result = res.data.docs;
      setQueryUsers({ query, result });
    } catch (e) { }
  };

  const handle_remove = (isGuest, user) => {
    const key = isGuest ? PASSENGER_GUEST : PASSENGER_MATES;
    companions[key] = companions[key].filter((item) => {
      if (isGuest) {
        return item != user;
      } else {
        return item._id != user._id;
      }
    });
    setCompanions({ ...companions });
  };

  const handle_userSelect = (user, isGuest) => {
    return () => {
      const key = isGuest ? PASSENGER_GUEST : PASSENGER_MATES;
      var index = companions[key].findIndex((x) =>
        isGuest ? x == user : x._id == user._id
      );
      index === -1 && companions[key].push(user);
      setCompanions({ ...companions });
      setQueryUsers({ query: "", result: [] });
    };
  };

  const handle_passengerSelect = (user) => {
    return () => {
      setPassenger(user);
      setQueryUsers({ query: "", result: [] });
    };
  };

  useEffect(() => {
    if (!didmomunt) return;
    const data = {
      ...companions,
      account_id: passenger?._id,
    };
    onDataUpdate(data);
  }, [companions, passenger, didmomunt]);

  return (
    <div>
      <Divider
        my="xs"
        className="mb-2"
        labelPosition="center"
        label={
          <>
            <ListNumbers size={12} />
            <Box ml={10}>مسافر</Box>
          </>
        }
      />
      <CustomSearchBox
        onSearch={handle_userSearch}
        onSelect={handle_passengerSelect}
        resultList={queryUsers}
        resultsOnly={true}
        renderItem={(item) => item.full_name}
      />
      <div>
        {passenger && (
          <Chips
            primary
            isText={false}
            valueName="full_name"
            item={passenger}
            handle_remove={() => setPassenger(null)}
          />
        )}
      </div>

      <Divider
        my="xs"
        className="mb-2"
        labelPosition="center"
        label={
          <>
            <ListNumbers size={12} />
            <Box ml={10}>همراهان</Box>
          </>
        }
      />
      <CustomSearchBox
        onSearch={handle_userSearch}
        onSelect={handle_userSelect}
        resultList={queryUsers}
        resultsOnly={false}
        renderItem={(item) => item.full_name}
      />
      <Card>
        <label>کارکنان : </label>
        <span>
          {companions.mates.map((user) => {
            return (
              <Chips
                isText={false}
                item={user}
                valueName="full_name"
                handle_remove={handle_remove}
              />
            );
          })}
        </span>
        <Divider my="xs" className="mb-2" />
        <label>مهمان : </label>
        <span>
          {companions.guests.map((user) => {
            return (
              <Chips
                isText={true}
                item={user}
                valueName="full_name"
                handle_remove={handle_remove}
              />
            );
          })}
        </span>
      </Card>
    </div>
  );
}

function FullRenderTabs({ children, visibleIndex }) {
  return children?.map((child, index) => (
    <div style={{ display: index != visibleIndex ? "none" : "block" }}>
      {child}
    </div>
  ));
}

function reformatPassengers(passengers) {
  if (!passengers) return null;
  return passengers.map((item) => {
    item._id = item.account_id;
    item.id = item.account_id;
    item.mates = item.mates.map((m) => {
      m._id = m.account_id;
      return m;
    });
    return item;
  });
}

export default function RegisterTripForm({
  defaultTrip,
  selectedCoordinates,
  mutateSignal,
  clearMap,
  driverCar,
}) {
  const defaultDate =
    defaultTrip != null ? new Date(defaultTrip.for_date) : new Date();
  const time = new Date();
  if (defaultTrip) {
    const [h, m] = timeToHourMinute(defaultTrip.for_time);
    time.setHours(h);
    time.setMinutes(m);
  }
  const defaultTime = time;
  const defaultCar = defaultTrip && {
    ...defaultTrip.car,
    _id: defaultTrip.car?.car_id,
    driver: defaultTrip.driver,
  };

  const [date, setDate] = useState(toModernDate(defaultDate));

  const [passengers, setPassengers] = useState(
    arrayToPassengers(reformatPassengers(defaultTrip?.passengers))
  );

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({});

  const [error, setError] = useState(null);

  const [car, setCar] = useState(defaultCar);

  const [visibleTab, setVisibleTab] = useState(0);

  const [automaticDistance, setAutomaticDistance] = useState(true)

  const [selectedTime, handleTimeChange] = useState(!defaultTrip && new Date());


  const { data: cars, error: carsError } = useSWR(
    settings.apiUrl + `/car`,
    (url) => httpService.get(url),
    {
      revalidateOnFocus: false,
    }
  );


  const passengersToArray = () => {
    const keys = Object.keys(passengers);
    const arrayPassengers = [];
    for (let i = 0; i < keys.length; i++) {
      arrayPassengers.push(passengers[keys[i]]);
    }
    return arrayPassengers;
  };

  const fixMates = (passengerArray) => {
    return passengerArray.map((item) => {
      item.mates = item.mates.map((m) => {
        return m._id;
      });
      return item;
    });
  };
  const handleClearList = () => {
    setPassengers({});

    delete formData?.taxi_cost;
    setFormData({ ...formData });

    setCar(null);
    setAutomaticDistance(true);
    setVisibleTab(0);
    setDate(toModernDate(new Date()));
    clearMap();
  };

  const handle_submit = () => {

    const passengerArray = fixMates(passengersToArray());

    const totalPassenger = passengerArray.reduce((total, item) => {
      total++;
      total += item.mates.length;
      total += item.guests.length;
      return total;
    }, 0);

    if (totalPassenger > 4) {
      ErrorToast({ message: "جمع کل سرنشین ها نمیتواند بیشتر از 4 نفر باشد." });
      return;
    }
    const startLoc = selectedCoordinates?.location_start;
    const finishLoc = selectedCoordinates?.location_finish;
    const datesAreSet = startLoc && finishLoc;
    const body = {
      for_time: formData?.for_time || timeToString(defaultTrip?.for_time) ||moment(selectedTime).format("HH:mm"),
      for_date: jalaliToIso(date)?.split("T")?.[0],
      car_id: driverCar?._id || defaultCar?._id,
      passengers: passengerArray,
      locations: datesAreSet && {
        start: {
          adr: `${startLoc.province} ${startLoc.city} ${startLoc.neighborhood}`,
          lnglat: startLoc.geom.coordinates,
        },
        finish: {
          adr: `${finishLoc.province} ${finishLoc.city} ${finishLoc.neighborhood}`,
          lnglat: finishLoc.geom.coordinates,
        },
      },
    };
    if (automaticDistance == false) {
      body.distance_override = formData.distance_override || "";
    }
    if (formData.taxi_cost) {
      body.taxi_cost = parseInt(formData.taxi_cost)
    }
    const result = schema.validate(body, {
      abortEarly: false,
      allowUnknown: true,
    });
    setError(result.error?.message);
    if (!result.error) {
      const chooseApi = defaultTrip == null ? postTripByDispatcher : putTripByDispatcher;
      const params = [];
      if (defaultTrip != null) {
        params.push(defaultTrip._id);
      }
      params.push(body);

      setLoading(true);
      chooseApi(...params)
        .then((res) => {
          setLoading(false);
          if (defaultTrip != null) {
            mutateSignal();
          } else {
            handleClearList()
          };

          SucccessToast({
            message: defaultTrip
              ? "ویرایش با موفقیت انجام شد."
              : "سفر با موفقیت ثبت شد.",
          });
        })
        .catch((e) => {
          setLoading(false);
          ErrorToast({ message: e?.response?.data?.info || e.message });
        });
    }
  };

  const handle_formInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const renderDateRangeValue = () => {
    const fromDateString =
      (date?.year || "-") +
      "/" +
      (date?.month || "-") +
      "/" +
      (date?.day || "-");
    return fromDateString;
  };

  const updatePassengers = (id, data) => {
    passengers[id] = data;
    setPassengers({ ...passengers });
  };

  const removePassengerData = (index) => {
    delete passengers[index];
    setPassengers({ ...passengers });
  };

  const renderButton = (index, title, isLast) => {
    return (
      <span
        style={{ cursor: "pointer", padding: "0.2rem 0.4rem" }}
        className={`m-1 d-flex align-items-center cursor-pointer rounded border  ${index == visibleTab ? "border-primary" : "border-light"
          }`}
      >
        {isLast && <CloseButton onClick={() => removePassengerData(index)} />}
        <Text onClick={() => setVisibleTab(index)} size="sm">
          {title}
        </Text>
      </span>
    );
  };

  const renderAdd = () => {
    if (passengersToArray().length >= 4) return;
    return (
      <Button
        onClick={() => {
          passengers[Object.keys(passengers).length] = {};
          setPassengers({ ...passengers });
        }}
      >
        افزودن مسافر
      </Button>
    );
  };

  const handle_numberInputChange = (name) => {
    return (value) => {
      handle_formInputChange({ target: { name, value:value * 1000 } })
    }
  }

  const handle_distanceOverrideCheck = (e) => {
    setAutomaticDistance(e.target.checked);
  }

  const textFor = (index) => {
    switch (index) {
      case 0:
        return "مسافر اول";
      case 1:
        return "مسافر دوم";
      case 2:
        return "مسافر سوم";
      case 3:
        return "مسافر چهارم";
    }
  };


  return (
    <LoadingContainer loading={loading}>
      <Box
        className="shadow-sm w-100 p-2 p-md-5"
        aria-disabled="true"
        sx={(theme) => ({
          backgroundColor: theme.colors.gray[1],
          padding: theme.spacing.xl,
          marginBottom: theme.spacing.md,
          borderRadius: theme.radius.md,
          transition: "0.2s",
        })}
      >
        <div className="d-flex align-items-center">
          {passengersToArray().map((item, index) => {
            return renderButton(
              index,
              textFor(index),
              index == Object.keys(passengers).length - 1
            );
          })}
          {renderAdd()}
        </div>
        <FullRenderTabs visibleIndex={visibleTab}>
          {passengersToArray().map((item, index) => {
            return (
              <RenderTab
                defaultData={item}
                onDataUpdate={(data) => {
                  updatePassengers(index, data);
                }}
              />
            );
          })}
        </FullRenderTabs>

        <Divider my="xs" className="mb-2" />

        <Divider
          my="xs"
          className="mb-2"
          labelPosition="center"
          label={
            <>
              <ListNumbers size={12} />
              <Box ml={10}>ساعت سفر</Box>
            </>
          }
        />
      
        <MuiPickersUtilsProvider  utils={MomentUtils}>
         <TimePicker 
         cancelLabel="لغو"
         okLabel="تایید"
         value={selectedTime?selectedTime:defaultTrip ? moment(defaultTime):new Date()} 
         onChange={(value)=>{
           const time = moment(value).format("HH:mm")
           handleTimeChange(value)
           handle_formInputChange({
            target: {
              name: "for_time",
              value: time,
            },
          });
         }}   
          
            />
       </MuiPickersUtilsProvider>

        <Divider
          my="xs"
          className="mb-2"
          labelPosition="center"
          label={
            <>
              <CalendarTime size={12} />
              <Box ml={10}>تاریخ سفر</Box>
            </>
          }
        />
        <div className="position-relative">
          <DatePicker
            value={date}
            onChange={setDate}
            shouldHighlightWeekends
            locale="fa"
            renderInput={({ ref }) => (
              <Input
                ref={ref}
                value={renderDateRangeValue()}
                readOnly
                name="for_date"
                placeholder=" محدوده تاریخ شروع درخواست سفر "
              />
            )}
          />
        </div>
        <Divider
          my="xs"
          className="mb-2"
          labelPosition="center"
          label={
            <>
              <ListNumbers size={12} />
              <Box ml={10}>خودرو</Box>
            </>
          }
        />
        <span>
          راننده :{driverCar ? driverCar?.label : car?.driver?.user?.full_name}
          {(!driverCar?.group || driverCar?.group == 0) ? "" :
            <Input
              name="taxi_cost"
              className="mt-3"
              type={"number"}
              defaultValue={defaultTrip?.taxi_cost}
              enabled={defaultTrip?.taxi_cost != null}
              placeholder="مبلغ را (به ریال) وارد کنید"
              onChange={handle_formInputChange}
            />
          }
        </span>

        <Divider
          my="xs"
          className="mb-2"
          labelPosition="center"
          label={
            <>
              <Car size={12} />
              <Box ml={10}>مسافت</Box>
            </>
          }
        />
        <Checkbox label="مسافت خودکار محاسبه گردد." checked={automaticDistance} onChange={handle_distanceOverrideCheck} />
        <NumberInput
          className={`mt-3 ${automaticDistance == false ? "d-block" : "d-none"}`}
          placeholder="مسافت را (به کیلومتر) وارد کنید."
          hideControls
          precision={3}
          onChange={handle_numberInputChange("distance_override")}
        />

        <Button
          color="violet"
          radius="md"
          size="md"
          fullWidth
          type="submit"
          onClick={handle_submit}
          className="btn btn-primary  mt-3"
        >
          {"ثبت سفر"}
        </Button>
        <Modal title="خطا در ثبت سفر" opened={error != null} onClose={() => { setError(null) }}>
          {convertErrorToList(error)}
        </Modal>
      </Box>
    </LoadingContainer>
  );
}

function convertErrorToList(error) {
  if (error == null) return "";
  const errorList = error.split(".");

  return <List
    spacing="xs"
    size="sm"
    center
    icon={
      <ThemeIcon color="red" size={24} radius="xl">
        <CircleX size={16} />
      </ThemeIcon>
    }
  >
    {errorList.map((e) => {
      return <List.Item>{e}</List.Item>
    })}
  </List>
}
