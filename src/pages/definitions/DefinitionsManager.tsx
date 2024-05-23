import { getApiClient } from "../../apis/client";
import BasicDataTable from "../../components/BasicDataTable";
import TabbedPanel from "../../components/TabbedPanel";
import useVehicleBasicData from "../../hooks/data/useVehicleBasicData";
import { NotificationController } from "../../lib/notificationController";
import { serviceUnits } from "../../lib/string";


const DefinitionsManager = () => {

    const { data, refreshData }: any = useVehicleBasicData();

    const handle_submitVehicleGroup = (group: string) => {
        return (body: any, cb: () => void) => {
            getApiClient().createBasicEntity(body, group).then(({ data }) => {
                refreshData();
            }).catch(console.log).finally(cb);
        }
    }

    const handle_updateServiceUnit = (key: string, new_value: string, onError: any) => {
        getApiClient().updateBasicEntity(key, { unit: new_value }, "service").then(({ data }) => {
            NotificationController.showSuccess("به روز رسانی انجام شد")
        }).catch(() => {
            NotificationController.showError("خطا در به روز رسانی")
            onError();
        });
    }

    const tabs = [
        {
            label: "نوع خودرو",
            key: "groups",
            component: <BasicDataTable
                onSubmit={handle_submitVehicleGroup("group")}
                data={data.groups}
                group={"group"}
                title={"نوع خودرو"}
            />
        },
        {
            label: "سرویس",
            key: "services",
            component: <BasicDataTable
                onSubmit={handle_submitVehicleGroup("service")}
                data={data.services}
                group={"service"}
                title={"سرویس"}
                additionalFields={[{
                    title: "واحد ظرفیت",
                    key: "unit",
                    render: (value: string, item: any) => {
                        return <select defaultValue={value } onChange={(e) => handle_updateServiceUnit(item.key, e.target.value, () => { e.target.value = value })} className="select-box" key={value}>
                            {serviceUnits.map((entry) => {
                                return <option value={entry[0]}>{entry[1]}</option>
                            })}
                        </select>
                    }
                }]}
                renderAdditionalRowInput={() => {
                    return <select name={"unit"} className="p-1.5 rounded bg-white border border-gray">
                        {serviceUnits.map((entry) => {
                            return <option value={entry[0]}>{entry[1]}</option>
                        })}
                    </select>
                }}
            />
        },
        {
            label: "اسامی خودرو",
            key: "names",
            component: <BasicDataTable
                onSubmit={handle_submitVehicleGroup("name")}
                data={data.names}
                group={"name"}
                title={"اسامی خودرو"}
            />
        },
        {
            label: "رنگ ها",
            key: "colors",
            component: <BasicDataTable
                onSubmit={handle_submitVehicleGroup("color")}
                data={data.colors}
                group={"color"}
                title={"رنگ"}
            />
        }
    ]

    return <div className="">
        <TabbedPanel
            tabs={tabs}
        />
    </div>
}



export default DefinitionsManager;