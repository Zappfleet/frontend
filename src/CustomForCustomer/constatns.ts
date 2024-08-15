import { PERMIT_DASHBOARD } from "../lib/constants"

let loginTitle = 'ورود به حساب کاربری'
if (import.meta.env.VITE_CUSTOMER_NAME === 'zarghan') {
  loginTitle = `سامانه جامع ثبت الکترونیک اطلاعات رانندگان درون شهری`
  loginTitle += `\n`
  loginTitle += `سازمان مدیریت حمل و نقل شهرداری زرقان`
  loginTitle += `\n`
  loginTitle += `(رانندگان حوزه بار و مسافر)`
}


let latitude = 29.882589
let longitude = 52.808064
if (import.meta.env.VITE_CUSTOMER_NAME === 'irisa') {
  latitude = 32.622178
  longitude = 51.665806
}



export const LOGIN_TITLE = loginTitle
export const DEFAULT_LATITUDE = latitude
export const DEFAULT_LONGITUDE = longitude