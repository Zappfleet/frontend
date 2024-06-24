import { useState } from "react";
import { Avatar } from "@mantine/core";
import settings from "../../../config";
import { renderStringRole, roleList } from "../../../utils/userHelper";
import UsersfilterModal from "../../../components/user/usersfilterModal";
import List from "../../../components/common/list";
import MyModal from "../../../components/common/modal";
import { ErrorToast, SucccessToast } from "../../../components/common/errorToast";
import httpService from "../../../services/httpService";
import EditModal from "../../../components/area/editModal";
import CreateUser from "./createUser";
import { TrashX } from "tabler-icons-react";
const ListUsers = () => {

  const [sortColumn, setSortColumn] = useState({path : "full_name" , order : "asc"});
  const [showModal, setShowModal] = useState({
    delete:false,
    edit:false
  });
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [userId, setUserId] = useState("");
  const [mutateSignal , setMutateSignal] = useState(1);

  const columns = [
    {
      path: "avatar",
      content: (columns) => <Avatar src={settings.apiUrl + columns?.avatar} />,
    },
    { path: "full_name", label: "نام" },
    { path: "emp_num", label: "کد پرسنلی" },
    {
      label: "نقش",
      path: "role",
      content: (item) => {
        let append = "";
        if (item?.role != 0){
          console.log({item});
          if (item?.is_passenger){
            append = " (مسافر) "
          }
        }
        return renderStringRole(item?.role) + append;
      },
    },
  ];

  const onSort = (sortColumn) => { 
    setSortColumn(sortColumn)
  };
  const getSingleUser = async (userId) => {
    setUserId(userId)
    try {
      const { data } = await httpService.get(`${settings.apiUrl}/user/${userId}`);
      setUser(data?.doc);
    } catch (error) {
      ErrorToast({ message: "خطا در دریافت جزییات" });
    }
  };


  const handleRowClick = async (id) => {
    setLoading(true);
    await getSingleUser(id);
    setShowModal({edit:true})
    setLoading(false);
  };

  const handleDeleteModal=async()=>{
    try {
      setLoading(true);
      await httpService.delete(`${settings.apiUrl}/user/${userId}`);
      setLoading(false);
      SucccessToast({
      message:"کاربر با موفقیت حذف شد",
      });
      setMutateSignal(mutateSignal+1);
    
    } catch (e) {
      ErrorToast({message:e?.response?.data?.info || e?.message})
      setLoading(false);
    }
      setShowModal({})
  }

  return (
  <>
    <List
      url="/user"
      filterModal={<UsersfilterModal />}
      onRowClick={handleRowClick}
      columns={columns}
      onSort={onSort}
      loading={loading}
      sortColumn={sortColumn}
      mutateSignal={mutateSignal}
      width={900}

    />
    <MyModal 
        onSave={handleDeleteModal} 
        show={showModal.delete}
        onHide={()=>setShowModal({...showModal,delete:false})} saveButtonTitle="تایید" title="حذف کاربر"
        body={
          <p>
          آیا از حذف کاربر اطمینان دارید؟
          </p>
        }
    />
    <EditModal
	  	showEditModal={showModal.edit}
	  	setShowEditModal={setShowModal}
      title="ویرایش کاربر"
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
  
    <CreateUser user={user} updateList={()=>{
         setShowModal({})
         setMutateSignal(mutateSignal+1)}
        }/>
    </div>
    </EditModal>
  </>
  );
};
export default ListUsers;
