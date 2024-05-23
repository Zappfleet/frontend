import { BsExclamationCircle } from "react-icons/bs";
import useMissions from "../hooks/data/useMissions";
import { TEXT_CONFIRMED_BY, TEXT_COST_CENTER, TEXT_CREATED_BY, TEXT_DATE_TIME, TEXT_DESC, TEXT_DISPATCH_BY, TEXT_LOCATIONS, TEXT_PROJECT, TEXT_STATUS, getLocalDatetime, getLocationIndexTitle, joinStatus, missionStatus } from "../lib/string";
import { useScreen } from "usehooks-ts";
import { MODE_DRIVER, SCREEN_LG } from "../lib/constants";
import useItemSetToggle from "../hooks/custom/useItemSetToggle";
import renderUi, { renderWithPrefix } from "../lib/renderUi";
import { BiChevronDown } from "react-icons/bi";
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

    if (!screen) return <div></div>

    if (screen.width < SCREEN_LG) return <div>
        {missions.data?.docs?.map((mission: any) => {
            const isExpanded = expandedRows.includes(mission._id);
            return <MissionListItem key={mission._id} mission={mission} >
                <>
                    <div onClick={() => toggleExpandedRows(mission._id)} className="border-t border-gray-4 mt-1 flex justify-center active:bg-gray-4">
                        <BiChevronDown
                            className={classNames("duration-300", {
                                "rotate-180": isExpanded,
                            })}
                            size={32} />
                    </div>
                    <ExpandableBox expanded={isExpanded}>
                        <MissionDetailsBox mission={mission} />
                    </ExpandableBox>
                </>
            </MissionListItem>
        })}
    </div>

    return <div className="flex-1 bg-white shadow rounded-md overflow-hidden scroller">
        <table className="w-full bg-white ">
            <thead className="sticky top-0 ">
                <tr className="bg-primary text-white">
                    <th className="p-2 text-right">تاریخ و ساعت</th>
                    <th className="p-2 text-right">ایجاد توسط</th>
                    <th className="p-2 text-right">توزیع توسط</th>
                    <th className="p-2 text-right">وضعیت</th>
                    {renderUi(<th className="p-2 text-center"></th>).if(showAsDriver)}
                    <th className="p-2 text-right">{""}</th>
                </tr>
            </thead>
            <tbody>
                {missions.data?.docs?.map((mission: any) => {

                    const isExpanded = expandedRows.includes(mission._id);
                    return <>
                        <tr className="border-b border-gray-4 even:bg-gray-2" key={mission._id}>
                            <td className="p-2">{mission.gmt_for_date && getLocalDatetime(mission.gmt_for_date)}</td>
                            <td className="p-2">{mission.created_by?.full_name || mission.created_by?.username}</td>
                            <td className="p-2">{mission.assigned_by?.full_name || mission.assigned_by?.username}</td>
                            <td className="p-2">{mission.status}</td>
                            {renderUi(
                                <td className="p-2">
                                    <div className="w-full flex justify-center">
                                        <a className="text-sm hover:text-primary" href={`/driver/active?mission_id=${mission._id}`}>
                                            {SHOW_TRIP}
                                        </a>
                                    </div>
                                </td>
                            ).if(showAsDriver)}
                            <td className="p-2" onClick={() => toggleExpandedRows(mission._id)}>
                                <BiChevronDown
                                    className={classNames("duration-300", {
                                        "rotate-180": isExpanded,
                                    })}
                                    size={32} />
                            </td>
                        </tr>
                        <tr>
                            <td colSpan={6}>
                                <ExpandableBox expanded={isExpanded}>
                                    <MissionDetailsBox mission={mission} />
                                </ExpandableBox>
                            </td>
                        </tr>
                    </>
                })}
            </tbody>
        </table>
    </div>
}


function MissionListItem({ mission, children }: any) {
    return <div className="bg-white shadow rounded-md mx-1 my-4 p-3">
        <table className="w-full">
            <tbody>
                <tr>
                    <td className="text-primary text-left px-2">{TEXT_DATE_TIME}</td>
                    <td>{renderWithPrefix(getLocalDatetime(mission.gmt_for_date))}</td>
                </tr>
                <tr>
                    <td className="text-primary text-left px-2">{TEXT_CREATED_BY}</td>
                    <td>{renderWithPrefix(mission.created_by?.full_name || mission.created_by?.username)}</td>
                </tr>
                <tr>
                    <td className="text-primary text-left px-2">{TEXT_DISPATCH_BY}</td>
                    <td>{renderWithPrefix(mission.assigned_by?.full_name || mission.assigned_by?.username)}</td>
                </tr>
                <tr>
                    <td className="text-primary text-left px-2">{TEXT_STATUS}</td>
                    <td>{renderWithPrefix(Object.fromEntries(missionStatus)[mission.status])}</td>
                </tr>
                <tr>
                    <td colSpan={2} className="text-center">
                        <a className="text-sm hover:text-primary p-2 w-full inline-block" href={`/driver/active?mission_id=${mission._id}`}>
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
