import List from "../../../../components/common/list";
import { useState } from "react";
import AreaDetailsModal from "../../../../components/area/areaDetailsModal";
import LocationFilterModal from "../../../../components/location/locationFilterModal";
import { CircleCheck, CircleX } from "tabler-icons-react";
import httpService from "../../../../services/httpService";
import settings from "../../../../config";
import { ErrorToast, SucccessToast } from "../../../../components/common/errorToast";
import EditModal from "../../../../components/area/editModal";
import MyModal from "../../../../components/common/modal";
import CreateArea from "../createArea";

const ListAreas = () => {
  const [sortColumn, setSortColumn] = useState({ path: "name", order: "asc" });
  const [loading, setLoading] = useState(false);
  const [item, setItem] = useState();
  const [detailsModal, setDetailsModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [mutateSignal , setMutateSignal] = useState(1);
  const [id, setId] = useState("");
  
  const columns = [
    {
      path: "name",
      label: "نام",
    },
    { content: (item) => item?.dispatcher[0]?.full_name, label: "توزیع کننده", path: "dispatcher.full_name" },
    {
      content: (item) =>
        item?.need_manager_approve ? (
          <CircleCheck color="green" size={32} />
        ) : (
          <CircleX size={32} color="red" />
        ),
      path: "need_manager_approve",
      label: "عدم نیاز به تایید مدیر پروژه",
    },
  ];

  const onSort = (sortColumn) => {
    setSortColumn(sortColumn);
  };

  const getSingleItem = async (id) => {
    setId(id)
    try {
      const { data } = await httpService.get(settings.apiUrl + "/area/" + id);
      setItem(data?.doc);
    } catch (error) {
      ErrorToast({ message: "خطا در دریافت جزییات" });
    }
  };

  const handleRowClick = async (id) => {
    setLoading(true);
    await getSingleItem(id);
    setDetailsModal(true);
    setLoading(false);
  };
const handleDeleteModal=async()=>{
  try {
    setLoading(true);
    await httpService.delete(`${settings.apiUrl}/area/${id}`);
    setLoading(false);
    SucccessToast({
    message:"محدوده با موفقیت حذف شد",
    });
    setDetailsModal(false);
    setMutateSignal(mutateSignal+1);
  
  } catch (error) {
    ErrorToast({ message: "خطا در حذف محدوده" });
    setLoading(false);
  }
    setShowDeleteModal(false)

}
  return (
    <>
      <List
        url="/area"
        filterModal={<LocationFilterModal />}
        onSort={onSort}
        loading={loading}
        columns={columns}
        sortColumn={sortColumn}
        onRowClick={handleRowClick}
        mutateSignal={mutateSignal}
        width={900}
        hideFilter={true}
        placeholder="جستجوی نام محدوده"

     
       
      />
      <AreaDetailsModal
        item={item}
        opened={detailsModal}
        setOpened={setDetailsModal}
		    setShowEditModal={setShowEditModal}
        setShowDeleteModal={setShowDeleteModal}
       
      />
	    <EditModal
	  	showEditModal={showEditModal}
	  	setShowEditModal={setShowEditModal}
      title="ویرایش محدوده"
      size="60%"
	    >
    	  <CreateArea item={item} updateList={()=>{
         setShowEditModal(false)
         setMutateSignal(mutateSignal+1)}
        }/>
      </EditModal>
      <MyModal 
        onSave={handleDeleteModal} 
        show={showDeleteModal}
        onHide={()=>setShowDeleteModal(false)} saveButtonTitle="تایید" title="حذف محدوده"
        body={
          <p>
          آیا از حذف محدوده اطمینان دارید؟
          </p>
        }
      />
       
    
    </>
  );
};

export default ListAreas;
