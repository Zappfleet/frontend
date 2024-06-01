import { BsExclamationCircle } from "react-icons/bs";
import useMissions from "../hooks/data/useMissions";
import { TEXT_CONFIRMED_BY, TEXT_COST_CENTER, TEXT_CREATED_BY, TEXT_DATE_TIME, TEXT_DESC, TEXT_DISPATCH_BY, TEXT_LOCATIONS, TEXT_PROJECT, TEXT_STATUS, getLocalDatetime, getLocationIndexTitle, joinStatus, missionStatus } from "../lib/string";
import { useScreen } from "usehooks-ts";
import { MODE_DRIVER, SCREEN_LG } from "../lib/constants";
import useItemSetToggle from "../hooks/custom/useItemSetToggle";
import renderUi, { renderWithPrefix } from "../lib/renderUi";
import classNames from "classnames";
import ExpandableBox from "./ExpandableBox";
import SimpleButton from "../components/SimpleButton";

const SHOW_TRIP = "نمایش سفر"

export default function MissionHistory(props: any = {}) {
    const { mode } = props;
    const showAsDriver = mode == MODE_DRIVER
    const status = ""
    const { missions }: any = useMissions({ mode, status });
    const {
        items: expandedRows,
        toggleItem: toggleExpandedRows,
    } = useItemSetToggle({ onlyOne: true });
    const screen = useScreen();

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

    return <div className="RequestHistory-component">
        <div className="row">
            <div className="col-12">
                <table className='table table-hover'>
                    <thead>
                        <tr>
                            <th>تاریخ و ساعت</th>
                            <th>ایجاد توسط</th>
                            <th>توزیع توسط</th>
                            <th>وضعیت</th>
                            {renderUi(<th></th>).if(showAsDriver)}
                            <th>{""}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {missions.data?.docs?.map((mission: any) => {

                            const isExpanded = expandedRows.includes(mission._id);
                            return <>
                                <tr key={mission._id}>
                                    <td>{mission.gmt_for_date && getLocalDatetime(mission.gmt_for_date)}</td>
                                    <td>{mission.created_by?.full_name || mission.created_by?.username}</td>
                                    <td>{mission.assigned_by?.full_name || mission.assigned_by?.username}</td>
                                    <td>{mission.status}</td>
                                    {renderUi(
                                        <td >
                                            <div>
                                                <a href={`/driver/active?mission_id=${mission._id}`}>
                                                    {SHOW_TRIP}
                                                </a>
                                            </div>
                                        </td>
                                    ).if(showAsDriver)}
                                    <td onClick={() => toggleExpandedRows(mission._id)}>
                                        <i className={`fa ${isExpanded ? 'fa-angle-down' : 'fa-angle-up'}`}></i>
                                    </td>
                                </tr>
                                <tr style={{ display: isExpanded ? 'contents' : 'none' }}>
                                    <td colSpan={6}>
                                        <div className='expand'>
                                            <div>
                                                <MissionDetailsBox mission={mission} />
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


function MissionDetailsBox({ request }: any) {

    return <table>
        <tbody>
            {/* {"OK"} */}
            {/* <tr>
                <td className="text-primary text-left p-2  whitespace-nowrap">{TEXT_PROJECT}</td>
                <td>{request.details.proj_code}</td>
            </tr>
            <tr>
                <td className="text-primary text-left p-2  whitespace-nowrap">{TEXT_COST_CENTER}</td>
                <td>{request.details.cost_center}</td>
            </tr>
            <tr>
                <td className="text-primary text-left px-2 align-top p-2">{TEXT_LOCATIONS}</td>
                <td>
                    <ul>
                        {request.locations.map(({ meta }: any, index: number) => {
                            return <>
                                <li className="my-2">
                                    <span className="text-graydark ml-4">{`${getLocationIndexTitle(request.locations.length, index)}`}</span>
                                    {meta.address}
                                </li>
                            </>
                        })}
                    </ul>
                </td>
            </tr> */}
        </tbody>
    </table>
}
