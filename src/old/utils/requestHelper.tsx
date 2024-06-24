export const getRequestStepString = (step:any) => {
  switch (step) {
    case 4:
      return " سفر";
    case 3:
      return "در پیش نویس سفر";
    case 2:
      return "پنل توزیع کننده";
    case 1:
      return "پنل توزیع کننده";
    default:
      return "پنل مدیرپروژه";
  }
};

export const getRequestActiveStepString = (step:any) => {
  switch (step) {
    case 4:
      return "مسافر پیاده شد";
    case 3:
      return "راننده به مقصد رسید";
    case 2:
      return "مسافر سوار شد";
    case 1:
      return "راننده به مبدا رسید";
    default:
      return "در انتظار راننده";
  }
};

export const stepList = [
  { value: "0", label: "پنل مدیرپروژه" },
  { value: "1", label: "پنل توزیع کننده" },
  { value: "2", label: "پنل توزیع کننده" },
  { value: "3", label: "در پیش نویس سفر" },
  { value: "4", label: "سفر" },
];

// crtBPs: 0,
// cncBPS: 1,
// snBMn: 2,
// rjBMn: 3,
// acBMn: 4,
// snBDs: 5,
// rjBDs: 6,
// inTDr: 7, //in trip draft list
// plITr: 8, //placed in trip

const buildRequestUrl = (status:any) => {
  return `/request?step[]=0&step[]=1&step[]=2&step[]=3&step[]=4&status[]=${status}`
}


export const getRequestStatisticConstants = (status:any, role:any) => {
  switch (status) {
    case 8:
    case 5:
    case 4:
      if (role == "dispatcher" || role == "superDispatcher") {
        return `nav:/panel/requests/${role}`;
      } else {
        return buildRequestUrl(status);
      }
    case 0:
      return `nav:/panel/requests/${role}`;
    default:
      return buildRequestUrl(status);
  }
};

export const getRequestStatusString = (status:any) => {
  switch (status) {
    case 9:
      return "انجام شده";
    case 8:
      return "در سفر";
    case 7:
      return "در پیش نویس سفر";
    case 6:
      return "رد شده - توزیع کننده";
    case 5:
      return "دیده شده- توزیع کننده";
    case 4:
      return "تایید شده - مدیر پروژه";
    case 3:
      return "رد شده - مدیرپروژه";
    case 2:
      return "دیده شده - مدیرپروژه";
    case 1:
      return "لغو شده";
    case 0:
      return "ثبت شده";
  }
};
export const statusList = [
  { value: "0", label: "ثبت شده" },
  { value: "1", label: "لغو شده" },
  { value: "2", label: "دیده شده - مدیرپروژه" },
  { value: "3", label: "رد شده - مدیرپروژه" },
  { value: "4", label: "تایید شده - مدیر پروژه" },
  { value: "5", label: "دیده شده- توزیع کننده" },
  { value: "6", label: "رد شده - توزیع کننده" },
  { value: "7", label: "در پیش نویس سفر" },
  { value: "8", label: "در سفر" },
  { value: "9", label: "انجام شده" },
];

export const getRequestCostManagerString = (cost_manager:any) => {
  if (cost_manager?.proj_code)
    return `${cost_manager?.proj_code}\n(کدپروژه)`;
  if (cost_manager?.proj_desc)
    return `${cost_manager?.proj_desc}\n(توضیحات پروژه)`;
  if (cost_manager?.cost_center)
    return `${cost_manager?.cost_center}( کد مرکز هزینه)`;
  if (cost_manager?.manager_emp_num)
    return `${cost_manager?.manager_emp_num}\n(کد پرسنلی مدیر پروژه)`;
}