import { useEffect, useState } from "react"
import useSWR from "swr"
import settings from "../../../config";
import httpService from "../../../services/httpService";
import { Button, Card, Checkbox, LoadingOverlay, Text } from "@mantine/core";
import axios from "axios";
import { ErrorToast, SucccessToast } from "../../../components/common/errorToast";
import MyModal from "../../../components/common/modal";
import LoadingContainer from "../../../components/hoc/loadingContainer";
import { RenderRequestStatus } from "../../passnager-web-panel/tripDetails/RenderStatus";
import MyCheckBox from "../../../components/common/from/checkBox";

export default function ManagerRequests({ newRequests }) {

    const [modalState, setModalState] = useState({});
    const [apiInProgress, setApiInProgress] = useState(false);
    const [removeIds, setRemoveIds] = useState([]);
    const [selectedItems, setSelectedItems] = useState({});

    const { data, mutate } = useSWR(
        settings.apiUrl + `/request/notifs?new=${newRequests ? true : false}`,
        (url) => httpService.get(url),
        { revalidateOnFocus: false, }
    )

    const handle_Request = (item, url, title, is_reject) => {

        if (Object.keys(selectedItems).length > 0) {
            handleItemCheckChange({ target: { checked: true } }, item);
        }

        setModalState({
            show: true,
            url,
            title,
            is_reject,
            item,
        })
    }

    const confirmClick = async () => {
        setApiInProgress(true)

        if (Object.keys(selectedItems).length > 0) {
            handleItemCheckChange({ target: { checked: true } }, modalState.item);

            const apisResult = await Promise.all(Object.entries(selectedItems).map(async (entry) => {
                try {
                    const value = entry[1];
                    console.log({ value });
                    await axios.get(modalState.is_reject ? value.urlFalse : value.urlTrue, { params: { __j: true } })
                    return value.request_id._id;
                } catch (e) {
                    console.log(e);
                    return null;
                }
            }))
            const successIds = apisResult.filter((i) => i != null);

            setRemoveIds([...removeIds, ...successIds]);

            if (apisResult.length > successIds.length) {
                ErrorToast({ message: `تعداد ${apisResult.length - successIds.length} دستور با خطا مواجه شد.` })
            }
            setModalState({ ...modalState, show: false })
            setSelectedItems({});
            setApiInProgress(false);
            return;
        }

        const item = modalState.item;
        axios.get(modalState.url, { params: { __j: true } }).then(({ data }) => {
            SucccessToast({ message: data.Text });
            setApiInProgress(false);

            setRemoveIds([...removeIds, item.request_id._id]);

        }).catch((e) => {
            ErrorToast({ message: e.response.data.Text || e.message })
            setApiInProgress(false)
        })
        setModalState({ ...modalState, show: false })

    }

    const handleItemCheckChange = (e, item) => {
        const clone = { ...selectedItems };
        if (e.target.checked) {
            clone[item._id] = item;
        } else {
            delete clone[item._id];
        }
        setSelectedItems(clone);
    }

    return <div>
        <LoadingContainer>
            <LoadingOverlay visible={apiInProgress} />
            <MyModal
                onSave={confirmClick}
                show={modalState.show}
                saveBtnClassname={modalState.is_reject ? "bg-danger border-0" : ""}
                onHide={() => {
                    setModalState({ ...modalState, show: false })
                }}
                saveButtonTitle={modalState.title}
                title="اطمینان دارید؟"
                body={
                    <p>
                        {Object.keys(selectedItems).length > 0 &&
                            <Text className="text-danger">
                                {`تعداد (${Object.keys(selectedItems).length}) درخواست انتخاب شده است`}
                            </Text>
                        }
                        <span>{"آیا نسبت به اجرای این دستور اطمینان دارید؟"}</span>
                    </p>
                }
            />
            <div>{
                data?.data?.docs?.map((item) => {
                    const lock = removeIds.includes(item.request_id._id);
                    return <Card
                        style={lock ? { opacity: 0.5 } : {}}
                        key={item.request_id._id} className="p-3 shadow my-3">
                        {item.request_id.status === 0 &&
                            <Checkbox
                                disabled={lock}
                                onChange={(e) => handleItemCheckChange(e, item)}
                                checked={selectedItems[item._id] != null}
                            />
                        }
                        <Text style={{ whiteSpace: 'pre-wrap', lineHeight: 2 }} size="sm">{item.message}</Text>
                        {(item.request_id.status == 0 && item.need_approval) ?
                            <div className="d-flex mx-2">
                                <Button disabled={lock} onClick={() => handle_Request(item, item.urlTrue, "بله! درخواست را تایید کن", false)} className="flex-1 mx-1">{"تایید درخواست"}</Button>
                                <Button disabled={lock} onClick={() => handle_Request(item, item.urlFalse, "بله! درخواست را رد کن", true)} className={`flex-1 mx-1 ${lock ? "" : "bg-danger"}`}>{"رد درخواست"}</Button>
                            </div> :
                            <Text className="text-info">{RenderRequestStatus(item.request_id)}</Text>
                        }
                    </Card>
                })
            }</div>
        </LoadingContainer >

    </div >
}