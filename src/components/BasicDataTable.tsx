
import LoaderButton from './LoaderButton';
import SimpleButton from './SimpleButton';
import BasicSwitcher from './BasicSwitcher';
import { useEffect, useRef, useState } from 'react';
import { getApiClient } from '../apis/client';
import { NotificationController } from '../lib/notificationController';
import { readFormInputs } from '../lib/form';
import { BiCheck } from 'react-icons/bi';


import useCurrentUserPermissions from '../hooks/useCurrentUserPermissions';
import {
    PERMIT_DEFINITIONS_CAR_COLORS,
    PERMIT_DEFINITIONS_CAR_TYPES,
    PERMIT_DEFINITIONS_CAR_NAME,
    PERMIT_DEFINITIONS_SERVICE_TYPES
} from '../lib/constants'

const BasicDataTable = (props: any) => {


    const { hasPermitGroup, hasPermitFor, hasAdminRank, permits } =
        useCurrentUserPermissions();

    const [loading, setLoading] = useState<boolean>(false)
    const [permission_CAR_COLORS, setPermission_CAR_COLORS] = useState<boolean>(false)
    const [permission_CAR_TYPES, setPermission_CAR_TYPES] = useState<boolean>(false)
    const [permission_CAR_NAME, setPermission_CAR_NAME] = useState<boolean>(false)
    const [permission_SERVICE_TYPES, setPermission_SERVICE_TYPES] = useState<boolean>(false)

    useEffect(() => {
        setPermission_CAR_COLORS(hasPermitFor([PERMIT_DEFINITIONS_CAR_COLORS]))
        setPermission_CAR_NAME(hasPermitFor([PERMIT_DEFINITIONS_CAR_NAME]))
        setPermission_CAR_TYPES(hasPermitFor([PERMIT_DEFINITIONS_CAR_TYPES]))
        setPermission_SERVICE_TYPES(hasPermitFor([PERMIT_DEFINITIONS_SERVICE_TYPES]))

        // setLoading(true)
    }, [hasPermitFor])

    const [state, setState] = useState({
        activeNewRow: false,
        isLoading: false,
        input: "",
    });

    const newRowFormRef = useRef<any>();

    const handle_cancelNewRow = () => {
       // console.log(520);
        
        setState({ ...state, activeNewRow: false })
    }

    const handle_addNewRow = () => {
        setState({ ...state, activeNewRow: true })
    }

    const handle_inputChange = (e: any) => {
        setState({ ...state, input: e.target.value })
    }

    const handle_submitRow = (auto_active_next: boolean) => {
        const input = state.input.trim();
        const formData = readFormInputs(newRowFormRef);
        if (input.length == 0) return;
        setState({ ...state, isLoading: true })
        props.onSubmit(formData, () => {
            setState({ ...state, isLoading: false, activeNewRow: auto_active_next, input: "" })
        });
    }

    const handleChangeEntity = (body: any, item: any, onError: any) => {
        getApiClient().updateBasicEntity(item.key, body, props.group).then(({ data }) => {
            NotificationController.showSuccess("به روز رسانی انجام شد")
        }).catch(() => {
            NotificationController.showError("خطا در به روز رسانی")
            onError();
        });
    }

    return (
        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="py-6 px-4 md:px-6 xl:px-7.5">

                {(() => {
                    switch (props.group) {
                        case "group":
                            // Conditional rendering of JSX elements based on permission_SUBMIT
                            return (
                                <>
                                    {permission_CAR_TYPES === true &&
                                        <SimpleButton onClick={handle_addNewRow}>{`سطر جدید ${props.title}`}</SimpleButton>
                                    }
                                    {permission_CAR_TYPES === false &&
                                        <SimpleButton disabled={true} className={"NoPermission"}>
                                            {`سطر جدید ${props.title}`}
                                        </SimpleButton>
                                    }
                                </>
                            );
                        case "service":
                            // Conditional rendering of JSX elements based on permission_SUBMIT
                            return (
                                <>
                                    {permission_SERVICE_TYPES === true &&
                                        <SimpleButton onClick={handle_addNewRow}>{`سطر جدید ${props.title}`}</SimpleButton>
                                    }
                                    {permission_SERVICE_TYPES === false &&
                                        <SimpleButton disabled={true} className={"NoPermission"}>
                                            {`سطر جدید ${props.title}`}
                                        </SimpleButton>
                                    }
                                </>
                            );
                            case "name":
                                // Conditional rendering of JSX elements based on permission_SUBMIT
                                return (
                                    <>
                                        {permission_CAR_NAME === true &&
                                            <SimpleButton onClick={handle_addNewRow}>{`سطر جدید ${props.title}`}</SimpleButton>
                                        }
                                        {permission_CAR_NAME === false &&
                                            <SimpleButton disabled={true} className={"NoPermission"}>
                                                {`سطر جدید ${props.title}`}
                                            </SimpleButton>
                                        }
                                    </>
                                );
                                case "color":
                                // Conditional rendering of JSX elements based on permission_SUBMIT
                                return (
                                    <>
                                        {permission_CAR_COLORS === true &&
                                            <SimpleButton onClick={handle_addNewRow}>{`سطر جدید ${props.title}`}</SimpleButton>
                                        }
                                        {permission_CAR_COLORS === false &&
                                            <SimpleButton disabled={true} className={"NoPermission"}>
                                                {`سطر جدید ${props.title}`}
                                            </SimpleButton>
                                        }
                                    </>
                                );
                        default:
                            // Handle the default case if necessary
                            return null;
                    }
                })()}
            </div>

            <div className="grid grid-cols-4 border-t border-stroke py-4.5 px-4 dark:border-strokedark sm:grid-cols-8 md:px-6 2xl:px-7.5">
                <div className="col-span-3 flex items-center">
                    <p className="font-medium">{"عنوان"}</p>
                </div>
                {props.additionalFields?.map(({ title, key }: any) => {
                    return <div key={key} className="col-span-2 items-center sm:flex">
                        <p className="font-medium">{title}</p>
                    </div>
                })}
                <div className="col-span-2 hidden items-center sm:flex">
                    <p className="font-medium">{"تاریخ ایجاد"}</p>
                </div>
                <div className="col-span-1 flex items-center justify-center">
                    <p className="font-medium">{"فعال"}</p>
                </div>
            </div>

            {(state.activeNewRow || props.data?.length === 0) &&
                <div className="grid grid-cols-6 border-t border-stroke py-4.5 px-4 dark:border-strokedark sm:grid-cols-8 md:px-6 2xl:px-7.5">
                    <div className="col-span-6 flex items-center">
                        <form ref={newRowFormRef} className="w-full flex flex-col gap-4 sm:flex-row sm:items-center">
                            <input
                                name={"name"}
                                onKeyDown={(event) => {
                                    if (event.key === "Enter") {
                                        event.preventDefault();
                                        handle_submitRow(true);
                                    }
                                }}
                                className="border border-gray w-full text-sm text-black dark:text-white outline-none p-2"
                                value={state.input}
                                onChange={handle_inputChange}
                                autoFocus={true}
                                placeholder='عنوان جدید را وارد کنید' />
                            {props.renderAdditionalRowInput?.()}
                        </form>
                    </div>

                    <div className="col-span-6 sm:col-span-2 flex items-center justify-center m-2">
                        <LoaderButton isLoading={state.isLoading} disabled={state.input.trim().length == 0} onClick={() => handle_submitRow(false)} className={"flex-1 !py-2 !text-sm "}>{"تایید"}</LoaderButton>
                        <SimpleButton disabled={props.data?.length === 0} onClick={handle_cancelNewRow} className={"!bg-danger disabled:!bg-disabled flex-1 mx-2"}>{"لغو"}</SimpleButton>
                    </div>
                </div>
            }

            {props.data?.map((item: any) => {

                const onTitleChange = (e: any) => handleChangeEntity({ title: e.target.value }, item, () => { e.target.value = item.title });
                return <div key={item.key} className="grid grid-cols-4 border-t border-stroke py-4.5 px-4 dark:border-strokedark sm:grid-cols-8 md:px-6 2xl:px-7.5">
                    <div className="col-span-3 flex items-center">
                        <div className="mb-4 relative flex show-sibling-onfocus border border-transparent p-2 rounded focus-within:border-primary flex flex-col gap-4 sm:flex-row sm:items-center">
                            <input
                                onBlur={onTitleChange}
                                defaultValue={item.title}
                                className="flex-1 cursor-pointer text-sm sm:flex text-black hover:text-primary p-1 dark:text-white outline-none" />
                            <span className='focus-sibling absolute left-1 top-1/2 -translate-y-1/2'>
                                <BiCheck onClick={onTitleChange} className={"text-success cursor-pointer"} size={26} />
                            </span>
                        </div>
                    </div>

                    {props.additionalFields?.map(({ key, render }: any) => {
                        return <div key={key} className="col-span-2 items-center sm:flex">
                            <p className="font-medium">{render?.(item[key], item) || item[key]}</p>
                        </div>
                    })}
                    <div className="col-span-2 hidden items-center sm:flex">
                        <p className="text-sm text-black hidden sm:flex dark:text-white">
                            {item.createdAt}
                        </p>
                    </div>
                    <div className="col-span-1 flex justify-center items-center ltr">
                        <BasicSwitcher
                            defaultValue={item.active}
                            handleChange={(active: boolean, onError: any) => {
                                handleChangeEntity({ active }, item, onError)
                            }} />
                    </div>
                </div>
            })}



        </div>
    );
};

export default BasicDataTable;
