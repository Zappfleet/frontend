import UserThree from '../../../images/user/user-03.png';
import './style.scss'
import IranFlag from '../../../images/country/ir.png';
import TitledSparator from '../../../components/TitledSparator';
import { BiMessage, BiPhone } from 'react-icons/bi';
import { convertStringToPlaque, getLocalDatetime, missionStatus } from '../../../lib/string';
import PlaqueInput from '../../Form/PlaqueInput';
import ErrorBoundary from '../../../components/ErrorBoundary/ErrorBoundary';

const TripMissionDetails = ({ mission }: any) => {
    console.log(88, mission);


    const showDialPage = (phoneNumber: any) => {
        // const phoneNumber = '+1234567890'; // Replace with your desired phone number
        window.location.href = `tel:${phoneNumber}`;
    }

    return <>
        {mission && <div className='TripMissionDetails-component'>
            <div className='flex justify-between'>
                <div className='flex'>
                    <div className="relative h-12 w-12 rounded-full">
                        <img src={UserThree} alt="User" />
                    </div>
                    <div className='flex flex-col px-2'>
                        <label>
                            {mission?._id}
                            <br />
                            {mission?.created_by}
                        </label>
                        {/* <label className='text-sm'>{`امتیاز : 4.2`}</label> */}
                    </div>
                </div>
                <div className='flex flex-col px-2 items-center whitespace-nowrap'>
                    <label className='mb-1 text-sm'>{`${mission.vehicleName}  ${mission.vehicleColor}`}</label>
                  
                   
                    <PlaqueInput
                        small={true}
                        disabled
                        value={convertStringToPlaque(mission.vehiclePlaque)}
                    />
                       

                    {/* <span className='inline-block p-1 border-l'>
                            <span>{"11"}</span>
                        </span>
                        <span className='inline-block p-1'>365</span>
                        <span className='inline-block p-1'>ب</span>
                        <span className='inline-block p-1'>12</span> */}

                </div>
                <div className='border-r border-gray-4 flex flex-col'>
                    <i className='fa fa-phone icon-phone' onClick={() => showDialPage(mission.driver_phone)}></i>
                     <BiMessage className={"p-2 active:bg-gray-4"} size={40} /> 
                </div>
            </div>
            {/* <div className='bg-gray-4 h-px mt-3'></div> */}
            <div>
                <table className='w-full'>
                    <tbody>
                        <tr><td colSpan={2}> <TitledSparator title={"سفر"} /> </td></tr>
                        <tr className='text-sm '><td className='px-3 pt-2 bold whitespace-nowrap align-top text-left'>{"حرکت"}</td><td className='pt-2'>{getLocalDatetime(mission.mission_date)}</td></tr>
                        <tr><td colSpan={2}> <TitledSparator title={"مسیر"} /> </td></tr>
                        <tr className='text-sm'><td className='px-3 pt-2 bold whitespace-nowrap align-top text-left'>{"مبدا"}</td><td className='pt-2' >{mission.locations && mission.locations.length > 0 && mission.locations[0].meta?.address}</td></tr>
                        {/* <tr className='text-sm '><td className='px-3 pt-2 bold whitespace-nowrap align-top text-left'>{"ایستگاه 1"}</td><td>{"فلان شسکمین شسی"}</td></tr> */}
                        <tr className='text-sm '><td className='px-3 pt-2 bold whitespace-nowrap align-top text-left'>{"مقصد"}</td><td className='pt-2' >{mission.locations && mission.locations.length > 0 && mission.locations[mission.locations.length - 1].meta?.address}</td></tr>
                        <tr><td colSpan={2}> <TitledSparator title={"مشخصات"} /> </td></tr>
                        <tr className='text-sm'><td className='px-3 pt-2 bold whitespace-nowrap align-top text-left'>{"دیسپاچر"}</td><td className='pt-2' >{mission.dispature}</td></tr>
                        {/* <tr className='text-sm'><td className='px-3 pt-2 bold whitespace-nowrap align-top text-left'>{"مدیر پروژه"}</td><td className='pt-2' >{"امیدرضا احدزاده"}</td></tr> */}
                        <tr className='text-sm'><td className='px-3 pt-2 bold whitespace-nowrap align-top text-left'>{"مرکز هزینه"}</td><td className='pt-2'>{mission.proj_desc}</td></tr>
                        <tr>
                            <td colSpan={2}>
                                <button className='bg-primary text-white rounded-3xl p-2 w-full mt-6'>
                                    {mission.status === 'READY' ? 'در انتظار حرکت راننده' : 'در حال سفر'}
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div >}
    </>

};

export default TripMissionDetails;