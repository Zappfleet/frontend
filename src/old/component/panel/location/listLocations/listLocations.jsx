import List from "../../../../components/common/list";
import CarsFilterModal from "../../../../components/cars/carsFilterModal";
import { useState } from "react";
import LocationFilterModal from "../../../../components/location/locationFilterModal";
import { Button, Modal, Text } from "@mantine/core";
import { deleteSystemLocation } from "../../../../services/locationService";
import { ErrorToast, SucccessToast } from "../../../../components/common/errorToast";
import LoadingContainer from "../../../../components/hoc/loadingContainer";

const ListLocations = () => {
  const [sortColumn, setSortColumn] = useState({ path: "name", order: "asc" });
  const [deleteModal, setDeleteModal] = useState({ show: false, item: null, loading: false });
  const [mutateSignal, setMutateSignal] = useState(1);

  const handleDelete = (item) => {
    setDeleteModal({
      show: true,
      loading: false,
      item
    })
  }

  const hideDeleteModal = () => {
    setDeleteModal({
      show: false,
      loading: false,
      item: deleteModal.item
    })
  }

  const columns = [
    {
      path: "name",
      label: "نام",
    },
    { path: "street", label: "آدرس" },
    {
      label: "عملیات", content: (item) => {
        return <Button onClick={() => handleDelete(item)} color={"red"} variant={"outline"} size="xs">{"حذف"}</Button>
      }
    }
  ];


  const onSort = (sortColumn) => {
    setSortColumn(sortColumn);
  };

  const confirmDeleteModal = () => {
    setDeleteModal({ ...deleteModal, loading: true });
    deleteSystemLocation(deleteModal.item?._id).then((res) => {
      hideDeleteModal();
      SucccessToast({ message: "مکان با موفقیت حذف گردید" });
      setMutateSignal(mutateSignal + 1);
    }).catch((e) => {
      hideDeleteModal();
      ErrorToast({ message: e.response.data.info || e.message })
    });
  }

  return (
    <>
      <List
        url="/location"
        filterModal={<LocationFilterModal />}
        onRowClick={() => { }}
        columns={columns}
        onSort={onSort}
        sortColumn={sortColumn}
        hideFilter={true}
        placeholder="جستجو ..."
        mutateSignal={mutateSignal}
      />
      <Modal title={"حذف مکان منتخب"} opened={deleteModal.show} onClose={hideDeleteModal}>
        <LoadingContainer loading={deleteModal.loading}>
          <Text>{`آیا از حذف مکان منتخب «${deleteModal.item?.name}» به آدرس «${deleteModal.item?.street}» اطمینان دارید؟`}</Text>
          <div>
            <Button variant="outline" className="mt-3 m-1" onClick={hideDeleteModal}>{"خیر"}</Button>
            <Button color={"red"} className="mt-3 m-1" onClick={confirmDeleteModal}>{"بله این مکان را حذف کن"}</Button>
          </div>
        </LoadingContainer>
      </Modal>
    </>
  );
};

export default ListLocations;
