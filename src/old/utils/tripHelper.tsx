type TripStatusType = {
  crtBDs: number;
  hsCr: number;
  cncBDr: number; // cancel by driver
  cncBPs: number; // cancel by passenger
  cnBDs: number; // cancel by dispatcher
  cnBMn: number; // cancel by manager or admin
  strtd: number;
  fnshd: number;
};

const tripStatus: TripStatusType = {
  crtBDs: 0,
  hsCr: 1,
  cncBDr: 2, // cancel by driver
  cncBPs: 3, // cancel by passenger
  cnBDs: 4, // cancel by dispatcher
  cnBMn: 5, // cancel by manager or admin
  strtd: 6,
  fnshd: 7,
};

interface Item {
  total: number;
  _id: number;
}

const buildTripUrl = (item: Item): string => {
  return `/trip?ignoreMadeByDispatcher=true&limit=${item.total}&status[]=${item._id}`;
};

export const getTripStatisticConstants = (item: Item): string => {
  return buildTripUrl(item);
};

export const getTripStatusString = (status: number): string => {
  switch (status) {
    case 7:
      return "پایان یافته";
    case 6:
      return "شروع شده";
    case 5:
      return "لغو شده - مدیر";
    case 4:
      return "لغو شده - توزیع کننده";
    case 3:
      return "لغو شده - مسافر";
    case 2:
      return "لغو شده - راننده";
    case 1:
      return "در انتظار شروع";
    default:
      return "پیش نویس";
  }
};

export const tripStatusList = [
  { value: "0", label: "پیش نویس" },
  { value: "1", label: "در انتظار شروع" },
  { value: "2", label: "لغو شده - راننده" },
  { value: "3", label: "لغو شده - مسافر" },
  { value: "4", label: "لغو شده - توزیع کننده" },
  { value: "5", label: "لغو شده - مدیر" },
  { value: "6", label: "شروع شده" },
  { value: "7", label: "پایان یافته" },
];

export const tripCreationType = [
  { value: "all", label: "همه" },
  { value: "true", label: "ایجاد توسط دیسپاچر" },
  { value: "false", label: "درخواستی مسافر" },
];

export const getTripIntervalString = (interval: number): string => {
  if (interval >= 3600) {
    const hours = Math.floor(interval / 3600);
    const minutes = Math.floor((interval % 3600) / 60);
    return `${hours} ساعت و ${minutes} دقیقه`;
  }
  const minutes = Math.floor(interval / 60);
  return `${minutes} دقیقه`;
};

export const getTripDistanceString = (distance: number): string => {
  if (distance >= 1000) {
    const km = Math.floor(distance / 1000);
    const meter = distance % 1000;
    let output = `${km} کیلومتر `;
    if (meter > 0) output += `و ${meter} متر`;
    return output;
  }
  const meter = Math.floor(distance);
  return meter !== 0 ? `${meter} متر` : "";
};
