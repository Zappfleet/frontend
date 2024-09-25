import { BsExclamationCircle } from "react-icons/bs";
import useMissions from "../../hooks/data/useMissions";
import { TEXT_CONFIRMED_BY, TEXT_COST_CENTER, TEXT_CREATED_BY, TEXT_DATE_TIME, TEXT_DESC, TEXT_DISPATCH_BY, TEXT_LOCATIONS, TEXT_PROJECT, TEXT_STATUS, getLocalDatetime, getLocationIndexTitle, joinStatus, missionStatus } from "../../lib/string";
import { useScreen } from "usehooks-ts";
import { MODE_DRIVER, SCREEN_LG } from "../../lib/constants";
import useItemSetToggle from "../../hooks/custom/useItemSetToggle";
import renderUi, { renderWithPrefix } from "../../lib/renderUi";
import classNames from "classnames";
import ExpandableBox from "../ExpandableBox";
import SimpleButton from "../../components/SimpleButton";
import './style.scss'
import { emoji as emojiLib } from '../../lib/comments';
import { useEffect } from "react";
import DataGrid from "../../components/DataGrid/DataGrid";
import { isArray } from "lodash";

const SHOW_TRIP = "نمایش سفر"

export default function MissionHistory(props: any = {}) {
    const { mode, paging, status } = props;
    const showAsDriver = mode === MODE_DRIVER
    // console.log(52,status,paging);

    const { missions }: any = showAsDriver === true ? useMissions({ mode, status, paging }) : []
    console.log(741, missions, paging);

    const {
        items: expandedRows,
        toggleItem: toggleExpandedRows,
    } = useItemSetToggle({ onlyOne: true });
    const screen = useScreen();

    useEffect(() => {
        console.log(2000, missions);
    }, [missions])
    // if (!screen) return <div></div>

    // if (screen.width < SCREEN_LG) return <div>
    //     {missions.data?.docs?.map((mission: any) => {
    //         const isExpanded = expandedRows.includes(mission._id);
    //         return <MissionListItem key={mission._id} mission={mission} >
    //             <>
    //                 <div onClick={() => toggleExpandedRows(mission._id)}>
    //                     <i className={`fa ${isExpanded ? 'fa-angle-down' : 'fa-angle-up'}`}></i>
    //                 </div>
    //                 <div className='expand'>
    //                     <div>
    //                         <MissionDetailsBox mission={mission} />
    //                     </div>
    //                 </div>

    //             </>
    //         </MissionListItem>
    //     })}
    // </div>


    const showComment = (mission: any) => {
        // console.log(800, mission);

        const myComments = mission?.extra?.comments ? mission.extra.comments : undefined;
        const result = myComments?.map((item: any) => {
            // console.log(10, item, item.emojiID, emojiLib.find(ite => ite.key === item.emojiID)?.icon);

            return <>
                <div className='com0'>
                    <span className='title'>{`نظر ${item.role === 'driver' ? 'راننده' : 'مسافر'}`}</span>
                </div>
                <div className='com1'>
                    <i style={{ color: emojiLib.find(ite => ite.key === item.emojiID)?.color }}
                        className={emojiLib.find(ite => ite.key === item.emojiID)?.icon}></i>
                    <span>{(emojiLib.find(ite => ite.key === item.emojiID))?.value}</span>
                </div>
                <div className='com2'>
                    <p>{item.customComment}</p>
                </div>
                <div className='com3'>
                    {item.comments?.map((ite: any) => {
                        return <span className={ite.type}>{ite.value}</span>
                    })}
                </div>
            </>
        })

        return result ? <div className='request-mycomment'>
            <div className="row">
                <div className="col-2 title">
                    {'نظرات'}
                </div>
                <div className="col-10">
                    {result}
                </div>
            </div>
        </div>
            :
            null

    }



    const optionsMission = [{ id: 1, value: 5 }, { id: 2, value: 10 }, { id: 3, value: 15 }]
    const theadMission = [
        // { key: 'id', name: 'شناسه' },
        // { key: '_id', name: 'شناسه' },
        { key: 'mission_date', name: 'تاریخ سفر' },
        { key: 'created_by', name: 'ایجاد توسط' },
        { key: 'dispature', name: 'تغییر توسط' },
        { key: 'distance', name: 'مسافت' },
        // { key: 'price', name: 'هزینه' },
        // { key: 'commentOfDriver', name: 'نظر راننده' },
        // { key: 'commentOfPassenger', name: 'نظر مسافر' },
        { key: 'status', name: 'وضعیت' },
    ]

    return <div className="MissionHistory-component">
        <div className="row">
            <div className="col-12 have-table">
                {/* {missions?.data?.length > 0 &&
                    <DataGrid
                        pagesize={optionsMission[0].value}
                        items={missions?.data}
                        options={optionsMission}
                        thead={theadMission}
                    />
                } */}
                <table className='table table-hover'>
                    <thead>
                        <tr>
                            <th>تاریخ و ساعت</th>
                            <th>ایجاد توسط</th>
                            <th>توزیع توسط</th>
                            <th>مسافت </th>
                            <th>وضعیت</th>
                            {renderUi(<th></th>).if(showAsDriver)}
                            <th>{""}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {console.log(12, missions)}
                        {isArray(missions?.data) && missions?.data?.map((mission: any) => {
                            const statusItem = missionStatus.find(item => item[0] === mission.status);
                            const isExpanded = expandedRows.includes(mission._id);
                            return <>
                                <tr key={mission._id}>
                                    <td>{mission.mission_date && getLocalDatetime(mission.mission_date)}</td>
                                    <td>{mission.created_by}</td>
                                    <td>{mission.dispature}{mission._id}</td>
                                    <td>{mission.distance}</td>
                                    <td>{statusItem ? statusItem[1] : 'نا مشخص'}</td>
                                    {renderUi(
                                        <td >
                                            <div>
                                                <a href={`/driver/active?mission_id=${mission._id}`}>
                                                    <i className="fa fa-eye icon-view"></i>
                                                </a>
                                            </div>
                                        </td>
                                    ).if(showAsDriver)}
                                    <td onClick={() => toggleExpandedRows(mission._id)}>
                                        <i className={` angle-icon fa ${isExpanded ? 'fa-angle-down' : 'fa-angle-up'}`}></i>
                                    </td>
                                </tr>
                                <tr style={{ display: isExpanded ? 'contents' : 'none' }}>
                                    <td colSpan={6}>
                                        <div className='expand'>
                                            <div>
                                                <MissionDetailsBox mission={mission} />
                                                {showComment(mission)}
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            </>
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    </div>
}


function MissionListItem({ mission, children }: any) {
    return <div>
        <table>
            <tbody>
                <tr>
                    <td>{TEXT_DATE_TIME}</td>
                    <td>{renderWithPrefix(getLocalDatetime(mission.gmt_for_date))}</td>
                </tr>
                <tr>
                    <td>{TEXT_CREATED_BY}</td>
                    <td>{renderWithPrefix(mission.created_by?.full_name || mission.created_by?.username)}</td>
                </tr>
                <tr>
                    <td>{TEXT_DISPATCH_BY}</td>
                    <td>{renderWithPrefix(mission.assigned_by?.full_name || mission.assigned_by?.username)}</td>
                </tr>
                <tr>
                    <td>{TEXT_STATUS}</td>
                    <td>{renderWithPrefix(Object.fromEntries(missionStatus)[mission.status])}</td>
                </tr>
                <tr>
                    <td colSpan={2}>
                        <a href={`/driver/active?mission_id=${mission._id}`}>
                            {SHOW_TRIP}
                        </a>
                    </td>
                </tr>
            </tbody>
        </table>
        {children}
    </div>
}




function MissionDetailsBox({ mission }: any) {

    return <table>
        <tbody>
            <tr>
                <td className='name'>{TEXT_PROJECT}</td>
                <td>{mission?.project_Code}</td>
            </tr>
            <tr>
                <td className='name'>{TEXT_COST_CENTER}</td>
                <td>{mission?.cost_center}</td>
            </tr>
            <tr>
                <td className='name'>{TEXT_LOCATIONS}</td>
                <td>
                    <ul>
                        {mission?.locations?.map(({ meta }: any, index: number) => {
                            return <>
                                <li>
                                    <span>{` ${getLocationIndexTitle(mission.locations.length, index)} `}</span>
                                    {meta.address}
                                </li>
                            </>
                        })}
                    </ul>
                </td>
            </tr>
        </tbody>
    </table>
}


