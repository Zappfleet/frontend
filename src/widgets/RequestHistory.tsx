import { BsChevronDoubleDown, BsExclamationCircle } from "react-icons/bs";
import useMissions from "../hooks/data/useMissions";
import { TEXT_CONFIRMED_BY, TEXT_COST_CENTER, TEXT_CREATED_BY, TEXT_DATE_TIME, TEXT_DESC, TEXT_LOCATIONS, TEXT_PROJECT, TEXT_STATUS, getLocalDatetime, getLocationIndexTitle, joinStatus, requestStatus } from "../lib/string";
import useRequests from "../hooks/data/useRequests";
import { useElementSize, useIsFirstRender, useScreen } from 'usehooks-ts'
import { SCREEN_LG, SCREEN_MD } from "../lib/constants";
import React, { useState } from "react";
import useItemSetToggle from "../hooks/custom/useItemSetToggle";
import classNames from "classnames";
import { BiChevronDown } from "react-icons/bi";
import { renderWithPrefix } from "../lib/renderUi";
import ExpandableBox from "./ExpandableBox";



export default function RequestHistory(props: any = {}) {
    const { mode } = props;
    const status = ""
    const { requests }: any = useRequests({ mode, initialParams: { status } });
    const {
        items: expandedRows,
        toggleItem: toggleExpandedRows,
    } = useItemSetToggle({ onlyOne: true });
    const screen = useScreen();


    if (!screen) return <div></div>

    if (screen.width < SCREEN_LG) return <div>
        {requests?.docs?.map((request: any) => {
            const isExpanded = expandedRows.includes(request._id);
            return <RequestListItem key={request._id} request={request} >
                <>
                    <div onClick={() => toggleExpandedRows(request._id)} className="border-t border-gray-4 mt-4 flex justify-center active:bg-gray-4">
                        <BiChevronDown
                            className={classNames("duration-300", {
                                "rotate-180": isExpanded,
                            })}
                            size={32} />
                    </div>
                    <ExpandableBox expanded={isExpanded} >
                        <RequestDetailsBox request={request} />
                    </ExpandableBox>
                </>
            </RequestListItem>
        })}
    </div>

    return <div className="flex-1 bg-white shadow rounded-md overflow-hidden scroller">
        <table className="w-full bg-white ">
            <thead className="sticky top-0 ">
                <tr className="bg-primary text-white">
                    <th className="p-2 text-right">{TEXT_DATE_TIME}</th>
                    <th className="p-2 text-right">{TEXT_CREATED_BY}</th>
                    <th className="p-2 text-right">{TEXT_CONFIRMED_BY}</th>
                    <th className="p-2 text-right">{TEXT_STATUS}</th>
                    <th className="p-2 text-right">{TEXT_DESC}</th>
                    <th className="p-2 text-right">{""}</th>
                </tr>
            </thead>
            <tbody>
                {requests?.docs?.map((request: any) => {
                    const isExpanded = expandedRows.includes(request._id);
                    return <React.Fragment key={request._id}>
                        <tr className="border-b border-gray-4 even:bg-gray-2">
                            <td className="p-2">{getLocalDatetime(request.gmt_for_date)}</td>
                            <td className="p-2">{request.submitted_by?.full_name || request.submitted_by?.username}</td>
                            <td className="p-2">{request.confirmed_by?.full_name || request.confirmed_by?.username}</td>
                            <td className="p-2">{Object.fromEntries(requestStatus)[request.status]}</td>
                            <td className="p-2">{request.details.desc}</td>
                            <td className="p-2" onClick={() => toggleExpandedRows(request._id)}>
                                <BiChevronDown
                                    className={classNames("duration-300", {
                                        "rotate-180": isExpanded,
                                    })}
                                    size={32} />
                            </td>
                        </tr>
                        <tr className="">
                            <td colSpan={6}>
                                <ExpandableBox expanded={isExpanded} >
                                    <RequestDetailsBox request={request} />
                                </ExpandableBox>
                            </td>
                        </tr>
                    </React.Fragment >
                })}
            </tbody>
        </table>
    </div>
}

function RequestListItem({ request, children }: any) {
    return <div className="bg-white shadow rounded-md mx-1 my-4 p-3">
        <table>
            <tbody>
                <tr>
                    <td className="text-primary text-left px-2">{TEXT_DATE_TIME}</td>
                    <td>{renderWithPrefix(getLocalDatetime(request.gmt_for_date))}</td>
                </tr>
                <tr>
                    <td className="text-primary text-left px-2">{TEXT_CREATED_BY}</td>
                    <td>{renderWithPrefix(request.submitted_by.full_name)}</td>
                </tr>
                <tr>
                    <td className="text-primary text-left px-2">{TEXT_CONFIRMED_BY}</td>
                    <td>{renderWithPrefix(request.dispatched_by?.full_name || "")}</td>
                </tr>
                <tr>
                    <td className="text-primary text-left px-2">{TEXT_STATUS}</td>
                    <td>{renderWithPrefix(Object.fromEntries(requestStatus)[request.status])}</td>
                </tr>
                <tr>
                    <td className="text-primary text-left px-2">{TEXT_DESC}</td>
                    <td>{renderWithPrefix(request.details?.desc)}</td>
                </tr>
            </tbody>
        </table>
        {children}
    </div>
}


function RequestDetailsBox({ request }: any) {

    return <table>
        <tbody>
            <tr>
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
            </tr>
        </tbody>
    </table>
}

