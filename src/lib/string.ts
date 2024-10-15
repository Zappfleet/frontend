import Num2persian from 'num2persian';
import jalaliMoment from "jalali-moment";

export const MSG_REQUIRED_FIELD = "این فیلد الزامی است";
export const MSG_MIN_LENGTH = "حداقل 6 کاراکتر وارد کنید";
export const MSG_PICK_ATLEAST_ONE = "دست کم یک مورد انتخاب شود";
export const MSG_FILL_CHILDREN = "تمام فیلد ها الزامی است";

export const MSG_OPERATION_WAS_SUCCESSFUL = "عملیات با موفقیت انجام شد"

export const TEXT_DATE_TIME = "تاریخ و ساعت";
export const TEXT_CREATED_BY = "مسافر";
export const TEXT_CONFIRMED_BY = "تایید توسط";
export const TEXT_STATUS = "وضعیت";
export const TEXT_DESC = "توضیحات";
export const TEXT_DRIVER = "راننده";
export const TEXT_DETAILS = "نمایش جزئیات";
export const TEXT_DISPATCH_BY = "توزیع توسط";

export const TEXT_PROJECT = "پروژه";
export const TEXT_COST_CENTER = "مرکز هزینه";
export const TEXT_LOCATIONS = "ایستگاه";

export const serviceUnits = [
    ["person", "نفر"],
    ["count", "تعداد"],
    ["kg", "کیلوگرم"],
]

export const requestStatus = [
    ["DONE","انجام شده"],
    ["ON_ROUTE","در مسیر "],
    ["PENDING", "در انتظار"],
    ["CANCEL_USER", "لغو کاربر"],
    ["REJECT", "رد شده"],
    ["CONFIRM", "تایید شده"],
    ["SEEN", "دیده شده"],
    ["ASSIGNED_TO_MISSION", "اختصاص یافته"],
]

export const STATUS_PENDING = "PENDING";
export const STATUS_ON_ROUTE = "ON_ROUTE";
export const STATUS_DRAFT = "DRAFT";
export const STATUS_PUBLISHED = "PUBLISHED";
export const STATUS_READY = "READY";
export const STATUS_DONE = "DONE";

export const missionStatus = [
    ["DRAFT", "پیش نویس"],
    ["PUBLISHED", "منتشر"],
    ["READY", "آماده حرکت"],
    ["ON_ROUTE", "در مسیر"],
    ["DONE", "پایان یافته"],
]

export const userStatusEntries = [
    ["PENDING", "در انتظار"],
    ["ACTIVE", "فعال"],
    ["INACTIVE", "غیر فعال"],
    ["SUSPENDED", "مسدود"],
]

export const carStatusEntries = [
    ["IDLE", "در انتظار"],
    ["ON_MISSION", "در سفر"],
    ["INACTIVE", "غیر فعال"],
]

export function textIsNumeric(text: string) {
    if (!text) return false;
    return /^-?\d+$/.test(text);
}

const plaqueSeparator = ",";

export function convertPlaqueToString(plaque: any) {
    return [plaque.twoDigit, plaque.threeDigit, plaque.character, plaque.serial].join(plaqueSeparator)
}

export function convertStringToPlaque(plaqueString: any) {
    const splited = plaqueString.split(plaqueSeparator);

   // console.log(45, splited[0], splited[1], splited[1] !== 'undefined' ? splited[1] : '');

    return {
        twoDigit: splited[0] !== 'undefined' ? splited[0] : '',
        threeDigit: splited[1] !== 'undefined' ? splited[1] : '',
        character: splited[2],
        serial: splited[3] !== 'undefined' ? splited[3] : ''
    };
}

export function convertStringToPlaqueForAgance(plaqueString: any) {
    const splited = plaqueString.split(plaqueSeparator);

    //console.log(45, splited);

    return {
        twoDigit: splited[0],
        threeDigit: splited[1],
        character: splited[3],
        serial: splited[2]
    };
}

export const plaqueLevels = [
    { value: 'الف' },
    { value: 'ب' },
    { value: 'ت' },
    { value: 'ث' },
    { value: 'ج' },
    { value: 'د' },
    { value: 'س' },
    { value: 'ش' },
    { value: 'ص' },
    { value: 'ض' },
    { value: 'ط' },
    { value: 'ظ' },
    { value: 'ع' },
    { value: 'غ' },
    { value: 'ف' },
    { value: 'ق' },
    { value: 'ل' },
    { value: 'م' },
    { value: 'ن' },
    { value: 'و' },
    { value: 'ک' },
    { value: 'گ' },
    { value: 'ھ' },
    { value: 'ی' },
];

export const translateDetailKey = (key: string) => {
    switch (key) {
        case "nat_num": return "کد ملی";
        case "personel_code": return "کد پرسنلی";
        case "NAM_EMPL": return "نام";
        case "NAM_SNAM_EMPL": return "نام خانوادگی";
        case "proj_code": return "پروژه";
        case "cost_center": return "مرکز هزینه";
    }
    return key;
}

export const networkErrorString = (e: any) => {
    return e.response?.data?.error || e.message || "خطای نامشخص";
}

export function findText(key: any, source: any) {
    if (!source) return ""
    return source.find((item: any) => { return item.key == key })?.title || key
}

export function getLocalDatetime(datetime: string | Date) {
    const m = jalaliMoment(datetime);
    m.locale('fa');
    return m.format('DD MMMM YYYY HH:mm');
}


export function getLocationIndexTitle(total: number, index: number) {
    switch (index) {
        case 0: return "اول";
        case 1: return "دوم";
        case 2: return "سوم";
        case 3: return "چهارم";
        case 4: return "پنجم";
        case 5: return "ششم";
        case 6: return "هفتم";
        case 7: return "هشتم";
        case 8: return "نهم";
    }

    // switch (index) {
    //     case 0: return "اول";
    //     case 1: return "دوم";
    //     case 2: return "سوم";
    //     case 3: return "اول";
    //     case 4: return "دوم";
    //     case 5: return "سوم";
    //     case 0: return "اول";
    //     case 1: return "دوم";
    //     case 2: return "سوم";
    //      default:
    //          return `${Num2persian(index)}`
    // }
}

export function joinStatus(list: any) {
    return list.join(",")
}


