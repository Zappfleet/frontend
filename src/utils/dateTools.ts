import jalaliMoment from "jalali-moment";

/**
 * @param {Object} jalaliDate should contain year , month and day
 */
export function jalaliToIso(jalaliDate:any) {
  if (!jalaliDate) return;
  const d = [jalaliDate?.year, jalaliDate?.month, jalaliDate?.day];
  const greg = jalaliMoment.from(d?.join("/"), "fa", "YYYY/MM/DD");
  return greg?.format("YYYY-MM-DDT00:00:00.000") + "Z";
}

export function IsoToJalali(iso:any) {
  if (iso == null) return "";
  //2021-12-06T00:00:00.000Z
  const gregString = iso.substring(0, 10).split("-").join("/");
  return jalaliMoment(gregString, "YYYY/MM/DD")
    .locale("fa")
    .format("YYYY/MM/DD");
}

export function IsoToJalaliWithTime(iso:any) {
  if (!iso) return "ثبت نشده";
  //2021-12-06T00:00:00.000Z
  return jalaliMoment(iso)
    .locale("fa")
    .format("YYYY/MM/DD HH:mm");
}

export const numberToDate = (number:any) => {
  if (number == null) return "";
  let hour = Math.floor(number / 100);
  let min = number % 100;
  return new Date(new Date().setUTCHours(hour, min));
};

export const toModernDate = (date:any) => {
  const localDate = date.toLocaleDateString("fa-IR-u-nu-latn").split("/");
  return {
    year: parseInt(localDate[0]),
    month: parseInt(localDate[1]),
    day: parseInt(localDate[2]),
  };
};

export function timeToNumber(date:any) {
  const time = date?.toLocaleTimeString("fa-IR-u-nu-latn")?.split(":");
  if (time) return parseInt(time[0] + time[1]);
  else return;
}

export function timeToString(time:any) {
  if (time == null) return "";
  const [hour , min] = timeToHourMinute(time);
  return `${hour}:${min}`;
}

export function timeToHourMinute(time:any) {
  if (time == null) return [0 , 0];
  let hour:any = Math.floor(time / 100);
  let min:any = time % 100;
  hour = hour < 10 ? "0" + hour : hour;
  min = min < 10 ? "0" + min : min;
  return [hour , min];
}

function numFormat(number:any) {
  number = parseInt(number);
  if (number <= 9) return "0" + number;
  return number;
}


//2021-12-06T00:00:00.000Z
