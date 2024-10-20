
import axios from 'axios';
import moment from 'jalali-moment'
import { forEach } from 'lodash';

function convertPersianToEnglishDigits(inputString: any) {
  const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  const englishDigits = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

  // Use regular expression to replace each Persian digit with its English counterpart
  return inputString.replace(/[۰-۹]/g, (match: any) => {
    const persianIndex = persianDigits.indexOf(match);
    return englishDigits[persianIndex];
  });
}

function convertEnglishToPersianDigits(inputString: any) {
  const englishDigits = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
  const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];

  // Use regular expression to replace each English digit with its Persian counterpart
  return inputString.replace(/[0-9]/g, (match: any) => {
    const englishIndex = englishDigits.indexOf(match);
    return persianDigits[englishIndex];
  });
}


// Function to convert Persian date string to Gregorian Date object
function persianDateToGregorian(inputdate: any) {

  // const persianDate2 = '۱۴۰۳/۰۲/۲۳';
  // const englishDate = convertPersianToEnglishDigits(persianDate2);


  // const persianDate2 = '۱۴۰۳/۰۲/۲۳';
  // const englishDate = convertPersianToEnglishDigits(persianDate2);
  // console.log(8888,englishDate); // Output: 1403/02/23

  // inputdate = '1403/02/01'

  const persianDateString = moment(convertPersianToEnglishDigits(inputdate), 'jYYYY/jMM/jDD').format('YYYY/MM/DD');
  // console.log(3, inputdate, persianDateString);
  const persianDateParts = persianDateString.split('/');
  const persianYear = parseInt(persianDateParts[0]);
  const persianMonth = parseInt(persianDateParts[1]);
  const persianDay = parseInt(persianDateParts[2]);

  // Convert Persian date to Gregorian date
  const persianDate = new Date(persianYear, persianMonth - 1, persianDay);
  //  console.log(4000, persianDate.toLocaleDateString('en-US'));

  return persianDate.toLocaleDateString('en-US');

  // Create a Date object from the Gregorian date string
  // return new Date(persianDate.toLocaleDateString('en-US'));
}


const convertToJalali = (jalaliYear: any, jalaliMonth: any, jalaliDay: any) => {
  // Format the Jalali date into a string
  const jalaliDateStr = `${jalaliYear}/${jalaliMonth.toString().padStart(2, '0')}/${jalaliDay.toString().padStart(2, '0')}`;

  // Parse the Jalali date and convert it to a Gregorian date
  const gregorianDate = moment(jalaliDateStr, 'jYYYY/jMM/jDD').format('YYYY-MM-DDTHH:mm:ss.SSSZ');

  return gregorianDate;
};


const convertJalaliToGregorian = (jalaliDateStr: any) => {
  // Parse the Jalali date string and convert it to a Gregorian date
  const gregorianDate = moment(jalaliDateStr, 'jYYYY-jMM-jDDTHH:mm:ss.SSSZ').format('YYYY-MM-DDTHH:mm:ss.SSSZ');

  return gregorianDate;
};

// const persianDateString = "1403/02/30";
// const fromdate = persianDateToGregorian(persianDateString);




// const [copyItems, setCopyItems] = useState<any[]>([]);

export default function secondsToHMS(seconds: any) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  const formattedHours = String(hours).padStart(2, '0');
  const formattedMinutes = String(minutes).padStart(2, '0');
  const formattedSeconds = String(remainingSeconds).padStart(2, '0');

  return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
}

function convertToJalaliDateTiem(datetime: any) {
  // Convert to Persian (Jalali) date format
  console.log(632, datetime, moment(datetime).format('jYYYY/jMM/jDD HH:mm:ss'));

  return datetime ? moment(datetime).format('jYYYY/jMM/jDD HH:mm:ss') : undefined;
}



function translateAction(key: string) {

  switch (key) {
    case 'DRIVER':
      return 'راننده';
    case 'SERVICE':
      return 'سرویس';
    case 'LOCATION':
      return 'مکانی';
    case 'USERS':
      return 'کاربران';
    case 'VEHICLES':
      return 'خودروها';
    case 'AREAS':
      return 'ناحیه';
    case 'DEFINITIONS':
      return 'تعاریف';
    case 'REPORTS':
      return 'گزارش ها';
    case 'DASHBOARD':
      return 'داشبورد';
    case 'RESTRICTION':
      return 'محدودیت ها';
    case 'RULES':
      return 'قوانین سیستم';
    case 'DELEGATION':
      return 'تفویض اختیار';
    case 'AGANCE':
      return ' آژانس';
    case 'SODURE_PARVANE':
      return 'صدور پروانه ';
    case 'CART_SALAHIYAT':
      return 'کارت صلاحیت  ';
    case 'TAMDID_CART_SALAHIYAT':
      return 'تمدید کارت صلاحیت  ';
    case 'ESTELAMHAYE_SE_GANE':
      return 'استعلام های سه گانه ';
    case 'ESTELAM_AMAKEN':
      return 'استعلام اماکن ';
    case 'MOAYENE_FANI':
      return 'معاینه فنی ';
    case 'TAREFE_AVAREZ':
      return 'تعرفه عوارض ';
    case 'DABIRKHANE':
      return 'دبیرخانه ';
    case 'PERSONAL':
      return 'فردی';
    case 'ORG':
      return 'مدیریتی';
    case 'SUBMIT':
      return 'ثبت';
    case 'DIRECT_SUBMIT':
      return 'ثبت مستقیم';
    case 'DIRECT_EDIT':
      return 'ویرایش مستقیم';
    case 'DIRECT_CANCEL':
      return 'لغو مستقیم';
    case 'EDIT':
      return 'ویرایش';
    case 'CANCEL':
      return 'لغو';
    case 'REQUEST_APPROVAL':
      return 'تایید/رد درخواست';
    case 'DISPATCH':
      return 'توزیع';
    case 'GET':
      return 'مشاهده';
    case 'AREA_FULL':
      return 'دسترسی به سفر های کل سازمان';
    case 'AREA_LIMITED':
      return 'دسترسی به سفر های محدوده ی اختصاصی';
    case 'AGENCY_FULL':
      return 'دسترسی به سفر های کل آژانس ها';
    case 'AGENCY_LIMITED':
      return 'دسترسی به سفر های آژانس اختصاصی';
    case 'CREATE':
      return 'ایجاد';
    case 'DELETE':
      return 'حذف';
    case 'LIST':
      return 'لیست';
    case 'PROFILE':
      return 'پروفایل';
    case 'CAR_COLORS':
      return 'رنگ خودرو';
    case 'CAR_TYPES':
      return 'نوع خودرو';
    case 'CAR_NAME':
      return 'اسامی خودرو';
    case 'SERVICE_TYPES':
      return 'نوع سرویس';
    case 'STATS':
      return 'مشاهده ی آمار کل سازمان';
    case 'DRIVERS_AGENCIES':
      return 'رانندگان و آژانس ها';
    case 'SERVICE_COUNT':
      return 'دسترسی به تعداد سرویس های انجام شده توسط رانندگان در بازه زمانی مشخص';
    case 'DRIVERLIST_LASTMISSION_DISTANCE':
      return 'گزارش لیست رانندگان بر اساس آخرین زمان سرویس و مسافت';
    case 'DRIVER_BREAKS':
      return 'گزارش میزان استراحت هر راننده بین سرویس ها';
    case 'SERVICE_PERIODS':
      return 'گزارش مدت زمان هر سرویس';
    case 'TRIP_FEEDBACKS':
      return 'گزارش های مربوط به نظرهای ثبت شده در اپ مسافر و راننده';
    default:
      return key;
  }
}

const convertGregorianToJalali = (gregorianDateStr: any) => {
  // Parse the Gregorian date string and convert it to a Jalali date
  const jalaliDate = moment(gregorianDateStr).locale('fa').format('jYYYY/jMM/jDD');
  return jalaliDate;
};

const getDayName = (date: any) => {
  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  return daysOfWeek[date.getDay()];
};


const setStartOfDay = (date: any) => {
  // Set the time part of the "from" date to the start of the day (00:00:00)
  return date.setHours(0, 0, 0, 0);
}

const setEndOfDay = (date: any) => {
  // Set the time part of the "to" date to the end of the day (23:59:59)
  return date.setHours(23, 59, 59, 999);
}

export async function getBase64WithFileName(fileName: string) {
  console.log(7);

  if (fileName) {
    const url = import.meta.env.VITE_ENVIRONMENT_NAME === 'local'
      ? import.meta.env.VITE_BASE_URL
      : import.meta.env.VITE_BASE_URL_SERVER;

    // console.log(1000, fileName);


    //console.log(700, `${url}/uploads/${fileName}`);
    console.log(8);

    console.log(9, `${url}/uploads/${fileName}`);

    const response = await axios.get(`${url}/uploads/${fileName}`, {
      responseType: 'arraybuffer',
    });

    console.log(10, response);

    const base64String = btoa(
      new Uint8Array(response.data).reduce((data, byte) => data + String.fromCharCode(byte), '')
    );

    return `data:image/jpeg;base64,${base64String}`
  }
};

function CustomAllPermissions(raw_permissions: any) {

  const notAllowed = import.meta.env.VITE_NOT_ALLOWED_MENU ? JSON.parse(import.meta.env.VITE_NOT_ALLOWED_MENU) : []

  let result: any = {}
  Object.keys(raw_permissions).forEach((key: any) => {
    if (!notAllowed.includes(key)) {
      result[key] = raw_permissions[key];
    }
  });

  return result;
}

export {
  convertToJalaliDateTiem,
  secondsToHMS,
  persianDateToGregorian,
  convertPersianToEnglishDigits,
  convertEnglishToPersianDigits,
  translateAction,
  convertToJalali,
  convertJalaliToGregorian,
  convertGregorianToJalali,
  getDayName,
  setStartOfDay,
  setEndOfDay,
  CustomAllPermissions
}
