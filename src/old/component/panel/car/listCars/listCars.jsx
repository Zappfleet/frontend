import List from "../../../../components/common/list";
import CarsFilterModal from "../../../../components/cars/carsFilterModal";
import { useState } from "react";
import settings from "../../../../config";
import { convertCarNameCode, convertCarPlaque } from "../../../../utils/carHelper";
import CreateCar from "../createCar";
import EditModal from "../../../../components/area/editModal";
import { TrashX } from "tabler-icons-react";
import { ErrorToast, SucccessToast } from "../../../../components/common/errorToast";
import httpService from "../../../../services/httpService";
import MyModal from "../../../../components/common/modal";
const ListCars = () => {
  const [sortColumn, setSortColumn] = useState({ path: "driver", order: "asc" });
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(false);
  const [carId, setCarId] = useState("");
  const [showModal, setShowModal] = useState({
    delete:false,
    edit:false
  });
  const [mutateSignal , setMutateSignal] = useState(1);
  const columns = [
    {
      content: (item) => item?.driver?.user?.full_name, label: "راننده",
      path: "driver.user.full_name"
    },
    {
      content: (item) => convertCarPlaque(item?.plaque), label: "پلاک خودرو",
      // path: "plaque"
    },
    {
      content: (item) => convertCarNameCode(item?.name_code),
      label: "نوع خودرو",
      path: "name_code"
    },
    {
      path: "total_distance", label: "مجموع مسافت پیموده شده",
    },
    {
      content: item => item?.status ? 'در سفر' : 'آزاد', label: "وضعیت",
      path: "status"
    },
  ];

  const onSort = (sortColumn) => { 
    setSortColumn(sortColumn)
  };
  const getSingleCar = async (carId) => {
    setCarId(carId)
    try {
      const { data } = await httpService.get(`${settings.apiUrl}/car/${carId}`);
      setCar(data?.doc);
    } catch (error) {
      ErrorToast({ message: "خطا در دریافت جزییات" });
    }
  };
  const handleRowClick =async (id) => { 
    setLoading(true);
    await getSingleCar(id);
    setShowModal({edit:true})
    setLoading(false);
  };
  const handleDeleteModal=async()=>{
    try {
      setLoading(true);
      await httpService.delete(`${settings.apiUrl}/car/${carId}`);
      setLoading(false);
      SucccessToast({
      message:"خودرو با موفقیت حذف شد",
      });
      setMutateSignal(mutateSignal+1);
    
    } catch (e) {
      ErrorToast({message:e?.response?.data?.info || e?.message});
      setLoading(false);
    }
      setShowModal({})
  }


  return (
    <>
      <List
      url="/car-with-paginate?group[]=0"
      filterModal={<CarsFilterModal />}
      onRowClick={handleRowClick}
      columns={columns}
      onSort={onSort}
      sortColumn={sortColumn}
      mutateSignal={mutateSignal}
      placeholder="جستجوی نام راننده"

      />
      <EditModal
	  	showEditModal={showModal.edit}
	  	setShowEditModal={setShowModal}
      title="ویرایش خودرو"
      size="lg"
	    >
    <div className="d-flex flex-column justify-content-end align-items-end p-2">
      <div style={{cursor:"pointer"}}>
      <TrashX
        size={26}
        strokeWidth={2}
        color={"red"}
        className="mx-2"
        onClick={() => setShowModal({...showModal,delete:true})}
      />
      </div>
  
    <CreateCar car={car} updateList={()=>{
         setShowModal({})
         setMutateSignal(mutateSignal+1)}
        }/>
    </div>
    </EditModal>
    <MyModal 
        onSave={handleDeleteModal} 
        show={showModal.delete}
        onHide={()=>setShowModal({...showModal,delete:false})} saveButtonTitle="تایید" title="حذف خودرو"
        body={
          <p>
          آیا از حذف خودرو اطمینان دارید؟
          </p>
        }
    />
    </>
  );
};

export default ListCars;
