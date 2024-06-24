import { Table, Pagination, Card, Modal, Text } from '@mantine/core';
import { useEffect, useState } from 'react';


import Button from "react-bootstrap/Button";
import { SucccessToast } from '../../../components/common/errorToast';
import Loading from '../../../components/common/loading';
import LoadingView from '../../../components/common/widgets/loadingView';
import { SureCancelRequestModal } from '../../../components/request/requestDetailsBox';
import config from '../../../config';
import httpService from '../../../services/httpService';


export default function DataTable(props) {
    const {
        headers, renderRow, api, hideActions,
        RenderModalCreate,
        RenderModalUpdate } = props;

    const {
        urlLoad,
        deleteEntity,
    } = api;

    const [result, setResult] = useState(null);

    const [modal, setModal] = useState({});

    const [query, setQuery] = useState({
        page: 1
    });

    async function loadData(query) {
        try {
            const res = await httpService.get(withQuery(config.apiUrl + urlLoad, query));
            setResult(res.data);
        } catch (e) {
            setResult({});
        }

    }

    const onPageChange = (page) => {
        setQuery({ ...query, page: page })
    }

    useEffect(() => {
        loadData(query);
    }, [query.page]);

    const openCreateModal = () => {
        setModal({ create: {} })
    }

    const onEntitySubmitSuccess = () => {
        SucccessToast({ message: "با موفقیت ثبت شد" });
        setModal({})
        loadData(query);
    }

    const onConfirmDelete = async () => {
        const entityToDelete = modal.delete;
        console.log({ entityToDelete });
        setModal({});
        const success = await deleteEntity(entityToDelete);
        if (success) {
            SucccessToast({ message: "سطر با موفقیت حذف شد" });
            loadData(query);
        }
    }

    const renderActions = (doc) => {
        if (hideActions) return;
        return <>
            <td>
                <Button className='m-2' variant="primary" onClick={() => { setModal({ update: doc }) }}>
                    ویرایش
                </Button>
                <Button className='m-2' variant="danger" onClick={() => { setModal({ delete: doc }) }}>
                    حذف
                </Button>
            </td>
        </>
    }

    return (
        <div>

            <Button className='m-2' variant="primary" onClick={openCreateModal}>
                افزودن
            </Button>

            <ModalDelete opened={modal.delete != null} onClose={() => setModal({})} onConfirm={onConfirmDelete} />

            {modal.create && <RenderModalCreate onEntitySubmitSuccess={onEntitySubmitSuccess} onClose={() => setModal({})} />}
            {modal.update && <RenderModalUpdate entity={modal.update} onEntitySubmitSuccess={onEntitySubmitSuccess} onClose={() => setModal({})} />}

            <Card>
                {result == null && <LoadingView loading={true} message=" " />}

                {result?.docs && <Table>
                    <thead>
                        <tr>
                            {headers.map((item, index) => {
                                return <th key={index}>{item}</th>
                            })}
                            {!hideActions && <th></th>}
                        </tr>
                    </thead>
                    <tbody>
                        {result?.docs.map((doc) => {
                            return <tr key={doc._id}>
                                {renderRow(doc)}
                                {renderActions(doc)}
                            </tr>
                        })}
                    </tbody>
                </Table>}
                <div className='d-flex justify-content-center mt-2'>
                    {result?.totalPages && <Pagination total={result.totalPages} onChange={onPageChange} />}
                </div>

            </Card>
        </div>
    );
}

function withQuery(url, query) {
    const q = [];
    const keys = Object.keys(query);
    for (let i = 0; i < keys.length; i++) {
        q.push(`${keys[i]}=${query[keys[i]]}`)
    }

    return `${url}?${q.join("&")}`;
}


function ModalDelete({ opened, onClose, onConfirm }) {
    return <Modal
        opened={opened}
        size="md"
        onClose={onClose}
        title="حذف سطر"
    >
        <Text>
            از حذف سطر جدول اطمینان دارید؟
        </Text>
        <div>
            <Button className='m-2' variant="primary" onClick={onConfirm}>
                بله سطر رو حذف کن!
            </Button>
            <Button className='m-2' variant="danger" onClick={onClose} >
                خیر
            </Button>
        </div>
    </Modal >
}

export function SampleTable() {
    return <DataTable
        api={{
            urlLoad: "/request/me",
            deleteEntity,
        }}
        hideActions={false}
        renderRow={renderRowExample}
        headers={["نام و نام خانوادگی", "تلفن", "تاریخ سفر"]}
        RenderModalCreate={ModalSubmit}
        RenderModalUpdate={ModalSubmit}
    />
}

function ModalSubmit({ entity, onClose, onEntitySubmitSuccess }) {

    const handleEntityUpdate = () => {
        //TODO handle api here
        //if entity is not null it is an update modal
        onEntitySubmitSuccess();
    }

    return <Modal
        opened={true}
        size="md"
        onClose={onClose}
        title={entity == null ? "create" : "update"}
    >
        <Text>
            {"Form inputs go here"}
        </Text>

        <Button className='m-2' variant="primary" onClick={handleEntityUpdate}>
            ثبت کن!
        </Button>

    </Modal >
}

async function deleteEntity(entity) {
    // now use delete api of entity entity
    //If delete was a success return true.
    //If an error occured you should display the cause in here and return false
    const deleteWasASuccess = true;
    return deleteWasASuccess;
}

function renderRowExample(doc) {
    return <>
        <td>{doc.passenger.full_name}</td>
        <td>{doc.passenger.phone_num}</td>
        <td>{doc.for_date}</td>
    </>
}